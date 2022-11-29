/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from 'react';
import { makeStyles, Grid } from '@material-ui/core';
import axios from 'src/utils/axios';
import { useDispatch, useSelector } from 'src/store';
import { 
  updateLinkBudget, 
  updatePerformancePanel,
  updateResults
} from 'src/slices/results';
import type { 
  PerformancePanel,
  RelayCharacteristics,
  GroundStationCharacteristics
} from 'src/types/evaluation';
import type { State } from 'src/pages/home';
import {
  getCoverage,
  getMaxThroughput
} from 'src/algorithms/coverage';
import { setLinkBudgets } from 'src/algorithms/link-budget';
import { calculateDataRate } from 'src/algorithms/link';
import { getOptimalModCod } from 'src/algorithms/link-optimization';
import ResultGroup from 'src/components/Results/Performance/ResultGroup';
import AntennaSection from 'src/components/Results/Performance/AntennaSection';
import PointingSection from 'src/components/Results/Performance/PointingSection';
import NavSection from 'src/components/Results/Performance/NavSection';
import PerformanceSection from 'src/components/Results/Performance/PerformanceSection';
import type { Theme } from 'src/theme';
import { LinkBudgetRow } from 'src/types/link-budget';
import { start } from 'repl';
import { isNull } from 'lodash';

interface PerformanceProps {
  state: State;
  bounds: { [key: string]: { min: number, max: number } };
  visible: boolean;
  onState: (name: string, value: any) => void;
  onBounds: (name: string, type: string, value: number) => void;
  onError: (message: string, warning: boolean, title?: string) => void;
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    maxHeight: '93vh',
    overflowX: 'hidden',
    overflowY: 'auto'
  },
  hide: {
    display: 'none',
    maxHeight: '93vh',
    overflowX: 'hidden',
    overflowY: 'auto'
  }
}));

