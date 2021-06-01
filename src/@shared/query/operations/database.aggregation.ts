export const matchItemInArray = (value: string[], path) => {
  const rule = {};
  rule[path] = { $all: value };
  return { $match: rule };
};

export const matchKeyInObjectArray = (arrayPath: string, keyPath: string, values: any[]) => {
  const matcher = {};
  matcher[arrayPath] = { $all: [] };
  values.forEach((item) => {
    const rule = {};
    rule[keyPath] = item;
    matcher[arrayPath].$all.push({ $elemMatch: rule });
  });
  return {
    $match: matcher,
  };
};

export const matchField = (field) => ({
  $match: field,
});

export const aggregateSkip = (skip) => [
  {
    $skip: skip,
  },
];

export const aggregateFindDocumentByGeoloc = (
  coordinates: number[],
  maxDistance = 100000,
  outputDistance = 'location.calculated',
) => ({
  $geoNear: {
    near: {
      type: 'Point',
      coordinates,
    },
    distanceField: outputDistance,
    maxDistance,
    spherical: true,
  },
});

export const AggregationPagination = (skip = 0, limit = 10) => ({
  $facet: {
    paginatedResults: [{ $skip: skip }, { $limit: limit }],
    totalCount: [
      {
        $count: 'count',
      },
    ],
  },
});

export const aggregateLimit = (limit) => [
  {
    $limit: limit,
  },
];

export const aggregateSort = (sortType) => ({
  $sort: sortType,
});

export const mapDocuments = (documentMapper: Record<string, any>) => ({ $project: documentMapper });
/**
 * from: The target collection.
 * localField: The local join field.
 * foreignField: The target join field.
 * as: The name for the results.
 * pipeline: The pipeline to run on the joined collection.
 * let: Optional variables to use in the pipeline field stages.
 */
export const lookup = (from: string, localField: string, foreignField: string, as: string) => ({
  $lookup: {
    from,
    localField,
    foreignField,
    as,
  },
});

/**
 * newField: The new field name.
 * expression: The new field expression.
 */
export const addField = (newField: any) => ({ $addFields: newField });

export const unset = (fields: string[]) => ({ $unset: fields });

export const unwind = (
  path: string,
  includeArrayIndex = 'index',
  preserveNullAndEmptyArrays = true,
) => ({
  $unwind: {
    path,
    includeArrayIndex,
    preserveNullAndEmptyArrays,
  },
});

export const group = (groupAcc: any) => ({ $group: groupAcc });

export const set = (conf: any) => ({ $set: conf });
