import React from "react";
import WeatherView from "./WeatherView";

const AppContent = () => {
  return (
    <div className="flex-auto flex items-center justify-center py-6 px-8 sm:px-4 lg:px-28 bg-slate-800 duration-500">
      <WeatherView />
    </div>
  );
};

export default AppContent;
