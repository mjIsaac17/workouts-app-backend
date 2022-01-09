const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const uploadFolders = {
  exercises: "exercises",
  muscles: "muscles",
  workouts: "workouts",
};

const uploadImage = async (image, uploadFolder = "") => {
  try {
    if (!image) return { status: 400, error: "There is no image to upload" };

    const { tempFilePath } = image;
    const resp = await cloudinary.uploader.upload(tempFilePath, {
      folder: `WorkoutsApp/${uploadFolder}/`,
    });

    if (!resp.secure_url)
      return {
        status: 500,
        error: "It was not possible to upload the image",
      };

    return { status: 200, imageUrl: resp.secure_url };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      error: "An error ocurred when uploading the image",
    };
  }
};

const deleteImage = async (imageUrl, folder = "") => {
  try {
    const pathArr = imageUrl.split("/"); // https://res.cloudinary.com/dajuhzxdz/image/upload/v1629693928/fqae4hvyrmrqmpa4drpy.jpg
    const imageName = pathArr[pathArr.length - 1]; // fqae4hvyrmrqmpa4drpy.jpg
    const [imageId] = imageName.split("."); // fqae4hvyrmrqmpa4drpy
    await cloudinary.uploader.destroy(`WorkoutsApp/${folder}/${imageId}`);
    return { status: 200 };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      error: "An error ocurred when deleting the image",
    };
  }
};

const deleteImages = async (imageUrls, separator = "||", folder) => {
  const arrImageUrls = imageUrls.split(separator);
  arrImageUrls.forEach((imageUrl) => deleteImage(imageUrl, folder));
};

module.exports = {
  uploadImage,
  deleteImage,
  deleteImages,
  uploadFolders,
};
