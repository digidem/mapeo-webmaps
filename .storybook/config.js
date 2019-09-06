import { configure, addDecorator } from "@storybook/react";
import { setIntlConfig, withIntl } from "storybook-addon-intl";

// Provide your messages
const messages = {
  es: require("../src/translations/es.json")
};

const getMessages = locale => messages[locale];

// Set intl configuration
setIntlConfig({
  locales: ["en", "es"],
  defaultLocale: "en",
  getMessages
});

// Register decorator
addDecorator(withIntl);

// automatically import all files ending in *.stories.js
configure(require.context("../src", true, /\.stories\.js$/), module);
