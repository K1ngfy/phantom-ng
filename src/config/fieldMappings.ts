export interface FieldMapping {
  standardField: string;
  cefPaths: string[];
  description: string;
}

export interface ArtifactTypeConfig {
  type: 'hids' | 'nids';
  label: string;
  fields: FieldMapping[];
}

export const hidsFieldMappings: ArtifactTypeConfig = {
  type: 'hids',
  label: 'HIDS Event',
  fields: [
    {
      standardField: 'eventCode',
      cefPaths: ['event.code', 'event_code', 'cef.event_code', '_cef.event_code'],
      description: '事件代码'
    },
    {
      standardField: 'eventCategory',
      cefPaths: ['event.category', 'event_category', 'cef.event_category'],
      description: '事件类别'
    },
    {
      standardField: 'eventType',
      cefPaths: ['_event_type', 'event.type', 'event_type'],
      description: '事件类型'
    },
    {
      standardField: 'hostName',
      cefPaths: ['host.name', 'host_name', 'cef.host_name', 'src_host', 'source_host'],
      description: '主机名'
    },
    {
      standardField: 'userName',
      cefPaths: ['user.name', 'user_name', 'cef.user_name', 'src_user', 'source_user'],
      description: '用户名'
    },
    {
      standardField: 'targetUserName',
      cefPaths: ['user.target.name', 'target_user', 'target_username', 'cef.target_user'],
      description: '目标用户名'
    },
    {
      standardField: 'userId',
      cefPaths: ['user.id', 'user_sid', 'cef.user_id', 'sid'],
      description: '用户ID'
    },
    {
      standardField: 'targetUserId',
      cefPaths: ['user.target.id', 'target_sid', 'cef.target_user_id'],
      description: '目标用户ID'
    },
    {
      standardField: 'callerComputer',
      cefPaths: ['event.caller_computer_name', 'caller_computer', 'src_ip', 'source_ip'],
      description: '调用计算机'
    },
    {
      standardField: 'sourceAccount',
      cefPaths: ['source_account', 'src_account', 'cef.source_account'],
      description: '源账户'
    },
    {
      standardField: 'accountStatus',
      cefPaths: ['account_status', 'account_status_description', 'cef.account_status'],
      description: '账户状态'
    },
    {
      standardField: 'domain',
      cefPaths: ['domain', 'user.domain', 'cef.domain'],
      description: '域名'
    },
    {
      standardField: 'timestamp',
      cefPaths: ['_start_time', 'event_time', 'timestamp', 'cef._start_time'],
      description: '时间戳'
    },
    {
      standardField: 'ruleId',
      cefPaths: ['_rule_id', 'rule_id', 'cef._rule_id'],
      description: '规则ID'
    },
    {
      standardField: 'eventId',
      cefPaths: ['event.id', 'event_id', 'cef.event_id'],
      description: '事件ID'
    },
    {
      standardField: 'processName',
      cefPaths: ['process.name', 'process_name', 'cef.process_name', 'proc_name'],
      description: '进程名称'
    },
    {
      standardField: 'processId',
      cefPaths: ['process.id', 'process_id', 'cef.process_id', 'pid'],
      description: '进程ID'
    },
    {
      standardField: 'commandLine',
      cefPaths: ['process.command_line', 'command_line', 'cmd_line', 'cef.command_line'],
      description: '命令行'
    }
  ]
};

