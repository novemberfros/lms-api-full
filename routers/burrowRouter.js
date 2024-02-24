import express from "express"
import { updateBookById } from "../models/bookModel.js";
import { createBurrow, getManyBurrow, updateBurrow } from "../models/burrowModel.js";
import { buildErrorResponse, buildSuccessResponse } from "../utility/responseHelper.js";
import { userAuth } from "../middlewares/auth/authMiddleware.js";
import { newBurrowValidation } from "../middlewares/joiValidations/burrowValidation.js";

const burrowRouter = express.Router();

// Private Routes
// GET all burrows
burrowRouter.get("/", userAuth, async(req, res) => {
  try {
    const { role, _id } = req.userInfo

    const burrows = role === "admin" 
                      ? await getManyBurrow({})
                      : await getManyBurrow({ user_id: _id })

    burrows?.length
      ? buildSuccessResponse(res, burrows, "Burrows")
      : buildErrorResponse(res, "No burrows available")
  } catch (error) {
    buildErrorResponse(res, error.message )
  }
})


// CREATE a burrow
burrowRouter.post("/", userAuth, newBurrowValidation, async(req, res) => {
  try {
    const burrow = await createBurrow(req.body)

    // if a burrow is created, the book which is burrow is no more available
    if (burrow?._id){
      await updateBookById({
        _id: burrow.book_id,
        is_available: false,
        due_date: req.body.due_date,
      })
    }

    burrow?._id
      ? buildSuccessResponse(res, burrow, "You have successfully borrowed this book, you can check your burrow history to find this information")
      : buildErrorResponse(res, "Unable to burrow the book , please contact adminstration.")
  } catch (error) {
    buildErrorResponse(res, error.message )
  }
})

// UPDATE/Reutrn a burrow
burrowRouter.patch("/:_id", userAuth, async(req, res) => {
  try {
    const { _id } = req.params;
    const user = req.userInfo;

    const filter = { _id, user_id: user?._id };
    const updatedBurrow = {
      is_returned: true,
      returned_date: Date(),
    };

    const burrow = await updateBurrow(filter, updatedBurrow)

    if (burrow?._id){
      await updateBookById({
        _id: burrow.book_id,
        is_available: true,
        due_date: null,
      })
    }

    burrow?._id
      ? buildSuccessResponse(res, burrow, "You have successfully returned the book")
      : buildErrorResponse(res, "Unable to return the burrowed book")
  } catch (error) {
    buildErrorResponse(res, error.message )
  }
})

export default burrowRouter