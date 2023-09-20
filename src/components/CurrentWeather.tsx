import React from 'react';
import { CurrentWeatherData } from '../types/weather';
import { Temperature } from './Temperature';
import { WeatherCondition } from './WeatherCondition';
import { formatWindSpeed, formatVisibility, formatPressure } from '../utils/formatters';
import '../styles/animations.css';

interface CurrentWeatherProps {
  data: CurrentWeatherData;
  loading?: boolean;
}

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-24 bg-gray-200 rounded mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    );
  }

  const { location, temperature, condition, humidity, windSpeed, visibility, pressure, feelsLike } = data;

  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold">{location.name}</h2>
          <p className="text-blue-100">{location.country}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-blue-100">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'short',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Temperature value={temperature} size="xl" />
          <WeatherCondition
            condition={condition}
            iconSize="lg"
            layout="vertical"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6 text-blue-100">
        <span>Feels like</span>
        <Temperature value={feelsLike} size="sm" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-blue-400">
        <WeatherStat label="Humidity" value={`${humidity}%`} icon="💧" />
        <WeatherStat label="Wind" value={formatWindSpeed(windSpeed)} icon="💨" />
        <WeatherStat label="Visibility" value={formatVisibility(visibility)} icon="👁" />
        <WeatherStat label="Pressure" value={formatPressure(pressure)} icon="🌡" />
      </div>
    </div>
  );
};

interface WeatherStatProps {
  label: string;
  value: string;
  icon: string;
}

const WeatherStat: React.FC<WeatherStatProps> = ({ label, value, icon }) => (
  <div className="text-center">
    <span className="text-lg">{icon}</span>
    <p className="text-sm text-blue-100">{label}</p>
    <p className="font-semibold">{value}</p>
  </div>
);

export default CurrentWeather;
