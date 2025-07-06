import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react'; // Import QR code component
import { useHistory } from 'react-router-dom'; // Import useHistory for navigation
import api from "../utils/api"; // Importing api

const LeaderHomePage = () => {
  const [teammates, setTeammates] = useState([]);
  const [newTeammate, setNewTeammate] = useState({ name: '', role: '' });
  const [teamName, setTeamName] = useState('');
  const [teamQR, setTeamQR] = useState('');
  const history = useHistory(); // Initialize useHistory

  // Fetch the team name from the backend when the component mounts
  useEffect(() => {
    const fetchTeamName = async () => {
      try {
        const response = await api.get('/team-name'); // Use api.get here
        console.log(response.data); // Debugging line
        setTeamName(response.data.teamName);
      } catch (error) {
        console.error('Error fetching team name:', error);
      }
    };

    fetchTeamName();
  }, []);

  // Generate the team's QR code when teamName is set
  useEffect(() => {
    if (teamName) {
      const teamJoinLink = `http://localhost:3000/home/Leader/team/${teamName}`; // Include teamName in the QR code URL
      setTeamQR(teamJoinLink);
    }
  }, [teamName]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTeammate({ ...newTeammate, [name]: value });
  };

  const addTeammate = () => {
    if (newTeammate.name && newTeammate.role) {
      setTeammates([...teammates, newTeammate]);
      setNewTeammate({ name: '', role: '' });
    }
  };

  const removeTeammate = (index) => {
    setTeammates(teammates.filter((_, i) => i !== index));
  };

  // Function to navigate to the certificate page
  const handleGenerateCertificate = () => {
    history.push('/certificate');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10">
      <nav className="flex justify-between items-center p-5 shadow-lg bg-green-600 mb-8">
        <div className="text-2xl font-bold">
          ScoreZilla - {teamName ? teamName : "Loading..."} Management
        </div>
        <div>
          <button
            onClick={handleGenerateCertificate}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition mr-4"
          >
            Generate Certificate
          </button>
          <button className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition">
            Logout
          </button>
        </div>
      </nav>

      {/* Team QR Code Section */}
      <div className="max-w-lg mx-auto mb-10 text-center">
        <h2 className="text-3xl font-bold mb-4 text-green-500">{teamName} QR Code</h2>
        <div className="bg-white p-6 rounded-lg shadow-lg inline-block">
          <QRCodeCanvas value={teamQR} size={256} bgColor="#ffffff" fgColor="#000000" />
        </div>
        <p className="mt-4 text-gray-400">
          Scan the QR code to join {teamName}.
        </p>
      </div>

      {/* Add Teammate Section */}
      <div className="max-w-lg mx-auto mb-10">
        <h2 className="text-3xl font-bold mb-4 text-green-500">Add Teammate</h2>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={newTeammate.name}
              onChange={handleInputChange}
              placeholder="Enter teammate's name"
              className="w-full p-2 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Role</label>
            <input
              type="text"
              name="role"
              value={newTeammate.role}
              onChange={handleInputChange}
              placeholder="Enter teammate's role"
              className="w-full p-2 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-green-500"
            />
          </div>
          <button
            onClick={addTeammate}
            className="w-full bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition"
          >
            Add Teammate
          </button>
        </div>
      </div>

      {/* List of Teammates */}
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-4 text-green-500">Team Members</h2>
        {teammates.length === 0 ? (
          <p className="text-gray-400">No teammates added yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teammates.map((teammate, index) => (
              <div
                key={index}
                className="bg-gray-800 p-4 rounded-lg shadow-lg flex justify-between items-center border border-gray-600"
              >
                <div>
                  <h3 className="text-xl font-semibold text-green-400">{teammate.name}</h3>
                  <p className="text-sm text-gray-400">{teammate.role}</p>
                </div>
                <button
                  onClick={() => removeTeammate(index)}
                  className="text-red-500 hover:text-red-600 transition"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderHomePage;
