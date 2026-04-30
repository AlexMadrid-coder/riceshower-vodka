import { useState } from 'react';
import type { Node } from '@xyflow/react';
import type { AutomationVariable, NodeType, AutomationNodeData } from '../../types/automation';
import './FlowSidebar.css';

interface FlowSidebarProps {
  variables: AutomationVariable[];
  nodes: Node<AutomationNodeData>[];
  onAddVariable: (variable: Omit<AutomationVariable, 'id'>) => void;
  onDeleteVariable: (id: string) => void;
  onAddNode: (nodeType: NodeType) => void;
}

function FlowSidebar({
  variables,
  nodes,
  onAddVariable,
  onDeleteVariable,
  onAddNode,
}: FlowSidebarProps) {
  const [activeTab, setActiveTab] = useState<'nodes' | 'variables'>('nodes');
  const [newVarName, setNewVarName] = useState('');
  const [newVarType, setNewVarType] = useState<'string' | 'number' | 'boolean'>('string');
  const [newVarValue, setNewVarValue] = useState<string>('');

  const handleAddVariable = () => {
    if (!newVarName.trim()) return;

    let value: string | number | boolean = newVarValue;
    if (newVarType === 'number') {
      value = parseFloat(newVarValue) || 0;
    } else if (newVarType === 'boolean') {
      value = newVarValue.toLowerCase() === 'true';
    }

    onAddVariable({
      name: newVarName,
      type: newVarType,
      value,
    });

    setNewVarName('');
    setNewVarValue('');
  };

  const nodeTypes: { type: NodeType; label: string; icon: string; description: string }[] = [
    { type: 'start', label: 'Start', icon: '▶️', description: 'Beginning of flow' },
    { type: 'action', label: 'Action', icon: '⚡', description: 'Execute an action' },
    { type: 'condition', label: 'Condition', icon: '❓', description: 'Conditional branch' },
    { type: 'end', label: 'End', icon: '🏁', description: 'End of flow' },
  ];

  const getNodesUsingVariable = (variableId: string) => {
    return nodes.filter((node) =>
      node.data.usedVariables?.includes(variableId)
    );
  };

  return (
    <div className="flow-sidebar">
      <div className="flow-sidebar__header">
        <h2 className="flow-sidebar__title">Automation Flow</h2>
      </div>

      <div className="flow-sidebar__tabs">
        <button
          className={`flow-sidebar__tab ${activeTab === 'nodes' ? 'flow-sidebar__tab--active' : ''}`}
          onClick={() => setActiveTab('nodes')}
        >
          Nodes
        </button>
        <button
          className={`flow-sidebar__tab ${activeTab === 'variables' ? 'flow-sidebar__tab--active' : ''}`}
          onClick={() => setActiveTab('variables')}
        >
          Variables
        </button>
      </div>

      <div className="flow-sidebar__content">
        {activeTab === 'nodes' && (
          <div className="flow-sidebar__section">
            <p className="flow-sidebar__hint">Click to add a node to the canvas</p>
            <div className="flow-sidebar__node-list">
              {nodeTypes.map((nodeType) => (
                <button
                  key={nodeType.type}
                  className={`flow-sidebar__node-btn flow-sidebar__node-btn--${nodeType.type}`}
                  onClick={() => onAddNode(nodeType.type)}
                >
                  <span className="flow-sidebar__node-icon">{nodeType.icon}</span>
                  <div className="flow-sidebar__node-info">
                    <div className="flow-sidebar__node-label">{nodeType.label}</div>
                    <div className="flow-sidebar__node-desc">{nodeType.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'variables' && (
          <div className="flow-sidebar__section">
            <div className="flow-sidebar__add-var">
              <h3 className="flow-sidebar__section-title">Add Variable</h3>
              <input
                type="text"
                className="flow-sidebar__input"
                placeholder="Variable name"
                value={newVarName}
                onChange={(e) => setNewVarName(e.target.value)}
              />
              <select
                className="flow-sidebar__select"
                value={newVarType}
                onChange={(e) => setNewVarType(e.target.value as any)}
              >
                <option value="string">String</option>
                <option value="number">Number</option>
                <option value="boolean">Boolean</option>
              </select>
              <input
                type="text"
                className="flow-sidebar__input"
                placeholder="Initial value"
                value={newVarValue}
                onChange={(e) => setNewVarValue(e.target.value)}
              />
              <button className="flow-sidebar__add-btn" onClick={handleAddVariable}>
                Add Variable
              </button>
            </div>

            <div className="flow-sidebar__var-list">
              <h3 className="flow-sidebar__section-title">
                Variables ({variables.length})
              </h3>
              {variables.length === 0 && (
                <p className="flow-sidebar__empty">No variables yet</p>
              )}
              {variables.map((variable) => {
                const nodesUsing = getNodesUsingVariable(variable.id);
                return (
                  <div key={variable.id} className="flow-sidebar__var-item">
                    <div className="flow-sidebar__var-info">
                      <div className="flow-sidebar__var-name">{variable.name}</div>
                      <div className="flow-sidebar__var-type">
                        {variable.type}: {String(variable.value)}
                      </div>
                      {nodesUsing.length > 0 && (
                        <div className="flow-sidebar__var-usage">
                          Used in: {nodesUsing.map(n => n.data.label).join(', ')}
                        </div>
                      )}
                    </div>
                    <button
                      className="flow-sidebar__delete-btn"
                      onClick={() => onDeleteVariable(variable.id)}
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FlowSidebar;
