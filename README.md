# Workouts app (backend)

This project is a Node JS API RESTful that uses Microsoft SQL server as database.

Authentication is using JWT.

## Installation

1. Install node modules

```
    cd backend-workouts-app
    npm install
```

2. Create the database WorkoutApp in SQL server, you can use the .bak file from the db folder:

- https://github.com/mjIsaac17/workouts-app-backend/tree/main/db

3. Create your .env file with the same variables from .env.sample to connect to your SQL server database

To store the images for the application, Cloudinary was used as host.

4. Create an account in [Cloudinary](https://cloudinary.com/users/register/free) and copy your api key in the .env file

5. Launch the application

```
    npm start
```
