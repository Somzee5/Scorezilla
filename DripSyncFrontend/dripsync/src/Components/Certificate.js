import React, { useState } from 'react';

const CertificateDownload = () => {
  const [certificateData, setCertificateData] = useState('');

  const winners = JSON.parse(localStorage.getItem('winners')) || [];

  const handleGenerateCertificate = async (position, teamName) => {
    try {
      const response = await fetch('http://localhost:5000/generate_certificate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teamName, position }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate certificate');
      }

      const data = await response.json();
      const base64Image = data.certificate;
      setCertificateData(`data:image/png;base64,${base64Image}`);
    } catch (error) {
      console.error('Error generating certificate:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-gray-800 to-gray-900 text-white">
      <nav className="flex justify-between items-center p-4 bg-gray-900 shadow-md">
        <h1 className="nav-logo text-3xl font-extrabold text-gradient drop-shadow-lg">
          Certificate Generator
        </h1>
      </nav>

      <div className="flex flex-1 flex-col items-center mt-12">
        <h2 className="text-3xl font-bold text-green-600 mb-8">Generate Your Certificate</h2>
        
        {/* Winner Cards Container */}
        <div className="flex flex-wrap justify-center mb-8">
          {winners.length > 0 ? (
            winners.map((winner, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-lg p-6 w-80 shadow-lg mx-2 mb-6 text-center transform transition-transform hover:scale-105"
              >
                <h3 className="text-xl font-semibold text-gray-200">Team: {winner.teamName}</h3>
                <p className="text-md text-gray-400">Position: {winner.position}</p>
                <button
                  onClick={() => handleGenerateCertificate(winner.position, winner.teamName)}
                  className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none"
                >
                  Generate Certificate for {winner.teamName}
                </button>
              </div>
            ))
          ) : (
            <p className="text-lg text-gray-400 mt-4">No winners data found in local storage.</p>
          )}
        </div>

        {/* Generated Certificate Section */}
        {certificateData && (
          <div className="flex flex-col items-center mt-10">
            <h3 className="text-2xl font-semibold mb-6 text-gray-200">Your Certificate:</h3>
            <img src={certificateData} alt="Generated Certificate" className="w-96 h-auto border-4 border-green-500 rounded-lg shadow-md mb-6" />
            <a
              href={certificateData}
              download="certificate.png"
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none text-lg"
            >
              Download Certificate
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificateDownload;
