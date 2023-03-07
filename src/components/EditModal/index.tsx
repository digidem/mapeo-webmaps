import { Dialog, Stack, Typography, FormHelperText, Button, CircularProgress, useTheme } from '@mui/material'
import { Upload as UploadIcon } from '@mui/icons-material'
import { ReactNode, useState } from 'react'
import { useIntl } from 'react-intl'
import * as React from 'react'
import { MapData } from '../../views/Map'
import { TextInput } from '../TextInput'
import { msgs } from './messages'
import { mapboxStyleRegex } from '../../helpers/regex'

const DEFAULT_MAP_STYLE = 'mapbox://styles/mapbox/outdoors-v11'

export const EditModal = ({ map, onClose, open }: ShareModalProps) => {
  const { formatMessage } = useIntl()
  const theme = useTheme()
  const [mapTitle, setMapTitle] = useState(map.title)
  const [mapDescription, setMapDescription] = useState(map.description)
  const [mapTerms, setMapTerms] = useState(map.terms)
  const [mapStyle, setMapStyle] = useState(map.mapStyle || DEFAULT_MAP_STYLE)
  const [mapStyleError, setMapStyleError] = useState(false)
  const [accessToken, setAccessToken] = useState(map.accessToken)
  const [saving, setSaving] = useState(false)

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMapTitle(event.target.value)
  }
  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMapDescription(event.target.value)
  }
  const handleTermsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMapTerms(event.target.value)
  }
  const handleStyleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (mapStyleError) {
      validateMapboxStyle()
    }
    setMapStyle(event.target.value)
  }
  const handleAccessTokenChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAccessToken(event.target.value)
  }

  const handleClickCancel = () => {
    setMapTitle(map.title)
    setMapDescription(map.description)
    setMapTerms(map.terms)
    setMapStyle(map.mapStyle || DEFAULT_MAP_STYLE)
    setAccessToken(map.accessToken)
    setSaving(false)
    onClose()
  }

  const submit = (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setSaving(true)
  }

  const validateMapboxStyle = () => {
    console.log(!mapStyle.match(mapboxStyleRegex))
    setMapStyleError(!mapStyle.match(mapboxStyleRegex))
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <Stack spacing={5} sx={{ padding: 5 }} component="form">
        <Row>
          <Typography variant="h4" component="h2">
            {formatMessage(msgs.editMapDetails)}
          </Typography>
          <Button
            startIcon={<UploadIcon />}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              opacity: 0.8,
            }}
          >
            {formatMessage(msgs.replaceMapData)}
          </Button>
        </Row>

        <Stack spacing={3}>
          <TextInput
            required
            requiredColor={theme.palette.error.main}
            variant="outlined"
            disabled={saving}
            id="map-title"
            label={formatMessage(msgs.title)}
            value={mapTitle}
            onChange={handleTitleChange}
          />
          <TextInput
            variant="outlined"
            disabled={saving}
            id="map-description"
            label={formatMessage(msgs.description)}
            value={mapDescription}
            onChange={handleDescriptionChange}
            minRows={4}
            multiline
          />
          <TextInput
            variant="outlined"
            disabled={saving}
            id="map-terms"
            label={formatMessage(msgs.terms)}
            value={mapTerms}
            onChange={handleTermsChange}
            renderHelperText={() => <FormHelperText>{formatMessage(msgs.termsHelper)}</FormHelperText>}
          />
          <TextInput
            required
            requiredColor={theme.palette.error.main}
            disabled={saving}
            variant="outlined"
            id="map-style"
            label={formatMessage(msgs.mapStyle)}
            value={mapStyle}
            onChange={handleStyleChange}
            onBlur={validateMapboxStyle}
            renderHelperText={() => <RenderMapstyleHelperText hasError={mapStyleError} />}
          />
          <TextInput
            disabled={saving}
            variant="outlined"
            id="map-token"
            label={formatMessage(msgs.accessToken)}
            value={accessToken}
            onChange={handleAccessTokenChange}
          />

          <Row>
            <Button
              color="error"
              sx={{
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              {formatMessage(msgs.deleteMap)}
            </Button>
            <Row>
              <Button
                color="inherit"
                onClick={handleClickCancel}
                disabled={saving}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  opacity: 0.8,
                }}
              >
                {formatMessage(msgs.cancel)}
              </Button>
              <Button
                onSubmit={submit}
                onClick={submit}
                variant="contained"
                disabled={saving || !mapTitle || mapStyleError}
                size="large"
                type="submit"
                disableElevation
                sx={{
                  borderRadius: 8,
                  textTransform: 'none',
                  fontWeight: 600,
                  paddingX: 8,
                  paddingY: 2,
                  marginLeft: 4,
                  '&.Mui-disabled': {
                    backgroundColor: theme.primary,
                    color: theme.white,
                    opacity: 0.7,
                  },
                }}
              >
                {saving ? <CircularProgress sx={{ color: 'white' }} size={26} /> : formatMessage(msgs.save)}
              </Button>
            </Row>
          </Row>
        </Stack>
      </Stack>
    </Dialog>
  )
}

const Row = ({ children }: { children: ReactNode }) => (
  <Stack direction="row" justifyContent="space-between">
    {children}
  </Stack>
)

const RenderMapstyleHelperText = ({ hasError }: { hasError: boolean }) => {
  const { formatMessage } = useIntl()

  if (hasError) {
    return (
      <FormHelperText>
        <Typography variant="caption" color="error" component="span">
          {formatMessage(msgs.mapStyleHelperError1)}{' '}
        </Typography>
        <a href={formatMessage(msgs.mapStyleHelperUrl)}>{formatMessage(msgs.mapStyleHelperLink)}</a>.{' '}
        <Typography variant="caption" color="error" component="span">
          {formatMessage(msgs.mapStyleHelperError2)}{' '}
        </Typography>
      </FormHelperText>
    )
  }

  return (
    <FormHelperText>
      {formatMessage(msgs.mapStyleHelperText)}{' '}
      <a href={formatMessage(msgs.mapStyleHelperUrl)}>{formatMessage(msgs.mapStyleHelperLink)}</a>.
    </FormHelperText>
  )
}

type ShareModalProps = {
  map: MapData
  onClose: () => void
  open: boolean
}
