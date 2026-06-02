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
  } catch (error) {
    console.error('[phantom-ng] Failed to fetch artifacts:', error);
  }
};

const extractArtifactId = (element: HTMLElement): number | null => {
  let current: HTMLElement | null = element;
  const idRegex = /artifact[_\-]?id[=:"]?\s*"?(\d+)"?/i;
  
  while (current) {
    const text = current.outerHTML + ' ' + current.textContent;
    const match = text.match(idRegex);
    if (match) return parseInt(match[1], 10);
    
    if (current.dataset?.id) {
      const idMatch = current.dataset.id.match(/^\d+$/);
      if (idMatch) return parseInt(idMatch[0], 10);
    }
    
    if (current.id && !isNaN(parseInt(current.id, 10))) {
      return parseInt(current.id, 10);
    }
    
    current = current.parentElement;
  }
  
  return null;
};

const setupEventListeners = () => {
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    
    const tableWrapper = target.closest('#phantom-artifacts-table-wrapper, [class*="artifact"], [role="table"]');
    
    if (tableWrapper || target.closest('[role="row"], tr, [class*="row"]')) {
      const artifacts = useArtifactStore.getState().artifacts;
      if (artifacts.length === 0) {
        fetchArtifacts();
        return;
      }

      const artifactId = extractArtifactId(target);
      
      if (artifactId) {
        const artifact = artifacts.find(a => a.id === artifactId);
        if (artifact) {
          event.preventDefault();
          useArtifactStore.getState().selectArtifact(artifact);
          useArtifactStore.getState().openDrawer();
        }
      }
    }
  }, true);
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
