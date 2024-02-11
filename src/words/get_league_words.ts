import fs from "fs";
import path from "path";

async function getJSON(url: string) {
  return fetch(url)
    .then((response: Response) => {
      return response.json();
    })
    .catch((error: any) => {
      console.error("Problem with fetch operation:", error);
    });
}

async function getPatchNumber() {
  const versions = await getJSON(
    "https://ddragon.leagueoflegends.com/api/versions.json"
  );
  return versions[0];
}

const words = new Set<string>();

async function getSummonerSpellData(patchNumber: string) {
  console.log("Fetching summoner spell data...");
  const data = await getJSON(
    "http://ddragon.leagueoflegends.com/cdn/" +
      patchNumber +
      "/data/en_US/summoner.json"
  );
  Object.values(data["data"]).forEach((spell: any) => {
    words.add(spell.name);
  });
  console.log("Finished getting summoner spell data");
}

async function getRuneData(patchNumber: string) {
  console.log("Fetching rune data...");
  const data = await getJSON(
    "http://ddragon.leagueoflegends.com/cdn/" +
      patchNumber +
      "/data/en_US/runesReforged.json"
  );
  data.forEach((tree: any) => {
    tree.slots.forEach((row: any) => {
      row.runes.forEach((rune: any) => {
        words.add(rune.name);
      });
    });
  });

  console.log("Finished getting rune data");
}

async function getItemData(patchNumber: string) {
  console.log("Fetching item data...");
  const data = await getJSON(
    "http://ddragon.leagueoflegends.com/cdn/" +
      patchNumber +
      "/data/en_US/item.json"
  );
  Object.values(data["data"]).forEach((item: any) => {
    words.add(item.name);
  });
  console.log("Finished getting item data");
}

async function getChampionData(patchNumber: string) {
  console.log("Fetching champion data...");
  const data = await getJSON(
    "http://ddragon.leagueoflegends.com/cdn/" +
      patchNumber +
      "/data/en_US/champion.json"
  );

  await Promise.all(
    Object.values(data["data"]).map((champion: any) => {
      words.add(champion.name);

      return getSpecificChampionData(champion, patchNumber);
    })
  );

  console.log("Finished getting champion data");
}

async function getSpecificChampionData(
  champion: { id: string; name: string },
  patchNumber: string
) {
  const champData = await getJSON(
    `http://ddragon.leagueoflegends.com/cdn/${patchNumber}/data/en_US/champion/${champion.id}.json`
  );
  champData.data[champion.id].spells.forEach((ability: any, i: number) => {
    if (champion.id === "Aphelios" && [0, 2].includes(i)) return;
    const name = ability.name.split(" / ")[0];
    words.add(name);
  });

  champData.data[champion.id].skins.forEach((skin: any) => {
    if (skin.name !== "default") {
      words.add(skin.name);
    }
  });
}

async function getAllData() {
  const patchNumber = await getPatchNumber();
  console.log(patchNumber);
  await Promise.all([
    getItemData(patchNumber),
    getChampionData(patchNumber),
    getRuneData(patchNumber),
    getSummonerSpellData(patchNumber),
  ]);

  // clean up words
  const cleaned_words = new Set<string>();

  words.forEach((word) => {
    word = word.replace(/'s/g, "");
    word = word.replace(/[^a-zA-Z ]/g, "").toLowerCase();
    if (word.includes(" ")) {
      word.split(" ").forEach((w) => cleaned_words.add(w));
    } else {
      cleaned_words.add(word);
    }
  });

  const extra_words = [
    "summoner",
    "shadow",
    "bandle",
    "zaun",
    "abyss",
    "ruination",
    "magic",
    "lethality",
    "ability",
    "spell",
    "larmack",
    "serpenoids",
    "zooshi",
    "zooshii",
    "zooshiii",
    "fuckamoli",
    "kevin3570"
  ];

  extra_words.forEach((word) => cleaned_words.add(word));

  // output the words to a file
  const filePath = path.join(path.dirname("./"), "./words.txt");
  console.log(filePath);
  const writeStream = fs.createWriteStream(filePath);
  cleaned_words.forEach((word) => writeStream.write(word + "\n"));
  writeStream.end();
}

getAllData();
