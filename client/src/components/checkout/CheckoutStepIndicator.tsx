import React from 'react';
import { useCheckout, CheckoutStep } from '../../contexts/CheckoutContext';
import { cn } from '../../lib/utils';

interface CheckoutStepIndicatorProps {
  className?: string;
}

const CheckoutStepIndicator: React.FC<CheckoutStepIndicatorProps> = ({ className }) => {
  const { currentStep, getSteps } = useCheckout();
  const steps = getSteps();
  
  // Find the current step index
  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  
  return (
    <div className={cn("w-full", className)}>
      {/* Progress bar */}
      <div className="relative w-full h-2 bg-gray-200 rounded-full mb-6">
        <div 
          className="absolute top-0 left-0 h-2 bg-primary rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${steps[currentStepIndex].progress}%` }}
        />
      </div>
      
      {/* Step indicators */}
      <div className="flex justify-between items-center">
        {steps.map((step, index) => {
          const isActive = index === currentStepIndex;
          const isCompleted = index < currentStepIndex;
          
          return (
            <div key={step.id} className="flex flex-col items-center">
              {/* Step circle */}
              <div 
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-200",
                  isActive && "border-primary text-primary",
                  isCompleted && "border-primary bg-primary text-white",
                  !isActive && !isCompleted && "border-gray-300 text-gray-400"
                )}
              >
                {isCompleted ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.icon
                )}
              </div>
              
              {/* Step label */}
              <span 
                className={cn(
                  "text-sm mt-2 font-medium",
                  isActive && "text-primary",
                  isCompleted && "text-primary",
                  !isActive && !isCompleted && "text-gray-400"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
      
      {/* Mobile step indicator (visible on small screens) */}
      <div className="md:hidden mt-4 text-center">
        <p className="text-sm font-medium text-gray-700">
          Step {currentStepIndex + 1} of {steps.length}: {steps[currentStepIndex].label}
        </p>
      </div>
    </div>
  );
};

export default CheckoutStepIndicator; 
