import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/common/LoadingSpinner";

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useAuth();
  console.log(user);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get(`/api/leaderboard`, {
          withCredentials: true, // <-- goes here
          headers: {
            Authorization: `Bearer ${user.token}`, // replace with actual token
          },
        });
        console.log(res);
        console.log(res.data);

        if (res.data.success) {
          // Sort leaderboard by points (desc)
          const sorted = [...res.data.leaderboard].sort(
            (a, b) => b.points - a.points
          );
          // Add rank field
          sorted.forEach((p, i) => (p.rank = i + 1));

          setLeaderboard(sorted);
          setCurrentUser(res.data.currentUser);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load leaderboard");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [user]);

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

  if (loading) return <p className="text-center py-10"><LoadingSpinner></LoadingSpinner></p>;
  if (error) return <p className="text-center py-10 text-red-500">{error}</p>;

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

        {/* Current User Card */}
        {currentUser && (
          <div className="mb-8 p-6 bg-white rounded-2xl shadow-xl border-l-4 border-green-500">
            <h2 className="text-2xl font-bold text-green-700 mb-2">
              Your Stats
            </h2>
            <p className="text-gray-800 font-semibold">{currentUser.name}</p>
            <p className="text-gray-600">
              Rank:{" "}
              <span className="font-bold text-green-600">
                {currentUser.rank || "-"}
              </span>
            </p>
            <p className="text-gray-600">
              Points:{" "}
              <span className="font-bold text-green-600">
                {currentUser.points}
              </span>
            </p>
            <p className="text-gray-600">
              Carbon credits:{" "}
              <span className="font-bold text-green-600">
                {currentUser.carbonCredits.earned}
              </span>
            </p>
            <p className="text-sm text-gray-500">{currentUser.location}</p>
          </div>
        )}

        {/* Leaderboard Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm bg-opacity-95">
          {/* Header Row */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
            <div className="grid grid-cols-12 gap-4 items-center text-gray-600 font-semibold text-sm uppercase tracking-wider">
              <div className="col-span-2">Rank</div>
              <div className="col-span-2">Player</div>
              <div className="col-span-4 text-right">Points</div>
              <div className="col-span-4 text-right">Carbon Credits</div>
            </div>
          </div>

          {/* Player Rows */}
          <div className="divide-y divide-gray-100">
            {leaderboard.map((player, index) => {
              const styles = getRankStyles(player.rank);
              return (
                <div
                  key={player._id}
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
                    <div className="col-span-2">
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
                        <div className="bg-gray-100 rounded-full px-4 py-4 text-sm font-semibold text-gray-700 mr-3">
                          {player.points} pts
                        </div>
                        {player.rank <= 3 && (
                          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                        )}
                      </div>
                    </div>

                    <div className="col-span-4 text-right">
                      <div
                        className={`${styles.points} text-xl flex items-center justify-end`}
                      >
                        <div className="bg-gray-100 rounded-full px-4 py-2 text-sm font-semibold text-gray-700 mr-3">
                          {player.carbonCredits.earned} credites
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
