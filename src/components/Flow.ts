import { Component } from "../Component.ts";
import { Box } from "./Box.ts";
import './Flow.css';

export const Flow = (...elements: Component[]) => Box(...elements).addClass("wflow");
