import React from 'react';

interface LoaderProps {
  show: boolean;
  text?: string;
  backdropBlur?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ 
  show, 
  text = 'Cargando...', 
  backdropBlur = true 
}) => {
  if (!show) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${backdropBlur ? 'backdrop-blur-sm' : 'bg-black bg-opacity-50'}`}>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl flex flex-col items-center">
        {/* Spinner animado */}
        <div className="relative w-12 h-12 mb-4">
          <div className="absolute inset-0 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 border-4 border-t-transparent border-r-transparent border-b-blue-300 border-l-transparent rounded-full animate-spin-reverse"></div>
        </div>
        
        {/* Texto */}
        <p className="text-gray-700 dark:text-gray-300 font-medium">{text}</p>
        
        {/* Barra de progreso opcional */}
        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-3">
          <div className="bg-blue-600 h-1.5 rounded-full animate-pulse" style={{ width: '70%' }}></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;