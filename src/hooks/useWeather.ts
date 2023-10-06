import { useState, useEffect, useCallback, useRef } from 'react';
import { WeatherData, ForecastData, HourlyForecast } from '../types/weather';
import { fetchCurrentWeather, fetchForecast, fetchHourlyForecast } from '../services/weatherApi';

interface UseWeatherOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
}

interface UseWeatherResult {
  currentWeather: WeatherData | null;
  forecast: ForecastData | null;
  hourlyForecast: HourlyForecast[] | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  lastUpdated: Date | null;
}

export const useWeather = (
  location: string | null | undefined,
  options: UseWeatherOptions = {}
): UseWeatherResult => {
  const { autoRefresh = true, refreshInterval = 300000 } = options;

  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecast[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const mountedRef = useRef<boolean>(true);

  const fetchWeatherData = useCallback(async () => {
    // Validate location before fetching
    if (!location || typeof location !== 'string' || location.trim() === '') {
      setCurrentWeather(null);
      setForecast(null);
      setHourlyForecast(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    const trimmedLocation = location.trim();

    // Cancel any ongoing requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    setError(null);

    try {
      const [weatherData, forecastData, hourlyData] = await Promise.all([
        fetchCurrentWeather(trimmedLocation),
        fetchForecast(trimmedLocation),
        fetchHourlyForecast(trimmedLocation),
      ]);

      // Only update state if component is still mounted
      if (mountedRef.current) {
        setCurrentWeather(weatherData);
        setForecast(forecastData);
        setHourlyForecast(hourlyData);
        setLastUpdated(new Date());
        setError(null);
      }
    } catch (err) {
      if (mountedRef.current) {
        // Don't set error for aborted requests
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        
        const errorMessage = err instanceof Error 
          ? err.message 
          : 'Failed to fetch weather data. Please try again.';
        
        setError(errorMessage);
        // Keep stale data if available
        if (!currentWeather) {
          setCurrentWeather(null);
          setForecast(null);
          setHourlyForecast(null);
        }
      }
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [location]);

  // Initial fetch and location change handling
  useEffect(() => {
    mountedRef.current = true;
    fetchWeatherData();

    return () => {
      mountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchWeatherData]);

  // Auto refresh interval
  useEffect(() => {
    if (!autoRefresh || !location) {
      return;
    }

    const intervalId = setInterval(() => {
      if (mountedRef.current) {
        fetchWeatherData();
      }
    }, refreshInterval);

    return () => clearInterval(intervalId);
  }, [autoRefresh, refreshInterval, location, fetchWeatherData]);

  return {
    currentWeather,
    forecast,
    hourlyForecast,
    isLoading,
    error,
    refresh: fetchWeatherData,
    lastUpdated,
  };
};

export default useWeather;