const Performance: FC<PerformanceProps> = ({
  state,
  bounds,
  visible,
  onState,
  onBounds,
  onError,
}) => {
  const [data, setData] = useState<PerformancePanel>(null);
  const [projectName, setProjectName] = useState<string | null>(null);
  const classes = useStyles();
  const dispatch = useDispatch();
  const { performancePanel, linkBudget, modCodOptions } = useSelector(state => state.results);
  const { preference } = useSelector((state) => state.preference);
  const { project } = useSelector((state) => state.project);


  useEffect(() => {
    if(!state.isDataLoaded){
      setData(null);
    }
  },[state.isDataLoaded]);

  const fetchData = async (): Promise<[PerformancePanel, { [key: string]: LinkBudgetRow[] }]> => {
    if (performancePanel && linkBudget) {
      return [performancePanel, linkBudget];
    } else {
      const value = preference.project.find((item) => item.id === project);
      value && setProjectName(value.projectName);
      let response
      var today = new Date()
      let startDate = new Date(
        state.constraints.launchYear?? today.getFullYear() + 1, 
        state.constraints.launchMonth?? today.getMonth(), 
        state.constraints.launchDay?? today.getDate()
      );
      let endDate = new Date(
        state.constraints.endYear?? today.getFullYear() + 2, 
        state.constraints.endMonth?? today.getMonth(), 
        state.constraints.endDay?? today.getDate()
      );
      if(state.pointSync){
        response = await axios.post('/requestParametricAnalysis', {
          missionName : projectName ?? 'couldnotfind',
          selectedNetworks : state.selectedItems,
          userDefinedNetworkId : state.userDefinedNetworkId,
          altitude : [state.parameters.altitude],
          inclination : [state.parameters.inclination],
          eccentricity : state.parameters.eccentricity??0,
          configuration: state,
          simPeriod: (state.constraints.defaultTime != null && !state.constraints.defaultTime)? {startDate: startDate, endDate: endDate}: null
        });
      } else if(state.parametric){
        response = await axios.post('/requestParametricAnalysis', {
          missionName : projectName ?? 'couldnotfind',
          selectedNetworks : state.selectedItems,
          userDefinedNetworkId : state.userDefinedNetworkId,
          eccentricity : state.parameters.eccentricity??0,
          // altitude : null,
          // inclination : null,
          stepDefinition : {
            startAltitude : state.altitudeStep.start,
            stopAltitude : state.altitudeStep.end,
            altitudeStep : state.altitudeStep.step,
            startInclination : state.inclinationStep.start,
            stopInclination : state.inclinationStep.end,
            inclinationStep : state.inclinationStep.step
        },
        configuration: state 
      });
      } else if(state.mathematical){
        response = await axios.post('/requestCoverageEstWModel', {
          altitude : state.parameters.altitude, 
          inclination : state.parameters.inclination, 
          fieldOfView : 89, //hard coded value for FOV
          groundStationId : state.selectedItems[0].id,
          frequencyBandId: state.selectedItems[0].frequencyBandId,
          selectedNetworks: state.selectedItems,
          userDefinedNetworkId: state.userDefinedNetworkId,
          networkType: state.networkType,
          eccentricity : state.parameters.eccentricity 
        })
      }else {
        response = await axios.post('/requestSystemEval', {
          configuration: state
        });
      }
      let linkBudgetType: string;
      if (state.networkType === 'relay') {
        const isBentPipe = response.data.systemParams.isBentPipe;
        linkBudgetType = isBentPipe ? 'relay-bent-pipe' : 'relay-regenerative';
      } else {
        linkBudgetType = 'dte';
      }

      let allLinkBudgets = {};
      await Promise.all(state.selectedItems.map(async item => {
        const axiosParams = {
          type: linkBudgetType,
          email: localStorage.getItem('email'),
          networkId: state.networkType === 'relay' ? item.id : 0,
          antennaId: state.networkType === 'dte' ? item.antennaId : 0
        };
        const linkBudgetResponse = await axios.get<{ linkBudget: LinkBudgetRow[] }>('/get-link-budget', { params: axiosParams });

        dispatch(updateLinkBudget(item.id.toString(), linkBudgetResponse.data.linkBudget));
        allLinkBudgets[item.id] = linkBudgetResponse.data.linkBudget;
      }));
      return [response.data, allLinkBudgets];
    }
  };

  const refreshData = async () => {
    fetchData().then(async response => {
      const data = response[0];
      const linkBudget = response[1];
      let networkType = state.networkType;

      let newSystemParams;
      if (state.networkType === 'relay') {
        newSystemParams = data.systemParams as RelayCharacteristics;
      } else if (state.networkType === 'dte' && state.selectedItems.length === 1) {
        newSystemParams = data.systemParams as GroundStationCharacteristics;
      } else {
        newSystemParams = data.systemParams as { [key: string]: GroundStationCharacteristics };
      }

      if (networkType === 'dte') {
        const newSelectedItems = state.selectedItems.map(item => {
          let antennaId = 0;
          let antennaName = '';
          if (state.selectedItems.length > 1) {
            antennaId = newSystemParams[item.id].antennaId;
            antennaName = newSystemParams[item.id].antennaName;
          } else {
            antennaId = newSystemParams.antennaId;
            antennaName = newSystemParams.antennaName;
          }

          return {
            ...item,
            antennaId: antennaId,
            antennaName: antennaName
          };
        });

        onState('selectedItems', newSelectedItems);
      }

      
      if(!state.noRegression){
        // Set default regression types for each metric. 
        const newRegressionTypes: { [key: string]: string } = {};
        Object.keys(data.predictedData.regressionDefaults.regressionTypes).forEach(metricType => {
          /*if (Object.keys(state.regressionTypes).includes(metricType)) {
            newRegressionTypes[metricType] = state.regressionTypes[metricType];
          } else {
            newRegressionTypes[metricType] = data.predictedData.regressionDefaults.regressionTypes[metricType];
          }*/
          newRegressionTypes[metricType] = data.predictedData.regressionDefaults.regressionTypes[metricType];
        });
        onState('regressionTypes', newRegressionTypes);
        onState('qualityIndicators', data.predictedData.regressionDefaults.qualityIndicators);
      } 
        const coverage = getCoverage(state, data);

        // Use the coverage and the max data rate to determine the max
        // data volume for this user.
        let { maxThroughput_Gb_Day } = getMaxThroughput(state, data);

      
      const newSelectedItems = state.selectedItems.map(item => {
        const {
          modCodOptions,
          multipleAccess,
          bandwidthMHz,
          R_kbps
        } = state.selectedItems.length > 1 ? newSystemParams[item.id] : newSystemParams;

        let throughput = Math.min(state.specifications.throughput, maxThroughput_Gb_Day);
        if (state.selectedItems.length > 1) {
          const stationCoverage = getCoverage(state, data, item.id.toString());
          throughput = R_kbps * stationCoverage / Math.pow(10, 6) * 86400;
        }

        let modulationId = item.modulationId;
        let modulation = item.modulation;
        let codingId = item.codingId;
        let coding = item.coding;
        let achievableDataRate_kbps = state.results.dataRate_kbps;
        if (!item.modulationId || !item.modulation || !item.codingId || !item.coding) {
          const modCodOption = getOptimalModCod(
            modCodOptions,
            multipleAccess,
            throughput,
            coverage,
            bandwidthMHz,
            data.linkParams.modCodTable,
            data.linkParams.ebNoTable
          );
          if (modCodOption) {
            modulationId = modCodOption.modulationId;
            modulation = modCodOption.modulation;
            codingId = modCodOption.codingId;
            coding = modCodOption.coding;
            achievableDataRate_kbps = modCodOption.dataRate_kbps;
          }
        }
        
        if (multipleAccess === 'TDMA') {
          maxThroughput_Gb_Day = achievableDataRate_kbps * coverage / Math.pow(10, 6) * 86400;
        }

        return {
          ...item,
          modulationId: modulationId,
          codingId: codingId,
          modulation: modulation,
          coding: coding
        };
      });
      onState('selectedItems', newSelectedItems);

      // Update the throughput input field in the parameters panel. 
      // If the current throughput is greater than the max possible
      // throughput for the selected network and the currently 
      // selected user, set the throughput to the max throughput. 
      let throughput_Gb_Day = state.specifications.throughput;
      onBounds('throughput', 'max', maxThroughput_Gb_Day);
      if (state.specifications.throughput > maxThroughput_Gb_Day) {
        onState('specifications', {
          ...state.specifications,
          throughput: maxThroughput_Gb_Day
        });
        onError(`The throughput you've entered is greater than the throughput this network can support. Your throughput specification has been adjusted to ${maxThroughput_Gb_Day.toFixed(2)} Gb/Day.`, true, 'Info');

        // If we need to adjust the throughput down to the 
        // new maximum, set the data rate to the maximum as well. 
        throughput_Gb_Day = maxThroughput_Gb_Day;
      }

      // If the user ran a ground station combination, set
      // the throughput to the maximum value. Currently, we
      // do not allow the user to vary throughput for a 
      // combination of ground stations. 
      if (state.selectedItems.length > 1) {
        onState('specifications', {
          ...state.specifications,
          throughput: maxThroughput_Gb_Day
        });
      }

      const { dataRate_kbps } = calculateDataRate(
        throughput_Gb_Day,
        coverage,
        newSystemParams.modCodOptions,
        newSystemParams.multipleAccess,
        data.linkParams.ebNoTable,
        state.selectedItems[0].modulation,
        state.selectedItems[0].coding
      );

      throughput_Gb_Day = dataRate_kbps * coverage / Math.pow(10, 6) * 86400;

      const newState: State = {
        ...state,
        selectedItems: newSelectedItems,
        results: {
          ...state.results,
          dataRate_kbps: dataRate_kbps,
          throughput_Gb_Day: throughput_Gb_Day,
          maxThroughput_Gb_Day: maxThroughput_Gb_Day
        }
      };
      const {
        eirp_dBW,
        ebNo_dB
      } = await updateLinkBudgets(data, newState, linkBudget);

      onState('results', {
        dataRate_kbps: dataRate_kbps,
        eirp_dBW: eirp_dBW,
        ebNo_dB: ebNo_dB,
        throughput_Gb_Day: throughput_Gb_Day,
        maxThroughput_Gb_Day: maxThroughput_Gb_Day
      });
      dispatch(updatePerformancePanel(data));
      setData(data);
    }).then(() => {
      onState('performanceLoading', false);
    }).catch((error: { error: string }) => {
      console.log('ERROR', error);
      onError(error.error && error.error.length > 0 ? error.error : 'An error has occurred that has prevented your analysis from completing. Please contact CoSMOS Support for assistance.', false);
    });
  };

  useEffect(() => {
    // If sync is false, do nothing. 
    if (!state.sync) return;

    if (state.radioButtonSelectionId > 0) refreshData();
    onState('sync', false);
  }, [state.sync]);

  const updateThroughput = () => {
    // Whenever the user changes, the throughput is adjusted,
    // or the modulation and coding options change, recalculate 
    // the link budgets. 
    if (performancePanel && state.selectedItems.length > 0) {
      // Update the throughput input field in the parameters panel. 
      // If the current throughput is greater than the max possible
      // throughput for the selected network and the currently 
      // selected user, set the throughput to the max throughput. 
      let newSystemParams;
      if (state.networkType === 'relay') {
        newSystemParams = performancePanel.systemParams as RelayCharacteristics;
      } else if (state.networkType === 'dte' && state.selectedItems.length === 1) {
        newSystemParams = performancePanel.systemParams as GroundStationCharacteristics;
      } else {
        newSystemParams = performancePanel.systemParams as { [key: string]: GroundStationCharacteristics };
      }

      // Calculate the coverage this network provides this user.
      let coverage
      if(!state.noRegression){
        coverage = getCoverage(state, performancePanel);
      } else {
        coverage = 1
      }

      let { dataRate_kbps } = calculateDataRate(
        state.specifications.throughput,
        coverage,
        newSystemParams.modCodOptions,
        newSystemParams.multipleAccess,
        performancePanel.linkParams.ebNoTable,
        state.selectedItems[0].modulation,
        state.selectedItems[0].coding
      );

      let throughput_Gb_Day = dataRate_kbps * coverage / Math.pow(10, 6) * 86400;

      const newState = {
        ...state,
        results: {
          ...state.results,
          dataRate_kbps: dataRate_kbps,
          throughput_Gb_Day: throughput_Gb_Day
        }
      }

      updateLinkBudgets(performancePanel, newState, linkBudget).then(res => {
        onState('results', {
          ...state.results,
          dataRate_kbps: dataRate_kbps,
          eirp_dBW: res.eirp_dBW,
          ebNo_dB: res.ebNo_dB,
          throughput_Gb_Day: throughput_Gb_Day
        });
      });
    }
  };

  useEffect(() => {
    updateThroughput();
  }, [state.parameters, state.regressionTypes, state.selectedItems, performancePanel]);

  useEffect(() => {
    if (state.selectedItems.length === 1) {
      updateThroughput();
    }
  }, [state.specifications.throughput]);

  const updateLinkBudgets = async (data: PerformancePanel, state: State, linkBudget: { [key: string]: LinkBudgetRow[] }): Promise<{ eirp_dBW: number, ebNo_dB: number }> => {
    const linkBudgets = await setLinkBudgets(data, state, linkBudget);

    state.selectedItems.forEach(item => {
      const newLinkBudget = linkBudgets[item.id];
      dispatch(updateLinkBudget(item.id.toString(), newLinkBudget));
    });
    
    let maxEirp = NaN;
    let maxEirpId = '';
    Object.keys(linkBudgets).forEach(groundStationId => {
      const currentEirp = linkBudgets[groundStationId].find(parameter => parameter.key === 'userEirp_dBW')?.value;
      if (isNaN(maxEirp) || currentEirp > maxEirp) {
        maxEirpId = groundStationId;
        maxEirp = currentEirp;
      }
    });

    const eirp_dBW = linkBudgets[maxEirpId].find(parameter => parameter.key === 'userEirp_dBW')?.value;
    const ebNo_dB = linkBudgets[maxEirpId].find(parameter => parameter.key === 'requiredEbNo_dB')?.value;

    onState('results', {
      ...state.results,
      eirp_dBW: eirp_dBW,
      ebNo_dB: ebNo_dB
    });

    return {
      eirp_dBW,
      ebNo_dB
    };
  };

  return (
    <div className={visible ? classes.root : classes.hide}>
        <Grid item md={12}>
          <Grid
            container
            justify="flex-start"
            alignItems="flex-start"
            spacing={1}
          >
            <ResultGroup title="Performance">
              <PerformanceSection
                data={data}
                state={state}
                maxAltitude={bounds.altitude.max}
                onState={onState}
              />
            </ResultGroup>
            <ResultGroup title="User Burden: Antenna Options">
              <AntennaSection
                state={state}
                data={data}
                setLinkBudgets={updateLinkBudgets}
              />
            </ResultGroup>
            {state.networkType !== 'dte' && (
              <ResultGroup title="User Burden: Mission Impacts">
                <PointingSection
                  data={data}
                  state={state}
                  maxAltitude={bounds.altitude.max}
                  onState={onState}
                />
              </ResultGroup>
            )}
            <ResultGroup title="Nav and Tracking">
              <NavSection 
                state={state}
                data={data} 
              />
            </ResultGroup>
          </Grid>
        </Grid>
    </div>
  );
};

export default Performance;