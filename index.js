"use strict";function _typeof(e){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}
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
 */!function(e){if("object"===("undefined"==typeof module?"undefined":_typeof(module))&&"object"===_typeof(module.exports)){var t=e(require,exports);t!==undefined&&(module.exports=t)}else"function"==typeof define&&define.amd&&define(["require","exports"],e)}((function(e,t){t.__esModule=!0;var n=function(e){e()},i={executing:!1,parent:null};function o(e){var t,n=Function.prototype.toString.call(e);return n.substring(n.indexOf("(")+1,n.indexOf(")")).length>0?e:"AsyncFunction"===e[Symbol.toStringTag]?(t=e,function(e){t().then((function(){e()}))}):function(e){return function(t){e(),t()}}(e)}function r(e,t,n){!function i(o){o>=t.length?n():t[o].call(e,(function(){i(o+1)}))}(0)}var u=function(){function e(e,t){this.name=e,this.indentation=t,this.before=n,this.beforeEach=n,this.after=n,this.afterEach=n,this.numPassing=0,this.numFailing=0,this.numPending=0,this.tests=[],this.describes=[],this.parent=null,this.ident="";for(var i=0;i<t;i++)this.ident+="  "}return e.prototype.log=function(e){console.log(""+this.ident+e)},e.prototype.execute=function(t){var n=this;if(!i.executing)throw new Error("Not in execution state");"__global"!==this.name&&this.log(this.name);var o=function(t){return function(i){n.beforeEach((function(){e.prototype.execute.call(t,(function(){n.afterEach(i)}))}))}},u=function(e){return function(t){n.beforeEach((function(){var i;new Date;try{i=setTimeout((function(){throw new Error("Timeout of "+e.timeout+" reached")}),e.timeout),e.test.call(e,(function(){clearTimeout(i),n.numPassing++,n.log("  ✓ "+e.name),n.afterEach(t)}))}catch(o){clearTimeout(i),n.numFailing++,n.log("  ✗ "+e.name),n.afterEach(t)}}))}},c=function(e){return function(t){n.numPending++,n.log("  - "+e.name),t()}};this.before((function(){for(var e=[],i=0;i<n.describes.length;i++)e.push(o.call(n,n.describes[i]));var f=[];for(i=0;i<n.tests.length;i++)n.tests[i]._skip?f.push(c.call(n,n.tests[i])):f.push(u.call(n,n.tests[i]));r(n,e,(function(){r(n,f,(function(){n.after(t)}))}))}))},e}();t.globalDescribe=new u("__global",-1),i.parent=t.globalDescribe,t.describe=function(e,t){if(i.executing)throw new Error("Cannot define new describe blocks while executing");var n=i.parent,o=new u(e,n.indentation+1);o.parent=n,i.parent=o,t.call(o),i.parent=n,n.describes.push(o)};var c=function(){function e(e,t,n){void 0===n&&(n=1e4),this.name=e,this.test=o(t),this._skip=!1,this.timeout=n,this.parent=null}return e.skipped=function(t){var i=new e(t,n,0);return i._skip=!0,i},e.prototype.skip=function(){this._skip=!0},e}();t.it=function(e,t){if(i.executing)throw new Error("Cannot define new it blocks while executing");var n,o=i.parent;(n=t?new c(e,t):c.skipped(e)).parent=o,o.tests.push(n)},t.beforeEach=function(e){if(i.executing)throw new Error("Cannot define before each while executing");i.parent.beforeEach=o(e)},t.run=function(e){return void 0===e&&(e=function(){}),i.executing=!0,t.globalDescribe.execute(e),t.globalDescribe.numFailing>0?1:0}}));
