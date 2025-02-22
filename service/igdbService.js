import query from '../db/index.js';
const clientId = process.env.TWITCH_ID;
const accessToken = process.env.TWITCH_ACCESS_TOKEN;

export const searchGamesByNames = async (gameNames) => {
  if (!Array.isArray(gameNames) || gameNames.length === 0) return [];

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
    let results = [];

    for (const gameName of gameNames) {
      const sanitizedGameName = gameName.replace(/’/g, "'");
      console.log(sanitizedGameName)

      const existingIGDBGame = await query(`
          SELECT * 
          FROM igdb 
          WHERE name ILIKE $1 
          LIMIT 1
        `,
        [sanitizedGameName]
      );

      if (existingIGDBGame.rows.length > 0) {
        results.push(existingIGDBGame.rows[0]);
        continue;
      }

      const queryBody = `
        search "${sanitizedGameName}";
        fields id, name, first_release_date, cover.image_id, aggregated_rating, age_ratings.rating, age_ratings.category, 
               genres.name, storyline, summary, slug;
        where platforms = [167];
        limit 1;
      `;

      const response = await fetch("https://api.igdb.com/v4/games", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Client-ID': clientId,
          'Authorization': `Bearer ${accessToken}`,
        },
        body: queryBody,
      });

      if (!response.ok) {
        console.error("IGDB API Error:", await response.text());
        continue;
      }

      const data = await response.json();
      if (data.length > 0) {
        const igdbGame = data[0];
        const igdbId = igdbGame.id;
        const name = igdbGame.name;
        const cover = igdbGame.cover?.image_id || null;
        const esrb = getEsrbRating(igdbGame.age_ratings);
        const rating = igdbGame.aggregated_rating || null;
        const released = igdbGame.first_release_date 
          ? new Date(igdbGame.first_release_date * 1000).toISOString().split("T")[0]
          : null;
        const slug = igdbGame.slug || null;
        const genres = igdbGame.genres ? JSON.stringify(igdbGame.genres) : null;
        const storyline = igdbGame.storyline || null;
        const summary = igdbGame.summary || null;

        const existingIGDBGameById = await query(`
          SELECT * FROM igdb WHERE "igdbId" = $1 LIMIT 1
        `, [igdbId]);

        if (existingIGDBGameById.rows.length > 0) {
          console.log(`✅ IGDB game already exists: ${name} (ID: ${igdbId})`);
          results.push(existingIGDBGameById.rows[0]);
          continue;
        }

        await query(`
          INSERT INTO igdb (
            "igdbId", 
            "name", 
            "cover", 
            "esrb",
            "rating", 
            "released", 
            "slug", 
            "genres", 
            "storyline", 
            "summary"
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
          ON CONFLICT ("igdbId") DO NOTHING`,
          [
            igdbId, 
            name, 
            cover, 
            esrb, 
            rating, 
            released, 
            slug, 
            genres, 
            storyline, 
            summary
          ]
        );

        console.log(`✅ Inserted new IGDB game: ${name} (ID: ${igdbId})`);

        // results.push({
        //   id: igdbId,
        //   name,
        //   cover,
        //   esrb,
        //   rating,
        //   first_release_date: released,
        //   slug,
        //   genres,
        //   storyline,
        //   summary
        // });

        const newIGDBGame = await query(`
          SELECT * FROM igdb WHERE "igdbId" = $1 LIMIT 1
        `, [igdbId]);

        if (newIGDBGame.rows.length > 0) {
          results.push(newIGDBGame.rows[0]); // ✅ Now `id` is always UUID, `igdbId` is always INTEGER
        }
      }
    }

    return results;
  } catch (error) {
    console.error("❌ Failed to fetch from IGDB:", error);
    return [];
  }
};
