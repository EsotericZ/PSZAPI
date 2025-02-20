const clientId = process.env.TWITCH_ID;
const accessToken = process.env.TWITCH_ACCESS_TOKEN;

export const searchGamesByNames = async (gameNames) => {
  if (!Array.isArray(gameNames) || gameNames.length === 0) return [];

  try {
    let results = [];

    for (const gameName of gameNames) {
      const sanitizedGameName = gameName.replace(/’/g, "'");

      const queryBody = `
        search "${sanitizedGameName}";
        fields id, name, first_release_date;
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
      if (data.length > 0) results.push({
        id: data[0].id,
        name: data[0].name,
        first_release_date: data[0].first_release_date || null
      });
    }

    return results;
  } catch (error) {
    console.error("Failed to fetch from IGDB:", error);
    return [];
  }
};