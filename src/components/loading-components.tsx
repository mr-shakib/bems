import React from 'react';
import { Upload, Cloud, CheckCircle, X } from 'lucide-react';

// Base Shimmer Component
interface ShimmerProps {
  className?: string;
  variant?: 'default' | 'rounded' | 'circular';
}

export const Shimmer: React.FC<ShimmerProps> = ({ 
  className = "", 
  variant = "default" 
}) => {
  const baseClasses = "bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 animate-shimmer";
  const variantClasses = {
    default: "rounded",
    rounded: "rounded-lg",
    circular: "rounded-full"
  };

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={{ backgroundSize: '200% 100%' }}
    />
  );
};

// Button Shimmer
export const ButtonShimmer: React.FC<{ className?: string }> = ({ className = "" }) => (
  <Shimmer 
    className={`h-10 w-24 ${className}`} 
    variant="rounded" 
  />
);

// Avatar Shimmer
export const AvatarShimmer: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };
  
  return <Shimmer className={sizeClasses[size]} variant="circular" />;
};

// Text Shimmer
export const TextShimmer: React.FC<{ 
  lines?: number; 
  className?: string;
  width?: 'full' | 'half' | 'quarter' | 'three-quarter';
}> = ({ 
  lines = 1, 
  className = "",
  width = 'full'
}) => {
  const widthClasses = {
    full: 'w-full',
    half: 'w-1/2',
    quarter: 'w-1/4',
    'three-quarter': 'w-3/4'
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <Shimmer 
          key={index}
          className={`h-4 ${index === lines - 1 && lines > 1 ? widthClasses.half : widthClasses[width]}`}
          variant="rounded"
        />
      ))}
    </div>
  );
};

// Card Shimmer
export const CardShimmer: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`p-4 border border-slate-200 rounded-lg space-y-3 ${className}`}>
    <div className="flex items-center space-x-3">
      <AvatarShimmer />
      <div className="flex-1">
        <TextShimmer width="three-quarter" />
        <div className="mt-1">
          <TextShimmer width="half" />
        </div>
      </div>
    </div>
    <TextShimmer lines={2} />
    <div className="flex space-x-2">
      <ButtonShimmer className="w-16" />
      <ButtonShimmer className="w-20" />
    </div>
  </div>
);

// Table Row Shimmer
export const TableRowShimmer: React.FC<{ columns?: number }> = ({ columns = 4 }) => (
  <tr>
    {Array.from({ length: columns }).map((_, index) => (
      <td key={index} className="px-4 py-3">
        <TextShimmer width={index === 0 ? 'three-quarter' : 'half'} />
      </td>
    ))}
  </tr>
);

// Form Field Shimmer
export const FormFieldShimmer: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`space-y-2 ${className}`}>
    <Shimmer className="h-4 w-20" variant="rounded" />
    <Shimmer className="h-10 w-full" variant="rounded" />
  </div>
);

// Loading Overlay with Shimmer
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
        return <div className="h-6 w-6" />;
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
          {/* Shimmer Icon Container */}
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 animate-shimmer flex items-center justify-center" 
                 style={{ backgroundSize: '200% 100%' }}>
              <div className={`${getColor()}`}>
                {getIcon()}
              </div>
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

