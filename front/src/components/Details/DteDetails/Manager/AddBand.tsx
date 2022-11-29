import { FC, useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { Grid, Button, TextField, makeStyles, Theme } from '@material-ui/core';
import axios from 'src/utils/axios';
import { State } from 'src/components/Details/DteDetails';
import DialogBox from 'src/components/DialogBox';
import Confirm from './Confirm';

interface AddBandProps {
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
 * Dialog for adding Frequency Band
 *
 * @param {*} { state, onState, onOpen, initialize }
 * @return {*} 
 */
const AddBand: FC<AddBandProps> = ({ state, onState, onOpen, initialize }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleAdd = async () => {
    try {
      const params = {
        frequencyBandName: state.bandName,
        antennaName: state.antennaName
      };
      const response = await axios.post('/createFrequencyBand', params);
      response.data && initialize();
    } catch (err) {
      enqueueSnackbar('Something went wrong', {
        variant: 'error'
      });
    }
  };

  const handleConfirm = async () => {
    try {
      const params = {
        frequencyBandName: state.bandName,
        antennaName: state.antennaName
      };
      const response = await axios.post('/deleteFrequencyBand', params);
      response.data && initialize();
    } catch (err) {
      enqueueSnackbar('Something went wrong', {
        variant: 'error'
      });
    }
  };

  useEffect(() => {
    state.isBand && handleOpen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isBand]);

  const handleOpen = () => {
    setOpen(!open);
    onState({ target: { name: 'isBand', value: false } });
  };

  return (
    <div>
      <DialogBox
        id="band"
        title="Add Frequency Band"
        isOpen={state.band}
        onClose={() => onOpen('band')}
        className={{ paper: classes.dialog }}
      >
        <Grid container justify="center" alignItems="center" spacing={2}>
          <Grid item md={12}>
            <TextField
              name="bandName"
              type="text"
              value={state.bandName}
              placeholder="Name of Frequency Band"
              onChange={onState}
              fullWidth
            />
          </Grid>
          <Grid item md={12}>
            <TextField
              name="antennaName"
              type="text"
              value={state.antennaName}
              placeholder="Associated Antenna"
              onChange={onState}
              disabled
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
              Submit
            </Button>
          </Grid>
        </Grid>
      </DialogBox>
      <Confirm open={open} onOpen={handleOpen} onConfirm={handleConfirm} />
    </div>
  );
};

export default AddBand;
