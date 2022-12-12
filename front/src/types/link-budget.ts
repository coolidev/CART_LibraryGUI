export interface DteLinkBudget {
    userEirp_dBW: number;
    freeSpaceLoss_dB: number;
    polarizationLoss_dB: number;
    atmosphericLoss_dB: number;
    rainAttenuation_dB: number;
    cloudAttenuation_dB: number;
    scintillationLoss_dB: number;
    miscellaneousLosses_dB: number;
    receivedPower_dBW: number;
    gainToNoiseTemperatureRatio_dB_K: number;
    boltzmann_dBW_HzK: number;
    cOverNo_dBHz: number;
    dataRate_dBbps: number;
    ebNoIntoDemod_dB: number;
    implementationLoss_dB: number;
    netEbNo_dB: number;
    requiredEbNo_dB: number;
    margin_dB: number;
};

export interface RelayRegenerativeLinkBudget {
    userEirp_dBW: number;
    sslFrequency_MHz: number;
    sslDistance_km: number;
    freeSpaceLoss_dB: number;
    multipathLoss_dB: number;
    polarizationLoss_dB: number;
    atmosphericLoss_dB: number;
    rainAttenuation_dB: number;
    miscellaneousLosses_dB: number;
    precAtRelay_dBW: number;
    relayGainToNoiseTemperatureRatio_dB_K: number;
    cOverNoAtRelay_dB_K: number;
    bandwidth_dBHz: number;
    cOverNAtRelay_dB: number;
    carrierToInterferenceRatio_dB: number;
    cOverNAtGround_dB: number;
    cOverNoAtGround_dBHz: number;
    dataRate_dBbps: number;
    ebNoIntoDemod_dB: number;
    implementationLoss_dB: number;
    netEbNo_dB: number;
    requiredEbNo_dB: number;
    margin_dB: number;
};

export interface RelayBentPipeLinkBudget {
    userEirp_dBW: number;
    sslFrequency_MHz: number;
    sslDistance_km: number;
    freeSpaceLoss_dB: number;
    multipathLoss_dB: number;
    polarizationLoss_dB: number;
    atmosphericLoss_dB: number;
    rainAttenuation_dB: number;
    miscellaneousLosses_dB: number;
    precAtRelay_dBW: number;
    relayGainToNoiseTemperatureRatio_dB_K: number;
    cOverNoAtRelay_dB_K: number;
    bandwidth_dBHz: number;
    cOverNAtRelay_dB: number;
    sglFrequency_MHz: number;
    relayEirp_dBW: number;
    sglDistance_km: number;
    sglFreeSpaceLoss_dB: number;
    sglAtmosphericLoss_dB: number;
    sglPolarizationLoss_dB: number;
    sglRainAttenuation_dB: number;
    precAtGround_dBW: number;
    gatewayGainToNoiseTemperatureRatio_dB_K: number;
    sglCOverNo_dB_Hz: number;
    imDegradation_dB: number;
    sglBandwidth_dBHz: number;
    sglCOverN_dB: number;
    carrierToInterferenceRatio_dB: number;
    cOverNAtGround_dB: number;
    cOverNoAtGround_dBHz: number;
    dataRate_dBbps: number;
    ebNoIntoDemod_dB: number;
    implementationLoss_dB: number;
    rfInterferenceLoss_dB: number;
    netEbNo_dB: number;
    requiredEbNo_dB: number;
    margin_dB: number;
};

export interface LinkBudgetRow {
    id: string;
    key: string;
    parameter: string;
    location: number;
    value: any;
    noteId: string;
    notes: string;
  };