import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";

export default function ScoringPage() {
  const { gameType } = useParams(); // Get the game type from the URL
  const [teams, setTeams] = useState({});
  const [topTeams, setTopTeams] = useState([]);

  useEffect(() => {
    api.get("/team-wise-players/")
      .then((response) => setTeams(response.data))
      .catch((error) => console.error("Error fetching team data:", error));
    
    fetchTopTeams();
  }, []);

  // Fetch the top teams and their super scores
  const fetchTopTeams = () => {
    api.get("/top-teams/")
      .then((response) => {
        setTopTeams(response.data);
      })
      .catch((error) => console.error("Error fetching top teams:", error));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-4">
        Welcome to {gameType.charAt(0).toUpperCase() + gameType.slice(1)} Judging Games
      </h2>
      <h3 className="text-xl text-center mb-6">
        {gameType.charAt(0).toUpperCase() + gameType.slice(1)} Game Scoring
      </h3>
      {/* Display scoring UI similar to the previous scoring section */}
      {/* Add the rest of your scoring UI here */}
    </div>
  );
}
