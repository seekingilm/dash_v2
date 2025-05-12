import React, { memo, useMemo } from "react";

import { Handle, Position } from "react-flow-renderer";
import { useCustomNode } from "../hooks/useCustomNode";

export default memo(({ id, data }) => {
  const { height, source } = useCustomNode(id, data);

  const sourceHandles = useMemo(() => {
    const gap = height / (source.length + 1);
    return source.map((input, i) => (
      <Handle
        type="source"
        position={Position.Right}
        id={input.id}
        key={input.id}
        style={{ top: (i + 1) * gap, background: input.color || "#555555" }}
      />
    ));
  }, [source, height]);

  return (
    <>
      <div>
        <strong>{data.label}</strong>
      </div>
      {sourceHandles}
    </>
  );
});
