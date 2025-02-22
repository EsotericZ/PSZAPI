import query from '../db/index.js';

export const getAllFeatured = async (req, res) => {
  const userId = req.query.userId || null;
  console.log(`User ID: ${userId || "No User Logged In"}`);

  try {
    const statement = `
      SELECT 
        F.description, F.order, 
        I."igdbId", I.name, I.cover, I.esrb, I.rating AS "igdbRating", I.released, I.slug, I.genres, I.storyline, I.summary,
        G.id AS "gameId", G."totalRating", G."ratingCount", G."gotyCount",
        R.rating AS "pszRating", R.review, R.video,
        ${userId ? `
          EXISTS (
            SELECT 1 FROM collection C 
            WHERE C."psnId" = G."psnId" 
            AND C."userId" = $1
          ) AS "collection",
          EXISTS (
            SELECT 1 FROM wishlist W 
            WHERE W."gameId" = G.id 
            AND W."userId" = $1
          ) AS "wishlist",
          EXISTS (
            SELECT 1 FROM backlog B 
            WHERE B."gameId" = G.id 
            AND B."userId" = $1
          ) AS "backlog"
        ` : 'FALSE AS "collection", FALSE AS "wishlist", FALSE AS "backlog"'}
      FROM featured F
      JOIN igdb I 
        ON F."igdbId" = I.id
      LEFT JOIN games G
        ON I."igdbId" = G."igdbId"
      LEFT JOIN reviews R 
        ON G.id = R."gameId";
    `;
    const params = userId ? [userId] : [];
    const result = await query(statement, params);

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