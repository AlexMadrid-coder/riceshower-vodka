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
import AutomationNode from '../../components/AutomationNode/AutomationNode';
import FlowSidebar from '../../components/FlowSidebar/FlowSidebar';
import type { AutomationNodeData, AutomationVariable, NodeType } from '../../types/automation';
import './AutomationFlowPage.css';

const nodeTypes = {
  automationNode: AutomationNode,
};

const INITIAL_NODES: Node<AutomationNodeData>[] = [
  {
    id: '1',
    type: 'automationNode',
    position: { x: 250, y: 50 },
    data: {
      label: 'Flow Start',
      nodeType: 'start',
      description: 'Begin automation',
    },
  },
];

const INITIAL_EDGES: Edge[] = [];

function AutomationFlowPage() {
  const [nodes, setNodes] = useState<Node<AutomationNodeData>[]>(INITIAL_NODES);
  const [edges, setEdges] = useState<Edge[]>(INITIAL_EDGES);
  const [variables, setVariables] = useState<AutomationVariable[]>([]);
  const [nodeIdCounter, setNodeIdCounter] = useState(2);

  const onNodesChange = useCallback<OnNodesChange<Node<AutomationNodeData>>>(
    (changes) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
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

  const handleAddNode = useCallback((nodeType: NodeType) => {
    const newNode: Node<AutomationNodeData> = {
      id: String(nodeIdCounter),
      type: 'automationNode',
      position: {
        x: Math.random() * 400 + 100,
        y: Math.random() * 400 + 100,
      },
      data: {
        label: `${nodeType.charAt(0).toUpperCase() + nodeType.slice(1)} ${nodeIdCounter}`,
        nodeType,
        description: nodeType === 'action' ? 'Configure action' : undefined,
        actionType: nodeType === 'action' ? 'Send Email' : undefined,
        condition: nodeType === 'condition' ? {
          variable: 'var1',
          operator: '==',
          value: 'true',
        } : undefined,
      },
    };

    setNodes((nds) => [...nds, newNode]);
    setNodeIdCounter((c) => c + 1);
  }, [nodeIdCounter]);

  const handleAddVariable = useCallback((variable: Omit<AutomationVariable, 'id'>) => {
    const newVariable: AutomationVariable = {
      ...variable,
      id: `var-${Date.now()}`,
    };
    setVariables((vars) => [...vars, newVariable]);
  }, []);

  const handleDeleteVariable = useCallback((id: string) => {
    setVariables((vars) => vars.filter((v) => v.id !== id));
  }, []);

  const stats = useMemo(
    () => ({
      nodes: nodes.length,
      edges: edges.length,
      variables: variables.length,
    }),
    [nodes.length, edges.length, variables.length],
  );

  return (
    <div className="automation-flow-page">
      <FlowSidebar
        variables={variables}
        onAddVariable={handleAddVariable}
        onDeleteVariable={handleDeleteVariable}
        onAddNode={handleAddNode}
      />

      <div className="automation-flow-page__main">
        <div className="automation-flow-page__header">
          <div>
            <h1 className="automation-flow-page__title">Automation Flow Builder</h1>
            <p className="automation-flow-page__subtitle">
              Design your automation workflow
            </p>
          </div>
          <div className="automation-flow-page__stats">
            <span className="automation-flow-page__stat">
              <strong>{stats.nodes}</strong> nodes
            </span>
            <span className="automation-flow-page__stat">
              <strong>{stats.edges}</strong> connections
            </span>
            <span className="automation-flow-page__stat">
              <strong>{stats.variables}</strong> variables
            </span>
          </div>
        </div>

        <div className="automation-flow-page__canvas">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
            defaultEdgeOptions={{
              animated: true,
              style: { stroke: '#3b82f6', strokeWidth: 2 },
            }}
          >
            <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
            <Controls />
            <MiniMap
              nodeStrokeWidth={3}
              pannable
              zoomable
              style={{
                backgroundColor: '#f9fafb',
              }}
            />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}

export default AutomationFlowPage;
