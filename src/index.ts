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

export type SyncCallback = () => void;
export type CBCallback = (done: SyncCallback) => void;
export type AsyncCallback = () => Promise<void>;
export type ItCallback = SyncCallback | CBCallback | AsyncCallback;

const defaultCallback = (done: SyncCallback) => { done(); };

// convert any callback into a callback-based one
function convertCallback(cb: ItCallback): CBCallback {
  // determine if there is a callback argument
  const funcString = Function.prototype.toString.call(cb);
  const arg = funcString.substring(funcString.indexOf("(") + 1, funcString.indexOf(")"));

  if (arg.length > 0) {
    return <CBCallback>cb;
  }

  // determine if it is async
  // @ts-ignore
  if (cb[Symbol.toStringTag] === "AsyncFunction") {
    return ((inner: AsyncCallback) => {
      return (done: SyncCallback) => {
        inner().then(() => { done(); });
      };
    })(<AsyncCallback>cb);
  }

  // it's probably sync
  return ((inner: SyncCallback) => {
    return (done: SyncCallback) => {
      inner();
      done();
    };
  })(<SyncCallback>cb);
}

// run a series of callback functions in order
function runCallbackFunctions(callOn: any, funcs: Array<CBCallback>, done: SyncCallback) {
  // done recursively
  const cb = (index: number) => {
    if (index >= funcs.length) {
      done();
      return;
    }

    const func = funcs[index];
    func.call(callOn, () => {
      cb(index + 1);
    });
  };

  cb(0);
}

// the block in which tests execute inside of
class DescribeBlock {
  before: CBCallback;
  beforeEach: CBCallback;
  after: CBCallback;
  afterEach: CBCallback;

  numPassing: number;
  numFailing: number;
  numPending: number;

  tests: Array<ItBlock>;
  describes: Array<DescribeBlock>;

  private ident: string;

  constructor(
    public name: string,
    public indentation: number
  ) {
    this.before = defaultCallback;
    this.beforeEach = defaultCallback;
    this.after = defaultCallback;
    this.afterEach = defaultCallback;

    this.numPassing = 0;
    this.numFailing = 0;
    this.numPending = 0;

    this.tests = [];
    this.describes = [];

    this.ident = "";
    for (let i = 0; i < indentation; i++) {
      this.ident += "  ";
    }
  }

  log(msg: string) {
    console.log(`${this.ident}${msg}`);
  }

  // execute tests
  execute(done: SyncCallback) {
    if (this.name !== "__global") {
      this.log(this.name);
    } 

    // per describe callback
    const perDescribe = (desc: DescribeBlock) => {
      return (done: SyncCallback) => {
        this.beforeEach(() => {
          DescribeBlock.prototype.execute.call(desc, () => {
            this.afterEach(done);
          });
        });
      }
    };  

    // per-test callback
    const perTest = (test: ItBlock) => {
      return (done: SyncCallback) => {
        // run before each hook
        this.beforeEach(() => {
          // for timing
          const begin = new Date();
          try {
            test.test.call(test, () => {
              // test succeeded
              this.numPassing++;
              this.log(`  ✓ ${test.name}`); 
              this.afterEach(done);
            }); 

            setTimeout(() => { throw new Error(`Timeout of ${test.timeout} reached`); }, test.timeout);
          } catch (err) {
            // test has failed
            this.numFailing++; 
            this.log(`  ✗ ${test.name}`);
            this.afterEach(done);
          }
        });
      };
    };

    // run before hook
    this.before(() => {
      // execute describes
      const descFuncs = [];
      for (let i = 0; i < this.describes.length; i++) {
        descFuncs.push(perDescribe.call(this, this.describes[i]));
      }
      
      const testFuncs: Array<CBCallback> = [];
      for (let i = 0; i < this.tests.length; i++) {
        if (this.tests[i]._skip) {
          // TODO: skip
        }
        testFuncs.push(perTest.call(this, this.tests[i]));
      } 

      runCallbackFunctions(this, descFuncs, () => {
        runCallbackFunctions(this, testFuncs, () => {
          this.after(done);
        });
      });
    });
  }
}

// global describe block - used as a scope when a Describe block is not defined
const globalDescribe = new DescribeBlock("__global", -1);

// get the current parent describe block
function getParentBlock(this: any) {
  let parentBlock = this;
  if (!(parentBlock instanceof DescribeBlock)) {
    parentBlock = globalDescribe;
  }
  return parentBlock;
}

export function describe(this: any, name: string, cb: SyncCallback) {
  // load the parent describe block
  let parentBlock = getParentBlock.call(this); 

  // create a new describe block
  const describeBlock = new DescribeBlock(name, parentBlock.indentation + 1);

  cb.call(describeBlock);

  parentBlock.describes.push(describeBlock);
}

// represents a singular It test block
class ItBlock {
  test: CBCallback;
  _skip: boolean;
  timeout: number;
  name: string;

  constructor(name: string, test: ItCallback, timeout: number = 10000) {
    this.name = name;
    this.test = convertCallback(test);
    this._skip = false;
    this.timeout = timeout;
  }

  static skipped(name: string): ItBlock {
    const itBlock = new ItBlock(name, defaultCallback, 0);
    itBlock._skip = true;
    return itBlock;
  } 

  skip() {
    this._skip = true;
  }
}
 
export function it(this: any, name: string, cb: ItCallback) {
  let parentBlock = getParentBlock.call(this);

  // create a new it block
  let itBlock;
  if (cb) {
    itBlock = new ItBlock(name, cb);
  } else {
    itBlock = ItBlock.skipped(name);
  }
}

// run the tests
export function run(done: SyncCallback = () => {}) {
  globalDescribe.execute(done);
}
