import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Zap, AlertTriangle, CheckCircle, Clock, Shield, Minimize2, Bell, BellOff } from 'lucide-react';
import { mockBedrock, BedrockAnalysis, FlightTelemetry } from '../services/mockAWS';

interface AWSBedrockPanelProps {
  telemetryData: FlightTelemetry;
  isEmergencyMode: boolean;
}

const AWSBedrockPanel: React.FC<AWSBedrockPanelProps> = ({ telemetryData, isEmergencyMode }) => {
  const [analysis, setAnalysis] = useState<BedrockAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [hasNewAnalysis, setHasNewAnalysis] = useState(false);
  const lastAnalysisTimeRef = useRef<number>(0);
  const analysisTimeout = useRef<NodeJS.Timeout | null>(null);

  // Simple analysis triggering without popups
  useEffect(() => {
    const now = Date.now();
    
    // Only run analysis if enough time has passed (minimum 15 seconds)
    if (now - lastAnalysisTimeRef.current < 15000) {
      return;
    }

    const runAnalysis = () => {
      if (analysisTimeout.current) {
        clearTimeout(analysisTimeout.current);
      }

      setIsAnalyzing(true);
      lastAnalysisTimeRef.current = now;
      
      // AWS Bedrock processing time - exactly 5 seconds
      analysisTimeout.current = setTimeout(() => {
        const result = mockBedrock.analyzeFlightSafety(telemetryData);
        setAnalysis(result);
        setIsAnalyzing(false);
        setHasNewAnalysis(true);
        
        // Auto-clear new analysis indicator after 10 seconds
        setTimeout(() => setHasNewAnalysis(false), 10000);
      }, 5000);
    };

    runAnalysis();

    // Cleanup function
    return () => {
      if (analysisTimeout.current) {
        clearTimeout(analysisTimeout.current);
      }
    };
  }, [telemetryData.engineTemp, telemetryData.cabinPressure, telemetryData.vibrationLevel, isEmergencyMode]);

  // Handle panel minimize/maximize
  const handleToggleMinimize = () => {
    setIsMinimized(!isMinimized);
    if (hasNewAnalysis) setHasNewAnalysis(false);
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'CRITICAL': return 'from-red-600 to-red-800';
      case 'HIGH': return 'from-orange-600 to-orange-800';
      case 'MEDIUM': return 'from-amber-600 to-amber-800';
      case 'LOW': return 'from-emerald-600 to-emerald-800';
      default: return 'from-slate-600 to-slate-800';
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'CRITICAL': return AlertTriangle;
      case 'HIGH': return AlertTriangle;
      case 'MEDIUM': return Clock;
      case 'LOW': return CheckCircle;
      default: return Shield;
    }
  };

  const getRiskBorderColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'CRITICAL': return 'border-red-500/50';
      case 'HIGH': return 'border-orange-500/50';
      case 'MEDIUM': return 'border-amber-500/50';
      case 'LOW': return 'border-emerald-500/50';
      default: return 'border-purple-500/30';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-br from-purple-900/20 to-indigo-900/20 backdrop-blur-xl border ${
        analysis ? getRiskBorderColor(analysis.riskLevel) : 'border-purple-500/30'
      } rounded-2xl shadow-2xl relative overflow-hidden transition-all duration-500 ${
        isMinimized ? 'h-20' : 'min-h-[500px]'
      }`}
    >
      {/* Subtle notification indicator for new analysis */}
      {hasNewAnalysis && !isMinimized && analysis && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className={`absolute top-4 left-4 z-20 bg-gradient-to-r ${getRiskColor(analysis.riskLevel)} px-3 py-1 rounded-full text-white text-xs font-semibold shadow-lg`}
        >
          <div className="flex items-center space-x-1">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: 3 }}
            >
              <Bell className="h-3 w-3" />
            </motion.div>
            <span>New Analysis</span>
          </div>
        </motion.div>
      )}

      {/* Header with minimize button and notification toggle */}
      <div className="flex items-center justify-between p-6 border-b border-purple-500/20">
        <div className="flex items-center space-x-4">
          <motion.div
            animate={{ 
              rotate: isAnalyzing ? [0, 360] : 0,
              scale: isAnalyzing ? [1, 1.1, 1] : 1
            }}
            transition={{ 
              rotate: { duration: 2, repeat: isAnalyzing ? Infinity : 0, ease: "linear" },
              scale: { duration: 1, repeat: isAnalyzing ? Infinity : 0 }
            }}
            className="relative"
          >
            <Brain className="h-8 w-8 text-purple-400" />
            {isAnalyzing && (
              <motion.div
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="absolute inset-0 bg-purple-400 rounded-full blur-lg"
              />
            )}
          </motion.div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              AWS Bedrock AI Analysis
            </h3>
            {!isMinimized && (
              <div className="flex items-center space-x-2 text-purple-200 text-sm">
                <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">AWS</span>
                <span>Real-time Flight Safety Assessment</span>
                {analysis && (
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    analysis.riskLevel === 'CRITICAL' ? 'bg-red-500/20 text-red-300' :
                    analysis.riskLevel === 'HIGH' ? 'bg-orange-500/20 text-orange-300' :
                    analysis.riskLevel === 'MEDIUM' ? 'bg-amber-500/20 text-amber-300' :
                    'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    {analysis.riskLevel}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Notification indicator when minimized */}
          {isMinimized && hasNewAnalysis && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-3 h-3 bg-red-500 rounded-full"
            />
          )}
          
          <button
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            className="text-purple-300 hover:text-purple-100 transition-colors p-2 rounded-lg hover:bg-purple-800/20"
            title={notificationsEnabled ? "Disable notifications" : "Enable notifications"}
          >
            {notificationsEnabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
          </button>
          
          <button
            onClick={handleToggleMinimize}
            className="text-purple-300 hover:text-purple-100 transition-colors p-2 rounded-lg hover:bg-purple-800/20"
            title={isMinimized ? "Expand panel" : "Minimize panel"}
          >
            <Minimize2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Content Area - Only show when not minimized */}
      {!isMinimized && (
        <div className="p-6">
          <div className="min-h-[400px]">
            <AnimatePresence mode="wait">
              {isAnalyzing ? (
                <motion.div
                  key="analyzing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-8"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="inline-block mb-4"
                  >
                    <Zap className="h-12 w-12 text-purple-400" />
                  </motion.div>
                  <p className="text-purple-200 text-lg">AWS Bedrock analyzing historical flight data...</p>
                  <p className="text-purple-300 text-sm mt-2">Processing 186 lives worth of safety data</p>
                  
                  <div className="mt-4 w-64 mx-auto">
                    <div className="bg-purple-800/30 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 5, ease: "linear" }}
                        className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full"
                      />
                    </div>
                    <p className="text-purple-300 text-xs mt-2">Deep learning analysis in progress... (5 seconds)</p>
                  </div>
                  
                  <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-purple-800/20 rounded-lg p-3">
                      <div className="text-purple-300">Engine Temp</div>
                      <div className="text-white font-bold">{telemetryData.engineTemp.toFixed(1)}°F</div>
                    </div>
                    <div className="bg-purple-800/20 rounded-lg p-3">
                      <div className="text-purple-300">Cabin Pressure</div>
                      <div className="text-white font-bold">{telemetryData.cabinPressure.toFixed(1)} PSI</div>
                    </div>
                  </div>
                </motion.div>
              ) : analysis ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Risk Assessment - Enhanced with better visual feedback */}
                  <div className={`bg-gradient-to-r ${getRiskColor(analysis.riskLevel)} rounded-xl p-6 border-2 border-white/20 relative overflow-hidden`}>
                    {/* Animated background effect */}
                    <motion.div
                      animate={{
                        x: ['-100%', '100%'],
                        opacity: [0, 0.3, 0]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    />
                    
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          {React.createElement(getRiskIcon(analysis.riskLevel), {
                            className: `h-8 w-8 text-white ${analysis.riskLevel === 'CRITICAL' ? 'animate-pulse' : ''}`
                          })}
                          <div>
                            <h4 className="text-2xl font-bold text-white">{analysis.riskLevel} RISK</h4>
                            <p className="text-white/80">Confidence: {analysis.confidence}%</p>
                          </div>
                        </div>
                        <div className="text-right text-white">
                          <div className="text-3xl font-bold">{analysis.livesAtRisk}</div>
                          <div className="text-sm opacity-80">Lives Protected</div>
                        </div>
                      </div>
                      
                      <div className="bg-black/20 rounded-lg p-4 mb-4">
                        <h5 className="text-white font-semibold mb-2 flex items-center space-x-2">
                          <Brain className="h-5 w-5" />
                          <span>AWS Bedrock Recommendation:</span>
                        </h5>
                        <p className="text-white text-lg">{analysis.recommendation}</p>
                      </div>

                      {analysis.timeToAction && (
                        <div className="flex items-center space-x-2 text-white">
                          <Clock className="h-5 w-5" />
                          <span className="font-semibold">
                            Time to Action: {Math.floor(analysis.timeToAction / 60)}m {analysis.timeToAction % 60}s
                          </span>
                        </div>
                      )}

                      {analysis.predictedFailure && (
                        <div className="mt-3 bg-red-900/30 border border-red-500/50 rounded-lg p-3">
                          <p className="text-red-200 font-semibold">⚠️ Predicted Failure: {analysis.predictedFailure}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Technical Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-purple-800/20 border border-purple-500/30 rounded-lg p-4">
                      <h5 className="text-purple-300 font-semibold mb-3 flex items-center space-x-2">
                        <Brain className="h-4 w-4" />
                        <span>AI Model Details</span>
                      </h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-purple-200">Model:</span>
                          <span className="text-white">Claude-3-Haiku</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-purple-200">Processing Time:</span>
                          <span className="text-white">5.0s</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-purple-200">Data Points:</span>
                          <span className="text-white">847</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-purple-200">Analysis ID:</span>
                          <span className="text-white font-mono text-xs">BR-{Date.now().toString().slice(-6)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-purple-800/20 border border-purple-500/30 rounded-lg p-4">
                      <h5 className="text-purple-300 font-semibold mb-3 flex items-center space-x-2">
                        <Shield className="h-4 w-4" />
                        <span>Safety Metrics</span>
                      </h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-purple-200">Engine Health:</span>
                          <span className={`font-semibold ${telemetryData.engineTemp > 450 ? 'text-red-400' : 'text-emerald-400'}`}>
                            {telemetryData.engineTemp > 450 ? 'CRITICAL' : 'OPTIMAL'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-purple-200">Cabin Safety:</span>
                          <span className={`font-semibold ${telemetryData.cabinPressure < 10 ? 'text-red-400' : 'text-emerald-400'}`}>
                            {telemetryData.cabinPressure < 10 ? 'EMERGENCY' : 'SAFE'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-purple-200">Fuel Status:</span>
                          <span className={`font-semibold ${telemetryData.fuelQuantity < 30 ? 'text-amber-400' : 'text-emerald-400'}`}>
                            {telemetryData.fuelQuantity < 30 ? 'LOW' : 'ADEQUATE'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-purple-200">Overall Status:</span>
                          <span className={`font-semibold ${analysis.riskLevel === 'CRITICAL' || analysis.riskLevel === 'HIGH' ? 'text-red-400' : 'text-emerald-400'}`}>
                            {analysis.riskLevel === 'CRITICAL' || analysis.riskLevel === 'HIGH' ? 'EMERGENCY' : 'OPERATIONAL'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AWS Integration Status */}
                  <div className="bg-gradient-to-r from-orange-600/20 to-orange-800/20 border border-orange-500/30 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">AWS</div>
                      <h5 className="text-orange-300 font-semibold">Cloud Integration Status</h5>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-emerald-400 font-semibold">✓ IoT Core</div>
                        <div className="text-orange-200">Connected</div>
                      </div>
                      <div className="text-center">
                        <div className="text-emerald-400 font-semibold">✓ Bedrock</div>
                        <div className="text-orange-200">Active</div>
                      </div>
                      <div className="text-center">
                        <div className="text-emerald-400 font-semibold">✓ SageMaker</div>
                        <div className="text-orange-200">Training</div>
                      </div>
                      <div className="text-center">
                        <div className="text-emerald-400 font-semibold">✓ Lambda</div>
                        <div className="text-orange-200">Processing</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="initial"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8"
                >
                  <Brain className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                  <p className="text-purple-200 text-lg">Initializing AWS Bedrock AI Analysis...</p>
                  <p className="text-purple-300 text-sm mt-2">Connecting to flight safety systems</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AWSBedrockPanel;