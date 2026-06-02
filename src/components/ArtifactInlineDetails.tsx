import React, { useState } from 'react';
import { Artifact } from '../types';
import { NidsDetails } from './NidsDetails';
import { HidsDetails } from './HidsDetails';

interface ArtifactInlineDetailsProps {
  artifact: Artifact;
  onClose: () => void;
}

type TabType = 'visual' | 'raw';

export const ArtifactInlineDetails: React.FC<ArtifactInlineDetailsProps> = ({ artifact, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('visual');
  
  const isNids = artifact.tags.includes('Nids') || artifact.cef['_event_type'] === 'nids_events';
  const isHids = artifact.tags.includes('Hids') || artifact.cef['_event_type'] === 'hids_events';

  const severityColors = {
    low: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    high: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
    critical: 'bg-red-500/20 text-red-400 border-red-500/50',
  };

  const getRawEventJson = () => {
    const rawData = artifact.event?.original 
      ? artifact.event.original 
      : JSON.stringify({
          id: artifact.id,
          name: artifact.name,
          description: artifact.description,
          severity: artifact.severity,
          tags: artifact.tags,
          cef: artifact.cef,
          created_time: artifact._pretty_create_time
        }, null, 2);
    return rawData;
  };

  return (
    <div className="w-full bg-gray-900 rounded-xl border border-gray-700 overflow-hidden" style={{ fontSize: '16px' }}>
      {/* Header */}
      <div className="p-8 border-b border-gray-700 bg-gray-800/50">
        <div className="flex items-start justify-between mb-5">
          <div className="flex-1 pr-6">
            <h2 className="text-2xl font-bold text-white mb-3 break-words">
              {artifact.name}
            </h2>
            <p className="text-lg text-gray-400 line-clamp-2">
              {artifact.description}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors text-gray-300 hover:text-white text-base font-medium flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Back to Original
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className={`px-5 py-2 rounded-full border text-base font-semibold uppercase ${severityColors[artifact.severity as keyof typeof severityColors] || severityColors.medium}`}>
            {artifact.severity || 'medium'}
          </div>
          <div className="text-base text-gray-500">
            ID: {artifact.id}
          </div>
          <div className="text-base text-gray-500">
            {artifact._pretty_create_time}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-700">
        <button
          onClick={() => setActiveTab('visual')}
          className={`flex-1 px-8 py-5 text-lg font-semibold transition-colors ${
            activeTab === 'visual'
              ? 'bg-gray-800 text-white border-b-2 border-purple-500'
              : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
          }`}
        >
          Visual View
        </button>
        <button
          onClick={() => setActiveTab('raw')}
          className={`flex-1 px-8 py-5 text-lg font-semibold transition-colors ${
            activeTab === 'raw'
              ? 'bg-gray-800 text-white border-b-2 border-purple-500'
              : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
          }`}
        >
          Raw Event
        </button>
      </div>

      {/* Content */}
      <div className="p-8">
        {activeTab === 'visual' && (
          <>
            {isNids && <NidsDetails artifact={artifact} />}
            {isHids && <HidsDetails artifact={artifact} />}
            {!isNids && !isHids && (
              <div className="text-center text-gray-400 py-16">
                <p className="text-xl mb-2">Unsupported artifact type</p>
                <p className="text-base">Tags: {artifact.tags.join(', ')}</p>
              </div>
            )}
          </>
        )}
        
        {activeTab === 'raw' && (
          <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <div className="px-5 py-4 bg-gray-800/80 border-b border-gray-700 flex items-center justify-between">
              <span className="text-base font-medium text-gray-300">Raw Event JSON</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(getRawEventJson());
                }}
                className="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors text-base text-gray-300"
              >
                Copy
              </button>
            </div>
            <pre className="p-5 overflow-x-auto text-base text-gray-300 font-mono max-h-[600px] overflow-y-auto">
              {getRawEventJson()}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
