import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react"; // Import QRCodeCanvas specifically

const CreateTournament = () => {
  const history = useHistory();
  const [games, setGames] = useState(Array(5).fill({ gameType: "", gameName: "" }));
  const [leaders, setLeaders] = useState(Array(5).fill({ name: "", email: "" }));

  const gameOptions = {
    indoor: ["Chess", "Carrom"],
    outdoor: ["Cricket", "Football"],
    fun: ["Puzzles", "Ludo"],
  };

  const handleGameChange = (index, field, value) => {
    if (field === "gameType") {
      setGames((prevGames) => {
        const updatedGames = [...prevGames];
        updatedGames[index] = { gameType: value, gameName: "" }; // Reset game name when game type changes
        return updatedGames;
      });
    } else {
      setGames((prevGames) => {
        const updatedGames = [...prevGames];
        updatedGames[index] = { ...updatedGames[index], [field]: value };
        return updatedGames;
      });
    }
  };

  const handleLeaderChange = (index, field, value) => {
    setLeaders((prevLeaders) => {
      const updatedLeaders = [...prevLeaders];
      updatedLeaders[index] = { ...updatedLeaders[index], [field]: value };
      return updatedLeaders;
    });
  };

  const handleCreateTournament = () => {
    console.log({ games, leaders });
    history.push("/success");
  };

  // URL to be embedded in the QR code (replace with your dynamic tournament link)
  const tournamentUrl = "https://yourapp.com/join/tournament-id";

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-gray-800 to-gray-900 text-white p-8">
      <h3 className="text-lg font-semibold text-center mb-4">Create a Tournament</h3>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {games.map((game, index) => (
            <div key={index} className="bg-gray-700 p-4 rounded-lg">
              <h4 className="text-md font-semibold mb-2">Game Type {index + 1}</h4>
              <select
                required
                value={game.gameType}
                onChange={(e) => handleGameChange(index, "gameType", e.target.value)}
                className="block w-full rounded-md bg-gray-600 py-2 px-3 text-white placeholder-gray-500 border border-gray-500 focus:ring-2 focus:ring-teal-400 mb-2"
              >
                <option value="">Choose a game type</option>
                <option value="indoor">Indoor</option>
                <option value="outdoor">Outdoor</option>
                <option value="fun">Fun</option>
              </select>
              {game.gameType && (
                <select
                  required
                  value={game.gameName}
                  onChange={(e) => handleGameChange(index, "gameName", e.target.value)}
                  className="block w-full rounded-md bg-gray-600 py-2 px-3 text-white placeholder-gray-500 border border-gray-500 focus:ring-2 focus:ring-teal-400"
                >
                  <option value="">Choose a game name</option>
                  {gameOptions[game.gameType].map((gameName) => (
                    <option key={gameName} value={gameName}>
                      {gameName}
                    </option>
                  ))}
                </select>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-4">
          {leaders.map((leader, index) => (
            <div key={index} className="bg-gray-700 p-4 rounded-lg">
              <h4 className="text-md font-semibold mb-2">Leader {index + 1}</h4>
              <input
                type="text"
                placeholder="Leader Name"
                value={leader.name}
                onChange={(e) => handleLeaderChange(index, "name", e.target.value)}
                className="block w-full rounded-md bg-gray-600 py-2 px-3 text-white placeholder-gray-500 border border-gray-500 focus:ring-2 focus:ring-teal-400"
                required
              />
              <input
                type="email"
                placeholder="Leader Email"
                value={leader.email}
                onChange={(e) => handleLeaderChange(index, "email", e.target.value)}
                className="block w-full rounded-md bg-gray-600 py-2 px-3 text-white placeholder-gray-500 border border-gray-500 focus:ring-2 focus:ring-teal-400 mt-2"
                required
              />
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <QRCodeCanvas value={tournamentUrl} size={200} className="shadow-lg" />
        </div>
        <p className="text-center mt-2 text-teal-400">Scan this QR code to join the tournament!</p>

        <div>
          <button
            type="button"
            onClick={handleCreateTournament}
            className="w-full flex justify-center rounded-md bg-teal-400 py-2 text-lg font-semibold text-black shadow-lg hover:bg-teal-500 transition-all mt-4"
          >
            Create Tournament
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTournament;