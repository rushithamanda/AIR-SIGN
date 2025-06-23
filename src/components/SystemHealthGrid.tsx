import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Cog, Droplets, Cpu, Radio } from 'lucide-react';
import { SystemHealth } from '../types';
import CircularProgress from './CircularProgress';

interface SystemHealthGridProps {
  systemHealth: SystemHealth;
}

const SystemHealthGrid: React.FC<SystemHealthGridProps> = ({ systemHealth }) => {
  const systems = [
    {
      name: 'Overall',
      value: systemHealth.overall,
      icon: Zap,
      color: 'text-teal-400'
    },
    {
      name: 'Engines',
      value: systemHealth.engines,
      icon: Cog,
      color: 'text-orange-400'
    },
    {
      name: 'Hydraulics',
      value: systemHealth.hydraulics,
      icon: Droplets,
      color: 'text-blue-400'
    },
    {
      name: 'Electrical',
      value: systemHealth.electrical,
      icon: Zap,
      color: 'text-yellow-400'
    },
    {
      name: 'Avionics',
      value: systemHealth.avionics,
      icon: Radio,
      color: 'text-purple-400'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 shadow-xl"
    >
      <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
        <Cpu className="h-5 w-5 text-teal-400" />
        <span>System Health Monitor</span>
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {systems.map((system, index) => (
          <motion.div
            key={system.name}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="text-center"
          >
            <div className="flex justify-center mb-3">
              <CircularProgress
                value={system.value}
                size={80}
                strokeWidth={6}
                gradientId={system.name.toLowerCase()}
              />
            </div>
            
            <div className="flex items-center justify-center space-x-2 mb-2">
              <system.icon className={`h-4 w-4 ${system.color}`} />
              <span className="text-sm font-medium text-slate-300">{system.name}</span>
            </div>
            
            <div className={`text-xs ${
              system.value >= 80 ? 'text-green-400' :
              system.value >= 60 ? 'text-yellow-400' :
              system.value >= 40 ? 'text-orange-400' :
              'text-red-400'
            }`}>
              {system.value >= 80 ? 'Excellent' :
               system.value >= 60 ? 'Good' :
               system.value >= 40 ? 'Fair' :
               'Critical'}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default SystemHealthGrid;