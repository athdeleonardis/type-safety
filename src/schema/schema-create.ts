import {  EJSValue, ESchemaType, TSchema, TSchemaArray, TSchemaObject, TSchemaValue, TUnrequired } from "./schema-types";

/**
 * Creates a schema representing the inputted JavaScript value type string.
 * @param type The JavaScript value type string the schema represents.
 * @param unrequired Whether the schema value is undefined-able.
 * @param nullable Whether the schema value is nullable.
 * @returns The schema representation of the JavaScript value type.
 */
export function schemaValue<U extends TUnrequired, N extends TUnrequired, V extends EJSValue>(type: V, unrequired?: U, nullable?: N): TSchemaValue<U, N, V> {
  const value: TSchemaValue<U, N, V> = {
    kind: ESchemaType.Value,
    nullable: nullable,
    unrequired: unrequired,
    type: type
  } as TSchemaValue<U, N, V>;
  return value;
};

/**
 * Creates a schema representing an array with all values conforming to the child schema type entered.
 * @param type The schema type every child element conforms to.
 * @param unrequired Whether the schema array is undefined-able.
 * @param nullable Whether the schema array is nullable.
 * @returns The schema representation of the array of JavaScript objects / values.
 */
export function schemaArray<U extends TUnrequired, N extends TUnrequired, S extends TSchema<TUnrequired,TUnrequired,any>>(type: S, unrequired?: U, nullable?: N): TSchemaArray<U, N, S> {
  const array: TSchemaArray<U, N, S> = {
    kind: ESchemaType.Array,
    nullable: nullable,
    unrequired: unrequired,
    type: type
  } as TSchemaArray<U, N, S>;
  return array;
};

/**
 * Creates a schema representation of a JavaScript string-keyed dictionary object, where all values of the dictionary conform to their corresponding schema in the dictionary object supplied.
 * @param type The dictionary object mapping from all keys to their corresponding schemas.
 * @param unrequired Whether the schema object is undefined-able.
 * @param nullable Whether the schema object is nullable.
 * @returns The schema representation of the string-keyed dictionary.
 */
export function schemaObject<U extends TUnrequired, N extends TUnrequired, S extends {[key: string]: TSchema<TUnrequired,TUnrequired,any>}>(type: S, unrequired?: U, nullable?: N): TSchemaObject<U, N, S> {
  const object: TSchemaObject<U, N, S> = {
    kind: ESchemaType.Object,
    unrequired: unrequired,
    nullable: nullable,
    type: type
  } as TSchemaObject<U, N, S>;
  return object;
};
