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

  const getRankIcon = (rank) => {
    if (rank === 1) return "🏆";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  const getRankStyles = (rank) => {
    if (rank === 1) {
      return {
        container:
          "bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-300 shadow-lg transform hover:scale-102",
        rank: "text-yellow-600 text-2xl",
        name: "text-yellow-800 font-bold",
        points: "text-yellow-700 font-bold",
      };
    }
    if (rank === 2) {
      return {
        container:
          "bg-gradient-to-r from-gray-50 to-slate-50 border-2 border-gray-300 shadow-md transform hover:scale-101",
        rank: "text-gray-600 text-xl",
        name: "text-gray-800 font-semibold",
        points: "text-gray-700 font-semibold",
      };
    }
    if (rank === 3) {
      return {
        container:
          "bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-300 shadow-md transform hover:scale-101",
        rank: "text-orange-600 text-xl",
        name: "text-orange-800 font-semibold",
        points: "text-orange-700 font-semibold",
      };
    }
    return {
      container:
        "bg-white border border-gray-200 hover:bg-gray-50 shadow-sm transform hover:scale-101",
      rank: "text-gray-600 text-lg",
      name: "text-gray-800",
      points: "text-gray-700 font-medium",
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-2 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-emerald-600 to-green-600 rounded-full mb-6 shadow-lg">
            <span className="text-3xl text-white">🏆</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-4">
            Leaderboard
          </h1>
        </div>

        {/* Leaderboard Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm bg-opacity-95">
          {/* Header Row */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
            <div className="grid grid-cols-12 gap-4 items-center text-gray-600 font-semibold text-sm uppercase tracking-wider">
              <div className="col-span-2">Rank</div>
              <div className="col-span-6">Player</div>
              <div className="col-span-4 text-right">Points</div>
            </div>
          </div>

          {/* Player Rows */}
          <div className="divide-y divide-gray-100">
            {data.map((player, index) => {
              const styles = getRankStyles(player.rank);
              return (
                <div
                  key={player.rank}
                  className={`${styles.container} transition-all duration-300 ease-in-out hover:shadow-lg`}
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: `slideInUp 0.6s ease-out forwards`,
                  }}
                >
                  <div className="grid grid-cols-12 gap-4 items-center px-8 py-6">
                    {/* Rank */}
                    <div className="col-span-2 flex items-center">
                      <div
                        className={`${styles.rank} font-bold flex items-center`}
                      >
                        {getRankIcon(player.rank)}
                      </div>
                    </div>

                    {/* Name */}
                    <div className="col-span-6">
                      <div
                        className={`${styles.name} text-xl flex items-center`}
                      >
                        <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4 shadow-md">
                          {player.name.charAt(0)}
                        </div>
                        {player.name}
                      </div>
                    </div>

                    {/* Points */}
                    <div className="col-span-4 text-right">
                      <div
                        className={`${styles.points} text-xl flex items-center justify-end`}
                      >
                        <div className="bg-gray-100 rounded-full px-4 py-2 text-sm font-semibold text-gray-700 mr-3">
                          {player.points} pts
                        </div>
                        {player.rank <= 3 && (
                          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
