export type WeatherCondition =
  | 'clear'
  | 'partly-cloudy'
  | 'cloudy'
  | 'overcast'
  | 'rain'
  | 'heavy-rain'
  | 'thunderstorm'
  | 'snow'
  | 'sleet'
  | 'fog'
  | 'wind'
  | 'hail';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Location {
  id: string;
  name: string;
  country: string;
  coordinates: Coordinates;
  timezone: string;
}

export interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  condition: WeatherCondition;
  description: string;
  uvIndex: number;
  visibility: number;
  pressure: number;
  updatedAt: Date;
}

export interface HourlyForecast {
  time: Date;
  temperature: number;
  condition: WeatherCondition;
  precipitationProbability: number;
  precipitationType?: 'rain' | 'snow' | 'sleet' | 'none';
  precipitationAmount?: number;
  humidity: number;
  windSpeed?: number;
  windDirection?: number;
}

export interface DailyForecast {
  date: Date;
  temperatureHigh: number;
  temperatureLow: number;
  condition: WeatherCondition;
  description: string;
  precipitationProbability: number;
  precipitationType?: 'rain' | 'snow' | 'sleet' | 'none';
  sunrise: Date;
  sunset: Date;
  uvIndex: number;
  humidity: number;
  windSpeed: number;
  hourly?: HourlyForecast[];
}

export interface WeatherData {
  location: Location;
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
}

export interface WeatherError {
  code: string;
  message: string;
}

export interface BookmarkedLocation extends Location {
  addedAt: Date;
  nickname?: string;
}
