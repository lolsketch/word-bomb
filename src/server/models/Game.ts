import { questions } from "../data/levels_lol";
import { type GameState } from "../types";
import { sample } from "lodash";

export function startGame(game: GameState) {
  game.currentTurn = sample(Object.keys(game.players))!;
}

export function nextTurn(game: GameState) {
  const players = Object.keys(game.players);
  const index = players.indexOf(game.currentTurn!);
  const nextIndex = (index + 1) % players.length;
  game.currentTurn = players[nextIndex];
}

export function pickQuestion(game: GameState) {
  const questionSet = sample(questions)![0]!;

  const question = sample(Object.keys(questionSet))!;

  game.question = {
    question,
    answer: questionSet[question],
  };
}