// Floating Shimmer Loader
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

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-full">
      <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 animate-shimmer flex items-center justify-center`}
           style={{ backgroundSize: '200% 100%' }}>
        <div className="text-slate-600">
          {type === 'upload' && <Upload className="h-3 w-3" />}
          {type === 'delete' && <X className="h-3 w-3" />}
          {type === 'save' && <CheckCircle className="h-3 w-3" />}
        </div>
      </div>
    </div>
  );
};

// Pulse Shimmer Loader
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
        <div className="h-2 w-2 rounded-full bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 animate-shimmer" 
             style={{ backgroundSize: '200% 100%', animationDelay: '0ms' }} />
        <div className="h-2 w-2 rounded-full bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 animate-shimmer" 
             style={{ backgroundSize: '200% 100%', animationDelay: '150ms' }} />
        <div className="h-2 w-2 rounded-full bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 animate-shimmer" 
             style={{ backgroundSize: '200% 100%', animationDelay: '300ms' }} />
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
          {/* Success checkmark with shimmer effect */}
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-r from-green-200 via-green-300 to-green-200 animate-shimmer rounded-full flex items-center justify-center"
                 style={{ backgroundSize: '200% 100%' }}>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
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

// Top Loading Bar with Shimmer
interface TopLoadingBarProps {
  isVisible: boolean;
}

export const TopLoadingBar: React.FC<TopLoadingBarProps> = ({
  isVisible
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="h-0.5 bg-slate-200 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-slate-400 via-slate-600 to-slate-400 animate-shimmer"
          style={{
            width: '30%',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s ease-in-out infinite, loading-progress 1.5s ease-in-out infinite'
          }}
        />
      </div>
      <style jsx>{`
        @keyframes loading-progress {
          0% { 
            transform: translateX(-100%);
            width: 0%;
          }
          50% {
            width: 70%;
          }
          100% { 
            transform: translateX(100%);
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

// Modern Shimmer Loading Component
interface ModernLoadingProps {
  isVisible: boolean;
  message?: string;
}

export const ModernLoading: React.FC<ModernLoadingProps> = ({
  isVisible,
  message = "Loading..."
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex flex-col items-center space-y-4">
        {/* Shimmer loading indicator */}
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 animate-shimmer"
               style={{ backgroundSize: '200% 100%' }} />
        </div>
        
        {/* Simple text */}
        <p className="text-sm text-slate-600 font-medium">{message}</p>
      </div>
    </div>
  );
};

// Settings Shimmer Loading Component
interface SettingsLoadingProps {
  isVisible: boolean;
  message?: string;
}

export const SettingsLoading: React.FC<SettingsLoadingProps> = ({
  isVisible,
  message = "Loading..."
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex flex-col items-center space-y-4">
        {/* Shimmer loading indicator */}
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 animate-shimmer"
               style={{ backgroundSize: '200% 100%' }} />
        </div>
        
        {/* Simple text */}
        <p className="text-sm text-slate-600 font-medium">{message}</p>
      </div>
    </div>
  );
};

// Inline Shimmer Button (for buttons with loading states)
interface InlineShimmerButtonProps {
  isLoading: boolean;
  children: React.ReactNode;
  className?: string;
}

export const InlineShimmerButton: React.FC<InlineShimmerButtonProps> = ({
  isLoading,
  children,
  className = ""
}) => {
  if (isLoading) {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <div className="h-4 w-4 rounded-full bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 animate-shimmer mr-2"
             style={{ backgroundSize: '200% 100%' }} />
        <span className="opacity-75">{children}</span>
      </div>
    );
  }
  
  return <>{children}</>;
};

// Task/Project Grid Shimmer
export const GridShimmer: React.FC<{ 
  items?: number; 
  columns?: number;
  className?: string;
}> = ({ 
  items = 6, 
  columns = 3,
  className = ""
}) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4'
  };

  return (
    <div className={`grid ${gridCols[columns as keyof typeof gridCols]} gap-4 ${className}`}>
      {Array.from({ length: items }).map((_, index) => (
        <CardShimmer key={index} />
      ))}
    </div>
  );
};

// List Shimmer
export const ListShimmer: React.FC<{ 
  items?: number;
  className?: string;
}> = ({ 
  items = 5,
  className = ""
}) => (
  <div className={`space-y-3 ${className}`}>
    {Array.from({ length: items }).map((_, index) => (
      <div key={index} className="flex items-center space-x-3 p-3 border border-slate-200 rounded-lg">
        <AvatarShimmer />
        <div className="flex-1">
          <TextShimmer width="three-quarter" />
          <div className="mt-1">
            <TextShimmer width="half" />
          </div>
        </div>
        <ButtonShimmer className="w-16" />
      </div>
    ))}
  </div>
);