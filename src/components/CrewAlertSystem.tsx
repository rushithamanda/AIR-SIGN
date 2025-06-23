import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Volume2, VolumeX, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { CrewAlert } from '../types';

interface CrewAlertSystemProps {
  alerts: CrewAlert[];
  onAcknowledge: (alertId: string) => void;
}

const CrewAlertSystem: React.FC<CrewAlertSystemProps> = ({ alerts, onAcknowledge }) => {
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [currentAlert, setCurrentAlert] = useState<CrewAlert | null>(null);

  useEffect(() => {
    const immediateAlert = alerts.find(alert => alert.priority === 'immediate' && alert.voiceAlert);
    if (immediateAlert && audioEnabled) {
      setCurrentAlert(immediateAlert);
      // In a real implementation, this would trigger text-to-speech
      console.log(`VOICE ALERT: ${immediateAlert.message}`);
    }
  }, [alerts, audioEnabled]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'immediate': return 'from-red-600 to-red-800';
      case 'urgent': return 'from-orange-600 to-orange-800';
      case 'advisory': return 'from-blue-600 to-blue-800';
      default: return 'from-gray-600 to-gray-800';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'immediate': return <AlertCircle className="h-5 w-5" />;
      case 'urgent': return <Clock className="h-5 w-5" />;
      case 'advisory': return <CheckCircle className="h-5 w-5" />;
      default: return <AlertCircle className="h-5 w-5" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 shadow-2xl"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Users className="h-6 w-6 text-blue-400" />
          <h3 className="text-xl font-bold text-white">Crew Alert System</h3>
        </div>
        
        <button
          onClick={() => setAudioEnabled(!audioEnabled)}
          className={`p-2 rounded-lg transition-colors ${
            audioEnabled ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'
          }`}
        >
          {audioEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {alerts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 text-gray-400"
          >
            <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-400" />
            <p>All crew alerts acknowledged</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.95 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-gradient-to-r ${getPriorityColor(alert.priority)} rounded-xl p-4 border border-white/10`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <motion.div
                      animate={alert.priority === 'immediate' ? { 
                        scale: [1, 1.2, 1],
                        rotate: [0, 5, -5, 0]
                      } : {}}
                      transition={{ 
                        duration: 0.5, 
                        repeat: alert.priority === 'immediate' ? Infinity : 0 
                      }}
                    >
                      {getPriorityIcon(alert.priority)}
                    </motion.div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
                          alert.priority === 'immediate' ? 'bg-red-200 text-red-800' :
                          alert.priority === 'urgent' ? 'bg-orange-200 text-orange-800' :
                          'bg-blue-200 text-blue-800'
                        }`}>
                          {alert.priority}
                        </span>
                        
                        {alert.voiceAlert && (
                          <motion.div
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="flex items-center space-x-1 text-yellow-300"
                          >
                            <Volume2 className="h-3 w-3" />
                            <span className="text-xs">VOICE</span>
                          </motion.div>
                        )}
                      </div>
                      
                      <p className="text-white font-medium mb-2">{alert.message}</p>
                      
                      {alert.visualCue && (
                        <div className="bg-black/20 rounded-lg p-2 mb-3">
                          <p className="text-sm text-gray-200">{alert.visualCue}</p>
                        </div>
                      )}
                      
                      <div className="text-xs text-gray-300">
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => onAcknowledge(alert.id)}
                    className="ml-4 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>ACK</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CrewAlertSystem;