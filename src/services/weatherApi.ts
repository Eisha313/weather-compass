import { CurrentWeather, ForecastData } from '../types/weather';

const API_BASE_URL = 'https://api.openweathermap.org/data/2.5';
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || '';

export class WeatherApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'WeatherApiError';
  }
}

async function fetchWithErrorHandling<T>(url: string): Promise<T> {
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new WeatherApiError(
      response.status,
      `Weather API error: ${response.statusText}`
    );
  }
  
  return response.json();
}

export async function getCurrentWeather(
  lat: number,
  lon: number
): Promise<CurrentWeather> {
  const url = `${API_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  const data = await fetchWithErrorHandling<any>(url);
  
  return {
    location: {
      name: data.name,
      country: data.sys.country,
      lat: data.coord.lat,
      lon: data.coord.lon,
    },
    temperature: {
      current: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      min: Math.round(data.main.temp_min),
      max: Math.round(data.main.temp_max),
    },
    humidity: data.main.humidity,
    pressure: data.main.pressure,
    windSpeed: data.wind.speed,
    windDirection: data.wind.deg || 0,
    visibility: data.visibility,
    clouds: data.clouds.all,
    condition: data.weather[0],
    sunrise: data.sys.sunrise,
    sunset: data.sys.sunset,
    timezone: data.timezone,
    lastUpdated: Date.now(),
  };
}

export async function getForecast(
  lat: number,
  lon: number
): Promise<ForecastData> {
  const url = `${API_BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  const data = await fetchWithErrorHandling<any>(url);
  
  const hourly = data.list.slice(0, 24).map((item: any) => ({
    timestamp: item.dt,
    temperature: Math.round(item.main.temp),
    feelsLike: Math.round(item.main.feels_like),
    humidity: item.main.humidity,
    condition: item.weather[0],
    precipitationProbability: Math.round((item.pop || 0) * 100),
    windSpeed: item.wind.speed,
  }));
  
  const dailyMap = new Map<string, any[]>();
  data.list.forEach((item: any) => {
    const date = new Date(item.dt * 1000).toDateString();
    if (!dailyMap.has(date)) {
      dailyMap.set(date, []);
    }
    dailyMap.get(date)!.push(item);
  });
  
  const daily = Array.from(dailyMap.entries()).slice(0, 5).map(([_, items]) => {
    const temps = items.map((i) => i.main.temp);
    const midday = items.find((i) => {
      const hour = new Date(i.dt * 1000).getHours();
      return hour >= 11 && hour <= 14;
    }) || items[0];
    
    return {
      date: items[0].dt,
      temperature: {
        min: Math.round(Math.min(...temps)),
        max: Math.round(Math.max(...temps)),
        day: Math.round(midday.main.temp),
        night: Math.round(items[items.length - 1].main.temp),
      },
      condition: midday.weather[0],
      precipitationProbability: Math.round(
        Math.max(...items.map((i: any) => i.pop || 0)) * 100
      ),
      humidity: Math.round(
        items.reduce((sum: number, i: any) => sum + i.main.humidity, 0) / items.length
      ),
      windSpeed: Math.round(
        items.reduce((sum: number, i: any) => sum + i.wind.speed, 0) / items.length
      ),
      sunrise: 0,
      sunset: 0,
    };
  });
  
  return {
    location: {
      name: data.city.name,
      country: data.city.country,
      lat: data.city.coord.lat,
      lon: data.city.coord.lon,
    },
    hourly,
    daily,
  };
}

export async function searchLocation(query: string): Promise<Array<{
  name: string;
  country: string;
  lat: number;
  lon: number;
  state?: string;
}>> {
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`;
  const data = await fetchWithErrorHandling<any[]>(url);
  
  return data.map((item) => ({
    name: item.name,
    country: item.country,
    lat: item.lat,
    lon: item.lon,
    state: item.state,
  }));
}
