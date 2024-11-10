import { schemaArray, schemaObject, schemaValue } from "../../src/schema/schema-create";
import { EJSValue, TSchemaFromType } from "../../src/schema/schema-types";
import { schemaValidate } from "../../src/validation/schema-validate";
import Test from "../test";

//
// Types
//

type TNamedId = {
  name: string,
  id: number
};

type TDoctor = TNamedId & {
  specialty: string | null | undefined
};

type THospital = TNamedId & {
  location: string,
  headDoctor: TDoctor
};

type TPatient = TNamedId & {
  dob: string,
  address?: string,
  currentlyAdmittedTo: THospital | null
};

type TVisitation = {
  patient: TPatient,
  location: THospital,
  date: string
};

//
// Schemas
//

const schemaNamedId: TSchemaFromType<TNamedId> = schemaObject({
  name: schemaValue(EJSValue.String),
  id: schemaValue(EJSValue.Number)
});

const schemaSpecialty: TSchemaFromType<string | null | undefined> = schemaValue(EJSValue.String, true, true);

const schemaDoctor: TSchemaFromType<TDoctor> = schemaObject({
  ...schemaNamedId.type,
  specialty: schemaSpecialty
});

const schemaHospital: TSchemaFromType<THospital> = schemaObject({
  ...schemaNamedId.type,
  location: schemaValue(EJSValue.String),
  headDoctor: schemaDoctor
});

const schemaPatient: TSchemaFromType<TPatient> = schemaObject({
  ...schemaNamedId.type,
  dob: schemaValue(EJSValue.String),
  address: schemaValue(EJSValue.String, true),
  currentlyAdmittedTo: schemaObject(schemaHospital.type, undefined, true)
});

const schemaVisitation: TSchemaFromType<TVisitation> = schemaObject({
  patient: schemaPatient,
  location: schemaHospital,
  date: schemaValue(EJSValue.String)
});

const schemaVisitationList: TSchemaFromType<TVisitation[]> = schemaArray(schemaVisitation);

//
// Values to check
//

const validDoctors: TDoctor[] = [
  {
    name: "John",
    id: 0,
    specialty: "Woodwork"
  },
  {
    name: "Hans",
    id: 1,
    specialty: undefined
  },
  {
    name: "Jennifer",
    id: 2,
    specialty: null
  },
  {
    name: "Sam",
    id: 3,
    specialty: "Textiles"
  }
];

const invalidDoctors = [
  {
    name: undefined,
    id: 4,
    specialty: undefined
  },
  {
    name: "Rose",
    id: null,
    speciality: "Metalwork"
  }
];

const validHospitals: THospital[] = [
  {
    name: "St. Peter's",
    id: 6,
    location: "...",
    headDoctor: validDoctors[0]
  },
];

const invalidHospitals = [
  {
    name: "St. John's",
    id: 7,
    location: null
  },
  {
    name: "St. Joseph's",
    id: 8,
    headDoctor: invalidDoctors[0]
  }
];

const validPatients: TPatient[] = [
  {
    name: "Rosanna",
    id: 9,
    dob: ".",
    address: "..",
    currentlyAdmittedTo: validHospitals[0]
  },
  {
    name: "Susan",
    id: 5,
    dob: "...",
    address: undefined,
    currentlyAdmittedTo: null
  }
];

const invalidPatients = [
  "patient string",
  616161,
  undefined,
  null,
  {
    id: 10,
    dob: ".....",
    address: "....",
    currentlyAdmittedTo: validHospitals[0]
  },
  {
    name: "Orwell",
    id: 11,
    dob: "......",
    address: ".......",
    currentlyAdmittedTo: invalidHospitals[1]
  },
  {
    name: "Joe",
    id: 12,
    dob: "........",
    address: null,
    currentlyAdmittedTo: null
  }
];

const validVisitations: TVisitation[][] = [
  [],
  []
];

validPatients.forEach((patient, index0) => {
  validHospitals.forEach((hospital, index1) => {
    validVisitations[1].push({
      patient: patient,
      location: hospital,
      date: "" + index0 + "-" + index1
    });
  });
});

const invalidVisitations: any[][] = [
  [],
  []
];

validPatients.forEach((patient, index0) => {
  validHospitals.forEach((hospital, index1) => {
    const obj = {
      patient: patient,
      location: hospital,
      date: "" + index0 + "-" + index1
    };
    invalidVisitations.forEach(arr => arr.push(obj));
  });
});
invalidVisitations[0][1] = {
  patient: invalidPatients[0],
  location: validHospitals[0],
  date: "b0"
};
invalidVisitations[1][1] = {
  patient: validPatients[0],
  location: invalidHospitals[0],
  date: "b1"
};

//
// Test Cases
//

type TTestCase<T> = {
  name: string,
  schema: TSchemaFromType<T>,
  validValues: T[],
  invalidValues: any[]
};

const tests: [TTestCase<TDoctor>, TTestCase<THospital>, TTestCase<TPatient>, TTestCase<TVisitation[]>] = [
  // Patient with no hospital
  {
    name: "Doctors",
    schema: schemaDoctor,
    validValues: validDoctors,
    invalidValues: invalidDoctors
  },
  {
    name: "Hospitals",
    schema: schemaHospital,
    validValues: validHospitals,
    invalidValues: invalidHospitals
  },
  {
    name: "Patients",
    schema: schemaPatient,
    validValues: validPatients,
    invalidValues: invalidPatients
  },
  {
    name: "Visitations Arrays",
    schema: schemaVisitationList,
    validValues: validVisitations,
    invalidValues: invalidVisitations as any[]
  }
] as const;

const test: Test = new Test("Schema Validate");

test.run(() => {
  tests.forEach((testCase) => {
    testCase.validValues.forEach((validValue, index) => {
      test.assertEqual(testCase.name + " Valid " + index, schemaValidate(validValue, testCase.schema as any), true);
    });
    testCase.invalidValues.forEach((invalidValue, index) => {
      test.assertEqual(testCase.name + " Invalid " + index, schemaValidate(invalidValue, testCase.schema as any), false);
    });
  });
});
