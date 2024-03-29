import leagueWords from "../../words/words.txt";
import allWords from "../../words/words_alpha.txt";
import questionData from "../../words/levels_no_solutions.json";

export const questions = questionData as {
  [length: string]: string[][];
};
export const answers = new Set(
  leagueWords
    .split("\n")
    .map((word) => word.trim().toLowerCase())
    .concat(allWords.split("\n").map((word) => word.trim().toLowerCase()))
);
