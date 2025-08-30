import React from "react";

export default function Leaderboard() {
  const data = [
    { rank: 1, name: "Aarav", points: 980 },
    { rank: 2, name: "Isha", points: 920 },
    { rank: 3, name: "Kabir", points: 890 },
    { rank: 4, name: "Riya", points: 860 },
    { rank: 5, name: "Arjun", points: 840 },
    { rank: 6, name: "Meera", points: 820 },
    { rank: 7, name: "Dev", points: 790 },
    { rank: 8, name: "Ananya", points: 770 },
    { rank: 9, name: "Vihaan", points: 750 },
    { rank: 10, name: "Sara", points: 730 },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-7xl bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8 tracking-wide">
          Leaderboard
        </h1>

        <div className="grid grid-cols-3 text-gray-600 text-lg font-semibold mb-6 px-4">
          <p>Rank</p>
          <p>Name</p>
          <p className="text-right">Points</p>
        </div>

        <div className="space-y-4">
          {data.map((player) => (
            <div
              key={player.rank}
              className="grid grid-cols-3 items-center bg-gray-50 rounded-xl px-6 py-3 text-gray-800 font-medium shadow-sm hover:bg-gray-100 transition"
            >
              <p
                className={`text-lg font-bold ${
                  player.rank === 1
                    ? "text-yellow-500"
                    : player.rank === 2
                    ? "text-gray-400"
                    : player.rank === 3
                    ? "text-amber-600"
                    : "text-gray-700"
                }`}
              >
                #{player.rank}
              </p>
              <p className="text-lg">{player.name}</p>
              <p className="text-lg text-right text-gray-900 font-semibold">
                {player.points}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
