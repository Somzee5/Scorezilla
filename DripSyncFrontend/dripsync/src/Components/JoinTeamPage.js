// JoinTeamPage.js
import React, { useState } from 'react';
import api from '../utils/api';

const JoinTeamPage = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        tc: true, // Assuming the user accepts the terms and conditions
        role: 'Player', // Default role
        team: 'teamB', // Set the team name or dynamically obtain it
        player_id: '', // Optional field
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    /*const handleSubmit = async (e) => {
    e.preventDefault();
    const teamName = formData.team;

    const dataToSubmit = {
        firstname: formData.firstName, // Change this
        lastname: formData.lastName,    // Change this
        email: formData.email,
        password: 'yourPassword',        // Replace with actual input or logic
        password2: 'yourPassword',       // Ensure this matches the password
        role: formData.role,
        tc: formData.tc,                 // Include this if necessary
    };

    try {
        const response = await api.post(`/register/${teamName}/`, dataToSubmit);
        ...
    } catch (error) {
        console.error('Error during registration:', error.response.data);  // Log the error response
    }
};
 */








    const handleSubmit = async (e) => {
      e.preventDefault();
      const team = formData.team; // Use the selected team name from state
  
      // Prepare the data to be sent, matching backend expectations
      const dataToSubmit = {
          firstname: formData.firstName, // Change to 'firstname'
          lastname: formData.lastName,    // Change to 'lastname'
          email: formData.email,
          password: 'yourPassword123',     // Adjust as needed or replace with an actual input value
          password2: 'yourPassword123',    // Ensure this matches the password
          role: formData.role,
          tc: formData.tc,                 // Include this if necessary
      };
  
      try {
          const response = await api.post(`/register/${team}/`, dataToSubmit);
  
          if (response.status === 201) {
              alert(`Welcome to the team, ${formData.firstName}!`);
              setFormData({
                  firstName: '',
                  lastName: '',
                  email: '',
                  tc: true,
                  team: 'teamB',
                  role: 'Player',
                  player_id: ''
              });
          } else {
              console.error('Registration failed:', response.data);
              alert('Registration failed: ' + (response.data.message || 'An error occurred.'));
          }
      } catch (error) {
          console.error('Error during registration:', error);
          alert('An error occurred while registering. Please try again later.');
      }
  };
  

    return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-10">
            <div className="bg-gradient-to-br from-green-600 via-teal-600 to-green-500 p-10 rounded-lg shadow-xl w-full max-w-lg">
                <h1 className="text-4xl font-bold mb-6 text-center">
                    Join Your Team on <span className="text-yellow-400">ScoreZilla!</span>
                </h1>
                <p className="text-gray-200 mb-8 text-center">
                    Enter your details to become part of the winning team!
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block mb-2 text-sm">First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            placeholder="Enter your first name"
                            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-2 text-sm">Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            placeholder="Enter your last name"
                            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-2 text-sm">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter your email"
                            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-yellow-400 text-gray-900 font-bold py-3 rounded-lg hover:bg-yellow-300 transition-all"
                    >
                        Join Team!
                    </button>
                </form>

                <p className="mt-8 text-center text-gray-300">
                    Already a member? <span className="text-yellow-400">Go to team page</span>
                </p>
            </div>
        </div>
    );
};

export default JoinTeamPage;
