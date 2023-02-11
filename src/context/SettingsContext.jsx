import { createContext, useCallback, useState } from "react";

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [tempUnits, setTempUnits] = useState("C");

  const convertTemp = (temp) => {
    if (temp === null) return 0;
    let num = Number(temp);
    if (tempUnits == "F") {
      num = (num - 273.15) * (9 / 5) + 32;
    } else if (tempUnits == "C") {
      num = num - 273.15;
    }
    return parseInt(num);
  };

  return <SettingsContext.Provider value={{ tempUnits, convertTemp, setTempUnits }}>{children}</SettingsContext.Provider>;
};

export default SettingsContext;
