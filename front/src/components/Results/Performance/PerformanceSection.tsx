import { FC, useState, useEffect } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box
} from '@material-ui/core';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary
} from '../Accordion';
import {
  DTE_PERFORMANCE_PARAMETERS,
  METRIC_LABELS,
  PERFORMANCE_PARAMETERS,
  PERFORMANCE_KEYS,
} from 'src/utils/constants/analysis';
import Regression from 'src/pages/regression';
import type {
  PerformancePanel,
  RelayCharacteristics,
  GroundStationCharacteristics
} from 'src/types/evaluation';
import type { State } from 'src/pages/home';
import TerrestrialPlot from 'src/pages/regression/Terrestrial';
import { interpolate } from 'src/algorithms/interpolation';
import { getDTEModelValue, getOrbitalModelValue, getValue } from 'src/algorithms/regressions';

interface PerformanceProps {
  data: PerformancePanel;
  state: State;
  maxAltitude: number;
  onState: (name: string, value) => void;
}

const PerformanceSection: FC<PerformanceProps> = ({
  state,
  data,
  maxAltitude,
  onState
}) => {
  const [accordion, setAccordion] = useState({});

  const handleAccordion = (event) => {
    const { id } = event.currentTarget;
    const value = event.currentTarget.getAttribute('aria-expanded') === 'false';
    setAccordion((prevState) => ({ ...prevState, [id]: value }));
  };

  useEffect(() => {
    if(!state.isDataLoaded){
      setAccordion({});
    }
  },[state.isDataLoaded]);
  useEffect(() => {
  },[data]);
  return (
    <Box my={2} mx={4}>
      {(state.parameters.isOrbital && state.networkType === 'relay') || state.selectedItems.length === 0
        ? PERFORMANCE_KEYS.map((key: string) => {
          var value = getOrbitalModelValue(
            state.parameters.altitude,
            state.parameters.inclination,
            key,
            data?.modelData,
            (data?.systemParams as RelayCharacteristics)?.systemName);
            
            if((isNaN(value) || (!state.pointSync && !state.parametric && !state.mathematical)) && !state.noRegression){
              value = getValue(
                state.parameters.altitude,
                state.parameters.inclination,
                key,
                state.regressionTypes[key],
                data?.predictedData,
                (data?.systemParams as RelayCharacteristics)?.systemName
              );
            }
            if (isNaN(value)) {
              if(PERFORMANCE_PARAMETERS.includes(key) && !state.isDataLoaded){
                return (
                  <Accordion key={key + 'placeholder'} expanded={false}>
                    <AccordionSummary id={`${key}-panel`}>
                      <Typography style={{ width: '95%' }}>
                        {`${METRIC_LABELS[key]}: -`}
                      </Typography>
                    </AccordionSummary>
                  </Accordion>
                );
            }else{ return null}
          }

          // If the regression quality is set to the lowest value, 
          // we want to show the underlying model data, but not 
          // the regression predictions.
          const showRegression = !state.noRegression && state.qualityIndicators[key] > 1;
          const displayedValue = showRegression || state.noRegression ? value.toFixed(2) : '-';

            // Find the entry in the selected items list that is
            // currently selected.
            const selectedItem = state.selectedItems.find(
              (item) => item.id === state.radioButtonSelectionId
            );
            if (!selectedItem) return null;

            // Update parameters using values in the cache object.
            const missionType = state.parameters.isOrbital
              ? 'orbital'
              : 'terrestrial';
            const version =
              state.networkType === 'relay'
                ? selectedItem.versions[missionType]
                : selectedItem.version;

            return (
              <Accordion key={key}>
                <AccordionSummary id={`${key}-panel`} onClick={handleAccordion}>
                  <Typography style={{ width: '95%' }}>
                    {`${METRIC_LABELS[key]}: ${displayedValue}`}
                  </Typography>
                  {!Object.keys(accordion).includes(`${key}-panel`) ||
                  !accordion[`${key}-panel`] ? (
                    <KeyboardArrowDownIcon fontSize="small" />
                  ) : (
                    <KeyboardArrowUpIcon fontSize="small" />
                  )}
                </AccordionSummary>
                <AccordionDetails>
                  <Regression
                    state={[state]}
                    data={[data]}
                    system={state.radioButtonSelectionId}
                    version={version}
                    networkType={state.networkType}
                    minAltitude={0}
                    maxAltitude={maxAltitude}
                    maxInclination={90}
                    values={[value]}
                    metricType={key}
                    chartDiv={key + 'plotly'}
                    isClickable={false}
                    showRegression={showRegression}
                    onState={onState}
                  />
                </AccordionDetails>
              </Accordion>
            );
          })
        : PERFORMANCE_KEYS.map((key: string) => {
            if (
              !data?.modelData ||
              !Object.keys(data?.modelData.terrestrial).includes(key)
            ) {
              if(PERFORMANCE_PARAMETERS.includes(key) && state.networkType === 'relay' && !state.isDataLoaded){
                return (
                  <Accordion key={key + 'placeholder'} expanded={false}>
                    <AccordionSummary id={`${key}-panel`}>
                      <Typography style={{ width: '95%' }}>
                        {`${METRIC_LABELS[key]}: -`}
                      </Typography>
                    </AccordionSummary>
                  </Accordion>
              );
              }else{ return null}
            }

            let interpolatedValue = interpolate(
              state.parameters.longitude,
              state.parameters.latitude,
              key,
              data?.modelData.terrestrial[key].table
            );
            if (interpolatedValue < 0) interpolatedValue = 0;

            return (
              <Accordion key={key}>
                <AccordionSummary id={`${key}-panel`} onClick={handleAccordion}>
                  <Typography style={{ width: '95%' }}>
                    {`${METRIC_LABELS[key]}: ${interpolatedValue.toFixed(2)}`}
                  </Typography>
                  {!Object.keys(accordion).includes(`${key}-panel`) ||
                  !accordion[`${key}-panel`] ? (
                    <KeyboardArrowDownIcon fontSize="small" />
                  ) : (
                    <KeyboardArrowUpIcon fontSize="small" />
                  )}
                </AccordionSummary>
                <AccordionDetails>
                  <TerrestrialPlot
                    system={state.radioButtonSelectionId}
                    type={key}
                    label={METRIC_LABELS[key]}
                    source={data?.modelData.terrestrial[key]}
                    isClickable={false}
                  />
                </AccordionDetails>
              </Accordion>
            );
          })}
      {state.networkType === 'dte'
        ? PERFORMANCE_KEYS.map((key: string) => {
          var value = getOrbitalModelValue(
            state.parameters.altitude,
            state.parameters.inclination,
            key,
            data?.modelData,
            (data?.systemParams as RelayCharacteristics)?.systemName);
            if((isNaN(value) || (!state.pointSync && !state.parametric && !state.mathematical)) && !state.noRegression){
              value = getValue(
                state.parameters.altitude,
                state.parameters.inclination,
                key,
                state.regressionTypes[key],
                data?.predictedData,
                state.selectedItems.length === 1
                  ? (data?.systemParams as GroundStationCharacteristics)
                      ?.systemName
                  : ''
              );
            }
            if (isNaN(value)) {
              if(DTE_PERFORMANCE_PARAMETERS.includes(key) && !state.isDataLoaded){
                return (
                  <Accordion key={key + 'placeholder'} expanded={false}>
                    <AccordionSummary id={`${key}-panel`}>
                      <Typography style={{ width: '95%' }}>
                        {`${METRIC_LABELS[key]}: -`}
                      </Typography>
                    </AccordionSummary>
                  </Accordion>
                );
              }else{
                return null;
              }
            }

            // If the regression quality is set to the lowest value, 
            // we want to show the underlying model data, but not 
            // the regression predictions. 
            const showRegression = !state.noRegression && state.qualityIndicators[key] > 1;
            const displayedValue = showRegression || state.noRegression ? value.toFixed(2) : '-';

            // Find the entry in the selected items list that is
            // currently selected.
            const selectedItem = state.selectedItems.find(
              (item) => item.id === state.radioButtonSelectionId
            );
            if (!selectedItem) return null;

            // Update parameters using values in the cache object.
            const missionType = state.parameters.isOrbital
              ? 'orbital'
              : 'terrestrial';
            const version =
              state.networkType === 'relay'
                ? selectedItem.versions[missionType]
                : selectedItem.version;

            return (
              <Accordion key={key}>
                <AccordionSummary id={`${key}-panel`} onClick={handleAccordion}>
                  <Typography style={{ width: '95%' }}>
                    {`${METRIC_LABELS[key]}: ${displayedValue}`}
                  </Typography>
                  {!Object.keys(accordion).includes(`${key}-panel`) ||
                  !accordion[`${key}-panel`] ? (
                    <KeyboardArrowDownIcon fontSize="small" />
                  ) : (
                    <KeyboardArrowUpIcon fontSize="small" />
                  )}
                </AccordionSummary>
                <AccordionDetails>
                  <Regression
                    state={[state]}
                    data={[data]}
                    system={state.radioButtonSelectionId}
                    version={version}
                    networkType={state.networkType}
                    minAltitude={300}
                    maxAltitude={maxAltitude}
                    maxInclination={120}
                    values={[value]}
                    metricType={key}
                    chartDiv={key + 'plotly'}
                    isClickable={false}
                    showRegression={showRegression}
                    onState={onState}
                  />
                </AccordionDetails>
              </Accordion>
            );
          })
        : null}
      {state.selectedItems.length === 1 && (
        <Accordion expanded={false}>
          <AccordionSummary id={`data-rate-panel`}>
            <Typography style={{ width: '95%' }}>
              Data Rate (kbps):{' '}
              {state.isDataLoaded
                ? state.results.dataRate_kbps.toFixed(2)
                : '-'}
            </Typography>
          </AccordionSummary>
        </Accordion>
      )}
      {state.selectedItems.length > 1 ? (
        <Accordion key={'throughput'}>
          <AccordionSummary id={`throughput-panel`} onClick={handleAccordion}>
            <Typography style={{ width: '95%' }}>
              Throughput (Gb/Day):{' '}
              {state.isDataLoaded
                ? state.results.maxThroughput_Gb_Day.toFixed(2)
                : '-'}
            </Typography>
            {state.isDataLoaded && (!Object.keys(accordion).includes(`throughput-panel`) ||
            !accordion[`throughput-panel`] ? (
              <KeyboardArrowDownIcon fontSize="small" />
            ) : (
              <KeyboardArrowUpIcon fontSize="small" />
            ))}
          </AccordionSummary>
          <AccordionDetails>
            <div>
              <TableContainer component={Paper} style={{ width: '20vw' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell
                        style={{
                          backgroundColor: 'lightgray',
                          color: 'black',
                          width: '6.6vw',
                          lineHeight: '14px'
                        }}
                        align="center"
                      >
                        Station
                      </TableCell>
                      <TableCell
                        style={{
                          backgroundColor: 'lightgray',
                          color: 'black',
                          width: '6.6vw',
                          lineHeight: '14px'
                        }}
                        align="center"
                      >
                        Coverage <br />
                        <small>(Min/Day)</small>
                      </TableCell>
                      <TableCell
                        style={{
                          backgroundColor: 'lightgray',
                          color: 'black',
                          width: '6.6vw',
                          lineHeight: '14px'
                        }}
                        align="center"
                      >
                        Throughput <br />
                        <small>(Gb/Day)</small>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {state.selectedItems.map((item) => {
                      if (!data) return null;
                      if (!Object.keys(data.systemParams).includes(item.id.toString())) return null;
                      
                      return (
                        <TableRow key={item.name}>
                          <TableCell
                            style={{ backgroundColor: 'whitesmoke' }}
                            align="center"
                          >
                            {item.name}
                          </TableCell>
                          <TableCell align="center">
                            {state.noRegression? 
                            getOrbitalModelValue(
                              state.parameters.altitude,
                              state.parameters.inclination,
                              `coveragePerStation-${item.id}`,
                              data?.modelData,
                              '').toFixed(2) 
                            :getValue(
                              state.parameters.altitude,
                              state.parameters.inclination,
                              `coveragePerStation-${item.id}`,
                              'gam',
                              data?.predictedData,
                              ''
                            ).toFixed(2)}
                          </TableCell>
                          <TableCell align="center">
                            {state.noRegression? 
                            ((((getOrbitalModelValue(
                              state.parameters.altitude,
                              state.parameters.inclination,
                              `coveragePerStation-${item.id}`,
                              data?.modelData,
                              '')/
                              1440) *
                              data?.systemParams[item.id].R_kbps) /
                              Math.pow(10, 6)) *
                               86400).toFixed(2) 
                              :(
                              (((getValue(
                                state.parameters.altitude,
                                state.parameters.inclination,
                                `coveragePerStation-${item.id}`,
                                'gam',
                                data?.predictedData,
                                ''
                              ) /
                                1440) *
                                data?.systemParams[item.id].R_kbps) /
                                Math.pow(10, 6)) *
                              86400
                            ).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </AccordionDetails>
        </Accordion>
      ) : (
        <Accordion key={'throughput'} expanded={false}>
          <AccordionSummary id={`throughput-panel`} onClick={handleAccordion}>
            <Typography style={{ width: '95%' }}>
              Throughput (Gb/Day):{' '}
              {state.isDataLoaded
                ? state.results.throughput_Gb_Day.toFixed(2)
                : '-'}
            </Typography>
          </AccordionSummary>
        </Accordion>
      )}
      <Accordion expanded={false}>
        <AccordionSummary id={`max-throughput-panel`}>
          <Typography style={{ width: '95%' }}>
            Max Throughput (Gb/Day):{' '}
            {state.isDataLoaded
              ? state.results.maxThroughput_Gb_Day.toFixed(2)
              : '-'}
          </Typography>
        </AccordionSummary>
      </Accordion>
    </Box>
  );
};

export default PerformanceSection;
