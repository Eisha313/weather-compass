import { useCallback } from 'react';
import { useWeatherContext } from '../context/WeatherContext';
import { weatherApi } from '../services/weatherApi';
import { Location, Coordinates } from '../types/weather';

export function useWeather() {
  const {
    state,
    setLoading,
    setCurrentWeather,
    setForecast,
    setSelectedLocation,
    setError,
  } = useWeatherContext();

  const fetchWeatherByCoords = useCallback(
    async (coords: Coordinates) => {
      setLoading(true);
      setError(null);

      try {
        const [weather, forecast] = await Promise.all([
          weatherApi.getCurrentWeather(coords),
          weatherApi.getForecast(coords),
        ]);

        setCurrentWeather(weather);
        setForecast(forecast);

        const location: Location = {
          id: `${coords.lat}-${coords.lon}`,
          name: weather.location.name,
          country: weather.location.country,
          coordinates: coords,
        };
        setSelectedLocation(location);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch weather data';
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setCurrentWeather, setForecast, setSelectedLocation, setError]
  );

  const fetchWeatherByCity = useCallback(
    async (cityName: string) => {
      setLoading(true);
      setError(null);

      try {
        const coords = await weatherApi.getCoordinatesByCity(cityName);
        await fetchWeatherByCoords(coords);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch weather data';
        setError(message);
        setLoading(false);
      }
    },
    [fetchWeatherByCoords, setLoading, setError]
  );

  const fetchWeatherForLocation = useCallback(
    async (location: Location) => {
      setSelectedLocation(location);
      await fetchWeatherByCoords(location.coordinates);
    },
    [fetchWeatherByCoords, setSelectedLocation]
  );

  const refreshWeather = useCallback(async () => {
    if (state.selectedLocation) {
      await fetchWeatherByCoords(state.selectedLocation.coordinates);
    }
  }, [state.selectedLocation, fetchWeatherByCoords]);

  return {
    currentWeather: state.currentWeather,
    forecast: state.forecast,
    selectedLocation: state.selectedLocation,
    isLoading: state.isLoading,
    error: state.error,
    fetchWeatherByCoords,
    fetchWeatherByCity,
    fetchWeatherForLocation,
    refreshWeather,
  };
}
