import { createRoot } from 'react-dom/client';
import { ArtifactInlineDetails } from '../components/ArtifactInlineDetails';
import { useArtifactStore } from '../store';
import { Artifact, ArtifactResponse } from '../types';
import styles from '../styles/index.css?inline';

const init = () => {
  console.log('%c[phantom-ng] INIT: Content script loaded', 'color: #8b5cf6; font-weight: bold');
  console.log('[phantom-ng] INIT: Current URL:', window.location.href);
  console.log('[phantom-ng] INIT: Document ready state:', document.readyState);
  console.log('[phantom-ng] INIT: Document body exists:', !!document.body);
  console.log('[phantom-ng] INIT: Number of script tags:', document.querySelectorAll('script').length);

  setupEventListeners();
  console.log('[phantom-ng] INIT: Event listeners setup complete');

  fetchArtifacts();
  console.log('[phantom-ng] INIT: Initial artifact fetch triggered');

  createTestButton();
  console.log('[phantom-ng] INIT: Test button created');
};

const createTestButton = () => {
  const button = document.createElement('button');
  button.id = 'phantom-ng-test-btn';
  button.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 20px;
    padding: 14px 28px;
    background: linear-gradient(135deg, #8b5cf6, #7c3aed);
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    z-index: 99998;
    box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
    transition: all 0.3s ease;
  `;
  button.textContent = 'Test phantom-ng';
  button.addEventListener('click', () => {
    console.log('[phantom-ng] TEST: Test button clicked');
    testInlineView();
  });
  button.addEventListener('mouseenter', () => {
    button.style.transform = 'translateY(-2px)';
    button.style.boxShadow = '0 6px 20px rgba(139, 92, 246, 0.5)';
  });
  button.addEventListener('mouseleave', () => {
    button.style.transform = 'translateY(0)';
    button.style.boxShadow = '0 4px 15px rgba(139, 92, 246, 0.4)';
  });
  document.body.appendChild(button);
};

const testInlineView = () => {
  const artifacts = useArtifactStore.getState().artifacts;
  console.log('[phantom-ng] TEST: Artifacts in store:', artifacts.length);
  
  if (artifacts.length > 0) {
    const testArtifact = artifacts[0];
    console.log('[phantom-ng] TEST: Creating inline view for artifact:', testArtifact.id);
    renderInlineDetails(testArtifact);
  } else {
    console.log('[phantom-ng] TEST: No artifacts found, creating mock data');
    const mockArtifact: Artifact = {
      id: 99999,
      name: 'Test NIDS Alert - XSS Payload Detected',
      description: 'Suspicious HTTP request containing potential XSS payload detected from external source',
      severity: 'high',
      tags: ['Nids', 'network', 'security'],
      cef: {
        _event_type: 'nids_events',
        'source.ip': '192.168.1.100',
        'source.port': 49785,
        'source.nat.ip': '203.0.113.45',
        'destination.ip': '10.0.0.5',
        'destination.port': 8080,
        'network.protocol': 'HTTP',
        'network.transport': 'TCP',
        'http.url': 'http://example.com/api/v1/endpoint?param=<script>alert(1)</script>',
        'http.request.method': 'GET',
        'http.response.status_code': 200,
        'http.version': 'HTTP/1.1',
        'http.response.user_agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
        'event.id': 'event-12345',
        '@timestamp': '2024-01-15T20:33:08.123Z',
      },
      _pretty_create_time: '2024-01-15 20:33:08',
      event: {
        original: JSON.stringify({
          src_ip: '192.168.1.100',
          dst_ip: '10.0.0.5',
          src_port: 49785,
          dst_port: 8080,
          protocol: 'TCP',
          alert_message: 'Potential XSS payload detected in URL parameter',
          timestamp: '2024-01-15T20:33:08Z',
          signature: 'ET POLICY Suspicious URL parameter pattern',
          process: {
            name: 'python3.6',
            pid: 12345,
            executable: '/usr/local/bin/python3',
          },
          user: {
            name: 'root'
          }
        }, null, 2)
      }
    };
    renderInlineDetails(mockArtifact);
    console.log('[phantom-ng] TEST: Inline view rendered with mock artifact');
  }
};

const renderInlineDetails = (artifact: Artifact) => {
  const existingContainer = document.getElementById('phantom-ng-inline-container');
  if (existingContainer) {
    existingContainer.remove();
  }

  const container = document.createElement('div');
  container.id = 'phantom-ng-inline-container';
  container.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    max-width: 1200px;
    max-height: 85vh;
    overflow-y: auto;
    z-index: 99999;
    background: transparent;
    border-radius: 16px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  `;

  const backdrop = document.createElement('div');
  backdrop.id = 'phantom-ng-backdrop';
  backdrop.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(4px);
    z-index: 99998;
  `;
  backdrop.addEventListener('click', () => {
    cleanupInlineView();
  });

  document.body.appendChild(backdrop);
  document.body.appendChild(container);

  const shadow = container.attachShadow({ mode: 'open' });

  const style = document.createElement('style');
  style.textContent = `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    ${styles}
  `;
  shadow.appendChild(style);

  const appContainer = document.createElement('div');
  appContainer.id = 'phantom-ng-app';
  shadow.appendChild(appContainer);

  const root = createRoot(appContainer);
  
  const handleClose = () => {
    cleanupInlineView();
  };

  root.render(<ArtifactInlineDetails artifact={artifact} onClose={handleClose} />);
  console.log('[phantom-ng] RENDER: Inline details view rendered successfully');
};

const cleanupInlineView = () => {
  const container = document.getElementById('phantom-ng-inline-container');
  const backdrop = document.getElementById('phantom-ng-backdrop');
  
  if (container) container.remove();
  if (backdrop) backdrop.remove();
  
  console.log('[phantom-ng] CLEANUP: Inline view removed');
};

const extractContainerId = (): string | null => {
  console.log('[phantom-ng] API: Extracting container ID from URL:', window.location.href);
  
  const urlMatch = window.location.href.match(/container\/(\d+)/);
  if (urlMatch) {
    console.log('[phantom-ng] API: Found container ID from container pattern:', urlMatch[1]);
    return urlMatch[1];
  }

  const missionMatch = window.location.href.match(/mission\/(\d+)/);
  if (missionMatch) {
    console.log('[phantom-ng] API: Found container ID from mission pattern:', missionMatch[1]);
    return missionMatch[1];
  }

  const containerElement = document.querySelector('[data-container-id], .container-id, #container-id');
  if (containerElement) {
    const id = containerElement.getAttribute('data-container-id') || containerElement.textContent?.trim() || null;
    console.log('[phantom-ng] API: Found container ID from DOM element:', id);
    return id;
  }

  console.log('[phantom-ng] API: No container ID found in URL or DOM');
  return null;
};

const fetchArtifacts = async () => {
  const containerId = extractContainerId();
  if (!containerId) {
    console.log('[phantom-ng] No container ID found');
    return;
  }

  try {
    const response = await fetch(`/rest/artifact?_filter_container_id=${containerId}&page_size=100`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ArtifactResponse = await response.json();
    useArtifactStore.getState().setArtifacts(data.data);
    console.log(`[phantom-ng] Loaded ${data.data.length} artifacts`);
    
    if (data.data.length > 0) {
      console.log('[phantom-ng] Sample artifact IDs:', data.data.slice(0, 5).map((a: Artifact) => a.id));
    }
  } catch (error) {
    console.error('[phantom-ng] Failed to fetch artifacts:', error);
  }
};

const extractArtifactId = (element: HTMLElement): number | null => {
  console.log('[phantom-ng] EXTRACT: Starting artifact ID extraction from:', element.tagName);
  
  let current: HTMLElement | null = element;
  const idRegex = /artifact[_\-]?id[=:"]?\s*"?(\d+)"?/i;
  
  let depth = 0;
  while (current && depth < 20) {
    console.log(`[phantom-ng] EXTRACT: Checking element at depth ${depth}: ${current.tagName}.${current.className}#${current.id}`);
    
    const text = current.outerHTML + ' ' + current.textContent;
    const match = text.match(idRegex);
    if (match) {
      console.log('[phantom-ng] EXTRACT: Found ID via regex:', match[1]);
      return parseInt(match[1], 10);
    }
    
    if (current.dataset?.id) {
      console.log('[phantom-ng] EXTRACT: Found data-id:', current.dataset.id);
      const idMatch = current.dataset.id.match(/^\d+$/);
      if (idMatch) {
        console.log('[phantom-ng] EXTRACT: Valid numeric ID:', idMatch[0]);
        return parseInt(idMatch[0], 10);
      }
    }
    
    if (current.id && !isNaN(parseInt(current.id, 10))) {
      console.log('[phantom-ng] EXTRACT: Found numeric ID in element ID:', current.id);
      return parseInt(current.id, 10);
    }
    
    current = current.parentElement;
    depth++;
  }
  
  console.log('[phantom-ng] EXTRACT: No ID found after traversing up the DOM');
  return null;
};

