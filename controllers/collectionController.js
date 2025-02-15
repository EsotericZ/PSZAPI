import query from '../db/index.js';

export const getAllUserCollection = async (req, res) => {
  const userId = req.params.id;

  try {
    const statement = `
      SELECT * 
      FROM collection
      WHERE "userId" = $1
    `;
    const result = await query(statement, [userId]);

    res.status(200).send(result.rows);
  } catch (error) {
    console.error('Error Getting User Friends', error);
    res.status(500).send({ error: 'Unable To Retrieve User Friends' });
  }
}

export const collectionController = {
  getAllUserCollection,
}