import { FieldNode } from 'graphql';
/*
This code using for recursively-traverse through selected fields and create object for aggregation

*/
export default function getProjection(
  fieldNode: FieldNode,
): Record<string, any> {
  const projection: Record<string, any> = {};
  if (fieldNode.selectionSet) {
    fieldNode.selectionSet.selections.forEach((selection) => {
      if (selection.kind === 'Field' && selection.name.value !== '__typename') {
        if (
          !selection.selectionSet ||
          selection.selectionSet?.selections.length === 0
        ) {
          return (projection[selection.name.value] = 1);
        } else {
          return (projection[selection.name.value] = {
            ...getProjection(selection),
          });
        }
      }
    });
  }
  return projection;
}

export const responseFormat = (valueObject: object) => {
  const projects: object = {};

  Object.keys(valueObject).forEach((key) => {
    projects[key] = 1;
  });
  return { $project: projects };
};
