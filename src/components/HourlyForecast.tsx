import React from 'react';
import { HourlyForecast as HourlyForecastType } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';
import { Temperature } from './Temperature';
import { formatHour, formatPercent } from '../utils/formatters';
import './HourlyForecast.css';

interface HourlyForecastProps {
  hourlyData: HourlyForecastType[];
  maxHours?: number;
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({
  hourlyData,
  maxHours = 24
}) => {
  const displayedHours = hourlyData.slice(0, maxHours);

  const getPrecipitationColor = (probability: number): string => {
    if (probability >= 70) return 'precipitation-high';
    if (probability >= 40) return 'precipitation-medium';
    if (probability > 0) return 'precipitation-low';
    return 'precipitation-none';
  };

  return (
    <div className="hourly-forecast">
      <h3 className="hourly-forecast__title">Hourly Forecast</h3>
      <div className="hourly-forecast__scroll-container">
        <div className="hourly-forecast__list">
          {displayedHours.map((hour, index) => (
            <div key={`${hour.time}-${index}`} className="hourly-forecast__item">
              <span className="hourly-forecast__time">
                {index === 0 ? 'Now' : formatHour(hour.time)}
              </span>
              <div className="hourly-forecast__icon">
                <WeatherIcon condition={hour.condition} size="small" />
              </div>
              <Temperature value={hour.temperature} size="small" />
              <div className={`hourly-forecast__precipitation ${getPrecipitationColor(hour.precipitationProbability)}`}>
                <svg
                  className="hourly-forecast__precip-icon"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  width="12"
                  height="12"
                >
                  <path d="M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8zm0 18c-3.35 0-6-2.57-6-6.2 0-2.34 1.95-5.44 6-9.14 4.05 3.7 6 6.79 6 9.14 0 3.63-2.65 6.2-6 6.2z" />
                </svg>
                <span>{formatPercent(hour.precipitationProbability)}</span>
              </div>
              {hour.windSpeed !== undefined && (
                <div className="hourly-forecast__wind">
                  <span>{Math.round(hour.windSpeed)} mph</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HourlyForecast;
