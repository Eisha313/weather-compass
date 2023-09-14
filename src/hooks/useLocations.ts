import { useCallback, useEffect } from 'react';
import { useWeatherContext } from '../context/WeatherContext';
import { Location } from '../types/weather';

const STORAGE_KEY = 'weather-compass-locations';

export function useLocations() {
  const {
    state,
    addSavedLocation,
    removeSavedLocation,
    setSavedLocations,
  } = useWeatherContext();

  // Load saved locations from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const locations: Location[] = JSON.parse(stored);
        setSavedLocations(locations);
      }
    } catch (err) {
      console.error('Failed to load saved locations:', err);
    }
  }, [setSavedLocations]);

  // Save to localStorage whenever savedLocations changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.savedLocations));
    } catch (err) {
      console.error('Failed to save locations:', err);
    }
  }, [state.savedLocations]);

  const saveLocation = useCallback(
    (location: Location) => {
      addSavedLocation(location);
    },
    [addSavedLocation]
  );

  const removeLocation = useCallback(
    (locationId: string) => {
      removeSavedLocation(locationId);
    },
    [removeSavedLocation]
  );

  const isLocationSaved = useCallback(
    (locationId: string): boolean => {
      return state.savedLocations.some((loc) => loc.id === locationId);
    },
    [state.savedLocations]
  );

  const toggleSaveLocation = useCallback(
    (location: Location) => {
      if (isLocationSaved(location.id)) {
        removeLocation(location.id);
      } else {
        saveLocation(location);
      }
    },
    [isLocationSaved, removeLocation, saveLocation]
  );

  return {
    savedLocations: state.savedLocations,
    saveLocation,
    removeLocation,
    isLocationSaved,
    toggleSaveLocation,
  };
}
