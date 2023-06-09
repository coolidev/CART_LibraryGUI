/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC, useState, useEffect } from 'react';
import { Typography, Link, Box } from '@material-ui/core';
import { Accordion, AccordionSummary } from '../Accordion';
import { useSelector } from 'src/store';
import LinkBudget from 'src/components/Results/Performance/LinkBudget';
import UserBurdenCalculator from 'src/components/Results/Performance/UserBurdenCalculator';
//import AlgorithmExplanation from './algorithm-explanation';
import type {
  PerformancePanel,
  RelayCharacteristics,
  GroundStationCharacteristics
} from 'src/types/evaluation';
import type { LinkBudgetRow } from 'src/types/link-budget';
import type { State } from 'src/pages/home';
import useStyles from 'src/utils/styles';
import {
  computeParabolicDiameter,
  computeParabolicMass,
  computeSteerableSize,
  computeHelicalSize,
  computePatchSize,
  computeDipoleSize,
  AntennaInputs
} from 'src/algorithms/antennas';
import { ANTENNA_TYPES } from 'src/utils/constants/analysis';

interface AntennaProps {
    data: PerformancePanel;
    state: State;
    setLinkBudgets: (data: PerformancePanel, state: State, linkBudget: { [key: string]: LinkBudgetRow[] }) => Promise<{ eirp_dBW: number, ebNo_dB: number }>;
};

const USER_BURDEN_FUNCS = {
  parabolicDiameter: computeParabolicDiameter,
  parabolicMass: computeParabolicMass,
  steerableSize: computeSteerableSize,
  helicalHeight: computeHelicalSize,
  patchSize: computePatchSize,
  dipoleSize: computeDipoleSize
};

const AntennaSection: FC<AntennaProps> = ({ state, data, setLinkBudgets }) => {
  const [algorithmExplanation, setAlgorithmExplanation] = useState(false);
  const [calcOpen, setCalcOpen] = useState(false);
  const [isLinkBudgetOpen, setIsLinkBudgetOpen] = useState(false);
  const [antennaType, setAntennaType] = useState('');
  const [maxEirpId, setMaxEirpId] = useState('');
  const classes = useStyles();
  const { linkBudget } = useSelector((state) => state.results);

  useEffect(() => {
    let newMaxEirpId = '';
    let maxEirp = NaN;
    Object.keys(linkBudget).forEach((groundStationId) => {
      const currentEirp = linkBudget[groundStationId].find(
        (parameter) => parameter.key === 'userEirp_dBW'
      )?.value;
      if (isNaN(maxEirp) || currentEirp > maxEirp) {
        newMaxEirpId = groundStationId;
        maxEirp = currentEirp;
      }
    });

    setMaxEirpId(newMaxEirpId);
  }, [linkBudget]);

  function handleCalc(antenna?: string) {
    setAntennaType(antenna);
    setCalcOpen(!calcOpen);
  }

  const handleAlgo = () => {
    setAlgorithmExplanation(!algorithmExplanation);
  };

  const handleLinkBudget = () => {
    setIsLinkBudgetOpen(!isLinkBudgetOpen);
  };

  return (
    <Box my={2} mx={4}>
      <Accordion expanded={false}>
        <AccordionSummary id={`eirp-panel`}>
          <Typography style={{ width: '95%' }}>
            <Link
              id={`link-budget-link`}
              onClick={() => handleLinkBudget()}
              className={classes.analyzeResultLink}
            >
              EIRP (dBW):{' '}
              {state.isDataLoaded ? state.results.eirp_dBW.toFixed(2) : '-'}
            </Link>
          </Typography>
        </AccordionSummary>
      </Accordion>
      {
      // (state.selectedItems.length <= 1 || maxEirpId) &&
        Object.keys(ANTENNA_TYPES).map((param: string) => {
          let wavelength_m: number;
          if (!data) {
            wavelength_m = NaN;
          } else {
            if (state.selectedItems.length === 1) {
              wavelength_m = (
                data?.systemParams as
                  | RelayCharacteristics
                  | GroundStationCharacteristics
              )?.lambda;
            } else if (state.selectedItems.length > 1 && data.systemParams) {
              if (Object.keys(data.systemParams).includes(maxEirpId)) {
                wavelength_m = data?.systemParams[maxEirpId]['lambda'];
              }
            }
          }

          const antennaInputs: AntennaInputs = {
            wavelength: wavelength_m,
            eirp: state.results.eirp_dBW,
            powerAmplifier: state.constraints.powerAmplifier,
            antennaSize: null
          };
          let value = USER_BURDEN_FUNCS[param](antennaInputs);

          // Add a link to the parameters that have a deep dive
          // associated with them. Clicking on the link will open
          // the deep dive.
          const deepDiveParam =
            param === 'steerableSize' || param === 'patchSize';

          value =
            (deepDiveParam && state.isDataLoaded) ? (
              <Link
                id={`${param}_link`}
                onClick={() => handleCalc(param)}
                className={classes.analyzeResultLink}
              >
                {isNaN(value) ? '-' : value.toFixed(2)}
              </Link>
            ) : (
              isNaN(value) ? '-' : value.toFixed(2)
            );

          return (
            <Accordion key={`${param}-accordion`} expanded={false}>
              <AccordionSummary
                key={`${param}-accordion-summary`}
                id={`${param}-panel`}
              >
                <Typography key={`${param}-text`} style={{ width: '95%' }}>
                  {ANTENNA_TYPES[param]}: {value}
                </Typography>
              </AccordionSummary>
            </Accordion>
          );
        })
        }
      {isLinkBudgetOpen && (
        <LinkBudget
          isOpen={isLinkBudgetOpen}
          onClose={() => setIsLinkBudgetOpen(!isLinkBudgetOpen)}
          data={data}
          state={state}
          setLinkBudgets={setLinkBudgets}
        />
      )}
      {calcOpen && (
        <UserBurdenCalculator
          isOpen={calcOpen}
          onClose={handleCalc}
          title={ANTENNA_TYPES[antennaType]}
          state={state}
          systemParams={
            state.selectedItems.length > 1
              ? data?.systemParams[maxEirpId]
              : data?.systemParams
          }
          linkParams={data?.linkParams}
          antennaType={antennaType}
        />
      )}
      {/*algorithmExplanation && (
                <AlgorithmExplanation 
                    isOpen={algorithmExplanation}
                    onClose={handleAlgo}
                    title={'Data Rate vs. EIRP'}
                    bounds={props.bounds}
                    params={props.params}
                    systemParams={props.systemParams}
                    linkParams={props.linkParams}
                    onParamChange={props.onParamChange}
                />
            )*/}
    </Box>
  );
};

export default AntennaSection;

function dispatch(arg0: any) {
    throw new Error("Function not implemented.");
}
