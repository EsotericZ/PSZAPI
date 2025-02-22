import query from '../db/index.js';

export const updateBacklog = async (req, res) => {
  const {igdbId, userId} = req.body;
  console.log(igdbId, userId);
}

export const backlogController = {
  updateBacklog,
}