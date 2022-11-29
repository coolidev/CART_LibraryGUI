/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from 'react';
import {
  Box,
  Button,
  colors,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  makeStyles,
  MenuItem,
  Select,
  Typography,
  useTheme
} from '@material-ui/core';
import axios from 'src/utils/axios';
import { useDispatch, useSelector } from 'src/store';
import type { ICompare, metricImportance } from 'src/types/comparison';
import type { 
  PerformancePanel, 
  RelayCharacteristics,
  GroundStationCharacteristics
} from 'src/types/evaluation';
import { useWindowSize } from 'src/utils/util';
import PlotModal from 'src/pages/regression/PlotDialog';
import SubChartPanel from 'src/pages/regression/Terrestrial/Popup';
import {
  BODY_POINTING_THRESHOLD,
  MECHANICAL_POINTING_THRESHOLD,
} from 'src/utils/constants/physical';
import {
  PERFORMANCE_PARAMETERS,
  DTE_PERFORMANCE_PARAMETERS,
  ANTENNA_OPTIONS_PARAMETERS,
  MISSION_IMPACTS_PARAMETERS,
  NAV_AND_TRACKING_PARAMETERS,
  METRIC_LABELS,
  ANTENNA_TYPES,
  MISSION_IMPACTS_LABELS,
  NAV_AND_TRACKING_LABELS
} from 'src/utils/constants/analysis';
import {
  CompareChart,
  CompareDeepDive,
  CompareHeader,
  CompareTable
} from 'src/components/Results';
import {
  computeParabolicDiameter,
  computeParabolicMass,
  computeSteerableSize,
  computeHelicalSize,
  computePatchSize,
  computeDipoleSize,
  AntennaInputs
} from 'src/algorithms/antennas';
import {
  checkUserDefinedNetwork,
  saveUserDefinedNetwork
} from 'src/algorithms/combineStations';
import { setLinkBudgets } from 'src/algorithms/link-budget';
import { getGNSSAvailability } from 'src/algorithms/nav';
import { interpolate } from 'src/algorithms/interpolation';
import { getDTEModelValue, getOrbitalModelValue, getValue } from 'src/algorithms/regressions';
import type { State } from 'src/pages/home';
import { convertSaveToState } from 'src/pages/home';
import CloseIcon from '@material-ui/icons/Close';
import { performanceData } from 'src/pages/reports/modules/performanceData';
import { updateComparePanel } from 'src/slices/results';
import { initialRows, initialDteRows } from 'src/utils/constants/comparison';
import type { Theme } from 'src/theme';
import { THEMES } from 'src/utils/constants/general';
import { getCoverage, getMaxThroughput } from 'src/algorithms/coverage';
import { getOptimalModCod } from 'src/algorithms/link-optimization';
import type { LinkBudgetRow } from 'src/types/link-budget';

interface ComparisonProps {
  state: State;
  onState: (name: string, value: any) => void;
  visible: boolean;
}

export interface Status {
  page: number;
  amount: number;
  totalPage: number;
  isSize: boolean;
  width: string;
  active: boolean;
  disabled: boolean;
  deepOpen: boolean;
  diveOpen: boolean;
  chartOpen: boolean;
  isCompareLinePlotOpen: boolean;
  value: [];
  checked: any;
}

export interface IModal {
  deep: IDeep;
  dive: IDive;
  chart: any[];
  selectedParameter?: string;
  hideRegressions?: boolean;
}

interface IDeep {
  params: any;
  deepDive: string;
  resultId: string;
  parameter: string;
  system: string | number;
  version: number;
  model: string;
  regressionQuality?: number;
}

interface IDive {
  parameter: any;
  system: string | number;
}

const initialStatus: Status = {
  page: 1,
  amount: 3,
  totalPage: 1,
  isSize: true,
  width: '150px',
  active: false,
  disabled: false,
  deepOpen: false,
  diveOpen: false,
  chartOpen: false,
  isCompareLinePlotOpen: false,
  value: [],
  checked: null
};

const initialModal: IModal = {
  deep: null,
  chart: [],
  dive: { parameter: '', system: -1 }
};

const initialSource: ICompare = {
  dataIDs: [],
  rows: initialRows,
  columns: ['Parameters'],
  columnMapping: [''],
  columnData: [],
  tooltips: {},
  resultId: '',
  keyList: {},
  csvData: [],
  fileName: '',
  userBurden: {},
  surfaces: {},
  surfaceSlices: {},
  metricSelections: []
};

const initialDteSource: ICompare = {
  dataIDs: [],
  rows: initialDteRows,
  columns: ['Parameters'],
  columnMapping: [''],
  columnData: [],
  tooltips: {},
  resultId: '',
  keyList: {},
  csvData: [],
  fileName: '',
  userBurden: {},
  surfaces: {},
  surfaceSlices: {},
  metricSelections: []
};

const ANTENNA_FUNCTIONS = {
  parabolicDiameter: computeParabolicDiameter,
  parabolicMass: computeParabolicMass,
  steerableSize: computeSteerableSize,
  helicalHeight: computeHelicalSize,
  patchSize: computePatchSize,
  dipoleSize: computeDipoleSize
};

interface Dictionary {
  [key: string]: string;
}

interface ComparisonGroup {
  group: string;
  rows: string[][];
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    maxHeight: '93vh',
    overflowX: 'hidden',
    overflowY: 'auto',
    backgroundColor: theme.palette.component.main
  },
  hide: {
    display: 'none',
    maxHeight: '93vh',
    overflowX: 'hidden',
    overflowY: 'auto'
  },
  dialog: {
    maxWidth: '500px',
    minHeight: '55vh'
  },
  title: {
    margin: 0,
    padding: theme.spacing(4),
    backgroundColor: THEMES.DARK
      ? theme.palette.background.light
      : colors.grey[200]
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.background.dark
  },
  select: {
    verticalAlign: 'middle',
    backgroundColor: theme.palette.background.light,
    border: `1px solid ${theme.palette.border.main}`,
    color: `${theme.palette.text.primary} !important`,
    '& .MuiSelect-iconOutlined': {
      color: theme.palette.border.main
    }
  }
}));

interface RankWeight {
  name: string;
  score: number;
}

const rankOptions: RankWeight[] = [
  {
    name: 'Not Important',
    score: 1
  },
  {
    name: 'Some Importance',
    score: 2
  },
  {
    name: 'Average Importance',
    score: 3
  },
  {
    name: 'High Importance',
    score: 4
  },
  {
    name: 'Most Important',
    score: 5
  }
];

const initialRanks: { [key: string]: string } = {
  coverage: 'Average Importance',
  mean_contacts: 'Average Importance',
  mean_coverage_duration: 'Average Importance',
  average_gap: 'Average Importance',
  max_gap: 'Average Importance',
  mean_response_time: 'Average Importance',
  availability: 'Average Importance',
  dataRate: 'Average Importance',
  throughput: 'Average Importance',
  coverageMinutes: 'Average Importance',
  contactsPerDay: 'Average Importance',
  averageCoverageDuration: 'Average Importance',
  maxCoverageDuration: 'Average Importance',
  averageGapDuration: 'Average Importance',
  maxGapDuration: 'Average Importance',
  meanResponseTime: 'Average Importance'
};

// Group names
export const PARAMETERS_NAME = 'Parameters';
export const RANKING_NAME = 'Ranking';
export const PERFORMANCE_NAME = 'Performance';
export const ANTENNA_OPTIONS_NAME = 'User Burden: Antenna Options';
export const MISSION_IMPACTS_NAME = 'User Burden: Mission Impacts';
export const NAV_AND_TRACKING_NAME = 'Nav and Tracking';

