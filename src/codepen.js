import React, { useState, useContext, useRef, useCallback, useEffect, useMemo, memo, createContext } from "https://esm.sh/react@18.2.0";
import ReactDOM from "https://esm.sh/react-dom@18.2.0";

// WeatherHook
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

// SettingsContext
const SettingsContext = createContext();

const SettingsProvider = ({ children }) => {
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

// TemperatureButtons
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

// SearchBox
const SearchBox = ({ action, refTarget }) => {
  return (
    <div className="flex-auto flex flex-row gap-3 text-lg">
      <div className="flex-auto">
        <input ref={refTarget} onKeyUp={action} className="p-3 rounded-xl min-w-0 w-full" type="text" placeholder="City name..."></input>
      </div>
      <button className="text-slate-200 bg-indigo-600 font-bold p-3 rounded-xl" onClick={action}>
        Search
      </button>
    </div>
  );
};

// WeatherCard

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
    <div className="bg-gradient-to-r gap-3 from-cyan-500 to-blue-800 flex items-stretch p-6 md:px-16 rounded-3xl text-white duration-500">
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
          <p className="uppercase text-lg md:capitalize md:text-5xl lg:text-6xl">{weather.main}</p>
          <p className="capitalize text-sm md:mt-6 md:text-xl lg:text-2xl">{weather.description}</p>
        </div>
      </div>
    </div>
  );
};

// GenericCard
const GenericCard = ({ logo, title, text }) => {
  return (
    <div className="bg-slate-700 flex flex-row rounded-xl shadow-lg mb-6 sm:mb-0 bg-secondary-light dark:bg-ternary-dark">
      <div className="flex-auto p-6">
        <img className="w-28 h-28 mx-auto" src={logo} alt="logo" />
      </div>

      <div className="flex-auto flex flex-col justify-center items-center p-6 text-white">
        <b className="text-xl opacity-50">{title}</b>
        <p className="text-3xl opacity-80">{text}</p>
      </div>
    </div>
  );
};

// WeatherView
const WeatherView = () => {
  const cityName = useRef("");
  const [weather, loading, error, setCity] = useWeather({ cityName: "Miami", onError: () => {} });

  const handleSearch = (e) => {
    if (e.type !== "click" && e.key !== "Enter") return;

    let cName = cityName.current.value;
    if (cName.trim()) {
      setCity(String(cName));
    }
  };

  return (
    <div className="flex-auto">
      <div className="flex flex-col md:flex-row-reverse items-stretch mb-6 gap-3 md:gap-9">
        <TemperatureButton />
        <SearchBox action={handleSearch} refTarget={cityName} />
      </div>
      <WeatherCard weather={weather} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-6 sm:gap-3">
        <GenericCard logo="https://miguel-ch.github.io/assets_repo/weather/wind_2.svg" title="Wind Speed" text={weather.wind.speed + "m/s"} />
        <GenericCard logo="https://miguel-ch.github.io/assets_repo/weather/humidity_2.svg" title="Humidity" text={weather.humidity + "%"} />
        <GenericCard logo="https://miguel-ch.github.io/assets_repo/weather/cloudiness.svg" title="Cloudiness" text={weather.cloudiness + "%"} />
      </div>
    </div>
  );
};

// Content
const AppContent = () => {
  return (
    <div className="flex-auto flex items-center justify-center py-6 px-8 sm:px-4 lg:px-28 bg-slate-800">
      <WeatherView />
    </div>
  );
};
// AppFooter
const AppFooter = () => {
  return (
    <footer>
      <div className="p-3 bg-slate-900 bottom-0 mx-auto text-slate-600">
        <center>
          <b>
            Weather App | {""}
            <a href="https://github.com/miguel-ch/weather-app" target="_blank">
              Github Repository | {""}
            </a>
            <a href="https://codepen.io/miguel-ch/pen/KKBjRvo" target="_blank">
              Codepen
            </a>
          </b>
          <p>2023. Miguel Chaparro</p>
        </center>
      </div>
    </footer>
  );
};

// AppHeader
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

// App
function App() {
  return (
    <>
      <SettingsProvider>
        <AppHeader />
        <AppContent />
        <AppFooter />
      </SettingsProvider>
    </>
  );
}

// main.jsx
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
