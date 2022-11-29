import { Box, Button,  FormControl, FormControlLabel, FormLabel, Grid, IconButton, makeStyles, Radio, RadioGroup, TextField, Typography } from "@material-ui/core";
import { FC, useEffect, useState } from "react";
import DialogBox from "src/components/DialogBox";
import { State } from "..";
import { PerformancePanel } from "src/types/evaluation";
import type { Theme } from 'src/theme';
import SurfacePlot from "src/pages/regression/SurfacePlot";
import CustomNumberFormat from "src/components/CustomNumberFormat";







interface AnalysisSelectionProps {
        open: boolean;
        onOpen: () => void;
        onClose: () => void;
        onCancel: () => void;
        analysisType: string
        setAnalysisType: any;
        state: State;
        data: PerformancePanel;
        maxAltitude: number;
        values: any;
        metricType: string;
        containsPoint: boolean;
        analysisDone: boolean;
        onState: any;
        bounds: { [key: string]: { min: number, max: number } };
}

//most of these imports are for the graph

const customStyles = makeStyles((theme: Theme) => ({
    dialog: {
      minWidth: '1000px',
      alignContent: 'center',
      minHeight: '575px',
      position : 'relative'
    },
    title: {
      margin: 0,
      padding: theme.spacing(4),
      backgroundColor: theme.palette.primary.light
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500]
    },
    alert: {
      border: `1px double ${theme.palette.border.main}`, 
      borderRadius: '4px', 
      color: `${theme.palette.border.main}`,
      alignContent: 'center',
      padding: '5px',
      marginTop: '10px',
    },
    input: {
      backgroundColor: theme.palette.background.light,
      color: theme.palette.text.primary,
      '& .MuiOutlinedInput-root': {
        //boxShadow: theme.name == THEMES.DARK? '' :'3px 3px 7px #c0c0c0',  --To be added back when we make shadows everywhere
        border: `solid 1px ${theme.palette.border.main}`,
        '& fieldset': {
          border: '0px',
        },
        textAlign: 'center',
        borderRadius: 6,
        backgroundColor: theme.palette.component.main
      },
    }
  }));

  const plotOptions = {
    show_surface: true,
    show_scatter: true
  };
  

