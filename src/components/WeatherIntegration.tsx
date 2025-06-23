import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cloud, Wind, Eye, Thermometer, Droplets, Zap, AlertTriangle, CheckCircle } from 'lucide-react';
import { realWeatherService, WeatherData, getAirportWeather, isWeatherSafeForLanding } from '../services/realWeather';

interface WeatherIntegrationProps {
  currentLocation?: { lat: number; lon: number };
  isEmergencyMode?: boolean;
}

const WeatherIntegration: React.FC<WeatherIntegrationProps> = ({ 
  currentLocation = { lat: 34.0522, lon: -118.2437 }, // Default to LAX area
  isEmergencyMode = false 
}) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [airportWeather, setAirportWeather] = useState<Record<string, WeatherData>>({});
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    const fetchWeatherData = async () => {
      setLoading(true);
      try {
        // Get current location weather
        const current = await realWeatherService.getCurrentWeather(
          currentLocation.lat, 
          currentLocation.lon
        );
        setWeatherData(current);

        // Get weather for nearby airports
        const airports = ['LAX', 'BUR', 'LGB'];
        const airportPromises = airports.map(async (code) => {
          try {
            const weather = await getAirportWeather(code);
            return { code, weather };
          } catch (error) {
            console.warn(`Failed to get weather for ${code}:`, error);
            return null;
          }
        });

        const airportResults = await Promise.all(airportPromises);
        const airportWeatherMap: Record<string, WeatherData> = {};
        
        airportResults.forEach(result => {
          if (result) {
            airportWeatherMap[result.code] = result.weather;
          }
        });
        
        setAirportWeather(airportWeatherMap);
        setLastUpdate(new Date());
      } catch (error) {
        console.error('Weather fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
    
    // Update weather every 5 minutes
    const interval = setInterval(fetchWeatherData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [currentLocation.lat, currentLocation.lon]);

  if (loading || !weatherData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-sky-900/30 to-blue-900/30 backdrop-blur-xl border border-sky-500/30 rounded-2xl p-6 shadow-2xl"
      >
        <div className="flex items-center space-x-3 mb-6">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Cloud className="h-6 w-6 text-sky-400" />
          </motion.div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-sky-400 to-blue-400 bg-clip-text text-transparent">
            Loading Real Weather Data...
          </h3>
        </div>
        <div className="text-center py-8">
          <div className="text-sky-200">Fetching live weather conditions</div>
          <div className="text-sky-300 text-sm mt-2">Connecting to OpenWeatherMap API</div>
        </div>
      </motion.div>
    );
  }

  const weatherMetrics = [
    { name: 'Turbulence', value: weatherData.turbulence, unit: '%', icon: Wind, color: 'text-orange-400' },
    { name: 'Wind Speed', value: weatherData.windSpeed, unit: ' kt', icon: Wind, color: 'text-blue-400' },
    { name: 'Visibility', value: weatherData.visibility, unit: ' mi', icon: Eye, color: 'text-green-400' },
    { name: 'Temperature', value: weatherData.temperature, unit: '°F', icon: Thermometer, color: 'text-red-400' },
    { name: 'Humidity', value: weatherData.humidity, unit: '%', icon: Droplets, color: 'text-cyan-400' },
    { name: 'Lightning Risk', value: weatherData.lightningRisk, unit: '%', icon: Zap, color: 'text-yellow-400' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-sky-900/30 to-blue-900/30 backdrop-blur-xl border border-sky-500/30 rounded-2xl p-6 shadow-2xl"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          >
            <Cloud className="h-6 w-6 text-sky-400" />
          </motion.div>
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-sky-400 to-blue-400 bg-clip-text text-transparent">
              Real-Time Weather Integration
            </h3>
            <p className="text-sky-200 text-sm">Live data from OpenWeatherMap API</p>
          </div>
        </div>
        
        <div className="text-right text-sm">
          <div className="text-sky-300">Last Update</div>
          <div className="text-white font-semibold">{lastUpdate.toLocaleTimeString()}</div>
        </div>
      </div>

      {/* Current Weather Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {weatherMetrics.map((metric, index) => (
          <motion.div
            key={metric.name}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-sky-800/20 border border-sky-500/30 rounded-xl p-4 text-center"
          >
            <metric.icon className={`h-6 w-6 mx-auto mb-2 ${metric.color}`} />
            <div className={`text-lg font-bold ${metric.color} mb-1`}>
              {metric.value.toFixed(1)}{metric.unit}
            </div>
            <div className="text-xs text-sky-200">{metric.name}</div>
          </motion.div>
        ))}
      </div>

      {/* Weather Alerts */}
      {weatherData.weatherAlerts.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-sky-300 mb-3 flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>Weather Alerts</span>
          </h4>
          <div className="space-y-2">
            {weatherData.weatherAlerts.map((alert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3 text-yellow-200"
              >
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm capitalize">{alert}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Airport Weather Conditions */}
      {Object.keys(airportWeather).length > 0 && (
        <div className="border-t border-sky-500/30 pt-6">
          <h4 className="text-lg font-semibold text-sky-300 mb-4">Nearby Airport Conditions</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(airportWeather).map(([code, weather]) => {
              const safetyCheck = isWeatherSafeForLanding(weather);
              
              return (
                <motion.div
                  key={code}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-sky-800/20 border rounded-lg p-4 ${
                    safetyCheck.safe 
                      ? 'border-green-500/30' 
                      : 'border-red-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="text-white font-bold text-lg">{code}</h5>
                    <div className="flex items-center space-x-1">
                      {safetyCheck.safe ? (
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-red-400" />
                      )}
                      <span className={`text-sm font-semibold ${
                        safetyCheck.safe ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {safetyCheck.safe ? 'SAFE' : 'CAUTION'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-sky-200">Wind:</span>
                      <span className="text-white">{weather.windSpeed.toFixed(0)} kt</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sky-200">Visibility:</span>
                      <span className="text-white">{weather.visibility.toFixed(1)} mi</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sky-200">Turbulence:</span>
                      <span className={`font-semibold ${
                        weather.turbulence > 30 ? 'text-red-400' : 'text-green-400'
                      }`}>
                        {weather.turbulence > 30 ? 'Moderate' : 'Light'}
                      </span>
                    </div>
                  </div>
                  
                  {!safetyCheck.safe && (
                    <div className="mt-3 pt-3 border-t border-red-500/30">
                      <div className="text-red-300 text-xs">
                        {safetyCheck.reasons.join(', ')}
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* API Status */}
      <div className="mt-6 pt-4 border-t border-sky-500/30">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2 text-sky-300">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <span>OpenWeatherMap API Connected</span>
          </div>
          <div className="text-sky-400">
            Next update: {new Date(lastUpdate.getTime() + 5 * 60 * 1000).toLocaleTimeString()}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WeatherIntegration;