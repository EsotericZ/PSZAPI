import query from '../db/index.js';

export const getAllFeatured = async (req, res) => {
  const userId = req.query.userId || null;
  console.log(userId)

  try {
    const statement = `
      SELECT 
        F.*, 
        I.name, I.cover, I.esrb, I.rating, I.released, I.slug, I.genres, I.storyline, I.summary
      FROM featured F
      JOIN igdb I 
        ON F."igdbId" = I.id
      GROUP BY F.id, I.id;
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



// COALESCE(AVG(C.rating), 0) AS avg_rating,
// COUNT(C.rating) AS rating_count,
// COUNT(CASE WHEN C.goty = TRUE THEN 1 END) AS goty_count,

// CASE 
//   WHEN $1::UUID IS NOT NULL THEN EXISTS (
//     SELECT 1 
//     FROM collection C2 
//     WHERE C2."userId" = $1::UUID AND C2."psnId" = G."psnId"
//   ) 
//   ELSE FALSE 
// END AS user_owns,

// CASE 
//   WHEN $1::UUID IS NOT NULL THEN EXISTS (
//     SELECT 1 
//     FROM wishlist W 
//     WHERE W."userId" = $1::UUID AND W."gameId" = G.id
//   ) 
//   ELSE FALSE 
// END AS in_wishlist,

// CASE 
//   WHEN $1::UUID IS NOT NULL THEN EXISTS (
//     SELECT 1 
//     FROM backlog B 
//     WHERE B."userId" = $1::UUID AND B."gameId" = G.id
//   ) 
//   ELSE FALSE 
// END AS in_backlog