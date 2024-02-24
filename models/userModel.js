import userSchema from "./userSchema.js";

// This file talks to database | user table

// All Users
export const findUsers = () => {
  return userSchema.find({})
}

// create a user
export const createUser = (userObj) => {
  return userSchema(userObj).save()
}

// Find user by email
export const findUserByEmail = (email) => {
  return userSchema.findOne({ email })
}

// update users referesh token
export const updateRefreshJWT = (email, refreshJWT) => {
  return userSchema.findOneAndUpdate({ email }, { refreshJWT })
}