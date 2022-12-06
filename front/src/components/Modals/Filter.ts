import { Filter, Filterer } from 'src/utils/filterer';



export const allFilters = new Map<string, (val : any) => Filter>();

/************************** MISSION LAUNCH YEAR FILTER *******************************************/

allFilters.set('missionLaunchYear', (compareVal : any) => {
  return (networkObj : any) => {
    let launchYear = compareVal;
    if (launchYear === -1) {
      return false;
    }
    if(networkObj.year == null || launchYear == null) {
      return false;
    }
    return Number(networkObj.year) <= launchYear;
}
});

/************************** MISSION FREQUENCY BAND FILTER *******************************************/

allFilters.set('missionFreqBand', (compareVal : any) => {
  return (val : any) => {
    let bands;
      if(compareVal == null || compareVal === ""){
        bands = [""]
      } else {
        bands = compareVal.split(',');
      }
      if (bands.length == 0) {
        bands = [""]
      }
      bands = bands.map(e => e.toLowerCase());
  
      for(let i = 0; i < bands.length; i++) {
        if (val.freqBands.toLowerCase().includes(bands[i])) return true;
      }
      return false;
  }
});

/************************** MISSION POLARIZATION FILTER *******************************************/

allFilters.set('missionPolarization', (compareVal : any) => {
  return (val : any) => {
    if(val.type === 'relay'){
      return false;
    }
    let polarization;
    if(compareVal == null || compareVal === ""){
      polarization = [""]
    } else {
      polarization = compareVal.split(',');
    }
      if (polarization.length == 0) {
        polarization = [""]
      }
      polarization = polarization.map(e => e.toLowerCase());
      for(let i = 0; i < polarization.length; i++) {
        if (val.polarization.toLowerCase().includes(polarization[i])) return true;
      }
      return false;
  }
  });

/************************** MISSION CODING TYPE FILTER *******************************************/

allFilters.set('missionCodingType', (compareVal : any) => {
  return (val : any) => {
    if(val.type === 'relay'){
      return false;
    }
    let channelCodingType;
    if(compareVal == null || compareVal === ""){
      channelCodingType = [""]
    } else {
      channelCodingType = compareVal.split(',');
    }
      if (channelCodingType.length == 0) {
        channelCodingType = [""]
      }
      channelCodingType = channelCodingType.map(e => e.toLowerCase());
      for(let i = 0; i < channelCodingType.length; i++) {
        if (val.channelCodingType.toLowerCase().includes(channelCodingType[i])) return true;
      }
      return false;
  }
  });


  /************************** MISSION MODULATION TYPE FILTER *******************************************/

allFilters.set('missionModulationType', (compareVal : any) => {
  return (val : any) => {
    if(val.type === 'relay'){
      return false;
    }
    let modulationType;
    if(compareVal == null || compareVal === ""){
      modulationType = [""]
    } else {
      modulationType = compareVal.split(',');
    }
      if (modulationType.length == 0) {
        modulationType = [""]
      }
      modulationType = modulationType.map(e => e.toLowerCase());
      for(let i = 0; i < modulationType.length; i++) {
        if (val.modulationType.toLowerCase().includes(modulationType[i])) return true;
      }
      return false;
  }
  });

/************************** OPERATIONAL YEAR FILTER *******************************************/

allFilters.set('operationalYear', (compareVal : any) => {
return (val : any) => {

    let year = compareVal;
    if (year == '') {
    year = '999999';
    }
    if(val.year == null || year == null) {
    return false;
    }
    return Number(val.year) <= Number(year);
}
});
/************************** FREQUENCY BAND FILTER *******************************************/

allFilters.set('frequencyBands', (compareVal : any) => {
return (val : any) => {
  let bands;
    if(compareVal == null || compareVal === ""){
      bands = [""]
    } else {
      bands = compareVal.split(',');
    }
    if (bands.length == 0) {
      bands = [""]
    }
    bands = bands.map(e => e.toLowerCase());

    for(let i = 0; i < bands.length; i++) {
      if (val.freqBands.toLowerCase().includes(bands[i])) return true;
    }
    return false;
}
});

/************************** LOCATION FILTER *******************************************/

allFilters.set('location', (compareVal : any) => {
return (val : any) => {
  let location;
  if(compareVal == null || compareVal === ""){
    location = [""]
  } else {
    location = compareVal.split(',');
  }
    if (location.length == 0) {
      location = [""]
    }
    location = location.map(e => e.toLowerCase());
    for(let i = 0; i < location.length; i++) {
      if (val.location.toLowerCase().includes(location[i])) return true;
    }
    return false;
}
});

