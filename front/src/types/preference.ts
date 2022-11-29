import type { IResults } from 'src/pages/home';

export interface Preference {
  project: Project[];
}

export interface Project {
  id: string;
  projectName: string;
  missionName: string;
  missionDescription: string;
  saves: ISave[];
}

export interface ISave {
  id?: string;
  name?: string;
  dateTime: number;
  selectedTabRight: string;
  selectedTabCenter: string;
  selectedFrequencyBandId: number;
  selectedSystemId: number;
  isBaseline: boolean;
  isCompared: boolean;
  parameters: Parameter;
  specifications: Specifications;
  constraints: Constraints;
  results: IResults;
  networkFilters: NetworkFilters;
  groundStationFilters: GroundStationFilters;
  selectedNetworks: SelectedNetwork[];
  regressionTypes: { [key: string]: string };
}

export interface Parameter {
  isOrbital: boolean;
  orbitState: number;
  altitude: number;
  inclination: number;
  latitude: number;
  longitude: number;
  raan: number;
  eccentricity: number;
  argumentOfPerigee: number;
  trueAnomaly: number;
}

export interface Specifications {
  availability: number;
  throughput: number;
  tolerableGap: number;
  trackingServiceRangeError: number;
  eirp: number;
}

export interface Constraints {
  launchDay: number;
  launchMonth: number;
  launchYear: number;
  endDay: number;
  endMonth: number;
  endYear: number;
  defaultTime: boolean;
  powerAmplifier: number;
  freqBandFilter: number;
  centerFreqFilter: number;
  polarizationType: number;
  modulationFilter: number;
  codingFilter: number;
}

export interface NetworkFilters {
  name: string[];
  type: string;
  operationalYear: string;
  supportedFrequencies: string;
  location: string;
  scanAgreement: string;
}

export interface GroundStationFilters {
  name: string[];
  networks: string[];
  operationalYear?: string;
  supportedFrequencies: string;
  location: string;
  scanAgreement: string;
}

export interface SelectedNetwork {
  id?: number;
  name?: string;
  system?: string;
  type?: string;
  freqBands?: string;
  freqBandId?: number;
  supportedFrequencies?: string;
  version: number;
  versions?: { [key: string]: number };
  optimizedModCod: boolean;
  modulationId: number | null;
  modulation?: string;
  codingId: number | null;
  coding?: string;
  antennaId: number | null;
  antennaName?: string;
  frequencyBandId?: number;
};