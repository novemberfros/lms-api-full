import burrowSchema from "./burrowSchema.js";

//Create
export const createBurrow = (burrowObj) => {
  return burrowSchema(burrowObj).save();
};

// return many burrow as an array
export const getManyBurrow = (filter) => {
  return burrowSchema.find(filter);
};

// update
export const updateBurrow = (filter, updatedBurrow) => {
  return burrowSchema.findOneAndUpdate(filter, updatedBurrow);
};