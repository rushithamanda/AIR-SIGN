import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cloud, Database, Cpu, Zap, Shield, Bell,
  CheckCircle, AlertCircle, Clock, Activity,
  Brain, Radio, Settings, TrendingUp, Wifi
} from 'lucide-react';
import { awsIntegration, AWSFlightTelemetry } from '../services/awsIntegration';

interface AWSIntegrationDashboardProps {
  telemetryData: any;
  isEmergencyMode: boolean;
}

const AWSIntegrationDashboard: React.FC<AWSIntegrationDashboardProps> = ({ 
  telemetryData, 
  isEmergencyMode 
}) => {
  const [awsStatus, setAwsStatus] = useState<any>(null);
  const [processing, setProcessing] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState<any>(null);
  const [connectionStatus, setConnectionStatus] = useState<Record<string, boolean>>({
    bedrock: false,
    iotCore: false,
    sagemaker: false,
    lambda: false,
    sns: false
  });

  useEffect(() => {
    const processAWSData = async () => {
      if (!telemetryData) return;

      setProcessing(true);
      
      try {
        // Convert telemetry to AWS format
        const awsTelemetry: AWSFlightTelemetry = {
          flightId: 'UA-243',
          timestamp: new Date().toISOString(),
          engineTemp: telemetryData.engineTemp,
          cabinPressure: telemetryData.cabinPressure,
          vibrationLevel: telemetryData.vibrationLevel,
          oilPressure: telemetryData.oilPressure,
          fuelQuantity: telemetryData.fuelQuantity,
          altitude: telemetryData.altitude,
          airspeed: telemetryData.airspeed,
          livesOnBoard: 186
        };

        // Process through AWS services
        const result = await awsIntegration.processFlightData(awsTelemetry);
        setLastAnalysis(result);

        // Update connection status
        const servicesStatus = awsIntegration.getServicesStatus();
        setConnectionStatus({
          bedrock: servicesStatus.bedrock.connected,
          iotCore: servicesStatus.iotCore.connected,
          sagemaker: servicesStatus.sagemaker.connected,
          lambda: servicesStatus.lambda.connected,
          sns: servicesStatus.sns.connected
        });

        setAwsStatus(servicesStatus);

      } catch (error) {
        console.error('AWS processing error:', error);
        // Set fallback status
        setConnectionStatus({
          bedrock: false,
          iotCore: false,
          sagemaker: false,
          lambda: false,
          sns: false
        });
      } finally {
        setProcessing(false);
      }
    };

    processAWSData();
    
    // Process every 10 seconds
    const interval = setInterval(processAWSData, 10000);
    return () => clearInterval(interval);
  }, [telemetryData]);

  const awsServices = [
    {
      name: 'AWS Bedrock',
      icon: Brain,
      description: 'AI-powered flight safety analysis',
      status: connectionStatus.bedrock,
      color: 'purple',
      metrics: lastAnalysis?.analysis ? {
        riskLevel: lastAnalysis.analysis.riskLevel,
        confidence: lastAnalysis.analysis.confidence,
        livesProtected: lastAnalysis.analysis.livesAtRisk
      } : null
    },
    {
      name: 'AWS IoT Core',
      icon: Radio,
      description: 'Real-time telemetry streaming',
      status: connectionStatus.iotCore,
      color: 'blue',
      metrics: {
        messagesPublished: 1247,
        latency: '0.3s',
        qos: 1
      }
    },
    {
      name: 'AWS SageMaker',
      icon: TrendingUp,
      description: 'Predictive maintenance ML',
      status: connectionStatus.sagemaker,
      color: 'green',
      metrics: lastAnalysis?.maintenance ? {
        failureProbability: `${lastAnalysis.maintenance.failureProbability.toFixed(1)}%`,
        timeToMaintenance: `${lastAnalysis.maintenance.timeToMaintenance}h`,
        confidence: `${lastAnalysis.maintenance.confidence.toFixed(1)}%`
      } : null
    },
    {
      name: 'AWS Lambda',
      icon: Zap,
      description: 'Edge computing emergency response',
      status: connectionStatus.lambda,
      color: 'orange',
      metrics: {
        invocations: 89,
        duration: '1.2s',
        errors: 0
      }
    },
    {
      name: 'AWS SNS',
      icon: Bell,
      description: 'Critical alert notifications',
      status: connectionStatus.sns,
      color: 'red',
      metrics: {
        alertsSent: isEmergencyMode ? 3 : 0,
        subscribers: 12,
        deliveryRate: '100%'
      }
    }
  ];

  const getStatusColor = (status: boolean) => {
    return status ? 'text-emerald-400' : 'text-red-400';
  };

  const getStatusIcon = (status: boolean) => {
    return status ? CheckCircle : AlertCircle;
  };

  const getServiceColor = (color: string) => {
    const colors = {
      purple: 'from-purple-600 to-purple-800',
      blue: 'from-blue-600 to-blue-800',
      green: 'from-emerald-600 to-emerald-800',
      orange: 'from-orange-600 to-orange-800',
      red: 'from-red-600 to-red-800'
    };
    return colors[color as keyof typeof colors] || 'from-slate-600 to-slate-800';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-slate-900/40 to-blue-900/40 backdrop-blur-xl border border-slate-600/30 rounded-2xl p-6 shadow-2xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <motion.div
            animate={{ 
              rotate: processing ? [0, 360] : 0,
              scale: processing ? [1, 1.1, 1] : 1
            }}
            transition={{ 
              rotate: { duration: 2, repeat: processing ? Infinity : 0, ease: "linear" },
              scale: { duration: 1, repeat: processing ? Infinity : 0 }
            }}
            className="relative"
          >
            <Cloud className="h-8 w-8 text-orange-400" />
            {processing && (
              <motion.div
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="absolute inset-0 bg-orange-400 rounded-full blur-lg"
              />
            )}
          </motion.div>
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              AWS Cloud Integration
            </h3>
            <p className="text-slate-300 text-sm">Real-time AWS services monitoring & processing</p>
          </div>
        </div>

        {/* Overall Status */}
        <div className="text-right">
          <div className={`text-lg font-bold ${
            Object.values(connectionStatus).every(Boolean) ? 'text-emerald-400' : 'text-amber-400'
          }`}>
            {Object.values(connectionStatus).filter(Boolean).length}/5 Services
          </div>
          <div className="text-slate-400 text-sm">Connected</div>
        </div>
      </div>

      {/* Processing Indicator */}
      <AnimatePresence>
        {processing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 bg-orange-900/20 border border-orange-500/30 rounded-lg p-4"
          >
            <div className="flex items-center space-x-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Settings className="h-5 w-5 text-orange-400" />
              </motion.div>
              <div>
                <div className="text-orange-300 font-semibold">Processing flight data through AWS services...</div>
                <div className="text-orange-400 text-sm">Bedrock AI analysis • IoT telemetry • SageMaker predictions</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AWS Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {awsServices.map((service, index) => {
          const StatusIcon = getStatusIcon(service.status);
          const ServiceIcon = service.icon;
          
          return (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gradient-to-br ${getServiceColor(service.color)}/20 border border-${service.color}-500/30 rounded-xl p-4 hover:border-${service.color}-400/50 transition-all duration-300`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <ServiceIcon className={`h-6 w-6 text-${service.color}-400`} />
                  <div>
                    <h4 className="text-white font-semibold text-sm">{service.name}</h4>
                    <p className="text-slate-400 text-xs">{service.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <StatusIcon className={`h-4 w-4 ${getStatusColor(service.status)}`} />
                  <span className={`text-xs font-semibold ${getStatusColor(service.status)}`}>
                    {service.status ? 'ACTIVE' : 'OFFLINE'}
                  </span>
                </div>
              </div>

              {service.metrics && (
                <div className="space-y-2">
                  {Object.entries(service.metrics).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-xs">
                      <span className="text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                      <span className="text-white font-semibold">{value}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Latest Analysis Results */}
      {lastAnalysis && (
        <div className="border-t border-slate-600/30 pt-6">
          <h4 className="text-lg font-semibold text-slate-200 mb-4">Latest AWS Analysis Results</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Bedrock Analysis */}
            {lastAnalysis.analysis && (
              <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                <h5 className="text-purple-300 font-semibold mb-3 flex items-center space-x-2">
                  <Brain className="h-4 w-4" />
                  <span>AWS Bedrock Analysis</span>
                </h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-purple-200">Risk Level:</span>
                    <span className={`font-bold ${
                      lastAnalysis.analysis.riskLevel === 'CRITICAL' ? 'text-red-400' :
                      lastAnalysis.analysis.riskLevel === 'HIGH' ? 'text-orange-400' :
                      lastAnalysis.analysis.riskLevel === 'MEDIUM' ? 'text-amber-400' :
                      'text-emerald-400'
                    }`}>
                      {lastAnalysis.analysis.riskLevel}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-200">Confidence:</span>
                    <span className="text-white font-semibold">{lastAnalysis.analysis.confidence}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-200">Lives Protected:</span>
                    <span className="text-white font-semibold">{lastAnalysis.analysis.livesAtRisk}</span>
                  </div>
                </div>
              </div>
            )}

            {/* SageMaker Predictions */}
            {lastAnalysis.maintenance && (
              <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-lg p-4">
                <h5 className="text-emerald-300 font-semibold mb-3 flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>AWS SageMaker Predictions</span>
                </h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-emerald-200">Failure Risk:</span>
                    <span className="text-white font-semibold">
                      {lastAnalysis.maintenance.failureProbability.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-emerald-200">Maintenance Due:</span>
                    <span className="text-white font-semibold">
                      {lastAnalysis.maintenance.timeToMaintenance}h
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-emerald-200">ML Confidence:</span>
                    <span className="text-white font-semibold">
                      {lastAnalysis.maintenance.confidence.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AWS Architecture Flow */}
      <div className="mt-6 pt-6 border-t border-slate-600/30">
        <h4 className="text-lg font-semibold text-slate-200 mb-4">AWS Data Flow Architecture</h4>
        <div className="bg-slate-800/20 rounded-lg p-4">
          <div className="text-sm text-slate-300 space-y-2">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
              <span>Aircraft Sensors → AWS IoT Core → Real-time Telemetry Stream</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
              <span>Flight Data → AWS Bedrock → Claude-3-Haiku AI Analysis</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
              <span>Historical Patterns → AWS SageMaker → Predictive Maintenance ML</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
              <span>Emergency Scenarios → AWS Lambda → Instant Edge Response</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-red-400 rounded-full"></span>
              <span>Critical Alerts → AWS SNS → Ground Control Notifications</span>
            </div>
          </div>
        </div>
      </div>

      {/* Connection Instructions */}
      <div className="mt-6 pt-6 border-t border-slate-600/30">
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
          <h5 className="text-blue-300 font-semibold mb-2 flex items-center space-x-2">
            <Wifi className="h-4 w-4" />
            <span>AWS Integration Status</span>
          </h5>
          <div className="text-sm text-blue-200">
            {Object.values(connectionStatus).every(Boolean) ? (
              <span className="text-emerald-400">✅ All AWS services connected and operational</span>
            ) : (
              <span className="text-amber-400">⚠️ Add AWS credentials to enable real-time integration</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AWSIntegrationDashboard;