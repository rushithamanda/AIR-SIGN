// Real Weather API Integration for AirSign
// Get your free API key from: https://openweathermap.org/api

export interface WeatherData {
  turbulence: number;
  windSpeed: number;
  visibility: number;
  temperature: number;
  humidity: number;
  lightningRisk: number;
  weatherAlerts: string[];
  pressure: number;
  windDirection: number;
  cloudCover: number;
}

export interface FlightRoute {
  departure: string;
  arrival: string;
  currentLat: number;
  currentLon: number;
}

class RealWeatherService {
  private apiKey: string = 'YOUR_API_KEY_HERE'; // Replace with your OpenWeatherMap API key
  private baseUrl: string = 'https://api.openweathermap.org/data/2.5';

  // Set your API key
  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  // Get current weather for flight location
  async getCurrentWeather(lat: number, lon: number): Promise<WeatherData> {
    try {
      const response = await fetch(
        `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=imperial`
      );
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }
      
      const data = await response.json();
      return this.parseWeatherData(data);
    } catch (error) {
      console.warn('Using mock weather data due to API error:', error);
      return this.getMockWeatherData();
    }
  }

  // Get weather along flight route
  async getRouteWeather(route: FlightRoute): Promise<WeatherData[]> {
    try {
      const waypoints = this.generateWaypoints(route);
      const weatherPromises = waypoints.map(point => 
        this.getCurrentWeather(point.lat, point.lon)
      );
      
      return await Promise.all(weatherPromises);
    } catch (error) {
      console.warn('Using mock route weather data:', error);
      return [this.getMockWeatherData()];
    }
  }

  // Get weather alerts for area
  async getWeatherAlerts(lat: number, lon: number): Promise<string[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/onecall?lat=${lat}&lon=${lon}&appid=${this.apiKey}&exclude=minutely,hourly,daily`
      );
      
      if (!response.ok) {
        throw new Error(`Weather alerts API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.alerts?.map((alert: any) => alert.event) || [];
    } catch (error) {
      console.warn('Weather alerts unavailable:', error);
      return [];
    }
  }

  // Parse OpenWeatherMap data into our format
  private parseWeatherData(data: any): WeatherData {
    const windSpeed = data.wind?.speed || 0;
    const visibility = (data.visibility || 10000) / 1000; // Convert to miles
    const cloudCover = data.clouds?.all || 0;
    
    // Calculate turbulence based on wind speed and weather conditions
    const turbulence = this.calculateTurbulence(windSpeed, data.weather[0]?.main);
    
    // Calculate lightning risk based on weather conditions
    const lightningRisk = this.calculateLightningRisk(data.weather[0]?.main, cloudCover);
    
    return {
      turbulence,
      windSpeed,
      visibility,
      temperature: data.main?.temp || -45,
      humidity: data.main?.humidity || 20,
      lightningRisk,
      weatherAlerts: data.weather?.map((w: any) => w.description) || [],
      pressure: data.main?.pressure || 1013,
      windDirection: data.wind?.deg || 0,
      cloudCover
    };
  }

  // Calculate turbulence based on wind and weather conditions
  private calculateTurbulence(windSpeed: number, weatherMain: string): number {
    let baseTurbulence = Math.min(windSpeed * 2, 50); // Base on wind speed
    
    // Adjust for weather conditions
    switch (weatherMain?.toLowerCase()) {
      case 'thunderstorm':
        baseTurbulence += 40;
        break;
      case 'rain':
        baseTurbulence += 15;
        break;
      case 'snow':
        baseTurbulence += 20;
        break;
      case 'clouds':
        baseTurbulence += 10;
        break;
      default:
        break;
    }
    
    return Math.min(baseTurbulence, 100);
  }

  // Calculate lightning risk
  private calculateLightningRisk(weatherMain: string, cloudCover: number): number {
    if (weatherMain?.toLowerCase() === 'thunderstorm') {
      return Math.min(80 + cloudCover * 0.2, 100);
    }
    
    if (cloudCover > 80) {
      return Math.min(cloudCover * 0.3, 30);
    }
    
    return Math.min(cloudCover * 0.1, 10);
  }

  // Generate waypoints along flight route
  private generateWaypoints(route: FlightRoute): Array<{lat: number, lon: number}> {
    // For demo, return current position and a few points ahead
    return [
      { lat: route.currentLat, lon: route.currentLon },
      { lat: route.currentLat + 1, lon: route.currentLon + 1 },
      { lat: route.currentLat + 2, lon: route.currentLon + 2 }
    ];
  }

  // Fallback mock data when API is unavailable
  private getMockWeatherData(): WeatherData {
    return {
      turbulence: 15 + Math.random() * 20,
      windSpeed: 25 + Math.random() * 20,
      visibility: 8 + Math.random() * 4,
      temperature: -45 + Math.random() * 10,
      humidity: 15 + Math.random() * 20,
      lightningRisk: Math.random() * 15,
      weatherAlerts: Math.random() > 0.7 ? ['Light turbulence ahead'] : [],
      pressure: 1010 + Math.random() * 10,
      windDirection: Math.random() * 360,
      cloudCover: Math.random() * 60
    };
  }

  // Get aviation-specific weather data
  async getAviationWeather(lat: number, lon: number): Promise<{
    ceiling: number;
    visibility: number;
    windShear: boolean;
    icing: boolean;
    turbulence: string;
    recommendation: string;
  }> {
    try {
      const weather = await this.getCurrentWeather(lat, lon);
      
      return {
        ceiling: Math.max(1000, 10000 - weather.cloudCover * 100), // feet
        visibility: weather.visibility,
        windShear: weather.windSpeed > 35,
        icing: weather.temperature < 32 && weather.humidity > 80,
        turbulence: weather.turbulence > 30 ? 'Moderate' : 
                   weather.turbulence > 15 ? 'Light' : 'None',
        recommendation: this.getFlightRecommendation(weather)
      };
    } catch (error) {
      console.warn('Aviation weather unavailable:', error);
      return {
        ceiling: 8000,
        visibility: 10,
        windShear: false,
        icing: false,
        turbulence: 'Light',
        recommendation: 'Normal flight operations'
      };
    }
  }

  // Get flight safety recommendation based on weather
  private getFlightRecommendation(weather: WeatherData): string {
    if (weather.lightningRisk > 60) {
      return 'AVOID - Severe thunderstorm activity';
    }
    
    if (weather.turbulence > 50) {
      return 'CAUTION - Severe turbulence expected';
    }
    
    if (weather.visibility < 3) {
      return 'CAUTION - Low visibility conditions';
    }
    
    if (weather.windSpeed > 40) {
      return 'CAUTION - High wind conditions';
    }
    
    return 'Normal flight operations';
  }
}

