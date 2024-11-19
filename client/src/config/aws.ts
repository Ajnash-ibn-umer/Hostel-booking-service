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
  return new Promise(async (resolve, reject) => {
    console.log({ config });
    const responses: any[] = [];

    try {
      for (let file of files) {
        console.log("file name", file);
        const lastDotIndex = file.name.lastIndexOf(".");
        const baseName = file.name.substring(0, lastDotIndex); // Get everything before the last dot
        const extension = file.name.substring(lastDotIndex + 1); // Get everything after the last dot
        const newFileName = `${baseName}-${Date.now()}.${extension}`;
        console.log("file name alter", newFileName);

        console.log("bucket", { file });
        const myNewFile = await new File([file], newFileName ?? file.name, {
          type: file.type,
        });
        responses.push(uploadFile(myNewFile, config));
      }
      const resp = await Promise.all(responses);
      console.log({ resp });
      resolve(resp);
    } catch (error) {
      console.log({ error });
      reject(error);
    }
  });
};
