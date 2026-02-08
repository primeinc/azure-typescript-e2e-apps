import { BlockBlobClient } from '@azure/storage-blob';
import { Box, Button, Card, CardMedia, Grid, Typography } from '@mui/material';
import { ChangeEvent, useState, useActionState } from 'react';
import ErrorBoundary from './components/error-boundary';
import { convertFileToArrayBuffer } from './lib/convert-file-to-arraybuffer';

import './App.css';

// Used only for local development
const API_SERVER = import.meta.env.VITE_API_SERVER as string;

type SasResponse = {
  url: string;
};
type ListResponse = {
  list: string[];
};

function App() {
  const containerName = `upload`;
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [list, setList] = useState<string[]>([]);

  const handleFileSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const { target } = event;

    if (!(target instanceof HTMLInputElement)) return;
    if (
      target?.files === null ||
      target?.files?.length === 0 ||
      target?.files[0] === null
    )
      return;

    setSelectedFile(target?.files[0]);
  };

  const [sasTokenUrl, getSasAction, isSasPending] = useActionState(
    async (_previousState: string, _formData: FormData) => {
      const permission = 'w'; //write
      const timerange = 5; //minutes

      if (!selectedFile) return '';

      const url = `${API_SERVER}/api/sas?file=${encodeURIComponent(
        selectedFile.name
      )}&permission=${permission}&container=${containerName}&timerange=${timerange}`;

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText} - URL: ${url}`);
        }
        const data: SasResponse = await response.json();
        return data.url;
      } catch (error: unknown) {
        if (error instanceof Error) {
          return `Error getting sas token: ${error.message}`;
        }
        return String(error);
      }
    },
    ''
  );

  const [uploadStatus, uploadAction, isUploadPending] = useActionState(
    async (_previousState: string, _formData: FormData) => {
      if (sasTokenUrl === '' || sasTokenUrl.startsWith('Error')) return '';

      try {
        const fileArrayBuffer = await convertFileToArrayBuffer(selectedFile as File);
        
        if (
          fileArrayBuffer === null ||
          fileArrayBuffer.byteLength < 1 ||
          fileArrayBuffer.byteLength > 256000
        ) {
          throw new Error('File is too large or empty');
        }

        const blockBlobClient = new BlockBlobClient(sasTokenUrl);
        await blockBlobClient.uploadData(fileArrayBuffer);

        const response = await fetch(`${API_SERVER}/api/list?container=${containerName}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText} - URL: ${response.url}`);
        }
        const data: ListResponse = await response.json();
        setList(data.list);

        return 'Successfully finished upload';
      } catch (error: unknown) {
        if (error instanceof Error) {
          return `Failed to finish upload with error : ${error.message}`;
        }
        return String(error);
      }
    },
    ''
  );

  return (
    <>
      <ErrorBoundary>
        <Box m={4}>
          {/* App Title */}
          <Typography variant="h4" gutterBottom>
            Upload file to Azure Storage
          </Typography>
          <Typography variant="h5" gutterBottom>
            with SAS token
          </Typography>
          <Typography variant="body1" gutterBottom>
            <b>Container: {containerName}</b>
          </Typography>

          {/* File Selection Section */}
          <Box
            display="block"
            justifyContent="left"
            alignItems="left"
            flexDirection="column"
            my={4}
          >
            <Button variant="contained" component="label">
              Select File
              <input type="file" hidden onChange={handleFileSelection} />
            </Button>
            {selectedFile && selectedFile.name && (
              <Box my={2}>
                <Typography variant="body2">{selectedFile.name}</Typography>
              </Box>
            )}
          </Box>

          {/* SAS Token Section */}
          {selectedFile && selectedFile.name && (
            <Box
              display="block"
              justifyContent="left"
              alignItems="left"
              flexDirection="column"
              my={4}
            >
              <form action={getSasAction}>
                <Button variant="contained" type="submit" disabled={isSasPending}>
                  {isSasPending ? 'Getting Token...' : 'Get SAS Token'}
                </Button>
              </form>
              {sasTokenUrl && (
                <Box my={2}>
                  <Typography variant="body2" color="success.main">
                    {sasTokenUrl.startsWith('Error') ? sasTokenUrl : 'SAS Token acquired successfully'}
                  </Typography>
                </Box>
              )}
            </Box>
          )}

          {/* File Upload Section */}
          {sasTokenUrl && !sasTokenUrl.startsWith('Error') && (
            <Box
              display="block"
              justifyContent="left"
              alignItems="left"
              flexDirection="column"
              my={4}
            >
              <form action={uploadAction}>
                <Button variant="contained" type="submit" disabled={isUploadPending}>
                  {isUploadPending ? 'Uploading...' : 'Upload'}
                </Button>
              </form>
              {uploadStatus && (
                <Box my={2}>
                  <Typography variant="body2" gutterBottom>
                    {uploadStatus}
                  </Typography>
                </Box>
              )}
            </Box>
          )}

          {/* Uploaded Files Display */}
          <Grid container spacing={2}>
            {list.map((item) => {
              const url = new URL(item);
              const fileName = decodeURIComponent(url.pathname.split('/').pop() || '');
              
              return (
                <Grid size={{ xs: 6, sm: 4, md: 3 }} key={item}>
                  <Card>
                    {item.toLowerCase().endsWith('.jpg') ||
                    item.toLowerCase().endsWith('.png') ||
                    item.toLowerCase().endsWith('.jpeg') ||
                    item.toLowerCase().endsWith('.gif') ? (
                      <CardMedia component="img" image={item} alt={fileName} />
                    ) : (
                      <Typography variant="body1" gutterBottom sx={{ p: 1, wordBreak: 'break-all' }}>
                        {fileName}
                      </Typography>
                    )}
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </ErrorBoundary>
    </>
  );
}

export default App;

