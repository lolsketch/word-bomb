import { MAX_LIVES, MIN_GUESS_TIME, NUM_LEVELS } from "../data/constants";
import { questions } from "../data/levels_lol";
import { type GameState } from "../types";
import { sample } from "lodash";

export function startGame(game: GameState, submitGuess: (guess: string, player: string) => boolean, sync: () => void) {
  game.currentTurn = sample(Object.keys(game.players))!;
  pickQuestion(game);
  startTurnTimer(game, submitGuess, sync);

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

export function nextTurn(game: GameState, submitGuess: (guess: string, player: string) => boolean, sync: () => void) {
  const players = Object.keys(game.players).filter(
    (p) => game.players[p].lives > 0
  );

  game.typing = "";

  if (checkGameOver(game)) return;

  const index = players.indexOf(game.currentTurn!);
  const nextIndex = (index + 1) % players.length;
  game.currentTurn = players[nextIndex];

  startTurnTimer(game, submitGuess, sync);
}

export function pickQuestion(game: GameState) {
  //todo: real solution for this
  if (Math.random() < 0.3) {
    incrementWeights(game);
  }
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
      game.difficultyWeights.level[i] / 10
    );
    game.difficultyWeights.level[i] = Math.floor(
      (game.difficultyWeights.level[i] * 9) / 10
    );
  }

  // Shift the length weights over by 10% each round
  game.difficultyWeights.length[1] += Math.floor(
    game.difficultyWeights.length[0] / 10
  );
  game.difficultyWeights.length[0] = Math.floor(
    (game.difficultyWeights.length[0] * 9) / 10
  );
}

export function startTurnTimer(game: GameState, submitGuess: (guess: string, player: string) => boolean, sync: () => void) {
  game.timerDuration = Math.max(MIN_GUESS_TIME, game.timerDuration * 0.95);
  game.timer = setTimeout(() => {
    const player = game.players[game.currentTurn!];
    const guess = game.typing;

    if (!submitGuess(guess, game.currentTurn!)) {
      player.lives--;
      checkGameOver(game);
      nextTurn(game, submitGuess, sync);
    }
 
    sync();
  }, game.timerDuration);
}
