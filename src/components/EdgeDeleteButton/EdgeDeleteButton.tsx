import { type EdgeProps, getBezierPath, useReactFlow, type Edge } from '@xyflow/react';
import './EdgeDeleteButton.css';

function EdgeDeleteButton({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  selected,
}: EdgeProps<Edge>) {
  const { deleteElements } = useReactFlow();
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const handleDelete = () => {
    deleteElements({ edges: [{ id }] });
  };

  return (
    <>
      <path
        id={id}
        style={style}
        className={`react-flow__edge-path ${selected ? 'react-flow__edge-path--selected' : ''}`}
        d={edgePath}
        markerEnd={markerEnd}
      />
      {selected && (
        <g transform={`translate(${labelX}, ${labelY})`}>
          <foreignObject
            width={28}
            height={28}
            x={-14}
            y={-14}
            className="edge-delete-button__foreign"
          >
            <button
              className="edge-delete-button"
              onClick={handleDelete}
              title="Delete edge"
            >
              ×
            </button>
          </foreignObject>
        </g>
      )}
    </>
  );
}

export default EdgeDeleteButton;
