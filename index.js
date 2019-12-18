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
 */!function(e){if("object"===("undefined"==typeof module?"undefined":_typeof(module))&&"object"===_typeof(module.exports)){var n=e(require,exports);n!==undefined&&(module.exports=n)}else"function"==typeof define&&define.amd&&define(["require","exports"],e)}((function(e,n){n.__esModule=!0;var t=function(e){e()},i={executing:!1,parent:null};function o(e){var n,t=Function.prototype.toString.call(e);return t.substring(t.indexOf("(")+1,t.indexOf(")")).length>0?e:"AsyncFunction"===e[Symbol.toStringTag]?(n=e,function(e){n().then((function(){e()}))}):function(e){return function(n){e(),n()}}(e)}function r(e,n,t){!function i(o){o>=n.length?t():n[o].call(e,(function(){i(o+1)}))}(0)}var u=function(){function e(e,n){this.name=e,this.indentation=n,this.before=t,this.beforeEach=t,this.after=t,this.afterEach=t,this.numPassing=0,this.numFailing=0,this.numPending=0,this.tests=[],this.describes=[],this.parent=null,this.ident="";for(var i=0;i<n;i++)this.ident+="  "}return e.prototype.log=function(e){console.log(""+this.ident+e)},e.prototype.execute=function(n){var t=this;if(!i.executing)throw new Error("Not in execution state");"__global"!==this.name&&this.log(this.name);var o=function(n){return function(i){t.beforeEach((function(){e.prototype.execute.call(n,(function(){t.afterEach(i)}))}))}},u=function(e){return function(n){t.beforeEach((function(){var i;new Date;try{i=setTimeout((function(){throw new Error("Timeout of "+e.timeout+" reached")}),e.timeout),e.test.call(e,(function(){clearTimeout(i),t.numPassing++,t.log("  ✓ "+e.name),t.afterEach(n)}))}catch(o){clearTimeout(i),t.numFailing++,t.log("  ✗ "+e.name),t.afterEach(n)}}))}},c=function(e){return function(n){t.numPending++,t.log("  - "+e.name),n()}};this.before((function(){for(var e=[],i=0;i<t.describes.length;i++)e.push(o.call(t,t.describes[i]));var s=[];for(i=0;i<t.tests.length;i++)t.tests[i]._skip?s.push(c.call(t,t.tests[i])):s.push(u.call(t,t.tests[i]));r(t,e,(function(){r(t,s,(function(){t.after((function(){"__global"!==t.name&&(t.parent.numPassing+=t.numPassing,t.parent.numFailing+=t.numFailing,t.parent.numPending+=t.numPending),n()}))}))}))}))},e}();n.globalDescribe=new u("__global",-1),i.parent=n.globalDescribe,n.describe=function(e,n){if(i.executing)throw new Error("Cannot define new describe blocks while executing");n||(n=e,e="");var t=i.parent,o=new u(e,t.indentation+1);o.parent=t,i.parent=o,n.call(o),i.parent=t,t.describes.push(o)};var c=function(){function e(e,n,t){void 0===t&&(t=1e4),this.name=e,this.test=o(n),this._skip=!1,this.timeout=t,this.parent=null}return e.skipped=function(n){var i=new e(n,t,0);return i._skip=!0,i},e.prototype.skip=function(){this._skip=!0},e}();function s(e){return function(n){if(i.executing)throw new Error("Cannot define "+e+" blocks while executing");i.parent[e]=o(n)}}n.it=function(e,n){if(i.executing)throw new Error("Cannot define new it blocks while executing");var t,o=i.parent;(t=n?new c(e,n):c.skipped(e)).parent=o,o.tests.push(t)},n.beforeEach=s("beforeEach"),n.afterEach=s("afterEach"),n.before=s("before"),n.after=s("after"),n.run=function(e){void 0===e&&(e=function(){}),i.executing=!0,n.globalDescribe.execute((function(){console.log(""),console.log(n.globalDescribe.numPassing+" passing"),console.log(n.globalDescribe.numFailing+" failing"),console.log(n.globalDescribe.numPending+" pending"),e()}))},n.reset=function(){n.globalDescribe.describes=[],n.globalDescribe.tests=[],n.globalDescribe.numPassing=0,n.globalDescribe.numFailing=0,n.globalDescribe.numPending=0,i.executing=!1,i.parent=n.globalDescribe}}));
