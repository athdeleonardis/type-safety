/**
 * The class representation of the test to be run.
 * The test script an instance of this class is located in should call the '.run' method to run the test.
 */
class Test {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  logSuccess() {
    console.log(`[test]<${this.name}>: Success.`);
    process.exit(0);
  }

  logFailure(stepName: string, error?: Error) {
    console.log(`[test]<${this.name}>: Failure -- ${stepName}`);
    if (error)
      console.log(error);
    process.exit(1);
  }

  assertEqual(stepName: string, value1: any, value2: any) {
    try {
      if (value1 === value2)
        return;
      this.logFailure(stepName)
    }
    catch (err) {
      const error = err as typeof err & Error;
      this.logFailure(stepName, error);
    }
  }

  assertTrue(stepName: string, value: any) {
    if (value)
      return;
    this.logFailure(stepName);
  }

  run(func: () => any) {
    func();
    this.logSuccess();
  };
};

export default Test;