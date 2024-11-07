import { EJSType } from "../../src/schema/schema-types";

/**
 * Recursively traverses the supplied objects and checks that they are equal to eachother by value.
 * @param value1 
 * @param value2 
 * @returns Whether both entered values are recursively equal by value.
 */
export function recursivelyEqual(value1: any, value2: any): boolean {
  if (typeof(value1) != typeof(value2))
    return false;
  switch (typeof(value1)) {
    // Compare simple types
    case EJSType.Undefined:
    case EJSType.Boolean:
    case EJSType.Number:
      return value1 == value2;
    case EJSType.String:
      return value1 === value2;
    
    // Compare complex types
    case EJSType.Object: {
      // Compare null
      if (value1 == null)
        return value2 == null;

      // Compare array
      if (Array.isArray(value1)) {
        if (!Array.isArray(value2))
          return false;
        if (value1.length !== value2.length)
          return false;
        for (let i = 0; i < value1.length; i++) {
          if (!recursivelyEqual(value1[i], value2[i]))
            return false;
          return true;
        }
      }

      // Compare dictionary
      const allKeys = new Set<string>();
      Object.keys(value1).forEach(key => allKeys.add(key));
      Object.keys(value2).forEach(key => allKeys.add(key));
      allKeys.forEach(key => {
        if (!recursivelyEqual(value1[key], value2[key]))
          return false;
      });
      return true;
    }
  }
  return false;
}