/************************** MIN FREQUENCY FILTER *******************************************/
allFilters.set('minFrequency>', (compareVal : any) => {
  return (val : any) => {
      if(compareVal == null || compareVal === ""){
        return true;
      }
      let minFrequency = compareVal;
      let isValid = false;
      if (minFrequency == '') {
      minFrequency = '0';
      }
      if(isNaN(val.minFrequency)){
        val.minFrequency.split(',').forEach(value => {
          if((value) != null && Number(value) > Number(minFrequency)){
            isValid = true;
          }
        })
        return isValid;
      } else {
        return Number(val.minFrequency) > Number(minFrequency);
      }
  }
  });

allFilters.set('minFrequency<', (compareVal : any) => {
  return (val : any) => {
      if(compareVal == null || compareVal === ""){
        return true;
      }
      let minFrequency = compareVal;
      let isValid = false;
      if (minFrequency == '') {
      minFrequency = '0';
      }
      if(isNaN(val.minFrequency)){
        val.minFrequency.split(',').forEach(value => {
          if((value) != null && Number(value) < Number(minFrequency)){
            isValid = true;
          }
        })
        return isValid;
      } else {
        return Number(val.minFrequency) < Number(minFrequency);
      }
  }
  });

allFilters.set('minFrequency=', (compareVal : any) => {
  return (val : any) => {
      if(compareVal == null || compareVal === ""){
        return true;
      }
      let minFrequency = compareVal;
      let isValid = false;
      if (minFrequency == '') {
      minFrequency = '0';
      }
      if(isNaN(val.minFrequency)){
        val.minFrequency.split(',').forEach(value => {
          if((value) != null && Number(value) == Number(minFrequency)){
            isValid = true;
          }
        })
        return isValid;
      } else {
        return Number(val.minFrequency) == Number(minFrequency);
      }
  }
  });

allFilters.set('minFrequency>=', (compareVal : any) => {
return (val : any) => {
    if(compareVal == null || compareVal === ""){
      return true;
    }
    let minFrequency = compareVal;
    let isValid = false;
    if (minFrequency == '') {
    minFrequency = '0';
    }
    if(isNaN(val.minFrequency)){
      val.minFrequency.split(',').forEach(value => {
        if((value) != null && Number(value) >= Number(minFrequency)){
          isValid = true;
        }
      })
      return isValid;
    } else {
      return Number(val.minFrequency) >= Number(minFrequency);
    }
}
});

allFilters.set('minFrequency<=', (compareVal : any) => {
  return (val : any) => {
      if(compareVal == null || compareVal === ""){
        return true;
      }
      let minFrequency = compareVal;
      let isValid = false;
      if (minFrequency == '') {
      minFrequency = '0';
      }
      if(isNaN(val.minFrequency)){
        val.minFrequency.split(',').forEach(value => {
          if((value) != null && Number(value) <= Number(minFrequency)){
            isValid = true;
          }
        })
        return isValid;
      } else {
        return Number(val.minFrequency) <= Number(minFrequency);
      }
  }
  });

/************************** MAX FREQUENCY FILTER *******************************************/
allFilters.set('maxFrequency<', (compareVal : any) => {
  return (val : any) => {
    
      if(compareVal == null || compareVal === ""){
        return true;
      }
      let maxFrequency = compareVal;
      let isValid = false;
      if (maxFrequency == '') {
      maxFrequency = '9999999';
      }
      if(isNaN(val.minFrequency)){
        val.maxFrequency.split(',').forEach(value => {
          if((value) != null && Number(value) < Number(maxFrequency)){
            isValid = true;
          }
        })
        return isValid;
      } else {
        return Number(val.maxFrequency) < Number(maxFrequency);
      }
  }
  });

allFilters.set('maxFrequency>', (compareVal : any) => {
  return (val : any) => {
    
      if(compareVal == null || compareVal === ""){
        return true;
      }
      let maxFrequency = compareVal;
      let isValid = false;
      if (maxFrequency == '') {
      maxFrequency = '9999999';
      }
      if(isNaN(val.minFrequency)){
        val.maxFrequency.split(',').forEach(value => {
          if((value) != null && Number(value) > Number(maxFrequency)){
            isValid = true;
          }
        })
        return isValid;
      } else {
        return Number(val.maxFrequency) > Number(maxFrequency);
      }
  }
  });

allFilters.set('maxFrequency=', (compareVal : any) => {
  return (val : any) => {
    
      if(compareVal == null || compareVal === ""){
        return true;
      }
      let maxFrequency = compareVal;
      let isValid = false;
      if (maxFrequency == '') {
      maxFrequency = '9999999';
      }
      if(isNaN(val.minFrequency)){
        val.maxFrequency.split(',').forEach(value => {
          if((value) != null && Number(value) == Number(maxFrequency)){
            isValid = true;
          }
        })
        return isValid;
      } else {
        return Number(val.maxFrequency) == Number(maxFrequency);
      }
  }
  });

