import { useRef, useCallback } from 'react';
import { v4 as uuid } from 'uuid';

// node types object
const typeData = {
  customNode: {
    target: [],
    source: [],
  },
  multiTargetNode: {
    target: [],
  },
  multiSourceNode: {
    source: [],
  },
}

export const useDrop = (reactFlowInstance, setNodes) => {
  const reactFlowWrapperRef = useRef(null);
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapperRef.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const newNode = {
        id: uuid(),
        sourcePosition: 'right',
        targetPosition: 'left',
        style: {
          width: 150,
          height: 40
        },
        type,
        position,
        data: { label: `${type} node`, ...typeData[type] },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return {reactFlowWrapperRef, onDrop, onDragOver}
}