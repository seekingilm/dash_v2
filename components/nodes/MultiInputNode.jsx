import React, { memo } from "react";

import { Handle } from "react-flow-renderer";

export default memo(({ data, isConnectable }) => {
  const source = data.source || [];

  return (
    <>
      <div>
        <strong>{data.label}</strong>
      </div>

      {source.map((output, index) => (
        <Handle
          type="source"
          position="right"
          id={output.id}
          key={output.id}
          style={{ top: 10 + index * 5, background: output.color || "#555555" }}
        />
      ))}
    </>
  );
});