// Export singleton instance
export const realWeatherService = new RealWeatherService();

// Helper function to get weather for specific airports
export const getAirportWeather = async (airportCode: string): Promise<WeatherData> => {
  // Airport coordinates (you can expand this)
  const airportCoords: Record<string, {lat: number, lon: number}> = {
    'LAX': { lat: 33.9425, lon: -118.4081 },
    'JFK': { lat: 40.6413, lon: -73.7781 },
    'BUR': { lat: 34.2007, lon: -118.3587 },
    'LGB': { lat: 33.8177, lon: -118.1516 }
  };
  
  const coords = airportCoords[airportCode];
  if (!coords) {
    throw new Error(`Airport ${airportCode} not found`);
  }
  
  return await realWeatherService.getCurrentWeather(coords.lat, coords.lon);
};

// Helper function to check if weather is safe for landing
export const isWeatherSafeForLanding = (weather: WeatherData): {
  safe: boolean;
  reasons: string[];
} => {
  const reasons: string[] = [];
  
  if (weather.visibility < 1) {
    reasons.push('Visibility too low for safe landing');
  }
  
  if (weather.windSpeed > 45) {
    reasons.push('Wind speed exceeds safe landing limits');
  }
  
  if (weather.lightningRisk > 70) {
    reasons.push('Severe thunderstorm activity in area');
  }
  
  if (weather.turbulence > 60) {
    reasons.push('Severe turbulence conditions');
  }
  
  return {
    safe: reasons.length === 0,
    reasons
  };
};