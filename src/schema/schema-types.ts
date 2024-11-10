/**
 * JavaScript Type.
 * The string values returned by the 'typeof' operator.
 */
export enum EJSType {
  Undefined="undefined",
  Boolean="boolean",
  Number="number",
  String="string",
  Object="object",
}

/**
 * TypeScript Schema Value.
 * The non-object, defined value types accepted by TSchemaFromType.
 */
export type TTSValue = boolean | number | string;

/**
 * JavaScript Schema Value
 * The string values returned by the 'typeof' operator for non-object, defined values accepted by TSchemaValue.
 */
export enum EJSValue {
  Boolean=EJSType.Boolean,
  Number=EJSType.Number,
  String=EJSType.String
};

/**
 * Converts from TTSValue to 
 */
type TJSValueFromTSValue<T extends TTSValue> =
    T extends boolean ? EJSValue.Boolean
  : T extends number ? EJSValue.Number
  : T extends string ? EJSValue.String
  : never;

/**
 * Schema Type.
 * An enum used to differentiate between each schema type.
 */
export enum ESchemaType {
  Value='schema-value',
  Array='schema-array',
  Object='schema-object',
  Any='schema-any'
};

/**
 * Unrequired.
 * Used as the type for whether a schema is unrequired or nullable.
 */
export type TUnrequired = true | undefined;

/**
 * Extends Undefined.
 * Go from T, a union, to true if and only if T extends undefined.
 * Otherwise, go to undefined.
 */
export type TExtendsUndefined<T> = true extends (T extends undefined ? true : never) ? true : undefined;

/**
 * Extends Null.
 * Go from T, a union, to true if and only if T extends null.
 * Otherwise, go to undefined.
 */
export type TExtendsNull<T> = true extends (T extends null ? true : never) ? true : undefined;

/**
 * Isolate Defined.
 * Go from T, a union, to a union of all types in T that aren't 'undefined' or 'null'.
 */
type TIsolateDefined<T> = T extends undefined ? never : T extends null ? never : T;

/**
 * Schema Format.
 * Each schema type is an extension of this type.
 * @param S The schema type.
 * @param U Whether the schema is undefined-able.
 * @param N Whether the schema is nullable.
 * @param T The child type of the schema.
 */
type TSchemaFormat<S extends ESchemaType, U extends TUnrequired, N extends TUnrequired, T> = {
  kind: S,
  unrequired?: U,
  nullable?: N,
  type: T
};

/**
 * Schema Object.
 * A schema representation of a JavaScript string-keyed dictionary.
 * @param U Whether the schema is undefined-able.
 * @param N Whether the schema is nullable.
 * @param T The dictionary of child schemas this parent schema represents.
 */
export type TSchemaObject<U extends TUnrequired, N extends TUnrequired, T> =
  T extends {[key: string]: TSchemaFormat<infer _S, infer _U, infer _N, infer _T>}
    ? TSchemaFormat<ESchemaType.Object, U, N, T>
    : never;

/**
 * Schema Array.
 * A schema representation of a JavaScript array.
 * @param U Whether the schema is undefined-able.
 * @param N Whether the schema is nullable.
 * @param T The child schema all elements of the array should conform to.
 */
export type TSchemaArray<U extends TUnrequired, N extends TUnrequired, T> =
  T extends TSchemaFormat<infer _S, infer _U, infer _N, infer _T>
    ? TSchemaFormat<ESchemaType.Array, U, N, T>
    : never;

/**
 * Schema Value.
 * A schema representation of a JavaScript defined value.
 * @param U Whether the schema is undefined-able.
 * @param N Whether the schema is nullable.
 * @param V The JavaScript value type this schema represents, as a string
 */
export type TSchemaValue<U extends TUnrequired, N extends TUnrequired, V> =
  V extends EJSValue
    ? TSchemaFormat<ESchemaType.Value, U, N, V>
    : never;

/**
 * Schema Any.
 * A schema representation of TypeScript Any.
 */
export type TSchemaAny = TSchemaFormat<ESchemaType.Any, undefined, undefined, any>;

/**
 * Schema.
 * A union of all schema types.
 * The schema representation of any possible JavaScript object / value.
 * 
 */
export type TSchema<U extends TUnrequired, N extends TUnrequired, T> =
  | TSchemaObject<U,N,T>
  | TSchemaArray<U,N,T>
  | TSchemaValue<U,N,T>
  | TSchemaAny;

/**
 * Schema From Type.
 * Converts from typescript types to a recursive schema wrapper of the type.
 */
export type TSchemaFromType<T> = TSchemaFromTypeInternal<TExtendsUndefined<T>, TExtendsNull<T>, TIsolateDefined<T>>;

/**
 * Schema From Type Internal.
 * Wrapped by 'TSchemaFromType'.
 * Handles decision chain for conversion from the type to the schema type.
 * 'TSchemaFromType' handles union of undefined or null to 'undefined-able' and 'nullable' parameters.
 */
type TSchemaFromTypeInternal<U extends TUnrequired, N extends TUnrequired, T> =
    T extends (infer A)[]
      ? TSchemaArray<U, N, TSchemaFromType<A>>
  : T extends {[key: string]: any}
      ? TSchemaObject<U, N, { [K in keyof T]: TSchemaFromType<T[K]> }>
  : T extends TTSValue
      ? TSchemaValue<U, N, TJSValueFromTSValue<T>>
  : TSchemaAny;





















