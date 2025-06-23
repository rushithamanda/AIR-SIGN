import React from 'react';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, TrendingDown, Clock, Target, AlertCircle } from 'lucide-react';
import { PredictiveAnalysis } from '../types';
import AnimatedCounter from './AnimatedCounter';

interface PredictiveInsightsProps {
  analysis: PredictiveAnalysis;
}

const PredictiveInsights: React.FC<PredictiveInsightsProps> = ({ analysis }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 shadow-xl"
    >
      <div className="flex items-center space-x-3 mb-6">
        <Brain className="h-6 w-6 text-teal-400" />
        <h3 className="text-lg font-semibold text-white">AI Predictive Analysis</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="text-center">
          <div className={`text-3xl font-bold mb-2 ${
            analysis.riskScore > 70 ? 'text-red-400' :
            analysis.riskScore > 30 ? 'text-yellow-400' :
            'text-green-400'
          }`}>
            <AnimatedCounter value={analysis.riskScore} suffix="%" />
          </div>
          <div className="text-sm text-slate-400">Risk Score</div>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-teal-400 mb-2">
            <AnimatedCounter value={analysis.confidence} decimals={1} suffix="%" />
          </div>
          <div className="text-sm text-slate-400">AI Confidence</div>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-400 mb-2">
            <AnimatedCounter 
              value={analysis.timeToFailure || analysis.maintenanceWindow} 
              decimals={1} 
              suffix="h" 
            />
          </div>
          <div className="text-sm text-slate-400">
            {analysis.timeToFailure ? 'Time to Failure' : 'Maintenance Window'}
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-400 mb-2">
            {analysis.anomalies.length}
          </div>
          <div className="text-sm text-slate-400">Active Anomalies</div>
        </div>
      </div>
      
      {analysis.anomalies.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-red-300 mb-3 flex items-center space-x-2">
            <AlertCircle className="h-4 w-4" />
            <span>Detected Anomalies</span>
          </h4>
          <div className="space-y-2">
            {analysis.anomalies.map((anomaly, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 text-red-200 text-sm"
              >
                {anomaly}
              </motion.div>
            ))}
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {analysis.trends.improving.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-green-300 mb-3 flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Improving Trends</span>
            </h4>
            <div className="space-y-2">
              {analysis.trends.improving.map((trend, index) => (
                <div key={index} className="text-green-200 text-sm bg-green-900/20 rounded-lg p-2">
                  {trend}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {analysis.trends.degrading.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-orange-300 mb-3 flex items-center space-x-2">
              <TrendingDown className="h-4 w-4" />
              <span>Degrading Trends</span>
            </h4>
            <div className="space-y-2">
              {analysis.trends.degrading.map((trend, index) => (
                <div key={index} className="text-orange-200 text-sm bg-orange-900/20 rounded-lg p-2">
                  {trend}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PredictiveInsights;