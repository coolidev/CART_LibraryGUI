/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useState, useEffect, useRef } from 'react';
import {
  Button,
  Typography,
  makeStyles,
  Box,
  Select,
  MenuItem,
  useTheme,
  IconButton,
  Grid,
  DialogContent,
  Dialog,
  DialogActions,
  DialogContentText,
  DialogTitle
} from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import axios from 'src/utils/axios';
import { useDispatch, useSelector } from 'src/store';
import { updateAnalyticsPanel, updateAnalyticsView } from 'src/slices/results';
import type { State } from 'src/pages/home';
import type {
  Metric,
  RelayCharacteristics,
  GroundStationCharacteristics
} from 'src/types/evaluation';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails
} from 'src/components/Results/Accordion';
import TwoViewSection from 'src/pages/regression/LinePlot';
import Heatmap from 'src/pages/regression/Terrestrial/HeatMap';
import LineChartSection from 'src/components/Results/Analytics/LineChart';
import HistogramChartSection from 'src/components/Results/Analytics/HistogramChart';
import BoxChartSection from 'src/components/Results/Analytics/BoxChart';
import DialogBox from 'src/components/DialogBox';
import Plot from 'react-plotly.js';
import type { Theme } from 'src/theme';
import { THEMES } from 'src/utils/constants/general';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    overflowX: 'hidden',
    overflowY: 'hidden',
    padding: '5px',
    margin: theme.spacing(5, 3, 5, 3)
  },
  hide: {
    display: 'none',
    minHeight: '93vh',
    maxHeight: '93vh',
    overflowX: 'hidden',
    overflowY: 'hidden',
    padding: '5px'
  },
  popoutDialog: {
    minWidth: '50vw !important',
    maxWidth: '52vw !important',
    minHeight: '75vh !important',
    maxHeight: '78vh !important'
  },
}));

interface AnalyticsProps {
  state: State;
  parentWidth: number;
  visible: boolean;
  onState: (name: string, value: any) => void;
}

type Size = {
  width: number;
  height: number;
};

const initialSize = {
  width: 0,
  height: 0
};

const PLOT_TITLES = {
  relay: {
    'coverage': 'RF Coverage (%)',
    'no-coverage': 'No RF Coverage (%)',
    'doppler': 'Doppler',
    'dopplerRate': 'Doppler Rate',
    'trackingRate': 'Tracking Rate (deg/s)'
  },
  dte: {
    'coverage': 'RF Coverage (min/day)',
    'no-coverage': 'No RF Coverage (min/day)'
  }
};

