/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useState, useEffect } from 'react';
import { useDispatch } from 'src/store';
import {
  updateResults,
  updateModCodOptions,
  updateFrequencyBandOptions,
  updateAntennaOptions
} from 'src/slices/results';
import clsx from 'clsx';
import DataGrid, { Column } from 'devextreme-react/data-grid';
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.material.blue.light.compact.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { colors, makeStyles, useTheme } from '@material-ui/core';
import axios from 'src/utils/axios';
import type { Relay, Dte, System, Station } from 'src/types/system';
import { RelayDetails, DteDetails } from 'src/components/Details';
import type { ICollapsed, State } from 'src/pages/home';
import type { ModCodOption } from 'src/types/evaluation';
import SelectionAlert from './SelectionAlert';
import type { ISave, NetworkFilters } from 'src/types/preference';
import { NetworkFilterModal } from 'src/components/Modals';
import { exploreImages as images } from 'src/utils/assets';
import { FREQ_FILTERING_OPTIONS as Options } from 'src/utils/constants/network-library';
import { useSelector } from 'src/store';
import AddSystem from './AddSystem';
import type { Theme } from 'src/theme';
import { SearchOption } from 'src/types/details';
import { Filter, Filterer } from 'src/utils/filterer';
import { THEMES } from 'src/utils/constants/general';
import { NoEncryption } from '@material-ui/icons';

interface NetworkLibraryProps {
  state: State;
  cache: ISave;
  visible: boolean;
  isCollapsed: ICollapsed;
  onState: (name: string, value: any) => void;
  onBounds: (name: string, type: string, value: number) => void;
  setNetworks: (network: string[]) => void;
  resultsCollapsed: boolean;
}

export interface IOptions {
  freqBands: string[];
  location: string[];
}

interface Panel {
  dte: number | null;
  relay: number | null;
}

const initialPanel: Panel = {
  dte: null,
  relay: null
};

const initialFilters: NetworkFilters = {
  name: [],
  type: 'none',
  operationalYear: '',
  supportedFrequencies: 'none',
  location: 'none',
  scanAgreement: 'none'
};

const initialOptions: IOptions = {
  freqBands: [],
  location: []
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  hide: {
    display: 'none'
  },
  table: {
    userSelect: 'none',
    MozUserSelect: 'none',
    WebkitUserSelect: 'none',
    msUserSelect: 'none',
    '& .dx-datagrid': {
      backgroundColor: theme.name == THEMES.DARK ? theme.palette.background.dark : theme.palette.background.default,
      color: theme.palette.text.primary,
    },
    '& .dx-datagrid-rowsview .dx-row': {
      borderTop: theme.name === THEMES.DARK ? `1px double ${theme.palette.border.main}` : ``,
      borderBottom: theme.name === THEMES.DARK ? `1px double ${theme.palette.border.main}` : ``
    },
    '& .dx-datagrid-headers .dx-header-row': {
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.primary,
      borderBottom: theme.name === THEMES.DARK ? `1px double ${theme.palette.border.main}` : ``
    },
    '& .dx-datagrid-headers .dx-datagrid-table .dx-row>td .dx-sort-indicator': {
      color: theme.palette.text.primary,
      borderBottom: theme.name === THEMES.DARK ? `1px double ${theme.palette.border.main}` : ``
    },
    '& .dx-datagrid-headers .dx-datagrid-table .dx-row>td .dx-sort': {
      color: theme.palette.text.primary,
      borderBottom: theme.name === THEMES.DARK ? `1px double ${theme.palette.border.main}` : ``
    },
    '& .dx-data-row.dx-state-hover:not(.dx-selection):not(.dx-row-inserted):not(.dx-row-removed):not(.dx-edit-row):not(.dx-row-docused) > td': {
      color: theme.palette.text.secondary,
    }
  },
  image: {
    borderRadius: '1px',
    width: '75%'
  },
  relay: {
    borderRadius: '1px',
    width: '75%'
  },
  bold: {
    fontWeight: 'bolder',
  },
  header: {
    color: theme.palette.text.primary,
    "&:hover": {
      color: theme.palette.primary.main
    },
  }
}));

