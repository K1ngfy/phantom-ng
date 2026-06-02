import React from 'react';
import { Artifact } from '../types';
import { NidsDetails } from './NidsDetails';
import { HidsDetails } from './HidsDetails';

interface ArtifactInlineDetailsProps {
  artifact: Artifact;
  onClose: () => void;
}

export const ArtifactInlineDetails: React.FC<ArtifactInlineDetailsProps> = ({ artifact, onClose }) => {
  const isNids = artifact.tags.includes('Nids') || artifact.cef['_event_type'] === 'nids_events';
  const isHids = artifact.tags.includes('Hids') || artifact.cef['_event_type'] === 'hids_events';

  const severityColors = {
    low: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    high: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
    critical: 'bg-red-500/20 text-red-400 border-red-500/50',
  };

  return (
    <div className="w-full bg-gray-900 rounded-xl border border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-700 bg-gray-800/50">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 pr-4">
            <h2 className="text-xl font-bold text-white mb-2 break-words">
              {artifact.name}
            </h2>
            <p className="text-base text-gray-400 line-clamp-2">
              {artifact.description}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-3 rounded-lg hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex items-center gap-4">
          <div className={`px-4 py-1.5 rounded-full border text-sm font-semibold uppercase ${severityColors[artifact.severity as keyof typeof severityColors] || severityColors.medium}`}>
            {artifact.severity || 'medium'}
          </div>
          <div className="text-sm text-gray-500">
            ID: {artifact.id}
          </div>
          <div className="text-sm text-gray-500">
            {artifact._pretty_create_time}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {isNids && <NidsDetails artifact={artifact} />}
        {isHids && <HidsDetails artifact={artifact} />}
        {!isNids && !isHids && (
            <div className="text-center text-gray-400 py-16">
              <p className="text-lg mb-2">Unsupported artifact type</p>
              <p className="text-sm">Tags: {artifact.tags.join(', ')}</p>
            </div>
          )}
      </div>
    </div>
  );
};