allFilters.set('maxFrequency>=', (compareVal : any) => {
return (val : any) => {
  
    if(compareVal == null || compareVal === ""){
      return true;
    }
    let maxFrequency = compareVal;
    let isValid = false;
    if (maxFrequency == '') {
    maxFrequency = '9999999';
    }
    if(isNaN(val.minFrequency)){
      val.maxFrequency.split(',').forEach(value => {
        if((value) != null && Number(value) >= Number(maxFrequency)){
          isValid = true;
        }
      })
      return isValid;
    } else {
      return Number(val.maxFrequency) >= Number(maxFrequency);
    }
}
});

allFilters.set('maxFrequency<=', (compareVal : any) => {
  return (val : any) => {
    
      if(compareVal == null || compareVal === ""){
        return true;
      }
      let maxFrequency = compareVal;
      let isValid = false;
      if (maxFrequency == '') {
      maxFrequency = '9999999';
      }
      if(isNaN(val.minFrequency)){
        val.maxFrequency.split(',').forEach(value => {
          if((value) != null && Number(value) <= Number(maxFrequency)){
            isValid = true;
          }
        })
        return isValid;
      } else {
        return Number(val.maxFrequency) <= Number(maxFrequency);
      }
  }
  });

/************************** SGL G/T FILTERS *******************************************/


allFilters.set('sglGT<', (compareVal : any) => {
return (val : any) => {
  if(val.type === 'dte'){
    return false;
  }
    if(compareVal == null || compareVal === ""){
      return true;
    }
    let sglGt = compareVal;
    let isValid = false;
    if (sglGt == '') {
      return true;
    }
    if((sglGt) == null) {
    return false;
    }
    val.sglGt.split(',').forEach(value => {
      if((value) != null && Number(value) < Number(sglGt)){
        isValid = true;
      }
    })
    return isValid;
}
});

allFilters.set('sglGT>', (compareVal : any) => {
return (val : any) => {
  if(val.type === 'dte'){
    return false;
  }
    if(compareVal == null || compareVal === ""){
      return true;
    }
    let sglGt = compareVal;
    let isValid = false;
    if (sglGt == '') {
      return true;
    }
    if((sglGt) == null) {
    return false;
    }
    val.sglGt.split(',').forEach(value => {
      if((value) != null && Number(value) > Number(sglGt)){
        isValid = true;
      }
    })
    return isValid;
}
});

allFilters.set('sglGT<=', (compareVal : any) => {
return (val : any) => {
  if(val.type === 'dte'){
    return false;
  }
    if(compareVal == null || compareVal === ""){
      return true;
    }
    let sglGt = compareVal;
    let isValid = false;
    if (sglGt == '') {
      return true;
    }
    if((sglGt) == null) {
    return false;
    }
    val.sglGt.split(',').forEach(value => {
      if((value) != null && Number(value) <= Number(sglGt)){
        isValid = true;
      }
    })
    return isValid;
}
});

allFilters.set('sglGT>=', (compareVal : any) => {
return (val : any) => {
  if(val.type === 'dte'){
    return false;
  }
    if(compareVal == null || compareVal === ""){
      return true;
    }
    let sglGt = compareVal;
    let isValid = false;
    if (sglGt == '') {
      return true;
    }
    if((sglGt) == null) {
    return false;
    }
    val.sglGt.split(',').forEach(value => {
      if((value) != null && Number(value) >= Number(sglGt)){
        isValid = true;
      }
    })
    return isValid;
}
});

allFilters.set('sglGT=', (compareVal : any) => {
return (val : any) => {
  if(val.type === 'dte'){
    return false;
  }
    if(compareVal == null || compareVal === ""){
      return true;
    }
    let sglGt = compareVal;
    let isValid = false;
    if (sglGt == '') {
      return true;
    }
    // console.log("year: " + year + " and val " + val.year);
    if((sglGt) == null) {
    return false;
    }
    val.sglGt.split(',').forEach(value => {
      if((value) != null && Number(value) == Number(sglGt)){
        isValid = true;
      }
    })
    return isValid;
}
});


/************************** SSL G/T FILTERS *******************************************/

allFilters.set('sslGT<', (compareVal : any) => {
return (val : any) => {
  if(val.type === 'dte'){
    return false;
  }
    if(compareVal == null || compareVal === ""){
      return true;
    }
    let sslGt = compareVal;
    let isValid = false;
    if (sslGt == '') {
      return true;
    }
    if((sslGt) == null) {
    return false;
    }
    val.sslGt.split(',').forEach(value => {
      if((value) != null && Number(value) < Number(sslGt)){
        isValid = true;
      }
    })
    return isValid;
}
});

