import { writeFile } from "node:fs/promises";
import { games } from "../src/data/games.js";
import { playableIds } from "../src/data/gameDetails.js";

const origin = "https://megamasti.com";
const staticRoutes = [
  {path:"/",frequency:"weekly",priority:"1.0"},
  {path:"/games",frequency:"weekly",priority:"0.9"}
];
const gameRoutes = games
  .filter(game => playableIds.includes(game.id))
  .map(game => ({path:`/play/${game.id}`,frequency:"monthly",priority:"0.7"}));

const entries = [...staticRoutes,...gameRoutes]
  .map(route => `  <url><loc>${origin}${route.path}</loc><changefreq>${route.frequency}</changefreq><priority>${route.priority}</priority></url>`)
  .join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`;

await writeFile(new URL("../public/sitemap.xml",import.meta.url),sitemap,"utf8");
console.log(`Generated sitemap with ${staticRoutes.length + gameRoutes.length} URLs.`);
