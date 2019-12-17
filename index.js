/*!
 * index.ts
 * Spiderbox - Browser-based testing
 *
 * Copyright (c) 2019, not_a_seagull
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * 3. Neither the name of the copyright holder nor the names of its
 *    contributors may be used to endorse or promote products derived from
 *    this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    exports.__esModule = true;
    var defaultCallback = function (done) { done(); };
    var globalState = {
        executing: false,
        parent: null
    };
    function convertCallback(cb) {
        var funcString = Function.prototype.toString.call(cb);
        var arg = funcString.substring(funcString.indexOf("(") + 1, funcString.indexOf(")"));
        if (arg.length > 0) {
            return cb;
        }
        if (cb[Symbol.toStringTag] === "AsyncFunction") {
            return (function (inner) {
                return function (done) {
                    inner().then(function () { done(); });
                };
            })(cb);
        }
        return (function (inner) {
            return function (done) {
                inner();
                done();
            };
        })(cb);
    }
    function runCallbackFunctions(callOn, funcs, done) {
        var cb = function (index) {
            if (index >= funcs.length) {
                done();
                return;
            }
            var func = funcs[index];
            func.call(callOn, function () {
                cb(index + 1);
            });
        };
        cb(0);
    }
    var DescribeBlock = (function () {
        function DescribeBlock(name, indentation) {
            this.name = name;
            this.indentation = indentation;
            this.before = defaultCallback;
            this.beforeEach = defaultCallback;
            this.after = defaultCallback;
            this.afterEach = defaultCallback;
            this.numPassing = 0;
            this.numFailing = 0;
            this.numPending = 0;
            this.tests = [];
            this.describes = [];
            this.parent = null;
            this.ident = "";
            for (var i = 0; i < indentation; i++) {
                this.ident += "  ";
            }
        }
        DescribeBlock.prototype.log = function (msg) {
            console.log("" + this.ident + msg);
        };
        DescribeBlock.prototype.execute = function (done) {
            var _this = this;
            if (!globalState.executing) {
                throw new Error("Not in execution state");
            }
            if (this.name !== "__global") {
                this.log(this.name);
            }
            var perDescribe = function (desc) {
                return function (done) {
                    _this.beforeEach(function () {
                        DescribeBlock.prototype.execute.call(desc, function () {
                            _this.afterEach(done);
                        });
                    });
                };
            };
            var perTest = function (test) {
                return function (done) {
                    _this.beforeEach(function () {
                        var begin = new Date();
                        var timeout;
                        try {
                            timeout = setTimeout(function () { throw new Error("Timeout of " + test.timeout + " reached"); }, test.timeout);
                            test.test.call(test, function () {
                                clearTimeout(timeout);
                                _this.numPassing++;
                                _this.log("  \u2713 " + test.name);
                                _this.afterEach(done);
                            });
                        }
                        catch (err) {
                            clearTimeout(timeout);
                            _this.numFailing++;
                            _this.log("  \u2717 " + test.name);
                            _this.afterEach(done);
                        }
                    });
                };
            };
            var pendingTest = function (test) {
                return function (done) {
                    _this.numPending++;
                    _this.log("  - " + test.name);
                    done();
                };
            };
            this.before(function () {
                var descFuncs = [];
                for (var i = 0; i < _this.describes.length; i++) {
                    descFuncs.push(perDescribe.call(_this, _this.describes[i]));
                }
                var testFuncs = [];
                for (var i = 0; i < _this.tests.length; i++) {
                    if (_this.tests[i]._skip) {
                        testFuncs.push(pendingTest.call(_this, _this.tests[i]));
                    }
                    else {
                        testFuncs.push(perTest.call(_this, _this.tests[i]));
                    }
                }
                runCallbackFunctions(_this, descFuncs, function () {
                    runCallbackFunctions(_this, testFuncs, function () {
                        _this.after(done);
                    });
                });
            });
        };
        return DescribeBlock;
    }());
    exports.DescribeBlock = DescribeBlock;
    exports.globalDescribe = new DescribeBlock("__global", -1);
    globalState.parent = exports.globalDescribe;
    function describe(name, cb) {
        if (globalState.executing) {
            throw new Error("Cannot define new describe blocks while executing");
        }
        var parentBlock = globalState.parent;
        var describeBlock = new DescribeBlock(name, parentBlock.indentation + 1);
        describeBlock.parent = parentBlock;
        globalState.parent = describeBlock;
        cb.call(describeBlock);
        globalState.parent = parentBlock;
        parentBlock.describes.push(describeBlock);
    }
    exports.describe = describe;
    var ItBlock = (function () {
        function ItBlock(name, test, timeout) {
            if (timeout === void 0) { timeout = 10000; }
            this.name = name;
            this.test = convertCallback(test);
            this._skip = false;
            this.timeout = timeout;
            this.parent = null;
        }
        ItBlock.skipped = function (name) {
            var itBlock = new ItBlock(name, defaultCallback, 0);
            itBlock._skip = true;
            return itBlock;
        };
        ItBlock.prototype.skip = function () {
            this._skip = true;
        };
        return ItBlock;
    }());
    exports.ItBlock = ItBlock;
    function it(name, cb) {
        if (globalState.executing) {
            throw new Error("Cannot define new it blocks while executing");
        }
        var parentBlock = globalState.parent;
        var itBlock;
        if (cb) {
            itBlock = new ItBlock(name, cb);
        }
        else {
            itBlock = ItBlock.skipped(name);
        }
        itBlock.parent = parentBlock;
        parentBlock.tests.push(itBlock);
    }
    exports.it = it;
    function run(done) {
        if (done === void 0) { done = function () { }; }
        globalState.executing = true;
        exports.globalDescribe.execute(done);
    }
    exports.run = run;
});
