import { FC, useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import {
  Grid,
  Button,
  TextField,
  makeStyles,
  Theme,
  InputLabel,
  MenuItem,
  Select,
  Paper,
  Tab,
  Tabs
} from '@material-ui/core';
import axios from 'src/utils/axios';
import { State } from 'src/components/Details/DteDetails';
import DialogBox from 'src/components/DialogBox';
import Confirm from './Confirm';

interface AddStationProps {
  id: string;
  state: State;
  onOpen: (event) => void;
  onState: (event) => void;
  initialize: () => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  dialog: {
    width: '25vw'
  },
  btn: {
    margin: theme.spacing(2)
  }
}));

/**
 * Dialog for adding Ground Station
 *
 * @param {*} {
 *   id,
 *   state,
 *   onOpen,
 *   onState,
 *   initialize
 * }
 * @return {*} 
 */
const AddStation: FC<AddStationProps> = ({
  id,
  state,
  onOpen,
  onState,
  initialize
}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [newMode, setNewMode] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [selection, setSelection] = useState();
  const [GSList, setGSList] = useState([]);

  const handleAdd = async () => {
    try {
      const params = {
        GSName: state.stationName,
        networkId: id
      };
      const response = await axios.post('/createGroundStation', params);
      response.data && initialize();
    } catch (err) {
      enqueueSnackbar('Something went wrong', {
        variant: 'error'
      });
    }
  };

  const handleExistingAdd = async () => {
    try {
      const params = {
        GSId: selection,
        dteId: id
      };
      const response = await axios.post('/duplicateGroundStation', params);
      response.data && initialize();
    } catch (err) {
      enqueueSnackbar('Something went wrong', {
        variant: 'error'
      });
    }
  };

  const handleGet = async () => {
    try {
      const params = {
        networkId: id
      };
      const response = await axios.post('/getOtherGroundStations', params);
      setGSList(response.data);
    } catch (err) {
      enqueueSnackbar('Something went wrong', {
        variant: 'error'
      });
    }
  };

  const handleConfirm = async () => {
    try {
      const params = {
        GSName: state.stationName,
        dteId: id
      };
      const response = await axios.post('/deleteGroundStation', params);
      response.data && initialize();
    } catch (err) {
      enqueueSnackbar('Something went wrong', {
        variant: 'error'
      });
    }
  };

  useEffect(() => {
    state.isStation && handleOpen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isStation]);

  const handleOpen = () => {
    setOpen(!open);
    onState({ target: { name: 'isStation', value: false } });
  };

  const handleChange = () => {
    setNewMode(!newMode);
  };

  const handleSelectionChange = (event) => {
    const GSId = event.target.value;
    setSelection(GSId);
  };

  return (
    <div>
      <DialogBox
        title={`Add Ground Station`}
        isOpen={state.station}
        onClose={() => onOpen('station')}
        className={{ paper: classes.dialog }}
      >
        <Paper className={classes.root}>
          <Tabs
            value={newMode}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab value={false} label="New" />
            <Tab value={true} label="Existing" />
          </Tabs>
        </Paper>
        {!newMode && (
          <Grid container justify="center" alignItems="center" spacing={2}>
            <Grid item md={8}>
              <TextField
                name="stationName"
                value={state.stationName}
                placeholder="Name of Ground Station"
                onChange={onState}
                fullWidth
              />
            </Grid>
            <Grid item md={4}>
              <Button
                name="submitSystem"
                variant="contained"
                color="primary"
                onClick={handleAdd}
              >
                Add
              </Button>
            </Grid>
          </Grid>
        )}

        {newMode && (
          <Grid container justify="center" alignItems="center" spacing={2}>
            <Grid item md={8}>
              <InputLabel id="label">Choose a Ground Station</InputLabel>
              <Select
                labelId="label"
                id="select"
                value={selection}
                onChange={handleSelectionChange}
                onOpen={handleGet}
                fullWidth={true}
              >
                {GSList.map((row: { id: number; name: string }) => (
                  <MenuItem value={row.id}>{row.name}</MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item md={4}>
              <Button
                name="submitSystem"
                variant="contained"
                color="primary"
                onClick={handleExistingAdd}
              >
                Add
              </Button>
            </Grid>
          </Grid>
        )}
      </DialogBox>
      <Confirm open={open} onOpen={handleOpen} onConfirm={handleConfirm} />
    </div>
  );
};

export default AddStation;
