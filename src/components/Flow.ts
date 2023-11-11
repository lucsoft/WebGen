import { Component } from "../Component.ts";
import './Flow.css';
import { Box } from "./Stacks.ts";

export const Flow = (...elements: Component[]) => Box(...elements).addClass("wflow");
