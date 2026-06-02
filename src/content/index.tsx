import { createRoot } from 'react-dom/client';
import { ArtifactDetailsDrawer } from '../components/ArtifactDetailsDrawer';
import { useArtifactStore } from '../store';
import { ArtifactResponse } from '../types';
import styles from '../styles/index.css?inline';

const init = () => {
  console.log('[phantom-ng] INIT: Content script loaded');
  console.log('[phantom-ng] INIT: Current URL:', window.location.href);
  console.log('[phantom-ng] INIT: Document ready state:', document.readyState);

  const container = document.createElement('div');
  container.id = 'phantom-ng-container';
  document.body.appendChild(container);
  console.log('[phantom-ng] INIT: Container created and appended to body');

  const shadow = container.attachShadow({ mode: 'open' });
  console.log('[phantom-ng] INIT: Shadow DOM created');

  const style = document.createElement('style');
  style.textContent = styles;
  shadow.appendChild(style);
  console.log('[phantom-ng] INIT: Styles injected to Shadow DOM');

  const appContainer = document.createElement('div');
  shadow.appendChild(appContainer);

  const root = createRoot(appContainer);
  console.log('[phantom-ng] INIT: React root created');

  const App = () => {
    console.log('[phantom-ng] INIT: App component rendering');
    return <ArtifactDetailsDrawer />;
  };

  root.render(<App />);
  console.log('[phantom-ng] INIT: React app mounted');

  setupEventListeners();
  console.log('[phantom-ng] INIT: Event listeners setup complete');

  fetchArtifacts();
  console.log('[phantom-ng] INIT: Initial artifact fetch triggered');
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

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
