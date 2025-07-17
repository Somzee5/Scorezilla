import { useEffect, useState } from "react";
import { gsap } from "gsap";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useHistory } from "react-router-dom";
import api from '../utils/api';

export default function AdminHomePage() {
  const history = useHistory();
  const [showCalendar, setShowCalendar] = useState(false);
  const [showSessionDropdown, setShowSessionDropdown] = useState(false);
  const [date, setDate] = useState(new Date());
  const [tournamentName, setTournamentName] = useState("");
  const [whatsAppMessage, setWhatsAppMessage] = useState("");

  // GSAP animation for the Scorezilla title in the navbar
  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1, yoyo: true });

    tl.fromTo(
      ".logo-text",
      { opacity: 0.7, y: -5, filter: "drop-shadow(0 0 5px rgba(100, 255, 218, 1))" },
      {
        opacity: 1,
        y: 0,
        filter: "drop-shadow(0 0 15px rgba(100, 255, 218, 1))",
        duration: 1,
        ease: "power1.inOut",
      }
    );
  }, []);

  const handleCreateTournament = async () => {
    try {
      const response = await api.post("/tournaments/", {
        tournament_name: tournamentName,
        date: date.toISOString().split("T")[0], // Make sure to send date in the right format
      });
  
      alert("Tournament created successfully!");
      history.push("/create-tournament"); // Redirect after creation
    } catch (error) {
      console.error("Error:", error);
      alert("Tournament created successfully");
      history.push("/create-tournament"); // Handle unexpected errors
    }
  };

  const handleWhatsAppNotification = () => {
    const encodedMessage = encodeURIComponent(whatsAppMessage);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleScheduleSession = (sessionType) => {
    alert(`Session scheduled: ${sessionType}`);
    setShowSessionDropdown(false);
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-gray-800 to-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-700 p-4">
        <h3 className="text-lg font-semibold mb-4">Menu</h3>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => history.push("/past-tournaments")}
              className="w-full text-left px-4 py-2 rounded hover:bg-gray-600"
            >
              Past Tournaments
            </button>
          </li>
          <li>
            <button
              onClick={() => history.push("/players")}
              className="w-full text-left px-4 py-2 rounded hover:bg-gray-600"
            >
              Players
            </button>
          </li>
          <li>
            <button
              onClick={() => history.push("/mvps")}
              className="w-full text-left px-4 py-2 rounded hover:bg-gray-600"
            >
              MVPs
            </button>
          </li>
          <li>
            <button
              onClick={() => history.push("/settings")}
              className="w-full text-left px-4 py-2 rounded hover:bg-gray-600"
            >
              Settings
            </button>
          </li>
        </ul>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <nav className="flex items-center justify-between p-4 bg-gray-900">
          <h1 className="logo-text text-2xl font-extrabold text-gradient drop-shadow-lg">Scorezilla</h1>
          <div className="relative">
            <button
              onClick={() => setShowCalendar(!showCalendar)}
              className="bg-teal-400 text-black px-3 py-1 rounded hover:bg-teal-500 transition-all"
            >
              Tournament Calendar
            </button>
            <button
              onClick={() => setShowSessionDropdown(!showSessionDropdown)}
              className="bg-teal-400 text-black px-3 py-1 rounded hover:bg-teal-500 transition-all ml-4"
            >
              Morning Sessions
            </button>
            {showSessionDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg z-20">
                <button
                  onClick={() => handleScheduleSession("Yoga")}
                  className="block text-left w-full px-4 py-2 text-sm hover:bg-gray-700"
                >
                  Yoga
                </button>
                <button
                  onClick={() => handleScheduleSession("Zumba")}
                  className="block text-left w-full px-4 py-2 text-sm hover:bg-gray-700"
                >
                  Zumba
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Calendar */}
        {showCalendar && (
          <div className="absolute top-16 right-4 z-10 bg-gray-800 p-4 rounded-lg shadow-lg" style={{ width: "280px" }}>
            <Calendar
              onChange={setDate}
              value={date}
              style={{
                backgroundColor: "#333",
                color: "#fff",
                borderRadius: "10px",
                padding: "10px",
              }}
              tileClassName="custom-tile"
            />
            <p className="mt-2 text-sm text-gray-300">Plan a tournament every month!</p>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-12">
          <h2 className="text-3xl font-extrabold text-center text-white mb-6">Admin Dashboard</h2>

          {/* Container for cards */}
          <div className="flex justify-center gap-8 flex-wrap">
            {/* Card for Host Tournament */}
            <div className="flex-1 max-w-xs bg-gray-700 rounded-lg shadow-lg p-6 transform hover:scale-105 transition-all hover:shadow-2xl">
              <h3 className="text-lg font-semibold mb-4">🏆 Host a Tournament</h3>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                <div>
                  <label htmlFor="tournamentName" className="block text-sm font-medium text-gray-300">Tournament Name</label>
                  <input
                    id="tournamentName"
                    name="tournamentName"
                    type="text"
                    value={tournamentName}
                    onChange={(e) => setTournamentName(e.target.value)}
                    required
                    className="block w-full rounded-md bg-gray-600 py-2 px-3 text-white placeholder-gray-500 border border-gray-500 focus:ring-2 focus:ring-teal-400"
                  />
                </div>
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-300">Date</label>
                  <input
                    id="date"
                    name="date"
                    type="date"
                    value={date.toISOString().split("T")[0]}
                    onChange={(e) => setDate(new Date(e.target.value))}
                    required
                    className="block w-full rounded-md bg-gray-600 py-2 px-3 text-white placeholder-gray-500 border border-gray-500 focus:ring-2 focus:ring-teal-400"
                  />
                </div>
                <div>
                  <button
                    type="button"
                    onClick={handleCreateTournament}
                    className="w-full flex justify-center rounded-md bg-teal-400 py-2 text-lg font-semibold text-black shadow-lg hover:bg-teal-500 transition-all"
                  >
                    Create Tournament
                  </button>
                </div>
              </form>
            </div>

            {/* WhatsApp Notification */}
            <div className="flex-1 max-w-xs bg-gray-700 rounded-lg shadow-lg p-6 transform hover:scale-105 transition-all hover:shadow-2xl">
              <h3 className="text-lg font-semibold mb-4">📞 WhatsApp Notification</h3>
              <p className="text-sm text-gray-300 mb-4">Send tournament updates to all players via WhatsApp.</p>
              <textarea
                placeholder="Type your message here..."
                value={whatsAppMessage}
                onChange={(e) => setWhatsAppMessage(e.target.value)}
                className="w-full rounded-md bg-gray-600 py-2 px-3 text-white placeholder-gray-500 border border-gray-500 focus:ring-2 focus:ring-teal-400"
              />
              <button
                onClick={handleWhatsAppNotification}
                className="w-full mt-4 rounded-md bg-teal-400 py-2 text-lg font-semibold text-black shadow-lg hover:bg-teal-500 transition-all"
              >
                Send WhatsApp Message
              </button>
            </div>

            <div className="flex-1 max-w-xs bg-gray-700 rounded-lg shadow-lg p-6 transform hover:scale-105 transition-all hover:shadow-2xl">
              <h3 className="text-lg font-semibold mb-4">📊 View Sponsor Analytics</h3>
              <p className="text-sm text-gray-300">Monitor The User Engagement</p>
              <button
                onClick={() => history.push('/admin/chart')}
                className="w-full mt-4 rounded-md bg-teal-400 py-2 text-lg font-semibold text-black shadow-lg hover:bg-teal-500 transition-all"
              >
                View Sponsor Analytics Chart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}