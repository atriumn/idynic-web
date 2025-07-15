'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { buildForce } from '@/utils/force';

interface ForceGraphProps {
  traits: any[];
  width?: number;
  height?: number;
}

export function ForceGraph({ traits, width = 600, height = 400 }: ForceGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!traits || traits.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const { nodes, links } = buildForce(traits, 0); // keep all nodes
    
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).distance(80))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(d => d.r + 5));

    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g");

    // Add zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.5, 3])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

    // Add links
    const link = g.append("g")
      .selectAll("line")
      .data(links)
      .enter().append("line")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", d => 1 + d.value); // thickness based on evidence overlap

    // Add nodes
    const node = g.append("g")
      .selectAll("circle")
      .data(nodes)
      .enter().append("circle")
      .attr("r", d => d.r) // proficiency-based radius
      .attr("fill", d => color(d.group))
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    // Add labels
    const label = g.append("g")
      .selectAll("text")
      .data(nodes)
      .enter().append("text")
      .text(d => d.name.length > 20 ? d.name.substring(0, 20) + '...' : d.name)
      .style("font-size", "10px")
      .style("text-anchor", "middle")
      .style("fill", "#333")
      .style("font-weight", "500")
      .style("pointer-events", "none");

    // Add tooltips
    node.append("title")
      .text(d => `${d.name}\nType: ${d.group}\nWeight: ${d.radius.toFixed(1)}\nRadius shows mastery level`);

    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node
        .attr("cx", d => Math.max(d.r, Math.min(width - d.r, d.x)))
        .attr("cy", d => Math.max(d.r, Math.min(height - d.r, d.y)));

      label
        .attr("x", d => Math.max(d.r, Math.min(width - d.r, d.x)))
        .attr("y", d => Math.max(d.r, Math.min(height - d.r, d.y)) - d.r - 5);
    });

    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

  }, [traits, width, height]);

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Proficiency Map</h3>
      <p className="text-sm text-gray-600 mb-4">Bubble size = mastery level, connections = shared evidence</p>
      <svg ref={svgRef} className="border border-gray-200 rounded"></svg>
    </div>
  );
}