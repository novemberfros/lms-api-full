import bookSchema from "./bookSchema.js";

//Create
export const createBook = (bookObj) => {
  return bookSchema(bookObj).save();
};

//read @filter must be an object
export const getAllBooks = (filter) => {
  return bookSchema.find(filter);
};

export const getBookById = (_id) => {
  return bookSchema.findById(_id);
};
export const getABook = (filter) => {
  return bookSchema.findOne(filter);
};

//update book
export const updateBookById = (updatedBookObj) => {
  const { _id } = updatedBookObj
  return bookSchema.findByIdAndUpdate(_id, updatedBookObj);
};

//delete
export const deleteBook = (_id) => {
  return bookSchema.findByIdAndDelete(_id);
};

// create book reviews
export const createBookReviews = (reviewObj) => {
  return bookSchema.findOneAndUpdate(
    {_id: reviewObj.book_id},
    { $push: { reviews: reviewObj }}
  )
}

// update book reviews
export const updateBookReviews = (reviewObj) => {
  
  return bookSchema.findOneAndUpdate(
    {_id: reviewObj.book_id, 'reviews._id': reviewObj._id},
    { $set: { 'reviews.$.status': reviewObj.status }},
    { new: true }
  )
}