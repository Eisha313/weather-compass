# Weather Compass API Guide

## Overview

Weather Compass uses a weather API service to fetch real-time weather data. This document covers how to work with the API layer.

## Configuration

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
VITE_WEATHER_API_KEY=your_api_key_here
VITE_WEATHER_API_URL=https://api.weatherapi.com/v1
```

## Weather Service

The `weatherApi.ts` service provides the following methods:

### getCurrentWeather

Fetch current weather for a location.

```typescript
import { getCurrentWeather } from './services/weatherApi';

const weather = await getCurrentWeather('London');
// or with coordinates
const weather = await getCurrentWeather({ lat: 51.5074, lon: -0.1278 });
```

**Response Type:** `CurrentWeatherData`

### getForecast

Fetch 5-day forecast with hourly breakdown.

```typescript
import { getForecast } from './services/weatherApi';

const forecast = await getForecast('New York', { days: 5 });
```

**Response Type:** `ForecastData`

### searchLocations

Search for locations by name.

```typescript
import { searchLocations } from './services/weatherApi';

const results = await searchLocations('Par'); // Returns Paris, etc.
```

**Response Type:** `Location[]`

## Custom Hooks

### useWeather

Primary hook for accessing weather data.

```typescript
import { useWeather } from './hooks/useWeather';

function MyComponent() {
  const { 
    currentWeather, 
    forecast, 
    loading, 
    error,
    refetch 
  } = useWeather('London');
  
  if (loading) return <Spinner />;
  if (error) return <Error message={error} />;
  
  return <CurrentWeather weather={currentWeather} />;
}
```

### useLocations

Manage bookmarked locations.

```typescript
import { useLocations } from './hooks/useLocations';

function LocationManager() {
  const {
    locations,
    addLocation,
    removeLocation,
    setActiveLocation
  } = useLocations();
  
  return (
    <ul>
      {locations.map(loc => (
        <li key={loc.id} onClick={() => setActiveLocation(loc)}>
          {loc.name}
        </li>
      ))}
    </ul>
  );
}
```

## Data Types

### CurrentWeatherData

```typescript
interface CurrentWeatherData {
  location: Location;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  condition: WeatherCondition;
  uvIndex: number;
  visibility: number;
  lastUpdated: Date;
}
```

### DailyForecast

```typescript
interface DailyForecast {
  date: Date;
  highTemp: number;
  lowTemp: number;
  condition: WeatherCondition;
  precipitationChance: number;
  sunrise: string;
  sunset: string;
  hourly: HourlyForecast[];
}
```

### HourlyForecast

```typescript
interface HourlyForecast {
  time: Date;
  temperature: number;
  condition: WeatherCondition;
  precipitationChance: number;
  windSpeed: number;
}
```

## Error Handling

The API service includes built-in error handling:

```typescript
try {
  const weather = await getCurrentWeather('InvalidCity');
} catch (error) {
  if (error.code === 'LOCATION_NOT_FOUND') {
    // Handle location not found
  } else if (error.code === 'API_RATE_LIMIT') {
    // Handle rate limiting
  } else {
    // Handle generic error
  }
}
```

## Caching

The weather service implements automatic caching:

- Current weather: 10 minutes
- Forecast data: 30 minutes
- Location search: 1 hour

To force a refresh:

```typescript
const { refetch } = useWeather('London');
await refetch({ force: true });
```
