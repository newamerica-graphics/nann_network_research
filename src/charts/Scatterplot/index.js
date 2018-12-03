import React from "react";
import ChartContainer from "../../components/ChartContainer";
import { Group } from "@vx/group";
import { GlyphCircle } from "@vx/glyph";
import { Text } from "@vx/text";
import { scaleLinear, scaleOrdinal } from "@vx/scale";
import { AxisLeft, AxisBottom } from "@vx/axis";
import { max, extent } from "d3-array";
import { format } from "d3-format";
import { AnnotationCalloutCircle } from "react-annotation";
import { ParentSize } from "@vx/responsive";

const margin = {
  top: 10,
  bottom: 60,
  left: 65,
  right: 10
};

let tooltipTimeout;

export default ({ width, height, data, tooltipData, title, source, x, y }) => {
  const annotationPos = name => {
    switch (name) {
      case "Miami":
        return [-20, -20];
      case "New York":
        return [10, -5];
      case "San Francisco":
        return [-80, 10];
      case "Boston":
        return [-40, -10];
      default:
        return [10, -5];
    }
  };

  return (
    <ChartContainer
      title={title}
      source={source}
      maxWidth={width}
      height={height}
    >
      <ParentSize>
        {({ width }) => {
          if (width < 100) return null;

          const xMax = width - margin.left - margin.right;
          const yMaxRange = height - margin.top - margin.bottom;
          const yMaxDomain = max(data, y);
          const xMaxDomain = max(data, x);

          const xScale = scaleLinear({
            domain: [0, xMaxDomain],
            range: [0, xMax],
            clamp: true
          });

          const yScale = scaleLinear({
            domain: [0, yMaxDomain],
            range: [yMaxRange, margin.top],
            clamp: true
          });

          return (
            <svg width={width} height={height}>
              <AxisLeft
                scale={yScale}
                left={margin.left}
                stroke={"rgba(0,0,0,0.15)"}
                hideTicks={true}
                label="Metropolitan/Micropolitan Area Population"
                numTicks={6}
                tickFormat={d => format(".2s")(d).replace(".0", "")}
                tickLabelProps={() => ({
                  fontFamily: "Circular",
                  fontSize: "11px",
                  textAnchor: "end",
                  fill: "#333"
                })}
                labelProps={{
                  dx: "-0.5em",
                  textAnchor: "middle",
                  fill: "#333",
                  fontSize: "14px",
                  fontWeight: "bold"
                }}
              />
              <AxisBottom
                scale={xScale}
                top={height - margin.top - margin.bottom}
                left={margin.left}
                stroke={"rgba(0,0,0,0.15)"}
                hideTicks={true}
                label="Number of connections in each Metro Area"
                numTicks={width < 600 ? 5 : 20}
                tickLabelProps={() => ({
                  fontFamily: "Circular",
                  fontSize: "11px",
                  dy: "1.5em",
                  fill: "#333",
                  textAnchor: "middle"
                })}
                tickTransform={`translate(0,10px)`}
                labelProps={{
                  dy: "3.5em",
                  textAnchor: "middle",
                  fill: "#333",
                  fontSize: "14px",
                  fontWeight: "bold"
                }}
              />
              <Group
                onTouchStart={() => event => {
                  if (tooltipTimeout) clearTimeout(tooltipTimeout);
                  props.hideTooltip();
                }}
                left={margin.left}
              >
                <AnnotationCalloutCircle
                  x={width / 17}
                  y={395}
                  dx={40}
                  dy={-200}
                  color={"#333"}
                  editMode={false}
                  note={{
                    label:
                      "Most under-networked MSAs have populations of under 2M",
                    lineType: null,
                    align: null,
                    padding: 10
                  }}
                  connector={{ type: "line" }}
                  subject={{ radius: width / 16.5, radiusPadding: 5 }}
                />
                {data.map((point, i) => {
                  return (
                    <Group>
                      <GlyphCircle
                        className="dot"
                        key={`point-${i}`}
                        stroke={"#4C81DB"}
                        fill="transparent"
                        fillOpacity={0.2}
                        left={xScale(x(point))}
                        top={yScale(y(point))}
                        size={60}
                      />
                      {point.alt_name && (
                        <Text
                          verticalAnchor="start"
                          x={xScale(x(point))}
                          dx={annotationPos(point.alt_name)[0]}
                          dy={annotationPos(point.alt_name)[1]}
                          y={yScale(y(point))}
                          fontSize="12px"
                        >
                          {point.alt_name}
                        </Text>
                      )}
                    </Group>
                  );
                })}
              </Group>
            </svg>
          );
        }}
      </ParentSize>
    </ChartContainer>
  );
};
