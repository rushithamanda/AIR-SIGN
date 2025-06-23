export interface FlightData {
  flightId: string;
  airline: string;
  aircraft: string;
  route: string;
  altitude: number;
  speed: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  weather: {
    turbulence: number;
    windSpeed: number;
    visibility: number;
  };
}

export interface SensorData {
  timestamp: number;
  engineTemp: number;
  vibrationLevel: number;
  oilPressure: number;
  fuelFlow: number;
  hydraulicPressure: number;
  electricalLoad: number;
  gForce: number;
  cabinPressure: number;
  wingStress: number;
  fuelQuantity: number;
  engineRPM: number;
  airspeed: number;
  altitude: number;
}

export interface CriticalAlert {
  id: string;
  type: 'engine_failure' | 'cabin_pressure' | 'fire' | 'fuel_emergency' | 'structural' | 'weather_severe';
  severity: 1 | 2 | 3 | 4 | 5; // 5 = immediate life threat
  title: string;
  message: string;
  timestamp: number;
  acknowledged: boolean;
  timeToAction: number; // seconds until action must be taken
  confidence: number;
  emergencyProcedures: EmergencyProcedure[];
  nearestAirports: NearestAirport[];
  evacuationRequired: boolean;
  oxygenMasksDeployed: boolean;
}

export interface EmergencyProcedure {
  step: number;
  action: string;
  timeLimit: number; // seconds to complete
  completed: boolean;
  critical: boolean; // life-threatening if not completed
}

export interface NearestAirport {
  code: string;
  name: string;
  distance: number; // nautical miles
  bearing: number; // degrees
  runwayLength: number; // feet
  emergencyServices: boolean;
  weatherConditions: string;
  estimatedArrival: number; // minutes
}

export interface LifeSavingSystem {
  oxygenSystem: {
    passengerMasks: boolean;
    crewMasks: boolean;
    oxygenPressure: number;
    estimatedDuration: number; // minutes
  };
  fireSuppressionSystem: {
    engineFireBottles: number;
    cargoFireSuppression: boolean;
    lavatoryFireDetection: boolean;
  };
  emergencyEvacuation: {
    slidesArmed: boolean;
    emergencyLighting: boolean;
    exitPathIllumination: boolean;
    crewStations: boolean;
  };
  communicationSystems: {
    maydayTransmitted: boolean;
    squawkCode: string;
    atcContact: boolean;
    emergencyFrequency: boolean;
  };
}

export interface SystemHealth {
  overall: number;
  engines: number;
  hydraulics: number;
  electrical: number;
  avionics: number;
  flightControls: number;
  navigation: number;
  communication: number;
  fuelSystem: number;
  landingGear: number;
  pressurization: number;
  fireDetection: number;
}

export interface PredictiveAnalysis {
  riskScore: number;
  confidence: number;
  timeToFailure?: number;
  maintenanceWindow: number;
  anomalies: string[];
  trends: {
    improving: string[];
    degrading: string[];
    stable: string[];
  };
  aiInsights: {
    patternRecognition: string[];
    historicalComparisons: string[];
    weatherImpact: string;
    routeOptimization: string[];
  };
  quantumPredictions: {
    probabilityMatrix: number[][];
    scenarioAnalysis: string[];
    riskMitigation: string[];
  };
}

export interface CrewAlert {
  id: string;
  priority: 'immediate' | 'urgent' | 'advisory';
  message: string;
  voiceAlert: boolean;
  visualCue: string;
  timestamp: number;
  procedureRequired: boolean;
  timeLimit?: number;
}

export interface PassengerSafety {
  seatbeltSign: boolean;
  turbulenceLevel: number;
  cabinPressure: number;
  oxygenLevels: number;
  emergencyEquipment: {
    lifevests: number;
    oxygenMasks: number;
    emergencySlides: number;
  };
  evacuationStatus: {
    exitRowsCleared: boolean;
    crewPositioned: boolean;
    passengersInformed: boolean;
  };
}

export interface WeatherThreat {
  type: 'turbulence' | 'windshear' | 'icing' | 'thunderstorm' | 'fog';
  severity: 'light' | 'moderate' | 'severe' | 'extreme';
  location: string;
  timeToEncounter: number; // minutes
  avoidanceAction: string;
  alternateRoute: boolean;
}