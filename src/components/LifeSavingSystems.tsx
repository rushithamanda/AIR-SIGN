import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, Zap, Droplets, Wind, Users, 
  AlertTriangle, CheckCircle, Clock, Radio
} from 'lucide-react';
import { LifeSavingSystem } from '../types';

interface LifeSavingSystemsProps {
  systems: LifeSavingSystem;
  onSystemActivate: (system: string) => void;
}

const LifeSavingSystems: React.FC<LifeSavingSystemsProps> = ({ systems, onSystemActivate }) => {
  const getStatusColor = (active: boolean) => active ? 'text-green-400' : 'text-red-400';
  const getStatusIcon = (active: boolean) => active ? CheckCircle : AlertTriangle;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 shadow-2xl"
    >
      <div className="flex items-center space-x-3 mb-6">
        <Shield className="h-6 w-6 text-red-400" />
        <h3 className="text-xl font-bold text-white">Life-Saving Systems Status</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Oxygen System */}
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Wind className="h-5 w-5 text-blue-400" />
              <span className="font-semibold text-blue-200">Oxygen System</span>
            </div>
            <div className={`text-2xl font-bold ${systems.oxygenSystem.oxygenPressure > 1800 ? 'text-green-400' : 'text-red-400'}`}>
              {systems.oxygenSystem.oxygenPressure} PSI
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-blue-200">Passenger Masks</span>
              <div className="flex items-center space-x-2">
                {React.createElement(getStatusIcon(systems.oxygenSystem.passengerMasks), {
                  className: `h-4 w-4 ${getStatusColor(systems.oxygenSystem.passengerMasks)}`
                })}
                <span className={getStatusColor(systems.oxygenSystem.passengerMasks)}>
                  {systems.oxygenSystem.passengerMasks ? 'DEPLOYED' : 'STOWED'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-blue-200">Crew Masks</span>
              <div className="flex items-center space-x-2">
                {React.createElement(getStatusIcon(systems.oxygenSystem.crewMasks), {
                  className: `h-4 w-4 ${getStatusColor(systems.oxygenSystem.crewMasks)}`
                })}
                <span className={getStatusColor(systems.oxygenSystem.crewMasks)}>
                  {systems.oxygenSystem.crewMasks ? 'ON' : 'OFF'}
                </span>
              </div>
            </div>
            
            <div className="bg-blue-800/30 rounded-lg p-3">
              <div className="text-blue-200 text-sm">Oxygen Duration</div>
              <div className="text-white font-bold text-lg">
                {systems.oxygenSystem.estimatedDuration} minutes remaining
              </div>
            </div>
            
            {!systems.oxygenSystem.passengerMasks && (
              <button
                onClick={() => onSystemActivate('oxygen_masks')}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                DEPLOY OXYGEN MASKS
              </button>
            )}
          </div>
        </div>

        {/* Fire Suppression System */}
        <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-red-400" />
              <span className="font-semibold text-red-200">Fire Suppression</span>
            </div>
            <div className="text-2xl font-bold text-red-400">
              {systems.fireSuppressionSystem.engineFireBottles} Bottles
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-red-200">Engine Fire Bottles</span>
              <span className="text-white font-bold">
                {systems.fireSuppressionSystem.engineFireBottles}/2 Available
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-red-200">Cargo Fire Suppression</span>
              <div className="flex items-center space-x-2">
                {React.createElement(getStatusIcon(systems.fireSuppressionSystem.cargoFireSuppression), {
                  className: `h-4 w-4 ${getStatusColor(systems.fireSuppressionSystem.cargoFireSuppression)}`
                })}
                <span className={getStatusColor(systems.fireSuppressionSystem.cargoFireSuppression)}>
                  {systems.fireSuppressionSystem.cargoFireSuppression ? 'ARMED' : 'DISARMED'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-red-200">Lavatory Fire Detection</span>
              <div className="flex items-center space-x-2">
                {React.createElement(getStatusIcon(systems.fireSuppressionSystem.lavatoryFireDetection), {
                  className: `h-4 w-4 ${getStatusColor(systems.fireSuppressionSystem.lavatoryFireDetection)}`
                })}
                <span className={getStatusColor(systems.fireSuppressionSystem.lavatoryFireDetection)}>
                  {systems.fireSuppressionSystem.lavatoryFireDetection ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Evacuation System */}
        <div className="bg-orange-900/20 border border-orange-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-orange-400" />
              <span className="font-semibold text-orange-200">Emergency Evacuation</span>
            </div>
            <div className="text-lg font-bold text-orange-400">
              {Object.values(systems.emergencyEvacuation).filter(Boolean).length}/4 Ready
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-orange-200">Slides Armed</span>
              <div className="flex items-center space-x-2">
                {React.createElement(getStatusIcon(systems.emergencyEvacuation.slidesArmed), {
                  className: `h-4 w-4 ${getStatusColor(systems.emergencyEvacuation.slidesArmed)}`
                })}
                <span className={getStatusColor(systems.emergencyEvacuation.slidesArmed)}>
                  {systems.emergencyEvacuation.slidesArmed ? 'ARMED' : 'DISARMED'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-orange-200">Emergency Lighting</span>
              <div className="flex items-center space-x-2">
                {React.createElement(getStatusIcon(systems.emergencyEvacuation.emergencyLighting), {
                  className: `h-4 w-4 ${getStatusColor(systems.emergencyEvacuation.emergencyLighting)}`
                })}
                <span className={getStatusColor(systems.emergencyEvacuation.emergencyLighting)}>
                  {systems.emergencyEvacuation.emergencyLighting ? 'ON' : 'OFF'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-orange-200">Exit Path Illumination</span>
              <div className="flex items-center space-x-2">
                {React.createElement(getStatusIcon(systems.emergencyEvacuation.exitPathIllumination), {
                  className: `h-4 w-4 ${getStatusColor(systems.emergencyEvacuation.exitPathIllumination)}`
                })}
                <span className={getStatusColor(systems.emergencyEvacuation.exitPathIllumination)}>
                  {systems.emergencyEvacuation.exitPathIllumination ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-orange-200">Crew Stations</span>
              <div className="flex items-center space-x-2">
                {React.createElement(getStatusIcon(systems.emergencyEvacuation.crewStations), {
                  className: `h-4 w-4 ${getStatusColor(systems.emergencyEvacuation.crewStations)}`
                })}
                <span className={getStatusColor(systems.emergencyEvacuation.crewStations)}>
                  {systems.emergencyEvacuation.crewStations ? 'MANNED' : 'UNMANNED'}
                </span>
              </div>
            </div>
            
            {!systems.emergencyEvacuation.slidesArmed && (
              <button
                onClick={() => onSystemActivate('evacuation_prep')}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                PREPARE FOR EVACUATION
              </button>
            )}
          </div>
        </div>

        {/* Communication Systems */}
        <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Radio className="h-5 w-5 text-purple-400" />
              <span className="font-semibold text-purple-200">Emergency Communications</span>
            </div>
            <div className="text-lg font-bold text-purple-400">
              {systems.communicationSystems.squawkCode}
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-purple-200">Mayday Transmitted</span>
              <div className="flex items-center space-x-2">
                {React.createElement(getStatusIcon(systems.communicationSystems.maydayTransmitted), {
                  className: `h-4 w-4 ${getStatusColor(systems.communicationSystems.maydayTransmitted)}`
                })}
                <span className={getStatusColor(systems.communicationSystems.maydayTransmitted)}>
                  {systems.communicationSystems.maydayTransmitted ? 'SENT' : 'PENDING'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-purple-200">ATC Contact</span>
              <div className="flex items-center space-x-2">
                {React.createElement(getStatusIcon(systems.communicationSystems.atcContact), {
                  className: `h-4 w-4 ${getStatusColor(systems.communicationSystems.atcContact)}`
                })}
                <span className={getStatusColor(systems.communicationSystems.atcContact)}>
                  {systems.communicationSystems.atcContact ? 'ESTABLISHED' : 'LOST'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-purple-200">Emergency Frequency</span>
              <div className="flex items-center space-x-2">
                {React.createElement(getStatusIcon(systems.communicationSystems.emergencyFrequency), {
                  className: `h-4 w-4 ${getStatusColor(systems.communicationSystems.emergencyFrequency)}`
                })}
                <span className={getStatusColor(systems.communicationSystems.emergencyFrequency)}>
                  {systems.communicationSystems.emergencyFrequency ? '121.5 MHz' : 'NOT SET'}
                </span>
              </div>
            </div>
            
            {!systems.communicationSystems.maydayTransmitted && (
              <button
                onClick={() => onSystemActivate('mayday')}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors animate-pulse"
              >
                TRANSMIT MAYDAY
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LifeSavingSystems;