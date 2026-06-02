import React from 'react';
import { useArtifactStore } from '../store';
import { NidsDetails } from './NidsDetails';
import { HidsDetails } from './HidsDetails';

export const ArtifactDetailsDrawer: React.FC = () => {
  const { isDrawerOpen, selectedArtifact, closeDrawer } = useArtifactStore();

  if (!isDrawerOpen || !selectedArtifact) return null;

  const isNids = selectedArtifact.tags.includes('Nids') || selectedArtifact.cef['_event_type'] === 'nids_events';
  const isHids = selectedArtifact.tags.includes('Hids') || selectedArtifact.cef['_event_type'] === 'hids_events';

  const severityColors = {
    low: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    high: 'bg-red-500/20 text-red-400 border-red-500/50',
    critical: 'bg-red-600/20 text-red-500 border-red-600/50',
  };

  return (
    <div className="fixed inset-0 z-[9999] flex justify-end">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={closeDrawer}
      />
      
      <div className="relative w-[600px] max-w-full h-full bg-gray-900 border-l border-gray-700 shadow-2xl shadow-glow flex flex-col animate-slide-in-right">
        <div className="p-6 border-b border-gray-700 bg-gray-800/50">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 pr-4">
              <h2 className="text-lg font-bold text-white mb-2 break-words">
                {selectedArtifact.name}
              </h2>
              <p className="text-sm text-gray-400 line-clamp-2">
                {selectedArtifact.description}
              </p>
            </div>
            <button
              onClick={closeDrawer}
              className="p-2 rounded-lg hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1 rounded-full border text-xs font-semibold uppercase ${severityColors[selectedArtifact.severity as keyof typeof severityColors] || severityColors.medium}`}>
              {selectedArtifact.severity || 'medium'}
            </div>
            <div className="text-xs text-gray-500">
              ID: {selectedArtifact.id}
            </div>
            <div className="text-xs text-gray-500">
              {selectedArtifact._pretty_create_time}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {isNids && <NidsDetails artifact={selectedArtifact} />}
          {isHids && <HidsDetails artifact={selectedArtifact} />}
          {!isNids && !isHids && (
            <div className="text-center text-gray-400 py-12">
              <p className="mb-2">Unsupported artifact type</p>
              <p className="text-xs">Tags: {selectedArtifact.tags.join(', ')}</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};
