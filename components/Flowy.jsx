import { useCallback, useEffect, useReducer, useState } from 'react';

import ReactFlow, {
  addEdge,
  Background,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  MiniMap,
  Controls,
} from 'react-flow-renderer';

import { useDrop } from './hooks/useDrop';
import Sidebar from './Sidebar2';

import Editor from './editor/Editor';
import CustomNode from './nodes/CustomNode';
import { useGroups } from './hooks/useGroups';
import MultiTargetNode from './nodes/MultiTargetNode';
import MultiSourceNode from './nodes/MultiSourceNode';

import '../public/flowStyles.css'

const nodeTypes = {
  customNode: CustomNode,
  multiTargetNode: MultiTargetNode,
  multiSourceNode: MultiSourceNode,
};

function Flowy({ initial}){
  const [nodes, setNodes, onNodesChange] = useNodesState(initial.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initial.edges);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const { onDrop, reactFlowWrapperRef, onDragOver } = useDrop(reactFlowInstance, setNodes);
  const { updateNodeGroup } = useGroups(nodes, setNodes);

  const onConnect = useCallback((connection) => {
    setEdges((eds) => addEdge(connection, eds));
  }, []);

  const onNodeDragStop = (event, node) => updateNodeGroup(node);

  const downloadJson = (e) => {
    const obj = { nodes, edges };
    const data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj));
    e.target.setAttribute("href", "data:"+data);
    e.target.setAttribute("download", "data.json");
  }

  return (
    <ReactFlowProvider>
      <div className="header">
        <a className="download" onClick={downloadJson}>Download JSON</a>
      </div>
      <div className="app">
        <div className="sidebar">
          <Sidebar />
        </div>
        <div className="chart" ref={reactFlowWrapperRef}>
        </div>
        <Editor />
      </div>
    </ReactFlowProvider>
  );
}

export default Flowy
