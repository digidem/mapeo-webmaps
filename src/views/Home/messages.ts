import { defineMessages } from "react-intl";

export const msgs = defineMessages({
  empty: {
    id: "empty_state",
    defaultMessage:
      'Click "ADD MAP" to publicly share a map from a .mapeomap file exported from Mapeo',
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
});
