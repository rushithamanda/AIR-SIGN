// Mock AWS Bedrock service for hackathon demo
export interface BedrockAnalysis {
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  confidence: number;
  recommendation: string;
  timeToAction?: number; // seconds
  predictedFailure?: string;
  livesAtRisk: number;
  analysisTimestamp: string;
}

export interface FlightTelemetry {
  engineTemp: number;
  cabinPressure: number;
  vibrationLevel: number;
  oilPressure: number;
  fuelQuantity: number;
  altitude: number;
  airspeed: number;
}

export class MockBedrockService {
  private static instance: MockBedrockService;
  
  static getInstance(): MockBedrockService {
    if (!MockBedrockService.instance) {
      MockBedrockService.instance = new MockBedrockService();
    }
    return MockBedrockService.instance;
  }

  analyzeFlightSafety(telemetry: FlightTelemetry): BedrockAnalysis {
    const { engineTemp, cabinPressure, vibrationLevel, oilPressure, fuelQuantity } = telemetry;
    
    let riskScore = 0;
    let riskFactors: string[] = [];
    
    // Engine temperature analysis
    if (engineTemp > 500) {
      riskScore += 40;
      riskFactors.push('Engine temperature critical - immediate failure risk');
    } else if (engineTemp > 450) {
      riskScore += 25;
      riskFactors.push('Engine temperature elevated - bearing degradation likely');
    } else if (engineTemp > 400) {
      riskScore += 10;
      riskFactors.push('Engine temperature above normal - monitor closely');
    }
    
    // Cabin pressure analysis
    if (cabinPressure < 9) {
      riskScore += 50;
      riskFactors.push('Severe cabin pressure loss - oxygen masks required');
    } else if (cabinPressure < 10) {
      riskScore += 30;
      riskFactors.push('Cabin pressure declining - prepare emergency descent');
    } else if (cabinPressure < 10.5) {
      riskScore += 15;
      riskFactors.push('Cabin pressure below normal - monitor systems');
    }
    
    // Vibration analysis
    if (vibrationLevel > 8) {
      riskScore += 20;
      riskFactors.push('Severe vibration detected - structural concern');
    } else if (vibrationLevel > 6) {
      riskScore += 10;
      riskFactors.push('Elevated vibration - engine imbalance possible');
    }
    
    // Oil pressure analysis
    if (oilPressure < 30) {
      riskScore += 25;
      riskFactors.push('Low oil pressure - engine lubrication compromised');
    } else if (oilPressure < 40) {
      riskScore += 10;
      riskFactors.push('Oil pressure below optimal - monitor engine health');
    }
    
    // Fuel quantity analysis
    if (fuelQuantity < 20) {
      riskScore += 30;
      riskFactors.push('Critical fuel level - immediate diversion required');
    } else if (fuelQuantity < 40) {
      riskScore += 15;
      riskFactors.push('Low fuel - plan for nearest suitable airport');
    }
    
    // Determine risk level and recommendations
    let riskLevel: BedrockAnalysis['riskLevel'];
    let recommendation: string;
    let timeToAction: number | undefined;
    let predictedFailure: string | undefined;
    
    if (riskScore >= 70) {
      riskLevel = 'CRITICAL';
      recommendation = 'DECLARE EMERGENCY - Land immediately at nearest airport';
      timeToAction = 180; // 3 minutes
      predictedFailure = 'Multiple system failure imminent';
    } else if (riskScore >= 40) {
      riskLevel = 'HIGH';
      recommendation = 'Divert to nearest suitable airport - Prepare emergency procedures';
      timeToAction = 900; // 15 minutes
      predictedFailure = 'Engine failure likely within 30 minutes';
    } else if (riskScore >= 20) {
      riskLevel = 'MEDIUM';
      recommendation = 'Increase monitoring - Consider precautionary landing';
      timeToAction = 1800; // 30 minutes
    } else {
      riskLevel = 'LOW';
      recommendation = 'Continue normal operations with standard monitoring';
    }
    
    // Calculate confidence based on data quality and risk factors
    const confidence = Math.min(95, 75 + (riskFactors.length * 5) + Math.random() * 10);
    
    return {
      riskLevel,
      confidence: Math.round(confidence * 10) / 10,
      recommendation,
      timeToAction,
      predictedFailure,
      livesAtRisk: 186, // 180 passengers + 6 crew
      analysisTimestamp: new Date().toISOString()
    };
  }

  generatePredictiveInsights(historicalData: FlightTelemetry[]): {
    trendAnalysis: string[];
    maintenanceRecommendations: string[];
    riskProjection: string;
  } {
    const latest = historicalData[historicalData.length - 1];
    const trends: string[] = [];
    const maintenance: string[] = [];
    
    if (latest.engineTemp > 420) {
      trends.push('Engine temperature trending upward - thermal stress increasing');
      maintenance.push('Schedule engine inspection within 48 hours');
    }
    
    if (latest.vibrationLevel > 4) {
      trends.push('Vibration levels above baseline - potential imbalance developing');
      maintenance.push('Check engine mounts and fan blade condition');
    }
    
    if (latest.oilPressure < 45) {
      trends.push('Oil pressure declining - lubrication system degrading');
      maintenance.push('Verify oil quantity and filter condition');
    }
    
    const riskProjection = latest.engineTemp > 450 || latest.cabinPressure < 10 
      ? 'High probability of emergency within next flight segment'
      : 'Normal operational risk profile for next 24-48 hours';
    
    return {
      trendAnalysis: trends,
      maintenanceRecommendations: maintenance,
      riskProjection
    };
  }
}

// Simulate AWS IoT Core data streaming
export class MockIoTCore {
  private callbacks: ((data: FlightTelemetry) => void)[] = [];
  private interval: NodeJS.Timeout | null = null;
  
  subscribe(callback: (data: FlightTelemetry) => void) {
    this.callbacks.push(callback);
  }
  
  startStreaming(emergencyMode: boolean = false) {
    if (this.interval) return;
    
    this.interval = setInterval(() => {
      const telemetry = this.generateTelemetry(emergencyMode);
      this.callbacks.forEach(callback => callback(telemetry));
    }, 2000);
  }
  
  stopStreaming() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
  
  private generateTelemetry(emergencyMode: boolean): FlightTelemetry {
    if (emergencyMode) {
      return {
        engineTemp: 485 + (Math.random() - 0.5) * 30,
        cabinPressure: 8.5 + (Math.random() - 0.5) * 1.0,
        vibrationLevel: 8.5 + (Math.random() - 0.5) * 1.0,
        oilPressure: 28 + (Math.random() - 0.5) * 8,
        fuelQuantity: 25 + (Math.random() - 0.5) * 10,
        altitude: 34500 + (Math.random() - 0.5) * 1000,
        airspeed: 480 + (Math.random() - 0.5) * 40
      };
    } else {
      return {
        engineTemp: 420 + (Math.random() - 0.5) * 20,
        cabinPressure: 11.2 + (Math.random() - 0.5) * 0.4,
        vibrationLevel: 3.2 + (Math.random() - 0.5) * 0.8,
        oilPressure: 45 + (Math.random() - 0.5) * 6,
        fuelQuantity: 85 + (Math.random() - 0.5) * 10,
        altitude: 35000 + (Math.random() - 0.5) * 200,
        airspeed: 520 + (Math.random() - 0.5) * 20
      };
    }
  }
}

export const mockBedrock = MockBedrockService.getInstance();
export const mockIoT = new MockIoTCore();