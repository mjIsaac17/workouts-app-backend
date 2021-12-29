const { getConnection, sql } = require("../db/connection");
const { queries } = require("../db/queries");
const fs = require("fs");
const {
  uploadImage,
  uploadFolders,
  deleteImage,
} = require("../helpers/imageManager");

const getWorkoutsByUserId = async (req, res) => {
  try {
    const uid = req.uid;
    const pool = await getConnection();
    const { recordset } = await pool
      .request()
      .input("userId", sql.Int, uid)
      .query(queries.getWorkoutsByUserId);
    if (!recordset.status)
      //the data has no status code in the response
      res.status(200).json(recordset);
    else res.status(recordset[0].status).json(recordset[0]);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error ocurred when trying to obtain the workouts" });
  }
};

const addWorkout = async (req, res) => {
  let addImageResult = {
    imageUrl: null,
    imageName: null,
  };

  try {
    const image = req.files?.image;
    if (image) {
      addImageResult = await uploadImage(image, uploadFolders.workouts);
    }

    const { name, description, exerciseIds } = req.body;
    const uid = req.uid;
    // let imageFile = req.files;
    const pool = await getConnection();
    const { recordset } = await pool
      .request()
      .input("name", sql.VarChar, name)
      .input("description", sql.VarChar, description)
      .input("imageName", sql.VarChar, addImageResult.imageName)
      .input("imageUrl", sql.VarChar, addImageResult.imageUrl)
      .input("userId", sql.Int, uid)
      .input("exerciseIds", sql.VarChar, exerciseIds)
      .query(queries.addWorkout);

    if (addImageResult?.imageUrl) {
      if (recordset[0].status !== 201) {
        //Delete image because the workout was not saved in the database
        deleteImage(addImageResult.imageUrl, uploadFolders.workouts);
      } else {
        //Image and workout saved successfully
        return res.status(recordset[0].status).json({
          workoutId: recordset[0].workoutId,
          imageName: image.name,
          imageUrl: addImageResult.imageUrl,
        });
      }
    }

    // recordset contains an error if something went wrong, otherwise the status code and workout id
    return res.status(recordset[0].status).json(recordset[0]);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "An error ocurred when inserting a new workout" });
  }
};

const getWorkoutExercises = async (req, res) => {
  try {
    const { workoutName } = req.params;
    const uid = req.uid;
    const pool = await getConnection();
    const { recordset } = await pool
      .request()
      .input("workoutName", sql.VarChar, workoutName)
      .input("userId", sql.Int, uid)
      .query(queries.getWorkoutExercises);
    if (!recordset[0].status)
      //the data has no status code in the response, it is valid
      res.status(200).json(recordset);
    else res.status(recordset[0].status).json(recordset[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: `An error ocurred when trying to obtain the exercises of '${workoutName} workout'`,
    });
  }
};

const updateWorkout = async (req, res) => {
  try {
    const { name, description, exerciseIds, imageName, imageUrl } = req.body;
    let newImageUrl = imageUrl; //contains the original image url of the exercise
    let newImageName = imageName; //contains the original image name

    //Upload image to cloudinary if there is a new image
    const image = req.files?.newImage;
    if (image) {
      const uploadImageResult = await uploadImage(
        image,
        uploadFolders.workouts
      );
      if (uploadImageResult.status !== 200)
        return res
          .status(uploadImageResult.status)
          .json({ error: uploadImageResult.error });

      newImageUrl = uploadImageResult.imageUrl;
      newImageName = image.name;
    }
    const { id } = req.params;
    const pool = await getConnection();
    const { recordset } = await pool
      .request()
      .input("workoutId", sql.Int, id)
      .input("name", sql.VarChar, name)
      .input("description", sql.VarChar, description)
      .input("imageName", sql.VarChar, newImageName)
      .input("imageUrl", sql.VarChar, newImageUrl)
      .input(
        "exerciseIds",
        sql.VarChar,
        exerciseIds === "null" ? null : exerciseIds
      )
      .query(queries.updateWorkout);

    if (image) {
      // Check if the workout was updated
      if (recordset[0].status === 200) {
        //Validate that there is an original image to delete
        if (imageUrl) {
          // The exercise was updated successfully, we can proceed to delete the original image
          deleteImage(imageUrl, uploadFolders.workouts);
          return res
            .status(recordset[0].status)
            .json({ imageUrl: newImageUrl, imageName: newImageName });
        }
      } else {
        // Delete the new image uploaded because the workout was not updated in the database
        deleteImage(newImageUrl, uploadFolders.workouts);

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
      .json({ error: "An error ocurred when updating the workout" });
  }
};

const deleteWorkout = async (req, res) => {
  try {
    const { id } = req.params;
    const { imageUrl } = req.body;
    const pool = await getConnection();
    const { recordset } = await pool
      .request()
      .input("workoutId", sql.Int, id)
      .query(queries.deleteWorkout);

    if (recordset[0].status === 200) {
      if (imageUrl)
        //Delete previous image (if exists)
        deleteImage(imageUrl, uploadFolders.workouts);
    } else console.log(recordset);

    return res.status(recordset[0].status).json(recordset[0]);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error ocurred when deleting the workout" });
  }
};

module.exports = {
  addWorkout,
  getWorkoutsByUserId,
  getWorkoutExercises,
  updateWorkout,
  deleteWorkout,
};
