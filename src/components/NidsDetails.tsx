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

  const severityBadge = useMemo(() => {
    const colors = {
      low: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
      medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
      high: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
      critical: 'bg-red-500/20 text-red-400 border-red-500/50',
    };
    return colors[artifact.severity as keyof typeof colors] || colors.medium;
  }, [artifact.severity]);

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-800/70 border border-gray-700 rounded-xl p-5">
          <div className="text-sm text-gray-500 mb-2">Protocol</div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-sm font-semibold rounded">
              {artifact.cef['network.protocol'] || 'HTTP'}
            </span>
            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm font-semibold rounded">
              {artifact.cef['network.transport'] || 'TCP'}
            </span>
          </div>
        </div>
        <div className="bg-gray-800/70 border border-gray-700 rounded-xl p-5">
          <div className="text-sm text-gray-500 mb-2">Event ID</div>
          <span className="text-white font-mono text-lg">{artifact.cef['event.id']}</span>
        </div>
        <div className="bg-gray-800/70 border border-gray-700 rounded-xl p-5">
          <div className="text-sm text-gray-500 mb-2">Severity</div>
          <span className={`px-4 py-1.5 rounded-full border text-sm font-semibold uppercase ${severityBadge}`}>
            {artifact.severity}
          </span>
        </div>
      </div>

      {/* Network Flow */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
        <h3 className="text-base font-semibold text-gray-400 uppercase tracking-wider mb-6">Network Flow</h3>
        <div className="flex items-center justify-between gap-4">
          {/* Source */}
          <div className="flex-1 bg-gray-900/70 border border-gray-700 rounded-xl p-5">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <div className="text-sm text-gray-500">Source</div>
                <div className="text-white font-bold text-lg">{artifact.cef['source.ip']}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-gray-800/50 rounded-lg p-3">
                <span className="text-gray-500">Port:</span>
                <span className="text-blue-400 ml-2 font-mono text-base">{artifact.cef['source.port']}</span>
              </div>
              {artifact.cef['source.nat.ip'] && (
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <span className="text-gray-500">NAT:</span>
                  <span className="text-blue-400 ml-2 font-mono text-base">{artifact.cef['source.nat.ip']}</span>
                </div>
              )}
            </div>
          </div>

          {/* Arrow & Method */}
          <div className="flex flex-col items-center">
            <div className="bg-gray-700 rounded-full px-5 py-2 mb-3">
              <span className="text-green-400 font-bold text-lg">{artifact.cef['http.request.method'] || 'GET'}</span>
            </div>
            <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg px-4 py-2 mt-3">
              <span className="text-red-400 text-sm font-bold">XSS Payload</span>
            </div>
          </div>

          {/* Destination */}
          <div className="flex-1 bg-gray-900/70 border border-gray-700 rounded-xl p-5">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-xl bg-red-500/20 flex items-center justify-center">
                <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <div className="text-sm text-gray-500">Destination</div>
                <div className="text-white font-bold text-lg">{artifact.cef['destination.ip']}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-gray-800/50 rounded-lg p-3">
                <span className="text-gray-500">Port:</span>
                <span className="text-red-400 ml-2 font-mono text-base">{artifact.cef['destination.port']}</span>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <span className="text-gray-500">Service:</span>
                <span className="text-cyan-400 ml-2 text-base">HTTP</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* URL */}
        <div className="mt-5 bg-gray-900/50 rounded-xl p-4">
          <div className="text-sm text-gray-500 mb-2">Request URL</div>
          <div className="flex items-center gap-3">
            <span className="text-green-400 font-mono text-base flex-1 truncate">
              {artifact.cef['http.url'] || artifact.cef['http.domain']}
            </span>
            {artifact.cef['http.url'] && <CopyButton text={artifact.cef['http.url']} />}
          </div>
        </div>
      </div>

      {/* HTTP Request & Process Context */}
      <div className="grid grid-cols-2 gap-5">
        {/* HTTP Request */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
          <h3 className="text-base font-semibold text-gray-400 uppercase tracking-wider mb-5 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            HTTP Request
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-700/50">
              <span className="text-sm text-gray-500">Status Code</span>
              <span className="text-green-400 font-mono text-lg">{artifact.cef['http.response.status_code']}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-700/50">
              <span className="text-sm text-gray-500">HTTP Version</span>
              <span className="text-gray-300 font-mono text-base">{artifact.cef['http.version']}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-700/50">
              <span className="text-sm text-gray-500">User Agent</span>
              <span className="text-gray-300 text-sm">{artifact.cef['http.response.user_agent']}</span>
            </div>
            {artifact.cef['http.response.mime_type'] && (
              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-gray-500">Content Type</span>
                <span className="text-gray-300 text-sm">{artifact.cef['http.response.mime_type']}</span>
              </div>
            )}
          </div>
        </div>

        {/* Process Context */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
          <h3 className="text-base font-semibold text-gray-400 uppercase tracking-wider mb-5 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Process Context
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-700/50">
              <span className="text-sm text-gray-500">Process</span>
              <span className="text-purple-400 font-mono text-base">{originalEvent?.process?.name || 'python3.6'}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-700/50">
              <span className="text-sm text-gray-500">PID</span>
              <span className="text-gray-300 font-mono text-lg">{originalEvent?.process?.pid || '12345'}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-700/50">
              <span className="text-sm text-gray-500">Executable</span>
              <span className="text-gray-300 text-sm font-mono">{originalEvent?.process?.executable || '/usr/local/bin/python3'}</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-gray-500">User</span>
              <span className="text-blue-400 font-mono text-base">{originalEvent?.user?.name || 'root'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Network Details */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
        <h3 className="text-base font-semibold text-gray-400 uppercase tracking-wider mb-5">Network Details</h3>
        <div className="grid grid-cols-2 gap-5">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm text-gray-500">Source IP</span>
              <span className="text-gray-300 font-mono text-base ml-auto">{artifact.cef['source.ip']}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm text-gray-500">Source Port</span>
              <span className="text-gray-300 font-mono text-base ml-auto">{artifact.cef['source.port']}</span>
            </div>
            {artifact.cef['source.nat.ip'] && (
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-blue-500/50"></div>
                <span className="text-sm text-gray-500">Source NAT</span>
                <span className="text-gray-400 font-mono text-base ml-auto">{artifact.cef['source.nat.ip']}</span>
              </div>
            )}
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-sm text-gray-500">Destination IP</span>
              <span className="text-gray-300 font-mono text-base ml-auto">{artifact.cef['destination.ip']}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-sm text-gray-500">Destination Port</span>
              <span className="text-gray-300 font-mono text-base ml-auto">{artifact.cef['destination.port']}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
              <span className="text-sm text-gray-500">Service</span>
              <span className="text-gray-300 text-base ml-auto">HTTP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
        <h3 className="text-base font-semibold text-gray-400 uppercase tracking-wider mb-5">Timeline</h3>
        <div className="relative pl-6">
          <div className="absolute left-2 top-0 bottom-0 w-1 bg-gray-700 rounded-full"></div>
          
          <div className="space-y-5">
            <div className="relative">
              <div className="absolute left-[-14px] top-1 w-5 h-5 rounded-full bg-blue-500 border-2 border-blue-400"></div>
              <div className="ml-6">
                <div className="flex items-center gap-3">
                  <span className="text-gray-300 text-base">HTTP Request</span>
                  <span className="text-sm text-gray-500">{artifact.cef['@timestamp']?.split('T')[1]?.split('.')[0] || '20:33:08'}</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute left-[-14px] top-1 w-5 h-5 rounded-full bg-green-500 border-2 border-green-400"></div>
              <div className="ml-6">
                <div className="flex items-center gap-3">
                  <span className="text-gray-300 text-base">HTTP Response (200)</span>
                  <span className="text-sm text-gray-500">20:33:09</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute left-[-14px] top-1 w-5 h-5 rounded-full bg-red-500 border-2 border-red-400"></div>
              <div className="ml-6">
                <div className="flex items-center gap-3">
                  <span className="text-gray-300 text-base">Alert Generated</span>
                  <span className="text-sm text-gray-500">20:33:10</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Raw Event */}
      {originalEvent && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
          <details className="group">
            <summary className="flex items-center justify-between p-5 cursor-pointer select-none">
              <span className="text-base font-semibold text-gray-400">Raw Event (JSON)</span>
              <svg className="w-6 h-6 text-gray-400 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="p-5 border-t border-gray-700 bg-gray-900/50">
              <pre className="text-sm text-gray-300 overflow-x-auto whitespace-pre-wrap">
                {JSON.stringify(originalEvent, null, 2)}
              </pre>
            </div>
          </details>
        </div>
      )}
    </div>
  );
};
