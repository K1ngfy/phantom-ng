import React, { useMemo } from 'react';
import { Artifact } from '../types';
import { CopyButton } from './CopyButton';

interface NidsDetailsProps {
  artifact: Artifact;
}

export const NidsDetails: React.FC<NidsDetailsProps> = ({ artifact }) => {
  const originalEvent = useMemo(() => {
    try {
      return artifact.cef['event.original'] ? JSON.parse(artifact.cef['event.original']) : null;
    } catch (e) {
      return null;
    }
  }, [artifact]);

  return (
    <div className="space-y-6">
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Network Flow</h3>
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 bg-gray-900/50 border border-gray-700 rounded-lg p-4">
            <div className="text-xs text-gray-500 mb-1">Source</div>
            <div className="flex items-center gap-2">
              <span className="text-blue-400 font-mono text-sm">
                {artifact.cef['source.ip']}:{artifact.cef['source.port']}
              </span>
              {artifact.cef['source.ip'] && <CopyButton text={`${artifact.cef['source.ip']}:${artifact.cef['source.port']}`} />}
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            <svg className="w-6 h-6 text-primary animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            <span className="text-xs text-gray-500 mt-1">{artifact.cef['network.protocol'] || 'TCP'}</span>
          </div>
          
          <div className="flex-1 bg-gray-900/50 border border-gray-700 rounded-lg p-4">
            <div className="text-xs text-gray-500 mb-1">Destination</div>
            <div className="flex items-center gap-2">
              <span className="text-red-400 font-mono text-sm">
                {artifact.cef['destination.ip']}:{artifact.cef['destination.port']}
              </span>
              {artifact.cef['destination.ip'] && <CopyButton text={`${artifact.cef['destination.ip']}:${artifact.cef['destination.port']}`} />}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
          <div className="text-xs text-gray-500 mb-2">HTTP URL</div>
          <div className="flex items-center gap-2">
            <span className="text-green-400 font-mono text-sm break-all flex-1">
              {artifact.cef['http.url']}
            </span>
            {artifact.cef['http.url'] && <CopyButton text={artifact.cef['http.url']} />}
          </div>
        </div>
        
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
          <div className="text-xs text-gray-500 mb-2">HTTP Domain</div>
          <div className="flex items-center gap-2">
            <span className="text-yellow-400 font-mono text-sm">
              {artifact.cef['http.domain']}
            </span>
            {artifact.cef['http.domain'] && <CopyButton text={artifact.cef['http.domain']} />}
          </div>
        </div>
        
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
          <div className="text-xs text-gray-500 mb-2">HTTP Method</div>
          <span className="text-purple-400 font-semibold text-sm">
            {artifact.cef['http.request.method']}
          </span>
        </div>
        
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
          <div className="text-xs text-gray-500 mb-2">Status Code</div>
          <span className="text-cyan-400 font-semibold text-sm">
            {artifact.cef['http.response.status_code']}
          </span>
        </div>
      </div>

      {originalEvent && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
          <details className="group">
            <summary className="flex items-center justify-between p-4 cursor-pointer select-none">
              <span className="text-sm font-semibold text-gray-400">Original Event (JSON)</span>
              <svg className="w-5 h-5 text-gray-400 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="p-4 border-t border-gray-700 bg-gray-900/50">
              <pre className="text-xs text-gray-300 overflow-x-auto whitespace-pre-wrap">
                {JSON.stringify(originalEvent, null, 2)}
              </pre>
            </div>
          </details>
        </div>
      )}
    </div>
  );
};
