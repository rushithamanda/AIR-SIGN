import { useState, useEffect, useCallback } from 'react';
import { 
  SensorData, CriticalAlert, SystemHealth, PredictiveAnalysis, 
  CrewAlert, PassengerSafety, LifeSavingSystem, EmergencyProcedure, 
  NearestAirport, WeatherThreat 
} from '../types';

export const useLifeSavingData = (isAlertMode: boolean) => {
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
    wingStress: 15,
    fuelQuantity: 85,
    engineRPM: 2400,
    airspeed: 520,
    altitude: 35000
  });
  
  const [criticalAlerts, setCriticalAlerts] = useState<CriticalAlert[]>([]);
  const [crewAlerts, setCrewAlerts] = useState<CrewAlert[]>([]);
  const [lifeSavingSystems, setLifeSavingSystems] = useState<LifeSavingSystem>({
    oxygenSystem: {
      passengerMasks: false,
      crewMasks: false,
      oxygenPressure: 1850,
      estimatedDuration: 22
    },
    fireSuppressionSystem: {
      engineFireBottles: 2,
      cargoFireSuppression: true,
      lavatoryFireDetection: true
    },
    emergencyEvacuation: {
      slidesArmed: false,
      emergencyLighting: false,
      exitPathIllumination: false,
      crewStations: false
    },
    communicationSystems: {
      maydayTransmitted: false,
      squawkCode: '7700',
      atcContact: true,
      emergencyFrequency: false
    }
  });
  
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
    landingGear: 100,
    pressurization: 98,
    fireDetection: 100
  });
  
  const [weatherThreats, setWeatherThreats] = useState<WeatherThreat[]>([]);

  const generateEmergencyProcedures = (alertType: string): EmergencyProcedure[] => {
    switch (alertType) {
      case 'engine_failure':
        return [
          { step: 1, action: 'Maintain aircraft control', timeLimit: 10, completed: false, critical: true },
          { step: 2, action: 'Engine fire/failure checklist', timeLimit: 30, completed: false, critical: true },
          { step: 3, action: 'Declare emergency with ATC', timeLimit: 60, completed: false, critical: true },
          { step: 4, action: 'Configure for single engine approach', timeLimit: 300, completed: false, critical: false },
          { step: 5, action: 'Brief cabin crew and passengers', timeLimit: 180, completed: false, critical: false }
        ];
      case 'cabin_pressure':
        return [
          { step: 1, action: 'Don oxygen masks immediately', timeLimit: 5, completed: false, critical: true },
          { step: 2, action: 'Establish crew communications', timeLimit: 10, completed: false, critical: true },
          { step: 3, action: 'Begin emergency descent', timeLimit: 15, completed: false, critical: true },
          { step: 4, action: 'Deploy passenger oxygen masks', timeLimit: 20, completed: false, critical: true },
          { step: 5, action: 'Declare emergency with ATC', timeLimit: 30, completed: false, critical: true }
        ];
      case 'fire':
        return [
          { step: 1, action: 'Identify fire location', timeLimit: 10, completed: false, critical: true },
          { step: 2, action: 'Execute fire checklist', timeLimit: 30, completed: false, critical: true },
          { step: 3, action: 'Discharge fire extinguisher', timeLimit: 45, completed: false, critical: true },
          { step: 4, action: 'Prepare for emergency landing', timeLimit: 120, completed: false, critical: true },
          { step: 5, action: 'Alert emergency services', timeLimit: 60, completed: false, critical: false }
        ];
      default:
        return [
          { step: 1, action: 'Assess situation', timeLimit: 30, completed: false, critical: true },
          { step: 2, action: 'Execute appropriate checklist', timeLimit: 60, completed: false, critical: true },
          { step: 3, action: 'Communicate with ATC', timeLimit: 90, completed: false, critical: false }
        ];
    }
  };

  const generateNearestAirports = (): NearestAirport[] => [
    {
      code: 'LAX',
      name: 'Los Angeles International',
      distance: 45,
      bearing: 270,
      runwayLength: 12091,
      emergencyServices: true,
      weatherConditions: 'Clear, 10SM visibility, winds 250/08',
      estimatedArrival: 12
    },
    {
      code: 'BUR',
      name: 'Hollywood Burbank',
      distance: 38,
      bearing: 285,
      runwayLength: 6886,
      emergencyServices: true,
      weatherConditions: 'Clear, 10SM visibility, winds 260/06',
      estimatedArrival: 10
    },
    {
      code: 'LGB',
      name: 'Long Beach Airport',
      distance: 52,
      bearing: 255,
      runwayLength: 10000,
      emergencyServices: false,
      weatherConditions: 'Hazy, 8SM visibility, winds 240/12',
      estimatedArrival: 14
    }
  ];

  const generateLifeSavingData = useCallback(() => {
    const now = Date.now();
    
    if (isAlertMode) {
      // Critical emergency scenario - Engine failure with cabin pressure loss
      const criticalTemp = 520 + (Math.random() - 0.5) * 30;
      const criticalVibration = 9.2 + (Math.random() - 0.5) * 1.0;
      const criticalOilPressure = 28 + (Math.random() - 0.5) * 5;
      const criticalCabinPressure = 8.2 + (Math.random() - 0.5) * 0.5;
      
      const newData: SensorData = {
        timestamp: now,
        engineTemp: criticalTemp,
        vibrationLevel: criticalVibration,
        oilPressure: criticalOilPressure,
        fuelFlow: 2200 + (Math.random() - 0.5) * 200,
        hydraulicPressure: 2400 + (Math.random() - 0.5) * 200,
        electricalLoad: 98 + (Math.random() - 0.5) * 5,
        gForce: 1.4 + (Math.random() - 0.5) * 0.3,
        cabinPressure: criticalCabinPressure,
        wingStress: 28 + (Math.random() - 0.5) * 5,
        fuelQuantity: 65 + (Math.random() - 0.5) * 5,
        engineRPM: 1800 + (Math.random() - 0.5) * 200,
        airspeed: 480 + (Math.random() - 0.5) * 20,
        altitude: 34500 + (Math.random() - 0.5) * 500
      };
      
      setCurrentData(newData);
      setSensorData(prev => [...prev.slice(-29), newData]);
      
      // Generate critical alerts
      const engineFailureAlert: CriticalAlert = {
        id: `engine-failure-${now}`,
        type: 'engine_failure',
        severity: 5,
        title: 'ENGINE #1 FAILURE - IMMEDIATE ACTION REQUIRED',
        message: 'Engine #1 has failed. Oil pressure critical, temperature exceeding limits. Immediate emergency procedures required.',
        timestamp: now,
        acknowledged: false,
        timeToAction: 180, // 3 minutes to complete critical actions
        confidence: 98.7,
        emergencyProcedures: generateEmergencyProcedures('engine_failure'),
        nearestAirports: generateNearestAirports(),
        evacuationRequired: false,
        oxygenMasksDeployed: false
      };

      const cabinPressureAlert: CriticalAlert = {
        id: `cabin-pressure-${now}`,
        type: 'cabin_pressure',
        severity: 5,
        title: 'CABIN PRESSURE LOSS - DEPLOY OXYGEN MASKS',
        message: 'Rapid cabin pressure loss detected. Passenger oxygen masks must be deployed immediately.',
        timestamp: now + 1000,
        acknowledged: false,
        timeToAction: 20, // 20 seconds to deploy masks
        confidence: 99.2,
        emergencyProcedures: generateEmergencyProcedures('cabin_pressure'),
        nearestAirports: generateNearestAirports(),
        evacuationRequired: false,
        oxygenMasksDeployed: false
      };
      
      setCriticalAlerts([engineFailureAlert, cabinPressureAlert]);
      
      // Update system health for emergency
      setSystemHealth({
        overall: 18,
        engines: 12,
        hydraulics: 35,
        electrical: 78,
        avionics: 89,
        flightControls: 65,
        navigation: 95,
        communication: 88,
        fuelSystem: 72,
        landingGear: 100,
        pressurization: 15,
        fireDetection: 100
      });
      
      // Critical crew alerts
      setCrewAlerts([
        {
          id: `crew-engine-${now}`,
          priority: 'immediate',
          message: 'ENGINE FAILURE - EXECUTE ENGINE FIRE/FAILURE CHECKLIST',
          voiceAlert: true,
          visualCue: 'RED MASTER WARNING - ENGINE FIRE/FAIL',
          timestamp: now,
          procedureRequired: true,
          timeLimit: 180
        },
        {
          id: `crew-pressure-${now}`,
          priority: 'immediate',
          message: 'CABIN PRESSURE LOSS - DON OXYGEN MASKS - DEPLOY PAX MASKS',
          voiceAlert: true,
          visualCue: 'AMBER CABIN ALTITUDE WARNING',
          timestamp: now + 1000,
          procedureRequired: true,
          timeLimit: 20
        }
      ]);
      
      // Update life-saving systems for emergency
      setLifeSavingSystems(prev => ({
        ...prev,
        oxygenSystem: {
          ...prev.oxygenSystem,
          oxygenPressure: 1650, // Pressure dropping
          estimatedDuration: 18 // Reduced duration
        },
        communicationSystems: {
          ...prev.communicationSystems,
          squawkCode: '7700', // Emergency squawk
          emergencyFrequency: true
        }
      }));
      
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
        wingStress: 15 + (Math.random() - 0.5) * 2,
        fuelQuantity: 85 + (Math.random() - 0.5) * 2,
        engineRPM: 2400 + (Math.random() - 0.5) * 50,
        airspeed: 520 + (Math.random() - 0.5) * 10,
        altitude: 35000 + (Math.random() - 0.5) * 100
      };
      
      setCurrentData(newData);
      setSensorData(prev => [...prev.slice(-29), newData]);
      
      // Reset to normal operations
      setCriticalAlerts([]);
      setCrewAlerts([]);
      
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
        landingGear: 100,
        pressurization: 98,
        fireDetection: 100
      });
      
      setLifeSavingSystems({
        oxygenSystem: {
          passengerMasks: false,
          crewMasks: false,
          oxygenPressure: 1850,
          estimatedDuration: 22
        },
        fireSuppressionSystem: {
          engineFireBottles: 2,
          cargoFireSuppression: true,
          lavatoryFireDetection: true
        },
        emergencyEvacuation: {
          slidesArmed: false,
          emergencyLighting: false,
          exitPathIllumination: false,
          crewStations: false
        },
        communicationSystems: {
          maydayTransmitted: false,
          squawkCode: '1200',
          atcContact: true,
          emergencyFrequency: false
        }
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
        wingStress: 15 + (Math.random() - 0.5) * 2,
        fuelQuantity: 85 + (Math.random() - 0.5) * 2,
        engineRPM: 2400 + (Math.random() - 0.5) * 50,
        airspeed: 520 + (Math.random() - 0.5) * 10,
        altitude: 35000 + (Math.random() - 0.5) * 100
      });
    }
    setSensorData(initialData);
  }, []);

  useEffect(() => {
    generateLifeSavingData();
    const interval = setInterval(generateLifeSavingData, 2000);
    return () => clearInterval(interval);
  }, [generateLifeSavingData]);

  const acknowledgeAlert = (alertId: string) => {
    setCriticalAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  };

  const acknowledgeCrewAlert = (alertId: string) => {
    setCrewAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const activateLifeSavingSystem = (system: string) => {
    switch (system) {
      case 'oxygen_masks':
        setLifeSavingSystems(prev => ({
          ...prev,
          oxygenSystem: {
            ...prev.oxygenSystem,
            passengerMasks: true,
            crewMasks: true
          }
        }));
        break;
      case 'evacuation_prep':
        setLifeSavingSystems(prev => ({
          ...prev,
          emergencyEvacuation: {
            slidesArmed: true,
            emergencyLighting: true,
            exitPathIllumination: true,
            crewStations: true
          }
        }));
        break;
      case 'mayday':
        setLifeSavingSystems(prev => ({
          ...prev,
          communicationSystems: {
            ...prev.communicationSystems,
            maydayTransmitted: true,
            emergencyFrequency: true
          }
        }));
        break;
    }
  };

  const completeProcedure = (alertId: string, step: number) => {
    setCriticalAlerts(prev => prev.map(alert => {
      if (alert.id === alertId) {
        return {
          ...alert,
          emergencyProcedures: alert.emergencyProcedures.map(proc =>
            proc.step === step ? { ...proc, completed: true } : proc
          )
        };
      }
      return alert;
    }));
  };

  return {
    sensorData,
    currentData,
    criticalAlerts,
    crewAlerts,
    systemHealth,
    lifeSavingSystems,
    weatherThreats,
    acknowledgeAlert,
    acknowledgeCrewAlert,
    activateLifeSavingSystem,
    completeProcedure
  };
};