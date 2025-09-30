import React from 'react';
import { Loader2, Upload, Cloud, CheckCircle, X } from 'lucide-react';

interface LoadingOverlayProps {
  isVisible: boolean;
  type: 'upload' | 'delete' | 'save';
  progress?: number;
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible,
  type,
  progress = 0,
  message
}) => {
  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'upload':
        return <Upload className="h-6 w-6" />;
      case 'delete':
        return <X className="h-6 w-6" />;
      case 'save':
        return <CheckCircle className="h-6 w-6" />;
      default:
        return <Loader2 className="h-6 w-6" />;
    }
  };

  const getColor = () => {
    switch (type) {
      case 'upload':
        return 'text-blue-600';
      case 'delete':
        return 'text-red-600';
      case 'save':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'upload':
        return 'bg-blue-50 border-blue-200';
      case 'delete':
        return 'bg-red-50 border-red-200';
      case 'save':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className={`${getBgColor()} border-2 rounded-2xl p-8 max-w-sm mx-4 shadow-2xl`}>
        <div className="flex flex-col items-center space-y-6">
          {/* Animated Icon */}
          <div className="relative">
            {/* Outer spinning ring */}
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-current animate-spin opacity-20" 
                 style={{ width: '80px', height: '80px' }} />
            
            {/* Inner pulsing circle */}
            <div className={`flex items-center justify-center w-20 h-20 rounded-full ${getColor()} bg-white shadow-lg animate-pulse`}>
              {getIcon()}
            </div>
          </div>

          {/* Progress Bar (for uploads) */}
          {type === 'upload' && progress > 0 && (
            <div className="w-full">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Uploading...</span>
                <span className="text-gray-600">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Message */}
          <div className="text-center">
            <h3 className={`font-semibold ${getColor()} mb-1`}>
              {type === 'upload' && 'Uploading Image'}
              {type === 'delete' && 'Deleting Image'}
              {type === 'save' && 'Saving Changes'}
            </h3>
            {message && (
              <p className="text-sm text-gray-600">{message}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface FloatingLoaderProps {
  isVisible: boolean;
  type: 'upload' | 'delete' | 'save';
  size?: 'sm' | 'md' | 'lg';
}

export const FloatingLoader: React.FC<FloatingLoaderProps> = ({
  isVisible,
  type,
  size = 'md'
}) => {
  if (!isVisible) return null;

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  const getIcon = () => {
    switch (type) {
      case 'upload':
        return (
          <div className="relative">
            <Cloud className={`${sizeClasses[size]} text-blue-600 animate-bounce`} />
            <div className="absolute -top-1 -right-1 h-2 w-2 bg-blue-500 rounded-full animate-ping" />
          </div>
        );
      case 'delete':
        return (
          <div className="relative">
            <div className={`${sizeClasses[size]} bg-red-600 rounded-full animate-pulse flex items-center justify-center`}>
              <X className="h-3 w-3 text-white" />
            </div>
          </div>
        );
      case 'save':
        return (
          <div className="relative">
            <div className={`${sizeClasses[size]} bg-green-600 rounded-full animate-pulse flex items-center justify-center`}>
              <CheckCircle className="h-3 w-3 text-white" />
            </div>
          </div>
        );
      default:
        return <Loader2 className={`${sizeClasses[size]} animate-spin text-gray-600`} />;
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-full">
      {getIcon()}
    </div>
  );
};

interface PulseLoaderProps {
  isVisible: boolean;
  text?: string;
  className?: string;
}

export const PulseLoader: React.FC<PulseLoaderProps> = ({
  isVisible,
  text = "Loading...",
  className = ""
}) => {
  if (!isVisible) return null;

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="flex space-x-1">
        <div className="h-2 w-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
        <div className="h-2 w-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
        <div className="h-2 w-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
      </div>
      <span className="text-sm text-gray-600">{text}</span>
    </div>
  );
};

// Success animation component
interface SuccessAnimationProps {
  isVisible: boolean;
  message?: string;
  onComplete?: () => void;
}

export const SuccessAnimation: React.FC<SuccessAnimationProps> = ({
  isVisible,
  message = "Success!",
  onComplete
}) => {
  React.useEffect(() => {
    if (isVisible && onComplete) {
      const timer = setTimeout(onComplete, 2000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-sm mx-4 shadow-2xl">
        <div className="flex flex-col items-center space-y-4">
          {/* Success checkmark with animation */}
          <div className="relative">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600 animate-bounce" />
            </div>
            <div className="absolute inset-0 border-4 border-green-500 rounded-full animate-ping opacity-20" />
          </div>
          
          <div className="text-center">
            <h3 className="font-semibold text-green-600 mb-1">{message}</h3>
            <p className="text-sm text-gray-600">Changes saved successfully</p>
          </div>
        </div>
      </div>
    </div>
  );
};