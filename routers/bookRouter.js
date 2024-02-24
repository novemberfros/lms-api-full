import express from "express"
import { createBook, getAllBooks, getBookById, updateBookById } from "../models/bookModel.js";
import { buildErrorResponse, buildSuccessResponse } from "../utility/responseHelper.js";
import { adminAuth } from "../middlewares/auth/authMiddleware.js";
import { newBookValidation, updateBookValidation } from "../middlewares/joiValidations/bookValidation.js";
const bookRouter = express.Router();

// Public routes
// GET all books
bookRouter.get("/", async(req, res) => {
  try {
    const books = await getAllBooks()

    books?.length
      ? buildSuccessResponse(res, books, "All Books")
      : buildErrorResponse(res, "No books available")
  } catch (error) {
    buildErrorResponse(res, "No books available")
  }
})

// GET book
bookRouter.get("/:_id", async(req, res) => {
  try {
    const book = await getBookById(req.params._id)

    book?._id
      ? buildSuccessResponse(res, book, "Book")
      : buildErrorResponse(res, "No book available")
  } catch (error) {
    buildErrorResponse(res, "No book available")
  }
})

// Private routes

// CREATE a book
bookRouter.post("/", adminAuth, newBookValidation, async(req, res) => {
  try {
    if(req.userInfo.role !== "admin"){
      return buildErrorResponse(res, "Not Authroized to create a book")
    }
    
    const book = await createBook(req.body)

    book?._id
      ? buildSuccessResponse(res, book, "Book created Successfully")
      : buildErrorResponse(res, "Unable to create a book")
  } catch (error) {
    if(error.code === 11000){
      error.message = "There is another book that has similar ISBN. Plase change the isbn and try again"
    }
    buildErrorResponse(res, error.message )
  }
})

// UPDATE a book
bookRouter.patch("/", adminAuth, updateBookValidation, async(req, res) => {
  try {
    if(req.userInfo.role !== "admin"){
      return buildErrorResponse(res, "Not Authroized to update a book")
    }
    
    const book = await updateBookById(req.body)

    book?._id
      ? buildSuccessResponse(res, book, "Book created Successfully")
      : buildErrorResponse(res, "Unable to create a book")
  } catch (error) {
    if(error.code === 11000){
      error.message = "There is another book that has similar ISBN. Plase change the isbn and try again"
    }
    buildErrorResponse(res, error.message )
  }
})

export default bookRouter