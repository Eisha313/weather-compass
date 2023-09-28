import React, { useState } from 'react';
import { DailyForecast } from '../types/weather';
import ForecastCard from './ForecastCard';
import './FiveDayForecast.css';

interface FiveDayForecastProps {
  forecasts: DailyForecast[];
  onDaySelect?: (forecast: DailyForecast) => void;
}

const FiveDayForecast: React.FC<FiveDayForecastProps> = ({
  forecasts,
  onDaySelect,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const handleDayClick = (index: number, forecast: DailyForecast) => {
    setSelectedIndex(index);
    onDaySelect?.(forecast);
  };

  const isToday = (date: string): boolean => {
    const today = new Date();
    const forecastDate = new Date(date);
    return (
      today.getDate() === forecastDate.getDate() &&
      today.getMonth() === forecastDate.getMonth() &&
      today.getFullYear() === forecastDate.getFullYear()
    );
  };

  if (!forecasts || forecasts.length === 0) {
    return (
      <div className="five-day-forecast five-day-forecast--empty">
        <p>No forecast data available</p>
      </div>
    );
  }

  return (
    <section className="five-day-forecast">
      <div className="five-day-forecast__header">
        <h2 className="five-day-forecast__title">5-Day Forecast</h2>
        <p className="five-day-forecast__subtitle">
          Click a day for hourly details
        </p>
      </div>

      <div className="five-day-forecast__grid">
        {forecasts.slice(0, 5).map((forecast, index) => (
          <ForecastCard
            key={forecast.date}
            forecast={forecast}
            isToday={isToday(forecast.date)}
            isSelected={selectedIndex === index}
            onClick={() => handleDayClick(index, forecast)}
          />
        ))}
      </div>

      {forecasts[selectedIndex] && (
        <div className="five-day-forecast__summary">
          <h3 className="five-day-forecast__summary-title">
            {isToday(forecasts[selectedIndex].date)
              ? "Today's Summary"
              : `${new Date(forecasts[selectedIndex].date).toLocaleDateString('en-US', { weekday: 'long' })}'s Summary`}
          </h3>
          <p className="five-day-forecast__summary-text">
            Expect {forecasts[selectedIndex].condition.toLowerCase()} conditions
            with temperatures between{' '}
            <strong>{forecasts[selectedIndex].low}°</strong> and{' '}
            <strong>{forecasts[selectedIndex].high}°</strong>.
            {forecasts[selectedIndex].precipitation > 30 && (
              <span>
                {' '}There's a {forecasts[selectedIndex].precipitation}% chance
                of precipitation.
              </span>
            )}
          </p>
        </div>
      )}
    </section>
  );
};

export default FiveDayForecast;
