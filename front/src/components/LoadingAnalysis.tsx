/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from 'react';
import {
  Backdrop,
  LinearProgress,
  makeStyles,
  Theme,
  colors,
  Paper,
  Grid,
  CircularProgress,
  Box,
} from '@material-ui/core';
import { State } from 'src/pages/home';
import CheckIcon from '@material-ui/icons/Check';
import { useSelector } from 'src/store';

interface LoadingOverlayProps {
  isLoading: boolean;
  status: string;
  state: State;
  progress: number;
  analyticsPct: number;
  perfPct: number;
  comparePct: number;
  linkPct: number;
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
  },
  progressBar: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
    borderRadius: 5
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff'
  },
  text: {
    color: colors.grey[100],
    fontWeight: 'bold',
    fontSize: theme.typography.pxToRem(16),
    marginLeft: theme.spacing(4)
  },
  paper: {
    padding: theme.spacing(4),
    textAlign: 'center',
    color: theme.palette.text.primary,
    borderRadius: 0
  },
  paperComment: {
    padding: theme.spacing(4),
    fontStyle: 'italic',
    fontSize: 12,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    borderRadius: 0
  },
  paperStatus: {
    padding: theme.spacing(1),
    fontStyle: 'bold',
    fontSize: 14,
    alignContent: 'center',
    color: theme.palette.text.primary,
    borderRadius: 0
  },
  icon: {
    color: colors.green[500]
  }
}));

const LoadingAnalysis: FC<LoadingOverlayProps> = ({
  isLoading,
  status,
  state,
  progress,
  analyticsPct,
  perfPct,
  comparePct,
  linkPct
}) => {
  const classes = useStyles();
  
  const [progressPercent, setProgressPercent] = useState(0);
  const [analyticsPercent, setAnalyticsPercent] = useState(0);
  const [performancePercent, setPerformancePercent] = useState(0);
  const [comparePercent, setComparePercent] = useState(0);
  const [linkPercent, setLinkPercent] = useState(0);
  const { zoom } = useSelector((state) => state.zoom);


  // useEffect(() => {
  //   if(Math.abs(progressPercent-progress)>25)
  //     return;
  //   setProgressPercent(progress);
  // },[progress]);

  useEffect(() => {
    if(progress % 25 === 0){
      let pct = 0;
      if(!state.performanceLoading){
        pct += 50;
      }
      if(!state.analyticsLoading){
        pct += 25;
      }
      if(!state.comparisonLoading){
        pct += 25;
      }
      if(pct === 0 || pct > progressPercent){
        setProgressPercent(pct);
      }
    }
  },[state.performanceLoading, state.analyticsLoading, state.comparisonLoading]);

  useEffect(() => {
    if(progress === 0 || progress > progressPercent){
      setProgressPercent(progress);
    }
  },[progress]);

  useEffect(() => {
    if(isLoading){
      setProgressPercent(0);
      setAnalyticsPercent(0);
      setPerformancePercent(0);
      setComparePercent(0);
      setLinkPercent(0);
    }
  },[isLoading]);

  useEffect(() => {
    setAnalyticsPercent(analyticsPct);
  },[analyticsPct]);

  useEffect(() => {
    setPerformancePercent(perfPct);
  },[perfPct]);

  useEffect(() => {
    setComparePercent(comparePct);
  },[comparePct]);

  useEffect(() => {
    setLinkPercent(linkPct);
  },[linkPct]);

  return (
    <>
      <Backdrop className={classes.backdrop} open={isLoading}>
        <Grid container justify="center">
          <Grid item style={{minWidth: ((window.screen.availHeight / zoom) * 0.5)}} xs={2} >
            <Paper className={classes.paper}>{status?.length>0?status:'Running Analysis...'}</Paper>
            <Box width="100%" mr={1}>
              <LinearProgress variant={"determinate"} value={progressPercent}/>
            </Box>
            <Paper className={classes.paperComment}>
              <br/>
              <Grid
                container
                justify="center"
                alignContent="flex-start"
                spacing={2}
              >
              <Grid item md={6} className={classes.paperStatus}>
                <Box>
                <div className={classes.paperStatus}>{'Analysis '}
                {state.analyticsLoading?
                <CircularProgress 
                  variant={analyticsPercent===0?"indeterminate":"determinate"}
                  size={20}
                  thickness={8}
                  value={analyticsPercent??100}
                />:<CheckIcon fontSize="small" className={classes.icon} />
                }</div>
                </Box></Grid>
                <Grid item md={6} className={classes.paperStatus}>
                <Box>
                  <div className={classes.paperStatus}>{'Performance '}
                  {state.performanceLoading?
                  <CircularProgress 
                    variant={performancePercent===0?"indeterminate":"determinate"}
                    size={20}
                    thickness={8}
                    value={performancePercent??100}
                  />:<CheckIcon fontSize="small" className={classes.icon} />
                  }</div>
                </Box></Grid>
                <Grid item md={6} className={classes.paperStatus}>
                <Box>
                  <div className={classes.paperStatus}>{'Link Budget '}
                  {state.performanceLoading?
                  <CircularProgress 
                    variant={linkPercent===0?"indeterminate":"determinate"}
                    size={20}
                    thickness={8}
                    value={linkPercent??100}
                  />:<CheckIcon fontSize="small" className={classes.icon} />
                  }</div>
                </Box></Grid>
                <Grid item md={6} className={classes.paperStatus}>
                <Box>
                <div className={classes.paperStatus}>{'Comparison '}
                {state.comparisonLoading?
                <CircularProgress 
                  variant={comparePercent===0?"indeterminate":"determinate"}
                  size={20}
                  thickness={8}
                  value={comparePercent??100}
                />:<CheckIcon fontSize="small" className={classes.icon} />
                }</div>
                </Box>
              </Grid>
              </Grid>
              <hr/>
              {'Please be patient as the results are computed.'}
            </Paper>
          </Grid>        
        </Grid>
      </Backdrop>
    </>
  );
};

export default LoadingAnalysis;