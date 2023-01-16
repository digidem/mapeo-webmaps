import { defineMessages } from "react-intl";

export const messages = defineMessages({
  empty: {
    id: "empty_state",
    defaultMessage:
      'Click "ADD MAP" to publicly share a map from a .mapeomap file exported from Mapeo',
  },
  empty_title: {
    id: 'empty_title',
    defaultMessage: 'No maps to show',
  },
  empty_message: {
    id: 'empty_message',
    defaultMessage: 'Export data from Mapeo Desktop to share publicly. Not sure how to add maps? ',
  },
  empty_message_link: {
    id: 'empty_message_link',
    defaultMessage: 'Go to Tutorials',
  },
  drop_file_message: {
    id: 'drop_file_message',
    defaultMessage: 'Drop the .mapeomap file that you wish to upload here',
  },
  empty_message_href: {
    id: 'empty_message_href',
    defaultMessage:
      'https://docs.mapeo.app/quick-start-guide/mapeo-desktop#export-to-geojson-csv-or-smart-csv',
  },
  confirmDeleteTitle: {
    id: "confirm_delete_title",
    defaultMessage: "Delete this map?",
  },
  confirmDeleteDesc: {
    id: "confirm_delete_desc",
    defaultMessage:
      "If you delete this map, links to it will no longer work and it will no longer be available on the internet",
  },
  addMap: {
    id: "add_map_button",
    defaultMessage: "Add Map",
  },
  confirmCancel: {
    id: "confirm_cancel",
    defaultMessage: "No, Cancel",
  },
  confirmConfirm: {
    id: "confirm_confirm",
    defaultMessage: "Yes",
  },
})
