import { memo } from 'react';
import { Handle, Position, type NodeProps, type Node, useReactFlow } from '@xyflow/react';
import type { DiagramNodeData } from '../../utils/flowUtils';
import './DiagramNode.css';

function DiagramNode({ data, selected, id }: NodeProps<Node<DiagramNodeData>>) {
  const { deleteElements } = useReactFlow();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteElements({ nodes: [{ id }] });
  };

  return (
    <div className={`diagram-node ${selected ? 'diagram-node--selected' : ''}`}>
      <Handle type="target" position={Position.Top} />

      <button
        className="diagram-node__delete"
        onClick={handleDelete}
        title="Delete node"
      >
        ×
      </button>

      <div className="diagram-node__icon">{data.icon}</div>
      <div className="diagram-node__label">{data.label}</div>
      {data.description && (
        <div className="diagram-node__desc">{data.description}</div>
      )}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export default memo(DiagramNode);
