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

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-800/70 border border-gray-700 rounded-xl p-5">
          <div className="text-sm text-gray-500 mb-2">Event ID</div>
          <div className="flex items-center gap-2">
            <span className="text-white font-mono text-lg">{String(standardFields.eventId || artifact.id)}</span>
          </div>
        </div>
        <div className="bg-gray-800/70 border border-gray-700 rounded-xl p-5">
          <div className="text-sm text-gray-500 mb-2">Host</div>
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 font-mono text-base">{hostName}</span>
            {hostName && <CopyButton text={hostName} />}
          </div>
        </div>
        <div className="bg-gray-800/70 border border-gray-700 rounded-xl p-5">
          <div className="text-sm text-gray-500 mb-2">Severity</div>
          <span className={`px-4 py-1.5 rounded-full border text-sm font-semibold uppercase ${severityBadge[artifact.severity as keyof typeof severityBadge] || severityBadge.medium}`}>
            {artifact.severity}
          </span>
        </div>
      </div>

      {/* Identity & Source */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
        <h3 className="text-base font-semibold text-gray-400 uppercase tracking-wider mb-6">Identity & Source</h3>
        <div className="flex items-center justify-between gap-4">
          {/* Caller Computer */}
          <div className="flex-1 bg-gray-900/70 border border-gray-700 rounded-xl p-5">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-14 h-14 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <svg className="w-7 h-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <div className="text-sm text-gray-500">Caller Computer</div>
                <div className="text-white font-bold text-lg">{callerComputer}</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>

          {/* Target User */}
          <div className="flex-1 bg-gray-900/70 border border-gray-700 rounded-xl p-5">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-14 h-14 rounded-xl bg-yellow-500/20 flex items-center justify-center relative">
                <svg className="w-7 h-7 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {isAccountLockout && (
                  <div className="absolute -top-1 -right-1 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                )}
              </div>
              <div>
                <div className="text-sm text-gray-500">Target User</div>
                <div className="text-white font-bold text-lg">{targetUserName}</div>
              </div>
            </div>
            {userId && (
              <div className="text-sm text-gray-500 font-mono">
                {userId}
              </div>
            )}
          </div>

          <div className="flex flex-col items-center">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>

          {/* Source Account */}
          <div className="flex-1 bg-gray-900/70 border border-red-500/30 rounded-xl p-5">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-14 h-14 rounded-xl bg-red-500/20 flex items-center justify-center">
                <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div>
                <div className="text-sm text-gray-500">Source Account</div>
                <div className="text-white font-bold text-lg">{sourceAccount}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Details & Correlated Hosts */}
      <div className="grid grid-cols-2 gap-5">
        {/* Event Details */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
          <h3 className="text-base font-semibold text-gray-400 uppercase tracking-wider mb-5 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Event Details
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-700/50">
              <span className="text-sm text-gray-500">Event Code</span>
              <span className="text-purple-400 font-bold text-xl">{eventCode}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-700/50">
              <span className="text-sm text-gray-500">Category</span>
              <span className="text-cyan-400 font-semibold text-base">{eventCategory}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-700/50">
              <span className="text-sm text-gray-500">User</span>
              <span className="text-blue-400 font-mono text-base">{userName}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-700/50">
              <span className="text-sm text-gray-500">Account Status</span>
              <span className={`px-3 py-1.5 rounded text-sm font-semibold ${isAccountLockout ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                {accountStatus}
              </span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-700/50">
              <span className="text-sm text-gray-500">Caller Computer</span>
              <span className="text-yellow-400 font-mono text-base">{callerComputer}</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-gray-500">Source Account</span>
              <span className="text-red-400 font-mono text-base">{sourceAccount}</span>
            </div>
          </div>
        </div>

        {/* Correlated Hosts */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
          <h3 className="text-base font-semibold text-gray-400 uppercase tracking-wider mb-5 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Correlated Hosts
            <span className="ml-auto text-sm text-gray-500 bg-gray-700/50 px-3 py-1 rounded">2</span>
          </h3>
          <div className="space-y-4">
            <div className="bg-gray-900/50 rounded-xl p-4 border border-red-500/30">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-white font-bold text-base">{artifact.cef['host.name']}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-gray-500">Time:</span> <span className="text-gray-400 ml-2">01:15:47</span></div>
                <div><span className="text-gray-500">Source:</span> <span className="text-gray-400 ml-2">GYA-DC04$</span></div>
              </div>
            </div>
            
            <div className="bg-gray-900/50 rounded-xl p-4 border border-yellow-500/30">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-white font-bold text-base">GYA-DC01.gg.cicc.net</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-gray-500">Time:</span> <span className="text-gray-400 ml-2">01:15:47</span></div>
                <div><span className="text-gray-500">Source:</span> <span className="text-gray-400 ml-2">GYA-DC01$</span></div>
              </div>
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
              <div className="absolute left-[-14px] top-1 w-5 h-5 rounded-full bg-red-500 border-2 border-red-400"></div>
              <div className="ml-6">
                <div className="flex items-center gap-3">
                  <span className="text-gray-300 text-base">Account Locked (Event 4740)</span>
                  <span className="text-sm text-gray-500">01:15:47</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute left-[-14px] top-1 w-5 h-5 rounded-full bg-blue-500 border-2 border-blue-400"></div>
              <div className="ml-6">
                <div className="flex items-center gap-3">
                  <span className="text-gray-300 text-base">Event Ingested</span>
                  <span className="text-sm text-gray-500">01:40:06</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute left-[-14px] top-1 w-5 h-5 rounded-full bg-red-500 border-2 border-red-400"></div>
              <div className="ml-6">
                <div className="flex items-center gap-3">
                  <span className="text-gray-300 text-base">Alert Generated</span>
                  <span className="text-sm text-gray-500">01:40:06</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
        <h3 className="text-base font-semibold text-gray-400 uppercase tracking-wider mb-5">Additional Info</h3>
        <div className="grid grid-cols-2 gap-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between py-3 border-b border-gray-700/50">
              <span className="text-sm text-gray-500">User ID</span>
              <span className="text-gray-300 font-mono text-base">{userId}</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-gray-500">Ingest Time</span>
              <span className="text-gray-300 text-base">{timestamp?.split('T')[1]?.split('.')[0] || '01:40:06'}</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-3 border-b border-gray-700/50">
              <span className="text-sm text-gray-500">Rule ID</span>
              <span className="text-gray-300 font-mono text-sm">{ruleId || 'ads45f17-7c9c-42ed-af58-cf8c9ecbf6a9'}</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-gray-500">Event UUID</span>
              <span className="text-gray-300 font-mono text-sm">{artifact.cef['_event_uuid'] || '344d7550a5574c0129f31ada5fa291d'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Raw Event */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
        <details className="group">
          <summary className="flex items-center justify-between p-5 cursor-pointer select-none">
            <span className="text-base font-semibold text-gray-400">Raw Event (CEF)</span>
            <svg className="w-6 h-6 text-gray-400 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <div className="p-5 border-t border-gray-700 bg-gray-900/50">
            <pre className="text-sm text-gray-300 overflow-x-auto whitespace-pre-wrap">
              {JSON.stringify(artifact.cef, null, 2)}
            </pre>
          </div>
        </details>
      </div>
    </div>
  );
};
