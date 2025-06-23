import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plane, Shield, Clock, Thermometer, Activity, 
  Gauge, Droplets, Zap, Settings, MapPin, Brain,
  AlertTriangle, Users
} from 'lucide-react';
import { useLifeSavingData } from '../hooks/useLifeSavingData';
import { mockIoT, FlightTelemetry } from '../services/mockAWS';
import CriticalAlertsPanel from './CriticalAlertsPanel';
import EmergencyResponseSystem from './EmergencyResponseSystem';
import LifeSavingSystems from './LifeSavingSystems';
import SystemHealthGrid from './SystemHealthGrid';
import LiveChart from './LiveChart';
import AnimatedCounter from './AnimatedCounter';
import AWSBedrockPanel from './AWSBedrockPanel';
import PredictiveAnalysisEngine from './PredictiveAnalysisEngine';
import AWSIntegrationDashboard from './AWSIntegrationDashboard';
import { NearestAirport } from '../types';

interface DashboardProps {
  isAlertMode: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ isAlertMode }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedAirport, setSelectedAirport] = useState<NearestAirport | null>(null);
  const [showEmergencySystem, setShowEmergencySystem] = useState(false);
  const [telemetryData, setTelemetryData] = useState<FlightTelemetry>({
    engineTemp: 420,
    cabinPressure: 11.3,
    vibrationLevel: 3.2,
    oilPressure: 45,
    fuelQuantity: 85,
    altitude: 35000,
    airspeed: 520
  });
  
  const { 
    sensorData, 
    currentData, 
    criticalAlerts,
    crewAlerts,
    systemHealth, 
    lifeSavingSystems,
    acknowledgeAlert,
    acknowledgeCrewAlert,
    activateLifeSavingSystem,
    completeProcedure
  } = useLifeSavingData(isAlertMode);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Update telemetry data based on current sensor data
  useEffect(() => {
    setTelemetryData({
      engineTemp: currentData.engineTemp,
      cabinPressure: currentData.cabinPressure,
      vibrationLevel: currentData.vibrationLevel,
      oilPressure: currentData.oilPressure,
      fuelQuantity: currentData.fuelQuantity,
      altitude: currentData.altitude,
      airspeed: currentData.airspeed
    });
  }, [currentData]);

  // Show emergency system when critical alerts appear
  useEffect(() => {
    const activeCriticalAlert = criticalAlerts.find(alert => !alert.acknowledged && alert.severity >= 4);
    setShowEmergencySystem(!!activeCriticalAlert);
  }, [criticalAlerts]);

  const getStatusColor = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value > thresholds.critical) return 'text-red-400';
    if (value > thresholds.warning) return 'text-amber-400';
    return 'text-emerald-400';
  };

  const getStatusText = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value > thresholds.critical) return 'CRITICAL';
    if (value > thresholds.warning) return 'WARNING';
    return 'OPTIMAL';
  };

  const handleEmergencyAction = (action: string) => {
    activateLifeSavingSystem(action);
  };

  const handleProcedureComplete = (step: number) => {
    if (criticalAlerts.length > 0) {
      completeProcedure(criticalAlerts[0].id, step);
    }
  };

  const handleAirportSelect = (airport: NearestAirport) => {
    setSelectedAirport(airport);
    console.log(`Diverting to ${airport.code} - ${airport.name}`);
  };

  const handleCloseEmergencySystem = () => {
    setShowEmergencySystem(false);
  };

  const activeCriticalAlert = criticalAlerts.find(alert => !alert.acknowledged && alert.severity >= 4);
  const isEmergencyActive = isAlertMode || criticalAlerts.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white overflow-hidden relative">
      {/* Flight Status Bar - Fixed Position on Right */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed top-6 right-6 z-30"
      >
        <div className={`px-6 py-4 rounded-2xl backdrop-blur-xl border-2 shadow-2xl transition-all duration-500 ${
          isEmergencyActive 
            ? 'bg-gradient-to-r from-red-600/30 to-red-800/30 border-red-500/50 animate-pulse' 
            : 'bg-gradient-to-r from-blue-600/30 to-blue-800/30 border-blue-500/50'
        }`}>
          <div className="flex items-center space-x-3">
            <motion.div
              animate={isEmergencyActive ? { 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              } : { 
                y: [0, -2, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: isEmergencyActive ? 0.5 : 2, 
                repeat: Infinity 
              }}
            >
              {isEmergencyActive ? (
                <AlertTriangle className="h-6 w-6 text-red-400" />
              ) : (
                <Plane className="h-6 w-6 text-blue-400" />
              )}
            </motion.div>
            <div>
              <div className={`text-lg font-bold ${
                isEmergencyActive ? 'text-red-200' : 'text-blue-200'
              }`}>
                {isEmergencyActive ? 'EMERGENCY MODE' : 'NORMAL FLIGHT'}
              </div>
              <div className={`text-sm ${
                isEmergencyActive ? 'text-red-300' : 'text-blue-300'
              }`}>
                {isEmergencyActive ? 'Life-Saving Systems Active' : 'All Systems Normal'}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Critical Alerts Panel */}
      <CriticalAlertsPanel 
        alerts={criticalAlerts}
        onAlertAcknowledge={acknowledgeAlert}
        onEmergencyAction={handleEmergencyAction}
      />
      
      {/* Emergency Response System - with close functionality */}
      {showEmergencySystem && activeCriticalAlert && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-red-900/90 border-2 border-red-500 rounded-2xl p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto relative">
            {/* Close Button */}
            <button
              onClick={handleCloseEmergencySystem}
              className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg z-10"
            >
              ×
            </button>
            
            <EmergencyResponseSystem
              criticalAlert={activeCriticalAlert}
              onProcedureComplete={handleProcedureComplete}
              onAirportSelect={handleAirportSelect}
            />
          </div>
        </div>
      )}
      
      {/* Header - Adjusted to not conflict with status bar */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`border-b backdrop-blur-xl sticky top-0 z-40 shadow-2xl transition-all duration-500 ${
          isEmergencyActive 
            ? 'bg-gradient-to-r from-red-900/40 to-orange-900/40 border-red-500/30' 
            : 'bg-gradient-to-r from-slate-900/40 to-blue-900/40 border-slate-700/30'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between pr-80"> {/* Added right padding to avoid status bar */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                <motion.div
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                    scale: { duration: 2, repeat: Infinity }
                  }}
                  className="relative"
                >
                  <Shield className={`h-10 w-10 ${isEmergencyActive ? 'text-red-400' : 'text-cyan-400'}`} />
                  <motion.div
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className={`absolute inset-0 rounded-full blur-xl ${
                      isEmergencyActive ? 'bg-red-400' : 'bg-cyan-400'
                    }`}
                  />
                </motion.div>
                <div>
                  <h1 className={`text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent ${
                    isEmergencyActive 
                      ? 'from-red-400 via-orange-400 to-red-400' 
                      : 'from-cyan-400 via-blue-400 to-purple-400'
                  }`}>
                    AirSign
                  </h1>
                  <div className="text-sm text-slate-300 flex items-center space-x-2">
                    <Shield className="h-4 w-4" />
                    <span>AWS-Powered Flight Safety System</span>
                  </div>
                </div>
              </div>
              
              <div className="hidden lg:flex items-center space-x-6">
                <div className="flex items-center space-x-3">
                  <Plane className="h-6 w-6 text-cyan-400" />
                  <div>
                    <div className="text-lg font-semibold text-slate-200">United Airlines</div>
                    <div className="text-sm text-slate-400">Boeing 737-MAX 8</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <MapPin className="h-6 w-6 text-emerald-400" />
                  <div>
                    <div className="text-lg font-semibold text-slate-200">
                      {selectedAirport ? `DIVERTING TO ${selectedAirport.code}` : 'LAX → JFK'}
                    </div>
                    <div className="text-sm text-slate-400">
                      {currentData.altitude.toLocaleString()} ft • {currentData.airspeed} mph
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Flight ID and Time - Moved to left side to avoid status bar */}
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <div className="text-2xl font-bold text-white">UA 243</div>
                <div className="text-sm text-slate-400">Flight ID</div>
              </div>
              
              <div className="hidden sm:block w-px h-12 bg-slate-600"></div>
              
              <div className="text-right">
                <div className="text-lg font-bold text-cyan-400">
                  {currentTime.toLocaleTimeString()}
                </div>
                <div className="text-sm text-slate-400">UTC</div>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content - Adjusted layout to accommodate status bar */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pr-80"> {/* Added right padding */}
        {/* 🚀 PROFESSIONAL PREDICTIVE ANALYSIS ENGINE */}
        <PredictiveAnalysisEngine 
          isEmergencyMode={isEmergencyActive}
          currentData={currentData}
        />

        {/* AWS Bedrock AI Analysis Panel */}
        <AWSBedrockPanel 
          telemetryData={telemetryData}
          isEmergencyMode={isEmergencyActive}
        />

        {/* 🔥 NEW: Complete AWS Integration Dashboard */}
        <AWSIntegrationDashboard 
          telemetryData={telemetryData}
          isEmergencyMode={isEmergencyActive}
        />

        {/* Life-Saving Systems Status */}
        <LifeSavingSystems 
          systems={lifeSavingSystems}
          onSystemActivate={activateLifeSavingSystem}
        />

        {/* Enhanced Critical Flight Parameters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Engine Temperature */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className={`backdrop-blur-xl border rounded-2xl p-6 shadow-2xl transition-all duration-300 ${
              currentData.engineTemp > 450 
                ? 'bg-gradient-to-br from-red-900/30 to-red-800/30 border-red-500/50 shadow-red-500/20' 
                : 'bg-gradient-to-br from-slate-800/30 to-slate-900/30 border-slate-600/30 hover:shadow-orange-500/20'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Thermometer className="h-6 w-6 text-orange-400" />
                </motion.div>
                <span className="text-lg font-semibold text-slate-200">Engine Temp</span>
              </div>
              <div className={`text-xs font-bold px-3 py-1 rounded-full ${
                getStatusColor(currentData.engineTemp, { warning: 400, critical: 450 })
              } bg-slate-800/50`}>
                {getStatusText(currentData.engineTemp, { warning: 400, critical: 450 })}
              </div>
            </div>
            
            <div className="text-center">
              <div className={`text-4xl font-bold mb-3 ${
                getStatusColor(currentData.engineTemp, { warning: 400, critical: 450 })
              }`}>
                <AnimatedCounter value={currentData.engineTemp} suffix="°F" />
              </div>
              <div className="text-sm text-slate-400">Range: 350-450°F</div>
              <div className="mt-3 h-2 bg-slate-700 rounded-full">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentData.engineTemp / 500) * 100}%` }}
                  className={`h-full rounded-full ${
                    currentData.engineTemp > 450 ? 'bg-red-500' :
                    currentData.engineTemp > 400 ? 'bg-amber-500' :
                    'bg-emerald-500'
                  }`}
                />
              </div>
            </div>
          </motion.div>

          {/* Cabin Pressure - CRITICAL FOR LIFE SAFETY */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`backdrop-blur-xl border rounded-2xl p-6 shadow-2xl transition-all duration-300 ${
              currentData.cabinPressure < 10 
                ? 'bg-gradient-to-br from-red-900/30 to-red-800/30 border-red-500/50 shadow-red-500/20 animate-pulse' 
                : 'bg-gradient-to-br from-slate-800/30 to-slate-900/30 border-slate-600/30 hover:shadow-blue-500/20'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <motion.div
                  animate={currentData.cabinPressure < 10 ? { 
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, -5, 0]
                  } : {}}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  <Gauge className="h-6 w-6 text-blue-400" />
                </motion.div>
                <span className="text-lg font-semibold text-slate-200">Cabin Pressure</span>
              </div>
              <div className={`text-xs font-bold px-3 py-1 rounded-full ${
                currentData.cabinPressure < 10 ? 'text-red-400 bg-red-900/50' : 'text-emerald-400 bg-slate-800/50'
              }`}>
                {currentData.cabinPressure < 10 ? 'CRITICAL' : 'OPTIMAL'}
              </div>
            </div>
            
            <div className="text-center">
              <div className={`text-4xl font-bold mb-3 ${
                currentData.cabinPressure < 10 ? 'text-red-400' : 'text-emerald-400'
              }`}>
                <AnimatedCounter value={currentData.cabinPressure} decimals={1} suffix=" PSI" />
              </div>
              <div className="text-sm text-slate-400">Normal: 10.9-11.5 PSI</div>
              {currentData.cabinPressure < 10 && (
                <div className="mt-2 text-red-300 text-sm font-bold animate-pulse">
                  OXYGEN MASKS REQUIRED
                </div>
              )}
            </div>
          </motion.div>

          {/* Fuel Quantity */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`backdrop-blur-xl border rounded-2xl p-6 shadow-2xl transition-all duration-300 ${
              currentData.fuelQuantity < 30 
                ? 'bg-gradient-to-br from-amber-900/30 to-orange-900/30 border-amber-500/50 shadow-amber-500/20' 
                : 'bg-gradient-to-br from-slate-800/30 to-slate-900/30 border-slate-600/30 hover:shadow-emerald-500/20'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Droplets className="h-6 w-6 text-emerald-400" />
                <span className="text-lg font-semibold text-slate-200">Fuel Quantity</span>
              </div>
              <div className={`text-xs font-bold px-3 py-1 rounded-full ${
                currentData.fuelQuantity < 30 ? 'text-amber-400 bg-amber-900/50' : 'text-emerald-400 bg-slate-800/50'
              }`}>
                {currentData.fuelQuantity < 30 ? 'LOW' : 'OPTIMAL'}
              </div>
            </div>
            
            <div className="text-center">
              <div className={`text-4xl font-bold mb-3 ${
                currentData.fuelQuantity < 30 ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                <AnimatedCounter value={currentData.fuelQuantity} suffix="%" />
              </div>
              <div className="text-sm text-slate-400">Fuel Remaining</div>
              {currentData.fuelQuantity < 30 && (
                <div className="mt-2 text-amber-300 text-sm font-bold">
                  CONSIDER DIVERSION
                </div>
              )}
            </div>
          </motion.div>

          {/* System Health Overview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className={`backdrop-blur-xl border rounded-2xl p-6 shadow-2xl transition-all duration-300 ${
              systemHealth.overall < 50 
                ? 'bg-gradient-to-br from-red-900/30 to-red-800/30 border-red-500/50 shadow-red-500/20' 
                : 'bg-gradient-to-br from-slate-800/30 to-slate-900/30 border-slate-600/30 hover:shadow-cyan-500/20'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Shield className="h-6 w-6 text-cyan-400" />
                <span className="text-lg font-semibold text-slate-200">System Health</span>
              </div>
              <div className={`text-xs font-bold px-3 py-1 rounded-full ${
                systemHealth.overall < 50 ? 'text-red-400 bg-red-900/50' : 'text-emerald-400 bg-slate-800/50'
              }`}>
                {systemHealth.overall < 50 ? 'CRITICAL' : 'HEALTHY'}
              </div>
            </div>
            
            <div className="text-center">
              <div className={`text-4xl font-bold mb-3 ${
                systemHealth.overall < 50 ? 'text-red-400' : 'text-cyan-400'
              }`}>
                <AnimatedCounter value={systemHealth.overall} suffix="%" />
              </div>
              <div className="text-sm text-slate-400">Overall Status</div>
            </div>
          </motion.div>
        </div>

        {/* System Health Grid */}
        <SystemHealthGrid systemHealth={systemHealth} />

        {/* Live Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LiveChart
            data={sensorData}
            dataKey="engineTemp"
            title="Engine Temperature - Critical Safety Parameter"
            unit="°F"
            color="#f97316"
            thresholds={{ warning: 400, critical: 450 }}
          />
          
          <LiveChart
            data={sensorData}
            dataKey="cabinPressure"
            title="Cabin Pressure - Life Safety Critical"
            unit="PSI"
            color="#06b6d4"
            thresholds={{ warning: 10.5, critical: 10.0 }}
          />
        </div>

        {/* Flight Status Information - Moved to Bottom */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/30 border border-slate-600/30 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-slate-200 mb-4 flex items-center space-x-2">
              <Plane className="h-5 w-5 text-cyan-400" />
              <span>Flight Details</span>
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Flight</span>
                <span className="text-white font-semibold">UA 243</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Aircraft</span>
                <span className="text-white font-semibold">Boeing 737-MAX 8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Route</span>
                <span className="text-white font-semibold">LAX → JFK</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Passengers</span>
                <span className="text-white font-semibold">180 + 6 crew</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/30 border border-slate-600/30 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-slate-200 mb-4 flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-emerald-400" />
              <span>Current Position</span>
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Altitude</span>
                <span className="text-white font-semibold">{currentData.altitude.toLocaleString()} ft</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Speed</span>
                <span className="text-white font-semibold">{currentData.airspeed} mph</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Heading</span>
                <span className="text-white font-semibold">090°</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">ETA</span>
                <span className="text-white font-semibold">4h 45m</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/30 border border-slate-600/30 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-slate-200 mb-4 flex items-center space-x-2">
              <Brain className="h-5 w-5 text-purple-400" />
              <span>AWS AI Systems</span>
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400">AWS Bedrock</span>
                <span className="text-emerald-400 font-semibold">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">IoT Core</span>
                <span className="text-cyan-400 font-semibold">Streaming</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">SageMaker</span>
                <span className="text-emerald-400 font-semibold">Predicting</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Lambda</span>
                <span className="text-orange-400 font-semibold">Ready</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Clean Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="border-t border-slate-700/30 bg-gradient-to-r from-slate-900/30 to-blue-900/30 backdrop-blur-xl mt-12"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pr-80"> {/* Added right padding */}
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-8 text-sm text-slate-400">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Last updated: {currentTime.toLocaleTimeString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4" />
                <span>System Status: {isEmergencyActive ? 'EMERGENCY' : 'Online'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Lives Protected: 180 passengers + 6 crew</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <span className="text-slate-400">Powered by</span>
              <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent font-bold">
                AWS Bedrock
              </span>
              <span className="text-slate-400">•</span>
              <span className="bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent font-bold">
                AWS IoT Core
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-cyan-400 font-semibold">Life Safety Edition</span>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default Dashboard;