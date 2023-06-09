/* eslint-disable jsx-a11y/anchor-has-content */
import { FC, useState, useEffect } from 'react';
import DataGrid, { Column, Editing, Button } from 'devextreme-react/data-grid';
import {
  Grid,
  Box,
  Button as ButtonMUI,
  LinearProgress,
  CircularProgress,
  Typography,
  makeStyles,
  Theme
} from '@material-ui/core';
import axios from 'src/utils/axios';

interface Model {
  id?: number;
  filename: string;
  version: number;
  dateUploaded: string;
  notes: string;
}

interface ModelsProps {
  networkId?: number;
  networkName?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  table: {
    height: '48.5vh'
  }
}));

const EngineerModels: FC<ModelsProps> = ({ networkId, networkName }) => {
  const classes = useStyles();
  const [refresh, setRefresh] = useState(false);
  const [models, setModels] = useState<Model[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<FileList>(null);
  const [uploadDisabled, setUploadDisabled] = useState(true);
  const [progress, setProgress] = useState<number>(null);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [downloadedFile, setDownloadedFile] = useState('');

  useEffect(() => {
    const params = {
      networkId: networkId,
      networkName: networkName,
      groundStationName: '',
      type: 'network'
    };
    axios.get('/get-engineering-models', { params }).then((res) => {
      setModels(res.data.models);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  const filesAdded = (event) => {
    setProgress(null);
    if (event.target.files.length > 0) setUploadDisabled(false);
    else setUploadDisabled(true);
    setUploadedFiles(event.target.files);
  };

  const handleUpload = (event) => {
    event.preventDefault();
    setUploadDisabled(true);
    setUploadComplete(false);

    let formData = new FormData();
    formData.append('file', uploadedFiles[0]);
    formData.append('networkId', networkId.toString());
    formData.append('groundStationName', '');
    formData.append('type', 'network');

    axios
      .post('/upload-model', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (data) => {
          setProgress(Math.round((100 * data.loaded) / data.total));
        }
      })
      .then((_res) => {
        setUploadComplete(true);
        setRefresh(!refresh);
      });
  };

  const handleDownload = (event) => {
    const params = {
      modelId: event.row.data.id,
      networkName: networkName,
      groundStationName: '',
      type: 'network'
    };
    axios.get('/download-model', { params }).then((res) => {
      setDownloadedFile(res.data.filename);
      downloadFile();
    });
  };

  const downloadFile = () => {
    const downloadButton = document.getElementById('download');
    downloadButton.click();
  };

  const editNotes = (event) => {
    const params = {
      modelId: event.oldData.id,
      notes: event.newData.notes
    };
    axios.post('/edit-engineering-model-notes', params).then((_res) => {
      setRefresh(!refresh);
    });
  };

  return (
    <div className={classes.root}>
      <DataGrid
        dataSource={models}
        showBorders={true}
        columnAutoWidth={true}
        className={classes.table}
        onRowUpdating={editNotes}
      >
        <Editing mode="batch" allowUpdating={true} />
        <Column
          type="buttons"
          allowSorting={false}
          allowEditing={false}
          width="10%"
        >
          <Button
            icon="download"
            hint="Download Model"
            onClick={handleDownload}
          />
        </Column>
        <Column
          dataField="filename"
          caption="File"
          allowSorting={false}
          allowEditing={false}
          width="20%"
        />
        <Column
          dataField="version"
          caption="Version"
          allowEditing={false}
          width="10%"
        />
        <Column
          dataField="dateUploaded"
          caption="Date Uploaded"
          allowEditing={false}
        />
        <Column
          dataField="notes"
          caption="Notes"
          allowSorting={false}
          allowEditing={true}
          width="40%"
        />
      </DataGrid>
      <a
        id="download"
        href={`/${downloadedFile}`}
        download
        style={{ display: 'none' }}
      />
      <input
        id="upload"
        type="file"
        accept=".zip"
        onChange={(e) => filesAdded(e)}
      />
      <ButtonMUI
        type="submit"
        onClick={handleUpload}
        size="small"
        variant="contained"
        color="secondary"
        disabled={uploadDisabled}
      >
        Upload New
      </ButtonMUI>
      <Grid container justify="center" alignItems="center">
        <Grid item md={12}>
          {progress && (
            <Box display="flex" alignItems="center">
              <Box width="100%" mr={1}>
                <LinearProgress variant="determinate" value={progress} />
              </Box>
              <Box minWidth={35}>
                <Typography variant="body2" color="textSecondary">
                  {`${Math.round(progress)}%`}
                </Typography>
              </Box>
            </Box>
          )}
        </Grid>
        <Grid item md={12}>
          {uploadComplete && <Typography>Upload complete!</Typography>}
          {progress === 100 && !uploadComplete && (
            <>
              <Typography>
                Your file has been uploaded to the server. Please wait while the
                file is saved to the database.
              </Typography>
              <CircularProgress />
            </>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default EngineerModels;
