export enum ETypeString {
  Undefined="undefined",
  Null="null",
  Boolean="boolean",
  Number="number",
  String="string",
  Object="object"
}

export type TTypeStringValue = string | number;

export enum ESchemaType {
  Value,
  Array,
  Object,
  Any
};

export type TSchemaValue<T> = {
  kind: ESchemaType.Value,
  type:
      T extends string ? ETypeString.String
    : T extends number ? ETypeString.Number
    : never
};
export type TSchemaArray<T> =
    T extends (infer U)[] ? { kind: ESchemaType.Array, type: TSchema<U> }
  : never;
export type TSchemaObject<T> =
    T extends {[key: string]: any} ? { kind: ESchemaType.Object, type: {[K in keyof T]: TSchema<T[K]>} }
  : never;
export type TSchemaAny = { kind: ESchemaType.Any };

export type TSchema<T> = { unrequired?: (T extends undefined ? true : false), nullable?: (T extends null ? 'true' : 'false') } & (
    T extends (infer U)[] ? TSchemaArray<T>
  : T extends {[key: string]: any} ? TSchemaObject<T>
  : T extends TTypeStringValue ? TSchemaValue<T>
  : TSchemaAny
);

type TTestNamedId = { name: string, id: number };

const namedIdSchema: TSchema<TTestNamedId> = {
  kind: ESchemaType.Object,
  type: {
    name: { kind: ESchemaType.Value, type: ETypeString.String },
    id: { kind: ESchemaType.Value, type: ETypeString.Number }
  }
}

type TTestHospitalEntry = { patient: TTestNamedId, hospital: TTestNamedId, date: string };

const hospitalEntrySchema: TSchema<TTestHospitalEntry> = {
  kind: ESchemaType.Object,
  unrequired: false,
  type: {
    patient: namedIdSchema,
    hospital: namedIdSchema,
    date: { kind: ESchemaType.Value, type: ETypeString.String }
  }
};
