/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'src/utils/axios';
import { Box, Grid, colors, useTheme, makeStyles } from '@material-ui/core';
import useSettings from 'src/hooks/useSettings';
import { useAuth, useSMS } from 'src/hooks/useAuth';
import { Welcome } from 'src/components/Modals';
import { useSelector, useDispatch } from 'src/store';
import { getUser, updateEmail } from 'src/slices/user';
import { updateProject } from 'src/slices/project';
import type {
  ISave,
  Parameter,
  Specifications,
  Constraints,
  SelectedNetwork
} from 'src/types/preference';
import type { SystemType } from 'src/types/system';
import {
  checkUserDefinedNetwork,
  saveUserDefinedNetwork
} from 'src/algorithms/combineStations';
import { BASE_VALS as BaseVals } from 'src/config';
import Header from './Header';
import NavBar from './NavBar';
import SideBar from './SideBar';
import QuickAccess from './QuickAccess';
import Results from './Results';
import Network from './Network';
import Visualizer from './Visualizer';
import DialogAlert from 'src/components/DialogAlert';
import LoadingAnalysis from 'src/components/LoadingAnalysis';
import ConfirmDialog from 'src/components/ConfirmDialog';
import { updateResults } from 'src/slices/results';
import Alert from './Alert';
import type { Theme } from 'src/theme';
import { updateZoom } from 'src/slices/zoom';
import Introduction from '../../components/Modals/Introduction';
import LoadingOverlay from 'src/components/LoadingOverlay';
import LoadingSPAnalysis from 'src/components/LoadingSPAnalysis';
import { EARTH_RADIUS_km } from 'src/utils/constants/physical';

export interface IResults {
  dataRate_kbps: number;
  eirp_dBW: number;
  ebNo_dB: number;
  throughput_Gb_Day: number;
  maxThroughput_Gb_Day: number;
}

export interface State {
  name?: string;
  networkType: SystemType | null;
  radioButtonSelectionId: number;
  selectedItems: SelectedNetwork[];
  parameters: Parameter;
  specifications: Specifications;
  constraints: Constraints;
  results: IResults;
  regressionTypes: { [key: string]: string };
  qualityIndicators: { [key: string]: number };
  userDefinedNetworkId: number;
  save: string;
  sync: boolean;
  pointSync: boolean;
  parametric: boolean;
  mathematical: boolean;
  loading: boolean;
  alertMessage: { message: string; title: string };
  analyticsLoading: boolean;
  performanceLoading: boolean;
  comparisonLoading: boolean;
  isDataLoaded: boolean;
  isLastAnalysis: boolean;
  isLastSave: boolean;
  isMarkedForComparison: boolean;
  resultTab: string;
  noRegression: boolean;
  altitudeStep: {[key: string]: number}
  inclinationStep: {[key: string]: number}
}

export type ICollapsed = 'up' | 'down' | null;

const initialState: State = {
  networkType: null,
  radioButtonSelectionId: 0,
  selectedItems: [],
  parameters: {
    isOrbital: true,
    orbitState: 0,
    altitude: 300,
    inclination: 30,
    latitude: 30,
    longitude: 30,
    raan: 0,
    eccentricity: 0.0,
    argumentOfPerigee: 0.0,
    trueAnomaly: 0
  },
  specifications: {
    availability: 100,
    throughput: 100,
    tolerableGap: 6,
    trackingServiceRangeError: 20,
    eirp: -1
  },
  constraints: {
    launchYear: new Date().getFullYear() + 1,
    launchMonth: new Date().getMonth() + 1,
    launchDay: new Date().getDate(),
    endYear: new Date().getFullYear() + 2,    
    endMonth: new Date().getMonth() + 1,
    endDay: new Date().getDate(),
    defaultTime: true,
    powerAmplifier: 1,
    freqBandFilter: -1,
    centerFreqFilter: -1,
    polarizationType: -1,
    modulationFilter: -1,
    codingFilter: -1
  },
  results: {
    dataRate_kbps: 1000,
    eirp_dBW: 100,
    ebNo_dB: 4,
    throughput_Gb_Day: 100,
    maxThroughput_Gb_Day: 100
  },
  regressionTypes: {},
  qualityIndicators: {},
  userDefinedNetworkId: 0,
  save: null,
  sync: false,
  pointSync: false,
  parametric: false,
  mathematical: false,
  loading: false,
  alertMessage: { message: '', title: '' },
  analyticsLoading: true,
  performanceLoading: true,
  comparisonLoading: true,
  isDataLoaded: false,
  isLastAnalysis: false,
  isLastSave: false,
  isMarkedForComparison: false,
  resultTab: 'network',
  noRegression: false,
  altitudeStep: {start: 300, end: 400, step: 10},
  inclinationStep: {start: 0, end: 90, step: 10}
};

