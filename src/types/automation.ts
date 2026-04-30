export type NodeType = 'start' | 'action' | 'condition' | 'end';

export interface AutomationVariable {
  id: string;
  name: string;
  type: 'string' | 'number' | 'boolean';
  value: string | number | boolean;
}

export interface Condition {
  variable: string;
  operator: '==' | '!=' | '>' | '<' | '>=' | '<=';
  value: string;
}

export interface ConditionalRule {
  id: string;
  label: string;
  logicOperator: 'AND' | 'OR';
  conditions: Condition[];
}

export interface ConnectionAxis {
  id: string;
  label: string;
  rules?: {
    variable?: string;
    operator?: string;
    value?: string;
  }[];
}

export interface AutomationNodeData extends Record<string, unknown> {
  label: string;
  nodeType: NodeType;
  description?: string;
  // For action nodes
  actionType?: string;
  // For condition nodes (legacy single condition)
  condition?: {
    variable?: string;
    operator?: string;
    value?: string;
  };
  // For condition nodes (new rule-based system)
  conditionalRules?: ConditionalRule[];
  // Text content for the node
  content?: string;
  // Variables used in this node
  usedVariables?: string[];
  // Multiple connection axes feature
  allowMultipleAxes?: boolean;
  connectionAxes?: ConnectionAxis[];
}
