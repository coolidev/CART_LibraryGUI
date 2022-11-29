import { FC, useEffect, useState } from 'react';
import {
  Grid,
  Box,
  Button,
  TextField,
  Typography,
  makeStyles,
  useTheme,
  FormControl,
  MenuItem,
  Select,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tooltip,
  IconButton,
  Icon
} from '@material-ui/core';
import type { Parameter } from 'src/types/preference';
import CustomNumberFormat from 'src/components/CustomNumberFormat';
import type { Theme } from 'src/theme';
import { THEMES } from 'src/utils/constants/general';
import { EARTH_RADIUS_km } from 'src/utils/constants/physical';
import { useDispatch, useSelector } from 'src/store';
import { Transition } from 'react-spring';
import { number } from 'yup';
import AnalysisSelection from 'src/pages/home/Results/AnalysisSelection';
import axios from 'axios';
import { State } from 'src/pages/home';
import { PerformancePanel, RelayCharacteristics } from 'src/types/evaluation';
import { getValue } from 'src/algorithms/regressions';
import { updateResults } from 'src/slices/results';
import {TooltipList} from 'src/utils/constants/tooltips'

interface ParametersProps {
  state: State;
  parameters: Parameter;
  networkType: string;
  noRegression: boolean;
  bounds: { [key: string]: { min: number; max: number } };
  onChange: (values: {
    name: string;
    value: number | boolean;
    category: string;
  }) => void;
  onState: (name: string, value: any) => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    marginTop: theme.spacing(2)
  },
  box: {
    border: `1px solid ${theme.palette.border.main}`,
    borderRadius: 6
  },
  tabs: {
    minHeight: theme.spacing(4)
  },
  tab: {
    border: '1px solid #000',
    minHeight: theme.spacing(4),
    padding: 0
  },
  indicator: {
    backgroundColor: 'transparent'
  },
  selected: {
    backgroundColor: '#1565c0'
  },
  grid: {
    marginTop: theme.spacing(3)
  },
  tab1: {
    borderTopLeftRadius: theme.spacing(3),
    borderBottomLeftRadius: theme.spacing(3)
  },
  tab2: {
    borderTopRightRadius: theme.spacing(3),
    borderBottomRightRadius: theme.spacing(3)
  },
  textfield: {
    [`& fieldset`]: {
      borderRadius: 6,
      border: '1px solid black'
    },
    '& .MuiOutlinedInput-root': {
      background: '#fff'
    }
  },
  input: {
    textAlign: 'center',
    borderRadius: 6,
    border: `1px solid ${theme.palette.border.main}`,
    backgroundColor: theme.palette.component.main
  },
  select: {
    padding: 0,
    //boxShadow: theme.name == THEMES.DARK? '' :'3px 3px 7px #c0c0c0', --To be added back when we make shadows everywhere
    borderRadius: '4px',
    border: `solid 1px ${theme.palette.border.main}`,
    color: `${theme.palette.text.primary} !important`,
    '& .MuiSelect-iconOutlined': {
      color: theme.palette.border.main
    }
  },
}));

