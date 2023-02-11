import moment from "moment-timezone";
import React, { memo, useContext, useMemo } from "react";
import SettingsContext from "../context/SettingsContext";

const WeatherCard = ({ weather }) => {
  const { tempUnits, convertTemp } = useContext(SettingsContext);
  const temp = useMemo(() => {
    return {
      main: convertTemp(weather.temperature.main),
      feels_like: convertTemp(weather.temperature.feels_like),
      min: convertTemp(weather.temperature.min),
      max: convertTemp(weather.temperature.max),
    };
  }, [weather, tempUnits]);
  const countryTime = moment()
    .utcOffset(weather.timezone / 60)
    .format("MMM Do, h:m a");

  return (
    <div className="bg-gradient-to-r gap-3 from-cyan-500 to-blue-800 flex items-stretch p-6 md:px-16 rounded-3xl text-white">
      <div className="flex-auto flex flex-col gap-x-5 justify-between md:flex-row md:justify-around md:items-center">
        <div>
          <p className="text-7xl md:text-9xl">{temp.main}°</p>
          <p className="text-xl md:text-3xl capitalize">
            {weather.cityName}, {weather.country}
          </p>
        </div>

        <div className="text-lg md:text-5xl lg:text-6xl">
          <p>
            {temp.min}°/{temp.max}°
          </p>
          <div className="text-sm md:mt-9 md:text-xl lg:text-2xl">
            Feels like {temp.feels_like}°
            <br />
            <p>{countryTime}</p>
          </div>
        </div>
      </div>
      <div className="flex-auto flex flex-col justify-around items-center md:flex-row-reverse">
        <img className="w-40 h-40 md:w-56 md:h-56" src={`https://miguel-ch.github.io/assets_repo/weather/${weather.icon}.svg`} alt="Weather"></img>
        <div className="flex flex-col items-center md:items-end">
          <p className="uppercase font-bold md:font-normal text-lg md:capitalize md:text-5xl lg:text-6xl">{weather.main}</p>
          <p className="capitalize text-sm md:mt-6 md:text-xl lg:text-2xl">{weather.description}</p>
        </div>
      </div>
    </div>
  );
};

export default memo(WeatherCard);
