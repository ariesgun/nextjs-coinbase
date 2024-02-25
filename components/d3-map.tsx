"use client";

import { LegacyRef, createRef, useEffect } from "react";
import * as d3 from "d3";
import * as topojson from "topojson";
import jsonInfo from "@/public/indonesia.json";

interface D3MapInterfaceProps {
  width: number | string | undefined;
  height: number | string | undefined;
}

export default function D3Map({ width, height }: D3MapInterfaceProps) {
  const ref: LegacyRef<SVGSVGElement> = createRef();
  let gref = createRef();
  let selectedRef = createRef();

  useEffect(() => {
    draw();
    console.log(jsonInfo);
  });

  const zoom = d3.zoom().scaleExtent([1, 8]).on("zoom", zoomed);

  function zoomed(event) {
    const { transform } = event;

    const svg = d3.select(ref.current);
    console.log(transform);

    gref.attr("transform", transform);
    gref.attr("stroke-width", 1 / transform.k);
  }

  function clicked(event, d) {
    event.stopPropagation();

    if (selectedRef.current !== null) {
      selectedRef.current.transition().style("fill", "#444");
    }

    selectedRef.current = d3.select(this);
    d3.select(this).transition().style("fill", "red");
  }

  const draw = () => {
    const svg = d3.select(ref.current);
    console.log(ref.current);
    svg.selectAll("*").remove();

    svg
      .attr("viewBox", [0, 0, width, height])
      .attr(
        "style",
        "max-width: 100%; height: auto; margin-left:auto; margin-right:auto",
      );

    var projection = d3
      .geoEquirectangular()
      .scale(1800)
      .rotate([-120, 0])
      .translate([width / 2 + 64, height / 2 - 48]);

    var path = d3.geoPath().projection(projection);

    gref = svg.append("g");

    gref
      .append("g")
      .attr("id", "subunits")
      .attr("fill", "#444")
      .selectAll("path")
      .data(
        topojson.feature(jsonInfo, jsonInfo.objects.states_provinces).features,
      )
      .enter()
      .append("path")
      .attr("d", path)
      .on("click", clicked);

    gref
      .append("path")
      .attr("id", "state-borders")
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-linejoin", "round")
      .attr(
        "d",
        path(
          topojson.mesh(
            jsonInfo,
            jsonInfo.objects.states_provinces,
            function (a, b) {
              return a !== b;
            },
          ),
        ),
      );

    svg.call(zoom);
  };

  return <svg width={width} height={height} ref={ref} />;
}
