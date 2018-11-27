import React from "react";
import { Group } from "@vx/group";
import { GlyphDot } from "@vx/glyph";
import { LinePath } from "@vx/shape";
import { AxisLeft, AxisBottom } from "@vx/axis";
import { scaleTime, scaleLinear } from "@vx/scale";
import { curveBasis } from "@vx/curve";
import { format } from "d3-format";

export default ({
  width,
  height,
  x,
  y,
  data,
  stroke = "#22C8A3",
  strokeWidth = 2
}) => {
  const margin = { top: 10, left: 50, bottom: 50, right: 10 };
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  const xScale = scaleLinear({
    domain: [Math.min(...data.map(x)), Math.max(...data.map(x))],
    range: [0, xMax]
  });
  const yScale = scaleLinear({
    domain: [0, Math.max(...data.map(y))],
    range: [yMax, 0]
  });

  return (
    <svg width={width} height={height}>
      <AxisLeft
        scale={yScale}
        left={margin.left}
        stroke={"rgba(0,0,0,0.15)"}
        hideTicks={true}
        label="Number of Networks"
        numTicks={6}
        tickLabelProps={() => ({
          fontFamily: "Circular",
          fontSize: "11px",
          textAnchor: "end",
          fill: "#333"
        })}
        labelProps={{
          dx: "0.5em",
          textAnchor: "middle",
          fill: "#333",
          fontSize: "14px",
          fontWeight: "bold"
        }}
      />
      <AxisBottom
        scale={xScale}
        top={yMax}
        left={margin.left}
        stroke={"rgba(0,0,0,0.15)"}
        hideTicks={true}
        label="Year"
        numTicks={10}
        tickLabelProps={() => ({
          fontFamily: "Circular",
          fontSize: "11px",
          dy: "1.5em",
          fill: "#333",
          textAnchor: "middle"
        })}
        tickFormat={d => d}
        tickTransform={`translate(0,10px)`}
        labelProps={{
          dy: "3.5em",
          textAnchor: "middle",
          fill: "#333",
          fontSize: "14px",
          fontWeight: "bold"
        }}
      />
      <Group left={margin.left}>
        <LinePath
          data={data}
          xScale={xScale}
          yScale={yScale}
          x={x}
          y={y}
          stroke={stroke}
          strokeWidth={strokeWidth}
          curve={curveBasis}
        />
      </Group>
    </svg>
  );
};
