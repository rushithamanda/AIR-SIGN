import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Dashboard from './components/Dashboard';
import { ToggleLeft, ToggleRight, Plane, AlertTriangle, Shield, Zap } from 'lucide-react';

function App() {
  const [isAlertMode, setIsAlertMode] = useState(false);

  return (
    <div className="relative min-h-screen">
      {/* Flight Mode Toggle Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="fixed top-6 right-6 z-50"
      >
        <motion.button
          onClick={() => setIsAlertMode(!isAlertMode)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`relative flex items-center space-x-4 px-8 py-4 rounded-2xl font-bold transition-all duration-500 shadow-2xl backdrop-blur-xl border-2 overflow-hidden ${
            isAlertMode 
              ? 'bg-gradient-to-r from-red-600/30 to-red-800/30 border-red-500/50 text-red-200 hover:from-red-600/40 hover:to-red-800/40 shadow-red-500/30 animate-pulse' 
              : 'bg-gradient-to-r from-blue-600/30 to-slate-800/30 border-blue-500/50 text-blue-200 hover:from-blue-600/40 hover:to-slate-800/40 shadow-blue-500/30'
          }`}
        >
          {/* Animated Background Effect */}
          <motion.div
            animate={{
              x: ['-100%', '100%'],
              opacity: [0, 0.5, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className={`absolute inset-0 ${
              isAlertMode ? 'bg-gradient-to-r from-transparent via-red-400/20 to-transparent' 
                         : 'bg-gradient-to-r from-transparent via-blue-400/20 to-transparent'
            }`}
          />
          
          <AnimatePresence mode="wait">
            {isAlertMode ? (
              <motion.div
                key="alert"
                initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="flex items-center space-x-3 relative z-10"
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 0.5, 
                    repeat: Infinity 
                  }}
                >
                  <AlertTriangle className="h-6 w-6" />
                </motion.div>
                <ToggleRight className="h-6 w-6" />
                <Zap className="h-5 w-5" />
              </motion.div>
            ) : (
              <motion.div
                key="normal"
                initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="flex items-center space-x-3 relative z-10"
              >
                <motion.div
                  animate={{ 
                    y: [0, -2, 0],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity 
                  }}
                >
                  <Plane className="h-6 w-6" />
                </motion.div>
                <ToggleLeft className="h-6 w-6" />
                <Shield className="h-5 w-5" />
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="relative z-10">
            <div className="text-lg font-bold">
              {isAlertMode ? 'EMERGENCY MODE' : 'NORMAL FLIGHT'}
            </div>
            <div className="text-xs opacity-80">
              {isAlertMode ? 'Life-Saving Systems Active' : 'All Systems Normal'}
            </div>
          </div>
        </motion.button>
      </motion.div>

      {/* Dashboard */}
      <Dashboard isAlertMode={isAlertMode} />
    </div>
  );
}

export default App;