const AnalysisSelection: FC<AnalysisSelectionProps> = ({
  open,
  onOpen, 
  onClose, 
  onCancel, 
  analysisType, 
  setAnalysisType, 
  state, 
  data,
  maxAltitude,
  values,
  metricType,
  containsPoint,
  analysisDone,
  onState,
  bounds,
})  =>{

    const customClasses = customStyles();


    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAnalysisType((event.target as HTMLInputElement).value);
      };

    useEffect(() => {
      onOpen();
      if(analysisType === 'math' && state.networkType === 'relay'){
        setAnalysisType('no-point');
      }
    },[])

    //we change the values based on the name of the text box that was changed
    //this is the funciton that gets used for the single point tab
    const handleValueChange = (event) => {
      let {name, value} = event.target;
      if(name === 'altitude'){
        onState('parameters', {...state['parameters'],  altitude: parseInt(value)});
      } else if(name === 'inclination'){
        onState('parameters', {...state['parameters'],  inclination: parseInt(value)});
      } else if(name === 'eccentricity'){
        onState('parameters', {...state['parameters'],  eccentricity: parseFloat(value)});
      }
    }

    //we change the values based on the name of the text box that was changed
    //this is the funciton that gets used for the parametric tab
    //be sure to name boxes properly
    const onChangeParameters =  (event): void => {
      const {name, value} = event.target;
      let newValue;
      if(!isNaN(value)){
      if(name.split('.')[0] === 'altitude'){
        if(name.split('.')[1] === 'start'){
          newValue = {start: value, end: state.altitudeStep.end, step: state.altitudeStep.step};
        }
        if(name.split('.')[1] === 'end'){
          newValue = {start: state.altitudeStep.start, end: value, step: state.altitudeStep.step};
        }
        if(name.split('.')[1] === 'step'){
          newValue = {start: state.altitudeStep.start, end: state.altitudeStep.end, step: value};
        }
        onState('altitudeStep', newValue);
      } else if(name.split('.')[0] === 'inclination'){
        if(name.split('.')[1] === 'start'){
          newValue = {start: value, end: state.inclinationStep.end, step: state.inclinationStep.step};
        }
        if(name.split('.')[1] === 'end'){
          newValue = {start: state.inclinationStep.start, end: value, step: state.inclinationStep.step};
        }
        if(name.split('.')[1] === 'step'){
          newValue = {start: state.inclinationStep.start, end: state.inclinationStep.end, step: value};
        }
        onState('inclinationStep', newValue);
      }
      }
    }

    //gets the default date for the date box
    const seeIntoTheFuture = () => {
      let tommorow = new Date();
      if(state.networkType === 'relay'){
        tommorow.setDate(tommorow.getDate() + 1);
      } else {
        tommorow.setDate(tommorow.getDate() + 30);
      }
      return tommorow.toDateString();
    }

    return (
    <DialogBox
        isOpen={open}
        className={ {paper: customClasses.dialog} }
        title = {"Applicable Dataset"}
        onClose = {onCancel}
        style = {{minHeight:'575px'}}
              >
        <Grid container spacing={5}>
        <Grid item md={3} xs={12}>
        <FormControl>
            <FormLabel id="demo-radio-buttons-group-label">Dataset Type</FormLabel>
            <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                name="radio-buttons-group"
                value = {analysisType}
                onChange = {handleChange}
            >
                <FormControlLabel value="no-point" control={<Radio />} label="Regression Analysis" style = {{paddingBottom: '15px'}}/>
                <FormControlLabel value="point" control={<Radio />} label="Single Point Analysis" style = {{paddingBottom: '15px'}}/>
                <FormControlLabel value="math" control={<Radio />} label="Mathematical Analysis" style = {{paddingBottom: '15px'}} disabled = {!state.parameters.isOrbital || state.networkType === 'relay'}/>
                <FormControlLabel value="parametric" control={<Radio />} label="Parametric Analysis" disabled = {true}/>
            </RadioGroup>
        </FormControl>
        </Grid>
        {/*The view for the regression analysis. Its a graph that displays the coverage data that we get from the RFCoverage API call
        If the data doesn't show up, a warning is displayed and this analysis type is disabled (see OK button below)*/}
        {(analysisType === 'no-point' && data != null)&& (

        <Grid item md={9} xs={12} alignItems="center">
          <div /*Maybe somebody with more time than me can figure out how to center this thing*/>
          <SurfacePlot
              state={[state]}
              data={[data]}
              metricType={metricType}
              regressionTypes={[state].map(s => s.regressionTypes[metricType])}
              minAltitude={0}
              maxAltitude={maxAltitude}
              values={values}
              isLegend={true}
              isSub={true}
              zAxisLabel={data.modelData.orbital[metricType] ? data.modelData.orbital[metricType].label : 'placeholder'}
              plotOptions={plotOptions}
              chartDiv={metricType + 'plotly'}
              size={{
                width: (window.screen.availHeight) * 0.3,
                height: (window.screen.availHeight) * 0.25
              }} 
              maxInclination={state.networkType == 'relay'?90:120} 
              reset={false} 
            />
            </div>
          </Grid>

          )
        }
        {/*Say that we don't have the regression if nothing shows up after we do the API call for the coverage data
        This also probably means that CoSMOS is in no-regression mode*/}
        {(analysisType === 'no-point' && data == null && analysisDone) && (

          <Grid item md={9} xs={12} alignItems="center">
            <div className= {customClasses.alert}><i>A regression for this configuration does not exist, therefore running a regression analysis is impossible.
              <br></br>If you believe this to be a mistake, please contact the CoSMOS team.</i></div>
          </Grid>
          )
        }
        {/*The view for the single point analysis.*/}
        {(analysisType === 'point' && analysisDone) && (
        <Grid item md={9} xs={12}>
          <Grid container justify="center" alignItems="center" spacing={4}>
            <Grid item md={4} xs={12}>
              <Grid container justify="center" alignItems="center" spacing={4}>
              <Grid item md = {12} xs = {12}>
              <u><b>{'Time Range:'}</b></u>
                </Grid>
                <Grid item md={4} xs={12}>
                  <Typography variant="body1">Start Date:</Typography>
                </Grid>
                <Grid item md={8} xs={12}>
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  value = {(
                    state.constraints.launchYear && state.constraints.launchMonth && state.constraints.launchDay && !state.constraints.defaultTime? 
                    (new Date(state.constraints.launchYear, state.constraints.launchMonth, state.constraints.endDay)).toDateString(): 
                    (new Date()).toDateString()
                  )}
                  disabled = {true}
                  className = {customClasses.input}
                  />
                </Grid>
                <Grid item md={4} xs={12}>
                  <Typography variant="body1">End Date:</Typography>
                </Grid>
                <Grid item md={8} xs={12}>
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  value = {(
                    state.constraints.endYear && state.constraints.endMonth && state.constraints.endDay && !state.constraints.defaultTime?  
                    (new Date(state.constraints.endYear, state.constraints.endMonth, state.constraints.endDay)).toDateString(): 
                    seeIntoTheFuture()
                  )}
                  disabled = {true}
                  className = {customClasses.input}
                  />
                </Grid>
                <Grid item md={4} xs={12}>
                  <Typography variant="body1">Time Step:</Typography>
                </Grid>
                <Grid item md={8} xs={12}>
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  value = "30"
                  disabled = {true}
                  className = {customClasses.input}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item md={4} xs={12}>
              <Grid container justify="center" alignItems="center" spacing={4}>
                <Grid item md = {12} xs = {12}>
                <u><b>{'Parameters:'}</b></u>
                </Grid>
                <Grid item md={4} xs={12}>
                  <Typography variant="body1">{'Altitude (km):'}</Typography>
                </Grid>
                <Grid item md={8} xs={12}>
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  value = {state.parameters.altitude}
                  className = {customClasses.input}
                  onBlur = {handleValueChange}
                  name = 'altitude'
                  InputProps={{
                    inputComponent: CustomNumberFormat, 
                    inputProps: {
                      min: bounds['altitude'].min,
                      max: bounds['altitude'].max
                    }
                  }}
                  onKeyPress={(ev) => {
                    if (ev.key === 'Enter') {
                      handleValueChange(ev);
                    }
                  }}
                  />
                </Grid>
                <Grid item md={4} xs={12}>
                  <Typography variant="body1">{'Inclination (deg):'}</Typography>
                </Grid>
                <Grid item md={8} xs={12}>
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  value = {state.parameters.inclination}
                  onBlur = {handleValueChange}
                  name = 'inclination'
                  className= {customClasses.input}
                  InputProps={{
                    inputComponent: CustomNumberFormat,
                    inputProps: {
                      min: 0,
                      max: 180
                    }
                  }}
                  onKeyPress={(ev) => {
                    if (ev.key === 'Enter') {
                      handleValueChange(ev);
                    }
                  }}
                  />
                </Grid>
              </Grid>
            </Grid>
            {!containsPoint &&
              <Grid item md={12} xs={12}>
                <div className= {customClasses.alert}><i>This point doesn't exist in the database yet, a new analysis will need to be run to determine the values at this point</i></div>
              </Grid>}
          </Grid>       
          </Grid>)}
          
          {/*The view for the parametric/ multi-point analysis. Its mostly just boxes, but now with more interactivity!*/}
        {(analysisType === 'parametric' && analysisDone) && (
        <Grid item md={9} xs={12}>
          <Grid container justify="center" alignItems="center" spacing={4}>
            <Grid item md={4} xs={12}>
            <Grid container justify="center" alignItems="center" spacing={4}>
              <Grid item md = {12} xs = {12}>
              <u><b>{'Time Range:'}</b></u>
                </Grid>
                <Grid item md={4} xs={12}>
                  <Typography variant="body1">Start Date:</Typography>
                </Grid>
                <Grid item md={8} xs={12}>
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  value = {state.constraints.defaultTime? (new Date()).toDateString(): new Date(state.constraints.launchYear, state.constraints.launchMonth, state.constraints.launchDay).toDateString()}
                  disabled = {true}
                  className = {customClasses.input}
                  />
                </Grid>
                <Grid item md={4} xs={12}>
                  <Typography variant="body1">End Date:</Typography>
                </Grid>
                <Grid item md={8} xs={12}>
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  value = {state.constraints.defaultTime? seeIntoTheFuture(): new Date(state.constraints.endYear, state.constraints.endMonth, state.constraints.endDay).toDateString()}
                  disabled = {true}
                  className = {customClasses.input}
                  />
                </Grid>
                <Grid item md={4} xs={12}>
                  <Typography variant="body1">Time Step:</Typography>
                </Grid>
                <Grid item md={8} xs={12}>
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  value = "30"
                  disabled = {true}
                  className = {customClasses.input}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item md={4} xs={12}>
              <Grid container justify="center" alignItems="center" spacing={4}>
                <Grid item md = {12} xs = {12}>
                <u><b>{'Altitude (km):'}</b></u>
                </Grid>
                <Grid item md={4} xs={12}>
                  <Typography variant="body1">Start:</Typography>
                </Grid>
                <Grid item md={8} xs={12}>
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  value = {state.altitudeStep.start}
                  onChange = {onChangeParameters}
                  name = {'altitude.start'}
                  className = {customClasses.input}
                  />
                </Grid>
                <Grid item md={4} xs={12}>
                  <Typography variant="body1">End:</Typography>
                </Grid>
                <Grid item md={8} xs={12}>
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  value = {state.altitudeStep.end}
                  onChange = {onChangeParameters}
                  name = {'altitude.end'}
                  className = {customClasses.input}
                  />
                </Grid>
                <Grid item md={4} xs={12}>
                  <Typography variant="body1">Step:</Typography>
                </Grid>
                <Grid item md={8} xs={12}>
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  value = {state.altitudeStep.step}
                  onChange = {onChangeParameters}
                  name = {'altitude.step'}
                  className = {customClasses.input}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item md={4} xs={12}>
              <Grid container justify="center" alignItems="center" spacing={4}>
              <Grid item md = {12} xs = {12}>
                <u><b>{'Inclination (deg):'}</b></u>
                </Grid>
                <Grid item md={4} xs={12}>
                  <Typography variant="body1">Start:</Typography>
                </Grid>
                <Grid item md={8} xs={12}>
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  value = {state.inclinationStep.start}
                  onChange = {onChangeParameters}
                  name = {'inclination.start'}
                  className = {customClasses.input}
                  />
                </Grid>
                <Grid item md={4} xs={12}>
                  <Typography variant="body1">End:</Typography>
                </Grid>
                <Grid item md={8} xs={12}>
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  value = {state.inclinationStep.end}
                  onChange = {onChangeParameters}
                  name = {'inclination.end'}
                  className = {customClasses.input}
                  />
                </Grid>
                <Grid item md={4} xs={12}>
                  <Typography variant="body1">Step:</Typography>
                </Grid>
                <Grid item md={8} xs={12}>
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  value = {state.inclinationStep.step}
                  onChange = {onChangeParameters}
                  name = {'inclination.step'}
                  className = {customClasses.input}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>       
          </Grid>)}
        {/*The Mathematical Analysis, note that the GS latitude, GS Elevation Angle, and FOV fields are all disconnected from anything
        waiting to find what we plan to do with these*/}
          {(analysisType === 'math' && analysisDone) && (
        <Grid item md={9} xs={12}>
          <Grid container justify="center" alignItems="center" spacing={4}>
            <Grid item md={6} xs={12}>
              <Grid container justify="center" alignItems="center" spacing={4}>
                <Grid item md={4} xs={12}>
                  <Typography variant="body1">Altitude (km):</Typography>
                </Grid>
                <Grid item md={8} xs={12}>
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  value = {state.parameters.altitude}
                  className = {customClasses.input}
                  onBlur = {handleValueChange}
                  name = 'altitude'
                  InputProps={{
                    inputComponent: CustomNumberFormat, 
                    inputProps: {
                      min: bounds['altitude'].min,
                      max: bounds['altitude'].max
                    }
                  }}
                  onKeyPress={(ev) => {
                    if (ev.key === 'Enter') {
                      handleValueChange(ev);
                    }
                  }}
                  />
                </Grid>
                <Grid item md={4} xs={12}>
                  <Typography variant="body1">Eccentricity:</Typography>
                </Grid>
                <Grid item md={8} xs={12}>
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  value = {state.parameters.eccentricity}
                  className = {customClasses.input}
                  onBlur = {handleValueChange}
                  name = 'eccentricity'
                  InputProps={{
                    inputComponent: CustomNumberFormat, 
                    inputProps: {
                      min: 0,
                      max: 1
                    }
                  }}
                  onKeyPress={(ev) => {
                    if (ev.key === 'Enter') {
                      handleValueChange(ev);
                    }
                  }}
                  />
                </Grid>
                <Grid item md={4} xs={12}>
                  <Typography variant="body1">Inclination (deg):</Typography>
                </Grid>
                <Grid item md={8} xs={12}>
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  value = {state.parameters.inclination}
                  className = {customClasses.input}
                  onBlur = {handleValueChange}
                  name = 'inclination'
                  InputProps={{
                    inputComponent: CustomNumberFormat, 
                    inputProps: {
                      min: 0,
                      max: 180
                    }
                  }}
                  onKeyPress={(ev) => {
                    if (ev.key === 'Enter') {
                      handleValueChange(ev);
                    }
                  }}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item md={6} xs={12}>
              <Grid container justify="center" alignItems="center" spacing={4}>
                <Grid item md={4} xs={12}>
                  <Typography variant="body1">GS Latitude (deg):</Typography>
                </Grid>
                <Grid item md={8} xs={12}>
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  value = {34}
                  onChange = {onChangeParameters}
                  name = {'latitude'}
                  className = {customClasses.input}
                  />
                </Grid>
                <Grid item md={4} xs={12}>
                  <Typography variant="body1">GS Elevation Angle (deg):</Typography>
                </Grid>
                <Grid item md={8} xs={12}>
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  value = {5}
                  onChange = {onChangeParameters}
                  name = {'elevationAngle'}
                  className = {customClasses.input}
                  />
                </Grid>
                <Grid item md={4} xs={12}>
                  <Typography variant="body1">Field Of View (deg):</Typography>
                </Grid>
                <Grid item md={8} xs={12}>
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  value = {12}
                  onChange = {onChangeParameters}
                  name = {'fov'}
                  className = {customClasses.input}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>)} 
          {/*Our loading text. Please be patient, girls are praying...*/}
          {(!analysisDone) && (<Grid item md={9} xs={12}>
            <div>
            {'Loading...'}
            </div>
            </Grid>)}
        </Grid>
        <div style = {{position: 'absolute', bottom: '0', right: '0', minHeight: '36px', minWidth: '200px', marginBottom: '10px', marginRight: '10px'}}>            
        <Button
        style={{float: 'right', marginLeft: '20px'}}
        onClick = {onClose}
        variant="contained" 
        color="primary"
        disabled = {!analysisDone || 
        (analysisType === 'no-point' && (analysisDone && data==null) && !(state.selectedItems.length >= 2 && state.parameters.eccentricity === 0))}>
           OK
        </Button>

        <Button
        style={{float: 'right'}}
        onClick = {onCancel}
        variant="outlined" 
        color="primary">
           Cancel
        </Button>
        </div>

    </DialogBox>);
}

export default AnalysisSelection;
