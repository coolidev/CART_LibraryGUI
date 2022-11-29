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
  Button,
  Typography,
} from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import { useSelector } from 'src/store';
import { Message } from '@material-ui/icons';

interface LoadingSPOverlayProps {
  isLoading: boolean;
  status: string;
  progress: number;
  orbitPropPct: number;
  geoRFVisibilityPct: number;
  statAnalysisPct: number;
  dataFetchPct: number;
  socketMessage: string;
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
  },
  console: {
    maxHeight: '90px',
    minHeight: '90px', 
    fontSize: '10px', 
    textAlign: 'left', 
    border: '1px solid black', 
    overflowY: 'scroll', 
    display: 'flex', 
    flexDirection: 'column-reverse'
  }
}));

const LoadingSPAnalysis: FC<LoadingSPOverlayProps> = ({
  isLoading,
  status,
  progress,
  orbitPropPct,
  geoRFVisibilityPct,
  statAnalysisPct,
  dataFetchPct,
  socketMessage,
}) => {
  const classes = useStyles();
  
  //percentage done a given section is
  const [progressPercent, setProgressPercent] = useState(0);
  const [orbitPropPercent, setOrbitPropPercent] = useState(0);
  const [geoRFVisibilityPercent, setGeoRFVisibilityPercent] = useState(0);
  const [statAnalysisPercent, setStatAnalysisPercent] = useState(0);
  const [dataFetchPercent, setDataFetchPercent] = useState(0);

  //if a given section is done variables
  const [orbitPropDone, setOrbitPropDone] = useState(false);
  const [geoRFVisibilityDone, setGeoRFVisibilityDone] = useState(false);
  const [statAnalysisDone, setStatAnalysisDone] = useState(false);
  const [dataFetchDone, setdataFetchDone] = useState(false);

  const[detailsOn, setDetailsOn] = useState(false);
  const[detailedStatus, setDetailedStatus] = useState('>Starting...\n')
  const[detailedPercentage, setDetailedPercentage] = useState('')

  const { zoom } = useSelector((state) => state.zoom);

  //cahnge the progress if it is progressing
  useEffect(() => {
    if(progress === 0 || progress > progressPercent){
      setProgressPercent(progress);
    }
  },[progress]);

  //set everything to zero at the start
  useEffect(() => {
    if(isLoading){
      setProgressPercent(0);
      setOrbitPropPercent(0);
      setGeoRFVisibilityPercent(0);
      setStatAnalysisPercent(0);
      setDataFetchPercent(0);

      setOrbitPropDone(false);
      setGeoRFVisibilityDone(false);
      setStatAnalysisDone(false);
      setdataFetchDone(false);

      setDetailedStatus('>Starting...\n');
      setDetailedPercentage('>Starting...\n');
    }
  },[isLoading]);


  //set the coresponding percent to change when the input changes. If its at 100, mark it as done
  useEffect(() => {
    setOrbitPropPercent(orbitPropPct);
    if(!orbitPropDone){
      setOrbitPropDone(orbitPropPct == 100);
    }
    //for updating the details
    if(!isNaN(orbitPropPct)){
      setDetailedPercentage(detailedStatus + orbitPropPct.toFixed(2) + '%');
    }
  },[orbitPropPct]);

  useEffect(() => {
    setGeoRFVisibilityPercent(geoRFVisibilityPct);
    if(!geoRFVisibilityDone){
      setGeoRFVisibilityDone(geoRFVisibilityPct == 100);
    }
    //for updating the details
    if(!isNaN(geoRFVisibilityPct) && geoRFVisibilityPct < 100){
      setDetailedPercentage(detailedStatus + geoRFVisibilityPct.toFixed(2) + '%');
    }
  },[geoRFVisibilityPct]);

  useEffect(() => {
    setStatAnalysisPercent(statAnalysisPct);
    if(!statAnalysisDone){
      setStatAnalysisDone(statAnalysisPct == 100);
    }
    //for updating the details
    if(!isNaN(statAnalysisPct)){
      setDetailedPercentage(detailedStatus + statAnalysisPct.toFixed(2) + '%');
    }
  },[statAnalysisPct]);

  useEffect(() => {
    setDataFetchPercent(dataFetchPct);
    if(!dataFetchDone){
      setdataFetchDone(dataFetchPct == 100);
    }
    //for updating the details
    if(!isNaN(dataFetchPct)){
      setDetailedPercentage(detailedStatus + dataFetchPct + '%');
    }
  },[dataFetchPct]);

  useEffect(() => {
    setDetailedStatus(detailedStatus + '>' + socketMessage + '\n');
  },[socketMessage])

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
                <div className={classes.paperStatus}>{'Orbit Propagator'}
                {orbitPropDone?
                <CheckIcon fontSize="small" className={classes.icon} />:
                <CircularProgress 
                  variant={ "determinate"}
                  size={20}
                  thickness={8}
                  value={orbitPropPercent??100}
                />
                }</div>
                </Box></Grid>
                <Grid item md={6} className={classes.paperStatus}>
                <Box>
                  <div className={classes.paperStatus}>{'Geometric & RF Analysis'}
                  {geoRFVisibilityDone?
                  <CheckIcon fontSize="small" className={classes.icon} />:
                  <CircularProgress 
                    variant={"determinate"}
                    size={20}
                    thickness={8}
                    value={geoRFVisibilityPercent??100}
                  />
                  }</div>
                </Box></Grid>
                <Grid item md={6} className={classes.paperStatus}>
                <Box>
                <div className={classes.paperStatus}>{'Statistical Analysis'}
                {statAnalysisDone?
                <CheckIcon fontSize="small" className={classes.icon} />:
                <CircularProgress 
                  variant={"determinate"}
                  size={20}
                  thickness={8}
                  value={statAnalysisPercent??100}
                />
                }</div>
                </Box></Grid>
                <Grid item md={6} className={classes.paperStatus}>
                <Box>
                  <div className={classes.paperStatus}>{'Fetching Data'}
                  {dataFetchDone?
                  <CheckIcon fontSize="small" className={classes.icon} />:
                  <CircularProgress 
                    variant={"determinate"}
                    size={20}
                    thickness={8}
                    value={dataFetchPercent??100}
                  />
                  }</div>
                </Box>
                </Grid>
                {detailsOn && (
                  <Grid item md = {12}>
                    <Typography style = {{whiteSpace: 'pre-wrap'}}>
                      <div className = {classes.console}>
                        {detailedPercentage}
                      </div>
                    </Typography>
                  </Grid>
                )}
                <Grid item md = {12}>
                  <Button
                  style={{float: 'right'}}
                  onClick = {() => {
                    setDetailsOn(!detailsOn)
                  }}
                  variant="contained" 
                  color="primary">
                    Details {detailsOn? '↑': '↓'}
                  </Button>
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

export default LoadingSPAnalysis;