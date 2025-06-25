import { useState } from "react";
import { getWeather } from "@/utils/weatherApi";
import { FiMapPin, FiSearch } from "react-icons/fi";

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

  return (
    <div className="min-h-screen flex items-center justify-center flex-col bg-gradient-to-t from-blue-700 to-blue-900">
      <h1 className="text-center text-4xl font-bold mb-6 text-white">Weatherly 🌥️</h1>
      <div className="flex flex-col bg-blue-50 rounded-lg shadow-blue-900 shadow-lg h-96 p-8 w-full max-w-fit">
        <div className="flex items-center">
          <input className="bg-white border border-gray-400 rounded-md text-sm py-1 px-2" type="text" placeholder="Search city or area" value={city}
            onChange={(e) => {
              setCity(e.target.value);
              setError("")
            }} />
          <div className="flex gap-2 ml-2">
            <button title="Search" className="bg-blue-600 rounded-md flex h-7 w-7 items-center justify-center hover:bg-blue-800 hover:cursor-pointer active:scale-95 text-white text-sm"
              onClick={handleSearch}><FiSearch /></button>
            <button title="Use my location" className="self-start bg-blue-600 rounded-md flex h-7 w-7 items-center justify-center hover:bg-blue-800 hover:cursor-pointer active:scale-95 text-white text-sm" onClick={getCurrentLocationWeather}><FiMapPin /></button>
          </div>
        </div>
        {error && <p className="text-sm mt-2">{error}</p>}
        {weather && (
          <>
            <h2 className="font-semibold text-lg mt-4 mb-2">
              {weather.location.name}, {weather.location.country}
            </h2>
            <div className="h-2/3 flex flex-col justify-between bg-white rounded-lg shadow-sm shadow-gray-400 p-4 text-sm font-semibold">
              <div className="flex flex-col">
                <p className="font-bold text-lg">{weather.current.temp_c}°C</p>
                <div className="flex gap-2 items-center">
                  <p className="text-xs">{weather.current.condition.text}</p>
                  <span>|</span>
                  <p className="text-xs">Last updated {weather.current.last_updated.split(" ")[1]}</p>
                </div>
              </div>
              <img src={weather.current.condition.icon} alt="weather icon" className="h-16 w-16" />
              <div className="flex gap-2">
                <p className="shadow-sm shadow-gray-300 py-1 px-2 rounded-md text-xs">UV: <b>{weather.current.uv}</b></p>
                <p className="shadow-sm shadow-gray-300 py-1 px-2 rounded-md text-xs">Humidity: <b>{weather.current.humidity}</b></p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
