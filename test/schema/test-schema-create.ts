import { schemaArray, schemaObject, schemaValue } from "../../src/schema/schema-create";
import { EJSValue, ESchemaType, TSchemaFromType } from "../../src/schema/schema-types";
import Test from "../test";
import { recursivelyEqual } from "../util/compare";

type TNamedId = { name: string, id: number };
type THospital = TNamedId;
type THospitalEntry = { hospital: THospital, date: string }
type TPatient = TNamedId & { visitations: THospitalEntry[] };

//
//
//

const namedIdSchema: TSchemaFromType<TNamedId> = {
  kind: ESchemaType.Object,
  type: {
    name: { kind: ESchemaType.Value, type: EJSValue.String  },
    id: { kind: ESchemaType.Value, type: EJSValue.Number }
  }
};

const visitationSchema: TSchemaFromType<THospitalEntry> = {
  kind: ESchemaType.Object,
  type: {
    hospital: namedIdSchema,
    date: { kind: ESchemaType.Value, type: EJSValue.String }
  }
};

const visitationArraySchema: TSchemaFromType<THospitalEntry[]> = {
  kind: ESchemaType.Array,
  type: visitationSchema
};

const patientSchema: TSchemaFromType<TPatient> = {
  kind: ESchemaType.Object,
  type: {
    ...namedIdSchema.type,
    visitations: visitationArraySchema
  }
};

//
// 
//

const namedIdSchemaFromFunctions: TSchemaFromType<TNamedId> = schemaObject({
  name: schemaValue(EJSValue.String),
  id: schemaValue(EJSValue.Number)
});

const visitationArraySchemaFromFunctions: TSchemaFromType<THospitalEntry[]> = schemaArray(
  schemaObject({
    hospital: namedIdSchemaFromFunctions,
    date: schemaValue(EJSValue.String)
  })
);

const patientSchemaFromFunctions: TSchemaFromType<TPatient> = schemaObject({
  ...namedIdSchemaFromFunctions.type,
  visitations: visitationArraySchemaFromFunctions
});

/**
 * This test checks that the two ways of schema construction, manual and via package functions, are equivalent.
 */
const test: Test = new Test("Schema Creation");

test.run(() => {
  test.assertTrue("Patient schema exists", patientSchema);
  test.assertTrue("Patient schema from functions exists", patientSchemaFromFunctions);

  test.assertTrue("Named id schemas equal", recursivelyEqual(namedIdSchema, namedIdSchemaFromFunctions));
  test.assertTrue("Visitation array schemas equal", recursivelyEqual(visitationArraySchema, visitationArraySchemaFromFunctions));
  test.assertTrue("Patient schemas equal", recursivelyEqual(patientSchema, patientSchemaFromFunctions));
});
