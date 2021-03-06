const fs = require("fs");
const { getConnection, sql } = require("../db/connection");
const { queries } = require("../db/queries");
const {
  uploadImage,
  uploadFolders,
  deleteImage,
  deleteImages,
} = require("../helpers/imageManager");

const getMuscles = async (req, res) => {
  try {
    const pool = await getConnection();
    const { recordset } = await pool.request().query(queries.getMusclesData);
    res.json(recordset);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error ocurred when trying to get the data" });
  }
};

/** SQL server returns:
 * status: (201, 404)
 * error: "Invalid email"
 */
const addMuscle = async (req, res) => {
  let addImageResult = null;
  try {
    //Upload image to cloudinary
    addImageResult = await uploadImage(req.files.image, uploadFolders.muscles);
    if (addImageResult.status === 200) {
      const { name } = req.body;
      const uid = req.uid;
      const pool = await getConnection();
      const { recordset } = await pool
        .request()
        .input("name", sql.VarChar, name)
        .input("imageName", sql.VarChar, req.files.image.name)
        .input("imageUrl", sql.VarChar, addImageResult.imageUrl)
        .input("userId", sql.Int, uid)
        .query(queries.addMuscle);

      if (recordset[0].status !== 201 && addImageResult.status === 200) {
        //Delete image because the muscle was not saved in the database
        deleteImage(addImageResult.imageUrl, uploadFolders.muscles);
      }

      // Muscle saved successfully
      return res.status(recordset[0].status).json({
        muscleId: recordset[0].muscleId,
        imageUrl: addImageResult.imageUrl,
        imageName: req.files.image.name,
      });
    }

    return res.status(imageResult.status).json({ error: imageResult.error });
  } catch (error) {
    if (addImageResult) {
      deleteImage(addImageResult.imageUrl, uploadFolders.muscles);
    }
    console.log(error);
    return res
      .status(500)
      .json({ error: "An error ocurred when inserting a new muscle" });
  }
};

const updateMuscle = async (req, res) => {
  try {
    const { name, imageName, imageUrl } = req.body;
    let newImageUrl = imageUrl; //contains the original image url of the exercise
    let newImageName = imageName; //contains the original image name
    let uploadImageResult;
    //Upload image to cloudinary if there is a new image
    const image = req.files?.newImage;
    if (image) {
      uploadImageResult = await uploadImage(image, uploadFolders.muscles);
      if (uploadImageResult.status !== 200)
        return res
          .status(uploadImageResult.status)
          .json({ error: uploadImageResult.error });

      newImageUrl = uploadImageResult.imageUrl;
      newImageName = image.name;
    }

    const { id } = req.params;
    const uid = req.uid;
    const pool = await getConnection();
    const { recordset } = await pool
      .request()
      .input("id", sql.Int, id)
      .input("name", sql.VarChar, name)
      .input("imageName", sql.VarChar, newImageName) //contains either the original image name or the new one
      .input("imageUrl", sql.VarChar, newImageUrl) //contains either the original image name or the new one
      .input("userId", sql.Int, uid)
      .query(queries.updateMuscle);

    if (image) {
      //Check if the muscle was updated
      if (recordset[0].status === 200) {
        // The exercise was updated successfully, we can proceed to delete the original image
        deleteImage(imageUrl, uploadFolders.muscles);

        return res
          .status(recordset[0].status)
          .json({ imageUrl: newImageUrl, imageName: newImageName });
      } else {
        if (uploadImageResult.status === 200) {
          // Delete the new image uploaded because the exercise was not updated in the database
          deleteImage(newImageUrl, uploadFolders.muscles);
        }

        return res
          .status(recordset[0].status)
          .json({ error: recordset[0].error });
      }
    }
    // recordset contains an error if something went wrong, otherwise the status code
    return res.status(recordset[0].status).json(recordset[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error ocurred when updating a muscle" });
  }
};

const deleteMuscle = async (req, res) => {
  try {
    const { id } = req.params;
    const { imageUrl, deleteExercises } = req.body;
    const uid = req.uid;
    const pool = await getConnection();
    const { recordset } = await pool
      .request()
      .input("id", sql.Int, id)
      .input("userId", sql.Int, uid)
      .input("deleteExercises", sql.Bit, deleteExercises)
      .query(queries.deleteMuscle);

    if (recordset[0].status === 200) {
      //Delete muscle image
      deleteImage(imageUrl, uploadFolders.muscles);
      //Check if it is needed to delete the exercises
      if (recordset[0].imageUrls) {
        deleteImages(recordset[0].imageUrls, "||", uploadFolders.exercises);
        //delete the urls to avoid returning this data, it is unnecessary in the frontend
        delete recordset[0].imageUrls;
      }
    }
    return res.status(recordset[0].status).json(recordset[0]);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "An error ocurred when deleting a muscle" });
  }
};

module.exports = {
  getMuscles,
  addMuscle,
  updateMuscle,
  deleteMuscle,
};
