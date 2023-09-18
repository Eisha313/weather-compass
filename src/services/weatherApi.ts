import { WeatherData, ForecastDay } from '../types/weather';
import { transformCurrentWeather, transformForecast } from '../utils/weatherTransformers';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

interface ApiError {
  cod: string | number;
  message: string;
}

class WeatherApiError extends Error {
  constructor(public code: string | number, message: string) {
    super(message);
    this.name = 'WeatherApiError';
  }
}

async function fetchWithErrorHandling<T>(url: string): Promise<T> {
  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok) {
    const error = data as ApiError;
    throw new WeatherApiError(error.cod, error.message);
  }

  return data as T;
}

export async function getCurrentWeather(lat: number, lon: number): Promise<WeatherData> {
  const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  const rawData = await fetchWithErrorHandling<any>(url);
  return transformCurrentWeather(rawData);
}

export async function getCurrentWeatherByCity(city: string): Promise<WeatherData> {
  const url = `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
  const rawData = await fetchWithErrorHandling<any>(url);
  return transformCurrentWeather(rawData);
}

export async function getForecast(lat: number, lon: number): Promise<ForecastDay[]> {
  const url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  const rawData = await fetchWithErrorHandling<any>(url);
  return transformForecast(rawData);
}

export async function getForecastByCity(city: string): Promise<ForecastDay[]> {
  const url = `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
  const rawData = await fetchWithErrorHandling<any>(url);
  return transformForecast(rawData);
}

export async function searchLocations(query: string): Promise<Array<{ name: string; lat: number; lon: number; country: string; state?: string }>> {
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`;
  const data = await fetchWithErrorHandling<any[]>(url);
  
  return data.map((item) => ({
    name: item.name,
    lat: item.lat,
    lon: item.lon,
    country: item.country,
    state: item.state,
  }));
}

export { WeatherApiError };
