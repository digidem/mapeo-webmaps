import React from "react";
import DropArea from "./DropArea";

export default {
  title: "DropArea",
  decorators: [storyFn => <div style={{ maxWidth: 640 }}>{storyFn()}</div>]
};

export const initial = () => <DropArea />;

export const dragging = () => <DropArea isDragActive />;
