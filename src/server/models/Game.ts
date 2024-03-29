import {
  MAX_LIVES,
  MIN_GUESS_TIME,
  NUM_LEVELS,
  MAX_GUESS_TIME,
  STARTING_WEIGHTS,
  DIFFICULTY_SCALING_FACTOR,
  TIME_DECREASE_FACTOR,
  LENGTH_SCALING_FACTOR,
} from "../data/constants";
import { questions } from "../data/levels_lol";
import { type GameState } from "../types";
import { sample } from "lodash";

export function startGame(
  game: GameState,
  submitGuess: (guess: string, player: string) => boolean,
  sync: () => void
) {
  game.currentTurn = sample(Object.keys(game.players))!;
  game.timerDuration = MAX_GUESS_TIME;
  pickQuestion(game);
  startTurnTimer(game, submitGuess, sync);
  game.difficultyWeights = { ...STARTING_WEIGHTS };

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

export function nextTurn(
  game: GameState,
  submitGuess: (guess: string, player: string) => boolean,
  sync: () => void
) {
  const players = Object.keys(game.players).filter(
    (p) => game.players[p].lives > 0
  );

  game.typing = "";

  if (checkGameOver(game)) return;

  const index = players.indexOf(game.currentTurn!);
  const nextIndex = (index + 1) % players.length;
  game.currentTurn = players[nextIndex];

  if (game.players[game.currentTurn].hasGreyHealth) {
    for (const player of Object.values(game.players)) {
      player.hasGreyHealth = false;
    }

    pickQuestion(game);
  }

  startTurnTimer(game, submitGuess, sync);
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
    const levelShift =
      game.difficultyWeights.level[i] * DIFFICULTY_SCALING_FACTOR;

    game.difficultyWeights.level[i + 1] += levelShift;
    game.difficultyWeights.level[i] -= levelShift;
  }

  // Shift the length weights over by 10% each round
  const lengthShift = game.difficultyWeights.length[0] * LENGTH_SCALING_FACTOR;
  game.difficultyWeights.length[0] -= lengthShift;
  game.difficultyWeights.length[1] += lengthShift;
}

export function startTurnTimer(
  game: GameState,
  submitGuess: (guess: string, player: string) => boolean,
  sync: () => void
) {
  game.timerDuration = Math.max(
    MIN_GUESS_TIME,
    game.timerDuration * TIME_DECREASE_FACTOR
  );
  game.timer = setTimeout(() => {
    const player = game.players[game.currentTurn!];
    const guess = game.typing;

    if (!submitGuess(guess, game.currentTurn!)) {
      player.hasGreyHealth = true;
      checkGameOver(game);
      nextTurn(game, submitGuess, sync);
    }

    sync();
  }, game.timerDuration);
}
