import "./index.scss";
import { json } from "d3-fetch";
import { nest } from "d3-collection";
import { min, max } from "d3-array";
import { format } from "d3-format";
import ViolinPlot from "./charts/ViolinPlot";
import Scatterplot from "./charts/Scatterplot";
import Line from "./charts/Line";
import { DataTableWithSearch } from "./charts/DataTable";

let queue = [];
let data = null;

const settings = {
  viz__datatable: el => {
    const columns = [
      {
        Header: "Metropolitan Statistical Area",
        accessor: "msa",
        minWidth: 200
      },
      {
        Header: "Number of Connections",
        accessor: "connections",
        sortMethod: (a, b) => +a - +b
      },
      {
        Header: "Population",
        accessor: "population",
        Cell: d => format(",")(+d.value),
        sortMethod: (a, b) => +a - +b
      }
    ];
    ReactDOM.render(
      <DataTableWithSearch
        columns={columns}
        data={data.msa}
        showPagination={true}
        title={
          data.meta.filter(chart => chart.id === "viz__datatable")[0].title
        }
        source={
          data.meta.filter(chart => chart.id === "viz__datatable")[0].source
        }
      />,
      el
    );
  },
  viz__scatterplot: el => {
    ReactDOM.render(
      <Scatterplot
        data={data.msa.map(d => ({
          ...d,
          population: +d.population,
          connections: +d.connections
        }))}
        x={x => x.connections}
        y={y => y.population}
        width={650}
        height={500}
        title={
          data.meta.filter(chart => chart.id === "viz__scatterplot")[0].title
        }
        source={
          data.meta.filter(chart => chart.id === "viz__scatterplot")[0].source
        }
      />,
      el
    );
  },
  viz__line: el => {
    ReactDOM.render(
      <Line
        width={650}
        height={400}
        x={d => d.year}
        y={d => +d.cumulative}
        data={data.line}
        title={data.meta.filter(chart => chart.id === "viz__line")[0].title}
        source={data.meta.filter(chart => chart.id === "viz__line")[0].source}
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
