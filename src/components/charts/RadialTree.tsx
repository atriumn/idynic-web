'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { buildRadial } from '@/utils/radial';
import { AliasTable } from '@/utils/alias-table';

interface RadialTreeProps {
  traits: any[];
  width?: number;
  height?: number;
}

export function RadialTree({ traits, width = 500, height = 500 }: RadialTreeProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!traits || traits.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const data = buildRadial(traits, AliasTable);
    
    const radius = Math.min(width, height) / 2 - 40;
    
    const tree = d3.tree()
      .size([2 * Math.PI, radius])
      .separation((a, b) => (a.parent == b.parent ? 1 : 2) / a.depth);

    const root = d3.hierarchy(data);
    tree(root);

    const color = d3.scaleSequential(d3.interpolateViridis)
      .domain([0, 3]); // depth-based coloring

    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    // Add links
    g.append("g")
      .selectAll("path")
      .data(root.links())
      .enter().append("path")
      .attr("fill", "none")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5)
      .attr("d", d3.linkRadial()
        .angle(d => d.x)
        .radius(d => d.y));

    // Add nodes
    const node = g.append("g")
      .selectAll("g")
      .data(root.descendants())
      .enter().append("g")
      .attr("transform", d => `
        rotate(${d.x * 180 / Math.PI - 90}) 
        translate(${d.y},0)
      `);

    node.append("circle")
      .attr("fill", d => d.data.present === false ? "#d1d1d1" : "#4f46e5")
      .attr("r", d => {
        if (d.depth === 0) return 8; // root
        if (d.depth === 1) return 6; // trait types
        if (d.depth === 2) return 4 + 12 * (d.data.weight || 0.5); // traits
        return 3; // tools
      })
      .attr("stroke", "#fff")
      .attr("stroke-width", 1)
      .attr("opacity", d => d.data.present === false ? 0.5 : 1);

    // Add labels
    node.append("text")
      .attr("dy", "0.31em")
      .attr("x", d => d.x < Math.PI === !d.children ? 6 : -6)
      .attr("text-anchor", d => d.x < Math.PI === !d.children ? "start" : "end")
      .attr("transform", d => d.x >= Math.PI ? "rotate(180)" : null)
      .style("font-size", d => {
        if (d.depth === 0) return "14px";
        if (d.depth === 1) return "12px";
        if (d.depth === 2) return "10px";
        return "8px";
      })
      .style("font-weight", d => d.depth < 2 ? "600" : "400")
      .style("fill", d => {
        if (d.data.present === false) return "#999";
        return d.depth < 2 ? "#333" : "#666";
      })
      .style("font-style", d => d.data.present === false ? "italic" : "normal")
      .text(d => {
        if (d.depth === 0) return d.data.name;
        if (d.depth === 1) return d.data.name;
        const maxLength = d.depth === 2 ? 25 : 15;
        return d.data.name.length > maxLength ? 
          d.data.name.substring(0, maxLength) + '...' : 
          d.data.name;
      });

    // Add tooltips
    node.filter(d => d.depth >= 2)
      .append("title")
      .text(d => {
        if (d.data.present === false) {
          return `${d.data.name} (Gap - commonly used with ${d.parent?.data.name})`;
        }
        if (d.depth === 2) {
          return `${d.data.name}\nConfidence: ${Math.round((d.data.weight || 0) * 100)}%\nEvidence: ${d.data.evidence || 'N/A'}`;
        }
        return d.data.name;
      });

  }, [traits, width, height]);

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Identity Tree with Gaps</h3>
      <p className="text-sm text-gray-600 mb-4">Gray nodes show missing tools commonly used with your traits</p>
      <svg ref={svgRef}></svg>
    </div>
  );
}