import { ApiPropertyOptional } from '@nestjs/swagger';
import { forkJoin, from, isObservable, Observable, of } from 'rxjs';
import { isPromise } from 'rxjs/internal-compatibility';
import { aggregateSort, AggregationPagination } from '../operations/database.aggregation';
import { ExtractedQueries, QueryOptions, RawQuery, Stage } from './query.model';

export enum PaginationQuery {
  OFFSET = 'offset',
  LIMIT = 'limit',
}

export class DefaultQuery {
  @ApiPropertyOptional({
    type: Number,
    example: '10',
    description: 'Limit number of results',
  })
  limit?: number;

  @ApiPropertyOptional({
    type: Number,
    example: '0',
    description: 'Move start index of the list',
  })
  offset?: number;
}

export interface QueryItem {
  matcher: string[];

  // eslint-disable-next-line max-len
  handler: (
    key: string,
    value: any,
    // eslint-disable-next-line max-len
    queryObject: RawQuery,
  ) => ExtractedQueries | Promise<ExtractedQueries> | Observable<ExtractedQueries>;

  priority: number;
}

export type QueryFormatted = QueryItem & { value: any; key: string };

export class Query {
  private _pagination = {
    skip: 0,
    limit: 10,
  };

  private _queryList: Stage[] = [];

  get queryList(): Stage[] {
    return this._queryList;
  }

  set queryList(value: Stage[]) {
    this._queryList = value;
  }

  extractQuery(rawQuery: RawQuery, options: QueryOptions) {
    const { limit, offset } = this.extractPaginationQuery(rawQuery);
    const queryAggregation: Array<Observable<ExtractedQueries>> = [];
    const queries: Stage[] = this.transformToArray(rawQuery, options);
    queries.forEach((query) => {
      const result = query.handler
        ? query.handler(query.key, query.value, rawQuery)
        : query.default;
      if (isObservable(result)) {
        queryAggregation.push(result);
      } else if (isPromise(result)) {
        queryAggregation.push(from(result));
      } else if (result) {
        queryAggregation.push(of(result));
      }
    });
    if (options.sort && Object.keys(options.sort).length) {
      queryAggregation.push(of(aggregateSort(options.sort)));
    }
    if (options.count) {
      queryAggregation.push(of(AggregationPagination(offset, limit)));
    }
    return forkJoin(queryAggregation);
  }

  private transformToArray(queryObject: RawQuery, options: QueryOptions): Stage[] {
    const result: Stage[] = [];
    Object.keys(queryObject).forEach((key) => {
      const match = this.matchQueryList(key);
      if (match) {
        result.push({
          ...match,
          value: queryObject[key],
          key,
        });
      }
    });

    if (options.customStages && options.customStages.length) {
      result.push(...options.customStages);
    }
    return this.sortQueries(result);
  }

  // eslint-disable-next-line class-methods-use-this
  private sortQueries(queries: Stage[]): Stage[] {
    return queries.sort((a: Stage, b: Stage) => b.priority - a.priority);
  }

  private matchQueryList(queryKey: string): Stage {
    return this._queryList.find((item: Stage) => item.matcher.indexOf(queryKey) !== -1);
  }

  // eslint-disable-next-line class-methods-use-this
  private extractPaginationQuery(rawQuery: RawQuery): { offset: number; limit: number } {
    const pagination = {
      offset: 0,
      limit: 10,
    };
    const offset = rawQuery[PaginationQuery.OFFSET];
    const limit = rawQuery[PaginationQuery.LIMIT];

    if (offset && !Number.isNaN(parseInt(offset, 10)) && +offset > 0) {
      pagination.offset = +offset;
    }
    if (limit && !Number.isNaN(parseInt(limit, 10)) && +limit > 0) {
      pagination.limit = +limit;
    }
    return pagination;
  }
}
