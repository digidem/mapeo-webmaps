import { defineMessages } from 'react-intl'

export const messages = defineMessages({
  delete_title: {
    id: 'delete_title',
    defaultMessage: 'Delete {mapTitle}',
  },
  cannot_undo: {
    id: 'cannot_undo',
    defaultMessage: 'This cannot be undone',
  },
  will_be_deleted: {
    id: 'will_be_deleted',
    defaultMessage: 'This map will no longer be publicly accesible and all embedded maps will be deleted.',
  },
  delete_button: {
    id: 'delete_button',
    defaultMessage: 'Yes, Delete Map',
  },
  keep_button: {
    id: 'keep_button',
    defaultMessage: 'No, Keep Map',
  },
})
