import React, { useMemo } from 'react';
import { Artifact } from '../types';
import { CopyButton } from './CopyButton';
import { getActiveFieldMappings, mapArtifactToStandardFields } from '../config/fieldMappings';

interface NidsDetailsProps {
  artifact: Artifact;
}

export const NidsDetails: React.FC<NidsDetailsProps> = ({ artifact }) => {
  const fieldMappings = getActiveFieldMappings('nids');
  const standardFields = mapArtifactToStandardFields(artifact.cef, fieldMappings);
  
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

  const sourceAddress = standardFields.sourceAddress as string || artifact.cef['source.ip'];
  const sourcePort = standardFields.sourcePort || artifact.cef['source.port'];
  const destinationAddress = standardFields.destinationAddress as string || artifact.cef['destination.ip'];
  const destinationPort = standardFields.destinationPort || artifact.cef['destination.port'];
  const protocol = standardFields.protocol as string || artifact.cef['network.protocol'] || 'HTTP';
  const transportProtocol = standardFields.transportProtocol as string || artifact.cef['network.transport'] || 'TCP';
  const httpMethod = standardFields.httpMethod as string || artifact.cef['http.request.method'] || 'GET';
  const httpUrl = standardFields.httpUrl as string || artifact.cef['http.url'] || artifact.cef['http.domain'];
  const timestamp = standardFields.timestamp as string || artifact.cef['@timestamp'];
  
  // 进程信息字段
  const processName = standardFields.processName as string || artifact.cef['process.name'];
  const processId = standardFields.processId as string || artifact.cef['process.id'];
  const commandLine = standardFields.commandLine as string || artifact.cef['process.command_line'];
  const processPath = standardFields.processPath as string || artifact.cef['process.executable'];
  const parentProcessName = standardFields.parentProcessName as string || artifact.cef['process.parent.name'];
  const parentProcessId = standardFields.parentProcessId as string || artifact.cef['process.parent.id'];
  
  // TLS相关字段
  const tlsVersion = standardFields.tlsVersion as string || artifact.cef['tls.version'];
  const tlsCipher = standardFields.tlsCipher as string || artifact.cef['tls.cipher'];
  const tlsServerName = standardFields.tlsServerName as string || artifact.cef['tls.server_name'];
  const tlsIssuer = standardFields.tlsIssuer as string || artifact.cef['tls.certificate.issuer'];
  const tlsSubject = standardFields.tlsSubject as string || artifact.cef['tls.certificate.subject'];
  const tlsFingerprint = standardFields.tlsFingerprint as string || artifact.cef['tls.certificate.fingerprint'];
  
  // 用户信息字段（osquery抓取）
  const userName = standardFields.userName as string || artifact.cef['user.name'];
  const userId = standardFields.userId as string || artifact.cef['user.id'];
  const userGroup = standardFields.userGroup as string || artifact.cef['user.group'];
  const groupId = standardFields.groupId as string || artifact.cef['user.group.id'];
  const groupName = standardFields.groupName as string || artifact.cef['user.group.name'];
  const effectiveUserId = standardFields.effectiveUserId as string || artifact.cef['process.euid'];
  const effectiveGroupId = standardFields.effectiveGroupId as string || artifact.cef['process.egid'];
  const sessionId = standardFields.sessionId as string || artifact.cef['process.session_id'];

  return (
    <div className="space-y-6 w-full overflow-x-auto">
      {/* Header Banner - 突出告警信息 */}
      <div className="bg-gradient-to-r from-gray-800 via-gray-800/90 to-gray-800 border border-gray-700 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={`px-5 py-2.5 rounded-full border text-base font-semibold uppercase ${severityBadge}`}>
                {artifact.severity}
              </span>
              <span className="px-4 py-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 rounded-full text-base font-semibold">
                {protocol}
              </span>
              <span className="px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/50 rounded-full text-base font-semibold">
                {transportProtocol}
              </span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">
              {artifact.name || 'Network Alert'}
            </h2>
            <div className="flex flex-wrap items-center gap-6 text-lg text-gray-400">
              <span className="flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {timestamp?.split('T')[1]?.split('.')[0] || '20:33:08'}
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                {destinationAddress}
                {destinationAddress && <CopyButton text={destinationAddress} />}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-base text-gray-500 mb-1">Event ID</div>
            <div className="text-white font-mono text-2xl">{String(standardFields.eventId || artifact.id)}</div>
          </div>
        </div>
      </div>

      {/* Network Flow - 核心网络流向 */}
      <div className="bg-gray-800/80 border border-gray-700 rounded-2xl p-6">
        <h3 className="text-xl font-semibold text-gray-300 uppercase tracking-wider mb-6 flex items-center gap-3">
          <svg className="w-7 h-7 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Network Flow
        </h3>
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Source */}
          <div className="flex-1 bg-gray-900/80 border border-blue-500/40 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-blue-500/30 flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <div className="text-base text-gray-400">Source</div>
                <div className="text-white font-bold text-xl">{sourceAddress}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-gray-800/60 rounded-lg p-3">
                <span className="text-base text-gray-400">Port:</span>
                <span className="text-blue-400 ml-2 font-mono text-lg">{sourcePort != null ? String(sourcePort) : 'N/A'}</span>
              </div>
              {artifact.cef['source.nat.ip'] && (
                <div className="bg-gray-800/60 rounded-lg p-3">
                  <span className="text-base text-gray-400">NAT:</span>
                  <span className="text-blue-400 ml-2 font-mono text-lg">{artifact.cef['source.nat.ip']}</span>
                </div>
              )}
            </div>
          </div>

          {/* Arrow & Method */}
          <div className="flex flex-col items-center py-2">
            <div className="bg-gray-700 rounded-full px-6 py-2 mb-3">
              <span className="text-green-400 font-bold text-xl">{httpMethod}</span>
            </div>
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
            <div className="bg-red-500/30 border border-red-500/50 rounded-lg px-5 py-2 mt-3">
              <span className="text-red-400 text-base font-bold">XSS Payload</span>
            </div>
          </div>

          {/* Destination */}
          <div className="flex-1 bg-gray-900/80 border border-red-500/40 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-red-500/30 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <div className="text-base text-gray-400">Destination</div>
                <div className="text-white font-bold text-xl">{destinationAddress}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-gray-800/60 rounded-lg p-3">
                <span className="text-base text-gray-400">Port:</span>
                <span className="text-red-400 ml-2 font-mono text-lg">{destinationPort != null ? String(destinationPort) : 'N/A'}</span>
              </div>
              <div className="bg-gray-800/60 rounded-lg p-3">
                <span className="text-base text-gray-400">Service:</span>
                <span className="text-cyan-400 ml-2 text-lg">{protocol}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* URL */}
        <div className="mt-5 bg-gray-900/70 rounded-xl p-5">
          <div className="text-base text-gray-400 mb-2">Request URL</div>
          <div className="flex items-center gap-3">
            <span className="text-green-400 font-mono text-lg flex-1 truncate">
              {httpUrl}
            </span>
            {httpUrl && <CopyButton text={httpUrl} />}
          </div>
        </div>
      </div>

      {/* HTTP Request & Process Context */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* HTTP Request */}
        <div className="bg-gray-800/80 border border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-300 uppercase tracking-wider mb-5 flex items-center gap-3">
            <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            HTTP Request
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-700/50">
              <span className="text-base text-gray-400">Status Code</span>
              <span className="text-green-400 font-mono text-xl">{artifact.cef['http.response.status_code']}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-700/50">
              <span className="text-base text-gray-400">HTTP Version</span>
              <span className="text-gray-300 font-mono text-lg">{artifact.cef['http.version'] || 'HTTP/1.1'}</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-base text-gray-400">User Agent</span>
              <span className="text-gray-300 text-base truncate max-w-[180px]">{artifact.cef['http.response.user_agent'] || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Process Context */}
        <div className="bg-gray-800/80 border border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-300 uppercase tracking-wider mb-5 flex items-center gap-3">
            <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Process Context
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-700/50">
              <span className="text-base text-gray-400">Process</span>
              <span className="text-purple-400 font-mono text-lg">{originalEvent?.process?.name || processName || 'python3.6'}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-700/50">
              <span className="text-base text-gray-400">PID</span>
              <span className="text-gray-300 font-mono text-xl">{originalEvent?.process?.pid || processId || '12345'}</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-base text-gray-400">User</span>
              <span className="text-blue-400 font-mono text-lg">{originalEvent?.user?.name || userName || 'root'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Process Information */}
      {(processName || processId || commandLine || processPath || parentProcessName) && (
        <div className="bg-gray-800/80 border border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-300 uppercase tracking-wider mb-5 flex items-center gap-3">
            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            Process Details
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-900/70 rounded-xl p-4">
              <div className="text-base text-gray-400 mb-2">Process Name</div>
              <div className="text-white font-mono text-lg truncate">{processName || 'N/A'}</div>
            </div>
            <div className="bg-gray-900/70 rounded-xl p-4">
              <div className="text-base text-gray-400 mb-2">Process ID</div>
              <div className="text-cyan-400 font-mono text-lg">{processId || 'N/A'}</div>
            </div>
            <div className="bg-gray-900/70 rounded-xl p-4">
              <div className="text-base text-gray-400 mb-2">Parent Process</div>
              <div className="text-white font-mono text-lg truncate">{parentProcessName || 'N/A'}</div>
            </div>
            <div className="bg-gray-900/70 rounded-xl p-4">
              <div className="text-base text-gray-400 mb-2">Parent PID</div>
              <div className="text-cyan-400 font-mono text-lg">{parentProcessId || 'N/A'}</div>
            </div>
          </div>
          {(processPath || commandLine) && (
            <div className="mt-4 space-y-4">
              {processPath && (
                <div className="bg-gray-900/70 rounded-xl p-4">
                  <div className="text-base text-gray-400 mb-2">Process Path</div>
                  <div className="text-white font-mono text-base truncate">{processPath}</div>
                </div>
              )}
              {commandLine && (
                <div className="bg-gray-900/70 rounded-xl p-4">
                  <div className="text-base text-gray-400 mb-2">Command Line</div>
                  <div className="text-white font-mono text-base break-all">{commandLine}</div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* User Information (from osquery) */}
      {(userName || userId || sessionId || groupName || userGroup || groupId || effectiveUserId || effectiveGroupId) && (
        <div className="bg-gray-800/80 border border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-300 uppercase tracking-wider mb-5 flex items-center gap-3">
            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            User Information (osquery)
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="bg-gray-900/70 rounded-xl p-4">
              <div className="text-base text-gray-400 mb-2">Username</div>
              <div className="text-white font-mono text-lg">{userName || 'N/A'}</div>
            </div>
            <div className="bg-gray-900/70 rounded-xl p-4">
              <div className="text-base text-gray-400 mb-2">User ID (UID)</div>
              <div className="text-cyan-400 font-mono text-lg">{userId || 'N/A'}</div>
            </div>
            <div className="bg-gray-900/70 rounded-xl p-4">
              <div className="text-base text-gray-400 mb-2">Session ID</div>
              <div className="text-yellow-400 font-mono text-lg">{sessionId || 'N/A'}</div>
            </div>
            <div className="bg-gray-900/70 rounded-xl p-4">
              <div className="text-base text-gray-400 mb-2">Group Name</div>
              <div className="text-white font-mono text-lg">{groupName || userGroup || 'N/A'}</div>
            </div>
            <div className="bg-gray-900/70 rounded-xl p-4">
              <div className="text-base text-gray-400 mb-2">Group ID (GID)</div>
              <div className="text-cyan-400 font-mono text-lg">{groupId || 'N/A'}</div>
            </div>
            <div className="bg-gray-900/70 rounded-xl p-4">
              <div className="text-base text-gray-400 mb-2">Effective UID</div>
              <div className="text-green-400 font-mono text-lg">{effectiveUserId || 'N/A'}</div>
            </div>
          </div>
        </div>
      )}

      {/* TLS Information */}
      {(tlsVersion || tlsCipher || tlsServerName || tlsIssuer || tlsSubject || tlsFingerprint) && (
        <div className="bg-gray-800/80 border border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-300 uppercase tracking-wider mb-5 flex items-center gap-3">
            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            TLS Certificate
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-900/70 rounded-xl p-4">
              <div className="text-base text-gray-400 mb-2">TLS Version</div>
              <div className="text-green-400 font-mono text-lg">{tlsVersion || 'N/A'}</div>
            </div>
            <div className="bg-gray-900/70 rounded-xl p-4">
              <div className="text-base text-gray-400 mb-2">Cipher Suite</div>
              <div className="text-blue-400 font-mono text-lg">{tlsCipher || 'N/A'}</div>
            </div>
            <div className="bg-gray-900/70 rounded-xl p-4">
              <div className="text-base text-gray-400 mb-2">Server Name</div>
              <div className="text-white font-mono text-lg truncate">{tlsServerName || 'N/A'}</div>
            </div>
            <div className="bg-gray-900/70 rounded-xl p-4">
              <div className="text-base text-gray-400 mb-2">Certificate Fingerprint</div>
              <div className="text-yellow-400 font-mono text-base truncate">{tlsFingerprint || 'N/A'}</div>
            </div>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="bg-gray-800/80 border border-gray-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-300 uppercase tracking-wider mb-5 flex items-center gap-3">
          <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Timeline
        </h3>
        <div className="relative pl-8">
          <div className="absolute left-3 top-0 bottom-0 w-2 bg-gray-700 rounded-full"></div>
          
          <div className="space-y-5">
            <div className="relative">
              <div className="absolute left-[-18px] top-1 w-7 h-7 rounded-full bg-blue-500 border-3 border-blue-400 shadow-lg"></div>
              <div className="ml-8 bg-gray-900/60 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-200 text-lg font-medium">HTTP Request</span>
                  <span className="text-base text-gray-400 font-mono">{timestamp?.split('T')[1]?.split('.')[0] || '20:33:08'}</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute left-[-18px] top-1 w-7 h-7 rounded-full bg-green-500 border-3 border-green-400 shadow-lg"></div>
              <div className="ml-8 bg-gray-900/60 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-200 text-lg font-medium">HTTP Response (200)</span>
                  <span className="text-base text-gray-400 font-mono">20:33:09</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute left-[-18px] top-1 w-7 h-7 rounded-full bg-red-500 border-3 border-red-400 shadow-lg"></div>
              <div className="ml-8 bg-gray-900/60 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-200 text-lg font-medium">Alert Generated</span>
                  <span className="text-base text-gray-400 font-mono">20:33:10</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};