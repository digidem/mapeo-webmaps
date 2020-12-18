import React from "react";
import { IntlProvider } from "react-intl";

// Provide your messages
const messages = {
  es: require("../src/translations/es.json"),
};

export const globalTypes = {
  locale: {
    name: "Locale",
    description: "Internationalization locale",
    defaultValue: "en",
    toolbar: {
      icon: "globe",
      items: [
        { value: "en", right: "🇬🇧", title: "English" },
        { value: "es", right: "🇪🇸", title: "Español" },
      ],
    },
  },
};

export const decorators = [
  (Story, { globals }) => (
    <IntlProvider locale={globals.locale} messages={messages[globals.locale]}>
      <Story />
    </IntlProvider>
  ),
];
