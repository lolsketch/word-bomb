import type { PlayerState } from "../../../../server/types";

interface Props {
  player: PlayerState;
  playersTurn: boolean;
}

export const Player = ({ player, playersTurn }: Props) => {
  const avatar = playersTurn ? (
    <img
      src="https://avatarfiles.alphacoders.com/867/86773.jpg"
      alt="poro"
      className="poro"
    />
  ) : (
    <img
      src="https://media.assettype.com/afkgaming%2F2022-03%2F32b834ac-e194-4e6b-9618-2ce38d8294c9%2Fporo_snax.jpg?auto=format%2Ccompress&dpr=1.0&format=webp&w=400"
      alt="snax"
      className="snax"
    />
  );
  return (
    <div className="player">
      {avatar}
      <div>
        {[...Array(player.lives)].map((_) => {
          return (
            <img
              width="20px"
              src="https://cdn-icons-png.flaticon.com/512/2589/2589054.png"
            />
          );
        })}
      </div>
      Player {player.id}
    </div>
  );
};
