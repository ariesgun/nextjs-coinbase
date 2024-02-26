"use client";

import { cn } from "@/lib/utils";
import * as d3 from "d3";
import {
  Avatar,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Image,
} from "@nextui-org/react";
import { useEffect, useRef } from "react";

export function RadialProgress({
  className,
  centerImg,
  value,
  headerText,
  ...props
}) {
  const ref = useRef(null);

  useEffect(() => {
    draw();
  });

  const draw = () => {
    const height = 180;
    const width = 180;
    const tau = 2 * Math.PI;
    const maxValue = 100;
    // let value = 50;
    const slice = value / maxValue;

    const doc = d3.select(ref.current);

    doc.selectAll("*").remove();
    const svg = doc
      .append("svg")
      .attr("viewBox", [0, 0, width, height])
      .attr(
        "style",
        "max-width: 100%; height: auto; margin-left:auto; margin-right:auto",
      )
      .attr("width", width)
      .attr("height", height)
      .append("g");

    const arcGen = d3
      .arc()
      .innerRadius(70)
      .outerRadius(90)
      .startAngle(0)
      .cornerRadius(40);

    const arc1 = svg
      .append("path")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
      .datum({ endAngle: tau })
      .style("fill", "#ddd")
      .attr("d", arcGen);

    const foreground = svg
      .append("path")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
      .datum({ endAngle: slice * tau })
      .transition()
      .style("fill", "#F57B21")
      .attr("d", arcGen);

    // svg
    //   .append("path")
    //   //   .attr("transform", "translate(100,100)")
    //   .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
    //   .attr("fill", "green")
    //   .attr(
    //     "d",
    //     d3.arc()({
    //       innerRadius: 60,
    //       outerRadius: 80,
    //       startAngle: -Math.PI,
    //       endAngle: Math.PI,
    //     }),
    //   );

    // svg.append("svg:image").attr("xlink:href", function (d) {
    //   return "/anies.png";
    // });
  };

  return (
    <Card className={cn("px-10", className)}>
      <CardHeader className="px-0 py-4">
        <h1 className="text-md font-bold">{headerText}</h1>
      </CardHeader>
      <CardBody className="overflow-visible align-center items-center place-content-center">
        <div className="" ref={ref}></div>
        <Avatar
          src={centerImg}
          radius="lg"
          className="absolute w-16 h-16 text-large"
        />
      </CardBody>
      <CardFooter className="px-0 py-4">
        <p className="text-md">30.929.818 suara</p>
      </CardFooter>
    </Card>
  );
}
