import React from 'react';

export default function BottomSheet({ open, onClose, children }) {
  return (
    <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`}>

      {/* Overlay */}
      <div 
        className={`absolute inset-0 bg-black/40 transition-opacity ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Sheet */}
      <div className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl transition-transform duration-300 ${
        open ? "translate-y-0" : "translate-y-full"
      }`}>
        
        {/* Handle */}
        <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto my-3" />

        {/* Contenido */}
        <div className="flex flex-col divide-y divide-gray-200 px-4 py-2">
            {children}
        </div>
      </div>
    </div>
  );
}