declare module "strummer" {
  export interface Matcher {
    match: (path: string, value: string) => string | undefined;
    safeParse: (path: string, value: string) =>  { errors: Array<string>, value?: any };
    toJSONSchema: () => JSONSchema;
  }

  interface JSONSchema {
    type: "string";
  }

  interface CreateMatcherOpts {
    match: (path: string, value: string) => string | undefined;
    safeParse?: (path: string, value: string) => { errors: Array<string>, value?: any };
    toJSONSchema?: () => JSONSchema;
  }

  type CreateMatcher = () => Matcher;

  interface BaseOpts {
    description?: string;
    optional?: boolean;
  }

  interface ArrayOpts extends BaseOpts {
    min?: number;
    max?: number;
    of: Matcher;
  }

  interface EnumOpts extends BaseOpts {
    type?: "integer" | "string";
    values: Array<string | number>;
  }

  interface HashmapOpts extends BaseOpts {
    keys: string;
    values: string;
  }

  interface IsoDateOpts extends BaseOpts {
    time?: boolean;
  }

  interface IntegerOpts extends BaseOpts {
    min?: number;
    max?: number;
  }

  interface NumberOpts extends BaseOpts {
    min?: number;
    max?: number;
  }

  interface StringOpts extends BaseOpts {
    min?: number;
  }

  interface UuidOpts extends BaseOpts {
    version?: 1 | 2 | 3 | 4;
  }

  type ObjectWithOnlyOpts = Record<string, Matcher>;

  export function array(opts: ArrayOpts): Matcher;
  export function boolean(opts?: never): Matcher;
  export function createMatcher(opts: CreateMatcherOpts): CreateMatcher;

  // enum is a protected name so requires special exporting
  function _enum(opts: EnumOpts): Matcher;
  export { _enum as enum };

  // hashmap has multiple signatures
  export function hashmap(matcher?: Matcher): Matcher;
  export function hashmap(opts: HashmapOpts): Matcher;

  export function integer(opts?: IntegerOpts): Matcher;
  export function isoDate(opts?: IsoDateOpts): Matcher;
  export function number(opts?: NumberOpts): Matcher;
  export function objectWithOnly(matchers: ObjectWithOnlyOpts): Matcher;
  export function oneOf(matchers: Matcher[]): Matcher;
  export function optional(matcher?: Matcher): Matcher;
  export function string(opts?: StringOpts): Matcher;
  export function url(opts?: never): Matcher;
  export function uuid(opts: UuidOpts): Matcher;
}
