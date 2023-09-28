import React from 'react';
import { DailyForecast } from '../types/weather';
import WeatherIcon from './WeatherIcon';
import Temperature from './Temperature';
import { formatDayOfWeek, formatDate } from '../utils/formatters';
import './ForecastCard.css';

interface ForecastCardProps {
  forecast: DailyForecast;
  isToday?: boolean;
  onClick?: () => void;
  isSelected?: boolean;
}

const ForecastCard: React.FC<ForecastCardProps> = ({
  forecast,
  isToday = false,
  onClick,
  isSelected = false,
}) => {
  const { date, condition, high, low, precipitation, humidity, wind } = forecast;

  return (
    <div
      className={`forecast-card ${isToday ? 'forecast-card--today' : ''} ${isSelected ? 'forecast-card--selected' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
    >
      <div className="forecast-card__header">
        <span className="forecast-card__day">
          {isToday ? 'Today' : formatDayOfWeek(date)}
        </span>
        <span className="forecast-card__date">{formatDate(date)}</span>
      </div>

      <div className="forecast-card__icon">
        <WeatherIcon condition={condition} size={48} animated={isSelected} />
      </div>

      <div className="forecast-card__temps">
        <Temperature value={high} className="forecast-card__high" />
        <span className="forecast-card__temp-divider">/</span>
        <Temperature value={low} className="forecast-card__low" />
      </div>

      <div className="forecast-card__details">
        <div className="forecast-card__detail">
          <span className="forecast-card__detail-icon">💧</span>
          <span className="forecast-card__detail-value">{precipitation}%</span>
        </div>
        <div className="forecast-card__detail">
          <span className="forecast-card__detail-icon">💨</span>
          <span className="forecast-card__detail-value">{wind} km/h</span>
        </div>
      </div>
    </div>
  );
};

export default ForecastCard;
