import { memo } from 'react';
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { DiagramNodeData } from '../../utils/flowUtils';
import './DiagramNode.css';

function DiagramNode({ data }: NodeProps<Node<DiagramNodeData>>) {
  return (
    <div className="diagram-node">
      <Handle type="target" position={Position.Top} />
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
