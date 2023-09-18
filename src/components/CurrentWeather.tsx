import React, { useEffect, useState } from 'react';
import { CurrentWeatherData } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';
import { useWeather } from '../hooks/useWeather';

interface CurrentWeatherProps {
  locationId?: string;
}

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({ locationId }) => {
  const { currentWeather, loading, error, refreshWeather } = useWeather(locationId);
  const [displayTemp, setDisplayTemp] = useState<number | null>(null);

  // Animate temperature changes
  useEffect(() => {
    if (currentWeather?.temperature !== undefined) {
      const targetTemp = currentWeather.temperature;
      if (displayTemp === null) {
        setDisplayTemp(targetTemp);
        return;
      }

      const diff = targetTemp - displayTemp;
      if (Math.abs(diff) < 0.1) {
        setDisplayTemp(targetTemp);
        return;
      }

      const step = diff > 0 ? 0.5 : -0.5;
      const timer = setTimeout(() => {
        setDisplayTemp((prev) => (prev !== null ? prev + step : targetTemp));
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [currentWeather?.temperature, displayTemp]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      refreshWeather();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [refreshWeather]);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white shadow-xl animate-pulse">
        <div className="flex items-center justify-between">
          <div className="space-y-4">
            <div className="h-8 w-32 bg-white/20 rounded" />
            <div className="h-16 w-24 bg-white/20 rounded" />
            <div className="h-4 w-48 bg-white/20 rounded" />
          </div>
          <div className="h-24 w-24 bg-white/20 rounded-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500 rounded-2xl p-8 text-red-500">
        <p className="font-semibold">Unable to load weather data</p>
        <p className="text-sm mt-2">{error}</p>
        <button
          onClick={refreshWeather}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!currentWeather) {
    return null;
  }

  const getBackgroundGradient = () => {
    switch (currentWeather.condition) {
      case 'sunny':
        return 'from-yellow-400 to-orange-500';
      case 'cloudy':
        return 'from-gray-400 to-gray-600';
      case 'rainy':
        return 'from-blue-600 to-gray-700';
      case 'snowy':
        return 'from-blue-200 to-gray-400';
      case 'stormy':
        return 'from-gray-700 to-gray-900';
      default:
        return 'from-blue-500 to-purple-600';
    }
  };

  return (
    <div
      className={`bg-gradient-to-br ${getBackgroundGradient()} rounded-2xl p-8 text-white shadow-xl transition-all duration-500`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-light opacity-90">{currentWeather.location}</h2>
          <div className="flex items-baseline mt-2">
            <span className="text-7xl font-bold tracking-tight">
              {displayTemp !== null ? Math.round(displayTemp) : '--'}
            </span>
            <span className="text-3xl font-light ml-1">°C</span>
          </div>
          <p className="mt-2 text-lg capitalize opacity-90">
            {currentWeather.description}
          </p>
          <div className="flex items-center gap-6 mt-4 text-sm opacity-80">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
              {currentWeather.humidity}% humidity
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              {currentWeather.windSpeed} km/h
            </span>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <WeatherIcon condition={currentWeather.condition} size="lg" animated />
          <span className="mt-2 text-sm opacity-70">
            Feels like {currentWeather.feelsLike}°C
          </span>
        </div>
      </div>
      <div className="mt-6 pt-4 border-t border-white/20 flex justify-between text-sm">
        <span>Last updated: {new Date(currentWeather.timestamp).toLocaleTimeString()}</span>
        <button
          onClick={refreshWeather}
          className="flex items-center gap-1 hover:opacity-100 opacity-70 transition-opacity"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>
    </div>
  );
};