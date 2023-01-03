import userSchema from "./userSchema.js";

//user CRUD
//create user

export const createUser = (userData) => {
  return userSchema(userData).save();
};

//get singler user by user's id
export const getUserById = (_id) => {
  return userSchema.findById(_id);
};

//get single user by filter, filter must be an object
export const getAnyUser = (filter) => {
  return userSchema.findOne(filter);
};

//update the user, @_id is string and @updateData is an object
export const updateUserById = (_id, updateData) => {
  return userSchema.findByIdAndUpdate(_id, updateData);
};

//delete user by _id
export const deleteUserById = (_id) => {
  return userSchema.findByIdAndDelete(_id);
};
