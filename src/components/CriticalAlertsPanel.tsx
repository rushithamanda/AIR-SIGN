import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, Clock, Zap, Thermometer, 
  Droplets, Wind, Plane, Users, Shield
} from 'lucide-react';
import { CriticalAlert } from '../types';

interface CriticalAlertsPanelProps {
  alerts: CriticalAlert[];
  onAlertAcknowledge: (alertId: string) => void;
  onEmergencyAction: (action: string) => void;
}

const CriticalAlertsPanel: React.FC<CriticalAlertsPanelProps> = ({
  alerts,
  onAlertAcknowledge,
  onEmergencyAction
}) => {
  const [timeRemaining, setTimeRemaining] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const timers: { [key: string]: NodeJS.Timeout } = {};
    
    alerts.forEach(alert => {
      if (alert.timeToAction > 0) {
        setTimeRemaining(prev => ({ ...prev, [alert.id]: alert.timeToAction }));
        
        timers[alert.id] = setInterval(() => {
          setTimeRemaining(prev => ({
            ...prev,
            [alert.id]: Math.max(0, (prev[alert.id] || 0) - 1)
          }));
        }, 1000);
      }
    });

    return () => {
      Object.values(timers).forEach(timer => clearInterval(timer));
    };
  }, [alerts]);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'engine_failure': return Zap;
      case 'cabin_pressure': return Wind;
      case 'fire': return Thermometer;
      case 'fuel_emergency': return Droplets;
      case 'structural': return Plane;
      case 'weather_severe': return AlertTriangle;
      default: return AlertTriangle;
    }
  };

  const getAlertColor = (severity: number) => {
    switch (severity) {
      case 5: return 'from-red-600 to-red-800 border-red-500';
      case 4: return 'from-orange-600 to-orange-800 border-orange-500';
      case 3: return 'from-yellow-600 to-yellow-800 border-yellow-500';
      default: return 'from-blue-600 to-blue-800 border-blue-500';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const criticalAlerts = alerts.filter(alert => alert.severity >= 4);

  if (criticalAlerts.length === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-red-900/20 border-b-2 border-red-500 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <AnimatePresence>
          {criticalAlerts.map((alert, index) => {
            const AlertIcon = getAlertIcon(alert.type);
            const timeLeft = timeRemaining[alert.id] || 0;
            
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: -50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -50, scale: 0.95 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-gradient-to-r ${getAlertColor(alert.severity)} rounded-xl p-6 mb-4 border-2 shadow-2xl`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <motion.div
                      animate={{ 
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        duration: 0.5, 
                        repeat: Infinity 
                      }}
                    >
                      <AlertIcon className="h-8 w-8 text-white mt-1" />
                    </motion.div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-3">
                        <h2 className="text-2xl font-bold text-white">{alert.title}</h2>
                        <div className="flex items-center space-x-2 bg-black/30 rounded-full px-3 py-1">
                          <Shield className="h-4 w-4 text-white" />
                          <span className="text-white font-semibold">{alert.confidence}% confidence</span>
                        </div>
                      </div>
                      
                      <p className="text-white/90 text-lg mb-4">{alert.message}</p>
                      
                      {timeLeft > 0 && (
                        <div className="flex items-center space-x-3 mb-4">
                          <Clock className="h-5 w-5 text-white" />
                          <span className={`text-xl font-bold ${
                            timeLeft <= 60 ? 'text-red-200 animate-pulse' : 'text-white'
                          }`}>
                            TIME TO ACTION: {formatTime(timeLeft)}
                          </span>
                        </div>
                      )}
                      
                      {/* Emergency Actions */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                        {alert.evacuationRequired && (
                          <button
                            onClick={() => onEmergencyAction('evacuation')}
                            className="bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded-lg transition-colors animate-pulse"
                          >
                            PREPARE EVACUATION
                          </button>
                        )}
                        
                        {alert.oxygenMasksDeployed === false && alert.type === 'cabin_pressure' && (
                          <button
                            onClick={() => onEmergencyAction('oxygen_masks')}
                            className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                          >
                            DEPLOY OXYGEN MASKS
                          </button>
                        )}
                        
                        <button
                          onClick={() => onEmergencyAction('mayday')}
                          className="bg-orange-700 hover:bg-orange-800 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                        >
                          DECLARE EMERGENCY
                        </button>
                      </div>
                      
                      {/* Emergency Procedures Preview */}
                      <div className="bg-black/20 rounded-lg p-3 mb-4">
                        <h4 className="text-white font-semibold mb-2">IMMEDIATE PROCEDURES:</h4>
                        <div className="space-y-1">
                          {alert.emergencyProcedures.slice(0, 3).map((procedure, idx) => (
                            <div key={idx} className="text-white/80 text-sm flex items-center space-x-2">
                              <span className="bg-white/20 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                                {procedure.step}
                              </span>
                              <span>{procedure.action}</span>
                            </div>
                          ))}
                          {alert.emergencyProcedures.length > 3 && (
                            <div className="text-white/60 text-sm">
                              +{alert.emergencyProcedures.length - 3} more procedures...
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2 ml-4">
                    <button
                      onClick={() => onAlertAcknowledge(alert.id)}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                    >
                      ACKNOWLEDGE
                    </button>
                    
                    <div className="text-center">
                      <div className="text-white/80 text-xs">Severity</div>
                      <div className="text-white font-bold text-lg">{alert.severity}/5</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CriticalAlertsPanel;