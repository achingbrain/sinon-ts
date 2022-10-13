import sinon from 'sinon'

export type StubbedInstance<T> = sinon.SinonStubbedInstance<T> & T

export type AllowedKeys<T, Condition> = {
  [Key in keyof T]:
  T[Key] extends Condition ? Key : never
}[keyof T]

export type ObjectMethodsKeys<T> = Array<AllowedKeys<T, (...args: any[]) => any>>

export type ObjectMethodsMap<T> = {
  [Key in keyof T]?: T[Key] extends (...args: any[]) => any ? ReturnType<T[Key]> : never;
}

export function stubObject<T extends object> (object: T, methods?: ObjectMethodsKeys<T> | ObjectMethodsMap<T>): StubbedInstance<T> {
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

  if (Array.isArray(methods)) {
    for (const method of methods) {
      stubObject[method] = sinon.stub()
    }
  } else if (typeof methods === 'object') {
    for (const method in methods) {
      stubObject[method] = sinon.stub()
      stubObject[method].returns(methods[method])
    }
  } else {
    for (const method of objectMethods) {
      // @ts-expect-error cannot index object by string
      if (typeof object[method] === 'function' && method !== 'constructor') {
        stubObject[method] = sinon.stub()
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

export function stubInterface<T extends object> (methods: ObjectMethodsMap<T> = {}): StubbedInstance<T> {
  const object: any = stubObject<any>({}, methods)

  return new Proxy(object, {
    get: (target, name) => {
      if (!Object.prototype.hasOwnProperty.call(target, name) && name !== 'then') {
        target[name] = sinon.stub()
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
