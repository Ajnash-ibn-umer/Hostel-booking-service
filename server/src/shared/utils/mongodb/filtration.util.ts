import mongoose from 'mongoose';

type filtrationDatatype = {
  match: { [key: string]: any };
  _type_?: 'string' | 'objectId' | 'number' | 'boolean';
  required?: boolean;
};

export const MatchList = (array: Array<filtrationDatatype>) => {
  try {
    const response: object[] = [];
    array.forEach((data): any => {
      const matchStage = { $match: {} };

      const condition = Object.entries(data.match)[0];

      if (data.required && condition[1] && condition[1].length <= 0)
        throw `${condition[0]} is required`;
      if (condition[1] && condition[1].length > 0) {

        if (data._type_ === 'objectId') {
          condition[1] = condition[1].map(
            (id) => new mongoose.Types.ObjectId(id),
          );
        }else  if (data._type_ === 'number') {
          condition[1] = condition[1].map(
            (id) => parseFloat(id),
          );
        }else  if (data._type_ === 'string') {
          condition[1] = condition[1].map(
            (id) => String(id),
          );
        }
        matchStage.$match[condition[0]] = { $in: condition[1] };

        response.push(matchStage);
      }

      return;
    });
    // console.log({ r: response[0] });

    return response;
  } catch (error) {
    throw error;
  }
};

export const Search = (fieldNames: string[], searchText) => {
  try {
    // [{ _conditionName: new RegExp(searchText, 'i') }]
    // console.log('searchText', searchText);

    if (searchText !== '' && searchText) {
      const conditions = [];

      if (fieldNames && fieldNames.length > 0) {
        // console.log({ searchfieldlength: fieldNames.length });

        fieldNames.forEach((fieldName) => {
          const obj = {};
          obj[fieldName] = new RegExp(searchText, 'i');
          conditions.push(obj);
        });
      }
      return {
        $match: {
          $or: conditions,
        },
      };
    }
  } catch (error) {
    throw error;
  }
};

export const Paginate = (skip: number, limit: number) => {
  try {
    // console.log({ skip, limit });

    if (skip === null || limit === null) throw 'Limit and Skip required';
    if (skip !== -1 && limit !== -1) {
      return [
        {
          $skip: skip ?? 0,
        },
        {
          $limit: limit,
        },
      ];
    } else {
      return [
        {
          $skip: 0,
        },
      ];
    }
  } catch (error) {
    throw error;
  }
};
