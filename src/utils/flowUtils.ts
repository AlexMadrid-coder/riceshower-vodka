import type { Node, Edge } from '@xyflow/react';

export interface DiagramNodeData extends Record<string, unknown> {
  label: string;
  icon: string;
  description?: string;
}

export const INITIAL_NODES: Node<DiagramNodeData>[] = [
  {
    id: 'browser',
    type: 'diagramNode',
    position: { x: 250, y: 0 },
    data: { label: 'Browser', icon: '🌐', description: 'User interface' },
  },
  {
    id: 'router',
    type: 'diagramNode',
    position: { x: 250, y: 150 },
    data: { label: 'React Router', icon: '🧭', description: 'Client routing' },
  },
  {
    id: 'home',
    type: 'diagramNode',
    position: { x: 50, y: 300 },
    data: { label: 'Home Page', icon: '🏠', description: 'Route /' },
  },
  {
    id: 'diagram',
    type: 'diagramNode',
    position: { x: 450, y: 300 },
    data: { label: 'Diagram Page', icon: '🔗', description: 'Route /diagram' },
  },
  {
    id: 'reactflow',
    type: 'diagramNode',
    position: { x: 450, y: 460 },
    data: {
      label: '@xyflow/react',
      icon: '⚡',
      description: 'Node-based canvas',
    },
  },
  {
    id: 'state',
    type: 'diagramNode',
    position: { x: 50, y: 460 },
    data: {
      label: 'React State',
      icon: '🪝',
      description: 'useState / useReducer',
    },
  },
];

export const INITIAL_EDGES: Edge[] = [
  {
    id: 'browser-router',
    source: 'browser',
    target: 'router',
    animated: true,
    label: 'navigates',
  },
  {
    id: 'router-home',
    source: 'router',
    target: 'home',
    label: '/'
  },
  {
    id: 'router-diagram',
    source: 'router',
    target: 'diagram',
    label: '/diagram',
  },
  {
    id: 'diagram-reactflow',
    source: 'diagram',
    target: 'reactflow',
    animated: true,
    label: 'renders',
  },
  {
    id: 'home-state',
    source: 'home',
    target: 'state',
    animated: true,
    label: 'uses',
  },
];
