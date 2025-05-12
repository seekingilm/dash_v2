const isOutFromParent = (node, parent) => {
  return (
    node.position.x < -node.width ||
    node.position.y < -node.height ||
    node.position.y > parent.height ||
    node.position.x > parent.width
  );
};

const isInsideNewParent = (node, parent) => {
  const nodePosition = node.positionAbsolute || node.position;

  return (
    node.parentNode !== parent.id &&
    nodePosition.x > parent.position.x &&
    nodePosition.y > parent.position.y &&
    nodePosition.y + node.height < parent.height + parent.position.y &&
    nodePosition.x + node.width < parent.width + parent.position.x
  );
};

export const useGroups = (nodes, setNodes) => {
  const updateNodeGroup = (node) => {
    if (node.data.isGroup) return;
    const parent = nodes.find((n) => n.id === node.parentNode);
    const newParent = nodes.find(
      (n) => n.data.isGroup && isInsideNewParent(node, n),
    );
    if (parent && isOutFromParent(node, parent)) {
      const newNode = {
        ...node,
        position: newParent
          ? {
              x: node.positionAbsolute.x - newParent.position.x,
              y: node.positionAbsolute.y - newParent.position.y,
            }
          : node.positionAbsolute,
        parentNode: newParent ? newParent.id : undefined,
      };
      setNodes((ns) => ns.map((n) => (n.id === node.id ? newNode : n)));
    } else if (!parent && newParent) {
      const newNode = {
        ...node,
        position: {
          x: node.position.x - newParent.position.x,
          y: node.position.y - newParent.position.y,
        },
        parentNode: newParent.id,
      };
      setNodes((ns) => ns.map((n) => (n.id === node.id ? newNode : n)));
    }
  };

  return { updateNodeGroup };
};
