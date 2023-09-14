export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface CurrentWeather {
  location: {
    name: string;
    country: string;
    lat: number;
    lon: number;
  };
  temperature: {
    current: number;
    feelsLike: number;
    min: number;
    max: number;
  };
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  visibility: number;
  clouds: number;
  condition: WeatherCondition;
  sunrise: number;
  sunset: number;
  timezone: number;
  lastUpdated: number;
}

export interface HourlyForecast {
  timestamp: number;
  temperature: number;
  feelsLike: number;
  humidity: number;
  condition: WeatherCondition;
  precipitationProbability: number;
  windSpeed: number;
}

export interface DailyForecast {
  date: number;
  temperature: {
    min: number;
    max: number;
    day: number;
    night: number;
  };
  condition: WeatherCondition;
  precipitationProbability: number;
  humidity: number;
  windSpeed: number;
  sunrise: number;
  sunset: number;
}

export interface ForecastData {
  location: {
    name: string;
    country: string;
    lat: number;
    lon: number;
  };
  hourly: HourlyForecast[];
  daily: DailyForecast[];
}

export interface SavedLocation {
  id: string;
  name: string;
  country: string;
  lat: number;
  lon: number;
  isPrimary: boolean;
}
