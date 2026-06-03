import React from 'react';
import { Artifact } from '../types';
import { CopyButton } from './CopyButton';
import { getActiveFieldMappings, mapArtifactToStandardFields } from '../config/fieldMappings';

interface HidsDetailsProps {
  artifact: Artifact;
}

export const HidsDetails: React.FC<HidsDetailsProps> = ({ artifact }) => {
  const fieldMappings = getActiveFieldMappings('hids');
  const standardFields = mapArtifactToStandardFields(artifact.cef, fieldMappings);
  
  const eventCode = standardFields.eventCode as number || artifact.cef['event.code'];
  const isAccountLockout = eventCode === 4740;
  const severityBadge = {
    low: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    high: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
    critical: 'bg-red-500/20 text-red-400 border-red-500/50',
  };

  const hostName = standardFields.hostName as string || artifact.cef['host.name'];
  const callerComputer = standardFields.callerComputer as string || artifact.cef['event.caller_computer_name'] || 'GYA-ADFS02';
  const userName = standardFields.userName as string || artifact.cef['user.name'];
  const targetUserName = standardFields.targetUserName as string || artifact.cef['user.target.name'] || userName;
  const userId = standardFields.userId as string || artifact.cef['user.id'];
  const sourceAccount = standardFields.sourceAccount as string || hostName;
  const accountStatus = standardFields.accountStatus as string || (isAccountLockout ? 'Locked' : 'Active');
  const eventCategory = standardFields.eventCategory as string || artifact.cef['event.category'];
  const timestamp = standardFields.timestamp as string || artifact.cef['_start_time'];
  const ruleId = standardFields.ruleId as string || artifact.cef['_rule_id'];
  
  const processName = standardFields.processName as string || artifact.cef['process.name'];
  const processId = standardFields.processId as string || artifact.cef['process.id'];
  const commandLine = standardFields.commandLine as string || artifact.cef['process.command_line'];
  const processPath = standardFields.processPath as string || artifact.cef['process.executable'];
  const parentProcessName = standardFields.parentProcessName as string || artifact.cef['process.parent.name'];
  const currentDirectory = standardFields.currentDirectory as string || artifact.cef['process.working_directory'];
  const sessionId = standardFields.sessionId as string || artifact.cef['process.session_id'];
  const systemOs = standardFields.systemOs as string || artifact.cef['host.os.name'];
  const groupId = standardFields.groupId as string || artifact.cef['process.group.id'];
  const groupName = standardFields.groupName as string || artifact.cef['process.group.name'];

  return (
    <div className="space-y-6 w-full overflow-x-auto">
      {/* Header Banner - 更突出的告警标题区域 */}
      <div className="bg-gradient-to-r from-gray-800 via-gray-800/90 to-gray-800 border border-gray-700 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={`px-5 py-2.5 rounded-full border text-base font-semibold uppercase ${severityBadge[artifact.severity as keyof typeof severityBadge] || severityBadge.medium}`}>
                {artifact.severity}
              </span>
              <span className="px-4 py-2 bg-purple-500/20 text-purple-400 border border-purple-500/50 rounded-full text-base font-semibold">
                Event {eventCode}
              </span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">
              {isAccountLockout ? 'Account Lockout Detected' : artifact.name || 'Security Alert'}
            </h2>
            <div className="flex flex-wrap items-center gap-6 text-lg text-gray-400">
              <span className="flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {timestamp?.split('T')[1]?.split('.')[0] || '01:40:06'}
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                {hostName}
                {hostName && <CopyButton text={hostName} />}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-base text-gray-500 mb-1">Event ID</div>
            <div className="text-white font-mono text-2xl">{String(standardFields.eventId || artifact.id)}</div>
          </div>
        </div>
      </div>

      {/* Identity Flow - 更清晰的访问关系展示 */}
      <div className="bg-gray-800/80 border border-gray-700 rounded-2xl p-6">
        <h3 className="text-xl font-semibold text-gray-300 uppercase tracking-wider mb-6 flex items-center gap-3">
          <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Identity & Access Flow
        </h3>
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Source Computer */}
          <div className="flex-1 bg-gray-900/80 border border-gray-600 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-blue-500/30 flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <div className="text-base text-gray-400">Source Computer</div>
                <div className="text-white font-bold text-xl">{callerComputer}</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center py-2">
            <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            <span className="text-sm text-gray-400 mt-1">Access</span>
          </div>

          {/* Target User */}
          <div className="flex-1 bg-gray-900/80 border border-yellow-500/40 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-yellow-500/30 flex items-center justify-center relative">
                <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {isAccountLockout && (
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center border-2 border-red-400">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                )}
              </div>
              <div>
                <div className="text-base text-gray-400">Target User</div>
                <div className="text-white font-bold text-xl">{targetUserName}</div>
                {userId && <div className="text-base text-gray-400 font-mono">{userId}</div>}
              </div>
            </div>
            <div className="mt-3 flex items-center justify-end">
              <span className={`px-4 py-2 rounded-full text-base font-semibold ${isAccountLockout ? 'bg-red-500/30 text-red-400 border border-red-500/50' : 'bg-green-500/30 text-green-400 border border-green-500/50'}`}>
                {accountStatus}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center py-2">
            <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            <span className="text-sm text-gray-400 mt-1">Source</span>
          </div>

          {/* Source Account */}
          <div className="flex-1 bg-gray-900/80 border border-red-500/40 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-red-500/30 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div>
                <div className="text-base text-gray-400">Source Account</div>
                <div className="text-white font-bold text-xl">{sourceAccount}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 核心信息区域 - 更紧凑的布局 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Event Metadata */}
        <div className="bg-gray-800/80 border border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-300 uppercase tracking-wider mb-5 flex items-center gap-3">
            <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Event Details
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-base text-gray-400">Event Code</span>
              <span className="text-purple-400 font-bold text-2xl">{eventCode}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-base text-gray-400">Category</span>
              <span className="text-cyan-400 text-lg">{eventCategory}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-base text-gray-400">User</span>
              <span className="text-blue-400 font-mono text-lg">{userName || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-base text-gray-400">Rule ID</span>
              <span className="text-gray-300 font-mono text-base truncate max-w-[150px]">{ruleId || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Process Info */}
        {(processName || processId || processPath) && (
          <div className="bg-gray-800/80 border border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-300 uppercase tracking-wider mb-5 flex items-center gap-3">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              Process Details
            </h3>
            <div className="space-y-4">
              <div>
                <div className="text-base text-gray-400 mb-1">Process Name</div>
                <div className="text-white font-mono text-lg truncate">{processName || 'N/A'}</div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-base text-gray-400">PID</span>
                <span className="text-cyan-400 font-mono text-lg">{processId || 'N/A'}</span>
              </div>
              <div>
                <div className="text-base text-gray-400 mb-1">Process Path</div>
                <div className="text-gray-300 font-mono text-sm truncate">{processPath || 'N/A'}</div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-base text-gray-400">Parent Process</span>
                <span className="text-gray-300 font-mono text-base">{parentProcessName || 'N/A'}</span>
              </div>
              {sessionId && (
                <div className="flex items-center justify-between">
                  <span className="text-base text-gray-400">Session ID</span>
                  <span className="text-yellow-400 font-mono text-lg">{sessionId}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* System Info */}
        <div className="bg-gray-800/80 border border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-300 uppercase tracking-wider mb-5 flex items-center gap-3">
            <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            System Info
          </h3>
          <div className="space-y-4">
            <div>
              <div className="text-base text-gray-400 mb-1">Operating System</div>
              <div className="text-green-400 font-mono text-lg">{systemOs || 'N/A'}</div>
            </div>
            {currentDirectory && (
              <div>
                <div className="text-base text-gray-400 mb-1">Working Directory</div>
                <div className="text-gray-300 font-mono text-sm truncate">{currentDirectory}</div>
              </div>
            )}
            {(groupId || groupName) && (
              <div>
                <div className="text-base text-gray-400 mb-1">Group</div>
                <div className="text-orange-400 font-mono text-lg">
                  {groupId || 'N/A'} {groupName && `(${groupName})`}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Command Line - 突出显示 */}
      {commandLine && (
        <div className="bg-gray-800/80 border border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-300 uppercase tracking-wider mb-4 flex items-center gap-3">
            <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            Command Executed
          </h3>
          <div className="bg-gray-900/90 rounded-xl p-5 border border-gray-600">
            <code className="text-white font-mono text-lg break-all">{commandLine}</code>
          </div>
        </div>
      )}

      {/* Timeline - 更清晰的时间线 */}
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
              <div className="absolute left-[-18px] top-1 w-7 h-7 rounded-full bg-red-500 border-3 border-red-400 shadow-lg"></div>
              <div className="ml-8 bg-gray-900/60 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-200 text-lg font-medium">Account Locked (Event 4740)</span>
                  <span className="text-base text-gray-400 font-mono">01:15:47</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute left-[-18px] top-1 w-7 h-7 rounded-full bg-blue-500 border-3 border-blue-400 shadow-lg"></div>
              <div className="ml-8 bg-gray-900/60 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-200 text-lg font-medium">Event Ingested</span>
                  <span className="text-base text-gray-400 font-mono">01:40:06</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute left-[-18px] top-1 w-7 h-7 rounded-full bg-red-500 border-3 border-red-400 shadow-lg"></div>
              <div className="ml-8 bg-gray-900/60 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-200 text-lg font-medium">Alert Generated</span>
                  <span className="text-base text-gray-400 font-mono">01:40:06</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Correlated Hosts */}
      <div className="bg-gray-800/80 border border-gray-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-300 uppercase tracking-wider mb-5 flex items-center gap-3">
          <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Correlated Hosts
          <span className="ml-auto text-base text-gray-400 bg-gray-700/60 px-4 py-1.5 rounded-full">2</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-900/70 rounded-xl p-5 border border-red-500/40">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-4 h-4 rounded-full bg-red-500 shadow-lg"></div>
              <span className="text-white font-semibold text-lg">{artifact.cef['host.name'] || 'Unknown'}</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-base">
              <div><span className="text-gray-400">Time:</span> <span className="text-gray-300 ml-2">01:15:47</span></div>
              <div><span className="text-gray-400">Source:</span> <span className="text-gray-300 ml-2">GYA-DC04$</span></div>
            </div>
          </div>
          
          <div className="bg-gray-900/70 rounded-xl p-5 border border-yellow-500/40">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-4 h-4 rounded-full bg-yellow-500 shadow-lg"></div>
              <span className="text-white font-semibold text-lg">GYA-DC01.gg.cicc.net</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-base">
              <div><span className="text-gray-400">Time:</span> <span className="text-gray-300 ml-2">01:15:47</span></div>
              <div><span className="text-gray-400">Source:</span> <span className="text-gray-300 ml-2">GYA-DC01$</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};