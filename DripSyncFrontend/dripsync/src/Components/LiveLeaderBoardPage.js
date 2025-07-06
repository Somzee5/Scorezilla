import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { gsap } from "gsap";
import api from "../utils/api";
import ChartPage from "./ChartPage"; // Import ChartPage component

const socket = io("http://localhost:3001");

// Typing Text Component
const TypingText = () => {
  const phrases = ["Tasty & Healthy", "Made With Love", "Fresh Food! Good Life!"];
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const currentPhrase = phrases[index];
    const timeoutId = setTimeout(() => {
      if (charIndex < currentPhrase.length) {
        setText((prev) => prev + currentPhrase[charIndex]);
        setCharIndex((prev) => prev + 1);
      } else {
        setTimeout(() => {
          setCharIndex(0);
          setText("");
          setIndex((prev) => (prev + 1) % phrases.length);
        }, 2000);
      }
    }, 150);

    return () => clearTimeout(timeoutId);
  }, [charIndex, index, phrases]);

  return <p className="text-lg text-center italic">{text}</p>;
};

export default function LiveLeaderBoardPage() {
  const [topTeams, setTopTeams] = useState([]);
  const [topPlayers, setTopPlayers] = useState([]);
  const [userVisitCount, setUserVisitCount] = useState(0);
  const [clickCount, setClickCount] = useState(0);
  const [hoverCount, setHoverCount] = useState(0);

  // Fetch top 3 teams based on super_score
  useEffect(() => {
    api.get("/top-teams/")
      .then((response) => {
        setTopTeams(response.data);
      })
      .catch((error) => console.error("Error fetching top teams:", error));
  }, []);

  // Fetch top players based on highest scores
  useEffect(() => {
    api.get("/top-players/") // Ensure this endpoint returns only the top players
      .then((response) => {
        setTopPlayers(response.data); // Ensure response contains [{ name: 'Player1', highest_points: 100 }]
      })
      .catch((error) => console.error("Error fetching top players:", error));
  }, []);

  useEffect(() => {
    socket.on("updateCounts", (data) => {
      setUserVisitCount(data.userVisitCount);
      setClickCount(data.clickCount);
      setHoverCount(data.hoverCount);
    });

    return () => {
      socket.off("updateCounts");
    };
  }, []);

  const handleClick = () => {
    socket.emit("incrementClick");
  };

  const handleHover = () => {
    socket.emit("incrementHover");
  };

  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1, yoyo: true });
    tl.fromTo(
      ".nav-logo",
      { opacity: 0.7, y: -10, filter: "drop-shadow(0 0 5px rgba(100, 255, 218, 1))" },
      {
        opacity: 1,
        y: 0,
        filter: "drop-shadow(0 0 15px rgba(100, 255, 218, 1))",
        duration: 1,
        ease: "power1.inOut",
      }
    );
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-gray-800 to-gray-900 text-white">
      <nav className="flex justify-between items-center p-4 bg-gray-900 shadow-md">
        <h1 className="nav-logo text-3xl font-extrabold text-gradient drop-shadow-lg">
          Scorezilla
        </h1>
        <div className="flex space-x-4">
          <a href="/" className="text-teal-400 hover:underline">Login</a>
          <a href="/register" className="text-teal-400 hover:underline">Sign Up</a>
        </div>
      </nav>

      <div className="flex flex-1">
        <aside className="w-1/5 bg-gray-700 p-4">
          <h2 className="text-xl font-bold">Key Highlights</h2>
          <ul className="mt-4 space-y-2">
            <li><span className="text-teal-400">🔥</span> Match of the Day: Team A vs Team B</li>
            <li><span className="text-teal-400">🏆</span> Player of the Week: John Doe</li>
            <li><span className="text-teal-400">🚀</span> Best Goal: Team C's Stunning Shot</li>
          </ul>
          {/* Chatbot Link */}
          <a
            href="https://bot.dialogflow.com/32d25143-fe80-4405-8757-3753b3f4cf13"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block w-full text-center bg-teal-500 text-white rounded-md py-2 hover:bg-teal-600 transition-all"
          >
            Chatbot
          </a>
        </aside>

        <main className="flex-1 p-8">
          <h2 className="text-2xl font-bold">Live Tournament Leaderboard</h2>

          {/* Display Top Teams with super_score */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {topTeams.map((team, index) => (
              <div key={index} className="bg-gray-800 p-4 rounded-lg shadow-lg transition-transform transform hover:scale-105">
                <h3 className="text-xl font-bold">Rank: {index + 1}</h3>
                <h4 className="text-lg">{team.team_name}</h4>
                <p className="text-teal-400">Super Score: {team.super_score}</p>
              </div>
            ))}
          </div>

          {/* MVP Section for Players */}
          <h2 className="text-2xl font-bold mt-8">Top Players & MVP</h2>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {topPlayers.map((player, index) => (
              <div key={index} className="bg-gray-800 p-4 rounded-lg shadow-lg transition-transform transform hover:scale-105">
                <h3 className="text-xl font-bold">Rank: {index + 1}</h3>
                <h4 className="text-lg">{player.name}</h4>
                <p className="text-teal-400">Highest Points: {player.points}</p>
                <p className="text-teal-400"> {player.firstname}</p>
                {index === 0 && <p className="font-bold text-teal-500">🏆 MVP</p>} {/* Highlight MVP */}
              </div>
            ))}
          </div>

          <div
            className="mt-8 relative flex items-center justify-center bg-gray-700 p-6 rounded-lg shadow-xl overflow-hidden cursor-pointer"
            onClick={handleClick}
            onMouseEnter={handleHover}
          >
            <div className="absolute inset-0 blur-lg opacity-50 bg-gradient-to-r from-teal-400 to-teal-800 rounded-lg"></div>
            <div className="z-10 flex flex-col items-center space-y-4">
              <img
                src="https://media.istockphoto.com/id/1187991974/photo/bhakarwadi-or-bakarwadi-or-spring-roll-traditional-sweet-and-spicy-snack.webp?a=1&b=1&s=612x612&w=0&k=20&c=kfZ4v8TeoXvWrc56haZjwLwiE3E5UkrVo6B_HGdhk2A="
                alt="Chitale Bandhu Bhakarwadi"
                className="h-24 mb-4"
              />
              <h3 className="text-2xl font-extrabold">Chitale Bandhu Bhakarwadi</h3>
              <TypingText />
            </div>
          </div>

          {/* Display real-time interaction counts */}
          <div className="mt-8">
            <h2 className="text-xl font-bold">Real-Time Interaction Counts</h2>
            <p>Visits: {userVisitCount}</p>
            <p>Clicks: {clickCount}</p>
            <p>Hovers: {hoverCount}</p>
          </div>

          {/* Include the chart here */}
          <ChartPage userVisitCount={userVisitCount} clickCount={clickCount} hoverCount={hoverCount} />
        </main>
      </div>
    </div> 
  );
}