const Analytics: FC<AnalyticsProps> = ({
  state,
  visible,
  parentWidth,
  onState
}) => {
  const theme = useTheme<Theme>();
  const classes = useStyles();
  const { zoom } = useSelector((state) => state.zoom);
  const dispatch = useDispatch();
  const panelElement = useRef<any>(null);
  const { performancePanel } = useSelector((state) => state.results);
  const [expanded, setExpanded] = useState<number>(1);
  const [parameters, setParameters] = useState(null);
  const [dataSource, setDataSource] = useState(null);
  const [dataType, setDataType] = useState('coverage');
  const [terrestrial, setTerrestrial] = useState(null);
  const [source, setSource] = useState({ plot_value: [] });
  const [regressionTypes, setRegressionTypes] = useState<string[]>([]);
  const [maxAltitude, setMaxAltitude] = useState(0);
  const [traces, setTraces] = useState<any>({});
  const [size, setSize] = useState<Size>(initialSize);
  const [popoutSize, setPopoutSize] = useState<Size>(initialSize);
  const [open, setOpen] = useState<string>(null);
  const [saveData, setSaveData] = useState<boolean>(false);
  const [savingData, setSavingData] = useState<boolean>(false);
  useEffect(() => {
    if(!state.isDataLoaded){
      setExpanded(1);
      setParameters(null);
      setDataSource(null);
      setDataType('coverage');
      setTerrestrial(null);
      setSource({ plot_value: [] });
      setRegressionTypes([]);
      setMaxAltitude(0);
      setTraces({});
    }
  },[state.isDataLoaded]);

  useEffect(() => {
    if (!performancePanel) return;

    if (state.radioButtonSelectionId > 0 && state.selectedItems.length === 1) {
      // Find the entry in the selected items list that is
      // currently selected.
      const selectedItem = state.selectedItems.find(
        (item) => item.id === state.radioButtonSelectionId
      );

      const networkType = state.networkType;
      const missionType = state.parameters.isOrbital
        ? 'orbital'
        : 'terrestrial';

      const newParameters = {
        system: state.radioButtonSelectionId,
        groundStation: state.radioButtonSelectionId,
        frequencyBand: selectedItem?.frequencyBandId,
        version:
          networkType === 'relay'
            ? selectedItem.versions[missionType]
            : selectedItem.version,
        dataType: dataType,
        networkType: networkType,
        missionType: missionType,
        altitude: state.parameters.altitude,
        inclination: state.parameters.inclination,
        latitude: state.parameters.latitude,
        longitude: state.parameters.longitude
      };

      // Set the types of regression curves to display.
      if (dataType === 'coverage' && !state.noRegression) {
        const newRegressionTypes: string[] = [];

        const metricType =
          state.networkType === 'relay' ? 'coverage' : 'coverageMinutes';
        if (
          Object.keys(performancePanel.predictedData.surfaces).includes(
            metricType
          )
        ) {
          newRegressionTypes.push('gam');
        }
        if (
          Object.keys(performancePanel.predictedData.coefficients).includes(
            metricType
          )
        ) {
          newRegressionTypes.push('glm');
        }

        setRegressionTypes(newRegressionTypes);
      } else {
        setRegressionTypes([]);
      }

      fetchCoveragePlot(newParameters);
    } else if (state.selectedItems.length > 1) {
      const newParameters = {
        userDefinedNetworkId: state.userDefinedNetworkId,
        frequencyBand: state.selectedItems[0]?.frequencyBandId,
        dataType: dataType,
        networkType: state.networkType,
        missionType: 'orbital',
        altitude: state.parameters.altitude,
        inclination: state.parameters.inclination
      };

      let points: Metric[];
      if (dataType === 'coverage') {
        points = performancePanel.modelData.orbital['coverageMinutes'].points;
      } else {
        points = performancePanel.modelData.orbital[
          'coverageMinutes'
        ].points.map((point) => {
          return {
            ...point,
            value: 1440 - point.value // Display minutes per day without coverage
          };
        });
      }

      const analyticsData = {
        source: { plot_value: points },
        terrestrial: {},
        maxAltitude: 1000
      };

      // Set the types of regression curves to display.
      if (dataType === 'coverage' && !state.noRegression) {
        const newRegressionTypes: string[] = [];

        if (
          Object.keys(performancePanel.predictedData.surfaces).includes(
            'coverageMinutes'
          )
        ) {
          newRegressionTypes.push('gam');
        }
        if (
          Object.keys(performancePanel.predictedData.coefficients).includes(
            'coverageMinutes'
          )
        ) {
          newRegressionTypes.push('glm');
        }

        setRegressionTypes(newRegressionTypes);
      } else {
        setRegressionTypes([]);
      }

      setUserPoint(newParameters, analyticsData, {});
    } else {
      setParameters(null);
      setSource({ plot_value: [] });
      setTerrestrial(null);
      setRegressionTypes([]);
      setTraces({});
      setMaxAltitude(0);
      onState('analyticsLoading', false);
    }
    setSavingData(false);
    onState('sync', false);
  }, [performancePanel, dataType]);

  // This fetches the data for the coverage plot.
  const fetchCoveragePlot = async (newParameters) => {
    const axiosParams = {
      networkType: newParameters.networkType,
      system: newParameters.system,
      groundStation: newParameters.groundStation,
      frequencyBand: newParameters.frequencyBand,
      version: newParameters.version,
      dataType: newParameters.dataType,
      database: newParameters.database,
      inclination: newParameters.inclination
    };
    const response = await axios.get<any>('/get-cart', { params: axiosParams });
    const data = response.data;
    let analyticsData;
    let terrestrialData;

    if (!dataType.includes('coverage')) {
      analyticsData = {
        source: {
            plot_value: data
        },
        terrestrial: {},
        maxAltitude: 1000
      };
      terrestrialData = {};
    } else {
      analyticsData = {
        source: data.data,
        terrestrial: state.networkType === 'relay' ? data.terrestrial : {},
        maxAltitude: data.data.data.maxAltitude
      };
      terrestrialData = data.terrestrial;
    }

    setUserPoint(newParameters, analyticsData, terrestrialData);
  };

  const uploadData = async () => {
    setSaveData(false);
    if(state.pointSync || state.parametric){
      setSavingData(true);
      const response = await axios.post<any>('/requestSPAUpload', 
      {simName: performancePanel.simulationOutputDir}
      )
    }
    
  }
  // This fetches the data needed for the running average plot,
  // the histogram, and the box plot. This needs to be called
  // every time the data ID or the data type changes.
  const fetchStatisticsPlots = async (newParameters, analyticsData?) => {
    const axiosParams = {
      networkType: newParameters.networkType,
      type: newParameters.missionType,
      dataType: newParameters.dataType,
      frequencyBand: newParameters.frequencyBand,
      fileId: newParameters.fileId,
      userAltitude_km: newParameters.altitude,
      userInclination_deg: newParameters.inclination,
      userDefinedNetworkId: newParameters.userDefinedNetworkId
    };
    const response = await axios.post<any>('/get-items', axiosParams);
    const data = response.data;

    let newTraces = {};
    if (!dataType.includes('coverage')) {
      newTraces = {
          histogram: data.histogram ?? [],
          boxPlot: data.boxPlot ?? []
      };
      setTraces(newTraces);
  } else {
      Object.keys(data).forEach((el: string) => {
        let ctype: string = data[el]['type'];
        let gaps: number[] = []; // better name(?): events
        let durations: number[] = [];
        let avgs: number[] = [];

        // Detect chart type and set Traces
        if (ctype === 'line') {
          data[el]['data'].forEach((item: number[], idx: number) => {
            gaps.push(idx + 1);
            durations.push(item[0]);
            avgs.push(item[1]);
          });

          newTraces[el] = {
            xTraces: gaps, // events
            yTraces: durations,
            avgTraces: avgs,
            type: ctype,
            title: data[el]['title']
          };
          setTraces((prevState: any) => ({
            ...prevState,
            [el]: {
              xTraces: gaps, // events
              yTraces: durations,
              avgTraces: avgs,
              type: ctype,
              title: data[el]['title']
            }
          }));
        } else if (ctype === 'histogram') {
          newTraces[el] = {
            xTraces: data[el]['data'],
            type: ctype,
            title: data[el]['title']
          };
          setTraces((prevState: any) => ({
            ...prevState,
            [el]: {
              xTraces: data[el]['data'],
              type: ctype,
              title: data[el]['title']
            }
          }));
        }
      });
    }

    if (analyticsData) {
      setSource(analyticsData.source);
      setTerrestrial(analyticsData.terrestrial);
      setMaxAltitude(analyticsData.maxAltitude);
    }

    // Now that all the data has been loaded,
    // store the results.
    dispatch(
      updateAnalyticsPanel({
        params: newParameters,
        source: analyticsData ? analyticsData.source : source,
        terrestrial: analyticsData ? analyticsData.terrestrial : terrestrial,
        traces: newTraces,
        maxAltitude: analyticsData ? analyticsData.maxAltitude : maxAltitude
      })
    );
    if (analyticsData) setDataSource(analyticsData);
    else
      setDataSource({
        source: source,
        terrestrial: terrestrial,
        maxAltitude: maxAltitude
      });

    onState('analyticsLoading', false);
  };

  // Determine the data ID that corresponds with the
  // selected data point.
  const fetchDataId = async (newParameters, analyticsData?) => {
    if (!newParameters.userDefinedNetworkId) {
      const axiosParams = {
        missionType: newParameters.missionType,
        userAltitude: newParameters.altitude,
        userInclination: newParameters.inclination,
        userLongitude: newParameters.longitude,
        userLatitude: newParameters.latitude,
        system: newParameters.system,
        version: newParameters.version,
        groundStation: newParameters.groundStation,
        networkType: newParameters.networkType
      };
      const response = await axios.get<any>('/get-file-id', {
        params: axiosParams
      });
      const data = response.data;

      newParameters = {
        ...newParameters,
        fileId: data
      };
    }

    setParameters(newParameters);

    // When the data ID changes, fetch new data
    // for the statistics plots (running average,
    // histogram, and box plot).
    fetchStatisticsPlots(newParameters, analyticsData);
  };

  const handleResize = (): void => {
    setSize({
      width: parentWidth * 0.87,
      height: (window.screen.availHeight / zoom) * 0.17
    });
    setPopoutSize({
      width: (window.innerWidth) * 0.46,
      height: (window.innerHeight) * 0.64
    });
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize);
  },[]);

  useEffect(() => {
    handleResize();
  }, [panelElement, traces, parentWidth]);

  // Update altitude/inclination and latitude/longitude.
  const setUserPoint = (newParameters, currentData, terrestrialData) => {
    // Select the altitude and inclination closest
    // to the values in the Mission Parameters panel.
    const inclinations: number[] = [];
    const inclinationDistances: number[] = [];
    currentData.source.plot_value.forEach((point) => {
      inclinations.push(point.inclination);
      inclinationDistances.push(
        Math.abs(point.inclination - newParameters.inclination)
      );
    });
    const closestInclinationIndex = inclinationDistances.indexOf(
      Math.min(...inclinationDistances)
    );
    const inclination = inclinations[closestInclinationIndex];

    const points = currentData.source.plot_value.filter(
      (item: any) => item.inclination === inclination
    );

    const altitudes: number[] = [];
    const altitudeDistances: number[] = [];
    const values: number[] = [];
    points.forEach((point) => {
      altitudes.push(point.altitude);
      altitudeDistances.push(Math.abs(point.altitude - newParameters.altitude));
      values.push(point.value);
    });
    const closestAltitudeIndex = altitudeDistances.indexOf(
      Math.min(...altitudeDistances)
    );
    const altitude = altitudes[closestAltitudeIndex];
    const value = values[closestAltitudeIndex];

    newParameters = {
      ...newParameters,
      altitude: altitude,
      inclination: inclination,
      value: value
    };

    // Select the latitude and longitude closest
    // to the values in the Mission Parameters panel.
    if (Object.keys(terrestrialData).length !== 0) {
      const longitudes: number[] = [];
      const longitudeDistances: number[] = [];
      terrestrialData.heatmap.x.forEach((long: number) => {
        longitudes.push(long);
        longitudeDistances.push(Math.abs(long - newParameters.longitude));
      });
      const closestLongitudeIndex = longitudeDistances.indexOf(
        Math.min(...longitudeDistances)
      );
      const longitude = longitudes[closestLongitudeIndex];

      let possibleLatitudes: number[] = [];
      for (let i = 0; i < terrestrialData.heatmap.x.length; i++) {
        if (terrestrialData.heatmap.x[i] === longitude) {
          possibleLatitudes.push(terrestrialData.heatmap.y[i]);
        }
      }

      const latitudes: number[] = [];
      const latitudeDistances: number[] = [];
      possibleLatitudes.forEach((lat) => {
        latitudes.push(lat);
        latitudeDistances.push(Math.abs(lat - newParameters.latitude));
      });
      const closestLatitudeIndex = latitudeDistances.indexOf(
        Math.min(...latitudeDistances)
      );
      const latitude = latitudes[closestLatitudeIndex];

      newParameters = {
        ...newParameters,
        longitude: longitude,
        latitude: latitude
      };
    }

    if (!dataType.includes('coverage')) {
      setParameters(newParameters);
      fetchStatisticsPlots(newParameters, currentData);
    } else {
      // Update the data ID after the user's coordinates have been set.
      fetchDataId(newParameters, currentData);
    }
  };

  useEffect(() => {
    // Executed whenever the user parameters change.
    if (state.radioButtonSelectionId > 0 && dataSource) {
      const selectedItem = state.selectedItems.find(
        (item) => item.id === state.radioButtonSelectionId
      );
      const missionType = state.parameters.isOrbital
        ? 'orbital'
        : 'terrestrial';
      const version =
        state.networkType === 'relay'
          ? selectedItem.versions[missionType]
          : selectedItem.version;

      const newParameters = {
        system: state.radioButtonSelectionId,
        groundStation: state.radioButtonSelectionId,
        frequencyBand: selectedItem?.frequencyBandId,
        version: version,
        dataType: dataType,
        networkType: state.networkType,
        missionType: missionType,
        altitude: state.parameters.altitude,
        inclination: state.parameters.inclination,
        latitude: state.parameters.latitude,
        longitude: state.parameters.longitude
      };

      setUserPoint(newParameters, dataSource, dataSource.terrestrial);
    }
  }, [state.parameters]);

  // Set new altitude and inclination (or latitude and longitude) when
  // the user clicks a point on the plot.
  const handleClick = (event: any) => {
    if (event) {
      let newParameters;
      if (state.parameters.isOrbital) {
        newParameters = {
          ...parameters,
          altitude: event.points[0].x,
          value: event.points[0].y
        };
      } else {
        newParameters = {
          ...parameters,
          longitude: event.points[0].x,
          latitude: event.points[0].y
        };
      }

      if (newParameters) fetchDataId(newParameters);
    }
  };

  const handleExpand = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const handleSelect = (event) => {
    setTraces({});
    if (!event.target.value.includes('coverage')) setExpanded(2);
    else setExpanded(1);
    setDataType(event.target.value);
    dispatch(
      updateAnalyticsView(event.target.value)
    );
  };

  const handleClose = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setOpen(open !== event.currentTarget.id && event.currentTarget.id);
  };

  return (
    <div ref={panelElement} className={visible ? classes.root : classes.hide}>
      <Box display="flex" alignItems="center" mb={5}>
        <Select
          disableUnderline
          value={dataType}
          onChange={handleSelect}
          style={{
            border: `1px solid ${theme.palette.border.main}`,
            borderRadius: 6,
            marginLeft: theme.spacing(3),
            padding: theme.spacing(0.5, 6),
            textAlignLast: 'center',
            backgroundColor: theme.palette.primary.main,
            color: '#fff'
          }}
        >
          <MenuItem value="coverage" style={{ textIndent: theme.spacing(5) }}>
            RF Coverage
          </MenuItem>
          <MenuItem
            value="no-coverage"
            style={{ textIndent: theme.spacing(5) }}
          >
            No RF Coverage
          </MenuItem>
          {state.networkType === 'relay' && <MenuItem 
            value="doppler"
            style={{ textIndent: theme.spacing(5) }}
          >
            {'Doppler'}
          </MenuItem>}
          {state.networkType === 'relay' && <MenuItem 
            value="dopplerRate"
            style={{ textIndent: theme.spacing(5) }}
          >
            {'Doppler Rate'}
          </MenuItem>}
          {state.networkType === 'relay' && <MenuItem 
            value="trackingRate"
            style={{ textIndent: theme.spacing(5) }}
          >
            {'Tracking Rate'}
          </MenuItem>}
        </Select>
        <Box flexGrow={1} />
        <Box mb={2}>
          <IconButton
            id={state.parameters.isOrbital ? 'two-view-section' : 'heatmap'}
            onClick={handleClose}
            disabled={!state.isDataLoaded}
          >
            <ExitToAppIcon color="primary" />
          </IconButton>
        </Box>        
      </Box>
      <Box mb={2} paddingLeft={'5%'}>
        {state.parameters.isOrbital ? (
          <TwoViewSection
            state={[{
              ...state,
              parameters: {
                isOrbital: true,
                orbitState: parameters?.orbitState,
                altitude: parameters?.altitude,
                inclination: parameters?.inclination,
                latitude: 0,
                longitude: 0,
                raan: parameters?.raan,
                eccentricity: parameters?.eccentricity,
                argumentOfPerigee: parameters?.argumentOfPerigee,
                trueAnomaly: parameters?.trueAnomaly
              }
            }]}
            data={[performancePanel]}
            metricData={source?.plot_value}
            //predictedData={performancePanel?.predictedData}
            metricType={
              dataType === 'coverage'
                ? state.networkType === 'relay'
                  ? 'coverage'
                  : 'coverageMinutes'
                : ''
            }
            regressionTypes={regressionTypes}
            isLegend={false}
            minAltitude={state.networkType === 'relay' ? 0 : 300}
            maxAltitude={maxAltitude}
            values={[parameters?.value]}
            isSub={false}
            size={size}
            yAxisLabel={Object.keys(PLOT_TITLES).includes(state.networkType) ? 
              PLOT_TITLES[state.networkType][dataType] : ''
            }
            plotOptions={{
              show_surface: true,
              show_scatter: true
            }}
            onClick={handleClick}
            chartDiv="RFCoverageplotly"
            isClickable={true}
          />
        ) : (
          <Heatmap
            metricType={
              dataType === 'coverage'
                ?  'coverage' : ''
            }
            isSubSection={true}
            isEarth={false}
            mode="heatmap"
            size={size}
            source={terrestrial}
            onClick={handleClick}
            isClickable={true}
          />
        )}
      </Box>
      {dataType.includes('coverage') && <Accordion expanded={expanded === 1} onChange={handleExpand(1)}>
        <AccordionSummary>
        {expanded === 1 ? (
            <>
              <Box
                bgcolor={theme.palette.border.main}
                py={2}
                px={3}
                borderRadius={6}
              >
                <Typography style={{color: '#fff'}}>
                  Running Coverage Average
                </Typography>
              </Box>
              <Box flexGrow={1} />
              <IconButton
                id="line-chart"
                onClick={handleClose}
                disabled={!state.isDataLoaded}
              >
                <ExitToAppIcon color="primary" />
              </IconButton>
              </>
          ) : (
            <Typography color="textPrimary">Running Coverage Average</Typography>
          )}
        </AccordionSummary>
        <AccordionDetails>
          <Box minHeight={(window.screen.availHeight / zoom) * 0.2} mx={1}>
            <LineChartSection
              source={
                traces
                  ? traces[dataType === 'coverage' ? 'coverage' : 'gap']
                  : null
              }
              metricType={dataType}
              size={size}
              networkType={state.networkType}
            />
          </Box>
        </AccordionDetails>
      </Accordion>}
      <Accordion expanded={expanded === 2} onChange={handleExpand(2)}>
        <AccordionSummary>
        {expanded === 2 ? (
            <>
              <Box
                bgcolor={theme.palette.border.main}
                py={2}
                px={3}
                borderRadius={6}
              >
                <Typography style={{color: '#fff'}}>Coverage Distribution</Typography>
              </Box>
              <Box flexGrow={1} />
              <IconButton
                id="histogram-chart"
                onClick={handleClose}
                disabled={!state.isDataLoaded}
              >
                <ExitToAppIcon color="primary" />
              </IconButton>
              </>
          ) : (
            <Typography color="textPrimary">Coverage Distribution</Typography>
          )}
        </AccordionSummary>
        <AccordionDetails>
          <Box minHeight={(window.screen.availHeight / zoom) * 0.2} mx={1}>
            <HistogramChartSection
              title={`<b>${Object.keys(PLOT_TITLES).includes(state.networkType) 
                ? PLOT_TITLES[state.networkType][dataType] : ''}</b>`}
              yAxisTitle={dataType.includes('coverage') 
                ? `Duration (${state.networkType === 'relay' ? 'sec' : 'min'})`
                : PLOT_TITLES['relay'][dataType]
              }
              data={dataType.includes('coverage') ? 
                [
                  {
                    y: traces ? traces[dataType === 'coverage'
                        ? 'coverage_histogram'
                        : 'gap_histogram'
                    ]?.xTraces : null,
                    boxpoints: 'all',
                    name: '',
                    type: 'box'
                  }
                ] : Object.keys(traces).includes('histogram') ? [
                    {
                      x: traces.histogram.bins,
                      y: traces.histogram.count,
                      type: 'bar',
                      name: ''
                    }
                  ] : []
              }
              size={size}
              networkType={state.networkType}
              metricType={dataType}
            />
          </Box>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 3} onChange={handleExpand(3)}>
        <AccordionSummary>
        {expanded === 3 ? (
            <>
              <Box
                bgcolor={theme.palette.border.main}
                py={2}
                px={3}
                borderRadius={6}
              >
                <Typography style={{color: '#fff'}}>
                  Coverage Statistics
                </Typography>
              </Box>
              <Box flexGrow={1} />
              <IconButton
                id="box-chart"
                onClick={handleClose}
                disabled={!state.isDataLoaded}
              >
                <ExitToAppIcon color="primary" />
              </IconButton>
              </>
          ) : (
            <Typography color="textPrimary">
              Coverage Statistics
            </Typography>
          )}
        </AccordionSummary>
        <AccordionDetails>
          <Box minHeight={(window.screen.availHeight / zoom) * 0.2} mx={1}>
            <BoxChartSection
              title={`<b>Statistics</b>`}
              yAxisTitle={dataType.includes('coverage') 
                ? `Duration (${state.networkType === 'relay' ? 'sec' : 'min'})`
                : PLOT_TITLES['relay'][dataType]
              }
              size={size}
              networkType={state.networkType}
              metricType={dataType}
              data={dataType.includes('coverage') ? [
                {
                  y: traces ? traces[dataType === 'coverage'
                      ? 'coverage_histogram'
                      : 'gap_histogram'
                  ]?.xTraces : null,
                  boxpoints: 'all',
                  name: '',
                  type: 'box'
                }
              ] : [
                {
                  mode: "markers",
                  type: "box",
                  name: '',
                  y: Object.keys(traces).includes('boxPlot') ? [
                    traces.boxPlot.minimum,
                    traces.boxPlot.quartile1,
                    traces.boxPlot.quartile1,
                    traces.boxPlot.median,
                    traces.boxPlot.quartile3,
                    traces.boxPlot.quartile3,
                    traces.boxPlot.maximum
                  ] : []
                }
              ]}
            />
          </Box>
        </AccordionDetails>
      </Accordion>
      {(performancePanel) &&
        <Button
        style={{float: 'right'}}
        onClick = {() => {
          setSaveData(true);
        }}
        variant="contained" 
        color="primary"
        disabled = {!state.pointSync || savingData}
        fullWidth>
           {savingData? 'Uploading Data...':'Upload Data'}
        </Button>
      }

    {saveData && (<Dialog
      open={saveData}
      keepMounted
      onClose={() => {
        setSaveData(false);
      }}
      >
      <DialogTitle style={{
            margin: 0,
            padding: '16px',
            backgroundColor:  theme.palette.primary.light
        }}>Are You Sure You Wish to Upload This Data?</DialogTitle>
      <DialogContent style={{ backgroundColor: theme.palette.component.main }}>
        <DialogContentText>
          By uploading the data from the results of this run, this will make the data availible to all other users of the CoSMOS software. If you do not wish for this to happen,
          or if the integrity of the data is poor, we request that you do not upload the data. If you still wish to upload the data anyways, press OK, otherwise press Return.
        </DialogContentText>
      </DialogContent>
      <DialogActions style={{ backgroundColor: theme.palette.component.main }}>
      <Button onClick={() => {
        setSaveData(false);
      }} 
      color="primary">
          {`Return`}
        </Button>
        <Button onClick={uploadData} color="primary">
          {`OK`}
        </Button>
      </DialogActions>
    </Dialog>
    )}
      

      {open && (
        <DialogBox
          id={open}
          title={'Analytics Plot'}
          isOpen={Boolean(open)}
          onClose={handleClose}
          classes={{ paper: classes.popoutDialog }}
          style={{overflow: 'hidden'}}
        >
          {open === 'two-view-section' && (
            <TwoViewSection
              state={[{
                ...state,
                parameters: {
                  isOrbital: true,
                  orbitState: parameters?.orbitState,
                  altitude: parameters?.altitude,
                  inclination: parameters?.inclination,
                  latitude: 0,
                  longitude: 0,
                  raan: parameters?.raan,
                  eccentricity: parameters?.eccentricity,
                  argumentOfPerigee: parameters?.argumentOfPerigee,
                  trueAnomaly: parameters?.trueAnomaly
                }
              }]}
              data={[performancePanel]}
              metricData={source?.plot_value}
              //predictedData={performancePanel?.predictedData}
              metricType={
                dataType === 'coverage'
                  ? state.networkType === 'relay'
                    ? 'coverage'
                    : 'coverageMinutes'
                  : ''
              }
              regressionTypes={regressionTypes}
              isLegend={false}
              minAltitude={state.networkType === 'relay' ? 0 : 300}
              maxAltitude={maxAltitude}
              values={[parameters?.value]}
              isSub={false}
              size={popoutSize}
              yAxisLabel={
                state.networkType === 'relay'
                  ? dataType === 'coverage'
                    ? 'RF Coverage (%)'
                    : 'No RF Coverage (%)'
                  : dataType === 'coverage'
                  ? 'RF Coverage (min/day)'
                  : 'No RF Coverage (min/day)'
              }
              plotOptions={{
                show_surface: true,
                show_scatter: true
              }}
              onClick={handleClick}
              chartDiv="RFCoverageplotly"
              isClickable={true}
            />
          )}
          {open === 'heatmap' && (
            <Heatmap
              metricType={
                dataType === 'coverage'
                  ? state.networkType === 'relay'
                    ? 'coverage'
                    : 'coverageMinutes'
                  : ''
              }
              isSubSection={true}
              isEarth={false}
              mode="heatmap"
              size={popoutSize}
              source={terrestrial}
              onClick={handleClick}
              isClickable={true}
            />
          )}
          {open === 'line-chart' && (
            <LineChartSection
              source={
                traces
                  ? traces[dataType === 'coverage' ? 'coverage' : 'gap']
                  : null
              }
              metricType={dataType}
              size={popoutSize}
              networkType={state.networkType}
            />
          )}
          {open === 'histogram-chart' && (
            <HistogramChartSection
              title={`<b>${Object.keys(PLOT_TITLES).includes(state.networkType) 
                ? PLOT_TITLES[state.networkType][dataType] : ''}</b>`}
              yAxisTitle={dataType.includes('coverage') 
                ? `Duration (${state.networkType === 'relay' ? 'sec' : 'min'})`
                : PLOT_TITLES['relay'][dataType]
              }
              data={dataType.includes('coverage') ? 
              [
                {
                  y: traces ? traces[dataType === 'coverage'
                      ? 'coverage_histogram'
                      : 'gap_histogram'
                  ]?.xTraces : null,
                  boxpoints: 'all',
                  name: '',
                  type: 'box'
                }
              ] : Object.keys(traces).includes('histogram') ? [
                  {
                    x: traces.histogram.bins,
                    y: traces.histogram.count,
                    type: 'bar',
                    name: ''
                  }
                ] : []}
              size={popoutSize}
              networkType={state.networkType}
              metricType={dataType}
            />
            )}
          {open === 'box-chart' && (
            <BoxChartSection
              title={`<b>Statistics</b>`}
              yAxisTitle={dataType.includes('coverage') 
                ? `Duration (${state.networkType === 'relay' ? 'sec' : 'min'})`
                : PLOT_TITLES['relay'][dataType]
              }
              data={dataType.includes('coverage') ? [
                {
                  y: traces ? traces[dataType === 'coverage'
                      ? 'coverage_histogram'
                      : 'gap_histogram'
                  ]?.xTraces : null,
                  boxpoints: 'all',
                  name: '',
                  type: 'box'
                }
              ] : [
                {
                  mode: "markers",
                  type: "box",
                  name: '',
                  y: Object.keys(traces).includes('boxPlot') ? [
                    traces.boxPlot.minimum,
                    traces.boxPlot.quartile1,
                    traces.boxPlot.quartile1,
                    traces.boxPlot.median,
                    traces.boxPlot.quartile3,
                    traces.boxPlot.quartile3,
                    traces.boxPlot.maximum
                  ] : []
                }
              ]}
              size={popoutSize}
              networkType={state.networkType}
              metricType={dataType}
            />
            )}
        </DialogBox>
      )}
    </div>
  );
};

export default Analytics;
