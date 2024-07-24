import { z } from 'zod';

const transformFilter = (val: unknown) => {
  if (typeof val !== 'string') return { value: val };
  const [value, operator] = (val as string)
    .split(':', 2)
    .reverse()
    .filter(val => val);
  return { value, operator };
};

export const stringFilterSchema = z.optional(
  z.preprocess(
    transformFilter,
    z.object({
      value: z.string(),
      operator: z.enum(['eq', 'ne', 'regex']).default('eq'),
    }),
  ),
);

export const numberFilterSchema = z.optional(
  z.preprocess(
    transformFilter,
    z.object({
      value: z.preprocess(Number, z.number()),
      operator: z.enum(['lt', 'lte', 'gt', 'ge', 'eq', 'ne']).default('eq'),
    }),
  ),
);

export const dateFilterSchema = z.optional(
  z.preprocess(
    transformFilter,
    z.object({
      value: z.preprocess(Date, z.date()),
      operator: z.enum(['eq', 'ge', 'le']).default('eq'),
    }),
  ),
);

export const paginationQuerySchema = z.object({
  _page: z.optional(z.preprocess(Number, z.number())),
  _limit: z.optional(z.preprocess(Number, z.number())),
  _sort: z.string().default('id'),
  _order: z.enum(['asc', 'desc']).default('asc'),
});

const genericPaginationSchema = z.union([
  paginationQuerySchema,
  z.record(z.string(), stringFilterSchema.or(numberFilterSchema).or(dateFilterSchema)),
]);

export type PaginationQuery = z.infer<typeof genericPaginationSchema>;

export interface RecordResult<T> {
  records: T[];
  count: number;
}
