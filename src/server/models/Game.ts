import {
  MAX_LIVES,
  MIN_GUESS_TIME,
  NUM_LEVELS,
  MAX_GUESS_TIME,
  STARTING_WEIGHTS,
  DIFFICULTY_SCALING_FACTOR,
  TIME_DECREASE_FACTOR,
} from "../data/constants";
import { questions } from "../data/levels_lol";
import { type GameState } from "../types";
import { sample } from "lodash";

export function startGame(game: GameState, sync: () => void) {
  game.currentTurn = sample(Object.keys(game.players))!;
  game.timerDuration = MAX_GUESS_TIME;
  pickQuestion(game);
  startTurnTimer(game, sync);
  game.difficultyWeights = STARTING_WEIGHTS;

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
    game.typing = "";
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
  incrementWeights(game);

  const length = weightedRandom(game.difficultyWeights.length);
  const level = weightedRandom(game.difficultyWeights.level);
  const questionSet = questions[length + 2][level];
  const question = sample(questionSet)!;

  game.question = {
    question,
  };
}

function weightedRandom(weights: number[]) {
  const total = weights.reduce((a, b) => a + b, 0);
  const r = Math.random() * total;
  let i = 0;
  let sum = 0;
  while (sum < r) {
    sum += weights[i];
    i++;
  }
  return i - 1;
}

// increases the difficulty as game progresses
function incrementWeights(game: GameState) {
  // Shift the level weights over by 10% each round
  for (let i = 0; i < NUM_LEVELS - 1; i++) {
    game.difficultyWeights.level[i + 1] += Math.floor(
      game.difficultyWeights.level[i] * DIFFICULTY_SCALING_FACTOR
    );
    game.difficultyWeights.level[i] = Math.floor(
      game.difficultyWeights.level[i] * (1 - DIFFICULTY_SCALING_FACTOR)
    );
  }

  // Shift the length weights over by 10% each round
  game.difficultyWeights.length[1] += Math.floor(
    game.difficultyWeights.length[0] * DIFFICULTY_SCALING_FACTOR
  );
  game.difficultyWeights.length[0] = Math.floor(
    game.difficultyWeights.length[0] * (1 - DIFFICULTY_SCALING_FACTOR)
  );
}

export function startTurnTimer(game: GameState, sync: () => void) {
  game.timerDuration = Math.max(
    MIN_GUESS_TIME,
    game.timerDuration * TIME_DECREASE_FACTOR
  );
  game.timer = setTimeout(() => {
    const player = game.players[game.currentTurn!];
    nextTurn(game, sync);
    game.timerDuration = MAX_GUESS_TIME;
    player.lives--;

    checkGameOver(game);
    sync();
  }, game.timerDuration);
}
