import { useState, useEffect, useCallback } from 'react';
import { SensorData, AlertData, SystemHealth, PredictiveAnalysis, CrewAlert, PassengerSafety } from '../types';

export const useAdvancedFlightData = (isAlertMode: boolean) => {
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [currentData, setCurrentData] = useState<SensorData>({
    timestamp: Date.now(),
    engineTemp: 420,
    vibrationLevel: 3.2,
    oilPressure: 45,
    fuelFlow: 2800,
    hydraulicPressure: 3000,
    electricalLoad: 85,
    gForce: 1.0,
    cabinPressure: 11.3,
    wingStress: 15
  });
  
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [crewAlerts, setCrewAlerts] = useState<CrewAlert[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    overall: 94,
    engines: 96,
    hydraulics: 98,
    electrical: 92,
    avionics: 95,
    flightControls: 97,
    navigation: 99,
    communication: 96,
    fuelSystem: 94,
    landingGear: 100
  });
  
  const [predictiveAnalysis, setPredictiveAnalysis] = useState<PredictiveAnalysis>({
    riskScore: 12,
    confidence: 94.7,
    maintenanceWindow: 2.3,
    anomalies: [],
    trends: {
      improving: ['Fuel efficiency', 'Electrical stability'],
      degrading: [],
      stable: ['Navigation systems', 'Communication arrays']
    },
    aiInsights: {
      patternRecognition: ['Normal flight envelope maintained', 'Optimal fuel consumption pattern'],
      historicalComparisons: ['Performance 3% above fleet average', 'Maintenance schedule on track'],
      weatherImpact: 'Minimal impact from current weather conditions',
      routeOptimization: ['Current route optimal', 'No diversions recommended']
    },
    quantumPredictions: {
      probabilityMatrix: Array(5).fill(null).map(() => Array(5).fill(null).map(() => Math.random() * 0.3)),
      scenarioAnalysis: [
        'Continued normal operation with 85% probability',
        'Minor maintenance required within 48 hours - 12% probability',
        'Weather-related route adjustment needed - 3% probability'
      ],
      riskMitigation: [
        'Maintain current flight parameters',
        'Monitor engine temperature trends',
        'Prepare for potential weather routing'
      ]
    }
  });

  const [passengerSafety, setPassengerSafety] = useState<PassengerSafety>({
    seatbeltSign: false,
    turbulenceLevel: 15,
    cabinPressure: 11.3,
    oxygenLevels: 21,
    emergencyEquipment: {
      lifevests: 180,
      oxygenMasks: 200,
      emergencySlides: 8
    }
  });

  const [weatherData, setWeatherData] = useState({
    turbulence: 15,
    windSpeed: 25,
    visibility: 10,
    temperature: -45,
    humidity: 20,
    lightningRisk: 5,
    weatherAlerts: []
  });

  const generateAdvancedData = useCallback(() => {
    const now = Date.now();
    
    if (isAlertMode) {
      // Critical emergency scenario
      const criticalTemp = 485 + (Math.random() - 0.5) * 20;
      const criticalVibration = 8.7 + (Math.random() - 0.5) * 1.0;
      const criticalOilPressure = 35 + (Math.random() - 0.5) * 5;
      
      const newData: SensorData = {
        timestamp: now,
        engineTemp: criticalTemp,
        vibrationLevel: criticalVibration,
        oilPressure: criticalOilPressure,
        fuelFlow: 2800 + (Math.random() - 0.5) * 400,
        hydraulicPressure: 2800 + (Math.random() - 0.5) * 200,
        electricalLoad: 95 + (Math.random() - 0.5) * 10,
        gForce: 1.2 + (Math.random() - 0.5) * 0.3,
        cabinPressure: 11.0 + (Math.random() - 0.5) * 0.5,
        wingStress: 25 + (Math.random() - 0.5) * 5
      };
      
      setCurrentData(newData);
      setSensorData(prev => [...prev.slice(-29), newData]);
      
      // Update system health for emergency
      setSystemHealth({
        overall: 23,
        engines: 15,
        hydraulics: 45,
        electrical: 78,
        avionics: 89,
        flightControls: 92,
        navigation: 95,
        communication: 88,
        fuelSystem: 85,
        landingGear: 100
      });
      
      // Advanced predictive analysis for emergency
      setPredictiveAnalysis({
        riskScore: 87,
        confidence: 96.3,
        timeToFailure: 0.2,
        maintenanceWindow: 0.1,
        anomalies: [
          'Engine bearing degradation detected',
          'Abnormal vibration harmonics',
          'Temperature spike beyond operational limits',
          'Oil pressure declining rapidly'
        ],
        trends: {
          improving: [],
          degrading: ['Engine performance', 'Bearing condition', 'Thermal efficiency', 'Oil circulation'],
          stable: []
        },
        aiInsights: {
          patternRecognition: [
            'Pattern matches historical bearing failure signatures',
            'Vibration frequency indicates metal fatigue',
            'Temperature rise rate exceeds normal parameters'
          ],
          historicalComparisons: [
            'Similar failure occurred in fleet aircraft 6 months ago',
            'Maintenance records show bearing replacement overdue',
            'Operating hours exceed recommended limits'
          ],
          weatherImpact: 'Current weather conditions may complicate emergency landing',
          routeOptimization: [
            'Nearest suitable airport: LAX - 45 minutes',
            'Alternative: Burbank - 38 minutes',
            'Emergency services alerted at both locations'
          ]
        },
        quantumPredictions: {
          probabilityMatrix: Array(5).fill(null).map(() => Array(5).fill(null).map(() => Math.random() * 0.9 + 0.1)),
          scenarioAnalysis: [
            'Complete engine failure within 12 minutes - 87% probability',
            'Partial power loss requiring immediate landing - 10% probability',
            'Successful emergency landing with current power - 3% probability'
          ],
          riskMitigation: [
            'Reduce engine power to minimum safe level immediately',
            'Declare emergency with ATC',
            'Prepare cabin for emergency landing',
            'Brief crew on evacuation procedures'
          ]
        }
      });
      
      // Critical crew alerts
      setCrewAlerts([
        {
          id: `crew-${now}`,
          priority: 'immediate',
          message: 'ENGINE FAILURE IMMINENT - PREPARE FOR EMERGENCY LANDING',
          voiceAlert: true,
          visualCue: 'RED FLASHING - ALL CREW TO STATIONS',
          timestamp: now
        },
        {
          id: `crew-${now + 1}`,
          priority: 'immediate',
          message: 'SECURE CABIN - EMERGENCY LANDING IN 12 MINUTES',
          voiceAlert: true,
          visualCue: 'AMBER - PASSENGER BRIEFING REQUIRED',
          timestamp: now + 1000
        }
      ]);
      
      // Update passenger safety for emergency
      setPassengerSafety({
        seatbeltSign: true,
        turbulenceLevel: 45,
        cabinPressure: 10.8,
        oxygenLevels: 19,
        emergencyEquipment: {
          lifevests: 180,
          oxygenMasks: 200,
          emergencySlides: 8
        }
      });
      
      // Update weather for emergency scenario
      setWeatherData({
        turbulence: 35,
        windSpeed: 45,
        visibility: 8,
        temperature: -48,
        humidity: 30,
        lightningRisk: 15,
        weatherAlerts: [
          'Moderate turbulence reported ahead',
          'Crosswinds at destination airport'
        ]
      });
      
    } else {
      // Normal flight operations
      const normalTemp = 420 + (Math.random() - 0.5) * 15;
      const normalVibration = 3.2 + (Math.random() - 0.5) * 0.5;
      const normalOilPressure = 45 + (Math.random() - 0.5) * 3;
      
      const newData: SensorData = {
        timestamp: now,
        engineTemp: normalTemp,
        vibrationLevel: normalVibration,
        oilPressure: normalOilPressure,
        fuelFlow: 2800 + (Math.random() - 0.5) * 100,
        hydraulicPressure: 3000 + (Math.random() - 0.5) * 50,
        electricalLoad: 85 + (Math.random() - 0.5) * 5,
        gForce: 1.0 + (Math.random() - 0.5) * 0.1,
        cabinPressure: 11.3 + (Math.random() - 0.5) * 0.2,
        wingStress: 15 + (Math.random() - 0.5) * 2
      };
      
      setCurrentData(newData);
      setSensorData(prev => [...prev.slice(-29), newData]);
      
      // Reset to normal operations
      setSystemHealth({
        overall: 94,
        engines: 96,
        hydraulics: 98,
        electrical: 92,
        avionics: 95,
        flightControls: 97,
        navigation: 99,
        communication: 96,
        fuelSystem: 94,
        landingGear: 100
      });
      
      setCrewAlerts([]);
      setAlerts(prev => prev.filter(a => a.type !== 'critical'));
      
      setPassengerSafety({
        seatbeltSign: false,
        turbulenceLevel: 15,
        cabinPressure: 11.3,
        oxygenLevels: 21,
        emergencyEquipment: {
          lifevests: 180,
          oxygenMasks: 200,
          emergencySlides: 8
        }
      });
      
      setWeatherData({
        turbulence: 15,
        windSpeed: 25,
        visibility: 10,
        temperature: -45,
        humidity: 20,
        lightningRisk: 5,
        weatherAlerts: []
      });
    }
  }, [isAlertMode]);

  useEffect(() => {
    // Initialize with historical data
    const initialData: SensorData[] = [];
    const now = Date.now();
    for (let i = 29; i >= 0; i--) {
      initialData.push({
        timestamp: now - (i * 2000),
        engineTemp: 420 + (Math.random() - 0.5) * 20,
        vibrationLevel: 3.2 + (Math.random() - 0.5) * 0.8,
        oilPressure: 45 + (Math.random() - 0.5) * 5,
        fuelFlow: 2800 + (Math.random() - 0.5) * 100,
        hydraulicPressure: 3000 + (Math.random() - 0.5) * 50,
        electricalLoad: 85 + (Math.random() - 0.5) * 5,
        gForce: 1.0 + (Math.random() - 0.5) * 0.1,
        cabinPressure: 11.3 + (Math.random() - 0.5) * 0.2,
        wingStress: 15 + (Math.random() - 0.5) * 2
      });
    }
    setSensorData(initialData);
  }, []);

  useEffect(() => {
    generateAdvancedData();
    const interval = setInterval(generateAdvancedData, 2000);
    return () => clearInterval(interval);
  }, [generateAdvancedData]);

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  };

  const acknowledgeCrewAlert = (alertId: string) => {
    setCrewAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  return {
    sensorData,
    currentData,
    alerts,
    crewAlerts,
    systemHealth,
    predictiveAnalysis,
    passengerSafety,
    weatherData,
    acknowledgeAlert,
    acknowledgeCrewAlert
  };
};