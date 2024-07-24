import { Result } from './Result';

export interface IGuardResult {
  succeeded: boolean;
  message?: string;
  errors?: string[];
}

export interface IGuardArgument {
  argument: any;
  argumentName: string;
}

export type GuardArgumentCollection = IGuardArgument[];

export class Guard {
  public static combine(guardResults: IGuardResult[]): IGuardResult {
    for (let result of guardResults) {
      if (result.succeeded === false) return result;
    }

    return { succeeded: true };
  }

  public static againstNullOrUndefined(argument: any, argumentName: string): IGuardResult {
    if (argument === null || argument === undefined) {
      return { succeeded: false, message: `${argumentName} is null or undefined` };
    } else {
      return { succeeded: true };
    }
  }

  public static againstInvalidDate(argument: Date, argumentName: string): IGuardResult {
    const isValid = argument instanceof Date && !isNaN(argument as any);
    if (!isValid) {
      return { succeeded: false, message: `${argumentName} is not a valid date` };
    } else {
      return { succeeded: true };
    }
  }

  public static againstNullOrUndefinedBulk(args: GuardArgumentCollection): IGuardResult {
    for (let arg of args) {
      const result = this.againstNullOrUndefined(arg.argument, arg.argumentName);
      if (!result.succeeded) return result;
    }

    return { succeeded: true };
  }

  public static againstFailedResults(values: Result<any>[]): IGuardResult {
    const failures = [];
    for (let value of values) {
      if (value.isFailure) {
        failures.push(value.errorValue());
      }
    }

    if (failures.length === 0) {
      return { succeeded: true };
    } else {
      return {
        succeeded: false,
        message: `Validation errors`,
        errors: failures,
      };
    }
  }

  public static isOneOf(value: any, validValues: any[], argumentName: string): IGuardResult {
    let isValid = false;
    for (let validValue of validValues) {
      if (value === validValue) {
        isValid = true;
      }
    }

    if (isValid) {
      return { succeeded: true };
    } else {
      return {
        succeeded: false,
        message: `${argumentName} isn't oneOf the correct types in ${JSON.stringify(validValues)}. Got "${value}".`,
      };
    }
  }

  public static inRange(num: number, min: number, max: number, argumentName: string): IGuardResult {
    const isInRange = num >= min && num <= max;
    if (!isInRange) {
      return { succeeded: false, message: `${argumentName} is not within range ${min} to ${max}.` };
    } else {
      return { succeeded: true };
    }
  }

  public static allInRange(numbers: number[], min: number, max: number, argumentName: string): IGuardResult {
    let failingResult: IGuardResult = null;
    for (let num of numbers) {
      const numIsInRangeResult = this.inRange(num, min, max, argumentName);
      if (!numIsInRangeResult.succeeded) failingResult = numIsInRangeResult;
    }

    if (failingResult) {
      return { succeeded: false, message: `${argumentName} is not within the range.` };
    } else {
      return { succeeded: true };
    }
  }

  public static againstInvalidLicensePlate(argument: string, argumentName: string): IGuardResult {
    if (!/[a-zA-Z0-9]{1,20}/.test(argument)) {
      return { succeeded: false, message: `${argumentName} is not a valid truck license plate` };
    } else {
      return { succeeded: true };
    }
  }
}
