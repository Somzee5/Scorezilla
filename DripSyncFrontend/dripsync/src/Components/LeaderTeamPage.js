import { useLocation } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";

export default function LeaderTeamPage() {
  const location = useLocation();
  
  const teamName = location.pathname.split("/").pop(); // Get the last part of the URL
  
  const qrCodeData = `http://localhost:3000/home/Leader/team/${teamName || "defaultTeamName"}`;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white">
      <h1 className="text-3xl font-bold mb-4">Add Members to {teamName || "Default Team"}</h1>
      <p className="text-lg mb-6">Scan the QR code to join the team:</p>
      <QRCodeCanvas value={qrCodeData} size={256} bgColor="#ffffff" fgColor="#000000" />
    </div>
  );
}
