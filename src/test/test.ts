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

  run(func: () => any) {
    func();
    this.logSuccess();
  };
};

export default Test;