// Converts a State object to an ISave object.
export const convertStateToSave = (cache: ISave, state: State): ISave => {
  let save: ISave = { ...cache };

  const selectedNetworks = state.selectedItems.map((item) => {
    return {
      ...item,
      type: state.networkType
    };
  });

  save = {
    ...save,
    parameters: state.parameters,
    specifications: state.specifications,
    constraints: state.constraints,
    results: state.results,
    regressionTypes: state.regressionTypes,
    selectedNetworks: selectedNetworks,
    selectedSystemId: state.radioButtonSelectionId
  };

  return save;
};

// Converts an ISave object to a State object.
export const convertSaveToState = (save: ISave): State => {
  let state: State = { ...initialState };
  state = {
    ...state,
    selectedItems: save.selectedNetworks,
    parameters: save.parameters,
    specifications: save.specifications,
    constraints: {...state.constraints, defaultTime: true},
    results: save.results,
    regressionTypes: save.regressionTypes,
    radioButtonSelectionId: save.selectedSystemId,
    networkType: save.selectedNetworks[0]?.type as SystemType,
    save: save.id,
    name: save.name
  };

  return state;
};

const initialBounds = {
  altitude: {
    min: 0,
    max: 35785
  },
  inclination: {
    min: 0,
    max: 180
  },
  latitude: {
    min: -90,
    max: 90
  },
  longitude: {
    min: -180,
    max: 180
  },
  availability: {
    min: 0,
    max: 100
  },
  throughput: {
    min: 0,
    max: 1000000
  },
  tolerableGap: {
    min: 0,
    max: 100000
  },
  trackingServiceRangeError: {
    min: 0,
    max: 100000
  },
  launchYear: {
    min: 0,
    max: 3000
  },
  endYear: {
    min: 0,
    max: 3000
  },
  powerAmplifier: {
    min: 0,
    max: 100000
  },
  semiMajorAxis: {
    min: 0,
    max: EARTH_RADIUS_km + 35785
  }
};

const useStyles = makeStyles((theme: Theme) => ({
  inputPanel: {
  },
  sideBar: {
    // width: '60px',
  },
  quickAccess: {
    // width: '400px',
    // height: '757px'
  }
}));


