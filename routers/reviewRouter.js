import express from "express";

import { createBookReviews, updateBookReviews } from "../models/bookModel.js";
import { updateBurrow } from "../models/burrowModel.js";
import { createReview, getManyReview, updateReview } from "../models/reviewModel.js";
import { buildErrorResponse, buildSuccessResponse } from "../utility/responseHelper.js";
import { adminAuth, userAuth } from "../middlewares/auth/authMiddleware.js";
import { newReviewValidation } from "../middlewares/joiValidations/reviewValidation.js";

const reviewRouter = express.Router();


// Public Routes

// GET all reviews
reviewRouter.get("/", userAuth, async(req, res) => {
  try {
    const { role, _id } = req.userInfo

    const reviews = role === "admin" 
                      ? await getManyReview({})
                      : await getManyReview({ status: "active" })

    reviews?.length
      ? buildSuccessResponse(res, reviews, "Reviews")
      : buildErrorResponse(res, "No reviews available")
  } catch (error) {
    buildErrorResponse(res, error.message )
  }
})
// Private Routes

// CREATE a review
reviewRouter.post("/", userAuth, newReviewValidation, async(req, res) => {
  try {
    const review = await createReview(req.body)

    if(review?._id){
      // update burrow to to set has_review: true
      const filter = { _id: review.burrow_id };
      const updatedBurrow = {
        has_review: true,
      }

    await updateBurrow(filter, updatedBurrow)
    await createBookReviews(review)
    }

    review?._id
      ? buildSuccessResponse(res, review, "Thank you for the review.")
      : buildErrorResponse(res, "Something went wrong.")
  } catch (error) {
    buildErrorResponse(res, error.message )
  }
})

// UPDATE a review
reviewRouter.patch("/:_id", adminAuth, async(req, res) => {
  try {
    const { _id } = req.params;
    const { status } = req.body;

    const review = await updateReview({_id}, { status })

    if(review?._id){
    // update book with review inside reviews array
    const result = await updateBookReviews(review)
    }

    review?._id
      ? buildSuccessResponse(res, review, "Review updated.")
      : buildErrorResponse(res, "Something went wrong.")
  } catch (error) {
    buildErrorResponse(res, error.message )
  }
})


export default reviewRouter