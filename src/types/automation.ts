export type NodeType = 'start' | 'action' | 'condition' | 'end';

export interface AutomationVariable {
  id: string;
  name: string;
  type: 'string' | 'number' | 'boolean';
  value: string | number | boolean;
}

export interface AutomationNodeData extends Record<string, unknown> {
  label: string;
  nodeType: NodeType;
  description?: string;
  // For action nodes
  actionType?: string;
  // For condition nodes
  condition?: {
    variable?: string;
    operator?: string;
    value?: string;
  };
  // Text content for the node
  content?: string;
  // Variables used in this node
  usedVariables?: string[];
}
