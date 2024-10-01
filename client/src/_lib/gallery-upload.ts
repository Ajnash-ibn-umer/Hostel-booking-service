import { s3Upload } from "@/config/aws";

interface IfileUploadLib {
  images: File[];
  createGallery: Function;
}

export default ({ images,createGallery }: IfileUploadLib):Promise<string[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      if (images && images.length > 0) {
        const fileUploadReponses: any[] = (await s3Upload(images)) as any;
        console.log("file UploadReponses", fileUploadReponses);
        const galleryData = fileUploadReponses.map((resp: any) => ({
          docType: 1,
          name: resp.key,
          url: resp.location,
        }));
        // console.log({ images });
        // console.log({ galleryData });

        const galleryInput = {
          createGalleryInput: {
            galleryData: galleryData,
          },
        };

        console.log({ galleryInput });

        const { data: galleryResponse, errors: galleryErr } =
          await createGallery({
            variables: galleryInput,
          });

        if (galleryErr) {
          throw galleryErr;
        }
        const galleryResp = galleryResponse.Gallery_Multi_Create || null;
        if (!galleryResp || galleryResp.length === 0) {
          throw "Image upload Response not found";
        }

        resolve(galleryResp.map((g: any) => g._id));
      }
    } catch (error) {
      reject(error);
    }
  });
};










