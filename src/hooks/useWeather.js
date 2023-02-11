import axios from "axios";
import React, { useEffect, useState } from "react";

const initialState = {
  cityName: "",
  country: "",
  main: "",
  description: "",
  icon: "01d",
  humidity: null,
  temperature: { main: null, feels_like: null, min: null, max: null },
  wind: { speed: null },
  cloudiness: null,
  visibility: null,
  timezone: null,
  dt: null,
};

const useWeather = ({ cityName, onError }) => {
  const [city, setCity] = useState(cityName);
  const [weather, setWeather] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
    if (!city) return;
    setLoading(true);

    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=7b417018ffd79187903328447561cb7c`)
      .then((res) => {
        let {
          name: cityName,
          weather: [{ main: status, description, icon }],
          main: { temp, feels_like, temp_min, temp_max, humidity },
          sys: { country },
          wind: { speed: windSpeed },
          clouds: { all: cloudiness },
          visibility,
          timezone,
          dt,
        } = res.data;

        let weatherObj = {
          cityName,
          main: status,
          description,
          country,
          icon,
          humidity,
          temperature: { main: temp, feels_like, min: temp_min, max: temp_max },
          wind: { speed: windSpeed },
          cloudiness,
          visibility,
          timezone,
          dt,
        };

        setWeather(weatherObj);
        setLoading(false);
      })
      .catch((error) => {
        setError({ code: error.code, message: error.message });
        onError();
        setLoading(false);
      });
  }, [city]);

  return [weather, loading, error, setCity];
};

export default useWeather;
