import React from "react";
import { Group } from "@vx/group";
import { BoxPlot } from "@vx/boxplot";
import { ViolinPlot } from "@vx/stats";
import { scaleBand, scaleLinear } from "@vx/scale";
import { withTooltip, Tooltip } from "@vx/tooltip";
import { extent, min, max, quantile, median } from "d3-array";
import { format } from "d3-format";
import { genStats } from "@vx/mock-data";
import { AxisBottom, AxisLeft } from "@vx/axis";

export default withTooltip(
  ({
    data,
    width,
    height,
    min,
    max,
    events = false,
    tooltipOpen,
    tooltipLeft,
    tooltipTop,
    tooltipData,
    showTooltip,
    hideTooltip
  }) => {
    if (width < 10) return null;

    const testdata = genStats(5);
    console.log(testdata);

    // bounds
    const xMax = width - 90;
    const yMax = height - 120;

    // scales
    const xScale = scaleBand({
      rangeRound: [0, xMax],
      domain: data.map(d => d.key),
      padding: 0.4
    });

    const minYValue = min;
    const maxYValue = max;

    const yScale = scaleLinear({
      rangeRound: [yMax, 0],
      domain: [minYValue, maxYValue]
    });

    const boxWidth = xScale.bandwidth();
    const actualyWidth = Math.min(40, boxWidth);

    console.log(data);
    return (
      <div style={{ position: "relative" }}>
        <svg viewBox={`0 0 ${width} ${height}`} width="100%">
          <Group top={40} left={90}>
            {data.map((d, i) => {
              // accessors
              const x = d.key;
              const min = d.values[0]["population"];
              const max = d.values[d.values.length - 1]["population"];
              const med = median(d.values, d => d["population"]);
              const firstQuartile = quantile(
                d.values,
                0.25,
                d => d["population"]
              );
              const thirdQuartile = quantile(
                d.values,
                0.75,
                d => d["population"]
              );
              return (
                <Group>
                  <BoxPlot
                    key={i}
                    data={d}
                    min={yScale(min)}
                    max={yScale(max)}
                    left={xScale(x)}
                    firstQuartile={yScale(firstQuartile)}
                    thirdQuartile={yScale(thirdQuartile)}
                    median={yScale(med)}
                    boxWidth={actualyWidth}
                    fill="#ddd"
                    stroke="#333"
                    strokeWidth={1}
                  />
                  {/* <ViolinPlot
                    binData={d.values}
                    width={actualyWidth}
                    valueScale={yScale}
                    left={xScale(x)}
                  /> */}
                </Group>
              );
            })}
            <AxisBottom
              scale={xScale}
              top={yMax}
              left={0}
              label="Number of connections"
              stroke="#333333"
              tickStroke="#333333"
            />
            <AxisLeft
              scale={yScale}
              left={0}
              labelProps={{ fontSize: 10, dx: -30 }}
              label="Population"
              stroke="#333333"
              tickStroke="#333333"
            />
          </Group>
        </svg>
      </div>
    );
  }
);
