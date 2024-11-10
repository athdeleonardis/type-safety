import { EJSType, EJSValue, ESchemaType, TSchema, TUnrequired } from "../schema/schema-types";

/**
 * Check a JavaScript value of unknown type against a schema.
 * @param value The JavaScript value to recursively check against the inputted schema.
 * @param schema The schema that the inputted JavaScript value gets checked against.
 * @returns True if the inputted value conforms to the inputted schema, false otherwise.
 */
export function schemaValidate<U extends TUnrequired,N extends TUnrequired,T>(value: any, schema: TSchema<U,N,T>): boolean {
  if (typeof(value) === EJSType.Undefined) {
    return schema.unrequired === true;
  }
  if (value === null) {
    return schema.nullable === true;
  }
  
  switch (schema.kind) {
    case ESchemaType.Any:
      return true;

    case ESchemaType.Value: {
      const typeValue = typeof(value) as EJSValue;
      return schema.type === typeValue;
    }

    case ESchemaType.Array: {
      if (!Array.isArray(value))
        return false;

      let returnVal = true;
      value.forEach(childValue => {
        const schemaArrayValueType = schema.type as TSchema<TUnrequired, TUnrequired, any>;
        if (!schemaValidate(childValue, schemaArrayValueType))
          returnVal = false;
      });
      return returnVal;
    }

    case ESchemaType.Object: {
      if (typeof(value) !== EJSType.Object)
        return false;

      const schemaObject = schema.type as {[key: string]: TSchema<TUnrequired, TUnrequired, any>};
      let returnVal = true;
      Object.keys(schemaObject).forEach(key => {
        if (!schemaValidate(value[key], schemaObject[key]))
          return returnVal = false;
      });
      return returnVal;
    }
  }
  return false;
}
