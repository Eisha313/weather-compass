# Weather Compass Components

This document provides an overview of all React components in the Weather Compass application.

## Table of Contents

- [Core Components](#core-components)
- [Weather Display Components](#weather-display-components)
- [Forecast Components](#forecast-components)
- [Utility Components](#utility-components)

---

## Core Components

### App.tsx

The root component that sets up the application structure and providers.

```tsx
import { WeatherProvider } from './context/WeatherContext';
import App from './App';
```

---

## Weather Display Components

### CurrentWeather

Displays the current weather conditions for the selected location.

**Props:**
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `weather` | `CurrentWeatherData` | Yes | Current weather data object |
| `loading` | `boolean` | No | Shows loading state |

**Usage:**
```tsx
<CurrentWeather weather={currentWeather} loading={isLoading} />
```

### WeatherIcon

Animated weather icon component that displays appropriate icons based on conditions.

**Props:**
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `condition` | `WeatherCondition` | Yes | Weather condition code |
| `size` | `'small' \| 'medium' \| 'large'` | No | Icon size (default: 'medium') |
| `animated` | `boolean` | No | Enable animations (default: true) |

**Usage:**
```tsx
<WeatherIcon condition="sunny" size="large" animated />
```

### Temperature

Displays temperature with unit conversion support.

**Props:**
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `value` | `number` | Yes | Temperature value |
| `unit` | `'celsius' \| 'fahrenheit'` | No | Display unit (default: 'celsius') |
| `showUnit` | `boolean` | No | Show unit symbol (default: true) |

**Usage:**
```tsx
<Temperature value={22} unit="celsius" />
```

### WeatherCondition

Displays weather condition text with optional icon.

**Props:**
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `condition` | `string` | Yes | Condition description |
| `showIcon` | `boolean` | No | Display icon (default: false) |

---

## Forecast Components

### FiveDayForecast

Displays a 5-day weather forecast overview.

**Props:**
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `forecast` | `DailyForecast[]` | Yes | Array of daily forecasts |
| `onDaySelect` | `(day: DailyForecast) => void` | No | Callback when a day is selected |

**Usage:**
```tsx
<FiveDayForecast 
  forecast={dailyForecasts} 
  onDaySelect={handleDaySelect} 
/>
```

### HourlyForecast

Displays hourly weather breakdown with scrollable interface.

**Props:**
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `hours` | `HourlyForecast[]` | Yes | Array of hourly forecasts |
| `maxHours` | `number` | No | Maximum hours to display (default: 24) |

**Usage:**
```tsx
<HourlyForecast hours={hourlyData} maxHours={12} />
```

### ForecastCard

Individual forecast card for daily or hourly display.

**Props:**
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `date` | `Date` | Yes | Forecast date/time |
| `high` | `number` | Yes | High temperature |
| `low` | `number` | No | Low temperature (for daily) |
| `condition` | `WeatherCondition` | Yes | Weather condition |
| `precipitation` | `number` | No | Precipitation probability (0-100) |

---

## Utility Components

These components provide shared functionality across the application.

### Component Architecture

```
App
├── WeatherProvider (Context)
│   ├── CurrentWeather
│   │   ├── WeatherIcon
│   │   ├── Temperature
│   │   └── WeatherCondition
│   ├── FiveDayForecast
│   │   └── ForecastCard[]
│   └── HourlyForecast
│       └── ForecastCard[]
```

---

## Styling

Components use a combination of CSS modules and shared animation styles:

- `src/styles/animations.css` - Shared animations
- `src/components/*.css` - Component-specific styles

## Best Practices

1. **Always provide loading states** - Use the `loading` prop when data is being fetched
2. **Handle errors gracefully** - Check for undefined data before rendering
3. **Use TypeScript types** - Import types from `src/types/weather.ts`
4. **Leverage the WeatherContext** - Use `useWeather` hook for data access
