import { useEffect } from 'react';
import { useReactFlow, useUpdateNodeInternals } from 'react-flow-renderer';

export const useCustomNode = (id, data) => {
  const { getNode } = useReactFlow();
  const updateNodeInternals = useUpdateNodeInternals();
  const target = data.target || [];
  const source = data.source || [];
  const height = getNode(id).height;
  useEffect(() => {
    updateNodeInternals(id)
  }, [target, source])

  return {height,target,source}
}