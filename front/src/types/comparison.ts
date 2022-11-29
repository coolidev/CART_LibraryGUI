import type { Metric } from './evaluation';

export interface ICompare {
  dataIDs: DataID[];
  rows: IRow[];
  columns: string[];
  columnMapping: string[],
  columnData: any;
  tooltips: IStrKey;
  resultId: string;
  keyList: IStrKey;
  csvData: string[][];
  fileName: string;
  userBurden: Burden;
  surfaces: Surface;
  surfaceSlices: Surface;
  metricSelections: metricImportance[];
}

export interface metricImportance {
  metricName: string;
  metricImportance: string;
}

export interface DataID {
  networkId: number;
  system_attribute_version_id: number;
}

export interface IRow {
  group: string;
  rows: (string | number)[][];
}

export interface IStrKey {
  [key: string]: string;
}

export interface IArrKey {
  [key: string]: any[];
}

export interface Burden {
  [key: string]: IBurden;
}

export interface IBurden {
  P_rec: number;
  A_r: number;
  theta: number;
  f_MHz: number;
  R_kbps: number;
  lambda: number;
  gOverT: number;
  cOverNo: number;
  implementationLoss: number;
  polarizationLoss_dB: number;
  propagationLosses_dB: number;
  otherLosses_dB: number;
  ebNo: number;
}

export interface Surface {
  [key: string]: ISurface;
}

export interface ISurface {
  mean_contacts: Metric[];
  reduced_coverage: Metric[];
  max_gap: Metric[];
  average_gap: Metric[];
  slew_rate: Metric[];
  mean_response_time: Metric[];
  tracking_rate: Metric[];
  coverage: Metric[];
  mean_coverage_duration: Metric[];
}
