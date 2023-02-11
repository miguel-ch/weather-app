import React, { memo, useContext, useState } from "react";
import SettingsContext from "../context/SettingsContext";

const TemperatureButton = () => {
  const { tempUnits, setTempUnits } = useContext(SettingsContext);

  const buttonClass = (condition) => {
    return (condition ? "bg-indigo-600 text-slate-200 " : "") + "p-2 w-24 flex-auto";
  };

  return (
    <>
      <div className="flex flex-auto overflow-hidden border border-indigo-600 bg-slate-900 text-indigo-600 font-bold rounded-md">
        <button className={buttonClass(tempUnits === "F")} onClick={() => setTempUnits("F")}>
          Fahrenheit
        </button>
        <button className={buttonClass(tempUnits === "C")} onClick={() => setTempUnits("C")}>
          Celsius
        </button>
      </div>
    </>
  );
};

export default memo(TemperatureButton);
