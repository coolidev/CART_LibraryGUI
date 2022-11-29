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
  Paper,
  Select,
  Tab,
  Tabs
} from '@material-ui/core';
import axios from 'src/utils/axios';
import { State } from 'src/components/Details/DteDetails';
import DialogBox from 'src/components/DialogBox';
import Confirm from './Confirm';

interface AddAntennaProps {
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
  }
}));

/**
 * Dialog for adding Antenna
 *
 * @param {*} {
 *   id,
 *   state,
 *   onState,
 *   onOpen,
 *   initialize
 * }
 * @return {*} 
 */
const AddAntenna: FC<AddAntennaProps> = ({
  id,
  state,
  onState,
  onOpen,
  initialize
}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [newMode, setNewMode] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [selection, setSelection] = useState();
  const [antennaList, setAntennaList] = useState([]);

  const handleAdd = async () => {
    try {
      const params = {
        antennaName: state.antennaName,
        GSName: state.stationName,
        networkId: id
      };
      const response = await axios.post('/createAntenna', params);
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
        antennaId: selection,
        GSName: state.stationName,
        dteId: id
      };
      const response = await axios.post('/duplicateAntenna', params);
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
        networkId: id,
        groundStationName: state.stationName
      };
      const response = await axios.post('/getOtherAntennas', params);
      setAntennaList(response.data);
    } catch (err) {
      enqueueSnackbar('Something went wrong', {
        variant: 'error'
      });
    }
  };

  const handleConfirm = async () => {
    try {
      const params = {
        antennaName: state.antennaName,
        groundStationName: state.stationName,
        dteId: id
      };
      const response = await axios.post('/deleteAntenna', params);
      response.data && initialize();
    } catch (err) {
      enqueueSnackbar('Something went wrong', {
        variant: 'error'
      });
    }
  };

  useEffect(() => {
    state.isAntenna && handleOpen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isAntenna]);

  const handleOpen = () => {
    setOpen(!open);
    onState({ target: { name: 'isAntenna', value: false } });
  };

  const handleChange = () => {
    setNewMode(!newMode);
  };

  const handleSelectionChange = (event) => {
    const antennaId = event.target.value;
    setSelection(antennaId);
  };

  return (
    <div>
      <DialogBox
        id="antenna"
        title={`Add Antenna (${state.stationName})`}
        isOpen={state.antenna}
        onClose={() => onOpen('antenna')}
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
            <Grid item md={12}>
              <TextField
                name="antennaName"
                value={state.antennaName}
                placeholder="Name of Antenna"
                onChange={onState}
                fullWidth
              />
            </Grid>
            <Grid item md={12}>
              <TextField
                name="stationName"
                type="text"
                value={state.stationName}
                placeholder="Associated Ground Station"
                onChange={onState}
                disabled
                fullWidth
              />
            </Grid>
            <Grid item md={12}>
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
              <InputLabel id="label">Choose an Antenna</InputLabel>
              <Select
                labelId="label"
                id="select"
                value={selection}
                onChange={handleSelectionChange}
                onOpen={handleGet}
                fullWidth={true}
              >
                {antennaList.map((row: { id: number; name: string }) => (
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

export default AddAntenna;
