import { OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';

class Utils {
  static genId(length: number): string {
    return Math.random()
      .toString(36)
      .substr(2, length + 2);
  }

  static mapAggregateCount<T>(): OperatorFunction<any, { results: T[]; count: number }> {
    return map<any, { results: T[]; count: number }>((result: any) => {
      if (!result[0].paginatedResults || result[0].paginatedResults.length === 0) {
        return {
          results: [],
          count: 0,
        };
      }
      return {
        results: result[0].paginatedResults,
        count: result[0].totalCount[0].count,
      };
    });
  }
}

export default Utils;
