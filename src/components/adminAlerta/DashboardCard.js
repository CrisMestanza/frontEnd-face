// src/components/DashboardCard.jsx
import React from "react";
import "./DashboardCard.css";

const DashboardCard = ({ title, value, icon, color = "blue" }) => {
  return (
    <div className={`dashboard-card ${color}`}>
      <div className="dashboard-card-header">
        <h4 className="dashboard-card-title">{title}</h4>
        <div className="dashboard-card-icon">{icon}</div>
      </div>

      <div className="dashboard-card-value">{value}</div>
    </div>
  );
};

export default DashboardCard;