const Home: FC = () => {
  const dispatch = useDispatch();
  const theme = useTheme<Theme>();
  const { zoom } = useSelector((state) => state.zoom);
  const { settings } = useSettings();

  const classes = useStyles(theme);

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isSaveViewOpen, setIsSaveViewOpen] = useState(false);
  const [isSavingNetwork, setIsSavingNetwork] = useState(false);
  const [isOpen, setOpen] = useState<boolean>(false);
  const [resultTab, setResultTab] = useState<string>('network');
  const [collapsed, setCollapsed] = useState<boolean>(true);
  const [isCollapsed, setIsCollapsed] = useState<ICollapsed>(null);
  const [currentTab, setCurrentTab] = useState<string>('mission');
  const [cache, setCache] = useState<ISave>(BaseVals);
  const [state, setState] = useState<State>(initialState);
  const [bounds, setBounds] = useState(initialBounds);
  const { preference } = useSelector((state) => state.preference);
  const { project } = useSelector((state) => state.project);
  const [projectExists, setProjectExists] = useState<boolean>(false);
  const [status, setStatus] = useState('');
  const [progress, setProgress] = useState(0);
  //@ts-ignore
  const { socket } = useSelector((state) => state.webSocket);
  
  const { setAuthTokens } = useAuth();
  const { setSMSTokens } = useSMS();
  const history = useHistory();
  const [introVisible, setIntroVisible] = useState(localStorage.getItem('introPopCheckbox') === 'true');
  const isChecked = localStorage.getItem('introPopCheckbox') === 'true';
  const [checked, setChecked] = useState(isChecked);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [askSinglePoint, setAskSinglePoint] = useState<boolean>(false);

  const [analyticsPct, setAnalyticsPct] = useState(0);
  const [performancePct, setPerformancePct] = useState(0);
  const [comparePct, setComparePct] = useState(0);
  const [linkPct, setLinkPct] = useState(0);
  const [orbitPropPct, setOrbitPropPct] = useState(0);
  const [geoRFVisibilityPct, setGeoRFVisibilityPct] = useState(0);
  const [statAnalysisPct, setStatAnalysisPct] = useState(0);
  const [dbUpdatePct, setDbUpdatePct] = useState(0);
  const [dataFetchPct, setDataFetchPct] = useState(0);
  const [socketMessage, setSocketMessage] = useState('');

  let cores = 0; 
  let coresDone = 0;

  useEffect(() => {
    handleBounds('endYear', 'min', state.constraints.launchYear);
  },[state.constraints.launchYear]);


  useEffect(() => {
    socket.addEventListener('message', (event) => {
      const eventMessage = event.data;

      if (eventMessage.includes('Progress:')) {
          setProgress(parseInt(eventMessage.slice(eventMessage.indexOf(':') + 1))/4 + 75);
          setSocketMessage("Preparing Data");
          setDataFetchPct(eventMessage.slice(eventMessage.indexOf(':') + 1));
      } else if (eventMessage.includes('AnalyticsPCT:')) {
        setAnalyticsPct(
          parseInt(eventMessage.slice(eventMessage.indexOf(':') + 1))
        );
      } else if (eventMessage.includes('PerformancePCT:')) {
        setPerformancePct(
          parseInt(eventMessage.slice(eventMessage.indexOf(':') + 1))
        );
      } else if (eventMessage.includes('ComparePCT:')) {
        setComparePct(
          parseInt(eventMessage.slice(eventMessage.indexOf(':') + 1))
        );
      } else if (eventMessage.includes('LinkBudgetPCT:')) {
        setLinkPct(parseInt(eventMessage.slice(eventMessage.indexOf(':') + 1))
        );
      } else if (eventMessage.includes('Orbit Propagator')) {
        let splicedMessage = eventMessage.slice(eventMessage.indexOf('message') + 11);
        let numer = parseInt(splicedMessage);
        let splicedMessage2 = splicedMessage.slice(splicedMessage.indexOf('/') + 1);
        let  denom = parseInt(splicedMessage2);
        let actualPercent = (numer/denom) * 25;
        setOrbitPropPct((numer/denom)*100);
        if(isNaN(actualPercent)){
          setStatus("Propagating Orbit...");
          setSocketMessage(splicedMessage.slice(0, splicedMessage.indexOf('"')))
        } else {
          setProgress(actualPercent);
        }
      } else if (eventMessage.includes('Geometric+RF Visibility Analyzer')) {
        let splicedMessage = eventMessage.slice(eventMessage.indexOf('message') + 11);
        if(splicedMessage.includes('cores')){
          cores = (parseInt(splicedMessage.slice(splicedMessage.indexOf('cores') - 3)));
          coresDone = 0;
          if(orbitPropPct < 100){
            setOrbitPropPct(100);
            setProgress(25);
          }
          setStatus("Running Geometric and RF Analysis...");
          setSocketMessage(splicedMessage.slice(0, splicedMessage.indexOf('"')))
          return;
        }
        
        if(cores <= 1){
          let numer = parseInt(splicedMessage);
          let splicedMessage2 = splicedMessage.slice(splicedMessage.indexOf('/') + 1);
          let  denom = parseInt(splicedMessage2);
          let actualPercent = (numer/denom) * 25 + 25;
          setGeoRFVisibilityPct((numer/denom)*100);
          if(orbitPropPct < 100){
            setOrbitPropPct(100);
          }
          if(isNaN(actualPercent)){
            setStatus("Running Geometric and RF Analysis...");
            setSocketMessage(splicedMessage.slice(0, splicedMessage.indexOf('"')))
          } else {
            setProgress(actualPercent);
          }
        } else {
          coresDone++;
          setGeoRFVisibilityPct((coresDone/cores)*100);
          setProgress((coresDone/cores)*25 + 25);
        }
        
      } else if (eventMessage.includes('Statistical Analyzer')) {
        let splicedMessage = eventMessage.slice(eventMessage.indexOf('message') + 11);
        let numer = parseInt(splicedMessage);
        let splicedMessage2 = splicedMessage.slice(splicedMessage.indexOf('/') + 1);
        let  denom = parseInt(splicedMessage2);
        let actualPercent = (numer/denom) * 25 + 50;
        setStatAnalysisPct((numer/denom)*100);
        if(isNaN(actualPercent)){
          setStatus("Running Statistical Analyzer...");
          setSocketMessage(splicedMessage.slice(0, splicedMessage.indexOf('"')))
        } else {
          setProgress(actualPercent);
        }
      } else if (eventMessage.includes('Simulation Driver')){
        setStatus("Starting Simulation...");
        setSocketMessage("Starting Simulation...")

      } else {
        if(event.data != ''){
          setStatus(eventMessage);
        }
      }
      console.log(eventMessage);
    });
  }, [socket]);

  useEffect(() => {
    // Check that the email stored in localStorage still has an account
    // in the database. 
    axios.get('/getUser', { params: { email: localStorage.getItem('email') }}).then(res => {
      dispatch(getUser());
      dispatch(updateEmail(res.data.email));
      axios.post<{ disabled: boolean }>('/getIntroStatus', { email: res.data.email }).then(res => {
        let disabledStatus;
        if (typeof res.data.disabled !== 'undefined') {
          setChecked(res.data.disabled);
          disabledStatus = res.data.disabled;
        }else{
          disabledStatus = false;
        }
        localStorage.setItem('introPopCheckbox', (!disabledStatus).toString());
        setIntroVisible(!res.data.disabled);
      });
      setIsLoading(false);
    }).catch(_error => {
      setAuthTokens('');
      setSMSTokens('');
      dispatch(updateProject(null));
      localStorage.clear();
      history.push('/signin');
      setIsLoading(false);
    });
    dispatch(getUser());
    dispatch(updateZoom());

    //Timeout used to limit the number of refreshes. Adjust value (ms) in setTimeout function to increase frequency of refreshes
    var timeout;
    window.onresize = function(){
      clearTimeout(timeout);
      timeout = setTimeout(handleZoom, 50);
    };

  }, []);

  function handleZoom() {
    dispatch(updateZoom());
  }

  useEffect(() => {
    if (!state.loading) {
      setProgress(0);
    }
  }, [state.loading]);

  useEffect(() => {
    if (!projectExists && preference) {
      setProjectExists(
        preference['project'].filter(
          (savedProject) => savedProject.id === project
        ).length > 0
      );
    }
  }, [project, preference]);

  useEffect(() => {
    if (!collapsed) return;
    state.selectedItems.length > 0 && setCollapsed(false);
  }, [state.selectedItems]);

  const handleCurrentTab = (value: string): void => setCurrentTab(value);

  const handleResultTab = (value: string): void => {
    setResultTab(value);
    handleState('resultTab', value);

    const isCollapse = value === resultTab && !collapsed;
    setCollapsed(isCollapse);
  };

  const handleState = (name: string, value) => {
    if (name === 'sync' && value) {
      setStatus('');
      setProgress(0);
      setOrbitPropPct(0);
      setStatAnalysisPct(0);
      setGeoRFVisibilityPct(0);
      setDbUpdatePct(0);
      setDataFetchPct(0);
      // If multiple ground stations are selected,
      // first check if the user-defined network
      // exists, and run the ground station combination
      // if necessary.
      if (state.selectedItems.length > 1) {
        setState((prevState) => ({
          ...prevState,
          loading: true
        }));
        handleUserDefinedNetwork(state);
      } else {
        setState((prevState) => ({
          ...prevState,
          sync: true,
          loading: true,
          analyticsLoading: true,
          performanceLoading: true,
          comparisonLoading: true,
          isLastAnalysis: true
        }));
      }
    } else if (name === 'save' && value) {
      // Extract the save object that is being loaded.
      let data = preference.project
        .find((item) => item.id === project)
        ?.saves.find((item) => item.id === value);

      if (data) {
        // Determine the type of networks that are currently selected
        // as part of the save being loaded.
        const networkType = data.selectedNetworks.some(
          (item) => item.type === 'relay'
        )
          ? 'relay'
          : 'dte';

        const parameters: any = {
          ... data.parameters,
          raan: data.parameters.raan??0,
          eccentricity: data.parameters.eccentricity??0,
          trueAnomaly: data.parameters.trueAnomaly??0,
          argumentOfPerigee: data.parameters.argumentOfPerigee??0
        }

        // Set the current state of the application to match the save.
        setState((prevState) => ({
          ...prevState,
          networkType,
          selectedItems: data.selectedNetworks,
          parameters: parameters,
          specifications: data.specifications,
          constraints: data.constraints,
          regressionTypes: data.regressionTypes ?? {},
          save: value,
          radioButtonSelectionId: data.selectedSystemId,
          isLastSave: true
        }));
      }
    } else if (
      name === 'networkType' ||
      name === 'radioButtonSelectionId' ||
      name === 'selectedItems'
    ) {
      if (name === 'selectedItems') {
        value = value.map((item) => {
          return {
            ...item,
            optimizedModCod: item.optimizedModCod ?? true,
            modulationId: item.modulationId ?? 0,
            modulation: item.modulation ?? '',
            codingId: item.codingId ?? 0,
            coding: item.coding ?? '',
            antennaId: item.antennaId ?? 0,
            antennaName: item.antennaName ?? 'Optimized',
            frequencyBandId: item.frequencyBandId ?? 0
          };
        });

        // If no items are selected, set the bounds on the
        // mission parameters to their initial values.
        if (value.length === 0) setBounds(initialBounds);
      }

      setState((prevState) => ({
        ...prevState,
        [name]: value
      }));
      resultTab !== 'network' && handleResultTab('network');
    } else if (
      name === 'parameters' ||
      name === 'specifications' ||
      name === 'constraints'
    ) {
      setState((prevState) => ({
        ...prevState,
        isLastSave: false,
        isMarkedForComparison: false,
        [name]: value
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  useEffect(() => {
    // Set loading to false when none of panels are loading data.
    if (
      !state.analyticsLoading &&
      !state.performanceLoading &&
      !state.comparisonLoading
    ) {
      setState((prevState) => ({
        ...prevState,
        loading: false,
        isDataLoaded: true
      }));
      setCollapsed(false);
      setResultTab('analytics');
    }
    
  }, [
    state.analyticsLoading,
    state.performanceLoading,
    state.comparisonLoading
  ]);

  useEffect(() => {
    if (!project) {
      dispatch(updateResults());
      setState(() => initialState);
      setBounds(initialBounds);
    }
  }, [project]);

  const handleUserDefinedNetwork = async (state: State) => {
    const data = {
      selectedNetworks: state.selectedItems,
      frequencyBandId: state.selectedItems[0].frequencyBandId,
      userAltitude_km: state.parameters.altitude,
      userInclination_deg: state.parameters.inclination,
      networkId: null
    };

    checkUserDefinedNetwork(data).then((status) => {
      if (status > 0) {
        // If this ground station combination has already been processed,
        // continue on to processing the data.
        setState((prevState) => ({
          ...prevState,
          sync: true,
          analyticsLoading: true,
          performanceLoading: true,
          comparisonLoading: true,
          isLastAnalysis: true,
          userDefinedNetworkId: status
        }));
      } else if (status === -1) {
        setState((prevState) => ({
          ...prevState,
          loading: false
        }));

        // If the the ground station combination that the user selected is
        // already being processed, alert the user to check back later.
        alert(`An analysis for the selected configuration is currently being 
          processed. Please try loading this configuration again in a couple hours
          to view the analysis results.`);
      } else {
        setState((prevState) => ({
          ...prevState,
          loading: false
        }));

        // If this combination of ground stations has never been processed,
        // run the analysis now.
        setIsSaveViewOpen(true);
      }
    });
  };

  const saveNetwork = () => {
    setIsSavingNetwork(!isSavingNetwork);

    const data = {
      selectedNetworks: state.selectedItems,
      frequencyBandId: state.selectedItems[0].frequencyBandId,
      userAltitude_km: state.parameters.altitude,
      userInclination_deg: state.parameters.inclination,
      networkId: null
    };
    saveUserDefinedNetwork(data).then((networkId) => {
      setState((prevState) => ({
        ...prevState,
        sync: true,
        analyticsLoading: true,
        performanceLoading: true,
        comparisonLoading: true,
        isLastAnalysis: true,
        userDefinedNetworkId: networkId
      }));
    });
  };

  const handleCache = (data: ISave): void => setCache(data);

  const handleBounds = (name, type, value) => {
    setBounds((prevState) => ({
      ...prevState,
      [name]: {
        ...prevState[name],
        [type]: value
      }
    }));
  };

  const handleError = (message: string, warning: boolean, title?: string) => {
    if (warning) {
      setState((prevState) => ({
        ...prevState,
        alertMessage: { message: message, title: title ?? 'Warning' }
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        alertMessage: { message: message, title: title ?? 'Error' },
        loading: false,
        isDataLoaded: false
      }));
    }

    setIsAlertOpen(true);
  };

  const handleCollapse = (value: ICollapsed): void => setIsCollapsed(value);
  
  return (
    <>
      <Box>
        <Header
          state={state}
          cache={cache}
          onOpen={() => setOpen(true)}
          onCache={handleCache}
          onState={handleState}
          setAskSinglePoint = {setAskSinglePoint}
          askSinglePoint = {askSinglePoint}
          bounds = {bounds}
        />
        <NavBar onClose={() => setOpen(false)} open={isOpen} openIntro={() => {setIntroVisible(!introVisible)}} />
        <Grid
          container
          justifyContent='center'
          style={{
            width: window.innerWidth - 10,
            minHeight: window.innerHeight - 60,
            // width: window.screen.availWidth / zoom,
            // minHeight: (window.screen.availHeight / zoom) * 0.82
          }}
        >
          <Grid
            item
            className={classes.inputPanel}
          >
            <Grid container>
              <Grid
                item
                className={classes.sideBar}
                style={{
                  width: 60 / zoom,
                  // width: (window.screen.availHeight / zoom) * 0.06,
                  backgroundColor: theme.palette.background.dark
                }}
              >
                <SideBar
                  currentTab={currentTab}
                  onCurrentTab={handleCurrentTab}
                />
              </Grid>
              <Grid
                item
                className={classes.quickAccess}
                style={{
                  width: 400 / zoom,
                  // width: (window.screen.availHeight / zoom) * 0.42,
                  backgroundColor: theme.palette.background.main,
                  minHeight: window.innerHeight - 60,
                  maxHeight: window.innerHeight - 60
                  // height: window.screen.availHeight *(.86/zoom)
                }}
              >
                <QuickAccess
                  currentTab={currentTab}
                  cache={cache}
                  state={state}
                  bounds={bounds}
                  onCache={handleCache}
                  onState={handleState}
                  networkPanelStatus={isCollapsed}
                  resultPanelCollapsed={collapsed}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid
            item
            style={{
              // width: collapsed
              //   ? window.screen.availWidth / zoom -
              //     (window.screen.availHeight / zoom) * 0.51
              //   : resultTab !== 'compare'
              //   ? window.screen.availWidth / zoom -
              //     (window.screen.availHeight / zoom) * 0.96
              //   : 0
              width: collapsed
                  ? window.innerWidth - 10 - 460 / zoom - 30 / zoom
                  : resultTab !== 'compare'
                  ? window.innerWidth - 10 - 460 / zoom - 460 / zoom - 30 / zoom
                  : 0
            }}
          >
            <Box
              style={{
                backgroundColor: theme.palette.background.light,
                minHeight:
                  isCollapsed === 'down'
                    ? 800
                    : isCollapsed === 'up'
                    ? 0
                    : 480
                // minHeight:
                //   isCollapsed === 'down'
                //     ? (window.screen.availHeight / zoom) * 0.785
                //     : isCollapsed === 'up'
                //     ? 0
                //     : (window.screen.availHeight / zoom) * 0.485
              }}
            >
              <Visualizer
                state={state}
                height={
                  isCollapsed === 'down'
                    ? 800
                    : isCollapsed === 'up'
                    ? 0
                    : 480
                }
              />
            </Box>
            <Box style={{ backgroundColor: theme.palette.background.dark }}>
              <Network
                state={state}
                cache={cache}
                isCollapsed={isCollapsed}
                onState={handleState}
                onBounds={handleBounds}
                onCollapsed={handleCollapse}
                visible={
                  resultTab !== 'compare' ||
                  (resultTab === 'compare' && collapsed)
                }
                resultsCollapsed={collapsed}
              />
            </Box>
          </Grid>
          <Grid
            item
            style={{
              backgroundColor: theme.palette.background.main,
              // width:
              //   resultTab === 'compare'
              //     ? collapsed
              //       ? (window.screen.availHeight / zoom) * 0.03
              //       : window.screen.availWidth / zoom -
              //         (window.screen.availHeight / zoom) * 0.48
              //     : collapsed
              //     ? (window.screen.availHeight / zoom) * 0.03
              //     : (window.screen.availHeight / zoom) * 0.48
              width: resultTab === 'compare'
                ? collapsed
                  ? 30 / zoom
                  : window.innerWidth - 10 - 60 / zoom - 400 / zoom
                : collapsed
                  ? 30 / zoom
                  : 460 / zoom + 30 / zoom
            }}
          >
            <Results
              width={resultTab === 'compare'
                ? collapsed
                  ? 30 / zoom
                  : window.innerWidth - 10 - 60 / zoom - 400 / zoom
                : collapsed
                  ? 30 / zoom
                  : 460 / zoom + 30 / zoom}
              // width={resultTab === 'compare'
              //   ? collapsed
              //     ? (window.screen.availHeight / zoom) * 0.03
              //     : window.screen.availWidth / zoom -
              //     (window.screen.availHeight / zoom) * 0.48
              //   : collapsed
              //     ? (window.screen.availHeight / zoom) * 0.03
              //     : (window.screen.availHeight / zoom) * 0.48}
              state={state}
              bounds={bounds}
              collapsed={collapsed}
              resultTab={resultTab}
              onResultTab={handleResultTab}
              onState={handleState}
              onBounds={handleBounds}
              onError={handleError}
              />
          </Grid>
        </Grid>
        {isLoading && <LoadingOverlay isLoading={true} status='Loading Workspace...' progress={0}/> }
        {introVisible && !isLoading && <Introduction close={() => {setIntroVisible(false)}}/> }
        {(settings.isLogin || project === 'null' || !projectExists) && !introVisible && !isLoading && (
          <Welcome onConfirm={() => setProjectExists(true)} />
        )}
        {isAlertOpen && (
          <DialogAlert
            isOpen={isAlertOpen}
            onOpen={() => setIsAlertOpen(!isAlertOpen)}
            title={state.alertMessage.title}
            message={state.alertMessage.message}
          />
        )}
        {isSaveViewOpen && (
          <ConfirmDialog
            isOpen={isSaveViewOpen}
            isLoading={isSavingNetwork}
            onOpen={() => setIsSaveViewOpen(!isSaveViewOpen)}
            onLoading={() => saveNetwork()}
            onState={handleState}
          />
        )}
        {(state.loading && !state.pointSync) && (
          <LoadingAnalysis
            isLoading={state.loading}
            status={status}
            state={state}
            progress={progress}
            analyticsPct={analyticsPct}
            perfPct={performancePct}
            comparePct={comparePct}
            linkPct={linkPct}
          />
        )}
        {(state.loading && (state.pointSync || state.parametric)) && (
          <LoadingSPAnalysis
            isLoading={state.loading}
            status={status}
            progress={progress}
            orbitPropPct= {orbitPropPct}
            geoRFVisibilityPct= {geoRFVisibilityPct}
            statAnalysisPct= {statAnalysisPct}
            dataFetchPct= {dataFetchPct}
            socketMessage = {socketMessage}
          />
        )}
      </Box>
    </>
  );
};

export default Home;
