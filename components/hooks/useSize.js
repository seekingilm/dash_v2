// export const useSize = (nodes,node,setNodes) => {
//   const handleWidthChange = (e) => {
//     const width = Number(e.target.value);
//     const changedNode = { ...node };
//     changedNode.style.width = width;
//     changedNode.width = width;
//     changedNode.handleBounds.source = node.handleBounds.source.map(h => ({
//       ...h,
//       x: width - 8
//     }));
//     setNodes(ns => ns.map((n) => n.id === node.id ? changedNode : n));
//   }
// }