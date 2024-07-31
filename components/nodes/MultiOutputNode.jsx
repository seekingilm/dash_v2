import React, { memo } from "react";

import { Handle } from "react-flow-renderer";

export default memo(({ data, isConnectable }) => {
  const target = data.target || [];

  return (
    <>
      {target.map((input, index) => (
        <Handle
          type="target"
          position="left"
          id={input.id}
          key={input.id}
          style={{ top: index * 10, background: input.color || "#555555" }}
          isConnectable={isConnectable}
        />
      ))}
      <div>
        <strong>{data.label}</strong>
      </div>
    </>
  );
});
