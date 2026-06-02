import { createRoot, Root } from 'react-dom/client';
import { ArtifactInlineDetails } from '../components/ArtifactInlineDetails';
import { useArtifactStore } from '../store';
import { Artifact, ArtifactResponse } from '../types';
import styles from '../styles/index.css?inline';

let reactRoot: Root | null = null;

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
    testReplaceView();
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

const testReplaceView = async () => {
  let artifacts = useArtifactStore.getState().artifacts;
  console.log('[phantom-ng] TEST: Artifacts in store:', artifacts.length);
  
  if (artifacts.length === 0) {
    console.log('[phantom-ng] TEST: No artifacts in store, fetching from API...');
    await fetchArtifacts();
    artifacts = useArtifactStore.getState().artifacts;
  }
  
  if (artifacts.length > 0) {
    const testArtifact = artifacts[0];
    console.log('[phantom-ng] TEST: Replacing artifact details view for:', testArtifact.id);
    replaceArtifactDetails(testArtifact);
  } else {
    console.log('[phantom-ng] TEST: No artifacts available. Please ensure you are on a valid Phantom container page.');
    alert('No artifacts found. Please navigate to a Phantom container page with artifacts.');
  }
};

const replaceArtifactDetails = (artifact: Artifact) => {
  console.log('[phantom-ng] RENDER: Looking for artifact details container...');
  
  const selectors = [
    '[class*="artifact-detail"]',
    '.artifact-details',
    '.element-detail',
    '#artifact-detail',
    '.detail-panel',
    '.panel-content'
  ];
  
  let artifactDetailsContainer: HTMLElement | null = null;
  
  for (const selector of selectors) {
    const el = document.querySelector(selector);
    console.log(`[phantom-ng] RENDER: Selector "${selector}" found:`, !!el);
    if (el) {
      artifactDetailsContainer = el as HTMLElement;
      break;
    }
  }
  
  if (!artifactDetailsContainer) {
    console.log('[phantom-ng] RENDER: No artifact details container found, creating fallback');
    createFallbackContainer();
    return;
  }

  if (reactRoot) {
    reactRoot.unmount();
    reactRoot = null;
  }

  const container = document.createElement('div');
  container.id = 'phantom-ng-artifact-container';
  container.style.cssText = `
    width: 100%;
    min-height: 400px;
  `;

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

  reactRoot = createRoot(appContainer);
  
  const handleClose = () => {
    console.log('[phantom-ng] CLEANUP: Restoring original artifact details');
    if (reactRoot) {
      reactRoot.unmount();
      reactRoot = null;
    }
    restoreOriginalDetails();
  };

  artifactDetailsContainer.innerHTML = '';
  artifactDetailsContainer.appendChild(container);
  
  reactRoot.render(<ArtifactInlineDetails artifact={artifact} onClose={handleClose} />);
  console.log('[phantom-ng] RENDER: Artifact details view replaced successfully');
};

const createFallbackContainer = () => {
  const artifacts = useArtifactStore.getState().artifacts;
  
  if (artifacts.length === 0) {
    console.log('[phantom-ng] RENDER: No artifacts available for fallback view');
    alert('No artifacts found. Please navigate to a Phantom container page with artifacts.');
    return;
  }

  const container = document.createElement('div');
  container.id = 'phantom-ng-fallback-container';
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
    cleanupFallbackContainer();
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

  reactRoot = createRoot(appContainer);
  
  const artifact = artifacts[0];

  const handleClose = () => {
    cleanupFallbackContainer();
  };

  reactRoot.render(<ArtifactInlineDetails artifact={artifact} onClose={handleClose} />);
};

const cleanupFallbackContainer = () => {
  const container = document.getElementById('phantom-ng-fallback-container');
  const backdrop = document.getElementById('phantom-ng-backdrop');
  
  if (container) container.remove();
  if (backdrop) backdrop.remove();
  
  if (reactRoot) {
    reactRoot.unmount();
    reactRoot = null;
  }
  
  console.log('[phantom-ng] CLEANUP: Fallback view removed');
};

const restoreOriginalDetails = () => {
  const artifactDetailsContainer = document.querySelector('.artifact-details');
  if (artifactDetailsContainer) {
    artifactDetailsContainer.innerHTML = `
      <div class="artifact-detail_row">
        <tbody>
          <tr><td><b>Name</b></td><td>[TVM] Windows Account Lockouts From Endpoint</td></tr>
          <tr><td><b>Label</b></td><td>hids_events</td></tr>
          <tr><td><b>Description</b></td><td>Detects the occurrence of Active Directory Security Event ID 4740...</td></tr>
          <tr><td><b>Source ID</b></td><td>276325adde8b9958479a58a6d647a8</td></tr>
          <tr><td><b>Start Time</b></td><td>2026-06-02T01:15:47</td></tr>
          <tr><td><b>Created</b></td><td>Today at 1:40 am</td></tr>
          <tr><td><b>Type</b></td><td>N/A</td></tr>
          <tr><td><b>Severity</b></td><td>Medium</td></tr>
          <tr><td><b>Tags</b></td><td>Hids</td></tr>
        </tbody>
      </div>
      <div class="cf-details-header">Details</div>
      <table class="cf-details-table">
        <tbody>
          <tr class="cf-detail_row"><td class="cf-detail_name">_start_time</td><td class="cf-detail_value">2026-06-02T01:15:47</td></tr>
          <tr class="cf-detail_row"><td class="cf-detail_name">_event_type</td><td class="cf-detail_value">hids_events</td></tr>
          <tr class="cf-detail_row"><td class="cf-detail_name">event_code</td><td class="cf-detail_value">4740</td></tr>
          <tr class="cf-detail_row"><td class="cf-detail_name">event_category</td><td class="cf-detail_value">User Account Management</td></tr>
          <tr class="cf-detail_row"><td class="cf-detail_name">host_name</td><td class="cf-detail_value">GYA-DC04.gg.cicc.net</td></tr>
        </tbody>
      </table>
    `;
  }
  console.log('[phantom-ng] CLEANUP: Original details restored');
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
          console.log('[phantom-ng] EVENT: Replacing artifact details for:', artifactId);
          replaceArtifactDetails(artifact);
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
