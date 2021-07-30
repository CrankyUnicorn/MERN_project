import mongoose from "mongoose";
import { PostMessage } from "../models/postsMessage.js";


export const getPosts = async (req, res) => {
  try {
    const postMessages = await PostMessage.find();

    res.status(200).json(postMessages);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};


export const createPost = async (req, res) => {
  const post = req.body;

  const newPost = new PostMessage(post);

  try {
    await newPost.save();

    res.status(201).json(newPost);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};


export const updatePost = async (req, res) => {
  /* deconstruct req.params gets element with key id and set it into a new 
  variable of name _id */
  const { id: _id } = req.params;
  const post = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).json("Didn't find any document with that id.");
  }

  /* findIdAndUpdate takes 3 agruments one is the id of the document the
      the second is the document and his values to be rewriten and last an 
      object with key value to define if the value should be updated before 
      the respose takes place this is usefull so the result of the update
      can be seen after the operation takes place*/
  const updatedMessages = await PostMessage.findByIdAndUpdate(
    _id,
    post,
    { new: true }
  );

  res.status(201).json(updatedMessages);
};


export const deletePost = async (req, res) => {
  /* deconstruct req.params gets element with key id and set it into a new 
  variable of name _id */
  const { id: _id } = req.params;
  
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).json("Didn't find any document with that id.");
  }

  /* findIdAndDelete may takes 3 agruments but its only essential that 
      you pass the _id of the document that you want to delete.
      https://mongoosejs.com/docs/api.html#model_Model.findByIdAndDelete*/
  await PostMessage.findByIdAndDelete(_id);

  res.status(201).json("Post deleted with success.");
};


export const likePost = async (req, res) => {
  /* deconstruct req.params gets element with key id and set it into a new 
  variable of name _id */
  const { id: _id } = req.params;
  
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).json("Didn't find any document with that id.");
  }

  const post = await PostMessage.findById( _id );
  
  /* same as other functions*/
  const updatedPost = await PostMessage.findByIdAndUpdate(
    _id,
    { likeCount: post.likeCount + 1 },
    { new: true }
  );

  res.status(201).json(updatedPost);
};