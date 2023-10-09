import React, { useMemo } from 'react';
import { DailyForecast } from '../types/weather';
import ForecastCard from './ForecastCard';
import { getForecastSummary, getDominantCondition } from '../utils/forecastUtils';
import './FiveDayForecast.css';

interface FiveDayForecastProps {
  forecasts: DailyForecast[];
  onDaySelect?: (date: Date) => void;
  selectedDate?: Date;
  temperatureUnit?: 'celsius' | 'fahrenheit';
}

const FiveDayForecast: React.FC<FiveDayForecastProps> = ({
  forecasts,
  onDaySelect,
  selectedDate,
  temperatureUnit = 'celsius',
}) => {
  const processedForecasts = useMemo(() => {
    return forecasts.slice(0, 5).map(forecast => ({
      ...forecast,
      summary: getForecastSummary(forecast),
      isSelected: selectedDate?.toDateString() === forecast.date.toDateString(),
    }));
  }, [forecasts, selectedDate]);

  const overallCondition = useMemo(() => {
    const conditions = forecasts.map(f => f.condition);
    return getDominantCondition(conditions);
  }, [forecasts]);

  const handleKeyDown = (e: React.KeyboardEvent, date: Date) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onDaySelect?.(date);
    }
  };

  if (forecasts.length === 0) {
    return (
      <div className="five-day-forecast five-day-forecast--empty">
        <p>No forecast data available</p>
      </div>
    );
  }

  return (
    <section 
      className="five-day-forecast" 
      aria-label="5-day weather forecast"
      data-overall-condition={overallCondition}
    >
      <header className="five-day-forecast__header">
        <h2 className="five-day-forecast__title">5-Day Forecast</h2>
        <p className="five-day-forecast__subtitle">
          Overall outlook: {overallCondition.replace('-', ' ')}
        </p>
      </header>
      
      <div className="five-day-forecast__grid" role="list">
        {processedForecasts.map((forecast, index) => (
          <div
            key={forecast.date.toISOString()}
            role="listitem"
            tabIndex={onDaySelect ? 0 : undefined}
            onClick={() => onDaySelect?.(forecast.date)}
            onKeyDown={(e) => handleKeyDown(e, forecast.date)}
            className={`five-day-forecast__item ${
              forecast.isSelected ? 'five-day-forecast__item--selected' : ''
            }`}
            aria-label={forecast.summary}
          >
            <ForecastCard
              date={forecast.date}
              condition={forecast.condition}
              high={forecast.high}
              low={forecast.low}
              precipitationProbability={forecast.precipitationProbability}
              temperatureUnit={temperatureUnit}
              isToday={index === 0}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default FiveDayForecast;
