import { PipelineStage } from 'mongoose';
import { PaginationQuery } from '../dto/Pagination';

export const makePipeline = (query: PaginationQuery): PipelineStage[] => {
  const pipeline: PipelineStage[] = [];

  for (let key in query) {
    if (['_sort', '_limit', '_order', '_page'].includes(key)) continue;

    const { operator, value } = query[key];
    const filter = { $match: { [key]: { [`$${operator}`]: value } } };
    pipeline.push(filter);
  }

  if (query._sort && query._order) {
    const key = query._sort === 'id' ? '_id' : (query._sort as string);
    const value = query._order === 'asc' ? 1 : -1;
    pipeline.push({
      $sort: {
        [key]: value,
      },
    });
  }

  const facet = {
    metadata: [{ $count: 'count' }],
    records: [],
  };

  if (query._page && query._limit) {
    const skip = (Number(query._page) - 1) * Number(query._limit);
    const limit = Number(query._limit);
    facet.records.push({ $skip: skip }, { $limit: limit });
  }

  pipeline.push({ $facet: facet });

  return pipeline;
};
