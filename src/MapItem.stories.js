/* eslint-disable react-hooks/rules-of-hooks */
import React from "react";
import MapItem from "./MapItem";

export default {
  title: "MapItem",
  decorators: [storyFn => <div style={{ maxWidth: 640 }}>{storyFn()}</div>]
};

export const basic = () => (
  <MapItem
    title="Monitoring Points"
    description="These reports from the Wapichan monitoring team document some of the key threats and impacts to our ancestral territory from illegal mining and crossings into our territory to steal cattle and illegally fish and hunt. The monitoring team has also been documenting important resources and cultural sites throughout our territory."
  />
);
