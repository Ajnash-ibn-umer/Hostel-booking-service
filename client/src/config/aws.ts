const S3_BUCKET = process.env.S3_BUCKET || "ajn-p1-2024";
const REGION = process.env.REGION || "ap-south-1";
const ACCESS_KEY = process.env.ACCESS_KEY || "AKIAYS2NW4XTFEBTEEND";
const SECRET_ACCESS_KEY =
  process.env.SECRET_ACCESS_KEY || "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";
// @ts-ignore
import { uploadFile } from "react-s3";
const config = {
  bucketName: S3_BUCKET,
  region: REGION,
  dirName: "oxtal",
  accessKeyId: ACCESS_KEY,
  secretAccessKey: SECRET_ACCESS_KEY,
};

export const s3Upload = async (files: File[]) => {
  const responses: any[] = [];

  return new Promise(async (resolve, reject) => {
    console.log({ config });
    try {
      for (let file of files) {
        console.log({ file });
        const resp = await uploadFile(file, config);

        responses.push(resp);
      }
    } catch (error) {
      reject(error);
    }

    resolve(responses);
  });
};
