import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { usePlanet } from '../../context/KokabContext';

export const RelationshipRadar: React.FC = () => {
  const { planetHealth } = usePlanet();
  const svgRef = useRef<SVGSVGElement>(null);

  const data = [
    { axis: "اللوجستيات", value: (planetHealth.breakdown.logistics || 0) / 100 },
    { axis: "المالية", value: (planetHealth.breakdown.finance || 0) / 100 },
    { axis: "الروحانيات", value: (planetHealth.breakdown.spiritual || 0) / 100 },
    { axis: "العافية", value: (planetHealth.breakdown.health || 0) / 100 },
  ];

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 300;
    const height = 300;
    const margin = 40;
    const radius = Math.min(width, height) / 2 - margin;
    const levels = 5;
    const total = data.length;
    const angleSlice = (Math.PI * 2) / total;

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .html(""); // Clear old content

    const g = svg.append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    // Draw background levels
    const levelScale = d3.scaleLinear()
      .domain([0, 1])
      .range([0, radius]);

    for (let j = 0; j < levels; j++) {
      const levelFactor = radius * ((j + 1) / levels);
      g.selectAll(".levels")
        .data(d3.range(total + 1))
        .enter()
        .append("line")
        .attr("x1", (d, i) => levelFactor * Math.cos(angleSlice * i - Math.PI / 2))
        .attr("y1", (d, i) => levelFactor * Math.sin(angleSlice * i - Math.PI / 2))
        .attr("x2", (d, i) => levelFactor * Math.cos(angleSlice * (i + 1) - Math.PI / 2))
        .attr("y2", (d, i) => levelFactor * Math.sin(angleSlice * (i + 1) - Math.PI / 2))
        .attr("class", "line")
        .style("stroke", "rgba(255,255,255,0.05)")
        .style("stroke-width", "1px");
    }

    // Draw axes
    const axis = g.selectAll(".axis")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "axis");

    axis.append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", (d, i) => radius * Math.cos(angleSlice * i - Math.PI / 2))
      .attr("y2", (d, i) => radius * Math.sin(angleSlice * i - Math.PI / 2))
      .style("stroke", "rgba(255,255,255,0.1)")
      .style("stroke-width", "1px");

    // Labels
    axis.append("text")
      .attr("class", "legend")
      .text(d => d.axis)
      .style("font-size", "10px")
      .style("fill", "rgba(255,255,255,0.6)")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("x", (d, i) => (radius + 15) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr("y", (d, i) => (radius + 15) * Math.sin(angleSlice * i - Math.PI / 2));

    // Radar line
    const rScale = d3.scaleLinear()
      .range([0, radius])
      .domain([0, 1]);

    const radarLine = d3.lineRadial<any>()
      .radius(d => rScale(d.value))
      .angle((d, i) => i * angleSlice)
      .curve(d3.curveLinearClosed);

    g.append("path")
      .datum(data)
      .attr("class", "radarArea")
      .attr("d", radarLine)
      .style("fill", "var(--color-primary)")
      .style("fill-opacity", 0.3)
      .style("stroke", "var(--color-primary)")
      .style("stroke-width", "2px");

  }, [planetHealth]);

  return (
    <div className="flex justify-center items-center py-4">
      <svg ref={svgRef}></svg>
    </div>
  );
};