allFilters.set('sslGT>', (compareVal : any) => {
return (val : any) => {
  if(val.type === 'dte'){
    return false;
  }
    if(compareVal == null || compareVal === ""){
      return true;
    }
    let sslGt = compareVal;
    let isValid = false;
    if (sslGt == '') {
      return true;
    }
    if((sslGt) == null) {
    return false;
    }
    val.sslGt.split(',').forEach(value => {
      if((value) != null && Number(value) > Number(sslGt)){
        isValid = true;
      }
    })
    return isValid;
}
});

allFilters.set('sslGT<=', (compareVal : any) => {
return (val : any) => {
  if(val.type === 'dte'){
    return false;
  }
    if(compareVal == null || compareVal === ""){
      return true;
    }
    let sslGt = compareVal;
    let isValid = false;
    if (sslGt == '') {
      return true;
    }
    if((sslGt) == null) {
    return false;
    }
    val.sslGt.split(',').forEach(value => {
      if((value) != null && Number(value) <= Number(sslGt)){
        isValid = true;
      }
    })
    return isValid;
}
});

allFilters.set('sslGT>=', (compareVal : any) => {
return (val : any) => {
  if(val.type === 'dte'){
    return false;
  }
    if(compareVal == null || compareVal === ""){
      return true;
    }
    let sslGt = compareVal;
    let isValid = false;
    if (sslGt == '') {
      return true;
    }
    if((sslGt) == null) {
    return false;
    }
    val.sslGt.split(',').forEach(value => {
      if((value) != null && Number(value) >= Number(sslGt)){
        isValid = true;
      }
    })
    return isValid;
}
});

allFilters.set('sslGT=', (compareVal : any) => {
return (val : any) => {
  if(val.type === 'dte'){
    return false;
  }
    if(compareVal == null || compareVal === ""){
      return true;
    }
    let sslGt = compareVal;
    let isValid = false;
    if (sslGt == '') {
      return true;
    }
    // console.log("year: " + year + " and val " + val.year);
    if((sslGt) == null) {
    return false;
    }
    val.sslGt.split(',').forEach(value => {
      if((value) != null && Number(value) == Number(sslGt)){
        isValid = true;
      }
    })
    return isValid;
}
});

/************************** SSL EIRP FILTERS *******************************************/

allFilters.set('sslEIRP<', (compareVal : any) => {
return (val : any) => {
  if(val.type === 'dte'){
    return false;
  }
    if(compareVal == null || compareVal === ""){
      return true;
    }
    let sslEirp = compareVal;
    let isValid = false; 
    if (sslEirp == '') {
      return true;
    }
    if((sslEirp) == null) {
    return false;
    }
    val.sslEirp.split(',').forEach(value => {
      if((value) != null && Number(value) < Number(sslEirp)){
        isValid = true;
      }
    })
    return isValid;
}
});

allFilters.set('sslEIRP>', (compareVal : any) => {
return (val : any) => {
  if(val.type === 'dte'){
    return false;
  }
    if(compareVal == null || compareVal === ""){
      return true;
    }
    let sslEirp = compareVal;
    let isValid = false;
    if (sslEirp == '') {
      return true;
    }
    if((sslEirp) == null) {
    return false;
    }
    val.sslEirp.split(',').forEach(value => {
      if((value) != null && Number(value) > Number(sslEirp)){
        isValid = true;
      }
    })
    return isValid;
}
});

allFilters.set('sslEIRP<=', (compareVal : any) => {
return (val : any) => {
  if(val.type === 'dte'){
    return false;
  }
    if(compareVal == null || compareVal === ""){
      return true;
    }
    let sslEirp = compareVal;
    let isValid = false;
    if (sslEirp == '') {
      return true;
    }
    if((sslEirp) == null) {
    return false;
    }
    val.sslEirp.split(',').forEach(value => {
      if((value) != null && Number(value) <= Number(sslEirp)){
        isValid = true;
      }
    })
    return isValid;
}
});

allFilters.set('sslEIRP>=', (compareVal : any) => {
return (val : any) => {
  if(val.type === 'dte'){
    return false;
  }
    if(compareVal == null || compareVal === ""){
      return true;
    }
    let sslEirp = compareVal;
    let isValid = false;
    if (sslEirp == '') {
      return true;
    }
    if((sslEirp) == null) {
    return false;
    }
    val.sslEirp.split(',').forEach(value => {
      if((value) != null && Number(value) >= Number(sslEirp)){
        isValid = true;
      }
    })
    return isValid;
}
});

allFilters.set('sslEIRP=', (compareVal : any) => {
return (val : any) => {
  if(val.type === 'dte'){
    return false;
  }
    if(compareVal == null || compareVal === ""){
      return true;
    }
    let sslEirp = compareVal;
    let isValid = false;
    if (sslEirp == '') {
      return true;
    }
    // console.log("year: " + year + " and val " + val.year);
    if((sslEirp) == null) {
    return false;
    }
    val.sslEirp.split(',').forEach(value => {
      if((value) != null && Number(value) == Number(sslEirp)){
        isValid = true;
      }
    })
    return isValid;
}
});

