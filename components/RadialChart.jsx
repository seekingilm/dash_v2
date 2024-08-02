import { ResponsiveRadialBar } from '@nivo/radial-bar'
import { mockRadialData as data } from "../data/mockData"

function RadialChart({ radialData }) {
  return (
    <ResponsiveRadialBar
      data={data}
      valueFormat=">-.2f"
      padding={0.4}
      cornerRadius={2}
      margin={{ top: 40, right: 40, bottom: 80, left: 40 }}
      radialAxisStart={{ tickSize: 5, tickPadding: 5, tickRotation: 0 }}
      circularAxisOuter={{ tickSize: 5, tickPadding: 12, tickRotation: 0 }}
      
    />
  )
}

export default RadialChart
