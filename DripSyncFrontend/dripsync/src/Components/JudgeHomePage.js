import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom"; 
import api from "../utils/api";

export default function JudgeHomePage() {
  const history = useHistory();
  const [tournamentId, setTournamentId] = useState("");
  const [gameType, setGameType] = useState("");
  const [showScoring, setShowScoring] = useState(false);
  const [teams, setTeams] = useState({});
  const [topTeams, setTopTeams] = useState([]);
  const [winners, setWinners] = useState([]);
  const [scores, setScores] = useState({});

  // Fetch teams data based on the selected game type
  useEffect(() => {
    if (showScoring) {
      api.get("/team-wise-players/")
        .then((response) => {
          const updatedTeams = {};
          Object.entries(response.data).forEach(([teamName, players]) => {
            updatedTeams[teamName] = players.map((player) => ({
              ...player,
              points: 0,
            }));
          });
          setTeams(updatedTeams);
        })
        .catch((error) => console.error("Error fetching team data:", error));
    }
  }, [showScoring]);

  const handleStartScoring = (e) => {
    e.preventDefault();
    if (tournamentId && gameType) setShowScoring(true);
  };

  const updateScore = (teamIndex, playerIndex, value) => {
    const key = `${teamIndex}-${playerIndex}`;
    setScores((prevScores) => {
      const newScore = Math.min(10, Math.max(0, (prevScores[key] || 0) + value));
      return { ...prevScores, [key]: newScore };
    });
  };

  const handleCompleteEvent = () => {
    const teamScores = {};
    const playerScores = [];

    Object.entries(teams).forEach(([teamName, players], teamIndex) => {
      let totalPoints = players.reduce((sum, player, playerIndex) => {
        const playerScore = scores[`${teamIndex}-${playerIndex}`] || 0;
        playerScores.push({
          player_id: player.player_id,
          points: playerScore,
        });
        return sum + playerScore;
      }, 0);
      teamScores[teamName] = totalPoints;
    });

    api.post("/update-team-scores/", { teams: teamScores, players: playerScores })
      .then(() => {
        alert("Event scores updated successfully");
        fetchTopTeams();
        resetScores();
      })
      .catch((error) => console.error("Error updating event scores:", error));
  };

  const handleCompleteTournament = () => {
    api.post("/reset-team-scores/", { reset: true })
      .then(() => {
        alert("Tournament completed! Scores have been reset.");
        fetchTopTeams();
        resetScores();
      })
      .catch((error) => console.error("Error resetting tournament scores:", error));
  };

  const resetScores = () => {
    setScores({});
    Object.entries(teams).forEach(([teamName, players]) => {
      players.forEach((player) => {
        player.points = 0;
      });
    });
  };

  const fetchTopTeams = () => {
    api.get("/top-teams/")
      .then((response) => {
        setTopTeams(response.data);
        if (response.data.length > 0) {
          const winners = response.data.slice(0, 3).map((team, index) => ({
            position: index + 1,
            teamName: team.team_name,
            superScore: team.super_score,
          }));
          localStorage.setItem('winners', JSON.stringify(winners));
          setWinners(winners);
          console.log(winners);
        }
      })
      .catch((error) => console.error("Error fetching top teams:", error));
  };

  useEffect(() => {
    const storedWinners = localStorage.getItem('winners');
    if (storedWinners) {
      setWinners(JSON.parse(storedWinners));
    }
  }, []);
 
  // Game types - modify as needed
  const gameTypes = [
    { name: "Puzzle", route: "puzzle" },
    { name: "Ludo", route: "ludo" },
    { name: "Chess", route: "chess" },
    { name: "Carrom", route: "carrom" },
    { name: "Futsal", route: "futsal" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-gray-800 to-gray-900 text-white">
      {!showScoring ? (
        <div className="flex flex-col items-center justify-center p-8 lg:p-12">
          <h2 className="text-3xl font-extrabold text-center text-white mb-6">
            Enter Tournament Details
          </h2>
          <form onSubmit={handleStartScoring} className="space-y-4">
            <div>
              <label htmlFor="tournamentId" className="block text-sm font-medium text-gray-300">
                Tournament ID
              </label>
              <input
                id="tournamentId"
                type="text"
                value={tournamentId}
                onChange={(e) => setTournamentId(e.target.value)}
                required
                className="block w-full rounded-md bg-gray-600 py-2 px-3 text-white placeholder-gray-500 border border-gray-500 focus:ring-2 focus:ring-teal-400"
              />
            </div>

            <div>
              <label htmlFor="gameType" className="block text-sm font-medium text-gray-300">
                Game Type
              </label>
              <select
                id="gameType"
                value={gameType}
                onChange={(e) => setGameType(e.target.value)}
                required
                className="block w-full rounded-md bg-gray-600 py-2 px-3 text-white placeholder-gray-500 border border-gray-500 focus:ring-2 focus:ring-teal-400"
              >
                <option value="">Select Game Type</option>
                {gameTypes.map((type) => (
                  <option key={type.route} value={type.route}>{type.name}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center rounded-md bg-teal-400 py-2 text-lg font-semibold text-black shadow-lg hover:bg-teal-500 transition-all"
            >
              Proceed to Score Players
            </button>
          </form>
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-8 p-8 lg:p-12">
          {Object.entries(teams).map(([teamName, players], teamIndex) => (
            <div key={teamName} className="w-full max-w-xs bg-gray-700 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-center">{teamName}</h3>
              {players.map((player, playerIndex) => {
                const scoreKey = `${teamIndex}-${playerIndex}`;
                const playerScore = scores[scoreKey] || 0;

                return (
                  <div key={player.player_id} className="mt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">{player.name}</span>
                      <input
                        type="number"
                        value={playerScore}
                        readOnly
                        className="w-20 rounded-md bg-gray-600 py-1 px-2 text-white border border-gray-500 text-center"
                      />
                    </div>
                    <div className="flex justify-between mt-2">
                      {[+1, +2, +5].map((val) => (
                        <button
                          key={val}
                          onClick={() => updateScore(teamIndex, playerIndex, val)}
                          className="w-12 bg-teal-500 hover:bg-teal-600 text-black rounded-md py-1"
                        >
                          +{val}
                        </button>
                      ))}
                      <button
                        onClick={() => updateScore(teamIndex, playerIndex, -1)}
                        className="w-12 bg-red-500 hover:bg-red-600 text-white rounded-md py-1"
                      >
                        -1
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
          <button
            onClick={handleCompleteEvent}
            className="mt-8 px-6 py-3 bg-teal-400 text-black font-semibold rounded-md shadow-lg hover:bg-teal-500 transition-all"
          >
            Complete Event
          </button>
          <button
            onClick={handleCompleteTournament}
            className="mt-8 ml-4 px-6 py-3 bg-red-500 text-white font-semibold rounded-md shadow-lg hover:bg-red-600 transition-all"
          >
            Complete Tournament
          </button>
        </div>
      )}
    </div>
  );
}
