import { WeatherData, ForecastDay, HourlyForecast, WeatherCondition } from '../types/weather';

interface RawWeatherResponse {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
    temp_min: number;
    temp_max: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  clouds: {
    all: number;
  };
  visibility: number;
  dt: number;
  sys: {
    sunrise: number;
    sunset: number;
  };
  name: string;
  coord: {
    lat: number;
    lon: number;
  };
}

interface RawForecastResponse {
  list: Array<{
    dt: number;
    main: RawWeatherResponse['main'];
    weather: RawWeatherResponse['weather'];
    wind: RawWeatherResponse['wind'];
    pop: number;
    rain?: { '3h': number };
    snow?: { '3h': number };
  }>;
  city: {
    name: string;
    coord: { lat: number; lon: number };
    sunrise: number;
    sunset: number;
  };
}

export function mapWeatherCodeToCondition(code: number): WeatherCondition {
  if (code >= 200 && code < 300) return 'thunderstorm';
  if (code >= 300 && code < 400) return 'drizzle';
  if (code >= 500 && code < 600) return 'rain';
  if (code >= 600 && code < 700) return 'snow';
  if (code >= 700 && code < 800) return 'mist';
  if (code === 800) return 'clear';
  if (code > 800 && code < 900) return 'clouds';
  return 'clear';
}

export function transformCurrentWeather(raw: RawWeatherResponse): WeatherData {
  const condition = mapWeatherCodeToCondition(raw.weather[0]?.id || 800);
  
  return {
    location: {
      name: raw.name,
      lat: raw.coord.lat,
      lon: raw.coord.lon,
    },
    current: {
      temp: Math.round(raw.main.temp),
      feelsLike: Math.round(raw.main.feels_like),
      humidity: raw.main.humidity,
      windSpeed: Math.round(raw.wind.speed * 3.6), // Convert m/s to km/h
      windDirection: raw.wind.deg,
      condition,
      description: raw.weather[0]?.description || '',
      icon: raw.weather[0]?.icon || '01d',
      pressure: raw.main.pressure,
      visibility: Math.round(raw.visibility / 1000), // Convert to km
      uvIndex: 0, // Not available in basic API
      cloudCover: raw.clouds.all,
    },
    sunrise: new Date(raw.sys.sunrise * 1000).toISOString(),
    sunset: new Date(raw.sys.sunset * 1000).toISOString(),
    lastUpdated: new Date(raw.dt * 1000).toISOString(),
  };
}

export function transformForecast(raw: RawForecastResponse): ForecastDay[] {
  const dailyMap = new Map<string, {
    temps: number[];
    conditions: WeatherCondition[];
    descriptions: string[];
    icons: string[];
    precipitation: number[];
    hourly: HourlyForecast[];
  }>();

  raw.list.forEach((item) => {
    const date = new Date(item.dt * 1000);
    const dateKey = date.toISOString().split('T')[0];
    const condition = mapWeatherCodeToCondition(item.weather[0]?.id || 800);

    if (!dailyMap.has(dateKey)) {
      dailyMap.set(dateKey, {
        temps: [],
        conditions: [],
        descriptions: [],
        icons: [],
        precipitation: [],
        hourly: [],
      });
    }

    const dayData = dailyMap.get(dateKey)!;
    dayData.temps.push(item.main.temp);
    dayData.conditions.push(condition);
    dayData.descriptions.push(item.weather[0]?.description || '');
    dayData.icons.push(item.weather[0]?.icon || '01d');
    dayData.precipitation.push(item.pop * 100);

    dayData.hourly.push({
      time: date.toISOString(),
      temp: Math.round(item.main.temp),
      condition,
      icon: item.weather[0]?.icon || '01d',
      precipProbability: Math.round(item.pop * 100),
      windSpeed: Math.round(item.wind.speed * 3.6),
    });
  });

  const forecasts: ForecastDay[] = [];
  
  dailyMap.forEach((data, dateKey) => {
    const mostCommonCondition = getMostFrequent(data.conditions);
    const mostCommonDescription = getMostFrequent(data.descriptions);
    const mostCommonIcon = getMostFrequent(data.icons);

    forecasts.push({
      date: dateKey,
      tempHigh: Math.round(Math.max(...data.temps)),
      tempLow: Math.round(Math.min(...data.temps)),
      condition: mostCommonCondition,
      description: mostCommonDescription,
      icon: mostCommonIcon,
      precipProbability: Math.round(Math.max(...data.precipitation)),
      hourly: data.hourly,
    });
  });

  return forecasts.slice(0, 5);
}

function getMostFrequent<T>(arr: T[]): T {
  const frequency = new Map<T, number>();
  let maxFreq = 0;
  let mostFrequent = arr[0];

  arr.forEach((item) => {
    const count = (frequency.get(item) || 0) + 1;
    frequency.set(item, count);
    if (count > maxFreq) {
      maxFreq = count;
      mostFrequent = item;
    }
  });

  return mostFrequent;
}
