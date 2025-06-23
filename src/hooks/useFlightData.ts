import { useState, useEffect, useCallback } from 'react';
import { SensorData, AlertData, SystemHealth, PredictiveAnalysis } from '../types';

export const useFlightData = (isAlertMode: boolean) => {
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [currentData, setCurrentData] = useState<SensorData>({
    timestamp: Date.now(),
    engineTemp: 420,
    vibrationLevel: 3.2,
    oilPressure: 45,
    fuelFlow: 2800,
    hydraulicPressure: 3000,
    electricalLoad: 85
  });
  
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    overall: 94,
    engines: 96,
    hydraulics: 98,
    electrical: 92,
    avionics: 95
  });
  
  const [predictiveAnalysis, setPredictiveAnalysis] = useState<PredictiveAnalysis>({
    riskScore: 12,
    confidence: 94.7,
    maintenanceWindow: 2.3,
    anomalies: [],
    trends: {
      improving: ['Fuel efficiency', 'Electrical stability'],
      degrading: []
    }
  });

  const generateRealisticData = useCallback(() => {
    const now = Date.now();
    const baseTemp = isAlertMode ? 485 : 420;
    const baseVibration = isAlertMode ? 8.7 : 3.2;
    const baseOilPressure = isAlertMode ? 35 : 45;
    
    // Add realistic fluctuations
    const tempVariation = (Math.random() - 0.5) * 10;
    const vibrationVariation = (Math.random() - 0.5) * 0.5;
    const oilVariation = (Math.random() - 0.5) * 3;
    
    const newData: SensorData = {
      timestamp: now,
      engineTemp: Math.max(200, baseTemp + tempVariation),
      vibrationLevel: Math.max(0, baseVibration + vibrationVariation),
      oilPressure: Math.max(20, baseOilPressure + oilVariation),
      fuelFlow: 2800 + (Math.random() - 0.5) * 200,
      hydraulicPressure: 3000 + (Math.random() - 0.5) * 100,
      electricalLoad: 85 + (Math.random() - 0.5) * 10
    };
    
    setCurrentData(newData);
    setSensorData(prev => [...prev.slice(-29), newData]);
    
    // Update system health based on alert mode
    if (isAlertMode) {
      setSystemHealth({
        overall: 23,
        engines: 15,
        hydraulics: 45,
        electrical: 78,
        avionics: 89
      });
      
      setPredictiveAnalysis({
        riskScore: 87,
        confidence: 96.3,
        timeToFailure: 0.2, // 12 minutes
        maintenanceWindow: 0.1,
        anomalies: ['Engine bearing degradation', 'Abnormal vibration pattern', 'Temperature spike'],
        trends: {
          improving: [],
          degrading: ['Engine performance', 'Bearing condition', 'Thermal efficiency']
        }
      });
      
      // Generate critical alert
      const criticalAlert: AlertData = {
        id: `alert-${now}`,
        type: 'critical',
        title: 'ENGINE BEARING DEGRADATION DETECTED',
        message: 'AI model predicts imminent engine failure. Immediate action required.',
        timestamp: now,
        acknowledged: false,
        predictedFailureTime: now + (12 * 60 * 1000), // 12 minutes
        confidence: 96.3,
        recommendations: [
          'Divert to nearest suitable airport immediately',
          'Reduce engine power to minimum safe level',
          'Prepare for emergency landing procedures',
          'Alert ground maintenance crew'
        ]
      };
      
      setAlerts(prev => {
        const existing = prev.find(a => a.type === 'critical');
        if (!existing) {
          return [criticalAlert, ...prev];
        }
        return prev;
      });
    } else {
      setSystemHealth({
        overall: 94,
        engines: 96,
        hydraulics: 98,
        electrical: 92,
        avionics: 95
      });
      
      setPredictiveAnalysis({
        riskScore: 12,
        confidence: 94.7,
        maintenanceWindow: 2.3,
        anomalies: [],
        trends: {
          improving: ['Fuel efficiency', 'Electrical stability'],
          degrading: []
        }
      });
      
      setAlerts(prev => prev.filter(a => a.type !== 'critical'));
    }
  }, [isAlertMode]);

  useEffect(() => {
    // Initialize with some historical data
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
        electricalLoad: 85 + (Math.random() - 0.5) * 5
      });
    }
    setSensorData(initialData);
  }, []);

  useEffect(() => {
    generateRealisticData();
    const interval = setInterval(generateRealisticData, 2000);
    return () => clearInterval(interval);
  }, [generateRealisticData]);

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  };

  return {
    sensorData,
    currentData,
    alerts,
    systemHealth,
    predictiveAnalysis,
    acknowledgeAlert
  };
};