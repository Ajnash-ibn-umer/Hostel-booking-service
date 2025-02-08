const fs = require('fs');
const path = require('path');

function createSchemaFile(modelName,inputFilePath) {
  const ModelNames = modelName.toUpperCase();
  const camelCaseModelName = modelName.charAt(0).toLowerCase() + modelName.slice(1);
  const pascalCaseModelName = modelName.charAt(0).toUpperCase() + modelName.slice(1);

  const content = `
import mongoose from 'mongoose';
import { ModelNames } from '../../shared/model_names.config';
import { StatusNames } from '../../shared/variables.config';

export const ${pascalCaseModelName}Schema = new mongoose.Schema({
  _name: { type: String, required: true, default: '' },
  _description: { type: String, required: true, default: '' },
  _branchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: ModelNames.BRANCHES,
    default: null,
  },
  _createdAt: { type: Number, required: true, default: -1 },
  _createdUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: ModelNames.USERS,
    default: null,
  },
  _updatedAt: { type: Number, required: false, default: -1 },
  _updatedUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: ModelNames.USERS,
    default: null,
  },
  _status: { type: Number, enum: StatusNames, required: true, default: -1 },
});

export interface ${pascalCaseModelName} { 
  _id: string;
  _name: string;
  _branchId: string;
  _description: string;
  _createdUserId: string;
  _createdAt: number;
  _updatedUserId: string;
  _updatedAt: number;
  _status: StatusNames;
}

${pascalCaseModelName}Schema.index({ _name: 1, _id: 1 });
${pascalCaseModelName}Schema.index({ _branchId: 1 });
${pascalCaseModelName}Schema.index({ _status: 1 });
${pascalCaseModelName}Schema.index({ _createdAt: 1 });
${pascalCaseModelName}Schema.index(
  { _name: 1, _branchId: 1 },
  { unique: true, partialFilterExpression: { _status: { $lt: 2 } } },
);
${pascalCaseModelName}Schema.post('save', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});
${pascalCaseModelName}Schema.post('insertMany', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});
${pascalCaseModelName}Schema.post('updateOne', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});
${pascalCaseModelName}Schema.post('findOneAndUpdate', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});
${pascalCaseModelName}Schema.post('updateMany', async function (error, doc, next) {
  schemaPostFunctionForDuplicate(error, doc, next);
});
function schemaPostFunctionForDuplicate(error, doc, next) {
  if (error.code == 11000) {
    next(new Error('Name already existing'));
  } else {
    next();
  }
}
// status 0 : default, 1: active, 2: inactive
`;

  const fileName = `${camelCaseModelName}.model.ts`;
  const filePath = path.join(__dirname,"../",inputFilePath, fileName);

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`File ${fileName} has been created.`);
}

// Get model name from command line arguments
const modelName = process.argv[2];

const fileInputPath = process.argv[3] ?? `src/table_models/masters`
 


if (!modelName) {
  console.error('Please provide a model name as an argument.');
  process.exit(1);
}

createSchemaFile(modelName,fileInputPath);
