import { EJSType } from "../../src/schema/schema-types"
import Test from "../test";

/**
 * This test checks different JavaScript object / value types against the 'EJSType' enum.
 */
const test = new Test("EJSType");

type TTestStep = {
  stepName: string,
  type: EJSType,
  value: any,
};

const tests: TTestStep[] = [
  { stepName: EJSType.Undefined, type: EJSType.Undefined, value: undefined },
  { stepName: EJSType.Number, type: EJSType.Number, value: 0 },
  { stepName: EJSType.String, type: EJSType.String, value: "" },
  { stepName: "null", type: EJSType.Object, value: null },
  { stepName: "array", type: EJSType.Object, value: ['test', 1, true]},
  { stepName: EJSType.Object, type: EJSType.Object, value: {} }
];

test.run(() => {
  tests.forEach(({ type, value }) => {
    test.assertEqual(type, type, typeof(value));
  });
});
