import ReviewSchema from "./reviewSchema.js";

//Create
export const createReview = (reviewObj) => {
  return ReviewSchema(reviewObj).save();
};

// return many review as an array
export const getManyReview = (filter) => {
  return ReviewSchema.find(filter);
};

// update
export const updateReview = (filter, update) => {
  return ReviewSchema.findOneAndUpdate(filter, update);
};
