import { useState } from "react";
import { getWeather } from "@/utils/weatherApi";
import { FiMapPin, FiSearch, FiClock } from "react-icons/fi";

export default function Home() {
  const [city, setCity] = useState("");
  const [searchedCity, setSearchedCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (city.trim() === "") {
      setError("Please enter a city or area!");
      return;
    }
    try {
      const data = await getWeather(city);
      console.log("Weather data:", data);

      if (data.error) {
        setWeather(null);
        setError("Please enter a valid city or area");
        return;
      }

      setWeather(data);
      setSearchedCity(city);
      setCity("");
      setError("");
    } catch (error) {
      console.error("Error fetching weather:", error);
      setWeather(null);
      setError("Please enter a valid city or area");
    }
  }

  const getCurrentLocationWeather = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const data = await getWeather(`${lat},${lon}`);
        setWeather(data);
        setError("");
        setCity("");
      },
      () => {
        setError("Location access denied.");
      }
    );
  };

  let weekday = "";
  if (weather && weather.forecast) {
    const date = new Date(weather.forecast.forecastday[2].date);
    weekday = date.toLocaleDateString("en-US", { weekday: "long" });
  }



  return (
    <div className="min-h-screen flex items-center justify-center flex-col bg-gradient-to-b from-slate-800 to-blue-700">
      <h1 className="hidden sm:block text-3xl font-semibold mb-6 text-white">Welcome to Weatherly</h1>
      <div className="w-full min-h-screen mt-5 sm:mt-0 sm:min-h-0 sm:w-[350px] sm:w- flex flex-col sm:bg-white/30 sm:rounded-lg sm:border sm:border-white/30 sm:backdrop-blur-xl sm:shadow-2xl p-6">
        {!weather && <h2 className="text-lg mb-2 text-white">Find your weather forecast</h2>}
        <div className="flex items-center">
          <input className="w-full bg-white border border-slate-400 rounded-sm text-sm py-1 px-2 focus:border-slate-800 focus:outline-0" aria-label="search" type="text" placeholder="Search city or area"
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              setError("")
            }} />
          <div className="flex gap-2 ml-2">
            <button title="Search"
              className="bg-blue-700 text-white rounded-2xl flex h-7 w-7 items-center justify-center hover:bg-blue-900 hover:cursor-pointer active:scale-95 text-sm"
              onClick={handleSearch}>
              <FiSearch />
            </button>
            <button title="Use my location"
              className="self-start bg-blue-700 text-white rounded-2xl flex h-7 w-7 items-center justify-center hover:bg-blue-900 hover:cursor-pointer active:scale-95 text-sm"
              onClick={getCurrentLocationWeather}>
              <FiMapPin />
            </button>
          </div>
        </div>
        {error && <p className="text-xs mt-2">{error}</p>}
        {weather && weather.forecast && (
          <>
            <h2 className="text-lg mt-5 mb-2 text-white">
              {weather.location.name}, {weather.location.country}
            </h2>
            <div className="h-2/3 flex flex-col gap-4 bg-white rounded-md shadow-sm shadow-slate-400 p-4">
              <div className="flex gap-2 items-center">
                <p className="font-bold text-lg">{weather.current.temp_c}°C</p>
                <img src={weather.current.condition.icon} alt="weather icon" className="h-10 w-10" />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2 items-center">
                  <p className="bg-blue-100 px-2 py-1 rounded-sm text-xs">{weather.current.condition.text}</p>
                  <p className="bg-blue-100 px-2 py-1 rounded-sm text-xs flex items-center gap-1" title="Last updated"><FiClock />{weather.current.last_updated.split(" ")[1]}</p>
                </div>
                <div className="flex gap-2 items-center">
                  <p className="bg-blue-100 px-2 py-1 rounded-sm text-xs">UV: {weather.current.uv}</p>
                  <p className="bg-blue-100 px-2 py-1 rounded-sm text-xs">Humidity: {weather.current.humidity}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-2 w-full">
              <div className="flex flex-col gap-2 bg-white rounded-md p-4 shadow-sm shadow-slate-400 w-1/2">
                <p className="text-xs font-semibold">Tomorrow</p>
                <div className="flex gap-2 items-center">
                  <p className="font-bold text-sm">{weather.forecast.forecastday[1].day.avgtemp_c}°C</p>
                  <img src={weather.forecast.forecastday[1].day.condition.icon} alt="weather-icon" className="h-5 w-5"></img>
                </div>
              </div>
              <div className="flex flex-col gap-2 bg-white rounded-md p-4 shadow-sm shadow-slate-400 w-1/2">
                <p className="text-xs font-semibold">{weekday}</p>
                <div className="flex gap-2 items-center">
                  <p className="font-bold text-sm">{weather.forecast.forecastday[2].day.avgtemp_c}°C</p>
                  <img src={weather.forecast.forecastday[2].day.condition.icon} alt="weather-icon" className="h-5 w-5"></img>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
