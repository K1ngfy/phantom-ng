export interface Artifact {
  tags: string[];
  id: number;
  event?: {
    original?: string;
  };
  cef: {
    '_owner'?: string;
    'host.id'?: string;
    'user.id'?: string | number;
    '_rule_id'?: string;
    'event.id'?: string;
    'http.url'?: string;
    '_end_time'?: string;
    'log.level'?: string;
    'rule_name'?: string;
    'source.ip'?: string;
    'user.name'?: string;
    '@timestamp'?: string;
    'event.type'?: string;
    '_event_type'?: string;
    '_event_uuid'?: string;
    '_start_time'?: string;
    'http.domain'?: string;
    'process.pid'?: number;
    'source.port'?: number;
    '_search_name'?: string;
    'event.action'?: string;
    'http.version'?: string;
    'process.pgid'?: number;
    'service.name'?: string;
    '_cluster_info'?: string;
    'osquery.group'?: string;
    'osquery.owner'?: string;
    'process.start'?: number;
    'source.nat.ip'?: string;
    'destination.ip'?: string;
    'event.original'?: string;
    'destination.port'?: number;
    'network.protocol'?: string;
    'process.tty.name'?: string;
    'network.transport'?: string;
    'process.executable'?: string;
    'http.request.method'?: string;
    'process.namespaces.mnt'?: number;
    'process.namespaces.pid'?: number;
    'http.response.mime_type'?: any;
    'http.response.user_agent'?: any;
    'http.response.detected_os'?: any;
    'http.response.status_code'?: number;
    'host.name'?: string;
    'event.code'?: number;
    'event.category'?: string;
    'user.target.id'?: string;
    'user.target.name'?: string;
    'event.caller_computer_name'?: string;
    [key: string]: any;
  };
  cef_types?: any;
  _pretty_container?: string;
  container?: number;
  _pretty_create_time?: string;
  create_time?: string;
  description?: string;
  end_time?: any;
  external_id?: any;
  hash?: string;
  _pretty_ingest_app?: string;
  ingest_app?: any;
  kill_chain?: any;
  label?: string;
  name?: string;
  _pretty_owner?: string;
  owner?: any;
  playbook_run?: any;
  _pretty_severity?: string;
  severity?: string;
  source_data_identifier?: string;
  _pretty_start_time?: string;
  start_time?: string;
  type?: any;
  _pretty_update_time?: string;
  update_time?: string;
  version?: number;
  in_case?: boolean;
  has_note?: boolean;
  _pretty_parent_container?: string;
  parent_container?: any;
  _pretty_parent_artifact?: string;
  parent_artifact?: any;
}

export interface ArtifactResponse {
  count: number;
  num_pages: number;
  data: Artifact[];
}

export interface ArtifactStore {
  artifacts: Artifact[];
  selectedArtifact: Artifact | null;
  isDrawerOpen: boolean;
  setArtifacts: (artifacts: Artifact[]) => void;
  selectArtifact: (artifact: Artifact | null) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
}
