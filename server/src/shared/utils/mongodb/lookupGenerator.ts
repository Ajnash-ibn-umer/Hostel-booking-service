import { STATUS_NAMES } from 'src/shared/variables/main.variable';
import { MODEL_NAMES } from './../../../database/modelNames';

interface lookupInterface {
  modelName: MODEL_NAMES;
  responseName: string;
  params: Object;
  conditions: {
    [key: string]: any;
  };
  conditionWithArray?: {
    [key: string]: any;
  };
  isStatusNullable?: boolean;
  project?: object;
  status?: STATUS_NAMES;
  isNeedUnwind?: boolean;
  innerPipeline?: object[];
}

export const Lookup = (
  {
    modelName,
    params,
    project,
    responseName,
    conditions,
    conditionWithArray,
    status = STATUS_NAMES.ACTIVE,
    isStatusNullable = false,
    isNeedUnwind = true,
    innerPipeline,
  }: lookupInterface,
  ...args: any
) => {
  const conditionsList: any = Object.entries(conditions).map((value, idx) => ({
    $eq: [value[0], value[1]],
  }));

  if (!isStatusNullable) {
    conditionsList.push({
      $eq: ['$status', status],
    });
  }

  if (conditionWithArray) {
    // console.log("with array",conditionWithArray);

    conditionsList.push(
      ...Object.entries(conditionWithArray).map((value, idx) => ({
        $in: [value[0], value[1]],
      })),
    );
    // console.log("conditions with array:--",conditionsList);
  }
  // console.log("conditions:--",conditionsList);

  // console.log(Object.entries(conditions));
  const pipeline: any = [
    {
      $match: {
        $expr: {
          $and: conditionsList,
        },
      },
    },
  ];
  if (project) pipeline.push(project);

  if (innerPipeline && innerPipeline.length > 0)
    pipeline.push(...innerPipeline);

  const array: any[] = [
    {
      $lookup: {
        from: modelName,
        let: params,
        pipeline,
        as: responseName,
      },
    },
  ];

  isNeedUnwind
    ? array.push({
        $unwind: {
          path: `$${responseName}`,
          preserveNullAndEmptyArrays: true,
        },
      })
    : '';

  //TODO: push if need extra pipes
  //   args ? array.push(args) : '';

  // console.log(...array);
  // console.log(array[0].$lookup.pipeline[0].$match.$expr.$and);

  return array;
};
