import express from "express"
import { comparePassword, hashPassword } from "../utility/bcryptHelper.js"
import { createUser, findUserByEmail, findUsers, updateRefreshJWT } from "../models/userModel.js"
import { buildErrorResponse, buildSuccessResponse } from "../utility/responseHelper.js"
import { newUserValidation } from "../middlewares/joiValidations/userValidation.js"
import { generateJWTs } from "../utility/jwtHelper.js"
import { adminAuth, refreshAuth, userAuth } from "../middlewares/auth/authMiddleware.js"
import { deleteSession } from "../models/sessionModel.js"

const userRouter = express.Router()

// Creating User | Signup
userRouter.post("/", newUserValidation ,async(req, res) => {
  try {
    // hash password
    const { password } = req.body
    const hashedPassword = hashPassword(password)

    const result = await createUser({
      ...req.body,
      password: hashedPassword
    })

    result?._id
      ? buildSuccessResponse(res, result, "User created Successfully")
      : buildErrorResponse(res, "Could not create user!!")
  } catch (error) {
    if(error.code === 11000){
      error.message = "User with this email already exists!!"
    }

    buildErrorResponse(res, error.message)
  }
})

// user login route
userRouter.post("/login", async(req, res) => {
  try {
    const { email, password } = req.body

    // find user by email
    const user = await findUserByEmail(email)

    if(user?._id){
      // compare the password
      const isPasswordMatched = comparePassword(password, user.password)

      const jwt = generateJWTs(email)
      return isPasswordMatched
                ? buildSuccessResponse(res, jwt, "Logged in successfully")
                : buildErrorResponse(res, "Invalid Credentials!!")
    }
    buildErrorResponse(res, "Invalid Credentials!!")
  } catch (error) {
    buildErrorResponse(res, "Invalid Credentials!!")
  }
})

// PRIATE | PROTECTED ROUTES
userRouter.get("/", userAuth, (req, res) => {
  try {
    buildSuccessResponse(res, req.userInfo, "User Info")
  } catch (error) {
    buildErrorResponse(res, error.message)
  }
})

export default userRouter


// GET NEW ACCESS TOKE
userRouter.get("/accessjwt", refreshAuth)

// Logout User

userRouter.post("/logout", async(req, res)=> {
  try {
    const { email, accessJWT } = req.body

    //remove session for the user
    await deleteSession(accessJWT)

    // update[remove] refreshJWT for the user
    await updateRefreshJWT(email, "")

    buildSuccessResponse(res, {}, "Bye, See you again!!")
  } catch (error) {
    buildErrorResponse(res, error.message)
  }
})

// GET USERS ROUTE
userRouter.get("/users", adminAuth, async(req, res) => {
  try {
    const users = await findUsers()
    buildSuccessResponse(res, users, "User Info")
  } catch (error) {
    buildErrorResponse(res, error.message)
  }
})

// Creating User
userRouter.post("/createUser", adminAuth, async(req, res) => {
  try {
    if(req.userInfo.role !== "admin"){
      return buildErrorResponse(res, "Not Authroized to create a user")
    }

    const { password } = req.body
    //hash password
    const encryptedPassword = hashPassword(password)

    const result = await createUser({
      ...req.body,
      password: encryptedPassword,
    })

    result?._id
      ? buildSuccessResponse(res, result, "User created Successfully.") 
      : buildErrorResponse(res, "Could not register the user")

  }catch(error){
    if(error.code === 11000){
      error.message = "User with this email already exists!!"
    }

    buildErrorResponse(res, error.message)
  }
})