/************************** SGL EIRP FILTERS *******************************************/

allFilters.set('sglEIRP<', (compareVal : any) => {
return (val : any) => {
  if(val.type === 'dte'){
    return false;
  }
    if(compareVal == null || compareVal === ""){
      return true;
    }
    let sglEirp = compareVal;
    let isValid = false;
    if (sglEirp == '') {
      return true;
    }
    if((sglEirp) == null) {
    return false;
    }
    val.sglEirp.split(',').forEach(value => {
      if((value) != null && Number(value) < Number(sglEirp)){
        isValid = true;
      }
    })
    return isValid;
}
});

allFilters.set('sglEIRP>', (compareVal : any) => {
return (val : any) => {
  if(val.type === 'dte'){
    return false;
  }
    if(compareVal == null || compareVal === ""){
      return true;
    }
    let sglEirp = compareVal;
    let isValid = false;
    if (sglEirp == '') {
      return true;
    }
    if((sglEirp) == null) {
    return false;
    }
    val.sglEirp.split(',').forEach(value => {
      if((value) != null && Number(value) > Number(sglEirp)){
        isValid = true;
      }
    })
    return isValid;
}
});

allFilters.set('sglEIRP<=', (compareVal : any) => {
return (val : any) => {
  if(val.type === 'dte'){
    return false;
  }
    if(compareVal == null || compareVal === ""){
      return true;
    }
    let sglEirp = compareVal;
    let isValid = false;
    if (sglEirp == '') {
      return true;
    }
    if((sglEirp) == null) {
    return false;
    }
    val.sglEirp.split(',').forEach(value => {
      if((value) != null && Number(value) <= Number(sglEirp)){
        isValid = true;
      }
    })
    return isValid;
}
});

allFilters.set('sglEIRP>=', (compareVal : any) => {
return (val : any) => {
  if(val.type === 'dte'){
    return false;
  }
    if(compareVal == null || compareVal === ""){
      return true;
    }
    let sglEirp = compareVal;
    let isValid = false;
    if (sglEirp == '') {
      return true;
    }
    if((sglEirp) == null) {
    return false;
    }
    val.sglEirp.split(',').forEach(value => {
      if((value) != null && Number(value) >= Number(sglEirp)){
        isValid = true;
      }
    })
    return isValid;
}
});

allFilters.set('sglEIRP=', (compareVal : any) => {
return (val : any) => {
  if(val.type === 'dte'){
    return false;
  }
    if(compareVal == null || compareVal === ""){
      return true;
    }
    let sglEirp = compareVal;
    let isValid = false;
    if (sglEirp == '') {
      return true;
    }
    // console.log("year: " + year + " and val " + val.year);
    if((sglEirp) == null) {
    return false;
    }
    val.sglEirp.split(',').forEach(value => {
      if((value) != null && Number(value) == Number(sglEirp)){
        isValid = true;
      }
    })
    return isValid;
}
});
/************************** RELAY TYPE FILTER *******************************************/

allFilters.set('relayType', (compareVal : any) => {
  return (val : any) => {
    if(val.type === 'dte' || val.relayType == null){
      return false;
    }
    let relayType;
    
    if(compareVal == null || compareVal === ""){
      relayType = [""]
    } else {
      relayType = compareVal.split(',');
    }
      if (relayType.length == 0) {
        relayType = [""]
      }
      
      relayType = relayType.map(e => e.toLowerCase());
      for(let i = 0; i < relayType.length; i++) {
        if (val.relayType.toLowerCase().includes(relayType[i])) return true;
      }
      return false;
  }
  });

/************************** ANTENNA NAME FILTER *******************************************/

allFilters.set('antennaName', (compareVal : any) => {
return (val : any) => {
  if(val.type === 'relay'){
    return false;
  }
  let antennaNames;
  if(compareVal == null || compareVal === ""){
    antennaNames = [""]
  } else {
    antennaNames = compareVal.split(',');
  }
    if (antennaNames.length == 0) {
      antennaNames = [""]
    }
    antennaNames = antennaNames.map(e => e.toLowerCase());
    for(let i = 0; i < antennaNames.length; i++) {
      if (val.antennaNames.toLowerCase().includes(antennaNames[i])) return true;
    }
    return false;
}
});

/************************** DATA FORMAT FILTER *******************************************/

allFilters.set('dataFormat', (compareVal : any) => {
return (val : any) => {
  if(val.type === 'relay'){
    return false;
  }
  let dataFormat;
  if(compareVal == null || compareVal === ""){
    dataFormat = [""]
  } else {
    dataFormat = compareVal.split(',');
  }
    if (dataFormat.length == 0) {
      dataFormat = [""]
    }
    dataFormat = dataFormat.map(e => e.toLowerCase());
    for(let i = 0; i < dataFormat.length; i++) {
      if (val.dataFormat.toLowerCase().includes(dataFormat[i])) return true;
    }
    return false;
}
});

