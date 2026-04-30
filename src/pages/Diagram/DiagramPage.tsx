import { useState, useCallback, useMemo } from 'react';
import {
  ReactFlow,
  addEdge,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  type Node,
  type Edge,
  type OnConnect,
  type OnNodesChange,
  type OnEdgesChange,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import DiagramNode from '../../components/DiagramNode/DiagramNode';
import EdgeDeleteButton from '../../components/EdgeDeleteButton/EdgeDeleteButton';
import type { DiagramNodeData } from '../../utils/flowUtils';
import { INITIAL_NODES, INITIAL_EDGES } from '../../utils/flowUtils';
import './DiagramPage.css';

const nodeTypes = {
  diagramNode: DiagramNode,
};

const edgeTypes = {
  default: EdgeDeleteButton,
};

function DiagramPage() {
  const [nodes, setNodes] = useState<Node<DiagramNodeData>[]>(INITIAL_NODES);
  const [edges, setEdges] = useState<Edge[]>(INITIAL_EDGES);
  const [selectedCount, setSelectedCount] = useState<number>(0);

  const onNodesChange = useCallback<OnNodesChange<Node<DiagramNodeData>>>(
    (changes) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
      const selectChanges = changes.filter((c) => c.type === 'select');
      if (selectChanges.length > 0) {
        setSelectedCount((prev) => {
          const added = selectChanges.filter(
            (c) => c.type === 'select' && c.selected,
          ).length;
          const removed = selectChanges.filter(
            (c) => c.type === 'select' && !c.selected,
          ).length;
          return Math.max(0, prev + added - removed);
        });
      }
    },
    [],
  );

  const onEdgesChange = useCallback<OnEdgesChange>(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );

  const onConnect = useCallback<OnConnect>(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [],
  );

  const stats = useMemo(
    () => ({ nodes: nodes.length, edges: edges.length }),
    [nodes.length, edges.length],
  );

  return (
    <div className="diagram-page">
      <div className="diagram-page__header">
        <h1 className="diagram-page__title">Interactive Diagram</h1>
        <div className="diagram-page__stats">
          <span className="diagram-page__stat">
            <strong>{stats.nodes}</strong> nodes
          </span>
          <span className="diagram-page__stat">
            <strong>{stats.edges}</strong> edges
          </span>
          {selectedCount > 0 && (
            <span className="diagram-page__stat diagram-page__stat--highlight">
              <strong>{selectedCount}</strong> selected
            </span>
          )}
        </div>
      </div>

      <div className="diagram-page__canvas">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
          <Controls />
          <MiniMap nodeStrokeWidth={3} pannable zoomable />
        </ReactFlow>
      </div>

      <p className="diagram-page__hint">
        Drag nodes to rearrange · Click and drag from a handle to connect nodes
      </p>
    </div>
  );
}

export default DiagramPage;
