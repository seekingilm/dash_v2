export default () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="dndflow">
      <h4>Inputs</h4>
      <div className="dndnode" onDragStart={(event) => onDragStart(event, 'multiSourceNode')} draggable>
        Multi source node
      </div>
      <div className="dndnode input" onDragStart={(event) => onDragStart(event, 'input')} draggable>
        Input Node
      </div>
      <h4>Two way</h4>
      <div className="dndnode" onDragStart={(event) => onDragStart(event, 'default')} draggable>
        Default Node
      </div>
      <div className="dndnode" onDragStart={(event) => onDragStart(event, 'customNode')} draggable>
        Multi node
      </div>
      <h4>Outputs</h4>
      <div className="dndnode" onDragStart={(event) => onDragStart(event, 'multiTargetNode')} draggable>
        Multi target node
      </div>
      <div className="dndnode" onDragStart={(event) => onDragStart(event, 'output')} draggable>
        Output Node
      </div>
    </aside>
  );
};
