import React from 'react';

const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh] w-full">
      <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(255,255,255,0.3)]"></div>
    </div>
  );
};

export default Loader;
