import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, Clock, Radio, MapPin, Plane, 
  Shield, Zap, Users, PhoneCall, Navigation
} from 'lucide-react';
import { CriticalAlert, EmergencyProcedure, NearestAirport } from '../types';

interface EmergencyResponseSystemProps {
  criticalAlert: CriticalAlert | null;
  onProcedureComplete: (step: number) => void;
  onAirportSelect: (airport: NearestAirport) => void;
}

const EmergencyResponseSystem: React.FC<EmergencyResponseSystemProps> = ({
  criticalAlert,
  onProcedureComplete,
  onAirportSelect
}) => {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [maydayTransmitted, setMaydayTransmitted] = useState(false);

  useEffect(() => {
    if (criticalAlert) {
      setTimeRemaining(criticalAlert.timeToAction);
      const timer = setInterval(() => {
        setTimeRemaining(prev => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [criticalAlert]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getUrgencyColor = (seconds: number) => {
    if (seconds <= 60) return 'text-red-500 animate-pulse';
    if (seconds <= 300) return 'text-orange-500';
    return 'text-yellow-500';
  };

  if (!criticalAlert) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div className="bg-red-900/90 border-2 border-red-500 rounded-2xl p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Emergency Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <AlertTriangle className="h-12 w-12 text-red-400" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold text-red-200">EMERGENCY RESPONSE ACTIVE</h1>
              <p className="text-red-300">{criticalAlert.title}</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className={`text-4xl font-bold ${getUrgencyColor(timeRemaining)}`}>
              {formatTime(timeRemaining)}
            </div>
            <div className="text-red-300 text-sm">TIME TO ACTION</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Emergency Procedures */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-red-200 flex items-center space-x-2">
              <Shield className="h-6 w-6" />
              <span>IMMEDIATE ACTIONS</span>
            </h2>
            
            <div className="space-y-4">
              {criticalAlert.emergencyProcedures.map((procedure) => (
                <motion.div
                  key={procedure.step}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: procedure.step * 0.1 }}
                  className={`p-4 rounded-lg border-2 ${
                    procedure.completed 
                      ? 'bg-green-900/30 border-green-500' 
                      : procedure.critical 
                        ? 'bg-red-800/50 border-red-400 animate-pulse' 
                        : 'bg-orange-900/30 border-orange-500'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          procedure.completed ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                        }`}>
                          {procedure.step}
                        </div>
                        <span className={`font-semibold ${
                          procedure.critical ? 'text-red-200' : 'text-orange-200'
                        }`}>
                          {procedure.critical ? 'CRITICAL: ' : ''}
                          {procedure.action}
                        </span>
                      </div>
                      
                      {procedure.timeLimit > 0 && (
                        <div className="text-sm text-red-300 ml-11">
                          Complete within: {formatTime(procedure.timeLimit)}
                        </div>
                      )}
                    </div>
                    
                    {!procedure.completed && (
                      <button
                        onClick={() => onProcedureComplete(procedure.step)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                      >
                        COMPLETE
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Emergency Communications */}
            <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-4">
              <h3 className="text-lg font-bold text-blue-200 mb-3 flex items-center space-x-2">
                <Radio className="h-5 w-5" />
                <span>EMERGENCY COMMUNICATIONS</span>
              </h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => setMaydayTransmitted(true)}
                  disabled={maydayTransmitted}
                  className={`w-full p-3 rounded-lg font-bold transition-colors ${
                    maydayTransmitted 
                      ? 'bg-green-600 text-white' 
                      : 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                  }`}
                >
                  {maydayTransmitted ? '✓ MAYDAY TRANSMITTED' : 'TRANSMIT MAYDAY'}
                </button>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-800 p-3 rounded-lg">
                    <div className="text-blue-200 text-sm">Squawk Code</div>
                    <div className="text-white font-bold text-lg">7700</div>
                  </div>
                  <div className="bg-slate-800 p-3 rounded-lg">
                    <div className="text-blue-200 text-sm">Emergency Freq</div>
                    <div className="text-white font-bold text-lg">121.5</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Nearest Airports */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-red-200 flex items-center space-x-2">
              <MapPin className="h-6 w-6" />
              <span>NEAREST AIRPORTS</span>
            </h2>
            
            <div className="space-y-4">
              {criticalAlert.nearestAirports.map((airport, index) => (
                <motion.div
                  key={airport.code}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-slate-800/50 border border-slate-600 rounded-lg p-4 hover:border-blue-500 transition-colors cursor-pointer"
                  onClick={() => onAirportSelect(airport)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-xl font-bold text-white">{airport.code}</div>
                      <div className="text-slate-300">{airport.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-400">
                        {airport.estimatedArrival}min
                      </div>
                      <div className="text-slate-400 text-sm">ETA</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">Distance: </span>
                      <span className="text-white font-semibold">{airport.distance} nm</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Runway: </span>
                      <span className="text-white font-semibold">{airport.runwayLength}ft</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Bearing: </span>
                      <span className="text-white font-semibold">{airport.bearing}°</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {airport.emergencyServices ? (
                        <span className="text-green-400 font-semibold">✓ Emergency Services</span>
                      ) : (
                        <span className="text-red-400 font-semibold">✗ No Emergency Services</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-slate-600">
                    <div className="text-slate-400 text-sm">Weather: </div>
                    <div className="text-white">{airport.weatherConditions}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EmergencyResponseSystem;