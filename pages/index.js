import { useState } from "react";
import { getWeather } from "@/utils/weatherApi";

export default function Home() {
  const [city, setCity] = useState("");
  const [searchedCity, setSearchedCity] = useState("");
  const [weather, setWeather] = useState(null);

  const handleSearch = async () => {
    try {
      const data = await getWeather(city);
      console.log("Weather data:", data);
      setWeather(data);
      setSearchedCity(city);
      setCity("");
    } catch (error) {
      console.error("Error fetching weather:", error);
      setWeather(null);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center flex-col bg-gradient-to-t from-blue-700 to-blue-900">
      <h1 className="text-center text-4xl font-bold mb-6 text-white">Weatherly 🌥️</h1>
      <div className="flex flex-col bg-white rounded-lg shadow-blue-900 shadow-lg h-96 p-8 w-full max-w-fit">
        <div className="flex items-center">
          <input className="border border-gray-400 rounded-md text-sm py-1 px-2" type="text" placeholder="Search city or area" value={city} onChange={(e) => setCity(e.target.value)} />
          <button className="bg-blue-600 rounded-md hover:bg-blue-800 hover:cursor-pointer active:scale-95 text-white px-2 py-1 text-sm ml-2" onClick={handleSearch}>Search</button>
        </div>
        <h2 className="font-semibold text-xl mt-4">{searchedCity}</h2>
        {weather && (
          <div className="h-2/3 rounded-lg shadow-sm shadow-gray-400 p-4 mt-4 text-sm font-semibold">
            <div className="flex gap-2 mb-2 items-center">
              <p className="font-bold text-lg">{weather.current.temp_c}°C</p>
              <span>|</span>
              <p>{weather.current.condition.text}</p>
            </div>
            <img src={weather.current.condition.icon} alt="weather icon" />
            <div className="flex gap-2 mt-2">
              <p className="shadow-sm shadow-gray-400 p-2 rounded-md text-xs">UV: <b>{weather.current.uv}</b></p>
              <p className="shadow-sm shadow-gray-400 p-2 rounded-md text-xs">Humidity: <b>{weather.current.humidity}</b></p>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
