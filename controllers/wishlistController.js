import query from '../db/index.js';
import { searchGamesByID } from '../service/igdbService.js';

export const getUserWishlist = async (req, res) => {
  const userId = req.params.id;

  try {
    const statement = `
      SELECT I.*
      FROM wishlist W
      JOIN games G ON W."gameId" = G.id
      JOIN igdb I ON G."igdbId" = I."igdbId"
      WHERE "userId" = $1
    `;
    const result = await query(statement, [userId]);

    res.status(200).send(result.rows);
  } catch (error) {
    console.error('Error Getting User Wishlist', error);
    res.status(500).send({ error: 'Unable To Retrieve User Wishlist' });
  }
}

export const updateWishlist = async (req, res) => {
  const {igdbId, userId} = req.body;

  try {
    let game = await query(`
      SELECT id 
      FROM games 
      WHERE "igdbId" = $1 
      LIMIT 1
    `, [igdbId]);

    let gameId;

    if (game.rows.length === 0) {
      const igdbResults = await searchGamesByID(igdbId);
    
      if (!igdbResults) {
        console.error(`❌ No results found in IGDB API for ID: ${igdbId}`);
        return res.status(404).json({ error: "Game not found in IGDB" });
      }

      const releaseYear = igdbResults.released
      ? (typeof igdbResults.released === "string"
        ? parseInt(igdbResults.released.split("-")[0], 10)
        : new Date(igdbResults.released * 1000).getFullYear())
      : null;
    
      const insertGame = await query(`
        INSERT INTO games ("igdbId", year) 
        VALUES ($1, $2)
        RETURNING id
      `, [igdbResults.igdbId, releaseYear]);
    
      gameId = insertGame.rows[0].id;
    } else {
      gameId = game.rows[0].id;
    }
    
    const wishlistEntry = await query(`
      SELECT id 
      FROM wishlist 
      WHERE "userId" = $1 
      AND "gameId" = $2
    `, [userId, gameId]);

    if (wishlistEntry.rows.length > 0) {
      await query(`
        DELETE 
        FROM wishlist 
        WHERE "userId" = $1 
        AND "gameId" = $2
      `, [userId, gameId]);

      return res.status(200).json({ message: "Game removed from wishlist", wishlist: false });
    } else {
      await query(`
        INSERT INTO wishlist ("userId", "gameId") 
        VALUES ($1, $2)
      `, [userId, gameId]);

      return res.status(201).json({ message: "Game added to wishlist", wishlist: true });
    }
  } catch (error) {
    console.error("❌ Error in toggleWishlist:", error);
    return res.status(500).json({ error: "An error occurred while updating the wishlist." });
  }
}

export const wishlistController = {
  getUserWishlist,
  updateWishlist,
}