const Parameters: FC<ParametersProps> = ({
  state,
  parameters,
  networkType,
  noRegression,
  bounds,
  onChange,
  onState,
}) => {
  const classes = useStyles();
  const theme = useTheme<Theme>();
  const [currentTab, setCurrentTab] = useState<string>('orbital');
  const [currentSelection, setCurrentSelection] = useState<number>(parameters?.orbitState ?? (parameters?.eccentricity > 0? 1:0));
  const [semiMajorAxis, setSemiMajorAxis] = useState<number>(parameters.altitude + EARTH_RADIUS_km);
  const [valueNotThere, setValueNotThere] = useState<boolean>(false);
  const [prevValue, setPrevValue] = useState<{name: string, value: string}>(null)
  const [newValue, setNewValue] = useState<{name: string, value: string}>(null)
  const { performancePanel } = useSelector((state) => state.results);
  const [askSinglePoint, setAskSinglePoint] = useState<boolean>(false);
  const [data, setData] = useState<PerformancePanel>(null);
  const [analysisDone, setAnalysisDone] = useState<boolean>(false);
  const [analysisType, setAnalysisType] = useState<string>('no-point');
  const [pointExist, setPointExist] = useState<boolean>(false);
  const [metricType, setMetricType] = useState<string>();
  const [noRegressionHere, setNoRegressionHere] = useState<boolean>(false);
  const dispatch = useDispatch();


  useEffect(() => {
    setSemiMajorAxis(parameters.altitude + EARTH_RADIUS_km);
  },[parameters.altitude]);

  useEffect(() => {
    onChange({ name: 'orbitState', value: currentSelection, category: 'parameters' });
    if(currentSelection === 0){
        onChange({ name: 'eccentricity', value: 0, category: 'parameters' });
        // onChange({ name: 'argumentOfPerigee', value: 0, category: 'parameters' });
        // onChange({ name: 'trueAnomaly', value: 0, category: 'parameters' });
    }
  },[currentSelection]);

  useEffect(() => {
    if(parameters.orbitState !== currentSelection){
      setCurrentSelection(parameters.orbitState ?? 0);
    }
  },[parameters.orbitState]);

  useEffect(() => {
    if (!parameters) return;

    const tab = parameters?.isOrbital ? 'orbital' : 'terrestrial';
    setCurrentTab(tab);

  }, [parameters]);

  useEffect(() => {
    if(state.networkType == 'relay'){
      setMetricType('coverage');
    } else {
      setMetricType('coverageMinutes');
    }   
  }, [state.networkType])


  const handleClick = (event): void => {
    const { name, value } = event.target;
    //if we dont have a regression to display
    if(noRegression){
      if(name === 'semiMajorAxis' || name === 'altitude' || name === 'inclination'){
        //If the point already exists in the dataset, just change the point normaly
        if(pointExists(performancePanel, value, name) && prevValue == null){
          if(name === 'semiMajorAxis'){
            onChange({ name: 'altitude', value: parseInt(value.replace(',','')) - EARTH_RADIUS_km, category: 'parameters' });
          }else{
            onChange({ name, value: value, category: 'parameters' });
          }
        } else {
          //we want to save the previous Value to set the display back if it is null
          if(prevValue == null){
            if(name === 'semiMajorAxis'){
              let altitude = 'altitude';
              setPrevValue({name: name, value: (parseInt(parameters[altitude]) + EARTH_RADIUS_km).toString()});
            }else{
              setPrevValue({name: name, value: parameters[name]});
            }
            if(name === 'semiMajorAxis'){
              onChange({ name: 'altitude', value: parseInt(value.replace(',','')) - EARTH_RADIUS_km, category: 'parameters' });
            }else{
              onChange({ name, value: value, category: 'parameters' });
            }
            setNewValue({name: name, value: value});
            setValueNotThere(true);
          } else {
            if(name === 'semiMajorAxis'){
              onChange({ name: 'altitude', value: parseInt(newValue.value.replace(',','')) - EARTH_RADIUS_km, category: 'parameters' });
            }else{
              onChange({ name: newValue.name, value: parseInt(newValue.value.replace(',','')), category: 'parameters' });
            }
          }
        }
      }
      //normal behavior
    } else {
      if(name === 'semiMajorAxis'){
        onChange({ name: 'altitude', value: parseInt(value.replace(',','')) - EARTH_RADIUS_km, category: 'parameters' });
      }else{
        onChange({ name, value: value, category: 'parameters' });
      }
    }
  };

  const pointExists = (data, value, name) => {
    let metricType = networkType == 'relay'? 'coverage': 'coverageMinutes';
    if(data){
      if(name === 'altitude'){
        return(data.modelData.orbital[metricType].points.filter(point => point.altitude == value).length !== 0);
      }
      else if(name === 'semiMajorAxis'){
        return(data.modelData.orbital[metricType].points.filter(point => point.altitude == (parseInt(value.replace(',','')) - EARTH_RADIUS_km)).length !== 0);
      } 
      else if (name === 'inclination'){
        return(data.modelData.orbital[metricType].points.filter(point => point.inclination == value).length !== 0);
      }
      else {
        return (true) ;
      }
    } else {
      return(false);
    }
  }
  const handleCurrentTab = (event): void => {
    const { name } = event.currentTarget;
    onChange({
      name: 'isOrbital',
      value: name === 'orbital',
      category: 'parameters'
    });
    setCurrentTab(name);
  };

  const handleClose = () => {
    if(prevValue.name === 'semiMajorAxis'){
      onChange({ name: 'altitude', value: parseInt(prevValue.value.replace(',','')) - EARTH_RADIUS_km, category: 'parameters' });
    }else{
      onChange({ name: prevValue.name, value: parseInt(prevValue.value), category: 'parameters' });
    }
    setPrevValue(null);
    setNewValue(null);
    setValueNotThere(false);
  }

  const handleResetAnalysis = () => {
    setAskSinglePoint(true);
    setValueNotThere(false);
  }
  /* This is the function that controls what is displayed when a selection is made on the dropdown under the orbital section.
  Its like this to prevent having to do messy binairy checks in the actual React/HTML part of the code. If we want to add another state to the panel, do it here.
  Note that this is controlled by the currentSelection variable.*/
  const renderParameterPanel = () => {
    let panel
    if(currentSelection === 0){
      panel = (<Grid container justify="center" alignItems="center" spacing={2}>
        <Grid item sm= {12} />
        <Grid item md= {6}>
          <Tooltip title=  {TooltipList.altitude}>
            <Typography variant="body1" component="p" color="textPrimary">
              {'Altitude (km)'}
            </Typography>
          </Tooltip>
        </Grid>
        <Grid item md= {5}>
          <TextField
            name= 'altitude'
            value= {parameters.altitude}
            onBlur= {handleClick}
            InputProps= {{
              inputComponent: CustomNumberFormat,
              disableUnderline: true,
              inputProps: {
                className: classes.input,
                min: bounds['altitude'].min,
                max: bounds['altitude'].max
              }
            }}
            onKeyPress= {(ev) => {
              if (ev.key === 'Enter') {
                handleClick(ev);
              }
            }}
            fullWidth
          />
        </Grid>
        <Grid item md={6}>
          <Tooltip title=  {TooltipList.inclination}>
            <Typography variant="body1" component="p" color="textPrimary">
              {'Inclination (deg)  '}
            </Typography>
          </Tooltip>
        </Grid>
        <Grid item md={5}>
          <TextField
            name= {'inclination'}
            value= {parameters.inclination}
            onBlur= {handleClick}
            InputProps= {{
              inputComponent: CustomNumberFormat,
              disableUnderline: true,
              inputProps: {
                className: classes.input,
                min: bounds['inclination'].min,
                max: bounds['inclination'].max
              }
            }}
            onKeyPress= {(ev) => {
              if (ev.key === 'Enter') {
                handleClick(ev);
              }
            }}
            fullWidth
          />
        </Grid>
        <Grid item md= {6}>
          <Tooltip title=  {TooltipList.RAAN}>
            <Typography variant="body1" component="p" color="textPrimary">
              {'RAAN'}
            </Typography>
          </Tooltip>
        </Grid>
        <Grid item md= {5}>
          <TextField
            name= {'raan'}
            value= {parameters.raan}
            onBlur= {handleClick}
            InputProps= {{
              inputComponent: CustomNumberFormat,
              disableUnderline: true,
              inputProps: {
                className: classes.input,
                min: 0,
                max: 359
              }
            }}
            onKeyPress= {(ev) => {
              if (ev.key === 'Enter') {
                handleClick(ev);
              }
            }}
            fullWidth
          />
        </Grid>
        <Grid item sm= {12} />
      </Grid>)
    } else if(currentSelection === 1){
      panel = (<Grid container justify="center" alignItems="center" spacing={2}>
        <Grid item sm= {12} />
        <Grid item md= {6}>
        <Tooltip title= {TooltipList.semiMajorAxis}>
            <Typography variant="body1" component="p" color="textPrimary">
              {'Semimajor Axis (km)'}
            </Typography>
          </Tooltip>
        </Grid>
        <Grid item md= {5}>
          <TextField
            name= 'semiMajorAxis'
            value= {semiMajorAxis}
            onBlur= {handleClick}
            InputProps= {{
              inputComponent: CustomNumberFormat,
              disableUnderline: true,
              //maybe ask about these min and max values
              inputProps: {
                className: classes.input,
                min: bounds['semiMajorAxis'].min,
                max: bounds['semiMajorAxis'].max
              }
            }}
            onKeyPress= {(ev) => {
              if (ev.key === 'Enter') {
                handleClick(ev);
              }
            }}
            fullWidth
          />
        </Grid>
        <Grid item md={6}>
        <Tooltip title= {TooltipList.eccentricity}>
            <Typography variant="body1" component="p" color="textPrimary">
              {'Eccentricity'}
            </Typography>
          </Tooltip>
        </Grid>
        <Grid item md={5}>
          <TextField
            name= {'eccentricity'}
            value= {parameters.eccentricity}
            onBlur= {handleClick}
            InputProps= {{
              inputComponent: CustomNumberFormat,
              disableUnderline: true,
              inputProps: {
                className: classes.input,
                min: 0,
                max: 1
              }
            }}
            onKeyPress= {(ev) => {
              if (ev.key === 'Enter') {
                handleClick(ev);
              }
            }}
            fullWidth
          />
        </Grid>
        <Grid item md={6}>
        <Tooltip title= {TooltipList.inclination}>
            <Typography variant="body1" component="p" color="textPrimary">
              {'Inclination (deg)'}
            </Typography>
          </Tooltip>
        </Grid>
        <Grid item md={5}>
          <TextField
            name= {'inclination'}
            value= {parameters.inclination}
            onBlur= {handleClick}
            InputProps= {{
              inputComponent: CustomNumberFormat,
              disableUnderline: true,
              inputProps: {
                className: classes.input,
                min: bounds['inclination'].min,
                max: bounds['inclination'].max
              }
            }}
            onKeyPress= {(ev) => {
              if (ev.key === 'Enter') {
                handleClick(ev);
              }
            }}
            fullWidth
          />
        </Grid>
        <Grid item md= {6}>
        <Tooltip title= {TooltipList.argumentOfPerigee}>
            <Typography variant="body1" component="p" color="textPrimary" style = {{fontSize: '13px'}}>
              {'Argument of Perigee (deg)'}
            </Typography>
          </Tooltip>
        </Grid>
        <Grid item md= {5}>
          <TextField
            name= {'argumentOfPerigee'}
            value= {parameters.argumentOfPerigee}
            onBlur= {handleClick}
            InputProps= {{
              inputComponent: CustomNumberFormat,
              disableUnderline: true,
              inputProps: {
                className: classes.input,
                min: 0,
                max: 359
              }
            }}
            onKeyPress= {(ev) => {
              if (ev.key === 'Enter') {
                handleClick(ev);
              }
            }}
            fullWidth
          />
        </Grid>
        <Grid item md= {6}>
        <Tooltip title= {TooltipList.RAAN}>
            <Typography variant="body1" component="p" color="textPrimary">
              {'RAAN'}
            </Typography>
          </Tooltip>
        </Grid>
        <Grid item md= {5}>
          <TextField
            name= {'raan'}
            value= {parameters.raan}
            onBlur= {handleClick}
            InputProps= {{
              inputComponent: CustomNumberFormat,
              disableUnderline: true,
              inputProps: {
                className: classes.input,
                min: 0,
                max: 359
              }
            }}
            onKeyPress= {(ev) => {
              if (ev.key === 'Enter') {
                handleClick(ev);
              }
            }}
            fullWidth
          />
        </Grid>
        <Grid item md= {6}>
        <Tooltip title= {TooltipList.trueAnomaly}>
            <Typography variant="body1" component="p" color="textPrimary">
              {'True Anomaly (deg)'}
            </Typography>
          </Tooltip>
        </Grid>
        <Grid item md= {5}>
          <TextField
            name= {'trueAnomaly'}
            value= {parameters.trueAnomaly}
            onBlur= {handleClick}
            InputProps= {{
              inputComponent: CustomNumberFormat,
              disableUnderline: true,
              inputProps: {
                className: classes.input,
                min: 0,
                max: 359
              }
            }}
            onKeyPress= {(ev) => {
              if (ev.key === 'Enter') {
                handleClick(ev);
              }
            }}
            fullWidth
          />
        </Grid>
        <Grid item sm= {12} />
      </Grid>)
    }
    return panel;
  }

  return (
    <div className={classes.root}>
      <Box p={2} className={classes.box}>
        <Grid container justify="center" alignItems="center" spacing={2}>
          <Grid item md={6}>
            <Button
              name="orbital"
              variant={currentTab !== 'orbital' ? 'outlined' : 'contained'}
              color={currentTab === 'orbital' ? 'primary' : 'inherit'}
              style={{
                color:
                  theme.name === THEMES.LIGHT
                    ? currentTab !== 'orbital'
                      ? '#000'
                      : '#fff'
                    : theme.palette.text.primary
              }}
              className={classes.box}
              onClick={handleCurrentTab}
              size="small"
              fullWidth
            >
              Orbital
            </Button>
          </Grid>
          <Grid item md={6}>
            <Button
              name="terrestrial"
              variant= {currentTab !== 'terrestrial' ? 'outlined' : 'contained'}
              color= {currentTab === 'terrestrial' ? 'primary' : 'inherit'}
              className= {classes.box}
              onClick= {handleCurrentTab}
              style= {{
                color:
                  theme.name === THEMES.LIGHT
                    ? currentTab !== 'terrestrial'
                      ? '#000'
                      : '#fff'
                    : theme.palette.text.primary
              }}
              size= "small"
              fullWidth
              disabled= {networkType === 'dte'}
            >
              Terrestrial
            </Button>
          </Grid>
        </Grid>
        <Grid
          container
          justify="center"
          alignItems="center"
          spacing={2}
          className={classes.grid}
        >
        {currentTab === 'orbital' ?
        
        <Grid container justify="center" alignItems="center" spacing={2}>
          <Grid item md = {11}>
          <FormControl variant="filled" size="small" fullWidth>
          <Select
            className={classes.select}
                name="type"
                variant="outlined"
                data-filter-network="true"
                value={currentSelection}
                color="primary"
                onChange={(e) => {
                  const { value } = e.target;
                  setCurrentSelection(value as number);
                }}
              >
                <MenuItem value={0}>Circular</MenuItem>
                <MenuItem value={1}>Keplerian Elements</MenuItem>
              </Select>
              </FormControl>
            </Grid>
              <Grid item md = {12}>
                {renderParameterPanel()}
              </Grid>
            </Grid>:
        <Grid container justify="center" alignItems="center" spacing={2}>
          <Grid item sm= {12} />
          <Grid item md={6}>
            <Typography variant="body1" component="p" color="textPrimary">
              {'Latitude (deg)'}
            </Typography>
          </Grid>
          <Grid item md={5}>
            <TextField
              name= 'latitude'
              value= {parameters.latitude}
              onBlur={handleClick}
              InputProps={{
                inputComponent: CustomNumberFormat,
                disableUnderline: true,
                inputProps: {
                  className: classes.input,
                  min: bounds['latitude'].min,
                  max: bounds['latitude'].max
                }
              }}
              onKeyPress={(ev) => {
                if (ev.key === 'Enter') {
                  handleClick(ev);
                }
              }}
              fullWidth
            />
          </Grid>
          <Grid item md={6}>
            <Typography variant="body1" component="p" color="textPrimary">
              {'Longitude (deg)'}
            </Typography>
          </Grid>
          <Grid item md={5}>
            <TextField
              name={'longitude'}
              value={parameters.longitude}
              onBlur={handleClick}
              InputProps={{
                inputComponent: CustomNumberFormat,
                disableUnderline: true,
                inputProps: {
                  className: classes.input,
                  min: bounds['longitude'].min,
                  max: bounds['longitude'].max
                }
              }}
              onKeyPress={(ev) => {
                if (ev.key === 'Enter') {
                  handleClick(ev);
                }
              }}
              fullWidth
            />
          </Grid>
          <Grid item sm= {12} />
        </Grid>
        }
        </Grid>
      </Box>
      {valueNotThere && (<Dialog
      open={valueNotThere}
      keepMounted
      onClose={handleClose}
      >
      <DialogTitle style={{
            margin: 0,
            padding: '16px',
            backgroundColor:  theme.palette.primary.light
        }}>This Point has not been found</DialogTitle>
      <DialogContent style={{ backgroundColor: theme.palette.component.main }}>
        <DialogContentText>
          In order to see the values at this point, a new analysis will need to be run. If this is OK, press the OK button. To return to the current analysis, press the return button.
        </DialogContentText>
      </DialogContent>
      <DialogActions style={{ backgroundColor: theme.palette.component.main }}>
      <Button onClick={handleClose} color="primary">
          {`Return`}
        </Button>
        <Button onClick={handleResetAnalysis} color="primary">
          {`OK`}
        </Button>
      </DialogActions>
    </Dialog>
    )}
    {askSinglePoint && (
      <AnalysisSelection
          open = {askSinglePoint}
          onOpen = {async ()  => {
            let response;
            try{
              response = await axios.post<PerformancePanel>('/requestRFCoverage', {
                configuration: state
              });
            } catch {
              setAnalysisDone(true);
              setNoRegressionHere(true);
              return;
            }   
            setAnalysisDone(true);
            if(response.status === 200){
              setData(response.data);
              setNoRegressionHere(false);
            } else {
              setData(null);
            }
          }}
          onClose = {async () => {
            setValueNotThere(false);
            setAskSinglePoint(!askSinglePoint);
            onState('noRegression', noRegressionHere);
            if(analysisType === 'point'){
              onState('pointSync', true);
              onState('parametric', false);
              if(!pointExist || data.systemParams == null){
                dispatch(updateResults());
                onState('sync', true);
              }
            } 
            else if (analysisType === 'parametric'){
              //These values should really be sanitized in the future
              onState('parameters', { ...state['parameters'], altitude: state.altitudeStep.start, inclination: state.inclinationStep.start});
              onState('parametric', true);
              onState('pointSync', false);
              dispatch(updateResults());
              onState('sync', true);
            } else {
              onState('pointSync', false);
              onState('parametric', false);
              dispatch(updateResults());
              onState('sync', true);
            }
            setData(null);
            setAnalysisDone(false);
          }}
          onCancel = {() => {
              if(prevValue.name === 'semiMajorAxis'){
                onChange({ name: 'altitude', value: parseInt(prevValue.value.replace(',','')) - EARTH_RADIUS_km, category: 'parameters' });
              }else{
                onChange({ name: prevValue.name, value: parseInt(prevValue.value), category: 'parameters' });
              }
              setPrevValue(null);
              setNewValue(null);
              setValueNotThere(false);
              setAskSinglePoint(!askSinglePoint);
              setData(null);
              setAnalysisDone(false);
            }
          }
          analysisType = {analysisType}
          setAnalysisType = {setAnalysisType}
          state = {state}
          data = {data}
          maxAltitude = {bounds.altitude.max}
          values = {getValue(
            state.parameters.altitude,
            state.parameters.inclination,
            metricType,
            state.regressionTypes[metricType],
            data?.predictedData,
            (data?.systemParams as RelayCharacteristics)?.systemName
          )}
          metricType = {metricType}
          containsPoint = {pointExist}
          analysisDone = {analysisDone}
          onState = {onState}
          bounds = {bounds}
          />
    )}
    </div>
  );
};

export default Parameters;
