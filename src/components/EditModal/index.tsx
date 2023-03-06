import { Dialog, Stack, Typography, FormHelperText, Button } from '@mui/material'
import { Upload as UploadIcon } from '@mui/icons-material'
import { ReactNode, useState } from 'react'
import { useIntl } from 'react-intl'
import { MapData } from '../../views/Map'
import { TextInput } from '../TextInput'
import { msgs } from './messages'

export const EditModal = ({ map, onClose, open }: ShareModalProps) => {
  const { formatMessage } = useIntl()
  const [mapTitle, setMapTitle] = useState(map.title)
  const [mapDescription, setMapDescription] = useState(map.description)
  const [mapTerms, setMapTerms] = useState(map.terms)
  const [mapStyle, setMapStyle] = useState(map.mapStyle)
  const [accessToken, setAccessToken] = useState(map.accessToken)

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
    setMapStyle(event.target.value)
  }
  const handleAccessTokenChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAccessToken(event.target.value)
  }

  const handleClickCancel = () => {
    setMapTitle(map.title)
    setMapDescription(map.description)
    setMapTerms(map.terms)
    setMapStyle(map.mapStyle)
    setAccessToken(map.accessToken)
    onClose()
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
            variant="outlined"
            id="map-title"
            label={formatMessage(msgs.title)}
            value={mapTitle}
            onChange={handleTitleChange}
          />
          <TextInput
            variant="outlined"
            id="map-description"
            label={formatMessage(msgs.description)}
            value={mapDescription}
            onChange={handleDescriptionChange}
            minRows={4}
            multiline
          />
          <TextInput
            variant="outlined"
            id="map-terms"
            label={formatMessage(msgs.terms)}
            value={mapTerms}
            onChange={handleTermsChange}
            renderHelperText={() => <FormHelperText>{formatMessage(msgs.termsHelper)}</FormHelperText>}
          />
          <TextInput
            variant="outlined"
            id="map-style"
            label={formatMessage(msgs.mapStyle)}
            value={mapStyle}
            onChange={handleStyleChange}
            renderHelperText={() => (
              <FormHelperText>
                {formatMessage(msgs.mapStyleHelperText)}{' '}
                <a href={formatMessage(msgs.mapStyleHelperUrl)}>{formatMessage(msgs.mapStyleHelperLink)}</a>
              </FormHelperText>
            )}
          />
          <TextInput
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
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  opacity: 0.8,
                }}
              >
                {formatMessage(msgs.cancel)}
              </Button>
              <Button
                variant="contained"
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
                }}
              >
                {formatMessage(msgs.save)}
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

type ShareModalProps = {
  map: MapData
  onClose: () => void
  open: boolean
}
