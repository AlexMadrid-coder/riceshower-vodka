import { useState, useCallback, useMemo, useRef } from 'react';
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
  type NodeMouseHandler,
  type OnConnectEnd,
  useReactFlow,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import AutomationNode from '../../components/AutomationNode/AutomationNode';
import EdgeDeleteButton from '../../components/EdgeDeleteButton/EdgeDeleteButton';
import NodeSelector from '../../components/NodeSelector/NodeSelector';
import FlowSidebar from '../../components/FlowSidebar/FlowSidebar';
import NodeEditor from '../../components/NodeEditor/NodeEditor';
import JsonViewer from '../../components/JsonViewer/JsonViewer';
import { useTheme } from '../../contexts/ThemeContext';
import type { AutomationNodeData, AutomationVariable, NodeType } from '../../types/automation';
import './AutomationFlowPage.css';

const nodeTypes = {
  automationNode: AutomationNode,
};

const edgeTypes = {
  default: EdgeDeleteButton,
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

function AutomationFlowPageContent() {
  const [nodes, setNodes] = useState<Node<AutomationNodeData>[]>(INITIAL_NODES);
  const [edges, setEdges] = useState<Edge[]>(INITIAL_EDGES);
  const [variables, setVariables] = useState<AutomationVariable[]>([]);
  const [nodeIdCounter, setNodeIdCounter] = useState(2);
  const [selectedNode, setSelectedNode] = useState<Node<AutomationNodeData> | null>(null);
  const [showJsonViewer, setShowJsonViewer] = useState(false);
  const [nodeSelectorPosition, setNodeSelectorPosition] = useState<{ x: number; y: number } | null>(null);
  const connectingNodeId = useRef<string | null>(null);
  const { theme, toggleTheme } = useTheme();
  const { screenToFlowPosition } = useReactFlow();

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

  const onConnectEnd = useCallback<OnConnectEnd>(
    (event, connectionState) => {
      if (!connectionState.fromNode) return;

      const targetIsPane = (event.target as HTMLElement)?.classList.contains('react-flow__pane');

      if (targetIsPane && event instanceof MouseEvent) {
        connectingNodeId.current = connectionState.fromNode.id;
        setNodeSelectorPosition({ x: event.clientX, y: event.clientY });
      }
    },
    [],
  );

  const handleSelectNodeType = useCallback(
    (nodeType: NodeType) => {
      if (!nodeSelectorPosition || !connectingNodeId.current) return;

      const flowPosition = screenToFlowPosition({
        x: nodeSelectorPosition.x,
        y: nodeSelectorPosition.y,
      });

      const newNode: Node<AutomationNodeData> = {
        id: String(nodeIdCounter),
        type: 'automationNode',
        position: flowPosition,
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
      setEdges((eds) =>
        addEdge(
          {
            source: connectingNodeId.current!,
            target: newNode.id,
          },
          eds,
        ),
      );
      setNodeIdCounter((c) => c + 1);
      setNodeSelectorPosition(null);
      connectingNodeId.current = null;
    },
    [nodeSelectorPosition, nodeIdCounter, screenToFlowPosition],
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

  const handleUpdateNode = useCallback((nodeId: string, data: Partial<AutomationNodeData>) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...data } }
          : node
      )
    );
  }, []);

  const handleNodeClick: NodeMouseHandler = useCallback((_event, node) => {
    setSelectedNode(node as Node<AutomationNodeData>);
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
        nodes={nodes}
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
          <div className="automation-flow-page__header-actions">
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
            <button
              className="automation-flow-page__theme-btn"
              onClick={toggleTheme}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <button
              className="automation-flow-page__json-btn"
              onClick={() => setShowJsonViewer(true)}
            >
              📄 View JSON
            </button>
          </div>
        </div>

        <div className="automation-flow-page__canvas">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onConnectEnd={onConnectEnd}
            onNodeClick={handleNodeClick}
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

      {selectedNode && (
        <NodeEditor
          node={selectedNode}
          variables={variables}
          onUpdateNode={handleUpdateNode}
          onClose={() => setSelectedNode(null)}
        />
      )}

      {showJsonViewer && (
        <JsonViewer
          nodes={nodes}
          edges={edges}
          variables={variables}
          onClose={() => setShowJsonViewer(false)}
        />
      )}

      {nodeSelectorPosition && (
        <NodeSelector
          position={nodeSelectorPosition}
          onSelectNodeType={handleSelectNodeType}
          onClose={() => {
            setNodeSelectorPosition(null);
            connectingNodeId.current = null;
          }}
        />
      )}
    </div>
  );
}

function AutomationFlowPage() {
  return (
    <ReactFlowProvider>
      <AutomationFlowPageContent />
    </ReactFlowProvider>
  );
}

export default AutomationFlowPage;
