import { useEffect, useMemo } from "react";
import {
  useNodes,
  useReactFlow,
  useUpdateNodeInternals,
} from "react-flow-renderer";
import debounce from "lodash.debounce";
import { v4 as uuid } from "uuid";

const numberProperties = new Set(["style.width", "style.height"]);

const adjustHandlesXY = (height, handles, type = "target", width) => {
  const gap = height / (handles.length + 1);
  return handles.map((h, i) => ({
    ...h,
    y: gap * (i + 1) - 3,
    x: type === "target" ? -3 : width - 8,
  }));
};

export default () => {
  const nodes = useNodes();
  const node = useMemo(() => {
    return nodes.find((n) => n.selected);
  }, [nodes]);
  const { setNodes, setEdges } = useReactFlow();
  const updateNodeInternals = useUpdateNodeInternals();

  if (!node) return null;

  const handleChange = (e) => {
    const [key, subKey] = e.target.id.split(".");
    const value = numberProperties.has(e.target.id)
      ? Number(e.target.value)
      : e.target.value;
    const changedNode = { ...node };
    changedNode[key] = subKey ? { ...node[key], [subKey]: value } : value;

    setNodes((ns) => ns.map((n) => (n.id === node.id ? changedNode : n)));
    updateNodeInternals(node.id);
  };

  const handleWidthChange = (e) => {
    const width = Number(e.target.value);
    const changedNode = { ...node };
    changedNode.style = {
      ...changedNode.style,
      width,
    };
    changedNode.width = width;
    if (node.handleBounds.source) {
      changedNode.handleBounds.source = node.handleBounds.source.map((h) => ({
        ...h,
        x: width - 8,
      }));
    }
    setNodes((ns) => ns.map((n) => (n.id === node.id ? changedNode : n)));
    updateNodeInternals(node.id);
  };

  const handleHeightChange = (e) => {
    const height = Number(e.target.value);
    const changedNode = { ...node };

    changedNode.style = {
      ...changedNode.style,
      height,
    };
    changedNode.height = height;

    if (node.handleBounds.source) {
      changedNode.handleBounds.source = adjustHandlesXY(
        height,
        node.handleBounds.source,
        "source",
        node.width,
      );
    }

    if (node.handleBounds.target) {
      changedNode.handleBounds.target = adjustHandlesXY(
        height,
        node.handleBounds.target,
      );
    }

    setNodes((ns) => ns.map((n) => (n.id === node.id ? changedNode : n)));
    updateNodeInternals(node.id);
  };

  const onIsGroupChange = () => {
    setNodes((ns) =>
      ns.map((n) => {
        // update node
        if (n.id === node.id) {
          return {
            ...node,
            data: {
              ...node.data,
              isGroup: !Boolean(node.data.isGroup),
            },
          };
        }

        // free up children
        if (!node.isGroup && n.parentNode === node.id) {
          return {
            ...n,
            parentNode: undefined,
            position: n.positionAbsolute,
          };
        }
        return n;
      }),
    );
    updateNodeInternals(node.id);
  };

  const deleteNode = () => {
    setNodes((ns) => ns.filter((n) => n.id !== node.id));
    setEdges((es) =>
      es.filter((e) => e.source !== node.id && e.target !== node.id),
    );
  };

  const changeHandle = (type, id, key) => (e) => {
    const newTarget = node.data[type].map((i) =>
      i.id === id ? { ...i, [key]: e.target.value } : i,
    );

    setNodes((ns) =>
      ns.map((n) =>
        n.id === node.id
          ? {
              ...n,
              data: {
                ...n.data,
                [type]: newTarget,
              },
            }
          : n,
      ),
    );
    updateNodeInternals(node.id);
  };

  const addHandle = (type) => () => {
    const id = uuid();
    const newInput = { id, color: "#000000", name: `New ${type}` };
    const newHandle = {
      position: type === "target" ? "left" : "right",
      height: 8,
      width: 8,
      id,
    };
    setNodes((ns) =>
      ns.map((n) => {
        if (n.id !== node.id) return n;
        const newTarget = n.data[type]
          ? [...n.data[type], newInput]
          : [newInput];
        const newHandles = n.handleBounds[type]
          ? [...n.handleBounds[type], newHandle]
          : [newHandle];
        return {
          ...n,
          data: { ...n.data, [type]: newTarget },
          handleBounds: {
            ...n.handleBounds,
            [type]: adjustHandlesXY(n.height, newHandles, type, n.width),
          },
        };
      }),
    );
    updateNodeInternals(node.id);
  };

  const deleteHandle = (type, id) => () => {
    const newTarget = node.data[type].filter((input) => input.id !== id);
    const newHandles = node.handleBounds[type].filter(
      (handle) => handle.id !== id,
    );
    setNodes((ns) =>
      ns.map((n) =>
        n.id === node.id
          ? {
              ...n,
              data: { ...n.data, [type]: newTarget },
              handleBounds: {
                ...n.handleBounds,
                [type]: adjustHandlesXY(n.height, newHandles, type, n.width),
              },
            }
          : n,
      ),
    );
    setEdges((es) =>
      es.filter((e) => e.targetHandle !== id && e.sourceHandle !== id),
    );
    updateNodeInternals(node.id);
  };

  if (!node) return null;
  return (
    <div className="editor">
      <h3>ID: {node.id}</h3>
      <h3>type: {node.type || "no type"}</h3>
      {!node.parentNode && (
        <label>
          <input
            type="checkbox"
            checked={Boolean(node.data.isGroup)}
            onChange={onIsGroupChange}
          />
          Group
        </label>
      )}
      <div>
        <label htmlFor="data.label">Label</label>
        <input
          type="text"
          id="data.label"
          value={node.data.label}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="style.backgroundColor">Background</label>
        <input
          type="color"
          id="style.backgroundColor"
          value={node.style?.backgroundColor || "#FFFFFF"}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="style.width">Width</label>
        <input
          type="number"
          min="30"
          step="1"
          id="style.width"
          value={node.style?.width || node.width}
          onChange={handleWidthChange}
        />
      </div>
      <div>
        <label htmlFor="style.height">Height</label>
        <input
          type="number"
          min="30"
          step="1"
          id="style.height"
          value={node.style?.height || node.height}
          onChange={handleHeightChange}
        />
      </div>

      <div>
        <button onClick={deleteNode} disabled={Boolean(node.data.isGroup)}>
          delete
        </button>
      </div>
      <div>
        <button onClick={() => console.log(node)}>console.log(node)</button>
      </div>
      {["target", "source"].map(
        (type) =>
          node.data[type] && (
            <div>
              <h4>{type}s</h4>
              {node.data[type].map((input, i) => (
                <div key={input.id} className="handle">
                  <label htmlFor={input.id}>{i + 1}:</label>
                  <input
                    id={input.id}
                    type="text"
                    value={input.name}
                    onChange={changeHandle(type, input.id, "name")}
                  />
                  <input
                    type="color"
                    value={input.color}
                    onChange={changeHandle(type, input.id, "color")}
                  />
                  <button onClick={deleteHandle(type, input.id)}>x</button>
                </div>
              ))}
              <button className="add-handle" onClick={addHandle(type)}>
                Add new {type}
              </button>
            </div>
          ),
      )}
    </div>
  );
};
