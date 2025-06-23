import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Cloud, Database, Cpu, Zap, Shield, 
  CheckCircle, AlertCircle, Clock, Activity
} from 'lucide-react';

interface AWSService {
  name: string;
  status: 'connected' | 'connecting' | 'error' | 'offline';
  icon: React.ComponentType<any>;
  description: string;
  lastUpdate: string;
  metrics?: {
    requests: number;
    latency: number;
    errors: number;
  };
}

const AWSIntegrationStatus: React.FC = () => {
  const [services, setServices] = useState<AWSService[]>([
    {
      name: 'AWS Bedrock',
      status: 'connected',
      icon: Cloud,
      description: 'AI-powered flight safety analysis',
      lastUpdate: new Date().toLocaleTimeString(),
      metrics: { requests: 1247, latency: 1.2, errors: 0 }
    },
    {
      name: 'AWS IoT Core',
      status: 'connected',
      icon: Activity,
      description: 'Real-time telemetry streaming',
      lastUpdate: new Date().toLocaleTimeString(),
      metrics: { requests: 15420, latency: 0.3, errors: 2 }
    },
    {
      name: 'AWS SageMaker',
      status: 'connected',
      icon: Cpu,
      description: 'Predictive maintenance ML models',
      lastUpdate: new Date().toLocaleTimeString(),
      metrics: { requests: 342, latency: 2.1, errors: 0 }
    },
    {
      name: 'AWS Lambda',
      status: 'connected',
      icon: Zap,
      description: 'Edge computing for emergency response',
      lastUpdate: new Date().toLocaleTimeString(),
      metrics: { requests: 89, latency: 0.8, errors: 1 }
    },
    {
      name: 'AWS SNS',
      status: 'connected',
      icon: Shield,
      description: 'Critical alert notifications',
      lastUpdate: new Date().toLocaleTimeString(),
      metrics: { requests: 23, latency: 0.5, errors: 0 }
    }
  ]);

  useEffect(() => {
    // Simulate real-time status updates
    const interval = setInterval(() => {
      setServices(prev => prev.map(service => ({
        ...service,
        lastUpdate: new Date().toLocaleTimeString(),
        metrics: service.metrics ? {
          ...service.metrics,
          requests: service.metrics.requests + Math.floor(Math.random() * 10),
          latency: Math.max(0.1, service.metrics.latency + (Math.random() - 0.5) * 0.2)
        } : undefined
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-emerald-400';
      case 'connecting': return 'text-amber-400';
      case 'error': return 'text-red-400';
      case 'offline': return 'text-slate-400';
      default: return 'text-slate-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return CheckCircle;
      case 'connecting': return Clock;
      case 'error': return AlertCircle;
      case 'offline': return AlertCircle;
      default: return AlertCircle;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-slate-900/40 to-blue-900/40 backdrop-blur-xl border border-slate-600/30 rounded-2xl p-6 shadow-2xl"
    >
      <div className="flex items-center space-x-3 mb-6">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <Database className="h-6 w-6 text-orange-400" />
        </motion.div>
        <div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
            AWS Cloud Integration Status
          </h3>
          <p className="text-slate-300 text-sm">Real-time monitoring of AWS services</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service, index) => {
          const StatusIcon = getStatusIcon(service.status);
          const ServiceIcon = service.icon;
          
          return (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-800/30 border border-slate-600/30 rounded-xl p-4 hover:border-orange-500/50 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <ServiceIcon className="h-6 w-6 text-orange-400" />
                  <div>
                    <h4 className="text-white font-semibold text-sm">{service.name}</h4>
                    <p className="text-slate-400 text-xs">{service.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <StatusIcon className={`h-4 w-4 ${getStatusColor(service.status)}`} />
                  <span className={`text-xs font-semibold ${getStatusColor(service.status)}`}>
                    {service.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {service.metrics && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Requests:</span>
                    <span className="text-white font-semibold">{service.metrics.requests.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Latency:</span>
                    <span className="text-white font-semibold">{service.metrics.latency.toFixed(1)}s</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Errors:</span>
                    <span className={`font-semibold ${service.metrics.errors > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {service.metrics.errors}
                    </span>
                  </div>
                </div>
              )}

              <div className="mt-3 pt-3 border-t border-slate-600/30">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Last Update:</span>
                  <span className="text-slate-300">{service.lastUpdate}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* AWS Architecture Overview */}
      <div className="mt-6 pt-6 border-t border-slate-600/30">
        <h4 className="text-lg font-semibold text-slate-200 mb-4">AWS Architecture Flow</h4>
        <div className="bg-slate-800/20 rounded-lg p-4">
          <div className="text-sm text-slate-300 space-y-2">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
              <span>Aircraft Sensors → AWS IoT Core → Real-time Data Stream</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
              <span>Telemetry Data → AWS Bedrock → AI Safety Analysis</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              <span>Historical Data → AWS SageMaker → Predictive Maintenance</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
              <span>Emergency Scenarios → AWS Lambda → Instant Response</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-red-400 rounded-full"></span>
              <span>Critical Alerts → AWS SNS → Ground Control Notifications</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AWSIntegrationStatus;