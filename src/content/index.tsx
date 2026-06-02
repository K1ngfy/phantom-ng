import { createRoot } from 'react-dom/client';
import { ArtifactDetailsDrawer } from '../components/ArtifactDetailsDrawer';
import { useArtifactStore } from '../store';
import { ArtifactResponse } from '../types';
import styles from '../styles/index.css?inline';

const init = () => {
  console.log('%c[phantom-ng] INIT: Content script loaded', 'color: #8b5cf6; font-weight: bold');
  console.log('[phantom-ng] INIT: Current URL:', window.location.href);
  console.log('[phantom-ng] INIT: Document ready state:', document.readyState);
  console.log('[phantom-ng] INIT: Document body exists:', !!document.body);
  console.log('[phantom-ng] INIT: Number of script tags:', document.querySelectorAll('script').length);

  const container = document.createElement('div');
  container.id = 'phantom-ng-container';
  container.style.cssText = `
    position: fixed;
    top: 0;
    right: 0;
    width: 0;
    height: 0;
    overflow: hidden;
    z-index: 99999;
  `;
  document.body.appendChild(container);
  console.log('[phantom-ng] INIT: Container created and appended to body:', document.getElementById('phantom-ng-container'));

  const shadow = container.attachShadow({ mode: 'open' });
  console.log('[phantom-ng] INIT: Shadow DOM created:', !!shadow);

  const style = document.createElement('style');
  style.textContent = styles;
  shadow.appendChild(style);
  console.log('[phantom-ng] INIT: Styles injected to Shadow DOM, length:', styles.length);

  const appContainer = document.createElement('div');
  shadow.appendChild(appContainer);
  console.log('[phantom-ng] INIT: App container created in shadow DOM');

  try {
    const root = createRoot(appContainer);
    console.log('[phantom-ng] INIT: React root created successfully');

    const App = () => {
      console.log('[phantom-ng] INIT: App component rendering triggered');
      return <ArtifactDetailsDrawer />;
    };

    root.render(<App />);
    console.log('[phantom-ng] INIT: React app mounted successfully');
    
    setTimeout(() => {
      console.log('[phantom-ng] INIT: Checking shadow DOM after 1s:', shadow.children.length);
    }, 1000);
  } catch (error) {
    console.error('[phantom-ng] INIT: Failed to mount React app:', error);
  }

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
    padding: 12px 24px;
    background: linear-gradient(135deg, #8b5cf6, #7c3aed);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    z-index: 99998;
    box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
    transition: all 0.3s ease;
  `;
  button.textContent = 'Test phantom-ng';
  button.addEventListener('click', () => {
    console.log('[phantom-ng] TEST: Test button clicked');
    testDrawer();
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

const testDrawer = () => {
  const artifacts = useArtifactStore.getState().artifacts;
  console.log('[phantom-ng] TEST: Artifacts in store:', artifacts.length);
  
  if (artifacts.length > 0) {
    const testArtifact = artifacts[0];
    console.log('[phantom-ng] TEST: Opening drawer with artifact:', testArtifact.id);
    useArtifactStore.getState().selectArtifact(testArtifact);
    useArtifactStore.getState().openDrawer();
  } else {
    console.log('[phantom-ng] TEST: No artifacts found, creating mock data');
    const mockArtifact = {
      id: 99999,
      name: 'Test NIDS Alert',
      description: 'This is a test artifact for debugging',
      severity: 'high',
      tags: ['Nids', 'network'],
      cef: {
        _event_type: 'nids_events',
        sourceAddress: '192.168.1.100',
        destinationAddress: '10.0.0.5',
        sourcePort: 443,
        destinationPort: 8080,
        protocol: 'TCP',
        eventName: 'Suspicious Traffic Detected',
      },
      _pretty_create_time: '2024-01-15 10:30:00',
      event: {
        original: JSON.stringify({
          src_ip: '192.168.1.100',
          dst_ip: '10.0.0.5',
          src_port: 443,
          dst_port: 8080,
          protocol: 'TCP',
          alert_message: 'Potential malicious activity detected',
          timestamp: '2024-01-15T10:30:00Z',
          signature: 'ET POLICY Suspicious inbound connection'
        }, null, 2)
      }
    };
    useArtifactStore.getState().selectArtifact(mockArtifact as any);
    useArtifactStore.getState().openDrawer();
    console.log('[phantom-ng] TEST: Drawer opened with mock artifact');
  }
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
      console.log('[phantom-ng] Sample artifact IDs:', data.data.slice(0, 5).map(a => a.id));
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
    
    const tableWrapper = target.closest('#phantom-artifacts-table-wrapper, [class*="artifact"], [role="table"]');
    console.log('[phantom-ng] EVENT: Table wrapper found:', !!tableWrapper);
    
    const rowElement = target.closest('[role="row"], tr, [class*="row"]');
    console.log('[phantom-ng] EVENT: Row element found:', !!rowElement);
    if (rowElement) {
      console.log('[phantom-ng] EVENT: Row HTML snippet:', rowElement.outerHTML.substring(0, 500));
    }
    
    if (tableWrapper || rowElement) {
      const artifacts = useArtifactStore.getState().artifacts;
      console.log('[phantom-ng] EVENT: Artifacts in store:', artifacts.length);
      
      if (artifacts.length === 0) {
        console.log('[phantom-ng] EVENT: No artifacts in store, fetching...');
        fetchArtifacts();
        return;
      }

      const artifactId = extractArtifactId(target);
      console.log('[phantom-ng] EVENT: Extracted Artifact ID:', artifactId);
      
      if (artifactId) {
        const artifact = artifacts.find(a => a.id === artifactId);
        console.log('[phantom-ng] EVENT: Artifact found:', !!artifact);
        
        if (artifact) {
          console.log('[phantom-ng] EVENT: Opening drawer for artifact:', artifactId);
          event.preventDefault();
          useArtifactStore.getState().selectArtifact(artifact);
          useArtifactStore.getState().openDrawer();
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