export const nidsFieldMappings: ArtifactTypeConfig = {
  type: 'nids',
  label: 'NIDS Event',
  fields: [
    {
      standardField: 'sourceAddress',
      cefPaths: ['source.address', 'src_ip', 'source_ip', 'cef.source_address'],
      description: '源IP地址'
    },
    {
      standardField: 'sourcePort',
      cefPaths: ['source.port', 'src_port', 'source_port', 'cef.source_port'],
      description: '源端口'
    },
    {
      standardField: 'destinationAddress',
      cefPaths: ['destination.address', 'dest_ip', 'destination_ip', 'cef.destination_address'],
      description: '目的IP地址'
    },
    {
      standardField: 'destinationPort',
      cefPaths: ['destination.port', 'dest_port', 'destination_port', 'cef.destination_port'],
      description: '目的端口'
    },
    {
      standardField: 'protocol',
      cefPaths: ['network.protocol', 'protocol', 'cef.network_protocol'],
      description: '协议'
    },
    {
      standardField: 'transportProtocol',
      cefPaths: ['network.transport', 'transport_protocol', 'cef.transport_protocol'],
      description: '传输协议'
    },
    {
      standardField: 'eventAction',
      cefPaths: ['event.action', 'event_action', 'cef.event_action'],
      description: '事件动作'
    },
    {
      standardField: 'eventCategory',
      cefPaths: ['event.category', 'event_category', 'cef.event_category'],
      description: '事件类别'
    },
    {
      standardField: 'eventType',
      cefPaths: ['_event_type', 'event.type', 'event_type'],
      description: '事件类型'
    },
    {
      standardField: 'httpMethod',
      cefPaths: ['http.request.method', 'http_method', 'cef.http_method'],
      description: 'HTTP方法'
    },
    {
      standardField: 'httpReferrer',
      cefPaths: ['http.request.referrer', 'http_referrer', 'cef.http_referrer'],
      description: 'HTTP引用'
    },
    {
      standardField: 'httpUserAgent',
      cefPaths: ['http.request.user_agent', 'http_user_agent', 'user_agent', 'cef.http_user_agent'],
      description: 'HTTP用户代理'
    },
    {
      standardField: 'httpUrl',
      cefPaths: ['http.request.url', 'http_url', 'url', 'cef.http_url'],
      description: 'HTTP URL'
    },
    {
      standardField: 'dnsQuery',
      cefPaths: ['dns.question.name', 'dns_query', 'query_name', 'cef.dns_query'],
      description: 'DNS查询'
    },
    {
      standardField: 'dnsType',
      cefPaths: ['dns.question.type', 'dns_type', 'cef.dns_type'],
      description: 'DNS类型'
    },
    {
      standardField: 'alertSignature',
      cefPaths: ['alert.signature', 'signature', 'alert_signature', 'cef.alert_signature'],
      description: '告警签名'
    },
    {
      standardField: 'alertSeverity',
      cefPaths: ['alert.severity', 'alert_severity', 'cef.alert_severity'],
      description: '告警级别'
    },
    {
      standardField: 'timestamp',
      cefPaths: ['_start_time', 'event_time', 'timestamp', 'cef._start_time'],
      description: '时间戳'
    },
    {
      standardField: 'ruleId',
      cefPaths: ['_rule_id', 'rule_id', 'cef._rule_id'],
      description: '规则ID'
    },
    {
      standardField: 'bytesIn',
      cefPaths: ['network.bytes_in', 'bytes_in', 'in_bytes', 'cef.bytes_in'],
      description: '入站字节数'
    },
    {
      standardField: 'bytesOut',
      cefPaths: ['network.bytes_out', 'bytes_out', 'out_bytes', 'cef.bytes_out'],
      description: '出站字节数'
    },
    {
      standardField: 'packets',
      cefPaths: ['network.packets', 'packets', 'packet_count', 'cef.packets'],
      description: '数据包数量'
    }
  ]
};

export const getFieldValue = (cef: Record<string, unknown>, fieldMapping: FieldMapping): unknown => {
  for (const path of fieldMapping.cefPaths) {
    const value = getNestedValue(cef, path);
    if (value !== undefined && value !== null) {
      return value;
    }
  }
  return null;
};

const getNestedValue = (obj: Record<string, unknown>, path: string): unknown => {
  const keys = path.split('.');
  let current: unknown = obj;
  
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return undefined;
    }
  }
  
  return current;
};

export const mapArtifactToStandardFields = (
  cef: Record<string, unknown>,
  config: ArtifactTypeConfig
): Record<string, unknown> => {
  const result: Record<string, unknown> = {};
  
  for (const fieldMapping of config.fields) {
    const value = getFieldValue(cef, fieldMapping);
    if (value !== null) {
      result[fieldMapping.standardField] = value;
    }
  }
  
  return result;
};

export const saveFieldMappings = (config: ArtifactTypeConfig): void => {
  localStorage.setItem(`phantom-ng-field-mappings-${config.type}`, JSON.stringify(config));
};

export const loadFieldMappings = (type: 'hids' | 'nids'): ArtifactTypeConfig | null => {
  const stored = localStorage.getItem(`phantom-ng-field-mappings-${type}`);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
  return null;
};

export const getActiveFieldMappings = (type: 'hids' | 'nids'): ArtifactTypeConfig => {
  const stored = loadFieldMappings(type);
  if (stored) {
    return stored;
  }
  return type === 'hids' ? hidsFieldMappings : nidsFieldMappings;
};