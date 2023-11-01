/**
 * @packageDocumentation
 *
 * A fork of [ts-sinon](https://www.npmjs.com/package/ts-sinon) that lets you BYO sinon. Can probably be retired if [ttarnowski/ts-sinon#255](https://github.com/ttarnowski/ts-sinon/pull/255) is ever merged.
 *
 * - stub all object methods
 * - stub interface
 * - stub object constructor
 *
 * ## Prerequisites
 *
 * 1. You have a version of Node.js >= [v8.4.0](https://nodejs.org/en/download/)
 * 2. You have installed [Typescript](https://www.typescriptlang.org/index.html#download-links)
 *
 * @example Stub all object methods
 *
 * ```javascript
 * import Sinon from 'sinon'
 * import { stubObject } from 'ts-sinon'
 *
 * class Test {
 *   method() { return 'original' }
 * }
 *
 * const test = new Test()
 * const testStub = stubObject<Test>(test)
 *
 * testStub.method.returns('stubbed')
 *
 * expect(testStub.method()).to.equal('stubbed')
 * ```
 *
 * @example Partial stub
 *
 * ```typescript
 * import Sinon from 'sinon'
 * import { stubObject } from 'ts-sinon'
 *
 * class Test {
 *   method() { return 'original' }
 * }
 *
 * const test = new Test()
 * const testStub = stubObject<Test>(test, {
 *   method: Sinon.stub().returns('stubbed')
 * })
 *
 * expect(testStub.method()).to.equal('stubbed')
 * ```
 *
 * @example Interface stub (stub all methods)
 *
 * ```typescript
 * import Sinon from 'sinon'
 * import { stubInterface } from 'ts-sinon'
 *
 * interface Test {
 *   method(): string
 * }
 *
 * const testStub = stubInterface<Test>()
 *
 * expect(testStub.method()).to.be.undefined
 *
 * testStub.method.returns('stubbed')
 *
 * expect(testStub.method()).to.equal('stubbed')
 * ```
 *
 * @example Interface stub with predefined return values (type-safe)
 *
 * ```typescript
 * import Sinon from 'sinon'
 * import { stubInterface } from 'ts-sinon'
 *
 * interface Test {
 *   method(): string
 * }
 *
 * // method property has to be the same type as method() return type
 * const testStub = stubInterface<Test>({
 *   method: Sinon.stub().returns('stubbed')
 * })
 *
 * expect(testStub.method()).to.equal('stubbed')
 * ```
 *
 * @example Object constructor stub (stub all methods)
 *
 * - without passing predefined args to the constructor:
 *
 * ```typescript
 * import Sinon from 'sinon'
 * import { stubConstructor } from 'ts-sinon'
 *
 * class Test {
 *   public someVar: number = 10
 *
 *   method(): string {
 *     return 'value'
 *   }
 * }
 *
 * // type will be guessed automatically
 * const testStub = stubConstructor(Test)
 *
 * expect(testStub.method()).to.be.undefined
 *
 * testStub.method.returns('stubbed')
 *
 * expect(testStub.method()).to.equal('stubbed')
 *
 * expect(testStub.someVar).to.equal(10)
 *
 * testStub.someVar = 20
 *
 * expect(testStub.someVar).to.equal(20)
 * ```
 *
 * @example Passing predefined args to the constructor
 *
 * ```typescript
 * import Sinon from 'sinon'
 * import { stubConstructor } from 'ts-sinon'
 *
 * class Test {
 *   constructor(public someVar: string, y: boolean) {}
 *   // ...
 * }
 *
 * // it won't allow to pass incorrect args
 * const testStub = stubConstructor(Test, 'someValue', true)
 *
 * expect(testStub.someVar).to.equal('someValue')
 * ```
 */

import Sinon from 'sinon'

export type StubbedInstance<T> = sinon.SinonStubbedInstance<T> & T

export type AllowedKeys<T, Condition> = {
  [Key in keyof T]:
  T[Key] extends Condition ? Key : never
}[keyof T]

export function stubObject<T extends object> (object: T, partial?: Partial<T>): StubbedInstance<T> {
  const stubObject: any = Object.assign({}, object)
  const objectMethods = getObjectMethods(object)
  const excludedMethods: string[] = [
    '__defineGetter__', '__defineSetter__', 'hasOwnProperty',
    '__lookupGetter__', '__lookupSetter__', 'propertyIsEnumerable',
    'toString', 'valueOf', '__proto__', 'toLocaleString', 'isPrototypeOf'
  ]

  for (const method in object) {
    if (typeof object[method] === 'function') {
      objectMethods.push(method)
    }
  }

  for (const method of objectMethods) {
    if (!excludedMethods.includes(method)) {
      // @ts-expect-error cannot index object by string
      stubObject[method] = object[method]
    }
  }

  if (partial != null) {
    for (const key in partial) {
      if (excludedMethods.includes(key) === true) {
        continue
      }

      stubObject[key] = partial[key]
    }
  } else {
    for (const method of objectMethods) {
      // @ts-expect-error cannot index object by string
      if (typeof object[method] === 'function' && method !== 'constructor') {
        stubObject[method] = Sinon.stub()
      }
    }
  }

  return stubObject
}

export function stubConstructor<T extends new (...args: any[]) => any> (
  constructor: T,
  ...constructorArgs: ConstructorParameters<T> | undefined[]
): StubbedInstance<InstanceType<T>> {
  return stubObject(new constructor(...constructorArgs))
}

export function stubInterface<T extends object> (methods: Partial<T> = {}): StubbedInstance<T> {
  const object: any = stubObject<any>({}, methods)

  return new Proxy(object, {
    get: (target, name) => {
      if (!Object.prototype.hasOwnProperty.call(target, name) && name !== 'then') {
        target[name] = Sinon.stub()
      }

      return target[name]
    }
  })
}

function getObjectMethods (object: any): string[] {
  const methods: string[] = []
  while (((object = Reflect.getPrototypeOf(object)) != null)) {
    const keys = Reflect.ownKeys(object)
    keys.forEach((key) => {
      if (typeof key === 'string') {
        methods.push(key)
      }
    })
  }

  return methods
}
