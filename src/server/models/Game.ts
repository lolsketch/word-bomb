import { questions } from "../data/levels_lol";
import { type GameState } from "../types";
import { sample } from "lodash";

export function startGame(_game: GameState) {}

export function pickQuestion(game: GameState) {
  const questionSet = sample(questions)![0]!;

  const question = sample(Object.keys(questionSet))!;

  game.question = {
    question,
    answer: questionSet[question],
  };
}
