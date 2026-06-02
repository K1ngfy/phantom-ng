import React from 'react';
import { Artifact } from '../types';
import { CopyButton } from './CopyButton';

interface HidsDetailsProps {
  artifact: Artifact;
}

export const HidsDetails: React.FC<HidsDetailsProps> = ({ artifact }) => {
  const isAccountLockout = artifact.cef['event.code'] === 4740;

  return (
    <div className="space-y-6">
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Host Information</h3>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-white">
                {artifact.cef['host.name']}
              </span>
              {artifact.cef['host.name'] && <CopyButton text={artifact.cef['host.name']} />}
            </div>
          </div>
          {isAccountLockout && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 border border-red-500/50 rounded-full">
              <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="text-sm font-semibold text-red-400">Account Lockout</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
          <div className="text-xs text-gray-500 mb-2">Event Code</div>
          <span className="text-purple-400 font-bold text-lg">
            {artifact.cef['event.code']}
          </span>
        </div>
        
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
          <div className="text-xs text-gray-500 mb-2">Event Category</div>
          <span className="text-cyan-400 font-semibold">
            {artifact.cef['event.category']}
          </span>
        </div>
        
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
          <div className="text-xs text-gray-500 mb-2">Triggered By</div>
          <div className="flex items-center gap-2">
            <span className="text-blue-400 font-mono">
              {artifact.cef['user.name']}
            </span>
            {artifact.cef['user.name'] && <CopyButton text={artifact.cef['user.name']} />}
          </div>
        </div>
        
        {artifact.cef['user.target.name'] && (
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <div className="text-xs text-gray-500 mb-2">Target User</div>
            <div className="flex items-center gap-2">
              <span className="text-red-400 font-mono">
                {artifact.cef['user.target.name']}
              </span>
              {artifact.cef['user.target.name'] && <CopyButton text={artifact.cef['user.target.name']} />}
            </div>
          </div>
        )}
        
        {artifact.cef['event.caller_computer_name'] && (
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <div className="text-xs text-gray-500 mb-2">Caller Computer</div>
            <div className="flex items-center gap-2">
              <span className="text-yellow-400 font-mono">
                {artifact.cef['event.caller_computer_name']}
              </span>
              {artifact.cef['event.caller_computer_name'] && <CopyButton text={artifact.cef['event.caller_computer_name']} />}
            </div>
          </div>
        )}
      </div>

      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Additional Details</h3>
        <div className="grid grid-cols-1 gap-3">
          {Object.entries(artifact.cef)
            .filter(([key]) => !['host.name', 'event.code', 'event.category', 'user.name', 'user.target.name', 'event.caller_computer_name'].includes(key))
            .map(([key, value]) => (
              <div key={key} className="flex items-start justify-between py-2 border-b border-gray-700/50 last:border-0">
                <span className="text-xs text-gray-500 flex-1">{key}</span>
                <div className="flex items-center gap-2 flex-1 justify-end">
                  <span className="text-gray-300 font-mono text-xs text-right break-all max-w-[200px]">
                    {String(value)}
                  </span>
                  <CopyButton text={String(value)} />
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
