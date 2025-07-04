const API_KEY = "bb17c20aeb39485e8d0140153251906"; 
const BASE_URL = "https://api.weatherapi.com/v1";

export async function getWeather(city) {
  try {
    const res = await fetch(`${BASE_URL}/forecast.json?key=${API_KEY}&q=${city}&days=3&aqi=no`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Weather API error:", error);
    throw error;
  }
}