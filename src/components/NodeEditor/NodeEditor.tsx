import { useState, useEffect } from 'react';
import type { Node } from '@xyflow/react';
import type { AutomationNodeData, AutomationVariable } from '../../types/automation';
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
      updates.condition = {
        variable: conditionVariable,
        operator: conditionOperator,
        value: conditionValue,
      };
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
