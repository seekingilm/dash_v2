import React, { memo, useMemo } from "react";

import { Handle, Position } from "react-flow-renderer";
import { useCustomNode } from "../hooks/useCustomNode";

export default memo(({ id, data }) => {
  const { height, target } = useCustomNode(id, data);

  const targetHandles = useMemo(() => {
    const gap = height / (target.length + 1);
    return target.map((input, i) => (
      <Handle
        type="target"
        position={Position.Left}
        id={input.id}
        key={input.id}
        style={{ top: (i + 1) * gap, background: input.color || "#555555" }}
      />
    ));
  }, [target, height]);

  return (
    <>
      {targetHandles}
      <div>
        <strong>{data.label}</strong>
      </div>
    </>
  );
});
