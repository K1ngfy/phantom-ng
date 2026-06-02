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
  const tlsNotBefore = standardFields.tlsNotBefore as string || artifact.cef['tls.certificate.not_before'];
  const tlsNotAfter = standardFields.tlsNotAfter as string || artifact.cef['tls.certificate.not_after'];
  
  // 用户信息字段（osquery抓取）
  const userName = standardFields.userName as string || artifact.cef['user.name'];
  const userId = standardFields.userId as string || artifact.cef['user.id'];
  const userGroup = standardFields.userGroup as string || artifact.cef['user.group'];
  const groupId = standardFields.groupId as string || artifact.cef['user.group.id'];
  const groupName = standardFields.groupName as string || artifact.cef['user.group.name'];
  const effectiveUserId = standardFields.effectiveUserId as string || artifact.cef['process.euid'];
  const effectiveGroupId = standardFields.effectiveGroupId as string || artifact.cef['process.egid'];
  const sessionId = standardFields.sessionId as string || artifact.cef['process.session_id'];
  const loginShell = standardFields.loginShell as string || artifact.cef['user.shell'];
  const homeDirectory = standardFields.homeDirectory as string || artifact.cef['user.home'];

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-800/70 border border-gray-700 rounded-xl p-5">
          <div className="text-sm text-gray-500 mb-2">Protocol</div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-sm font-semibold rounded">
              {protocol}
            </span>
            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm font-semibold rounded">
              {transportProtocol}
            </span>
          </div>
        </div>
        <div className="bg-gray-800/70 border border-gray-700 rounded-xl p-5">
          <div className="text-sm text-gray-500 mb-2">Event ID</div>
          <span className="text-white font-mono text-lg">{String(standardFields.eventId || artifact.id)}</span>
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
                <div className="text-white font-bold text-lg">{sourceAddress}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-gray-800/50 rounded-lg p-3">
                <span className="text-gray-500">Port:</span>
                <span className="text-blue-400 ml-2 font-mono text-base">{sourcePort != null ? String(sourcePort) : ''}</span>
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
              <span className="text-green-400 font-bold text-lg">{httpMethod}</span>
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
                <div className="text-white font-bold text-lg">{destinationAddress}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-gray-800/50 rounded-lg p-3">
                <span className="text-gray-500">Port:</span>
                <span className="text-red-400 ml-2 font-mono text-base">{destinationPort != null ? String(destinationPort) : ''}</span>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <span className="text-gray-500">Service:</span>
                <span className="text-cyan-400 ml-2 text-base">{protocol}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* URL */}
        <div className="mt-5 bg-gray-900/50 rounded-xl p-4">
          <div className="text-sm text-gray-500 mb-2">Request URL</div>
          <div className="flex items-center gap-3">
            <span className="text-green-400 font-mono text-base flex-1 truncate">
              {httpUrl}
            </span>
            {httpUrl && <CopyButton text={httpUrl} />}
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
              <span className="text-gray-300 font-mono text-base ml-auto">{sourceAddress}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm text-gray-500">Source Port</span>
              <span className="text-gray-300 font-mono text-base ml-auto">{sourcePort != null ? String(sourcePort) : ''}</span>
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
              <span className="text-gray-300 font-mono text-base ml-auto">{destinationAddress}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-sm text-gray-500">Destination Port</span>
              <span className="text-gray-300 font-mono text-base ml-auto">{destinationPort != null ? String(destinationPort) : ''}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
              <span className="text-sm text-gray-500">Service</span>
              <span className="text-gray-300 text-base ml-auto">{protocol}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Process Information */}
      {(processName || processId || commandLine || processPath || parentProcessName || parentProcessId) && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
          <h3 className="text-base font-semibold text-gray-400 uppercase tracking-wider mb-5 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            Process Information
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-900/50 rounded-xl p-4">
              <div className="text-sm text-gray-500 mb-2">Process Name</div>
              <div className="text-white font-mono text-base truncate">{processName || 'N/A'}</div>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-4">
              <div className="text-sm text-gray-500 mb-2">Process ID</div>
              <div className="text-cyan-400 font-mono text-base">{processId || 'N/A'}</div>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-4">
              <div className="text-sm text-gray-500 mb-2">Parent Process</div>
              <div className="text-white font-mono text-base truncate">{parentProcessName || 'N/A'}</div>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-4">
              <div className="text-sm text-gray-500 mb-2">Parent PID</div>
              <div className="text-cyan-400 font-mono text-base">{parentProcessId || 'N/A'}</div>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-4">
              <div className="text-sm text-gray-500 mb-2">Process Path</div>
              <div className="text-white font-mono text-sm truncate">{processPath || 'N/A'}</div>
            </div>
          </div>
          {commandLine && (
            <div className="mt-4 bg-gray-900/50 rounded-xl p-4">
              <div className="text-sm text-gray-500 mb-2">Command Line</div>
              <div className="text-white font-mono text-sm break-all">{commandLine}</div>
            </div>
          )}
        </div>
      )}

      {/* User Information (from osquery) */}
      {(userName || userId || userGroup || groupId || groupName || effectiveUserId || effectiveGroupId || sessionId || loginShell || homeDirectory) && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
          <h3 className="text-base font-semibold text-gray-400 uppercase tracking-wider mb-5 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            User Information (osquery)
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-900/50 rounded-xl p-4">
              <div className="text-sm text-gray-500 mb-2">Username</div>
              <div className="text-white font-mono text-base">{userName || 'N/A'}</div>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-4">
              <div className="text-sm text-gray-500 mb-2">User ID (UID)</div>
              <div className="text-cyan-400 font-mono text-base">{userId || 'N/A'}</div>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-4">
              <div className="text-sm text-gray-500 mb-2">Session ID</div>
              <div className="text-yellow-400 font-mono text-base">{sessionId || 'N/A'}</div>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-4">
              <div className="text-sm text-gray-500 mb-2">Group Name</div>
              <div className="text-white font-mono text-base">{groupName || userGroup || 'N/A'}</div>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-4">
              <div className="text-sm text-gray-500 mb-2">Group ID (GID)</div>
              <div className="text-cyan-400 font-mono text-base">{groupId || 'N/A'}</div>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-4">
              <div className="text-sm text-gray-500 mb-2">Effective UID</div>
              <div className="text-green-400 font-mono text-base">{effectiveUserId || 'N/A'}</div>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-4">
              <div className="text-sm text-gray-500 mb-2">Effective GID</div>
              <div className="text-green-400 font-mono text-base">{effectiveGroupId || 'N/A'}</div>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-4">
              <div className="text-sm text-gray-500 mb-2">Login Shell</div>
              <div className="text-white font-mono text-sm truncate">{loginShell || 'N/A'}</div>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-4">
              <div className="text-sm text-gray-500 mb-2">Home Directory</div>
              <div className="text-white font-mono text-sm truncate">{homeDirectory || 'N/A'}</div>
            </div>
          </div>
        </div>
      )}

      {/* TLS Information */}
      {(tlsVersion || tlsCipher || tlsServerName || tlsIssuer || tlsSubject || tlsFingerprint || tlsNotBefore || tlsNotAfter) && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
          <h3 className="text-base font-semibold text-gray-400 uppercase tracking-wider mb-5 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            TLS Certificate
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-900/50 rounded-xl p-4">
              <div className="text-sm text-gray-500 mb-2">TLS Version</div>
              <div className="text-green-400 font-mono text-base">{tlsVersion || 'N/A'}</div>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-4">
              <div className="text-sm text-gray-500 mb-2">Cipher Suite</div>
              <div className="text-blue-400 font-mono text-base">{tlsCipher || 'N/A'}</div>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-4">
              <div className="text-sm text-gray-500 mb-2">Server Name</div>
              <div className="text-white font-mono text-base truncate">{tlsServerName || 'N/A'}</div>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-4">
              <div className="text-sm text-gray-500 mb-2">Certificate Fingerprint</div>
              <div className="text-yellow-400 font-mono text-sm truncate">{tlsFingerprint || 'N/A'}</div>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-4">
              <div className="text-sm text-gray-500 mb-2">Issuer</div>
              <div className="text-white font-mono text-sm truncate">{tlsIssuer || 'N/A'}</div>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-4">
              <div className="text-sm text-gray-500 mb-2">Subject</div>
              <div className="text-white font-mono text-sm truncate">{tlsSubject || 'N/A'}</div>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-4">
              <div className="text-sm text-gray-500 mb-2">Valid From</div>
              <div className="text-gray-300 font-mono text-sm">{tlsNotBefore || 'N/A'}</div>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-4">
              <div className="text-sm text-gray-500 mb-2">Valid Until</div>
              <div className="text-gray-300 font-mono text-sm">{tlsNotAfter || 'N/A'}</div>
            </div>
          </div>
        </div>
      )}

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
                  <span className="text-sm text-gray-500">{timestamp?.split('T')[1]?.split('.')[0] || '20:33:08'}</span>
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
