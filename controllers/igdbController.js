const clientId = process.env.TWITCH_ID;
const accessToken = process.env.TWITCH_ACCESS_TOKEN;

export const searchGames = async (req, res) => {
  const { game } = req.body;
  console.log(game)

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
          where (platforms=[167] & version_parent = null & category=0 & name ~ *"${game}"*);
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
    console.log('Fetched Data:', data);

    res.status(200).send(data);
  } catch (err) {
    console.error('Error fetching data from IGDB:', err);
    res.status(500).send({ error: 'An error occurred while fetching data from IGDB' });
  }
};

export const search = async (req, res) => {
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
          fields *;
          where (platforms=[167] & name ~ *"god of war"*);
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
    console.log('Fetched Data:', data);

    res.status(200).send(data);
  } catch (err) {
    console.error('Error fetching data from IGDB:', err);
    res.status(500).send({ error: 'An error occurred while fetching data from IGDB' });
  }
};



export const testController = {
  searchGames
}