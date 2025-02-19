const clientId = process.env.TWITCH_ID;
const accessToken = process.env.TWITCH_ACCESS_TOKEN;

export const searchGames = async (req, res) => {
  const { game } = req.body;

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
            age_ratings,
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

    res.status(200).send(data);
  } catch (err) {
    console.error('Error fetching data from IGDB:', err);
    res.status(500).send({ error: 'An error occurred while fetching data from IGDB' });
  }
};

export const testController = {
  searchGames
}