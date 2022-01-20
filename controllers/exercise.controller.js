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
  let addImageResult;
  try {
    //Upload image to cloudinary
    addImageResult = await uploadImage(
      req.files.image,
      uploadFolders.exercises
    );

    if (addImageResult.status === 200) {
      //Add exercise to the database
      const { name, description, muscleNames } = req.body;
      const uid = req.uid;
      const pool = await getConnection();
      const { recordset } = await pool
        .request()
        .input("name", sql.VarChar, name)
        .input("description", sql.VarChar, description)
        .input("imageName", sql.VarChar, req.files.image.name)
        .input("imageUrl", sql.VarChar, addImageResult.imageUrl)
        .input("muscleNames", sql.VarChar, muscleNames)
        .input("userId", sql.Int, uid)
        .query(queries.addExercise);

      if (recordset[0].status !== 201 && addImageResult.status === 200) {
        //Delete image because the exercise was not inserted in the database
        deleteImage(addImageResult.imageUrl, uploadFolders.exercises);
      }

      return res.status(recordset[0].status).json({
        ...recordset[0],
        imageUrl: addImageResult.imageUrl,
        imageName: req.files.image.name,
      });
    }
    return res
      .status(addImageResult.status)
      .json({ error: addImageResult.error });
  } catch (error) {
    console.log(error);
    if (addImageResult?.status === 200)
      deleteImage(addImageResult.imageUrl, uploadFolders.exercises);
    return res
      .status(500)
      .json({ error: "An error ocurred when inserting a new exercise" });
  }
};

const addExistingExercise = async (req, res) => {
  try {
    const { id } = req.params;
    const { muscleId } = req.body;
    const uid = req.uid;
    const pool = await getConnection();
    const { recordset } = await pool
      .request()
      .input("exerciseId", sql.Int, id)
      .input("muscleId", sql.VarChar, muscleId)
      .input("userId", sql.Int, uid)
      .query(queries.addExistingExercise);

    return res.status(recordset[0].status).json(recordset[0]);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "An error ocurred when adding the exercise" });
  }
};

const updateExercise = async (req, res) => {
  try {
    const {
      name,
      description,
      imageName,
      imageUrl,
      updateMuscles,
      muscleNames,
    } = req.body;
    let newImageUrl = imageUrl; //contains the original image url of the exercise
    let newImageName = imageName; //contains the original image name
    let uploadImageResult;

    const image = req.files?.newImage;
    //There is a new image to update
    if (image) {
      uploadImageResult = await uploadImage(image, uploadFolders.exercises);
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
      .input("updateMuscles", sql.Bit, updateMuscles === "true") // formData parses data to string
      .input("muscleNames", sql.VarChar, muscleNames)
      .input("userId", sql.Int, uid)
      .query(queries.updateExercise);

    if (image) {
      //Check if the exercise was updated
      if (recordset[0].status === 200) {
        // The exercise was updated successfully, we can proceed to delete the original image
        deleteImage(imageUrl, uploadFolders.exercises);

        return res
          .status(recordset[0].status)
          .json({ imageUrl: newImageUrl, imageName: newImageName });
      } else {
        if (uploadImage?.status === 200) {
          // Delete the new image uploaded because the exercise was not updated in the database
          deleteImage(newImageUrl, uploadFolders.exercises);
        }
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
      deleteImage(imageUrl, uploadFolders.exercises);
    }
    return res.status(recordset[0].status).json(recordset[0]);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "An error ocurred when deleting an exercise" });
  }
};

module.exports = {
  getExercisesById,
  addExercise,
  addExistingExercise,
  updateExercise,
  deleteExercise,
};
