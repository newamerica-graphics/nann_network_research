import React from "react";
import { Group } from "@vx/group";
import { GlyphCircle } from "@vx/glyph";
import { scaleLinear, scaleOrdinal } from "@vx/scale";
import { AxisLeft, AxisBottom } from "@vx/axis";
import { max, extent } from "d3-array";
import { format } from "d3-format";
import { withTooltip, Tooltip } from "@vx/tooltip";
import { AnnotationCalloutCircle } from "react-annotation";
import { ParentSize } from "@vx/responsive";

const margin = {
  top: 10,
  bottom: 80,
  left: 120,
  right: 10
};

let tooltipTimeout;

export default withTooltip(props => {
  const { height, data, tooltipData, title, x, y } = props;

  return (
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
          <div>
            <svg width={width} height={height}>
              <AxisLeft
                scale={yScale}
                left={margin.left}
                stroke={"rgba(0,0,0,0.15)"}
                hideTicks={true}
                label="Population"
                numTicks={6}
                tickLabelProps={() => ({
                  fontFamily: "Circular",
                  fontSize: "11px",
                  textAnchor: "end",
                  fill: "#333"
                })}
                labelProps={{
                  dx: "-3em",
                  textAnchor: "start",
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
                label="Number of Connections"
                numTicks={30}
                tickLabelProps={() => ({
                  fontFamily: "Circular",
                  fontSize: "11px",
                  dy: "1.5em",
                  fill: "#333",
                  textAnchor: "middle"
                })}
                tickTransform={`translate(0,10px)`}
                labelProps={{
                  dy: "3em",
                  textAnchor: "end",
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
                  y={688}
                  dx={15}
                  dy={-309}
                  color={"#333"}
                  editMode={false}
                  note={{
                    label:
                      "Most under-networked MSAs have populations of under 2M",
                    lineType: "horizontal"
                  }}
                  subject={{ radius: width / 18, radiusPadding: 5 }}
                />
                {data.map((point, i) => {
                  return (
                    <GlyphCircle
                      className="dot"
                      key={`point-${i}`}
                      stroke={"#4C81DB"}
                      fill="#fff"
                      fillOpacity={0.2}
                      left={xScale(x(point))}
                      top={yScale(y(point))}
                      style={{ cursor: "pointer" }}
                      size={60}
                      onMouseEnter={() => event => {}}
                      onTouchStart={() => event => {}}
                      onMouseLeave={() => event => {}}
                    />
                  );
                })}
              </Group>
            </svg>
            {props.tooltipOpen && (
              <Tooltip
                left={props.tooltipLeft}
                top={props.tooltipTop}
                style={{ borderRadius: 0 }}
              >
                <div>
                  <h4
                    className="margin-top-0 margin-bottom-10"
                    style={{
                      borderBottom: "1px solid rgba(0,0,0,0.15)",
                      paddingBottom: "5px"
                    }}
                  >
                    {tooltipData.occupation}
                  </h4>
                  <h5 className="margin-5">% Women</h5>
                  <h6 className="margin-top-0 margin-bottom-10">
                    {xFormat(tooltipData.percent_women)}
                  </h6>
                  <h5 className="margin-5">Median Earning</h5>
                  <h6 className="margin-top-0 margin-bottom-10">
                    {yFormat(tooltipData.median_earning)}
                  </h6>
                  <h5 className="margin-5"># of Workers</h5>
                  <h6 className="margin-top-0 margin-bottom-10">
                    {nFormat(tooltipData.number_full_time)}
                  </h6>
                </div>
              </Tooltip>
            )}
          </div>
        );
      }}
    </ParentSize>
  );
});
