import "./index.scss";
import { json } from "d3-fetch";
import { nest } from "d3-collection";
import { min, max } from "d3-array";
import ViolinPlot from "./charts/ViolinPlot";
import Scatterplot from "./charts/Scatterplot";

let queue = [];
let data = null;

const settings = {
  viz__scatterplot: el => {
    ReactDOM.render(
      <Scatterplot
        data={data.data.map(d => ({
          ...d,
          population: +d.population,
          connections: +d.connections
        }))}
        x={x => x.connections}
        y={y => y.population}
        height={800}
      />,
      el
    );
  },
  viz__violinplot: el => {
    const _data = data.data.map(d => ({
      ...d,
      population: +d.population,
      value: +d.population,
      count: +d.population
    }));
    const minY = min(_data, d => d.population);
    const maxY = max(_data, d => d.population);
    const nested = nest()
      .key(d => d["connections"])
      .sortKeys((a, b) => +a - +b)
      .sortValues((a, b) => +a["population"] - +b["population"])
      .entries(_data);
    ReactDOM.render(
      <ViolinPlot
        data={nested}
        width={1000}
        height={600}
        min={minY}
        max={maxY}
      />,
      el
    );
  }
};

json(
  "https://na-data-projects.s3.amazonaws.com/data/nann/network_research.json"
).then(_data => {
  data = _data;
  for (let i = 0; i < queue.length; i++) queue[i]();
});

window.renderDataViz = function(el) {
  let id = el.getAttribute("id");
  let chart = settings[id];
  if (!chart) return;

  if (data) {
    chart(el);
  } else {
    queue.push(() => chart(el));
  }
};
