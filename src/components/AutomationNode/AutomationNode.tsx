import { memo } from 'react';
import { Handle, Position, type NodeProps, type Node, useReactFlow } from '@xyflow/react';
import type { AutomationNodeData, ConnectionAxis, ConditionalRule } from '../../types/automation';
import './AutomationNode.css';

function AutomationNode({ data, selected, id }: NodeProps<Node<AutomationNodeData>>) {
  const { deleteElements, setNodes } = useReactFlow();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteElements({ nodes: [{ id }] });
  };

  const handleAddAxis = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newAxis: ConnectionAxis = {
      id: `axis-${Date.now()}`,
      label: `Rule ${(data.connectionAxes?.length || 0) + 1}`,
      rules: [],
    };

    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                connectionAxes: [...((node.data as AutomationNodeData).connectionAxes || []), newAxis],
              },
            }
          : node
      )
    );
  };

  const handleRemoveAxis = (e: React.MouseEvent, axisId: string) => {
    e.stopPropagation();
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                connectionAxes: ((node.data as AutomationNodeData).connectionAxes || []).filter(
                  (axis: ConnectionAxis) => axis.id !== axisId
                ),
              },
            }
          : node
      )
    );
  };

  const handleAddRule = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newRule: ConditionalRule = {
      id: `rule-${Date.now()}`,
      label: `Rule ${(data.conditionalRules?.length || 0) + 1}`,
      logicOperator: 'AND',
      conditions: [{
        variable: '',
        operator: '==',
        value: '',
      }],
    };

    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                conditionalRules: [...((node.data as AutomationNodeData).conditionalRules || []), newRule],
              },
            }
          : node
      )
    );
  };

  const handleRemoveRule = (e: React.MouseEvent, ruleId: string) => {
    e.stopPropagation();
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                conditionalRules: ((node.data as AutomationNodeData).conditionalRules || []).filter(
                  (rule: ConditionalRule) => rule.id !== ruleId
                ),
              },
            }
          : node
      )
    );
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

      {data.nodeType === 'condition' && data.condition && !data.conditionalRules?.length && (
        <div className="automation-node__condition">
          {data.condition.variable} {data.condition.operator} {data.condition.value}
        </div>
      )}

      {/* Display conditional rules for switch-case behavior */}
      {data.nodeType === 'condition' && data.conditionalRules && data.conditionalRules.length > 0 && (
        <div className="automation-node__rules-section">
          {data.conditionalRules.map((rule) => (
            <div key={rule.id} className="automation-node__rule">
              <span className="automation-node__rule-label">{rule.label}</span>
              <button
                className="automation-node__rule-remove"
                onClick={(e) => handleRemoveRule(e, rule.id)}
                title="Remove rule"
              >
                ×
              </button>
            </div>
          ))}
          <button
            className="automation-node__add-rule-btn"
            onClick={handleAddRule}
            title="Add conditional rule"
          >
            + Add Rule
          </button>
        </div>
      )}

      {data.nodeType === 'action' && data.actionType && (
        <div className="automation-node__action-type">{data.actionType}</div>
      )}

      {/* Multiple axes feature for action and condition nodes */}
      {data.allowMultipleAxes && (
        <div className="automation-node__axes-section">
          {data.connectionAxes && data.connectionAxes.length > 0 && (
            <div className="automation-node__axes-list">
              {data.connectionAxes.map((axis) => (
                <div key={axis.id} className="automation-node__axis">
                  <span className="automation-node__axis-label">{axis.label}</span>
                  <button
                    className="automation-node__axis-remove"
                    onClick={(e) => handleRemoveAxis(e, axis.id)}
                    title="Remove axis"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          <button
            className="automation-node__add-axis-btn"
            onClick={handleAddAxis}
            title="Add connection axis"
          >
            + Add Rule
          </button>
        </div>
      )}

      {data.nodeType !== 'end' && (
        <Handle type="source" position={Position.Right} />
      )}

      {/* Render custom handles for connection axes */}
      {data.allowMultipleAxes && data.connectionAxes && data.connectionAxes.length > 0 && (
        <>
          {data.connectionAxes.map((axis, index) => {
            const totalAxes = data.connectionAxes?.length || 1;
            const offset = ((index + 1) / (totalAxes + 1)) * 100;
            return (
              <Handle
                key={axis.id}
                type="source"
                position={Position.Right}
                id={axis.id}
                style={{
                  top: `${offset}%`,
                  background: '#8b5cf6',
                }}
              />
            );
          })}
        </>
      )}

      {data.nodeType === 'condition' && (
        <>
          {/* If using new rule-based system, render handle for each rule */}
          {data.conditionalRules && data.conditionalRules.length > 0 ? (
            <>
              {data.conditionalRules.map((rule, index) => {
                const totalRules = data.conditionalRules?.length || 1;
                const offset = ((index + 1) / (totalRules + 1)) * 100;
                return (
                  <Handle
                    key={rule.id}
                    type="source"
                    position={Position.Right}
                    id={rule.id}
                    style={{
                      top: `${offset}%`,
                      background: '#10b981',
                    }}
                  />
                );
              })}
              {/* Default/else output at the bottom */}
              <Handle
                type="source"
                position={Position.Bottom}
                id="default"
                style={{ left: '50%', background: '#ef4444' }}
              />
            </>
          ) : (
            <>
              {/* Legacy true/false outputs */}
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
        </>
      )}
    </div>
  );
}

export default memo(AutomationNode);