/************************** MODULATION TYPE FILTER *******************************************/

allFilters.set('modulationType', (compareVal : any) => {
return (val : any) => {
  if(val.type === 'relay'){
    return false;
  }
  let modulationType;
  if(compareVal == null || compareVal === ""){
    modulationType = [""]
  } else {
    modulationType = compareVal.split(',');
  }
    if (modulationType.length == 0) {
      modulationType = [""]
    }
    modulationType = modulationType.map(e => e.toLowerCase());
    for(let i = 0; i < modulationType.length; i++) {
      if (val.modulationType.toLowerCase().includes(modulationType[i])) return true;
    }
    return false;
}
});

/************************** CHANNEL CODING TYPE FILTER *******************************************/

allFilters.set('channelCodingType', (compareVal : any) => {
return (val : any) => {
  if(val.type === 'relay'){
    return false;
  }
  let channelCodingType;
  if(compareVal == null || compareVal === ""){
    channelCodingType = [""]
  } else {
    channelCodingType = compareVal.split(',');
  }
    if (channelCodingType.length == 0) {
      channelCodingType = [""]
    }
    channelCodingType = channelCodingType.map(e => e.toLowerCase());
    for(let i = 0; i < channelCodingType.length; i++) {
      if (val.channelCodingType.toLowerCase().includes(channelCodingType[i])) return true;
    }
    return false;
}
});

/************************** POLARIZATION FILTER *******************************************/

allFilters.set('polarization', (compareVal : any) => {
return (val : any) => {
  if(val.type === 'relay'){
    return false;
  }
  let polarization;
  if(compareVal == null || compareVal === ""){
    polarization = [""]
  } else {
    polarization = compareVal.split(',');
  }
    if (polarization.length == 0) {
      polarization = [""]
    }
    polarization = polarization.map(e => e.toLowerCase());
    for(let i = 0; i < polarization.length; i++) {
      if (val.polarization.toLowerCase().includes(polarization[i])) return true;
    }
    return false;
}
});

/************************** SUBCARRIER MODULATION TYPE FILTER *******************************************/

allFilters.set('subcarrierModulationType', (compareVal : any) => {
  return (val : any) => {
    if(val.type === 'relay'){
      return false;
    }
    let subcarrierModulationType;
    if(compareVal == null || compareVal === ""){
      subcarrierModulationType = [""]
    } else {
      subcarrierModulationType = compareVal.split(',');
    }
      if (subcarrierModulationType.length == 0) {
        subcarrierModulationType = [""]
      }
      subcarrierModulationType = subcarrierModulationType.map(e => e.toLowerCase());
      for(let i = 0; i < subcarrierModulationType.length; i++) {
        if (val.subcarrierModulationType.toLowerCase().includes(subcarrierModulationType[i])) return true;
      }
      return false;
  }
});

/************************** EIRP FILTERS *******************************************/

allFilters.set('EIRP<', (compareVal : any) => {
return (val : any) => {
  if(val.type === 'relay'){
    return false;
  }
    if(compareVal == null || compareVal === ""){
      return true;
    }
    let eirp = compareVal;
    let isValid = false;
    if (eirp == '') {
      return true;
    }
    if((eirp) == null) {
    return false;
    }
    val.eirpValues.split(',').forEach(value => {
      if((value) != null && Number(value) < Number(eirp)){
        isValid = true;
      }
    })
    return isValid;
  }
});

allFilters.set('EIRP>', (compareVal : any) => {
return (val : any) => {
  if(val.type === 'relay'){
    return false;
  }
    if(compareVal == null || compareVal === ""){
      return true;
    }
    let eirp = compareVal;
    let isValid = false;
    if (eirp == '') {
      return true;
    }
    if((eirp) == null) {
    return false;
    }
    val.eirpValues.split(',').forEach(value => {
      if((value) != null && Number(value) > Number(eirp)){
        isValid = true;
      }
    })
    return isValid;
}
});

allFilters.set('EIRP<=', (compareVal : any) => {
return (val : any) => {
  if(val.type === 'relay'){
    return false;
  }
    if(compareVal == null || compareVal === ""){
      return true;
    }
    let eirp = compareVal;
    let isValid = false;
    if (eirp == '') {
      return true;
    }
    if((eirp) == null) {
    return false;
    }
    val.eirpValues.split(',').forEach(value => {
      if((value) != null && Number(value) <= Number(eirp)){
        isValid = true;
      }
    })
    return isValid;
}
});

