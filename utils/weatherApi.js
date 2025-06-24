const API_KEY = "bb17c20aeb39485e8d0140153251906"; 
const BASE_URL = "https://api.weatherapi.com/v1";

export async function getWeather(city) {
  try {
    const res = await fetch(`${BASE_URL}/current.json?key=${API_KEY}&q=${city}&aqi=no`);
    if (!res.ok) throw new Error("Failed to fetch weather");
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Weather API error:", error);
    throw error;
  }
}