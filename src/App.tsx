import React, { useState, useEffect } from 'react';
import { Sun, Cloud, CloudRain, MapPin, Plus, Thermometer, Droplets, Wind } from 'lucide-react';

// Types for weather data
interface WeatherData {
	location: string;
	temperature: number;
	condition: 'sunny' | 'cloudy' | 'rainy';
	humidity: number;
	windSpeed: number;
	feelsLike: number;
}

interface ForecastDay {
	day: string;
	high: number;
	low: number;
	condition: 'sunny' | 'cloudy' | 'rainy';
	precipitation: number;
}

interface SavedLocation {
	id: string;
	name: string;
	temperature: number;
	condition: 'sunny' | 'cloudy' | 'rainy';
}

// Weather icon component with animation
const WeatherIcon: React.FC<{ condition: string; size?: number }> = ({ condition, size = 48 }) => {
	const iconClass = "animate-pulse";
	
	switch (condition) {
		case 'sunny':
			return <Sun size={size} className={`text-yellow-400 ${iconClass}`} />;
		case 'rainy':
			return <CloudRain size={size} className={`text-blue-400 ${iconClass}`} />;
		default:
			return <Cloud size={size} className={`text-gray-400 ${iconClass}`} />;
	}
};

// Outfit recommendation based on weather
const getOutfitRecommendation = (temp: number, condition: string): string => {
	if (condition === 'rainy') return "🌂 Bring an umbrella and wear waterproof layers";
	if (temp < 10) return "🧥 Bundle up with a warm coat and layers";
	if (temp < 20) return "🧶 A light jacket or sweater would be perfect";
	return "👕 Light, breathable clothing recommended";
};

const App: React.FC = () => {
	const [currentWeather, setCurrentWeather] = useState<WeatherData>({
		location: 'San Francisco',
		temperature: 18,
		condition: 'sunny',
		humidity: 65,
		windSpeed: 12,
		feelsLike: 17
	});

	const [forecast, setForecast] = useState<ForecastDay[]>([
		{ day: 'Mon', high: 20, low: 14, condition: 'sunny', precipitation: 10 },
		{ day: 'Tue', high: 18, low: 12, condition: 'cloudy', precipitation: 30 },
		{ day: 'Wed', high: 16, low: 11, condition: 'rainy', precipitation: 80 },
		{ day: 'Thu', high: 19, low: 13, condition: 'cloudy', precipitation: 25 },
		{ day: 'Fri', high: 22, low: 15, condition: 'sunny', precipitation: 5 }
	]);

	const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([
		{ id: '1', name: 'New York', temperature: 15, condition: 'cloudy' },
		{ id: '2', name: 'London', temperature: 12, condition: 'rainy' },
		{ id: '3', name: 'Tokyo', temperature: 22, condition: 'sunny' }
	]);

	// Simulate real-time temperature updates
	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentWeather(prev => ({
				...prev,
				temperature: prev.temperature + (Math.random() - 0.5) * 0.5
			}));
		}, 5000);
		return () => clearInterval(interval);
	}, []);

	const addLocation = () => {
		const newLocation: SavedLocation = {
			id: Date.now().toString(),
			name: 'New Location',
			temperature: Math.round(Math.random() * 20 + 10),
			condition: ['sunny', 'cloudy', 'rainy'][Math.floor(Math.random() * 3)] as SavedLocation['condition']
		};
		setSavedLocations([...savedLocations, newLocation]);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white p-6">
			<div className="max-w-6xl mx-auto">
				{/* Header */}
				<header className="text-center mb-8">
					<h1 className="text-4xl font-bold mb-2">Weather Compass</h1>
					<p className="text-blue-200">Your personal weather guide</p>
				</header>

				{/* Current Weather Card */}
				<div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 mb-6">
					<div className="flex items-center gap-2 mb-4">
						<MapPin size={20} />
						<span className="text-xl">{currentWeather.location}</span>
					</div>
					
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-6">
							<WeatherIcon condition={currentWeather.condition} size={80} />
							<div>
								<div className="text-6xl font-light">
									{Math.round(currentWeather.temperature)}°C
								</div>
								<div className="text-blue-200 capitalize">{currentWeather.condition}</div>
							</div>
						</div>
						
						<div className="grid grid-cols-3 gap-6">
							<div className="flex items-center gap-2">
								<Thermometer size={20} className="text-orange-300" />
								<div>
									<div className="text-sm text-blue-200">Feels like</div>
									<div className="font-semibold">{currentWeather.feelsLike}°C</div>
								</div>
							</div>
							<div className="flex items-center gap-2">
								<Droplets size={20} className="text-blue-300" />
								<div>
									<div className="text-sm text-blue-200">Humidity</div>
									<div className="font-semibold">{currentWeather.humidity}%</div>
								</div>
							</div>
							<div className="flex items-center gap-2">
								<Wind size={20} className="text-green-300" />
								<div>
									<div className="text-sm text-blue-200">Wind</div>
									<div className="font-semibold">{currentWeather.windSpeed} km/h</div>
								</div>
							</div>
						</div>
					</div>

					{/* Outfit Recommendation */}
					<div className="mt-6 p-4 bg-white/5 rounded-xl">
						<p className="text-blue-100">
							{getOutfitRecommendation(currentWeather.temperature, currentWeather.condition)}
						</p>
					</div>
				</div>

				{/* 5-Day Forecast */}
				<div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 mb-6">
					<h2 className="text-xl font-semibold mb-4">5-Day Forecast</h2>
					<div className="grid grid-cols-5 gap-4">
						{forecast.map((day, index) => (
							<div key={index} className="text-center p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors">
								<div className="font-medium mb-2">{day.day}</div>
								<WeatherIcon condition={day.condition} size={32} />
								<div className="mt-2">
									<span className="font-semibold">{day.high}°</span>
									<span className="text-blue-300 ml-1">{day.low}°</span>
								</div>
								<div className="text-xs text-blue-200 mt-1 flex items-center justify-center gap-1">
									<Droplets size={12} />
									{day.precipitation}%
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Saved Locations */}
				<div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6">
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-xl font-semibold">Saved Locations</h2>
						<button
							onClick={addLocation}
							className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-full transition-colors"
						>
							<Plus size={18} />
							Add Location
						</button>
					</div>
					<div className="grid grid-cols-3 gap-4">
						{savedLocations.map((location) => (
							<div
								key={location.id}
								className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors cursor-pointer"
							>
								<div className="flex items-center gap-3">
									<WeatherIcon condition={location.condition} size={28} />
									<span className="font-medium">{location.name}</span>
								</div>
								<span className="text-xl font-light">{location.temperature}°C</span>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default App;