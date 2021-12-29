const { getConnection, sql } = require("../db/connection");
const { queries } = require("../db/queries");
const fs = require("fs");
const {
  uploadImage,
  deleteImage,
  uploadFolders,
} = require("../helpers/imageManager");

const getExercisesById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getConnection();
    const { recordset } = await pool
      .request()
      .input("id", sql.Int, id)
      .query(queries.getExercisesById);
    res.json(recordset);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error ocurred when trying to get the data" });
  }
};

/** SQL server returns:
 * status: 201, 404, etc
 * error: "Invalid email" or result: "User added"
 * exerciseId: 1 (when there are no errors)
 */
const addExercise = async (req, res) => {
  try {
    //Upload image to cloudinary
    const imageResult = await uploadImage(
      req.files.image,
      uploadFolders.exercises
    );

    if (imageResult.status === 200) {
      //Add exercise to the database
      const { name, description, muscleId } = req.body;
      const uid = req.uid;
      const pool = await getConnection();
      const { recordset } = await pool
        .request()
        .input("name", sql.VarChar, name)
        .input("description", sql.VarChar, description)
        .input("imageName", sql.VarChar, req.files.image.name)
        .input("imageUrl", sql.VarChar, imageResult.imageUrl)
        .input("muscleId", sql.Int, muscleId)
        .input("userId", sql.Int, uid)
        .query(queries.addExercise);

      if (recordset[0].status !== 201) {
        //Delete image because the exercise was not inserted in the database
        const deleteImageResult = await deleteImage(
          imageResult.imageUrl,
          uploadFolders.exercises
        );
        if (deleteImageResult.status !== 200)
          console.log(deleteImageResult.error);
      }

      return res
        .status(recordset[0].status)
        .json({ ...recordset[0], imageUrl: imageResult.imageUrl });
    }
    return res.status(imageResult.status).json({ error: imageResult.error });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "An error ocurred when inserting a new exercise" });
  }
};

const updateExercise = async (req, res) => {
  try {
    const { name, description, imageName, imageUrl, muscleId } = req.body;
    let newImageUrl = imageUrl; //contains the original image url of the exercise
    let newImageName = imageName; //contains the original image name

    const image = req.files?.newImage;
    //There is a new image to update
    if (image) {
      const uploadImageResult = await uploadImage(
        image,
        uploadFolders.exercises
      );
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
      .input("description", sql.VarChar, description)
      .input("imageName", sql.VarChar, newImageName)
      .input("imageUrl", sql.VarChar, newImageUrl)
      .input("muscleId", sql.Int, muscleId)
      .input("userId", sql.Int, uid)
      .query(queries.updateExercise);

    if (image) {
      //Check if the exercise was updated
      if (recordset[0].status === 200) {
        // The exercise was updated successfully, we can proceed to delete the original image
        const deleteImageResult = await deleteImage(
          imageUrl,
          uploadFolders.exercises
        );
        if (deleteImageResult.status !== 200)
          console.log(deleteImageResult.error);
        return res
          .status(recordset[0].status)
          .json({ imageUrl: newImageUrl, imageName: newImageName });
      } else {
        // Delete the new image uploaded because the exercise was not updated in the database
        const deleteImageResult = await deleteImage(
          newImageUrl,
          uploadFolders.exercises
        );
        if (deleteImageResult.status !== 200)
          console.log(deleteImageResult.error);
        return res
          .status(recordset[0].status)
          .json({ error: recordset[0].error });
      }
    }
    return res.status(recordset[0].status).json(recordset[0]);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error ocurred when updating an exercise" });
  }
};

const deleteExercise = async (req, res) => {
  try {
    const { id } = req.params;
    const { imageUrl } = req.body;
    const uid = req.uid;
    const pool = await getConnection();
    const { recordset } = await pool
      .request()
      .input("exerciseId", sql.Int, id)
      .input("userId", sql.Int, uid)
      .query(queries.deleteExercise);

    if (recordset[0].status === 200) {
      const deleteImageResult = await deleteImage(
        imageUrl,
        uploadFolders.exercises
      );
      if (deleteImageResult.status !== 200)
        console.log(deleteImageResult.error);
    }
    res.status(recordset[0].status).json(recordset[0]);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error ocurred when deleting an exercise" });
  }
};

module.exports = {
  getExercisesById,
  addExercise,
  updateExercise,
  deleteExercise,
};
