import React, { memo } from "react";

import { Handle } from "react-flow-renderer";

export default memo(({ height, data }) => {
  return (
    <>
      <div>
        <strong>{data.label}</strong>
      </div>

      <Handle
        type="source"
        position="right"
        style={{ background: "#A4A" }}
      />
    </>
  );
});
