"use strict";

/*
 * core.js
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

const spiderbox = require("./../index");

const sbDescribe = spiderbox.describe;
const sbIt = spiderbox.it;
const sbRun = spiderbox.run;

const { expect } = require("chai");
const sinon = require("sinon");

function clean() {
  spiderbox.globalDescribe.tests = [];
  spiderbox.globalDescribe.describes = [];
}

// clean up the tree after all executions
afterEach(clean);

describe("Testing setup tree", () => {
  beforeEach(() => {
    sbDescribe("Test root", () => {
      sbIt("Test 1", () => { });
      sbIt("Test 2", () => { });
    });
  });

  it("should have a describe block at root", () => {
    expect(spiderbox.globalDescribe.describes).to.have.lengthOf(1);
    expect(spiderbox.globalDescribe.describes[0]).to.have.property("name", "Test root");
  });

  it("should have two test blocks", () => {
    expect(spiderbox.globalDescribe.describes[0].tests).to.have.lengthOf(2); 
  });

  it("should have the first test block", () => {
    expect(spiderbox.globalDescribe.describes[0].tests[0]).to.have.property("name", "Test 1");
  });

  it("should have the second test block", () => {
    expect(spiderbox.globalDescribe.describes[0].tests[1]).to.have.property("name", "Test 2");
  });
});

describe("Testing execution", () => {
  let call1, call2, call3;

  before(() => {
    call1 = sinon.fake();
    call2 = sinon.fake();
    call3 = sinon.fake();
  });

  it("should actually execute the calls", (done) => {
    sbDescribe("Testing01", () => {
      sbIt("Call01", () => call1());
      sbIt("Call02", () => call2());
      sbIt("Call03", () => call3());
    });

    sbRun(done);
  });

  it("should have called each of the fakes", () => {
    expect(call1.called).to.equal(true);
    expect(call2.called).to.equal(true);
    expect(call3.called).to.equal(true);
  });
});
