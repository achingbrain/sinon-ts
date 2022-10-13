# sinon-ts <!-- omit in toc -->

[![codecov](https://img.shields.io/codecov/c/github/achingbrain/sinon-ts.svg?style=flat-square)](https://codecov.io/gh/achingbrain/sinon-ts)
[![CI](https://img.shields.io/github/workflow/status/achingbrain/sinon-ts/test%20&%20maybe%20release/master?style=flat-square)](https://github.com/achingbrain/sinon-ts/actions/workflows/js-test-and-release.yml)

> sinon library extension to stub whole object and interfaces

## Table of contents <!-- omit in toc -->

- [Install](#install)
- [What is this](#what-is-this)
- [Prerequisites](#prerequisites)
- [Object stubs example](#object-stubs-example)
- [Interface stubs example](#interface-stubs-example)
- [Object constructor stub example](#object-constructor-stub-example)
- [Sinon methods](#sinon-methods)
- [Packages](#packages)
      - [Dependencies:](#dependencies)
      - [Dev Dependencies:](#dev-dependencies)
- [Tests](#tests)
- [License](#license)
- [Contribute](#contribute)

## Install

```console
$ npm i sinon-ts
```

## What is this

A fork of [ts-sinon](https://www.npmjs.com/package/ts-sinon) that lets you BYO sinon. Can probably be retired if [ttarnowski/ts-sinon#255](https://github.com/ttarnowski/ts-sinon/pull/255) is ever merged.

- stub all object methods
- stub interface
- stub object constructor

## Prerequisites

1. You have a version of Node.js >= [v8.4.0](https://nodejs.org/en/download/)
2. You have installed [Typescript](https://www.typescriptlang.org/index.html#download-links)

## Object stubs example

Importing stubObject function:

- import single function:

```javascript
import { stubObject } from "ts-sinon";
```

- import as part of sinon singleton:

```typescript
import * as sinon from "ts-sinon";

const stubObject = sinon.stubObject;
```

Stub all object methods:

```typescript
class Test {
    method() { return "original" }
}

const test = new Test();
const testStub = stubObject<Test>(test);

testStub.method.returns("stubbed");

expect(testStub.method()).to.equal("stubbed");
```

Partial stub:

```typescript
class Test {
    public someProp: string = "test";
    methodA() { return "A: original" }
    methodB() { return "B: original" }
}

const test = new Test();
// second argument must be existing class method name, in this case only "methodA" or "methodB" are accepted.
const testStub = stubObject<Test>(test, ["methodA"]);

expect(testStub.methodA()).to.be.undefined;
expect(testStub.methodB()).to.equal("B: original");
```

Stub with predefined return values (type-safe):

```typescript
class Test {
    method() { return "original" }
}

const test = new Test();
const testStub = stubObject<Test>(test, { method: "stubbed" });

expect(testStub.method()).to.equal("stubbed");
```

## Interface stubs example

Importing stubInterface function:

- import single function:

```typescript
import { stubInterface } from "ts-sinon";
```

- import as part of sinon singleton:

```typescript
import * as sinon from "ts-sinon";

const stubInterface = sinon.stubInterface;
```

Interface stub (stub all methods):

```typescript
interface Test {
    method(): string;
}

const testStub = stubInterface<Test>();

expect(testStub.method()).to.be.undefined;

testStub.method.returns("stubbed");

expect(testStub.method()).to.equal("stubbed");
```

Interface stub with predefined return values (type-safe):

```typescript
interface Test {
    method(): string;
}

// method property has to be the same type as method() return type
const testStub = stubInterface<Test>({ method: "stubbed" });

expect(testStub.method()).to.equal("stubbed");
```

## Object constructor stub example

Importing stubConstructor function:

- import single function:

```typescript
import { stubConstructor } from "ts-sinon";
```

- import as part of sinon singleton:

```typescript
import * as sinon from "ts-sinon";

const stubConstructor = sinon.stubConstructor;
```

Object constructor stub (stub all methods):

- without passing predefined args to the constructor:

```typescript
class Test {
    public someVar: number = 10;

    method(): string {
        return "value";
    }
}

// type will be guessed automatically
const testStub = stubConstructor(Test);

expect(testStub.method()).to.be.undefined;

testStub.method.returns("stubbed");

expect(testStub.method()).to.equal("stubbed");

expect(testStub.someVar).to.equal(10);

testStub.someVar = 20;

expect(testStub.someVar).to.equal(20);
```

- with passing predefined args to the constructor:

```typescript
class Test {
    constructor(public someVar: string, y: boolean) {}

    // ...
}

// it won't allow to pass incorrect args
const testStub = stubConstructor(Test, "someValue", true);

expect(testStub.someVar).to.equal("someValue");
```

## Sinon methods

By importing 'ts-sinon' you have access to all sinon methods.

```typescript
import sinon, { stubInterface } from "ts-sinon";

const functionStub = sinon.stub();
const spy = sinon.spy();
// ...
```

or

```typescript
import * as tsSinon from "ts-sinon"

const functionStub = tsSinon.default.stub();
const spy = tsSinon.default.spy();
const tsStubInterface = tsSinon.stubInterface<T>();

// ...
```

## Packages

##### Dependencies:

1. [Microsoft/TypeScript](https://github.com/Microsoft/TypeScript)
2. [TypeStrong/ts-node](https://github.com/TypeStrong/ts-node)
3. [sinonjs/sinon](https://github.com/sinonjs/sinon)

##### Dev Dependencies:

4. [mochajs/mocha](https://github.com/mochajs/mocha)
5. [chaijs/chai](https://github.com/chaijs/chai)
6. [domenic/sinon-chai](https://github.com/domenic/sinon-chai)

## Tests

`npm test`

## License

Licensed under either of

- Apache 2.0, ([LICENSE-APACHE](LICENSE-APACHE) / <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT ([LICENSE-MIT](LICENSE-MIT) / <http://opensource.org/licenses/MIT>)

## Contribute

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