const Comparison: FC<ComparisonProps> = ({ state, onState, visible }) => {
  const size = useWindowSize();
  const theme = useTheme<Theme>();
  const [status, setStatus] = useState(initialStatus);
  const [result, setResult] = useState<ICompare>(
    state.networkType === 'relay' ? initialSource : initialDteSource
  );
  const [source, setSource] = useState<ICompare>(
    state.networkType === 'relay' ? initialSource : initialDteSource
  );
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [modal, setModal] = useState<IModal>(initialModal);
  const [reset, setReset] = useState(false);
  const [viewMethod, setViewMethod] = useState('2d_view');
  const [checked, setChecked] = useState({
    show_surface: true,
    show_scatter: true
  });
  const [isEarth, setIsEarth] = useState(true);
  const classes = useStyles();
  const { preference } = useSelector((state) => state.preference);
  const { project } = useSelector((state) => state.project);
  const { performancePanel, linkBudget } = useSelector(
    (state) => state.results
  );
  const [dialogVisible, setDialogVisible] = useState<boolean>(false);
  const [performanceParams, setPerformanceParams] = useState<string[]>([]);
  const [rankMenu, setRankMenu] =
    useState<{ [key: string]: string }>(initialRanks);
  const [rankedWeights, updateRankedWeights] = useState<{
    [key: string]: number;
  }>({});
  const [rankState, setRankState] = useState<boolean>(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setResult(state.networkType === 'relay' ? initialSource : initialDteSource);
    setSource(state.networkType === 'relay' ? initialSource : initialDteSource);
  }, [state.networkType]);

  const handleDialog = () => {
    setDialogVisible(true);
  };

  const disableRanking = () => {
    setRankState(false);
    updateComparisonTable(false);
  };

  useEffect(() => {
    setViewMethod(state.parameters.isOrbital ? '2d_view' : 'interpolated');
  }, [state.parameters.isOrbital]);

  useEffect(() => {
    setPerformanceParams(
      state.networkType === 'relay'
        ? PERFORMANCE_PARAMETERS
        : DTE_PERFORMANCE_PARAMETERS
    );
    updateRankedWeights(
      Object.keys(rankMenu)
        .map((param) => {
          return {
            [param]: rankOptions.find(
              (option) => option.name === rankMenu[param]
            ).score
          };
        })
        .reduce((prevVal, newVal) => ({
          ...prevVal,
          [Object.keys(newVal)[0]]: newVal[Object.keys(newVal)[0]]
        }))
    );
  }, [rankMenu]);

  useEffect(() => {
    let tempMetrics: metricImportance[] = [];
    Object.keys(rankedWeights).forEach((weight) => {
      if (
        performanceParams.includes(weight) &&
        weight !== 'dataRate' &&
        weight !== 'throughput'
      ) {
        tempMetrics.push({
          metricName: METRIC_LABELS[weight],
          metricImportance: rankOptions.find(
            (option) => option.score === rankedWeights[weight]
          ).name
        });
      }
    });
    setResult((prevState) => ({
      ...prevState,
      metricSelections: tempMetrics
    }));
    setSource((prevState) => ({
      ...prevState,
      metricSelections: tempMetrics
    }));
  },[rankedWeights]);

  // Function that returns a sorted array of systems based on the input weights and
  // network metrics.
  const rankNetworks = (
    weights: { [key: string]: number },
    metrics: { [key: string]: { [key: string]: number } }[]
  ): [string, number][] => {
    const normalizedValues: { [key: string]: number } =
      state.networkType === 'relay'
        ? {
            average_gap: NaN,
            max_gap: NaN,
            mean_contacts: NaN,
            mean_coverage_duration: NaN,
            mean_response_time: NaN
          }
        : {
            coverageMinutes: NaN,
            contactsPerDay: NaN,
            averageCoverageDuration: NaN,
            maxCoverageDuration: NaN,
            averageGapDuration: NaN,
            maxGapDuration: NaN,
            meanResponseTime: NaN
          };

    // For each metric, iterate over the networks to find the maximum
    // value for that metric.
    metrics.forEach((rankingValues) => {
      const values = Object.values(rankingValues);

      Object.keys(normalizedValues).forEach((value) => {
        if (
          isNaN(normalizedValues[value]) ||
          values[0][value] > normalizedValues[value]
        ) {
          normalizedValues[value] = values[0][value];
        }
      });
    });

    // Iterate over each network and calculate each network's score.
    // The `scores` variable is an array of arrays. Each child array
    // should contain the network's name as the first element and the
    // the network's score as the second element.
    let scores: [string, number][] = [];
    metrics.forEach((rankingValues) => {
      let score = 0;
      const columnId = Object.keys(rankingValues)[0];
      const values = rankingValues[columnId];

      if (state.networkType === 'relay') {
        // Normalize coverage and availability values by dividing by 100.
        if (!isNaN(values.coverage)) {
          score += (values.coverage / 100) * weights.coverage;
        }
        if (!isNaN(values.availability)) {
          score += (values.availability / 100) * weights.availability;
        }

        // Gap metrics are 'bad': higher values are undesirable. We normalize
        // them by subtracting the gap time divided by the normalized value from
        // 1. This converts high gap times into low scores and low gap times into high scores.
        // But first check that some network has an average (max) gap greater than 0,
        // so that we don't divide by 0.
        if (normalizedValues.average_gap > 0 && !isNaN(values.average_gap)) {
          score +=
            (1 - values.average_gap / normalizedValues.average_gap) *
            weights.average_gap;
        }
        if (normalizedValues.max_gap > 0 && !isNaN(values.max_gap)) {
          score +=
            (1 - values.max_gap / normalizedValues.max_gap) * weights.max_gap;
        }
        if (
          normalizedValues.mean_response_time > 0 &&
          !isNaN(values.mean_response_time)
        ) {
          score +=
            (1 -
              values.mean_response_time / normalizedValues.mean_response_time) *
            weights.mean_response_time;
        }

        // Score the rest of the metrics by dividing by their normalized values.
        if (
          normalizedValues.mean_contacts > 0 &&
          !isNaN(values.mean_contacts)
        ) {
          score +=
            (values.mean_contacts / normalizedValues.mean_contacts) *
            weights.mean_contacts;
        }
        if (
          normalizedValues.mean_coverage_duration > 0 &&
          !isNaN(values.mean_coverage_duration)
        ) {
          score +=
            (values.mean_coverage_duration /
              normalizedValues.mean_coverage_duration) *
            weights.mean_coverage_duration;
        }
      } else {
        // Gap metrics are 'bad': higher values are undesirable. We normalize
        // them by subtracting the gap time divided by the normalized value from
        // 1. This converts high gap times into low scores and low gap times into high scores.
        // But first check that some network has an average (max) gap greater than 0,
        // so that we don't divide by 0.
        if (
          normalizedValues.averageGapDuration > 0 &&
          !isNaN(values.averageGapDuration)
        ) {
          score +=
            (1 -
              values.averageGapDuration / normalizedValues.averageGapDuration) *
            weights.averageGapDuration;
        }
        if (
          normalizedValues.maxGapDuration > 0 &&
          !isNaN(values.maxGapDuration)
        ) {
          score +=
            (1 - values.maxGapDuration / normalizedValues.maxGapDuration) *
            weights.maxGapDuration;
        }
        if (
          normalizedValues.meanResponseTime > 0 &&
          !isNaN(values.meanResponseTime)
        ) {
          score +=
            (1 - values.meanResponseTime / normalizedValues.meanResponseTime) *
            weights.meanResponseTime;
        }

        // Score the rest of the metrics by dividing by their normalized values.
        if (
          normalizedValues.coverageMinutes > 0 &&
          !isNaN(values.coverageMinutes)
        ) {
          score +=
            (values.coverageMinutes / normalizedValues.coverageMinutes) *
            weights.coverageMinutes;
        }
        if (
          normalizedValues.contactsPerDay > 0 &&
          !isNaN(values.contactsPerDay)
        ) {
          score +=
            (values.contactsPerDay / normalizedValues.contactsPerDay) *
            weights.contactsPerDay;
        }
        if (
          normalizedValues.averageCoverageDuration > 0 &&
          !isNaN(values.averageCoverageDuration)
        ) {
          score +=
            (values.averageCoverageDuration /
              normalizedValues.averageCoverageDuration) *
            weights.averageCoverageDuration;
        }
        if (
          normalizedValues.maxCoverageDuration > 0 &&
          !isNaN(values.maxCoverageDuration)
        ) {
          score +=
            (values.maxCoverageDuration /
              normalizedValues.maxCoverageDuration) *
            weights.maxCoverageDuration;
        }
      }

      scores.push([columnId, score]);
    });

    // After sorting, `scores` contains the networks in descending order
    // as determined by score.
    scores.sort((network1, network2): number => {
      return network2[1] - network1[1];
    });

    return scores;
  };

  const reorderTable = (
    allWeights: { [key: string]: number },
    rows,
    columns: string[],
    columnMapping,
    columnData,
    metrics: { [key: string]: { [key: string]: number } }[]
  ): { rows: any; columns: any; columnMapping: any; columnData: any } => {
    const weights =
      state.networkType === 'relay'
        ? {
            coverage: allWeights['coverage'],
            availability: allWeights['availability'],
            average_gap: allWeights['average_gap'],
            max_gap: allWeights['max_gap'],
            mean_contacts: allWeights['mean_contacts'],
            mean_coverage_duration: allWeights['mean_coverage_duration'],
            mean_response_time: allWeights['mean_response_time']
          }
        : {
            coverageMinutes: allWeights['coverageMinutes'],
            contactsPerDay: allWeights['contactsPerDay'],
            averageCoverageDuration: allWeights['averageCoverageDuration'],
            maxCoverageDuration: allWeights['maxCoverageDuration'],
            averageGapDuration: allWeights['averageGapDuration'],
            maxGapDuration: allWeights['maxGapDuration'],
            meanResponseTime: allWeights['meanResponseTime']
          };
    const scores = rankNetworks(weights, metrics);

    // Update the column headings of the Comparison table to display the
    // systems according to the ranking.
    let newColumns = columns.slice(0, 1);
    let newColumnMapping = [''];
    let newColumnData = [];
    scores.map((column: [string, number]) => {
      const index = columnMapping.findIndex((c) => c === column[0]);

      newColumns.push(columns[index]);
      newColumnMapping.push(columnMapping[index]);
      newColumnData.push(columnData[index - 1]);
    });

    // Update the cells in each row of the Comparison table to match
    // the updated order of the systems.
    rows = rows.map((group: any) => {
      return {
        group: group.group,
        rows: group.rows.map((groupRows: any) => {
          if (group.group === 'Ranking') {
            switch (groupRows[0]) {
              case 'Rank':
                let rankRows = [];
                let rank = 1;
                scores.map(() => {
                  rankRows.push(rank++);
                });
                rankRows.unshift(groupRows[0]);
                return rankRows;
              case 'Score':
                let scoreRows = [];
                scores.map((column: [string, number]) => {
                  scoreRows.push(column[1].toFixed(2));
                });
                scoreRows.unshift(groupRows[0]);
                return scoreRows;
              case 'Requirements Met':
                let reqRows = [];
                scores.map((column: [string, number]) => {
                  const index = columnMapping.findIndex((c) => c === column[0]);
                  try {
                    //Check if results meet specifications in mission panel
                    if (state.networkType === 'relay') {
                      if (
                        rows[2]?.rows[
                          rows[2]?.rows?.findIndex(
                            (x) => x[0] === METRIC_LABELS.availability
                          )
                        ][index] >=
                          state.specifications.availability.toFixed(2) &&
                        rows[2]?.rows[
                          rows[2]?.rows?.findIndex(
                            (x) => x[0] === METRIC_LABELS.throughput
                          )
                        ][index] >=
                          state.specifications.throughput.toFixed(2) &&
                        rows[2]?.rows[
                          rows[2]?.rows.findIndex(
                            (x) => x[0] === METRIC_LABELS.max_gap
                          )
                        ][index] <=
                          state.specifications.tolerableGap.toFixed(2) &&
                        rows[5]?.rows[
                          rows[5]?.rows.findIndex(
                            (x) =>
                              x[0] ===
                              NAV_AND_TRACKING_LABELS.trackingCapability
                          )
                        ][index] <=
                          state.specifications.trackingServiceRangeError.toFixed(
                            2
                          )
                      ) {
                        reqRows.push('Yes');
                      } else {
                        reqRows.push('No');
                      }
                    } else {
                      //DTE
                      const availability = parseInt(
                        rows[2]?.rows[
                          rows[2]?.rows?.findIndex(
                            (x) => x[0] === METRIC_LABELS.coverageMinutes
                          )
                        ][index]
                      );
                      if (
                        (availability > 0 ? (availability / 1440) * 100 : 0) >=
                          parseInt(
                            state.specifications.availability.toFixed(2)
                          ) &&
                        rows[2]?.rows[
                          rows[2]?.rows?.findIndex(
                            (x) => x[0] === METRIC_LABELS.throughput
                          )
                        ][index] >=
                          state.specifications.throughput.toFixed(2) &&
                        rows[2]?.rows[
                          rows[2]?.rows.findIndex(
                            (x) => x[0] === METRIC_LABELS.maxGapDuration
                          )
                        ][index] <=
                          state.specifications.tolerableGap.toFixed(2) &&
                        rows[4]?.rows[
                          rows[4]?.rows.findIndex(
                            (x) =>
                              x[0] ===
                              NAV_AND_TRACKING_LABELS.trackingCapability
                          )
                        ][index] <=
                          state.specifications.trackingServiceRangeError.toFixed(
                            2
                          )
                      ) {
                        reqRows.push('Yes');
                      } else {
                        reqRows.push('No');
                      }
                    }
                  } catch {
                    reqRows.push('No');
                  }
                });
                reqRows.unshift(groupRows[0]);
                return reqRows;
            }
          } else {
            let newRows = [];
            scores.map((column: [string, number]) => {
              // Since the systems have been shuffled, we have to
              // shuffle the data within each row accordingly.
              const index = columnMapping.findIndex((c) => c === column[0]);
              newRows.push(groupRows[index]);
            });
            newRows.unshift(groupRows[0]);
            return newRows;
          }
        })
      };
    });

    return {
      rows: rows,
      columns: newColumns,
      columnMapping: newColumnMapping,
      columnData: newColumnData
    };
  };

  const createComparisonGroup = (
    parameters: string[],
    labels: Dictionary,
    labelsToKeys: Dictionary,
    groupName: string
  ): ComparisonGroup => {
    const rowLabels = [];
    parameters.forEach((key) => {
      rowLabels.push(labels[key]);
      labelsToKeys[labels[key]] = key;
    });

    const group = {
      group: groupName,
      rows: rowLabels.map((label) => {
        return [label];
      })
    };

    return group;
  };

  const createComparisonTemplate = (): {
    rows: ComparisonGroup[];
    columns: string[];
    labelsToKeys: Dictionary;
  } => {
    const labelsToKeys: Dictionary = {};

    // Create Parameters group.
    const parametersKeys = state.parameters.isOrbital
      ? ['altitude', 'inclination']
      : ['latitude', 'longitude'];
    const parametersLabels = {
      altitude: 'Altitude (km)',
      inclination: 'Inclination (deg)',
      latitude: 'Latitude (deg)',
      longitude: 'Longitude (deg)'
    };

    const rankingKeys = ['rank', 'score', 'reqsMet'];
    const rankingLabels = {
      rank: 'Rank',
      score: 'Score',
      reqsMet: 'Requirements Met'
    };

    const ranking = createComparisonGroup(
      rankingKeys,
      rankingLabels,
      labelsToKeys,
      'Ranking'
    );

    const parameters = createComparisonGroup(
      parametersKeys,
      parametersLabels,
      labelsToKeys,
      'Parameters'
    );

    // Create Performance group.
    const performanceKeys =
      state.networkType === 'relay'
        ? PERFORMANCE_PARAMETERS
        : DTE_PERFORMANCE_PARAMETERS;
    const performance = createComparisonGroup(
      performanceKeys,
      METRIC_LABELS,
      labelsToKeys,
      'Performance'
    );

    // Create Antenna Options group.
    const antennaParameters = { ...ANTENNA_TYPES, eirp_dbw: 'User EIRP (dBW)' };
    const antennaOptions = createComparisonGroup(
      ANTENNA_OPTIONS_PARAMETERS,
      antennaParameters,
      labelsToKeys,
      'User Burden: Antenna Options'
    );

    // Create Mission Impacts group.
    // Skip this section for DTEs.
    const missionImpacts = createComparisonGroup(
      MISSION_IMPACTS_PARAMETERS,
      MISSION_IMPACTS_LABELS,
      labelsToKeys,
      'User Burden: Mission Impacts'
    );

    // Create Nav and Tracking group.
    const navAndTracking = createComparisonGroup(
      NAV_AND_TRACKING_PARAMETERS,
      NAV_AND_TRACKING_LABELS,
      labelsToKeys,
      'Nav and Tracking'
    );

    const rows =
      state.networkType === 'relay'
        ? [
            ranking,
            parameters,
            performance,
            antennaOptions,
            missionImpacts,
            navAndTracking
          ]
        : [ranking, parameters, performance, antennaOptions, navAndTracking];

    return {
      rows,
      columns: ['Parameters'],
      labelsToKeys
    };
  };

  const addParameters = (
    state: any,
    template: string[][],
    labelsToKeys: Dictionary
  ): Dictionary => {
    const values: Dictionary = {};
    template.forEach((row: any[]) => {
      const key = labelsToKeys[row[0]];

      values[row[0]] = state.parameters[key];
    });

    return values;
  };

  const performanceCalculations = (
    state: any,
    data: PerformancePanel,
    template: string[][],
    labelsToKeys: Dictionary,
    rankingValues: { [key: string]: number }
  ): Dictionary => {
    const { modelData } = data;

    const values: Dictionary = {};
    template.forEach((row: any[]) => {
      const key = labelsToKeys[row[0]];
      let value: string;

      switch (key) {
        case 'dataRate':
          if (state.selectedItems.length > 1) {
            value = '';
          } else {
            value = state.results.dataRate_kbps.toFixed(2);
          }
          break;
        case 'throughput':
          value = state.specifications.throughput.toFixed(2);
          break;
        default:
          if (state.parameters.isOrbital) {
            var predictedValue = getOrbitalModelValue(
              state.parameters.altitude,
              state.parameters.inclination,
              key,
              data?.modelData,
              (data?.systemParams as RelayCharacteristics)?.systemName);
              if((isNaN(predictedValue) || !state.pointSync) && !state.noRegression){
                predictedValue = getValue(
                  state.parameters.altitude,
                  state.parameters.inclination,
                  key,
                  state.regressionTypes[key],
                  data.predictedData,
                  state.selectedItems.length === 1
                    ? (
                        data.systemParams as
                          | RelayCharacteristics
                          | GroundStationCharacteristics
                      ).systemName
                    : ''
                );
              }
            value = !isNaN(predictedValue) ? predictedValue.toFixed(2) : '-';
          } else {
            if (Object.keys(modelData.terrestrial).includes(key)) {
              let interpolatedValue = interpolate(
                state.parameters.longitude,
                state.parameters.latitude,
                key,
                modelData.terrestrial[key].table
              );

              if (interpolatedValue < 0) interpolatedValue = 0;
              if (
                Object.keys(['coverage', 'availability']).includes(key) &&
                interpolatedValue > 100
              )
                interpolatedValue = 100;

              value = interpolatedValue.toFixed();
            } else {
              value = '-';
            }
          }
      }

      values[row[0]] = value;

      if (Object.keys(rankingValues).includes(key)) {
        rankingValues[key] = parseFloat(value);
      }
    });

    return values;
  };

  const antennaGroupCalculations = async (
    data: PerformancePanel,
    template: string[][],
    labelsToKeys: Dictionary,
    configurationState: State
  ): Promise<{
    antennaRows: Dictionary;
    ebNo_dB: number;
    eirp_dBW: number;
    linkBudget: any;
  }> => {
    let { systemParams } = data;

    const newSelectedItems = configurationState.selectedItems.map((item) => {
      const { modCodOptions, multipleAccess, bandwidthMHz, R_kbps } =
        configurationState.selectedItems.length > 1
          ? data.systemParams[item.id]
          : data.systemParams;



      
        // Calculate coverage for this user. 
      const coverage = getCoverage(state, data);

        // Use the coverage and the max data rate to determine the max
        // data volume for this user.
      const { maxThroughput_Gb_Day } = getMaxThroughput(
        configurationState,
        data
      );

      let throughput = Math.min(
        configurationState.specifications.throughput,
        maxThroughput_Gb_Day
      );
      if (configurationState.selectedItems.length > 1) {
        const stationCoverage = getCoverage(
          configurationState,
          data,
          item.id.toString()
        );
        throughput = ((R_kbps * stationCoverage) / Math.pow(10, 6)) * 86400;
      }

      const modCodOption = getOptimalModCod(
        modCodOptions,
        multipleAccess,
        throughput,
        coverage,
        bandwidthMHz,
        data.linkParams.modCodTable,
        data.linkParams.ebNoTable
      );

      return {
        ...item,
        modulationId: modCodOption.modulationId,
        codingId: modCodOption.codingId,
        modulation: modCodOption.modulation,
        coding: modCodOption.coding
      };
    });

    configurationState = {
      ...configurationState,
      selectedItems: newSelectedItems
    };

    let linkBudgetType: string;
    if (configurationState.networkType === 'relay') {
      const isBentPipe = (data.systemParams as RelayCharacteristics).isBentPipe;
      linkBudgetType = isBentPipe ? 'relay-bent-pipe' : 'relay-regenerative';
    } else {
      linkBudgetType = 'dte';
    }

    let allLinkBudgets = {};
    await Promise.all(configurationState.selectedItems.map(async item => {
      const axiosParams = {
        type: linkBudgetType,
        email: localStorage.getItem('email'),
        networkId: state.networkType === 'relay' ? item.id : 0,
        antennaId: state.networkType === 'dte' ? item.antennaId : 0
      };
      const linkBudgetResponse = await axios.get<{ linkBudget: LinkBudgetRow[] }>('/get-link-budget', { params: axiosParams });

      allLinkBudgets[item.id] = linkBudgetResponse.data.linkBudget;
    }));

    const linkBudgets = await setLinkBudgets(data, configurationState, allLinkBudgets);

    let eirp_dBW = NaN;
    let ebNo_dB = NaN;
    let wavelength_m = NaN;
    const values: Dictionary = {};
    template.forEach((row: any[]) => {
      const key = labelsToKeys[row[0]];

      let value = NaN;
      switch (key) {
        case 'eirp_dbw':
          let eirp: number;
          let ebNo: number;
          if (configurationState.networkType === 'dte') {
            let maxEirp = NaN;
            let maxEirpId = '';
            Object.keys(linkBudgets).forEach((groundStationId) => {
              const currentEirp = linkBudgets[groundStationId].find(
                (parameter) => parameter.key === 'userEirp_dBW'
              )?.value;
              if (isNaN(maxEirp) || currentEirp > maxEirp) {
                maxEirpId = groundStationId;
                maxEirp = currentEirp;
              }
            });

            eirp = linkBudgets[maxEirpId].find(
              (parameter) => parameter.key === 'userEirp_dBW'
            )?.value;
            ebNo = linkBudgets[maxEirpId].find(
              (parameter) => parameter.key === 'requiredEbNo_dB'
            )?.value;

            if (configurationState.selectedItems.length === 1) {
              wavelength_m = (
                systemParams as
                  | RelayCharacteristics
                  | GroundStationCharacteristics
              ).lambda;
            } else if (configurationState.selectedItems.length > 1) {
              let maxEirpId: string;
              Object.keys(linkBudgets).forEach((groundStationId) => {
                const linkBudget = linkBudgets[groundStationId];
                const userEirp_dBW = linkBudget.find(
                  (parameter) => parameter.key === 'userEirp_dBW'
                )?.value;
                if (userEirp_dBW === eirp) maxEirpId = groundStationId;
              });
              wavelength_m = maxEirpId === undefined ? NaN : systemParams[maxEirpId]['lambda'];
            }
          } else {
            const linkBudget = linkBudgets[Object.keys(linkBudgets)[0]];

            eirp = linkBudget.find(
              (parameter) => parameter.key === 'userEirp_dBW'
            )?.value;
            ebNo = linkBudget.find(
              (parameter) => parameter.key === 'requiredEbNo_dB'
            )?.value;
            wavelength_m = (systemParams as RelayCharacteristics).lambda;
          }

          eirp_dBW = eirp;
          ebNo_dB = ebNo;
          value = eirp;

          break;
        default:
          const antennaInputs: AntennaInputs = {
            wavelength: wavelength_m,
            eirp: eirp_dBW,
            powerAmplifier: state.constraints.powerAmplifier
          };
          if (key) {
            value = ANTENNA_FUNCTIONS[key](antennaInputs);
          }
      }

      if (value === undefined) value = NaN;
      values[row[0]] = value.toFixed(2);
    });

    return {
      antennaRows: values,
      ebNo_dB: ebNo_dB,
      eirp_dBW: eirp_dBW,
      linkBudget: linkBudgets
    };
  };

  const missionImpactsCalculations = (
    data: PerformancePanel,
    template: string[][],
    labelsToKeys: Dictionary
  ): Dictionary => {
    const { modelData } = data;

    const values: Dictionary = {};
    template.forEach((row: any[]) => {
      const key = labelsToKeys[row[0]];
      let value: string;

      if (state.parameters.isOrbital) {
        var trackingRate = getOrbitalModelValue(
          state.parameters.altitude,
          state.parameters.inclination,
          'tracking_rate',
          data?.modelData,
          (data?.systemParams as RelayCharacteristics)?.systemName);
          if((isNaN(trackingRate) || !state.pointSync) && !state.noRegression){
            trackingRate = getValue(
              state.parameters.altitude,
              state.parameters.inclination,
              'tracking_rate',
              state.regressionTypes['tracking_rate'],
              data.predictedData,
              Object.keys(data.systemParams).includes('systemName')
                ? (
                    data.systemParams as
                      | RelayCharacteristics
                      | GroundStationCharacteristics
                  ).systemName
                : ''
            );
          }

        if (state.networkType === 'dte') {
          value = '-';
        } else if (
          ['tracking_rate', 'slew_rate', 'reduced_coverage'].includes(key)
        ) {
          var predictedValue = getOrbitalModelValue(
            state.parameters.altitude,
            state.parameters.inclination,
            key,
            data?.modelData,
            (data?.systemParams as RelayCharacteristics)?.systemName);
            if((isNaN(predictedValue) || !state.pointSync) && !state.noRegression){
              predictedValue = getValue(
                state.parameters.altitude,
                state.parameters.inclination,
                key,
                state.regressionTypes[key],
                data.predictedData,
                (data.systemParams as RelayCharacteristics).systemName
              );
            }
          value = !isNaN(predictedValue) ? predictedValue.toFixed(2) : '-';
        } else {
          switch (key) {
            case 'bodyPointingFeasibility':
              value =
                trackingRate < BODY_POINTING_THRESHOLD
                  ? 'Feasible'
                  : 'Not feasible';
              break;
            case 'mechanicalPointingFeasibility':
              value =
                trackingRate < MECHANICAL_POINTING_THRESHOLD
                  ? 'Feasible'
                  : 'Not feasible';
              break;
            default:
              value = '';
          }
        }
      } else {
        let trackingRate = NaN;
        if (Object.keys(modelData.terrestrial).includes('tracking_rate')) {
          trackingRate = interpolate(
            state.parameters.longitude,
            state.parameters.latitude,
            'tracking_rate',
            modelData.terrestrial['tracking_rate'].table
          );
        }

        switch (key) {
          case 'bodyPointingFeasibility':
            if (!Object.keys(modelData.terrestrial).includes('tracking_rate')) {
              value = '-';
              break;
            }

            value =
              trackingRate < BODY_POINTING_THRESHOLD
                ? 'Feasible'
                : 'Not feasible';
            break;
          case 'mechanicalPointingFeasibility':
            if (!Object.keys(modelData.terrestrial).includes('tracking_rate')) {
              value = '-';
              break;
            }

            value =
              trackingRate < MECHANICAL_POINTING_THRESHOLD
                ? 'Feasible'
                : 'Not feasible';
            break;
          default:
            if (Object.keys(modelData.terrestrial).includes(key)) {
              let interpolatedValue = interpolate(
                state.parameters.longitude,
                state.parameters.latitude,
                key,
                modelData.terrestrial[key].table
              );

              if (interpolatedValue < 0) interpolatedValue = 0;

              value = interpolatedValue.toFixed();
            } else {
              value = '-';
            }
        }
      }

      values[row[0]] = value;
    });

    return values;
  };

  const navAndTrackingCalculations = (
    data: PerformancePanel,
    template: string[][],
    labelsToKeys: Dictionary
  ): Dictionary => {
    const { systemParams } = data;

    const values: Dictionary = {};
    template.forEach((row: any[]) => {
      const key = labelsToKeys[row[0]];

      let value: string;
      switch (key) {
        case 'trackingCapability':
          value = Object.keys(systemParams).includes('trackingAccuracy')
            ? (systemParams as RelayCharacteristics).trackingAccuracy.toString()
            : 'N/A';
          break;
        case 'gnssUsage':
          value = getGNSSAvailability(state.parameters.altitude);
          break;
        default:
          value = '';
      }

      values[row[0]] = value;
    });

    return values;
  };

  const addSystemToTable = async (
    rows: ComparisonGroup[],
    labelsToKeys: Dictionary,
    state: any,
    data: PerformancePanel,
    configurationsData: { [key: string]: Dictionary | string }[],
    ranking: { [key: string]: { [key: string]: number } }[]
  ): Promise<any> => {
    let rankingValues: { [key: string]: number };
    if (state.networkType === 'relay') {
      rankingValues = {
        coverage: 0,
        availability: 0,
        average_gap: 0,
        max_gap: 0,
        mean_contacts: 0,
        mean_coverage_duration: 0,
        mean_response_time: 0
      };
    } else {
      rankingValues = {
        coverageMinutes: 0,
        averageGapDuration: 0,
        maxGapDuration: 0,
        contactsPerDay: 0,
        averageCoverageDuration: 0,
        meanResponseTime: 0
      };
    }

    //
    const parametersTemplate = rows.find((row) => row.group === 'Parameters');
    const parametersRows = addParameters(
      state,
      parametersTemplate.rows,
      labelsToKeys
    );

    //
    const performanceTemplate = rows.find((row) => row.group === 'Performance');
    const performanceRows = performanceCalculations(
      state,
      data,
      performanceTemplate.rows,
      labelsToKeys,
      rankingValues
    );

    //
    const antennaTemplate = rows.find(
      (row) => row.group === 'User Burden: Antenna Options'
    );
    const { antennaRows, ebNo_dB, eirp_dBW, linkBudget } =
      await antennaGroupCalculations(
        data,
        antennaTemplate.rows,
        labelsToKeys,
        state
      );

    //
    let missionImpactsRows: Dictionary;
    if (state.networkType === 'relay') {
      const missionImpactsTemplate = rows.find(
        (row) => row.group === 'User Burden: Mission Impacts'
      );
      missionImpactsRows = missionImpactsCalculations(
        data,
        missionImpactsTemplate.rows,
        labelsToKeys
      );
    } else {
      missionImpactsRows = null;
    }

    //
    const navAndTrackingTemplate = rows.find(
      (row) => row.group === 'Nav and Tracking'
    );
    const navAndTrackingRows = navAndTrackingCalculations(
      data,
      navAndTrackingTemplate.rows,
      labelsToKeys
    );

    configurationsData.push({
      Parameters: parametersRows,
      Performance: performanceRows,
      'User Burden: Antenna Options': antennaRows,
      'User Burden: Mission Impacts': missionImpactsRows,
      'Nav and Tracking': navAndTrackingRows,
      name: state.name ?? data.systemParams.systemName,
      saveId: state.saveId
    });

    ranking.push({
      [state.saveId ?? 'current-config']: rankingValues
    });

    return {
      ebNo_dB: ebNo_dB,
      eirp_dBW: eirp_dBW,
      linkBudget: linkBudget
    };
  };

  const getUserDefinedNetworkStatus = async (state: State): Promise<number> => {
    const data = {
      selectedNetworks: state.selectedItems,
      frequencyBandId: state.selectedItems[0].frequencyBandId,
      userAltitude_km: state.parameters.altitude,
      userInclination_deg: state.parameters.inclination,
      networkId: null
    };

    return await checkUserDefinedNetwork(data);
  };

  const CreateComparisonTable = async (
    configurations: State[]
  ): Promise<{
    rows: ComparisonGroup[];
    columns: string[];
    columnMapping: string[];
    labelsToKeys: Dictionary;
    columnData: any;
  }> => {
    setRankState(false);
    // Create template
    const { rows, columns, labelsToKeys } = createComparisonTemplate();

    const configurationsData: { [key: string]: Dictionary | string }[] = [];
    const ranking: { [key: string]: { [key: string]: number } }[] = [];

    // Add the currently selected network first, so it will appear as the first
    // column in the table.
    const { ebNo_dB, eirp_dBW, linkBudget } = await addSystemToTable(
      rows,
      labelsToKeys,
      state,
      performancePanel,
      configurationsData,
      ranking
    );
    const columnData = [
      {
        state: state,
        data: performancePanel,
        calculatedData: {
          ebNo_dB,
          eirp_dBW,
          linkBudget
        }
      }
    ];

    await Promise.all(
      configurations.map(async (configuration) => {
        if (configuration.selectedItems.length > 1) {
          // Handle a ground station combination.
          const status = await getUserDefinedNetworkStatus(configuration);

          if (status > 0) {
            configuration = {
              ...configuration,
              userDefinedNetworkId: status
            };
          } else {
            // Throw error?
          }
        }

        // Get Performance Panel data for the configuration.

         const response = await axios.post('/requestSystemEval', {
            configuration: configuration
          });
        
        
        const data: PerformancePanel = response.data;

        // Construct state variable for the configuration.
        const configurationState = {
          parameters: configuration.parameters,
          specifications: configuration.specifications,
          constraints: configuration.constraints,
          results: configuration.results,
          regressionTypes: configuration.regressionTypes,
          selectedItems: configuration.selectedItems,
          saveId: configuration.save,
          name: configuration.name,
          networkType: configuration.networkType
        };
        const { ebNo_dB, eirp_dBW, linkBudget } = await addSystemToTable(
          rows,
          labelsToKeys,
          configurationState,
          data,
          configurationsData,
          ranking
        );

        columnData.push({
          state: configuration,
          data: data,
          calculatedData: {
            ebNo_dB,
            eirp_dBW,
            linkBudget
          }
        });
      })
    );

    const columnMapping = [''];

    configurationsData.forEach((configuration) => {
      const parametersRows = rows.find((row) => row.group === PARAMETERS_NAME);
      parametersRows.rows.forEach((row) => {
        row.push(configuration[PARAMETERS_NAME][row[0]]);
      });

      const rankingRows = rows.find((row) => row.group === RANKING_NAME);
      rankingRows.rows.forEach((row) => {
        row.push('');
      });

      const performanceRows = rows.find(
        (row) => row.group === PERFORMANCE_NAME
      );
      performanceRows.rows.forEach((row) => {
        row.push(configuration[PERFORMANCE_NAME][row[0]]);
      });

      const antennaOptionsRows = rows.find(
        (row) => row.group === ANTENNA_OPTIONS_NAME
      );
      antennaOptionsRows.rows.forEach((row) => {
        row.push(configuration[ANTENNA_OPTIONS_NAME][row[0]]);
      });

      if (configuration[MISSION_IMPACTS_NAME] !== null) {
        const missionImpactsRows = rows.find(
          (row) => row.group === MISSION_IMPACTS_NAME
        );
        missionImpactsRows.rows.forEach((row) => {
          row.push(configuration[MISSION_IMPACTS_NAME][row[0]]);
        });
      }

      const navAndTrackingRows = rows.find(
        (row) => row.group === NAV_AND_TRACKING_NAME
      );
      navAndTrackingRows.rows.forEach((row) => {
        row.push(configuration[NAV_AND_TRACKING_NAME][row[0]]);
      });

      columns.push(configuration.name as string);
      columnMapping.push((configuration.saveId as string) ?? 'current-config');
    });

    return {
      rows: rows,
      columns: columns,
      columnMapping: columnMapping,
      labelsToKeys,
      columnData: columnData
    };
  };

  const updateComparisonTable = async (rank: boolean) => {
    const parametersGroup = source.rows.find(
      (group) => group.group === 'Parameters'
    );
    const performanceGroup = source.rows.find(
      (group) => group.group === 'Performance'
    );
    const antennaGroup = source.rows.find(
      (group) => group.group === 'User Burden: Antenna Options'
    );
    const missionImpactsGroup = source.rows.find(
      (group) => group.group === 'User Burden: Mission Impacts'
    );
    const navAndTrackingGroup = source.rows.find(
      (group) => group.group === 'Nav and Tracking'
    );
    if (
      !parametersGroup ||
      !performanceGroup ||
      !antennaGroup ||
      (!missionImpactsGroup && state.networkType === 'relay') ||
      !navAndTrackingGroup ||
      !performancePanel
    )
      return;

    const ranking: { [key: string]: { [key: string]: number } }[] = [];
    let rankingValues: { [key: string]: number };
    if (state.networkType === 'relay') {
      rankingValues = {
        coverage: 0,
        availability: 0,
        average_gap: 0,
        max_gap: 0,
        mean_contacts: 0,
        mean_coverage_duration: 0,
        mean_response_time: 0
      };
    } else {
      rankingValues = {
        coverageMinutes: 0,
        averageGapDuration: 0,
        maxGapDuration: 0,
        contactsPerDay: 0,
        averageCoverageDuration: 0,
        meanResponseTime: 0
      };
    }

    const parametersTemplate = [];
    parametersGroup.rows.forEach((row) => {
      parametersTemplate.push([row[0]]);
    });

    const parametersRows = addParameters(
      state,
      parametersTemplate,
      source.keyList
    );

    const performanceTemplate = [];
    performanceGroup.rows.forEach((row) => {
      performanceTemplate.push([row[0]]);
    });

    const performanceRows = performanceCalculations(
      state,
      performancePanel,
      performanceTemplate,
      source.keyList,
      rankingValues
    );
    ranking.push({ 'current-config': rankingValues });

    const antennaTemplate = [];
    antennaGroup.rows.forEach((row) => {
      antennaTemplate.push([row[0]]);
    });

    const { antennaRows } = await antennaGroupCalculations(
      performancePanel,
      antennaTemplate,
      source.keyList,
      state
    );

    let missionImpactsRows: Dictionary;
    if (state.networkType === 'relay') {
      const missionImpactsTemplate = [];
      missionImpactsGroup.rows.forEach((row) => {
        missionImpactsTemplate.push([row[0]]);
      });

      missionImpactsRows = missionImpactsCalculations(
        performancePanel,
        missionImpactsTemplate,
        source.keyList
      );
    }

    const navAndTrackingTemplate = [];
    navAndTrackingGroup.rows.forEach((row) => {
      navAndTrackingTemplate.push([row[0]]);
    });

    const navAndTrackingRows = navAndTrackingCalculations(
      performancePanel,
      navAndTrackingTemplate,
      source.keyList
    );

    // Find the column that the current configuration occupies.
    const currentConfigIndex = result.columnMapping.findIndex(
      (c) => c === 'current-config'
    );

    const rankingColumns = result.columnMapping.filter(
      (c) => c !== 'current-config' && c
    );
    const tmpRankingValues: { [key: string]: { [key: string]: number } } = {};
    rankingColumns.forEach((column) => {
      if (state.networkType === 'relay') {
        tmpRankingValues[column] = {
          coverage: 0,
          availability: 0,
          average_gap: 0,
          max_gap: 0,
          mean_contacts: 0,
          mean_coverage_duration: 0,
          mean_response_time: 0
        };
      } else {
        tmpRankingValues[column] = {
          coverageMinutes: 0,
          averageGapDuration: 0,
          maxGapDuration: 0,
          contactsPerDay: 0,
          averageCoverageDuration: 0,
          meanResponseTime: 0
        };
      }
    });

    // Update the values for the current configuration.
    const newRows = source.rows.map((group) => {
      let rows: Dictionary;
      switch (group.group) {
        case PARAMETERS_NAME:
          rows = parametersRows;
          break;
        case PERFORMANCE_NAME:
          rows = performanceRows;
          break;
        case ANTENNA_OPTIONS_NAME:
          rows = antennaRows;
          break;
        case MISSION_IMPACTS_NAME:
          rows = missionImpactsRows;
          break;
        case NAV_AND_TRACKING_NAME:
          rows = navAndTrackingRows;
          break;
        default:
          rows = {};
      }

      return {
        group: group.group,
        rows: group.rows.map((row) => {
          const rowKey = result.keyList[row[0]];

          return row.map((element, idx) => {
            if (idx === currentConfigIndex) return rows[row[0]];
            else {
              const columnId = result.columnMapping[idx];
              if (
                idx > 0 &&
                Object.keys(tmpRankingValues[columnId]).includes(rowKey)
              ) {
                tmpRankingValues[columnId][rowKey] = parseFloat(
                  element.toString()
                );
              }

              return element;
            }
          });
        })
      };
    });

    Object.keys(tmpRankingValues).forEach((column) => {
      ranking.push({ [column]: tmpRankingValues[column] });
    });

    const currentConfigData = {
      state: state,
      data: performancePanel,
      calculatedData: {
        ebNo_dB: state.results.ebNo_dB,
        eirp_dBW: state.results.eirp_dBW,
        linkBudget: linkBudget
      }
    };
    const newColumnData = [...source.columnData];
    newColumnData.splice(0, 1, currentConfigData);

    if (rank) {
      const shuffledTable = reorderTable(
        rankedWeights,
        newRows,
        result.columns,
        result.columnMapping,
        newColumnData,
        ranking
      );

      setResult((prevState) => ({
        ...prevState,
        rows: shuffledTable.rows,
        columns: shuffledTable.columns,
        columnMapping: shuffledTable.columnMapping,
        columnData: shuffledTable.columnData
      }));
      setSource((prevState) => ({
        ...prevState,
        rows: shuffledTable.rows,
        columns: shuffledTable.columns,
        columnMapping: shuffledTable.columnMapping,
        columnData: shuffledTable.columnData
      }));
    } else {
      setResult((prevState) => ({
        ...prevState,
        rows: newRows,
        columns: result.columns,
        columnMapping: result.columnMapping,
        columnData: newColumnData
      }));
      setSource((prevState) => ({
        ...prevState,
        rows: newRows,
        columns: result.columns,
        columnMapping: result.columnMapping,
        columnData: newColumnData
      }));
    }
  };

  useEffect(() => {
    // Whenever the user changes, update the column in the
    // comparison table that corresponds to the currently
    // selected network.
    updateComparisonTable(rankState);
  }, [
    state.parameters,
    state.specifications.throughput,
    state.results,
    state.regressionTypes
  ]);

  useEffect(() => {
    if (state.selectedItems.length === 1) {
      updateComparisonTable(rankState);
    }
  }, [state.specifications.throughput]);

  const fetchResults = async (): Promise<void> => {
    setStatus((prevState) => ({ ...prevState, active: true }));
    const data = preference.project.find((item) => item.id === project);
    setPerformanceParams(
      state.networkType === 'relay'
        ? PERFORMANCE_PARAMETERS
        : DTE_PERFORMANCE_PARAMETERS
    );

    // We want to compare the currently selected network with
    // the other networks that have been added for comparison.
    const comparisonConfigurations: State[] = [];
    data.saves.forEach((save) => {
      if (
        Object.keys(save).includes('isCompared') &&
        save.isCompared &&
        save.selectedNetworks[0].type === state.networkType &&
        save.parameters.isOrbital === state.parameters.isOrbital
      ) {
        comparisonConfigurations.push(convertSaveToState(save));
      }
    });

    const { rows, columns, columnMapping, labelsToKeys, columnData } =
      await CreateComparisonTable(comparisonConfigurations);

    setResult((prevState) => ({
      ...prevState,
      rows: rows,
      columns: columns,
      columnMapping: columnMapping,
      keyList: labelsToKeys,
      columnData: columnData
    }));
    setSource((prevState) => ({
      ...prevState,
      rows: rows,
      columns: columns,
      columnMapping: columnMapping,
      keyList: labelsToKeys,
      columnData: columnData
    }));
    onState('comparisonLoading', false);
  };

  useEffect(() => {
    if (!performancePanel) {
      setSource(state.networkType === 'relay' ? initialSource : initialDteSource);
      setResult(state.networkType === 'relay' ? initialSource : initialDteSource);
      return;
    }
    fetchResults();
    setStatus((prevState) => ({ ...prevState, active: false }));
  }, [performancePanel]);

  useEffect(() => {
    const isDisabled =
      status.checked && Object.values(status.checked).some((el) => el === true);
    setStatus((prevState) => ({ ...prevState, disabled: !isDisabled }));
  }, [status.checked]);

  useEffect(() => {
    size.width > 1200 &&
      status.isSize &&
      setStatus((prevState) => ({
        ...prevState,
        isSize: false,
        amount: status.amount + 2
      }));

    size.width <= 1200 &&
      !status.isSize &&
      setStatus((prevState) => ({
        ...prevState,
        isSize: true,
        amount: status.amount - 2
      }));

    setStatus((prevState) => ({
      ...prevState,
      width: (size.width - 0.15 * size.width - 420) / 6 + 'px'
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size]);

  useEffect(() => {
    dispatch(updateComparePanel(result));
  }, [result]);

  const handleStatus = (values: Status) => setStatus(values);

  const handleModal = (values: IModal) => setModal(values);

  const handleResult = (values: ICompare) => {
    setSource(values);
    setResult(values);
  };

  const handleCloseDive = (): void => {
    setStatus((prevState) => ({ ...prevState, diveOpen: !status.diveOpen }));
  };

  const handleCloseDeep = (): void => {
    setStatus((prevState) => ({ ...prevState, deepOpen: !status.deepOpen }));
  };

  const handleCloseChart = (): void => {
    setStatus((prevState) => ({
      ...prevState,
      chartOpen: false,
      checked: null
    }));
  };

  const handleViewChange = (event) => setViewMethod(event.currentTarget.name);

  const resetPlot = () => setReset(!reset);

  const handleCheck = (e) => {
    const { name, checked } = e.currentTarget;
    setChecked((prevState) => ({ ...prevState, [name]: checked }));
  };

  const toggleEarthView = () => {
    setIsEarth(!isEarth);
  };

  return (
    <div className={visible ? classes.root : classes.hide}>
      <Dialog
        open={dialogVisible}
        onClose={() => setDialogVisible(false)}
        maxWidth="sm"
        disableBackdropClick
        disableEscapeKeyDown
        keepMounted
        fullWidth
      >
        <DialogTitle disableTypography className={classes.title}>
          <Typography variant="h6">Rank Comparison Results</Typography>
          <IconButton
            className={classes.closeButton}
            onClick={() => setDialogVisible(false)}
          >
            <CloseIcon color="primary" />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers style={{ backgroundColor: theme.palette.component.main }}>
          <Grid container justify="center" alignItems="center" spacing={2}>
            {performanceParams
              .filter(
                (item) =>
                  !item.includes('dataRate') && !item.includes('throughput')
              )
              .map((item) => (
                <>
                  <Grid item md={3} xs={12} key={`grid-${item}`}>
                    <Typography
                      variant="body1"
                      align="right"
                      key={`text-${item}`}
                      color="textPrimary"
                    >
                      {METRIC_LABELS[item].substring(
                        0,
                        METRIC_LABELS[item].includes('(')
                          ? METRIC_LABELS[item].indexOf('(') - 1
                          : METRIC_LABELS[item].length
                      )}
                    </Typography>
                  </Grid>
                  <Grid item md={7} xs={12}>
                    <FormControl
                      variant="filled"
                      size="small"
                      key={`formControl-${item}`}
                      fullWidth
                    >
                      <Select
                        name="networks"
                        variant="outlined"
                        value={rankMenu[item]}
                        onChange={(e) =>
                          setRankMenu({
                            ...rankMenu,
                            [item]: e.target.value.toString()
                          })
                        }
                        className={classes.select}
                        fullWidth
                        key={`formSelect-${item}`}
                      >
                        {rankOptions.map((rankItem) => (
                          <MenuItem
                            key={`${item}-${rankItem.name}`}
                            value={rankItem.name}
                          >
                            {rankItem.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </>
              ))}
          </Grid>
          <Box p={2} mt={2} display="flex">
            <Box flexGrow={1} />
            <Box>
              <Button
                autoFocus
                variant="contained"
                color="primary"
                onClick={() => setRankMenu(initialRanks)}
              >
                Reset
              </Button>
              &nbsp;
              <Button
                autoFocus
                variant="contained"
                color="primary"
                onClick={() => {
                  updateComparisonTable(true);
                  setRankState(true);
                  setDialogVisible(false);
                }}
                disabled={source.columns.length<=1}
              >
                Rank Results
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      <CompareHeader
        result={source.csvData}
        file={source.fileName}
        status={status}
        rankState={rankState}
        onStatus={handleStatus}
        handleDialog={handleDialog}
        disabled={state.radioButtonSelectionId === 0}
      />
      <CompareTable
        state={state}
        status={status}
        result={source}
        source={source}
        rankState={rankState}
        onModal={handleModal}
        onStatus={handleStatus}
        onResult={handleResult}
        onSelect={(index: number) => setSelectedIndex(index)}
        handlePlotOptions={(name: string, value: boolean) => setChecked((prevState) => ({ ...prevState, [name]: value }))}
      />
      {status.deepOpen && result && state.parameters.isOrbital && (
        <PlotModal
          state={[source.columnData[selectedIndex].state]}
          data={[source.columnData[selectedIndex].data]}
          metricType={modal.deep.deepDive.split('/')[1]}
          minAltitude={
            source.columnData[selectedIndex].state.networkType === 'relay'
              ? 0
              : 300
          }
          maxAltitude={
            source.columnData[selectedIndex].state.networkType === 'relay'
              ? source.columnData[selectedIndex].data.systemParams.A_r
              : 1000
          }
          maxInclination={state.networkType === 'relay' ? 90 : 120}
          reset={reset}
          onReset={resetPlot}
          values={[state.networkType === 'relay' ? getOrbitalModelValue(
            source.columnData[selectedIndex].state.parameters.altitude,
            source.columnData[selectedIndex].state.parameters.inclination,
            modal.deep.deepDive.split('/')[1],
            source.columnData[selectedIndex].data.modalData,
            source.columnData[selectedIndex].data.systemParams.systemName

          ) : getOrbitalModelValue(
            source.columnData[selectedIndex].state.parameters.altitude,
            source.columnData[selectedIndex].state.parameters.inclination,
            modal.deep.deepDive.split('/')[1],
            source.columnData[selectedIndex].data.modalData,
            source.columnData[selectedIndex].data.systemParams.systemName

          )
          ]}
          open={status.deepOpen}
          zAxisLabel={METRIC_LABELS[modal.deep.deepDive.split('/')[1]]}
          viewMethod={viewMethod}
          onChartClose={handleCloseDeep}
          onViewChange={handleViewChange}
          plotOptions={checked}
          label={METRIC_LABELS[modal.deep.deepDive.split('/')[1]]}
          onCheck={handleCheck}
          onClick={() => {
            return;
          }}
          isClickable={false}
          size={{
            width: 320,
            height: 260
          }}
          chartDiv={''}
          onState={onState}
          showRegressionDisabled={modal.deep.regressionQuality === 1}
        />
      )}
      {status.deepOpen && result && !state.parameters.isOrbital && (
        <SubChartPanel
          metricType={modal.deep.deepDive.split('/')[1]}
          label={METRIC_LABELS[modal.deep.deepDive.split('/')[1]]}
          source={
            source.columnData[selectedIndex].data.modelData.terrestrial[
              modal.deep.deepDive.split('/')[1]
            ]
          }
          isEarth={isEarth}
          toggleEarthView={toggleEarthView}
          mode={viewMethod}
          open={status.deepOpen}
          onChartClose={handleCloseDeep}
          onViewChange={handleViewChange}
          onReset={resetPlot}
          onClick={() => {
            return;
          }}
          isClickable={false}
        />
      )}
      {status.diveOpen && result && (
        <CompareDeepDive
          isOpen={status.diveOpen}
          onClose={handleCloseDive}
          parameterKey={modal.deep.deepDive.split('/')[1]}
          systemParams={source.columnData[selectedIndex].data.systemParams}
          linkParams={source.columnData[selectedIndex].data.linkParams}
          state={source.columnData[selectedIndex].state}
          calculatedData={source.columnData[selectedIndex].calculatedData}
        />
      )}
      {status.chartOpen && result && (
        <CompareChart
          open={status.chartOpen}
          source={modal.chart?.[0]}
          params={{
            ...state.parameters,
            ...state.constraints,
            ...state.specifications
          }}
          onClose={handleCloseChart}
        />
      )}
      {status.isCompareLinePlotOpen && (
        <PlotModal
          state={source.columnData.map(col => col.state)}
          data={source.columnData.map(data => data.data)}
          metricType={modal.selectedParameter}
          minAltitude={source.columnData[0].state.networkType === 'relay' ? 0 : 300}
          maxAltitude={
            source.columnData[0].state.networkType === 'relay'
              ? Math.max(...source.columnData.map(col => col.data.systemParams.A_r))
              : 1000
          }
          maxInclination={state.networkType === 'relay' ? 90 : 120}
          reset={reset}
          onReset={resetPlot}
          values={source.columnData.map(col => {
            return state.networkType === 'relay' ? getOrbitalModelValue(
              col.state.parameters.altitude,
              col.state.parameters.inclination,
              modal.selectedParameter,
              col.state.data?.modelData,
              col.data.systemParams.systemName
            ) : getOrbitalModelValue(
              col.state.parameters.altitude,
              col.state.parameters.inclination,
              modal.selectedParameter,
              col.state.data?.modelData,
              col.data.systemParams.systemName
            )
          })}
          open={status.isCompareLinePlotOpen}
          zAxisLabel={METRIC_LABELS[modal.selectedParameter]}
          viewMethod={viewMethod}
          onChartClose={() => {
            setStatus((prevState) => ({
              ...prevState,
              isCompareLinePlotOpen: false
            }));
          }}
          onViewChange={handleViewChange}
          plotOptions={checked}
          label={METRIC_LABELS[modal.selectedParameter]}
          onCheck={handleCheck}
          onClick={() => {
            return;
          }}
          isClickable={false}
          size={{
            width: 320,
            height: 260
          }}
          chartDiv={''}
          onState={onState}
          showRegressionDisabled={modal.hideRegressions}
        />
      )}
    </div>
  );
};

export default Comparison;
