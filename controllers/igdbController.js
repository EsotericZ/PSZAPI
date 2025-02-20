import query from '../db/index.js';
const clientId = process.env.TWITCH_ID;
const accessToken = process.env.TWITCH_ACCESS_TOKEN;

export const getAllGames = async (req, res) => {
  try {
    const statement = `
      SELECT *
      FROM igdb
      ORDER BY name ASC
    `;
    const result = await query(statement);

    res.status(200).send(result.rows);
  } catch (error) {
    console.error('Error Getting Games', error);
    res.status(500).send({ error: 'Unable To Retrieve Games Requested' });
  }
}

export const searchGames = async (req, res) => {
  const { game } = req.body;

  const esrbRatings = {
    6: "RP (Rating Pending)",
    7: "EC (Early Childhood)",
    8: "E (Everyone)",
    9: "E10+ (Everyone 10+)",
    10: "T (Teen)",
    11: "M (Mature 17+)",
    12: "AO (Adults Only)",
  };
  
  const getEsrbRating = (ageRatings) => {
    if (!ageRatings) return "Not Rated";
    const esrb = ageRatings.find(({ category }) => category === 1);
    return esrb ? esrbRatings[esrb.rating] || `Code ${esrb.rating}` : "Not Rated";
  };

  try {
    const response = await fetch(
      "https://api.igdb.com/v4/games",
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Client-ID': clientId,
          'Authorization': `Bearer ${accessToken}`,
        },
        body: `
          fields 
            name,
            age_ratings.rating,
            age_ratings.category,
            aggregated_rating, 
            artworks.image_id,
            category,
            cover.image_id,
            dlcs.name,
            first_release_date,
            franchises.name,
            genres.name,
            multiplayer_modes,
            screenshots.image_id,
            slug,
            status,
            storyline,
            summary,
            videos;
            where (platforms=[167] 
              & (category=0 | category=2 | category=8 | category=9) 
              & name ~ *"${game}"* 
              & name !~ *"Collector's Edition"*
              & name !~ *"Deluxe Edition"*
              & name !~ *"Launch Edition"*
              & name !~ *"Premium Bundle"*
              & name !~ *"Ultimate Edition"*
              & name !~ *"GOTY Edition"*
            );
            sort name asc;
            limit 50;
            `
          }
        );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error Response: ${errorText}`);
      return res.status(response.status).send({
        error: `Failed to fetch data from IGDB. Status: ${response.status}`
      });
    }

    const data = await response.json();
    
    const games = data.map(game => ({
      gameId: game.id,
      name: game.name,
      cover: game.cover?.image_id || null,
      esrb: getEsrbRating(game.age_ratings),
      rating: game.aggregated_rating || 'No Rating',
      releaseDate: game.first_release_date 
        ? new Date(game.first_release_date * 1000).toISOString().split("T")[0]  // YYYY-MM-DD
        : 'Unknown',
      slug: game.slug,
      genres: game.genres || [],
      storyline: game.storyline || '',
      summary: game.summary || '',
    }));

    res.status(200).send(games);
  } catch (err) {
    console.error('Error fetching data from IGDB:', err);
    res.status(500).send({ error: 'An error occurred while fetching data from IGDB' });
  }
};

export const testController = {
  getAllGames,
  searchGames,
}