import { type NodeType } from '../../types/automation';
import './NodeSelector.css';

interface NodeSelectorProps {
  position: { x: number; y: number };
  onSelectNodeType: (nodeType: NodeType) => void;
  onClose: () => void;
}

const NODE_OPTIONS: { type: NodeType; label: string; icon: string }[] = [
  { type: 'start', label: 'Start', icon: '▶️' },
  { type: 'action', label: 'Action', icon: '⚡' },
  { type: 'condition', label: 'Condition', icon: '❓' },
  { type: 'end', label: 'End', icon: '🏁' },
];

function NodeSelector({ position, onSelectNodeType, onClose }: NodeSelectorProps) {
  return (
    <>
      <div className="node-selector-overlay" onClick={onClose} />
      <div
        className="node-selector"
        style={{
          left: position.x,
          top: position.y,
        }}
      >
        <div className="node-selector__header">Select Node Type</div>
        <div className="node-selector__options">
          {NODE_OPTIONS.map((option) => (
            <button
              key={option.type}
              className="node-selector__option"
              onClick={() => onSelectNodeType(option.type)}
            >
              <span className="node-selector__icon">{option.icon}</span>
              <span className="node-selector__label">{option.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

export default NodeSelector;
