import { memo } from 'react';
import { Handle, Position, type NodeProps, type Node, useReactFlow } from '@xyflow/react';
import type { AutomationNodeData } from '../../types/automation';
import './AutomationNode.css';

function AutomationNode({ data, selected, id }: NodeProps<Node<AutomationNodeData>>) {
  const { deleteElements } = useReactFlow();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteElements({ nodes: [{ id }] });
  };
  const getNodeIcon = () => {
    switch (data.nodeType) {
      case 'start':
        return '▶️';
      case 'action':
        return '⚡';
      case 'condition':
        return '❓';
      case 'end':
        return '🏁';
      default:
        return '📦';
    }
  };

  const getNodeClass = () => {
    return `automation-node automation-node--${data.nodeType} ${selected ? 'automation-node--selected' : ''}`;
  };

  return (
    <div className={getNodeClass()}>
      {data.nodeType !== 'start' && (
        <Handle type="target" position={Position.Left} />
      )}

      <button
        className="automation-node__delete"
        onClick={handleDelete}
        title="Delete node"
      >
        ×
      </button>

      <div className="automation-node__header">
        <span className="automation-node__icon">{getNodeIcon()}</span>
        <span className="automation-node__type">{data.nodeType}</span>
      </div>

      <div className="automation-node__label">{data.label}</div>

      {data.description && (
        <div className="automation-node__desc">{data.description}</div>
      )}

      {data.nodeType === 'condition' && data.condition && (
        <div className="automation-node__condition">
          {data.condition.variable} {data.condition.operator} {data.condition.value}
        </div>
      )}

      {data.nodeType === 'action' && data.actionType && (
        <div className="automation-node__action-type">{data.actionType}</div>
      )}

      {data.nodeType !== 'end' && (
        <Handle type="source" position={Position.Right} />
      )}

      {data.nodeType === 'condition' && (
        <>
          <Handle
            type="source"
            position={Position.Top}
            id="true"
            style={{ left: '50%', background: '#10b981' }}
          />
          <Handle
            type="source"
            position={Position.Bottom}
            id="false"
            style={{ left: '50%', background: '#ef4444' }}
          />
        </>
      )}
    </div>
  );
}

export default memo(AutomationNode);
