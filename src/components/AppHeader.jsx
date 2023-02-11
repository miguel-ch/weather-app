import React from "react";

const AppHeader = () => {
  return (
    <header>
      <div className="flex flex-row items-center gap-x-3 w-full p-4 bg-slate-900">
        <img src="https://miguel-ch.github.io/assets_repo/weather/logo_earth.svg" className="h-12" alt="Logo" />
        <p className="text-4xl font-bold text-white opacity-60">Weather Status</p>
      </div>
    </header>
  );
};

export default AppHeader;
