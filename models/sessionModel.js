import sessionSchema from "./sessionSchema.js";

//Create
export const createSession = (sessionObj) => {
  return sessionSchema(sessionObj).save();
};

//read @filter must be an object
export const getSession = (token) => {
  return sessionSchema.findOne({token});
};

// delete session
export const deleteSession = (accessJWT) => {
  return sessionSchema.findOneAndDelete({ token: accessJWT })
}