allFilters.set('EIRP>=', (compareVal : any) => {
return (val : any) => {
  if(val.type === 'relay'){
    return false;
  }
    if(compareVal == null || compareVal === ""){
      return true;
    }
    let eirp = compareVal;
    let isValid = false;
    if (eirp == '') {
      return true;
    }
    if((eirp) == null) {
    return false;
    }
    val.eirpValues.split(',').forEach(value => {
      if((value) != null && Number(value) >= Number(eirp)){
        isValid = true;
      }
    })
    return isValid;
}
});

allFilters.set('EIRP=', (compareVal : any) => {
return (val : any) => {
  if(val.type === 'relay'){
    return false;
  }
    if(compareVal == null || compareVal === ""){
      return true;
    }
    let eirp = compareVal;
    let isValid = false;
    if (eirp == '') {
      return true;
    }
    // console.log("year: " + year + " and val " + val.year);
    if((eirp) == null) {
    return false;
    }
    val.eirpValues.split(',').forEach(value => {
      if((value) != null && Number(value) == Number(eirp)){
        isValid = true;
      }
    })
    return isValid;
}
});

/************************** ANTENNA SIZE FILTERS *******************************************/

allFilters.set('antennaSize<', (compareVal : any) => {
return (val : any) => {
  if(val.type === 'relay'){
    return false;
  }
    if(compareVal == null || compareVal === ""){
      return true;
    }
    let antennaSize = compareVal;
    let isValid = false;
    if (antennaSize == '') {
      return true;
    }
    if((antennaSize) == null) {
    return false;
    }
    val.antennaSize.split(',').forEach(value => {
      if((value) != null && Number(value) < Number(antennaSize)){
        isValid = true;
      }
    })
    return isValid;
}
});

allFilters.set('antennaSize>', (compareVal : any) => {
return (val : any) => {
  if(val.type === 'relay'){
    return false;
  }
    if(compareVal == null || compareVal === ""){
      return true;
    }
    let antennaSize = compareVal;
    let isValid = false;
    if (antennaSize == '') {
      return true;
    }
    if((antennaSize) == null) {
    return false;
    }
    val.antennaSize.split(',').forEach(value => {
      if((value) != null && Number(value) > Number(antennaSize)){
        isValid = true;
      }
    })
    return isValid;
}
});

allFilters.set('antennaSize<=', (compareVal : any) => {
return (val : any) => {
  if(val.type === 'relay'){
    return false;
  }
    if(compareVal == null || compareVal === ""){
      return true;
    }
    let antennaSize = compareVal;
    let isValid = false;
    if (antennaSize == '') {
      return true;
    }
    if((antennaSize) == null) {
    return false;
    }
    val.antennaSize.split(',').forEach(value => {
      if((value) != null && Number(value) <= Number(antennaSize)){
        isValid = true;
      }
    })
    return isValid;
}
});

allFilters.set('antennaSize>=', (compareVal : any) => {
return (val : any) => {
  if(val.type === 'relay'){
    return false;
  }
    if(compareVal == null || compareVal === ""){
      return true;
    }
    let antennaSize = compareVal;
    let isValid = false;
    if (antennaSize == '') {
      return true;
    }
    if((antennaSize) == null) {
    return false;
    }
    val.antennaSize.split(',').forEach(value => {
      if((value) != null && Number(value) >= Number(antennaSize)){
        isValid = true;
      }
    })
    return isValid;
}
});

allFilters.set('antennaSize=', (compareVal : any) => {
return (val : any) => {
  if(val.type === 'relay'){
    return false;
  }
    if(compareVal == null || compareVal === ""){
      return true;
    }
    let antennaSize = compareVal;
    let isValid = false;
    if (antennaSize == '') {
      return true;
    }
    // console.log("year: " + year + " and val " + val.year);
    if((antennaSize) == null) {
    return false;
    }
    val.antennaSize.split(',').forEach(value => {
      if((value) != null && Number(value) == Number(antennaSize)){
        isValid = true;
      }
    })
    return isValid;
}
});

/************************** ANTENNA GAIN FILTERS *******************************************/

allFilters.set('antennaGain<', (compareVal : any) => {
return (val : any) => {
  if(val.type === 'relay'){
    return false;
  }
    if(compareVal == null || compareVal === ""){
      return true;
    }
    let antennaGain = compareVal;
    let isValid = false;
    if (antennaGain == '') {
      return true;
    }
    if((antennaGain) == null) {
    return false;
    }
    val.antennaGain.split(',').forEach(value => {
      if((value) != null && Number(value) < Number(antennaGain)){
        isValid = true;
      }
    })
    return isValid;
}
});

