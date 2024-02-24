import { getSession } from "../../models/sessionModel.js"
import { findUserByEmail } from "../../models/userModel.js"
import { generateAccessJWT, verifyAccessJWT, verifyRefreshJWT } from "../../utility/jwtHelper.js"
import { buildErrorResponse, buildSuccessResponse } from "../../utility/responseHelper.js"

// check and validate the user based in JWT access token
const getUserFromAccessJWT = async(token) => {
  // check if token exist or not in session table
  const tokenExist = await getSession(token)
  if(!tokenExist?._id){
    return false
  }
  // validate accessJWT
  const decodedToken = verifyAccessJWT(token)
  // decode accessJWT to get user email
  if(decodedToken?.email){
    // get user based on the decoded email
    const user = await findUserByEmail(decodedToken.email)

    if(user?._id){
      user.password = undefined
      return user
    }
  }

  return false
}

export const userAuth = async(req, res, next) => {
  try {
    const { authorization }  = req.headers

    const user = await getUserFromAccessJWT(authorization)
    if(user?._id){
      user.password = undefined
      req.userInfo = user
      return next()
    }

    throw new Error("Invalid token, unauthorized");
  } catch (error) {
    next(error)
  }
}

export const refreshAuth = async(req, res) => {
  try {
    const { authorization } = req.headers
    // validate and decode refresh token
        const decoded = verifyRefreshJWT(authorization)

    // get the user based on email and generate new access token for the user
    if(decoded?.email){
      const user = await findUserByEmail(decoded.email)

      if(user?._id){
        // generate new access token and return back that token to client
        const accessJWT = generateAccessJWT(user.email)

        return buildSuccessResponse(res, accessJWT, "New Access Token")
      }
    }

    throw new Error("Invalid token!!")
  } catch (error) {
    return buildErrorResponse(res, error.message)
  }
}

// Admin auth
export const adminAuth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    // validate if accessJWT is valid
    const user = await getUserFromAccessJWT(authorization);

    if (user?.role === "admin") {
      // everyting is true above then set userinfo in req obj and sent to the next middleware
      user.password = undefined;
      req.userInfo = user;

      return next()
    }

    throw new Error("Invalid token or unauthorized")
  } catch (error) {
    next(error)
  }
}