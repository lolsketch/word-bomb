import { MAX_LIVES, TIME_TO_GUESS } from "../data/constants";
import { questions } from "../data/levels_lol";
import { type GameState } from "../types";
import { sample } from "lodash";

export function startGame(game: GameState, sync: () => void) {
  game.currentTurn = sample(Object.keys(game.players))!;
  pickQuestion(game);
  startTurnTimer(game, sync);

  for (const player of Object.values(game.players)) {
    player.lives = MAX_LIVES;
  }
}

export function checkGameOver(game: GameState) {
  const alivePlayers = Object.keys(game.players).filter(
    (p) => game.players[p].lives > 0
  );

  if (alivePlayers.length <= 1) {
    // game over
    game.currentTurn = null;
    game.question = null;
    clearTimeout(game.timer!);
    return true;
  }

  return false;
}

export function nextTurn(game: GameState, sync: () => void) {
  const players = Object.keys(game.players).filter(
    (p) => game.players[p].lives > 0
  );

  game.typing = "";

  if (checkGameOver(game)) return;

  const index = players.indexOf(game.currentTurn!);
  const nextIndex = (index + 1) % players.length;
  game.currentTurn = players[nextIndex];

  startTurnTimer(game, sync);
}

export function pickQuestion(game: GameState) {
  const questionSet = sample(questions)![0]!;

  const question = sample(Object.keys(questionSet))!;

  game.question = {
    question,
    answer: questionSet[question],
  };
}

export function startTurnTimer(game: GameState, sync: () => void) {
  game.timer = setTimeout(() => {
    const player = game.players[game.currentTurn!];
    nextTurn(game, sync);
    player.lives--;

    checkGameOver(game);
    sync();
  }, TIME_TO_GUESS);
}
