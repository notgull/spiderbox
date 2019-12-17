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
export declare type SyncCallback = () => void;
export declare type CBCallback = (done: SyncCallback) => void;
export declare type AsyncCallback = () => Promise<void>;
export declare type ItCallback = SyncCallback | CBCallback | AsyncCallback;
export declare class DescribeBlock {
    name: string;
    indentation: number;
    before: CBCallback;
    beforeEach: CBCallback;
    after: CBCallback;
    afterEach: CBCallback;
    numPassing: number;
    numFailing: number;
    numPending: number;
    tests: Array<ItBlock>;
    describes: Array<DescribeBlock>;
    private ident;
    parent: DescribeBlock | null;
    constructor(name: string, indentation: number);
    log(msg: string): void;
    execute(done: SyncCallback): void;
}
export declare const globalDescribe: DescribeBlock;
export declare function describe(name: string, cb: SyncCallback): void;
export declare class ItBlock {
    test: CBCallback;
    _skip: boolean;
    timeout: number;
    name: string;
    parent: DescribeBlock | null;
    constructor(name: string, test: ItCallback, timeout?: number);
    static skipped(name: string): ItBlock;
    skip(): void;
}
export declare function it(name: string, cb: ItCallback): void;
export declare function run(done?: SyncCallback): void;