allFilters.set('antennaGain>', (compareVal : any) => {
return (val : any) => {
  if(val.type === 'relay'){
    return false;
  }
    if(compareVal == null || compareVal === ""){
      return true;
    }
    let antennaGain = compareVal;
    let isValid = false;
    if (antennaGain == '') {
      return true;
    }
    if((antennaGain) == null) {
    return false;
    }
    val.antennaGain.split(',').forEach(value => {
      if((value) != null && Number(value) > Number(antennaGain)){
        isValid = true;
      }
    })
    return isValid;
}
});

allFilters.set('antennaGain<=', (compareVal : any) => {
return (val : any) => {
  if(val.type === 'relay'){
    return false;
  }
    if(compareVal == null || compareVal === ""){
      return true;
    }
    let antennaGain = compareVal;
    let isValid = false;
    if (antennaGain == '') {
      return true;
    }
    if((antennaGain) == null) {
    return false;
    }
    val.antennaGain.split(',').forEach(value => {
      if((value) != null && Number(value) <= Number(antennaGain)){
        isValid = true;
      }
    })
    return isValid;
}
});

allFilters.set('antennaGain>=', (compareVal : any) => {
return (val : any) => {
  if(val.type === 'relay'){
    return false;
  }
    if(compareVal == null || compareVal === ""){
      return true;
    }
    let antennaGain = compareVal;
    let isValid = false;
    if (antennaGain == '') {
      return true;
    }
    if((antennaGain) == null) {
    return false;
    }
    val.antennaGain.split(',').forEach(value => {
      if((value) != null && Number(value) >= Number(antennaGain)){
        isValid = true;
      }
    })
    return isValid;
}
});

allFilters.set('antennaGain=', (compareVal : any) => {
return (val : any) => {
  if(val.type === 'relay'){
    return false;
  }
    if(compareVal == null || compareVal === ""){
      return true;
    }
    let antennaGain = compareVal;
    let isValid = false;
    if (antennaGain == '') {
      return true;
    }
    // console.log("year: " + year + " and val " + val.year);
    if((antennaGain) == null) {
    return false;
    }
    val.antennaGain.split(',').forEach(value => {
      if((value) != null && Number(value) == Number(antennaGain)){
        isValid = true;
      }
    })
    return isValid;
}
});

/************************** G/T FILTERS *******************************************/

allFilters.set('GT<', (compareVal : any) => {
  return (val : any) => {
    if(val.type === 'relay'){
      return false;
    }
      if(compareVal == null || compareVal === ""){
        return true;
      }
      let gt = compareVal;
      let isValid = false;
      if (gt == '') {
        return true;
      }
      if((gt) == null) {
      return false;
      }
      val.gtValues.split(',').forEach(value => {
        if((value) != null && Number(value) < Number(gt)){
          isValid = true;
        }
      })
      return isValid;
    }
});

allFilters.set('GT>', (compareVal : any) => {
  return (val : any) => {
    if(val.type === 'relay'){
      return false;
    }
      if(compareVal == null || compareVal === ""){
        return true;
      }
      let gt = compareVal;
      let isValid = false;
      if (gt == '') {
        return true;
      }
      if((gt) == null) {
      return false;
      }
      val.gtValues.split(',').forEach(value => {
        if((value) != null && Number(value) > Number(gt)){
          isValid = true;
        }
      })
      return isValid;
    }
});

allFilters.set('GT<=', (compareVal : any) => {
  return (val : any) => {
    if(val.type === 'relay'){
      return false;
    }
      if(compareVal == null || compareVal === ""){
        return true;
      }
      let gt = compareVal;
      let isValid = false;
      if (gt == '') {
        return true;
      }
      if((gt) == null) {
      return false;
      }
      val.gtValues.split(',').forEach(value => {
        if((value) != null && Number(value) <= Number(gt)){
          isValid = true;
        }
      })
      return isValid;
    }
});

allFilters.set('GT>=', (compareVal : any) => {
  return (val : any) => {
    if(val.type === 'relay'){
      return false;
    }
      if(compareVal == null || compareVal === ""){
        return true;
      }
      let gt = compareVal;
      let isValid = false;
      if (gt == '') {
        return true;
      }
      if((gt) == null) {
      return false;
      }
      val.gtValues.split(',').forEach(value => {
        if((value) != null && Number(value) >= Number(gt)){
          isValid = true;
        }
      })
      return isValid;
    }
});

allFilters.set('GT=', (compareVal : any) => {
  return (val : any) => {
    if(val.type === 'relay'){
      return false;
    }
      if(compareVal == null || compareVal === ""){
        return true;
      }
      let gt = compareVal;
      let isValid = false;
      if (gt == '') {
        return true;
      }
      // console.log("year: " + year + " and val " + val.year);
      if((gt) == null) {
      return false;
      }
      val.gtValues.split(',').forEach(value => {
        if((value) != null && Number(value) == Number(gt)){
          isValid = true;
        }
      })
      return isValid;
    }
});