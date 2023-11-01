[![codecov](https://img.shields.io/codecov/c/github/achingbrain/sinon-ts.svg?style=flat-square)](https://codecov.io/gh/achingbrain/sinon-ts)
[![CI](https://img.shields.io/github/actions/workflow/status/achingbrain/sinon-ts/js-test-and-release.yml?branch=master\&style=flat-square)](https://github.com/achingbrain/sinon-ts/actions/workflows/js-test-and-release.yml?query=branch%3Amaster)

> sinon library extension to stub whole object and interfaces

# About

A fork of [ts-sinon](https://www.npmjs.com/package/ts-sinon) that lets you BYO sinon. Can probably be retired if [ttarnowski/ts-sinon#255](https://github.com/ttarnowski/ts-sinon/pull/255) is ever merged.

- stub all object methods
- stub interface
- stub object constructor

## Prerequisites

1. You have a version of Node.js >= [v8.4.0](https://nodejs.org/en/download/)
2. You have installed [Typescript](https://www.typescriptlang.org/index.html#download-links)

## Example

Stub all object methods

```javascript
import Sinon from 'sinon'
import { stubObject } from 'ts-sinon'

class Test {
  method() { return 'original' }
}

const test = new Test()
const testStub = stubObject<Test>(test)

testStub.method.returns('stubbed')

expect(testStub.method()).to.equal('stubbed')
```

## Example

Partial stub

```typescript
import Sinon from 'sinon'
import { stubObject } from 'ts-sinon'

class Test {
  method() { return 'original' }
}

const test = new Test()
const testStub = stubObject<Test>(test, {
  method: Sinon.stub().returns('stubbed')
})

expect(testStub.method()).to.equal('stubbed')
```

## Example

Interface stub (stub all methods)

```typescript
import Sinon from 'sinon'
import { stubInterface } from 'ts-sinon'

interface Test {
  method(): string
}

const testStub = stubInterface<Test>()

expect(testStub.method()).to.be.undefined

testStub.method.returns('stubbed')

expect(testStub.method()).to.equal('stubbed')
```

## Example

Interface stub with predefined return values (type-safe)

```typescript
import Sinon from 'sinon'
import { stubInterface } from 'ts-sinon'

interface Test {
  method(): string
}

// method property has to be the same type as method() return type
const testStub = stubInterface<Test>({
  method: Sinon.stub().returns('stubbed')
})

expect(testStub.method()).to.equal('stubbed')
```

## Example

Object constructor stub (stub all methods)

- without passing predefined args to the constructor:

```typescript
import Sinon from 'sinon'
import { stubConstructor } from 'ts-sinon'

class Test {
  public someVar: number = 10

  method(): string {
    return 'value'
  }
}

// type will be guessed automatically
const testStub = stubConstructor(Test)

expect(testStub.method()).to.be.undefined

testStub.method.returns('stubbed')

expect(testStub.method()).to.equal('stubbed')

expect(testStub.someVar).to.equal(10)

testStub.someVar = 20

expect(testStub.someVar).to.equal(20)
```

## Example

Passing predefined args to the constructor

```typescript
import Sinon from 'sinon'
import { stubConstructor } from 'ts-sinon'

class Test {
  constructor(public someVar: string, y: boolean) {}
  // ...
}

// it won't allow to pass incorrect args
const testStub = stubConstructor(Test, 'someValue', true)

expect(testStub.someVar).to.equal('someValue')
```

# Install

```console
$ npm i sinon-ts
```

# API Docs

- <https://achingbrain.github.io/sinon-ts>

# License

Licensed under either of

- Apache 2.0, ([LICENSE-APACHE](LICENSE-APACHE) / <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT ([LICENSE-MIT](LICENSE-MIT) / <http://opensource.org/licenses/MIT>)

# Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