const NetworkLibrary: FC<NetworkLibraryProps> = ({
  state,
  cache,
  isCollapsed,
  visible,
  onState,
  onBounds,
  setNetworks,
  resultsCollapsed
}) => {
  const classes = useStyles();
  const theme = useTheme<Theme>();
  const [open, setOpen] = useState<boolean>(false);
  const [results, setResults] = useState<any[]>();
  const [source, setSource] = useState<any[]>();
  const [panel, setPanel] = useState<Panel>(initialPanel);
  const [checked, setChecked] = useState<number[]>([]);
  const [selectedDTEs, setSelectedDTEs] = useState<string[]>([]);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ title: '', message: '' });
  const [filters, setFilters] = useState<NetworkFilters>(initialFilters);
  const [filterSource, setFilterSource] = useState<SearchOption[]>([]);
  const [options, setOptions] = useState<IOptions>(initialOptions);
  const { isAdmin, isEngineer } = useSelector((state) => state.user);
  const [newSystem, setNewSystem] = useState<boolean>(false);
  const [myFilterer, setMyFilterer] = useState<Filterer>(new Filterer([]));
  const dispatch = useDispatch();

  const fetchData = async () => {
    Promise.all([
      await axios.get<Relay[]>('/requestExploreDashboard'),
      await axios.get<Dte[]>('/requestDTEDashboard')
    ]).then((responses) => {
      let data: System[] = [];
      let temp: IOptions = initialOptions;

      responses.forEach((response) => {
        response.data.forEach((system) => {
          const picture = images.find(
            (image) =>
              image.default.split('.')[0].split('/')[3].toLowerCase() ===
              system.system.toLowerCase()
          );
          if (Object.keys(system).includes('total_satellites')) {
            const freqBands = Options.find(
              (item) =>
                parseInt(item.value.split('/')[0]) <=
                  parseInt(system.ssl_return_link_freq) &&
                parseInt(system.ssl_return_link_freq) <=
                  parseInt(item.value.split('/')[1])
            );
            const entry = {
              id: system.id,
              system: system.system,
              type: 'relay',
              year: system.ioc_year,
              location: 'Global',
              freqBands: freqBands?.band,
              sglEirp: system.sgl_relay_eirp_dbw,
              sglGt: system.sgl_relay_g_t_db_k,
              sslEirp: system.ssl_relay_eirp_dbw,
              sslGt: system.ssl_relay_g_t_db_k,
              minFrequency: system.minFreq,
              maxFrequency: system.maxFreq,
              scanAgreement: system.relay_scan_agreement == "1" ? true:false,
              picture: picture
                ? picture.default
                : '/static/icons/Satellite_Icon-Networks_Menu-DarkMode-SVG.svg',
              versions: system.versions,
              altitude: parseFloat(system.altitude),
              relayType: system.relay_type
            };
            //@ts-ignore
            data.push(entry);
          } else {
            system['type'] = 'dte';
            system['picture'] = picture
              ? picture.default
              : '/static/icons/Ground_Station_Group_Icon-SVG.svg';
            data.push(system);
          }
        });

        data.forEach((item) => {
          Object.keys(temp).forEach((key) => {
            let values = item[key]?.split(', ');
            values?.forEach((el) => {
              !temp[key].includes(el) && temp[key].push(el);
            });
          });
        });
      });
      
      setSource(data);
      setResults(data);
      setOptions(temp);
    });
  };

  // //update filters based on change to data 
  useEffect(() => {

    let newFilter = new Filterer(source);
    let filters : Map<string,Filter> = myFilterer.getFilters();
    filters.forEach((filterFunc, filterName) => {
      newFilter.addFilter(filterName, filterFunc);
    });
    setMyFilterer(newFilter);

  }, [source]);

  // Returns all ground stations associated with a particular DTE network. 
  const fetchStations = async (networkId: number) => {
    const params = { networkId };
    const response = await axios.post<Station[]>('/getGroundStations', params);
    return response.data ?? [];
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let selected: string[] = [];
    checked.forEach((selection) => {
      let currVal: System[] = results.filter(
        (entry: System) => entry.id === selection && entry.type === 'dte'
      );
      if (currVal.length > 0) {
        selected = selected.concat(currVal[0].system);
      }
    });
    setSelectedDTEs(selected);
  }, [checked]);

  useEffect(() => {
    setNetworks(selectedDTEs);
  }, [selectedDTEs]);

  // useEffect(() => {
  //   if (!source) return;

  //   const data = source
  //     .filter((item) =>
  //       filters.name !== ''
  //         ? item.system.toLowerCase().includes(filters.name.toLowerCase())
  //         : true
  //     )
  //     .filter((item) =>
  //       filters.operationalYear !== 0 && filters.operationalYear
  //         ? item.year <= filters.operationalYear
  //         : true
  //     )
  //     .filter((item) =>
  //       filters.type !== 'none' && filters.type !== ''
  //         ? item.type === filters.type
  //         : true
  //     )
  //     .filter((item) =>
  //       filters.location !== 'none' && filters.location !== ''
  //         ? item.location.split(', ').includes(filters.location)
  //         : true
  //     )
  //     .filter((item) =>
  //       filters.supportedFrequencies !== 'none' &&
  //       filters.supportedFrequencies !== ''
  //         ? item.freqBands.split(', ').includes(filters.supportedFrequencies)
  //         : true
  //     );
  //   setResults(data);
  // }, [filters, source]);

  const handleDbClick = (event): void => {
    event?.data.type === 'relay' && handlePanel('relay', event.data.id);
    event?.data.type === 'dte' && handlePanel('dte', event.data.id);
  };

  const handleClick = (event) => {
    if (event.event.ctrlKey) {
      // checked.includes(event.data.id)
        /*?*/ setChecked(checked.filter((item) => item !== event.data.id));
      //   : setChecked((prevState) => [...prevState, event.data.id]);
    } else {
      setChecked([event.data.id]);
    }
  };

  const handleRemove = async (e): Promise<void> => {
    await axios.post('/deleteSystem', { systemName: e.key.system });
  };

  const handlePanel = (name, value): void => {
    setPanel((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleContext = async (value) => {
    // Do not allow combinations of relays and DTEs in the selection list. 
    if (
      (state.networkType === 'dte' && value.type === 'relay') ||
      (state.networkType === 'relay' && value.type === 'dte')
    ) {
      setAlertMessage({
        title: `Invalid Selection`,
        message: 'You cannot combine DTEs and relay networks at this time.'
      });
      setIsAlertOpen(true);
      return;
    }

    // Only allow one relay to be selected at a time. 
    if (value.type === 'relay' && state.selectedItems.length > 0) {
      setAlertMessage({
        title: `Invalid Selection`,
        message: 'You can only select one relay network at a time.'
      });
      setIsAlertOpen(true);
      return;
    }

    // Do not allow a DTE to be selected if the mission type is terrestrial. 
    if (value.type === 'dte' && !state.parameters.isOrbital) {
      setAlertMessage({
        title: `Invalid Selection`,
        message: 'A DTE network cannot service a terrestrial user. Please select a relay network or update your mission parameters.'
      });
      setIsAlertOpen(true);
      return;
    }

    // Currently, ground station modeled data points only extend up
    // to 1000 km. If the user selects a DTE while the user altitude 
    // is greater than 1000 km, notify the user of the modeling limitation. 
    if (value.type === 'dte' && state.parameters.altitude > 1000) {
      setAlertMessage({
        title: `Warning`,
        message: `Currently, modeled data points for ground stations only extend up to 1000 km. For accurate results, decrease the altitude of your satellite, or download our STK models for these ground stations, and run an analysis for your user.`
      });
      setIsAlertOpen(true);
      // Do not return! This is a valid selection, we just want to warn the user. 
    }

    // Do not allow a relay to be selected if the altitude of the 
    // constellation is less than or equal to the altitude of the 
    // user satellite. 
    if (value.type === 'relay' && state.parameters.altitude >= value.altitude) {
      setAlertMessage({
        title: `Invalid Selection`,
        message: `The relay altitude of ${value.altitude} km must be greater than the altitude of the user satellite. Please choose a different network, or decrease the altitude of your satellite.`
      });
      setIsAlertOpen(true);
      return;
    }

    if (value.type === 'relay') {
      // Set the max altitude to 1 km below the relay altitude. 
      onBounds('altitude', 'max', value.altitude - 1);
    } else {
      // For DTEs, set the max altitude to 1000 km. Modeled data points 
      // currently only extend up to 1000 km, and attempting predictions 
      // beyond this point may lead to inaccurate results. 
      onBounds('altitude', 'max', 1000);
    }

    // Set the network type. 
    !state.networkType && onState('networkType', value.type);

    // Clear results returned from last API call. 
    onState('isDataLoaded', false);
    dispatch(updateResults());

    // If the selected item is a relay, add it to the 
    // selection list. But if the item is a DTE network,
    // query the database for its associated ground 
    // stations and add those to the list instead. 
    if (value.type === 'relay') {
      // Query the database for all modulation and coding
      // options associated with the relay. 
      const response = await axios.get<{ modCodOptions: ModCodOption[] }>('/getModCodOptions', {
        params: {
          id: value.id,
          networkType: 'relay',
          antennaId: 0, // Only relevant for ground stations
          frequencyBandId: 0 // Only relevant for ground stations
        }
      });
      dispatch(updateModCodOptions(value.id, response.data.modCodOptions));

      // Update the items in the selection list. 
      value = {
        ...value,
        name: value.system
      };
      onState('selectedItems', [...state.selectedItems, value]);
    } else {
      fetchStations(value.id).then(async res => {
        const newRes = [];
        await Promise.all(res.map(async station => {
          // Set frequency band, antenna, and mod/cod options. 
          const response = await axios.get<any>('/getModCodOptions', {
            params: {
              id: station.id,
              networkType: 'dte',
              antennaId: 0, // Only relevant for ground stations
              frequencyBandId: 0 // Only relevant for ground stations
            }
          });
          dispatch(updateFrequencyBandOptions(station.id, response.data.frequencyBandOptions));
          dispatch(updateAntennaOptions(station.id, response.data.antennaOptions));
          dispatch(updateModCodOptions(station.id, response.data.modCodOptions));

          // Update the items in the selection list. 
          let newStation: any = { ...station };
          newStation = {
            ...newStation,
            antennaId: response.data.selectedAntennaId,
            antennaName: response.data.selectedAntennaName,
          };
          newRes.push(newStation);
        }));

        onState('selectedItems', [...state.selectedItems, ...newRes]);
      });
    }

    onState('isLastSave', false);
    onState('isMarkedForComparison', false);
    onState('isLastAnalysis', false);
  };

  const handleOpen = () => setOpen(!open);


  const handleFilterChange = (): void => {
    let l : any [] = myFilterer.getFilteredList();
    setResults(l);
  };

  const handleCellClick = (event) => event.columnIndex === 6 && handleOpen();

  const addNetwork = () => {
    setNewSystem(true);
  }

  const deleteNetwork = async (event) => {
    let result: boolean = window.confirm(`------- WARNING! -------- Are you sure you want to remove ${event.data['system']}? This will remove the network for all users of CoSMOS!`);
    if(result){
      await axios.post('/deleteSystem', { systemName: event.key.system });
      fetchData();
    }
  }

  const handleclear = (): void => {
    myFilterer.clearFilters();
    setFilters({name : [], type: 'none', operationalYear: '', supportedFrequencies: 'none', location: 'none', scanAgreement: 'none' });
    handleFilterChange();
    setFilterSource([]);
  };


  return (
    <div data-filter-grid="true" className={visible ? classes.root : classes.hide}>
      <AddSystem isSystem={newSystem} onIsSystem={()=>setNewSystem(!newSystem)} onReload={fetchData}/>
      <DataGrid
        className={classes.table}
        style={{ maxHeight: isCollapsed === 'up' ? '88.7vh' : '33vh'  }}
        dataSource={results}
        showBorders={false}
        showRowLines={true}
        hoverStateEnabled={true}
        scrolling={{ mode: 'infinite' }}
        onRowClick={handleClick}
        onCellClick={handleCellClick}
        onCellDblClick={handleDbClick}
        onRowRemoved={handleRemove}
        wordWrapEnabled={true}
        onRowPrepared={(event) => {
          if (event.rowType === 'data' && checked.includes(event.data.id))
            event.rowElement.style['background'] = colors.blue[200];
        }}
        onContextMenuPreparing={(e) => {
          if (e.row.data) {
            if(isEngineer){
              e.items = [
                {
                  text: 'Select',
                  onClick: () => handleContext(e.row.data)
                },
                {
                  text: 'View Network Details',
                  onClick: () => handleDbClick(e.row)
                },
                {
                  text: '--------- ADMIN ACTIONS ----------',
                },
                {
                  text: 'Add New Network',
                  onClick: () => addNetwork()
                },
                {
                  text: `Delete ${e.row?.data['system'] ?? 'Network'}`,
                  onClick: () => deleteNetwork(e.row)
                }
              ];
            }else{
              e.items = [
                {
                  text: 'Select',
                  onClick: () => handleContext(e.row.data)
                },
                {
                  text: 'View Network Details',
                  onClick: () => handleDbClick(e.row)
                }
              ];
            }
          } else {
            e.items = [];
          }
        }}
      >
        <Column
          dataField="picture"
          caption=""
          width={resultsCollapsed?"5%":"7%"}
          allowSorting={false}
          cellRender={(data) => (
            <img
              src={data.value}
              alt="system"
              className={clsx(
                classes.image,
                data.key.type === 'relay' && classes.relay
              )}
            />
          )}
          alignment="center"
        />
        <Column
          dataField="system"
          alignment="left"
          allowSearch={false}
          width="15%"
          cellRender={(data) => <div className={classes.bold}>{data.text}</div>}
          headerCellRender={(data) => <div className={classes.header}>{data.column.caption}</div>}
        />
        <Column
          dataField="type"
          caption="Type"
          alignment="center"
          width="14%"
          headerCellRender={(data) => <div className={classes.header}>{data.column.caption}</div>}
        />
        <Column
          dataField="year"
          caption="Operational Year"
          alignment="center"
          width="18%"
          headerCellRender={(data) => <div className={classes.header}>{data.column.caption}</div>}
        />
        <Column
          dataField="freqBands"
          caption="Supported Frequencies"
          alignment="center"
          width="20%"
          headerCellRender={(data) => <div className={classes.header}>{data.column.caption}</div>}
        />
        <Column
          dataField="location"
          caption="Location"
          alignment="center"
          width="20%"
          headerCellRender={(data) => <div className={classes.header}>{data.column.caption}</div>}
        />
        <Column
          alignment="center"
          width="5%"
          headerCellRender={() => (
            <div data-filter={true} style={{padding:0,margin:0}}>
            <FontAwesomeIcon
              icon={faFilter}
              style={{
                color: theme.palette.primary.main
              }}
            /></div>
          )}
        />
      </DataGrid>
      {panel.relay && (
        <RelayDetails
          id={panel.relay}
          onClose={() => handlePanel('relay', null)}
        />
      )}
      {panel.dte && (
        <DteDetails id={panel.dte} onClose={() => handlePanel('dte', null)} />
      )}
      {isAlertOpen && (
        <SelectionAlert 
          isOpen={isAlertOpen}
          onOpen={() => setIsAlertOpen(!isAlertOpen)}
          message={alertMessage}
        />
      )}
      <NetworkFilterModal
        open={open}
        filterer={myFilterer}
        filters={filters}
        onOpen={handleOpen}
        onClear={handleclear}
        source = {filterSource}
        onFilterChange={handleFilterChange}
        setSource = {setFilterSource}
        state = {state}
      />
    </div>
  );
};

export default NetworkLibrary;
