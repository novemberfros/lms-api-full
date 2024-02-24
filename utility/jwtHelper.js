import jwt from "jsonwebtoken"
import { createSession } from "../models/sessionModel.js"
import { updateRefreshJWT } from "../models/userModel.js"

// generate access token JWT | create a session record
// secret_key
// node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
export const generateAccessJWT = (email) => {
  try {
    const access_token = jwt.sign({ email }, process.env.ACCESS_JWT_SECRET_KEY, { expiresIn: "15m"})

  // create a session record
    createSession({ token: access_token })

    return access_token
  } catch (error) {
    console.log(error);
  }
  
}

// refresh JWT | update user record with new refreshJWT
export const generateRefreshJWT = (email) => {
  try {
    const refresh_token = jwt.sign({ email }, process.env.REFRESH_JWT_SECRET_KEY, { expiresIn: "30d"})

  // update user with referesh token
      updateRefreshJWT(email, refresh_token)

      return refresh_token
  } catch (error) {
    
  }
}

// create access token and refresh token [generate token]
export const generateJWTs = (email) => {
  return {
    accessJWT: generateAccessJWT(email),
    refreshJWT: generateRefreshJWT(email),
  }
}

// verify access token and return decoded email
export const verifyAccessJWT = (accessJWT) => {
  return jwt.verify(accessJWT, process.env.ACCESS_JWT_SECRET_KEY);
};

// verify refresh token and return decoded email
export const verifyRefreshJWT = (refreshJWT) => {
  return jwt.verify(refreshJWT, process.env.REFRESH_JWT_SECRET_KEY);
};
