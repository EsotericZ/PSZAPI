import query from '../db/index.js';

export const getAllFeatured = async (req, res) => {
  const userId = req.query.userId || null;
  console.log(userId)

  try {
    const statement = `
      SELECT 
        F.*, 
        I.name, I.cover, I.esrb, I.rating AS "igdbRating", I.released, I.slug, I.genres, I.storyline, I.summary,
        G."totalRating", G."ratingCount", G."gotyCount",
        R.id AS review_id, R.rating AS "pszRating", R.review, R.video
      FROM featured F
      JOIN igdb I 
        ON F."igdbId" = I.id
      JOIN games G
        ON I."igdbId" = G."igdbId"
      LEFT JOIN reviews R 
        ON G.id = R."gameId";
    `;
    const result = await query(statement);
    console.log(result.rows)

    res.status(200).send(result.rows);
  } catch (error) {
    console.error('Error Getting Featured Games', error);
    res.status(500).send({ error: 'Unable To Retrieve Featured Games Requested' });
  }
}

export const userController = {
  getAllFeatured,
}