const setupEventListeners = () => {
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    console.log('[phantom-ng] EVENT: Click detected on:', target.tagName, target.className);
    
    const artifactRow = target.closest('[role="row"], tr.artifact-row, [class*="artifact-row"], .rt-tr-group');
    console.log('[phantom-ng] EVENT: Artifact row found:', !!artifactRow);
    
    if (artifactRow) {
      console.log('[phantom-ng] EVENT: Row HTML snippet:', artifactRow.outerHTML.substring(0, 500));
      
      const artifacts = useArtifactStore.getState().artifacts;
      console.log('[phantom-ng] EVENT: Artifacts in store:', artifacts.length);
      
      if (artifacts.length === 0) {
        console.log('[phantom-ng] EVENT: No artifacts in store, fetching...');
        fetchArtifacts();
        return;
      }

      const artifactId = extractArtifactId(artifactRow as HTMLElement);
      console.log('[phantom-ng] EVENT: Extracted Artifact ID:', artifactId);
      
      if (artifactId) {
        const artifact = artifacts.find((a: Artifact) => a.id === artifactId);
        console.log('[phantom-ng] EVENT: Artifact found:', !!artifact);
        
        if (artifact) {
          console.log('[phantom-ng] EVENT: Rendering inline details for artifact:', artifactId);
          event.preventDefault();
          renderInlineDetails(artifact);
        } else {
          console.log('[phantom-ng] EVENT: Artifact not found in store with ID:', artifactId);
        }
      } else {
        console.log('[phantom-ng] EVENT: Could not extract Artifact ID');
      }
    }
  }, true);
};

const safeInit = () => {
  try {
    init();
  } catch (error) {
    console.error('%c[phantom-ng] FATAL: Failed to initialize content script', 'color: #ef4444; font-weight: bold');
    console.error('[phantom-ng] FATAL Error:', error);
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', safeInit);
} else {
  safeInit();
}
