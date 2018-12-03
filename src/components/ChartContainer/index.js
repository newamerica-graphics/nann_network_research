import React from "react";
import "./ChartContainer.scss";

const Title = props => <h3 className="chart__title">{props.title}</h3>;
const Subtitle = props => <h4 className="chart__subtitle">{props.subtitle}</h4>;
const Source = props => (
  <span className="chart__source">Source: {props.source}</span>
);
const ChartContainer = props => (
  <div className={`chart ${props.maxWidth === 1200 ? 'chart-full' : ''}`}>
    <div className="chart__meta-container" style={{maxWidth: props.maxWidth, margin: "auto"}}>
      {props.title ? <Title title={props.title} /> : null}
      {props.subtitle ? <Subtitle subtitle={props.subtitle} /> : null}
    </div>
    <div className="chart__figure" style={{ maxWidth: props.maxWidth, margin: "auto", height: props.height}}>
      {props.children}
    </div>
    <div className="chart__meta-container" style={{maxWidth: props.maxWidth, margin: "auto"}}>
      {props.source ? <Source source={props.source} /> : null}
    </div>
  </div>
);

export default ChartContainer;
