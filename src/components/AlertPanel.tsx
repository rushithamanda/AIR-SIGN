import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Clock, CheckCircle, X, Zap } from 'lucide-react';
import { AlertData } from '../types';

interface AlertPanelProps {
  alerts: AlertData[];
  onAcknowledge: (alertId: string) => void;
}

const AlertPanel: React.FC<AlertPanelProps> = ({ alerts, onAcknowledge }) => {
  const criticalAlerts = alerts.filter(alert => alert.type === 'critical' && !alert.acknowledged);
  const warningAlerts = alerts.filter(alert => alert.type === 'warning' && !alert.acknowledged);

  const formatTimeRemaining = (timestamp: number) => {
    const minutes = Math.floor(timestamp / (1000 * 60));
    const seconds = Math.floor((timestamp % (1000 * 60)) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  return (
    <AnimatePresence>
      {criticalAlerts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-0 left-0 right-0 z-50 bg-red-600/20 border-b border-red-500/50 backdrop-blur-sm"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            {criticalAlerts.map((alert) => (
              <motion.div
                key={alert.id}
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="bg-red-900/30 border border-red-500/50 rounded-lg p-4 mb-4 last:mb-0"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 0.5 }}
                    >
                      <AlertTriangle className="h-6 w-6 text-red-400 mt-1" />
                    </motion.div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-red-300 font-bold text-lg">{alert.title}</h3>
                        <div className="flex items-center space-x-2 text-red-200 text-sm">
                          <Zap className="h-4 w-4" />
                          <span>{alert.confidence}% confidence</span>
                        </div>
                      </div>
                      
                      <p className="text-red-200 mb-3">{alert.message}</p>
                      
                      {alert.predictedFailureTime && (
                        <div className="flex items-center space-x-2 mb-3 text-red-300">
                          <Clock className="h-4 w-4" />
                          <span className="font-semibold">
                            Time to failure: {formatTimeRemaining(alert.predictedFailureTime - Date.now())}
                          </span>
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        <h4 className="text-red-300 font-semibold text-sm">IMMEDIATE ACTIONS:</h4>
                        <ul className="space-y-1">
                          {alert.recommendations.map((rec, index) => (
                            <li key={index} className="text-red-200 text-sm flex items-start space-x-2">
                              <span className="text-red-400 font-bold">•</span>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => onAcknowledge(alert.id)}
                    className="ml-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Acknowledge</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AlertPanel;