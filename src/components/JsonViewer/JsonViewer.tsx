import { useState } from 'react';
import type { Node, Edge } from '@xyflow/react';
import type { AutomationNodeData, AutomationVariable } from '../../types/automation';
import './JsonViewer.css';

interface JsonViewerProps {
  nodes: Node<AutomationNodeData>[];
  edges: Edge[];
  variables: AutomationVariable[];
  onClose: () => void;
}

function JsonViewer({ nodes, edges, variables, onClose }: JsonViewerProps) {
  const [copied, setCopied] = useState(false);

  const flowData = {
    variables,
    nodes: nodes.map((node) => ({
      id: node.id,
      type: node.data.nodeType,
      position: node.position,
      data: node.data,
    })),
    edges: edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle,
      targetHandle: edge.targetHandle,
    })),
  };

  const jsonString = JSON.stringify(flowData, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `automation-flow-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="json-viewer-overlay">
      <div className="json-viewer">
        <div className="json-viewer__header">
          <h2 className="json-viewer__title">Flow JSON</h2>
          <button className="json-viewer__close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="json-viewer__actions">
          <button className="json-viewer__button" onClick={handleCopy}>
            {copied ? '✓ Copied!' : '📋 Copy'}
          </button>
          <button className="json-viewer__button" onClick={handleDownload}>
            💾 Download
          </button>
        </div>

        <div className="json-viewer__content">
          <pre className="json-viewer__pre">
            <code>{jsonString}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}

export default JsonViewer;
