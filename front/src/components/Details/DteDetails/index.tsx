/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, FC } from 'react';
import {
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
  Typography,
  IconButton,
  CssBaseline,
  Tabs,
  Tab,
  Box,
  makeStyles,
  useTheme
} from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';
import { Close as CloseIcon } from '@material-ui/icons';
import axios from 'src/utils/axios';
import { Detail, Master } from 'src/types/details';
import EngineerModal from '../EngineerModal';
import Manager from './Manager';
import type { Theme } from 'src/theme';

interface DteDetailsProps {
  id: number;
  onClose: () => void;
}

export interface Source {
  id: number;
  detail: Detail;
  isAdmin: boolean;
}

export interface State {
  reload: boolean;
  station: boolean;
  stationName: string;
  antenna: boolean;
  modDemod: boolean;
  modDemodName: string;
  antennaName: string;
  band: boolean;
  bandName: string;
  isStation: boolean;
  isAntenna: boolean;
  isBand: boolean;
  isModDemod: boolean;
}

export const initialState: State = {
  reload: true,
  station: false,
  antenna: false,
  band: false,
  modDemod: false,
  stationName: '',
  antennaName: '',
  bandName: '',
  modDemodName: '',
  isStation: false,
  isAntenna: false,
  isBand: false,
  isModDemod: false
};

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<Function>
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  container: {
    paddingTop: theme.spacing(0.5)
  },
  card: {
    padding: theme.spacing(1)
  },
  backBtn: {
    width: '100px',
    height: '36px'
  },
  close: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
    zIndex: 100
  }
}));

/**
 * DTE Network Details Panel
 *
 * @param {*} { id, onClose }
 * @return {*} 
 */
const DteDetails: FC<DteDetailsProps> = ({ id, onClose }) => {
  const classes = useStyles();
  const theme = useTheme<Theme>();
  const email = localStorage.getItem('email');
  const [title, setTitle] = useState<string>('');
  const [source, setSource] = useState<Source>();
  const [state, setState] = useState<State>(initialState);
  const [currentTab, setCurrentTab] = useState<number>(1);

  useEffect(() => {
    const fetchData = async () => {
      const params = { id, email };
      const response = await axios.post<{
        master: Master[];
        detail: Detail;
        csvData: any;
        admin: { admin: boolean };
      }>('/requestDTEDetail', params);

      if (response.data) {
        const title = response.data.detail.system_name;
        const isAdmin = response.data.admin.admin;
        setSource({ id, detail: response.data.detail, isAdmin });
        setTitle(title);
      }
    };
    fetchData();
  }, [state.reload]);

  const initialize = () => setState({ ...initialState, reload: !state.reload });

  const handleState = (name: string, value: string | boolean) => {
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleChange = (event, value) => setCurrentTab(value);

  return (
    <Dialog
      open={Boolean(id)}
      TransitionComponent={Transition}
      maxWidth="lg"
      onClose={onClose}
      fullWidth
    >
      <CssBaseline />
      <DialogTitle style={{
            margin: 0,
            padding: '16px',
            backgroundColor: theme.palette.primary.light
        }}>
        <Typography component="strong" variant="h4">
          {title}
        </Typography>
        <IconButton className={classes.close} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers={true} style={{ backgroundColor: theme.palette.component.main }}>
        <Tabs
          value={currentTab}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleChange}
          aria-label="disabled tabs example"
        >
          <Tab value={1} label="Details" />
          <Tab value={2} label="Engineering Model" />
        </Tabs>
        <Box className={classes.container}>
          <CssBaseline />
          <Card className={classes.card}>
            <CardContent>
              {currentTab === 1 && source && (
                <Manager
                  dataSource={source}
                  state={state}
                  onState={handleState}
                  initialize={initialize}
                />
              )}
              {currentTab === 2 && (
                <EngineerModal networkId={id} networkName={title} />
              )}
            </CardContent>
          </Card>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default DteDetails;
