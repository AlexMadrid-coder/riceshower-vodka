import { useState, useEffect } from 'react';
import type { Node } from '@xyflow/react';
import type { AutomationNodeData, AutomationVariable, ConditionalRule, Condition } from '../../types/automation';
import './NodeEditor.css';

interface NodeEditorProps {
  node: Node<AutomationNodeData> | null;
  variables: AutomationVariable[];
  onUpdateNode: (nodeId: string, data: Partial<AutomationNodeData>) => void;
  onClose: () => void;
}

function NodeEditor({ node, variables, onUpdateNode, onClose }: NodeEditorProps) {
  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [actionType, setActionType] = useState('');
  const [conditionVariable, setConditionVariable] = useState('');
  const [conditionOperator, setConditionOperator] = useState('==');
  const [conditionValue, setConditionValue] = useState('');
  const [selectedVariables, setSelectedVariables] = useState<string[]>([]);
  const [conditionalRules, setConditionalRules] = useState<ConditionalRule[]>([]);

  useEffect(() => {
    if (node) {
      setLabel(node.data.label || '');
      setDescription(node.data.description || '');
      setContent(node.data.content || '');
      setActionType(node.data.actionType || 'Send Email');
      setConditionVariable(node.data.condition?.variable || '');
      setConditionOperator(node.data.condition?.operator || '==');
      setConditionValue(node.data.condition?.value || '');
      setSelectedVariables(node.data.usedVariables || []);
      setConditionalRules(node.data.conditionalRules || []);
    }
  }, [node]);

  if (!node) return null;

  const handleSave = () => {
    const updates: Partial<AutomationNodeData> = {
      label,
      description,
      content,
      usedVariables: selectedVariables,
    };

    if (node.data.nodeType === 'action') {
      updates.actionType = actionType;
    }

    if (node.data.nodeType === 'condition') {
      if (conditionalRules.length > 0) {
        updates.conditionalRules = conditionalRules;
      } else {
        updates.condition = {
          variable: conditionVariable,
          operator: conditionOperator,
          value: conditionValue,
        };
      }
    }

    onUpdateNode(node.id, updates);
    onClose();
  };

  const toggleVariable = (varId: string) => {
    setSelectedVariables((prev) =>
      prev.includes(varId)
        ? prev.filter((id) => id !== varId)
        : [...prev, varId]
    );
  };

  const handleAddRule = () => {
    const newRule: ConditionalRule = {
      id: `rule-${Date.now()}`,
      label: `Rule ${conditionalRules.length + 1}`,
      logicOperator: 'AND',
      conditions: [{
        variable: '',
        operator: '==',
        value: '',
      }],
    };
    setConditionalRules([...conditionalRules, newRule]);
  };

  const handleRemoveRule = (ruleId: string) => {
    setConditionalRules(conditionalRules.filter(r => r.id !== ruleId));
  };

  const handleUpdateRuleLabel = (ruleId: string, label: string) => {
    setConditionalRules(conditionalRules.map(r =>
      r.id === ruleId ? { ...r, label } : r
    ));
  };

  const handleUpdateRuleLogicOperator = (ruleId: string, logicOperator: 'AND' | 'OR') => {
    setConditionalRules(conditionalRules.map(r =>
      r.id === ruleId ? { ...r, logicOperator } : r
    ));
  };

  const handleAddCondition = (ruleId: string) => {
    setConditionalRules(conditionalRules.map(r =>
      r.id === ruleId
        ? {
            ...r,
            conditions: [...r.conditions, { variable: '', operator: '==', value: '' }],
          }
        : r
    ));
  };

  const handleRemoveCondition = (ruleId: string, conditionIndex: number) => {
    setConditionalRules(conditionalRules.map(r =>
      r.id === ruleId
        ? {
            ...r,
            conditions: r.conditions.filter((_, i) => i !== conditionIndex),
          }
        : r
    ));
  };

  const handleUpdateCondition = (
    ruleId: string,
    conditionIndex: number,
    field: keyof Condition,
    value: string
  ) => {
    setConditionalRules(conditionalRules.map(r =>
      r.id === ruleId
        ? {
            ...r,
            conditions: r.conditions.map((c, i) =>
              i === conditionIndex ? { ...c, [field]: value } : c
            ),
          }
        : r
    ));
  };

  return (
    <div className="node-editor">
      <div className="node-editor__header">
        <h2 className="node-editor__title">Edit Node</h2>
        <button className="node-editor__close" onClick={onClose}>
          ✕
        </button>
      </div>

      <div className="node-editor__content">
        <div className="node-editor__section">
          <label className="node-editor__label">
            Node Type
            <div className="node-editor__node-type">{node.data.nodeType}</div>
          </label>
        </div>

        <div className="node-editor__section">
          <label className="node-editor__label">
            Label
            <input
              type="text"
              className="node-editor__input"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </label>
        </div>

        <div className="node-editor__section">
          <label className="node-editor__label">
            Description
            <input
              type="text"
              className="node-editor__input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
        </div>

        {node.data.nodeType === 'action' && (
          <div className="node-editor__section">
            <label className="node-editor__label">
              Action Type
              <select
                className="node-editor__select"
                value={actionType}
                onChange={(e) => setActionType(e.target.value)}
              >
                <option value="Send Email">Send Email</option>
                <option value="HTTP Request">HTTP Request</option>
                <option value="Database Query">Database Query</option>
                <option value="Delay">Delay</option>
                <option value="Transform Data">Transform Data</option>
              </select>
            </label>
          </div>
        )}

        {node.data.nodeType === 'condition' && (
          <>
            <div className="node-editor__section">
              <label className="node-editor__label">
                Condition Mode
                <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    className="node-editor__button"
                    style={{
                      flex: 1,
                      background: conditionalRules.length === 0 ? 'var(--color-primary)' : '#f3f4f6',
                      color: conditionalRules.length === 0 ? 'white' : 'var(--color-text)',
                    }}
                    onClick={() => setConditionalRules([])}
                  >
                    Simple
                  </button>
                  <button
                    type="button"
                    className="node-editor__button"
                    style={{
                      flex: 1,
                      background: conditionalRules.length > 0 ? 'var(--color-primary)' : '#f3f4f6',
                      color: conditionalRules.length > 0 ? 'white' : 'var(--color-text)',
                    }}
                    onClick={() => {
                      if (conditionalRules.length === 0) {
                        handleAddRule();
                      }
                    }}
                  >
                    Switch/Case
                  </button>
                </div>
              </label>
            </div>

            {conditionalRules.length === 0 ? (
              <>
                <div className="node-editor__section">
                  <label className="node-editor__label">
                    Condition Variable
                    <select
                      className="node-editor__select"
                      value={conditionVariable}
                      onChange={(e) => setConditionVariable(e.target.value)}
                    >
                      <option value="">Select variable...</option>
                      {variables.map((v) => (
                        <option key={v.id} value={v.name}>
                          {v.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="node-editor__section">
                  <label className="node-editor__label">
                    Operator
                    <select
                      className="node-editor__select"
                      value={conditionOperator}
                      onChange={(e) => setConditionOperator(e.target.value)}
                    >
                      <option value="==">=</option>
                      <option value="!=">!=</option>
                      <option value=">">&gt;</option>
                      <option value="<">&lt;</option>
                      <option value=">=">&gt;=</option>
                      <option value="<=">&lt;=</option>
                    </select>
                  </label>
                </div>

                <div className="node-editor__section">
                  <label className="node-editor__label">
                    Value
                    <input
                      type="text"
                      className="node-editor__input"
                      value={conditionValue}
                      onChange={(e) => setConditionValue(e.target.value)}
                    />
                  </label>
                </div>
              </>
            ) : (
              <div className="node-editor__section">
                <label className="node-editor__label">
                  Conditional Rules (Switch/Case)
                </label>
                {conditionalRules.map((rule) => (
                  <div key={rule.id} style={{
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    padding: '12px',
                    marginBottom: '12px',
                    background: '#f9fafb'
                  }}>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                      <input
                        type="text"
                        className="node-editor__input"
                        value={rule.label}
                        onChange={(e) => handleUpdateRuleLabel(rule.id, e.target.value)}
                        placeholder="Rule label"
                        style={{ flex: 1 }}
                      />
                      <select
                        className="node-editor__select"
                        value={rule.logicOperator}
                        onChange={(e) => handleUpdateRuleLogicOperator(rule.id, e.target.value as 'AND' | 'OR')}
                        style={{ width: '80px' }}
                      >
                        <option value="AND">AND</option>
                        <option value="OR">OR</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => handleRemoveRule(rule.id)}
                        style={{
                          background: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '6px 10px',
                          cursor: 'pointer',
                          fontSize: '14px',
                        }}
                      >
                        ×
                      </button>
                    </div>

                    {rule.conditions.map((condition, condIndex) => (
                      <div key={condIndex} style={{
                        display: 'flex',
                        gap: '8px',
                        marginBottom: '8px',
                        alignItems: 'center'
                      }}>
                        <select
                          className="node-editor__select"
                          value={condition.variable}
                          onChange={(e) => handleUpdateCondition(rule.id, condIndex, 'variable', e.target.value)}
                          style={{ flex: 1 }}
                        >
                          <option value="">Variable...</option>
                          {variables.map((v) => (
                            <option key={v.id} value={v.name}>
                              {v.name}
                            </option>
                          ))}
                        </select>
                        <select
                          className="node-editor__select"
                          value={condition.operator}
                          onChange={(e) => handleUpdateCondition(rule.id, condIndex, 'operator', e.target.value)}
                          style={{ width: '70px' }}
                        >
                          <option value="==">=</option>
                          <option value="!=">!=</option>
                          <option value=">">&gt;</option>
                          <option value="<">&lt;</option>
                          <option value=">=">&gt;=</option>
                          <option value="<=">&lt;=</option>
                        </select>
                        <input
                          type="text"
                          className="node-editor__input"
                          value={condition.value}
                          onChange={(e) => handleUpdateCondition(rule.id, condIndex, 'value', e.target.value)}
                          placeholder="Value"
                          style={{ flex: 1 }}
                        />
                        {rule.conditions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveCondition(rule.id, condIndex)}
                            style={{
                              background: '#ef4444',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              padding: '4px 8px',
                              cursor: 'pointer',
                              fontSize: '12px',
                            }}
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => handleAddCondition(rule.id)}
                      style={{
                        background: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '6px 12px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        width: '100%',
                      }}
                    >
                      + Add Condition ({rule.logicOperator})
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleAddRule}
                  style={{
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '10px 16px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    width: '100%',
                  }}
                >
                  + Add New Rule
                </button>
              </div>
            )}
          </>
        )}

        <div className="node-editor__section">
          <label className="node-editor__label">
            Content / Text
            <textarea
              className="node-editor__textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter node content or text..."
              rows={4}
            />
          </label>
        </div>

        <div className="node-editor__section">
          <label className="node-editor__label">Variables Used</label>
          <div className="node-editor__variables">
            {variables.length === 0 && (
              <p className="node-editor__empty">No variables available</p>
            )}
            {variables.map((variable) => (
              <label key={variable.id} className="node-editor__checkbox-label">
                <input
                  type="checkbox"
                  className="node-editor__checkbox"
                  checked={selectedVariables.includes(variable.id)}
                  onChange={() => toggleVariable(variable.id)}
                />
                <span className="node-editor__variable-name">{variable.name}</span>
                <span className="node-editor__variable-type">({variable.type})</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="node-editor__footer">
        <button className="node-editor__button node-editor__button--cancel" onClick={onClose}>
          Cancel
        </button>
        <button className="node-editor__button node-editor__button--save" onClick={handleSave}>
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default NodeEditor;
