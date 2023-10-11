import React from 'react';
import { HourlyForecast as HourlyForecastType } from '../types/weather';
import { formatTemperature, formatPercentage, formatTime } from '../utils/formatters';
import WeatherIcon from './WeatherIcon';
import './HourlyForecast.css';

interface HourlyForecastProps {
  forecasts: HourlyForecastType[];
  timezoneOffset?: number;
  temperatureUnit?: 'celsius' | 'fahrenheit';
  maxItems?: number;
}

const HourlyForecast: React.FC<HourlyForecastProps> = ({
  forecasts,
  timezoneOffset = 0,
  temperatureUnit = 'celsius',
  maxItems = 24
}) => {
  // Filter to show only future hours and limit items
  const now = Math.floor(Date.now() / 1000);
  const futureForecasts = forecasts
    .filter(f => f.dt > now)
    .slice(0, maxItems);

  if (futureForecasts.length === 0) {
    return (
      <div className="hourly-forecast hourly-forecast--empty">
        <p>No hourly forecast data available</p>
      </div>
    );
  }

  return (
    <div className="hourly-forecast">
      <h3 className="hourly-forecast__title">Hourly Forecast</h3>
      <div className="hourly-forecast__scroll-container">
        <div className="hourly-forecast__list">
          {futureForecasts.map((hour, index) => (
            <div
              key={hour.dt}
              className="hourly-forecast__item"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <span className="hourly-forecast__time">
                {index === 0 ? 'Now' : formatTime(hour.dt, timezoneOffset)}
              </span>
              
              <div className="hourly-forecast__icon">
                <WeatherIcon
                  condition={hour.condition}
                  size="small"
                  animated={index === 0}
                />
              </div>
              
              <span className="hourly-forecast__temp">
                {formatTemperature(hour.temperature, temperatureUnit, false)}°
              </span>
              
              {hour.precipitationProbability > 0 && (
                <div className="hourly-forecast__precip">
                  <svg
                    className="hourly-forecast__precip-icon"
                    viewBox="0 0 24 24"
                    width="12"
                    height="12"
                  >
                    <path
                      fill="currentColor"
                      d="M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8zm0 18c-3.35 0-6-2.57-6-6.2 0-2.34 1.95-5.44 6-9.14 4.05 3.7 6 6.79 6 9.14 0 3.63-2.65 6.2-6 6.2z"
                    />
                  </svg>
                  <span>{formatPercentage(hour.precipitationProbability)}</span>
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
