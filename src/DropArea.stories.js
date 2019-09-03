import React from "react";
import DropArea from "./DropArea";

export default {
  title: "DropArea"
};

export const initial = () => <DropArea />;

export const dragging = () => <DropArea isDragging />;
