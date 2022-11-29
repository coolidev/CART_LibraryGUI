import React, { FC, useState, useEffect, useCallback } from 'react';
import {
  Card,
  Box,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
  Tabs,
  Tab,
  Typography,
  IconButton,
  CssBaseline,
  makeStyles,
  useTheme
} from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';
import { Close as CloseIcon } from '@material-ui/icons';
import axios from 'src/utils/axios';
import type { Relay } from 'src/types/system';
import type { Detail, Master } from 'src/types/details';
import EngineerModal from '../EngineerModal';
import Manager from './Manager';
import type { Theme } from 'src/theme';

interface RelayDetailsProps {
  id: number;
  onClose: () => void;
}

export interface Source {
  id: number;
  detail: Detail;
  isAdmin: boolean;
}

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

const RelayDetails: FC<RelayDetailsProps> = ({ id, onClose }) => {
  const classes = useStyles();
  const theme = useTheme<Theme>();
  const [title, setTitle] = useState<string>('');
  const [source, setSource] = useState<Source>();
  const [currentTab, setCurrentTab] = useState<number>(1);

  const fetchOverview = useCallback(async () => {
    const response = await axios.get<Relay[]>('/requestExploreDashboard');
    if (response.data) {
      const data = response.data.find((item) => item.id === id);
      setTitle(data.system);
    }
  }, [id]);

  const fetchData = useCallback(async () => {
    const params = { id, email: localStorage.getItem('email') };
    const response = await axios.post<{
      master: Master[];
      detail: Detail;
      csvData: any;
      admin: { admin: boolean };
    }>('/requestExploreDetail', params);

    if (response.data) {
      const isAdmin = response.data.admin.admin;
      setSource({ id, detail: response.data.detail, isAdmin });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    fetchOverview();
    fetchData();
  }, [fetchOverview, fetchData]);

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
              {currentTab === 1 && source && <Manager {...source} />}
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

export default RelayDetails;
