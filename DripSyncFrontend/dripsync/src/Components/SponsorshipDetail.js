import React from "react";
import ChartPage from "./ChartPage"; // Import ChartPage component

const SponsorshipDetails = ({ userVisitCount, clickCount, hoverCount }) => {
  return (
    <div className="bg-gray-700 p-8 rounded-lg shadow-lg mt-12 text-white">
      <h2 className="text-2xl font-bold mb-4">Sponsorship Details</h2>
      {/* Include the chart here */}
      <ChartPage
        userVisitCount={userVisitCount}
        clickCount={clickCount}
        hoverCount={hoverCount}
      />
    </div>
  );
};

export default SponsorshipDetails;
