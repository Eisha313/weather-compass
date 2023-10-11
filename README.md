# Weather Compass 🧭

A sleek weather dashboard showing current conditions and forecasts with location-based insights.

![Weather Compass Screenshot](docs/screenshot.png)

## Features

✨ **Current Weather Display**
- Animated weather icons
- Real-time temperature updates
- Detailed conditions (humidity, wind, UV index)

📅 **5-Day Forecast**
- Daily high/low temperatures
- Precipitation probability
- Hourly breakdown for each day

📍 **Multi-Location Support**
- Bookmark favorite cities
- Quick location switching
- Compare weather across locations

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Weather API key (see [API Setup](#api-setup))

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/weather-compass.git
cd weather-compass

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API key

# Start development server
npm run dev
```

### API Setup

1. Sign up for a free API key at [WeatherAPI.com](https://weatherapi.com)
2. Copy your API key
3. Add it to your `.env` file:
   ```
   VITE_WEATHER_API_KEY=your_api_key_here
   ```

## Project Structure

```
weather-compass/
├── src/
│   ├── components/       # React components
│   ├── context/          # React Context providers
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API services
│   ├── styles/           # Global styles & animations
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   └── App.tsx           # Root component
├── docs/                 # Documentation
│   ├── COMPONENTS.md     # Component documentation
│   └── API.md            # API integration guide
├── public/               # Static assets
└── package.json
```

## Documentation

- [Component Guide](docs/COMPONENTS.md) - Detailed component documentation
- [API Guide](docs/API.md) - API integration and data types

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript compiler check |

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **CSS3** - Styling with custom animations

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting a PR.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) for details.

## Acknowledgments

- Weather data provided by [WeatherAPI.com](https://weatherapi.com)
- Icons inspired by [Weather Icons](https://erikflowers.github.io/weather-icons/)

---

Built with ☀️ and ❄️ by the Weather Compass team
