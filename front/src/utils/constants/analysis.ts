export const PERFORMANCE_PARAMETERS = [
    'coverage', 'mean_contacts', 'mean_coverage_duration',
    'average_gap', 'max_gap', 'mean_response_time', 
    'availability', 'dataRate', 'throughput'
];

export const DTE_PERFORMANCE_PARAMETERS = [
    'coverageMinutes', 'contactsPerDay', 'averageCoverageDuration',
    'maxCoverageDuration', 'averageGapDuration', 'maxGapDuration',
    'meanResponseTime', 'dataRate', 'throughput'
];

export const ANTENNA_OPTIONS_PARAMETERS = [
    'eirp_dbw', 'parabolicDiameter', 'parabolicMass',
    'steerableSize', 'helicalHeight',
    'patchSize', 'dipoleSize'
];

export const MISSION_IMPACTS_PARAMETERS = [
    'tracking_rate', 'slew_rate', 'reduced_coverage',
    'bodyPointingFeasibility', 'mechanicalPointingFeasibility'
];

export const NAV_AND_TRACKING_PARAMETERS = [
    'trackingCapability', 'gnssUsage'
];

export const METRIC_LABELS = {
    availability: 'Effective Comms Time (%)',
    coverage: 'RF Coverage (%)',
    data_volume: 'Throughput (Gb/Day)',
    average_gap: 'Average Gap (minutes)',
    tracking_rate: 'Tracking Rate (deg/s)',
    slew_rate: 'Slew Rate (deg/s)',
    reduced_coverage: 'Pointing-Adjusted RF Coverage (%)',
    mean_contacts: 'Mean Number of RF Contacts Per Orbit',
    mean_coverage_duration: 'Mean RF Contact Duration (seconds)',
    max_gap: 'Max RF Coverage Gap (minutes)',
    mean_response_time: 'Mean Response Time (seconds)',
    coverageMinutes: 'RF Coverage (minutes/day)',
    contactsPerDay: 'Contacts Per Day',
    averageCoverageDuration: 'Average Contact Duration (minutes)',
    maxCoverageDuration: 'Max Coverage Duration (minutes)',
    averageGapDuration: 'Average Gap (minutes)',
    maxGapDuration: 'Max Gap (minutes)',
    meanResponseTime: 'Mean Response Time (minutes)',
    dataRate: 'Data Rate (kbps)',
    throughput: 'Throughput (Gb/Day)'
};

export const PERFORMANCE_KEYS = [
    'coverage',
    'mean_contacts',
    'mean_coverage_duration',
    'average_gap',
    'max_gap',
    'mean_response_time',
    'availability',
    'coverageMinutes',
    'contactsPerDay',
    'averageCoverageDuration',
    'maxCoverageDuration',
    'averageGapDuration',
    'maxGapDuration',
    'meanResponseTime'
];

export const ANTENNA_TYPES = {
    'parabolicDiameter': 'Parabolic Antenna Diameter (m)',
    'parabolicMass': 'Parabolic Antenna Mass (kg)',
    'steerableSize': 'Electronically Steerable Antenna Size (m²)',
    'helicalHeight': 'Helical Antenna Height (m)',
    'patchSize': 'Patch Antenna Size (m²)',
    'dipoleSize': 'Dipole Antenna Size (m)'
};

export const USER_BURDEN_KEYS = {
    'User EIRP (dBW)': 'eirp_dbw',
    'Parabolic Antenna Diameter (m)': 'parabolicDiameter',
    'Parabolic Antenna Mass (kg)': 'parabolicMass',
    'Electronically Steerable Antenna Size (m²)': 'steerableSize',
    'Electronically Steerable Antenna Mass (kg)': 'steerableMass',
    'Helical Antenna Height (m)': 'helicalHeight',
    'Patch Antenna Size (m²)': 'patchSize',
    'Dipole Antenna Size (m)': 'dipoleSize'
};

export const MISSION_IMPACTS_LABELS = {
    'tracking_rate': 'Tracking Rate (deg/s)',
    'slew_rate': 'Slew Rate (deg/s)',
    'reduced_coverage': 'Pointing-Adjusted RF Coverage (%)',
    'bodyPointingFeasibility': 'Body Pointing Feasibility',
    'mechanicalPointingFeasibility': 'Mechanical Pointing Feasibility'
};

export const NAV_AND_TRACKING_LABELS = {
    'trackingCapability': 'Tracking Accuracy (m)',
    'gnssUsage': 'GNSS Availability'
};
