import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import { WeatherData, ForecastData, Location } from '../types/weather';

interface WeatherState {
  currentWeather: WeatherData | null;
  forecast: ForecastData | null;
  savedLocations: Location[];
  selectedLocation: Location | null;
  isLoading: boolean;
  error: string | null;
}

type WeatherAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_CURRENT_WEATHER'; payload: WeatherData }
  | { type: 'SET_FORECAST'; payload: ForecastData }
  | { type: 'SET_SELECTED_LOCATION'; payload: Location }
  | { type: 'ADD_SAVED_LOCATION'; payload: Location }
  | { type: 'REMOVE_SAVED_LOCATION'; payload: string }
  | { type: 'SET_SAVED_LOCATIONS'; payload: Location[] }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_WEATHER_DATA' };

const initialState: WeatherState = {
  currentWeather: null,
  forecast: null,
  savedLocations: [],
  selectedLocation: null,
  isLoading: false,
  error: null,
};

function weatherReducer(state: WeatherState, action: WeatherAction): WeatherState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_CURRENT_WEATHER':
      return { ...state, currentWeather: action.payload, error: null };
    case 'SET_FORECAST':
      return { ...state, forecast: action.payload, error: null };
    case 'SET_SELECTED_LOCATION':
      return { ...state, selectedLocation: action.payload };
    case 'ADD_SAVED_LOCATION':
      if (state.savedLocations.some(loc => loc.id === action.payload.id)) {
        return state;
      }
      return { ...state, savedLocations: [...state.savedLocations, action.payload] };
    case 'REMOVE_SAVED_LOCATION':
      return {
        ...state,
        savedLocations: state.savedLocations.filter(loc => loc.id !== action.payload),
      };
    case 'SET_SAVED_LOCATIONS':
      return { ...state, savedLocations: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'CLEAR_WEATHER_DATA':
      return { ...state, currentWeather: null, forecast: null };
    default:
      return state;
  }
}

interface WeatherContextType {
  state: WeatherState;
  setLoading: (loading: boolean) => void;
  setCurrentWeather: (weather: WeatherData) => void;
  setForecast: (forecast: ForecastData) => void;
  setSelectedLocation: (location: Location) => void;
  addSavedLocation: (location: Location) => void;
  removeSavedLocation: (locationId: string) => void;
  setSavedLocations: (locations: Location[]) => void;
  setError: (error: string | null) => void;
  clearWeatherData: () => void;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export function WeatherProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(weatherReducer, initialState);

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, []);

  const setCurrentWeather = useCallback((weather: WeatherData) => {
    dispatch({ type: 'SET_CURRENT_WEATHER', payload: weather });
  }, []);

  const setForecast = useCallback((forecast: ForecastData) => {
    dispatch({ type: 'SET_FORECAST', payload: forecast });
  }, []);

  const setSelectedLocation = useCallback((location: Location) => {
    dispatch({ type: 'SET_SELECTED_LOCATION', payload: location });
  }, []);

  const addSavedLocation = useCallback((location: Location) => {
    dispatch({ type: 'ADD_SAVED_LOCATION', payload: location });
  }, []);

  const removeSavedLocation = useCallback((locationId: string) => {
    dispatch({ type: 'REMOVE_SAVED_LOCATION', payload: locationId });
  }, []);

  const setSavedLocations = useCallback((locations: Location[]) => {
    dispatch({ type: 'SET_SAVED_LOCATIONS', payload: locations });
  }, []);

  const setError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  const clearWeatherData = useCallback(() => {
    dispatch({ type: 'CLEAR_WEATHER_DATA' });
  }, []);

  const value: WeatherContextType = {
    state,
    setLoading,
    setCurrentWeather,
    setForecast,
    setSelectedLocation,
    addSavedLocation,
    removeSavedLocation,
    setSavedLocations,
    setError,
    clearWeatherData,
  };

  return (
    <WeatherContext.Provider value={value}>
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeatherContext(): WeatherContextType {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error('useWeatherContext must be used within a WeatherProvider');
  }
  return context;
}
