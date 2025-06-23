import React from 'react';
import { motion } from 'framer-motion';
import { Users, Shield, Wind, Gauge, Heart, LifeBuoy } from 'lucide-react';
import { PassengerSafety } from '../types';
import CircularProgress from './CircularProgress';

interface PassengerSafetyMonitorProps {
  safetyData: PassengerSafety;
}

const PassengerSafetyMonitor: React.FC<PassengerSafetyMonitorProps> = ({ safetyData }) => {
  const getStatusColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value >= thresholds.good) return 'text-green-400';
    if (value >= thresholds.warning) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-emerald-900/30 to-teal-900/30 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-6 shadow-2xl"
    >
      <div className="flex items-center space-x-3 mb-6">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Shield className="h-6 w-6 text-emerald-400" />
        </motion.div>
        <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
          Passenger Safety Monitor
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Seatbelt Status */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center"
        >
          <div className={`text-4xl mb-2 ${safetyData.seatbeltSign ? 'text-red-400' : 'text-green-400'}`}>
            {safetyData.seatbeltSign ? '🔴' : '🟢'}
          </div>
          <div className="text-sm font-medium text-white mb-1">Seatbelt Sign</div>
          <div className={`text-xs ${safetyData.seatbeltSign ? 'text-red-300' : 'text-green-300'}`}>
            {safetyData.seatbeltSign ? 'ON' : 'OFF'}
          </div>
        </motion.div>

        {/* Turbulence Level */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <CircularProgress
            value={safetyData.turbulenceLevel}
            size={60}
            strokeWidth={4}
            gradientId="turbulence"
          />
          <div className="text-sm font-medium text-white mt-2">Turbulence</div>
          <div className={`text-xs ${getStatusColor(100 - safetyData.turbulenceLevel, { good: 80, warning: 60 })}`}>
            {safetyData.turbulenceLevel < 20 ? 'Smooth' :
             safetyData.turbulenceLevel < 40 ? 'Light' :
             safetyData.turbulenceLevel < 60 ? 'Moderate' :
             'Severe'}
          </div>
        </motion.div>

        {/* Cabin Pressure */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <div className="relative">
            <Gauge className="h-12 w-12 mx-auto text-blue-400 mb-2" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-white">
                {safetyData.cabinPressure.toFixed(1)}
              </span>
            </div>
          </div>
          <div className="text-sm font-medium text-white">Cabin Pressure</div>
          <div className={`text-xs ${getStatusColor(safetyData.cabinPressure, { good: 11, warning: 10 })}`}>
            {safetyData.cabinPressure.toFixed(1)} PSI
          </div>
        </motion.div>

        {/* Oxygen Levels */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <div className="relative">
            <Heart className="h-12 w-12 mx-auto text-pink-400 mb-2" />
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <span className="text-xs font-bold text-white">
                {safetyData.oxygenLevels}%
              </span>
            </motion.div>
          </div>
          <div className="text-sm font-medium text-white">Oxygen Level</div>
          <div className={`text-xs ${getStatusColor(safetyData.oxygenLevels, { good: 19, warning: 16 })}`}>
            {safetyData.oxygenLevels >= 19 ? 'Optimal' :
             safetyData.oxygenLevels >= 16 ? 'Adequate' :
             'Low'}
          </div>
        </motion.div>
      </div>

      {/* Emergency Equipment Status */}
      <div className="border-t border-emerald-500/30 pt-6">
        <h4 className="text-lg font-semibold text-emerald-300 mb-4 flex items-center space-x-2">
          <LifeBuoy className="h-5 w-5" />
          <span>Emergency Equipment Status</span>
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-emerald-800/20 border border-emerald-500/30 rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-emerald-200">Life Vests</span>
              <span className="text-lg font-bold text-emerald-400">
                {safetyData.emergencyEquipment.lifevests}
              </span>
            </div>
            <div className="h-2 bg-emerald-800 rounded-full">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(safetyData.emergencyEquipment.lifevests / 180) * 100}%` }}
                transition={{ delay: 0.7, duration: 1 }}
                className="h-full bg-emerald-400 rounded-full"
              />
            </div>
            <div className="text-xs text-emerald-300 mt-1">Available</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-emerald-800/20 border border-emerald-500/30 rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-emerald-200">Oxygen Masks</span>
              <span className="text-lg font-bold text-emerald-400">
                {safetyData.emergencyEquipment.oxygenMasks}
              </span>
            </div>
            <div className="h-2 bg-emerald-800 rounded-full">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(safetyData.emergencyEquipment.oxygenMasks / 200) * 100}%` }}
                transition={{ delay: 0.8, duration: 1 }}
                className="h-full bg-emerald-400 rounded-full"
              />
            </div>
            <div className="text-xs text-emerald-300 mt-1">Functional</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-emerald-800/20 border border-emerald-500/30 rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-emerald-200">Emergency Slides</span>
              <span className="text-lg font-bold text-emerald-400">
                {safetyData.emergencyEquipment.emergencySlides}
              </span>
            </div>
            <div className="h-2 bg-emerald-800 rounded-full">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(safetyData.emergencyEquipment.emergencySlides / 8) * 100}%` }}
                transition={{ delay: 0.9, duration: 1 }}
                className="h-full bg-emerald-400 rounded-full"
              />
            </div>
            <div className="text-xs text-emerald-300 mt-1">Ready</div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default PassengerSafetyMonitor;