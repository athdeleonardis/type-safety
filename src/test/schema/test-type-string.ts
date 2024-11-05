import { ETypeString } from "../../package/schema/schema-types"
import Test from "../test";

const test = new Test("ETypeString");

type TTestStep = {
  stepName: string,
  type: ETypeString,
  value: any,
};

const tests: TTestStep[] = [
  { stepName: ETypeString.Undefined, type: ETypeString.Undefined, value: undefined },
  { stepName: ETypeString.Null, type: ETypeString.Object, value: null },
  { stepName: ETypeString.Number, type: ETypeString.Number, value: 0 },
  { stepName: ETypeString.String, type: ETypeString.String, value: "" },
  { stepName: ETypeString.Object, type: ETypeString.Object, value: {} }
];

test.run(() => {
  tests.forEach(({ type, value }) => {
    test.assertEqual(type, type, typeof(value));
  });
});
