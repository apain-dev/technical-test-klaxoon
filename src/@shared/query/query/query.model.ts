import { Observable } from 'rxjs';

export interface QueryResponse<T> {
  results: T[];

  count: number;
}

export interface ExtractedQueries {
  [key: string]: any;
}

export interface DocumentMapper {
  [key: string]: boolean | any;
}

export interface RawQuery {
  [key: string]: any;
}

export interface QueryOptions {
  count?: boolean;

  sort?: RawQuery;

  customStages?: Stage[];
}

export interface Stage {
  matcher?: string[];

  handler?: (
    key: string,
    value: any,
    query: RawQuery,
  ) => ExtractedQueries | Promise<ExtractedQueries> | Observable<ExtractedQueries>;

  priority: number;

  default?: any;

  value?: any;

  key?: string;
}
