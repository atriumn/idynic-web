'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { buildChord } from '@/utils/chord';

interface ChordDiagramProps {
  traits: any[];
  width?: number;
  height?: number;
}

export function ChordDiagram({ traits, width = 400, height = 400 }: ChordDiagramProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!traits || traits.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const { groups, matrix } = buildChord(traits);
    
    const chord = d3.chord()
      .padAngle(0.05)
      .sortSubgroups(d3.descending);

    const arc = d3.arc()
      .innerRadius(Math.min(width, height) * 0.41)
      .outerRadius(Math.min(width, height) * 0.45);

    const ribbon = d3.ribbon()
      .radius(Math.min(width, height) * 0.40);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const chords = chord(matrix);
    
    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    // Add groups (arcs)
    const group = g.append("g")
      .selectAll("g")
      .data(chords.groups)
      .enter().append("g");

    group.append("path")
      .style("fill", d => color(groups[d.index]))
      .style("stroke", d => d3.rgb(color(groups[d.index])).darker())
      .attr("d", arc);

    // Add labels
    group.append("text")
      .each(d => { d.angle = (d.startAngle + d.endAngle) / 2; })
      .attr("dy", ".35em")
      .attr("transform", d => `
        rotate(${(d.angle * 180 / Math.PI - 90)})
        translate(${Math.min(width, height) * 0.48})
        ${d.angle > Math.PI ? "rotate(180)" : ""}
      `)
      .style("text-anchor", d => d.angle > Math.PI ? "end" : null)
      .style("font-size", "10px")
      .style("font-weight", "500")
      .text(d => {
        const groupName = groups[d.index];
        return groupName.length > 12 ? groupName.substring(0, 12) + '...' : groupName;
      });

    // Add tooltips to groups
    group.append("title")
      .text(d => {
        const groupName = groups[d.index];
        const traitCount = matrix[d.index][d.index];
        return `${groupName}\n${traitCount} traits in this topic`;
      });

    // Add ribbons (self-loops only in this case)
    g.append("g")
      .selectAll("path")
      .data(chords)
      .enter().append("path")
      .attr("d", ribbon)
      .style("fill", d => color(groups[d.source.index]))
      .style("stroke", d => d3.rgb(color(groups[d.source.index])).darker())
      .style("fill-opacity", 0.7);

  }, [traits, width, height]);

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Topic Clusters</h3>
      <p className="text-sm text-gray-600 mb-4">Traits grouped by topical similarity</p>
      <svg ref={svgRef}></svg>
    </div>
  );
}