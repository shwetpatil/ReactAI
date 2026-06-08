import { useState } from 'react';

type Player = 'X' | 'O';

const calculateWinner = (
  grids: (Player | null)[]
): Player | null => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
    if (
      grids[a] &&
      grids[a] === grids[b] &&
      grids[b] === grids[c]
    ) {
      return grids[a];
    }
  }

  return null;
};

export default function TicTacToe() {
  const [grids, setGrids] = useState<(Player | null)[]>(
    Array(9).fill(null)
  );

  const [player, setPlayer] = useState<Player>('X');

  const winner = calculateWinner(grids);

  const onGridClicked = (i: number) => {
    if (winner) return;

    setGrids((prev) => {
      if (prev[i] !== null) return prev;

      const next = [...prev];
      next[i] = player;

      return next;
    });

    setPlayer(player === 'X' ? 'O' : 'X');
  };

  const resetGame = () => {
    setGrids(Array(9).fill(null));
    setPlayer('X');
  };

  return (
    <>
      <h3>
        {winner
          ? `Winner: ${winner}`
          : `Current Player: ${player}`}
      </h3>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 60px)',
          gap: '4px',
        }}
      >
        {grids.map((item, i) => (
          <button
            key={i}
            onClick={() => onGridClicked(i)}
            style={{
              width: '60px',
              height: '60px',
              border: '1px solid black',
              fontSize: '24px',
              cursor: 'pointer',
            }}
          >
            {item}
          </button>
        ))}
      </div>

      <button
        onClick={resetGame}
        style={{
          marginTop: '10px',
          padding: '8px 12px',
        }}
      >
        Reset
      </button>
    </>
  );
}