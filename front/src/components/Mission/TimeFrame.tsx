import { FC, useEffect, useState } from 'react';
import {
  Grid,
  Box,
  TextField,
  Typography,
  Slider,
  makeStyles,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  useTheme
} from '@material-ui/core';
import type { Specifications } from 'src/types/preference';
import type { ChangeProps } from 'src/pages/home/QuickAccess';
import CustomNumberFormat from 'src/components/CustomNumberFormat';
import type { Theme } from 'src/theme';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { State } from 'src/pages/home';
import { Type } from 'react-feather';

interface SpecificationsProps {
  result: State;
  bounds: { [key: string]: { min: number; max: number } };
  onChange: (values: ChangeProps) => void;
  accordion: any;
  setAccordion: (values: any) => void;
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
  interiorBox: {
    backgroundColor: theme.palette.component.main
  }
}));

const TimeFrame: FC<SpecificationsProps> = ({
  result,
  bounds,
  onChange,
  accordion,
  setAccordion,
  onState
}) => {
  const classes = useStyles();

  // const [availability, setAvailability] = useState<number>(result.availability);
  // const [throughput, setThroughput] = useState<number>(result.throughput);
  const theme = useTheme<Theme>();

  const [launchYear, setLaunchYear] = useState<number>(result.constraints.launchYear);
  const [launchMonth, setLaunchMonth] = useState<number>(result.constraints.launchMonth);
  const [launchDay, setLaunchDay] = useState<number>(result.constraints.launchDay)
  const [endYear, setEndYear] = useState<number>(result.constraints.endYear?? result.constraints.launchYear + 1);
  const [endMonth, setEndMonth] = useState<number>(result.constraints.endMonth);
  const [endDay, setEndDay] = useState<number>(result.constraints.endDay);
  const [defaultTime, setDefaultTime] = useState<boolean>(true);
  const handleAccordion = (event) => {
    const { id } = event.currentTarget;
    const value = event.currentTarget.getAttribute('aria-expanded') === 'false';
    setAccordion((prevState) => ({ ...prevState, 'constraints-panel': false, [id]: value }));
  };
  /* this is to make sure all of these values are at least set when we switch to a custom time frame */
  useEffect(() => {
    onState('constraints', { ...result['constraints'], 
      defaultTime: defaultTime,
      launchDay: launchDay,
      launchMonth: launchMonth,
      launchYear: launchYear,
      endDay: endDay,
      endMonth: endMonth,
      endYear: endYear
    });
    
  }, [defaultTime])
  
  //making sure state and local variables are connected
  useEffect(() => {
    if(result.constraints.launchYear != launchYear){
      setLaunchYear(result.constraints.launchYear??launchYear);
    }
  }, [result.constraints.launchYear]);
  
  useEffect(() => {
    if(result.constraints.endYear != endYear){
      setEndYear(result.constraints.endYear??endYear);
    }
  }, [result.constraints.endYear]);

  useEffect(() => {
    if(result.constraints.launchMonth != launchMonth){
      setLaunchMonth(result.constraints.launchMonth??launchMonth);
    }
  }, [result.constraints.launchMonth]);
  
  useEffect(() => {
    if(result.constraints.endMonth != endMonth){
      setEndMonth(result.constraints.endMonth??endMonth);
    }
  }, [result.constraints.endMonth]);

  useEffect(() => {
    if(result.constraints.launchDay != launchDay){
      setLaunchDay(result.constraints.launchDay??launchDay);
    }
  }, [result.constraints.launchDay])

  useEffect(() => {
    if(result.constraints.endDay != endDay){
      setEndDay(result.constraints.endDay??endDay);
    }
  }, [result.constraints.endDay])

  useEffect(() => {
    if(result.constraints.launchYear != launchYear){
      onState('constraints', { ...result['constraints'], launchYear: launchYear});
    }
  }, [launchYear]);
  
  useEffect(() => {
    if(result.constraints.endYear != endYear){
      onState('constraints', { ...result['constraints'], endYear: endYear});
    }
  }, [endYear]);

  useEffect(() => {
    if(result.constraints.launchMonth != launchMonth){
      onState('constraints', { ...result['constraints'], launchMonth: launchMonth});
    }
  }, [launchMonth]);
  
  useEffect(() => {
    if(result.constraints.endMonth != endMonth){
      onState('constraints', { ...result['constraints'], endMonth: endMonth});
    }
  }, [endMonth]); 

  useEffect(() => {
    if(result.constraints.launchDay != launchDay){
      onState('constraints', { ...result['constraints'], launchDay: launchDay});
    }
  }, [launchDay]);

  useEffect(() => {
    if(result.constraints.endDay != endDay){
      onState('constraints', { ...result['constraints'], endDay: endDay});
    }
  }, [launchDay]);

  /*we make sure that the launch date is never greater than the end date, and the end date is never less than the launch date
    this is handled by changing the end date to be the same as the launch date, if the launch date is greater than the current end date
    this same process happens in reverse when the end date is changed to be less than the launch date (the launch date is lowered to be the same as the end date)*/
  const handleChange = (event): void => {
    let { name, value } = event.target;
    value = parseInt(value);
    if(name === 'launchDay'){
      if(value > 1 && value <= getMaxDay(launchMonth, launchYear)){
        setLaunchDay(value);
        if(value > endDay && launchMonth === endMonth && launchYear === endYear){
          setEndDay(value);
        }
      }
    } else if(name === 'launchMonth'){
      if(value <= 12 && value >= 1){
        setLaunchMonth(value);
        if(launchYear === endYear && value > endMonth){
          setEndMonth(value);
          setEndDay(launchDay);
        }
        if(launchDay > getMaxDay(value, launchYear)){
          setLaunchDay(getMaxDay(value, launchYear));
        }
      }
    } else if (name === 'launchYear'){
      if(value <= bounds.launchYear.max && value >= bounds.launchYear.min){
        setLaunchYear(value);
        if(value > endYear){
          setEndYear(value);
          setEndMonth(launchMonth);
          setEndDay(launchDay);
        }
        if(launchDay > getMaxDay(launchMonth, value)){
          setLaunchDay(getMaxDay(launchMonth, value));  
        }
      }
    } else if (name === 'endDay'){
      if(value > 1 && value <= getMaxDay(endMonth, endYear)){
        setEndDay(value);
        if(value < launchDay && launchMonth === endMonth && launchYear === endYear){
          setLaunchDay(value);
        }
      }
    } else if(name === 'endMonth'){
      if(value <= 12 && value >= 1){
        setEndMonth(value);
        if(launchYear === endYear && value < launchMonth){
          setLaunchMonth(value);
          setLaunchDay(endDay)
        }
        if(endDay > getMaxDay(value, endYear)){
          setEndDay(getMaxDay(value, endYear));
        }
      }
    } else if (name === 'endYear'){
      if(value <= bounds.endYear.max && value >= bounds.endYear.min){
        setEndYear(value);
        if(value < launchYear){
          setLaunchYear(value);
          setLaunchMonth(endMonth);
          setLaunchDay(endDay);
        }
        if(endDay > getMaxDay(endMonth, value)){
          setEndDay(getMaxDay(endMonth, value));
        }
      }
    }
  }

  //gets the default values for time, THESE VALUES DO NOT CHANGE ANYTHING IN THE STATE, THEY ARE PURELY VISUAL
  const getDefaultTime = (name: string) => {
    if(name === 'launchDay'){
      return(new Date().getDate())
    }
     else if(name === 'launchMonth'){
      return(new Date().getMonth() + 1);
    } 
    else if (name === 'launchYear'){
      return(new Date().getFullYear());
    } 
    else if (name === 'endDay') {
      if(result.networkType === 'relay'){
        return(new Date().getDate() + 1);
      } else {
        return(new Date().getDate());
      }
    }
    else if(name === 'endMonth'){
      if(result.networkType === 'relay'){
        return(new Date().getMonth() + 1);
      } else {
        let today = new Date();
        if(today.getMonth() + 2 > 12){
          return '1';
        } else {
          return (today.getMonth() + 2);
        }
      }  
    } else if (name === 'endYear'){
      if(result.networkType === 'relay'){
        return(new Date().getFullYear());
      } else {
        let today = new Date();
        if(today.getMonth() + 2 > 12){
          return (today.getFullYear() + 1);
        } else {
          return (today.getFullYear());
        }
      }
    } 
  }

  //gets the maximum day that can be in a month, depends on the month and the year (because Feb has to be a special child)
  const getMaxDay = (month: number, year: number) => {
    switch (month){
      case 1:
      case 3:
      case 5:
      case 7:
      case 8:
      case 10:
      case 12:
        return(31);
        break;
      case 4:
      case 6:
      case 9:
      case 11:
        return(30);
        break;
      case 2:
        //please reference leap year rules for why this does this
        if(year%4 === 0 && (year%100 !== 0 || year%400 === 0)){
          return(29);
        } else {
          return(28);
        }
        break;
    }
  }
 
  return (
    <div className={classes.root}>
      <Box p={2} className={classes.box}>
      <Accordion key={'specification'} className={classes.interiorBox} expanded={accordion[`specification-panel`] ?? false}>
        <AccordionSummary id={`specification-panel`} onClick={handleAccordion} >
          <Typography style={{ width: '100%', fontSize: '12pt' }}>
            {`Mission Time Frame`}
          </Typography>
          {!Object.keys(accordion).includes(`specification-panel`) ||
          !accordion[`specification-panel`] ? (
            <KeyboardArrowDownIcon fontSize="small" />
          ) : (
            <KeyboardArrowUpIcon fontSize="small" />
          )}
        </AccordionSummary>
        <AccordionDetails>
        <Grid container justify="center" alignItems="center" spacing={2}>
        <Grid item md={2}>
          <Checkbox
            color="primary"
            style={{
              color: `${theme.palette.primary.main} `
            }}
            checked={defaultTime}
            onChange={() => setDefaultTime(!defaultTime)}
          />
        </Grid>
        <Grid item md={10}>
          <Typography variant="body1" component="p" color="textPrimary">
            {'Use Default Time'}
          </Typography>
        </Grid>
        <Grid item md={12}>
            <Typography variant="body1" component="p" color="textPrimary">
              Launch Time (DD/MM/YYYY):
            </Typography>
          </Grid>
          <Grid item md={2}>
            <TextField
              name="launchDay"
              value={defaultTime? getDefaultTime('launchDay'): launchDay}
              onBlur={handleChange}
              InputProps={{
                inputComponent: CustomNumberFormat, 
                disableUnderline: true,
                inputProps: {
                  className: classes.input,
                  min: 0,
                  max: getMaxDay(launchMonth, launchYear)
                }
              }}
              onKeyPress={(ev) => {
                if (ev.key === 'Enter') {
                  handleChange(ev);
                }
              }}
              disabled = {defaultTime}
              fullWidth
            />
          </Grid>
          <Grid item md = {1} >
            <Typography style = {{textAlign: 'center'}}>
              {'/'}
            </Typography>
          </Grid>
          <Grid item md={2}>
            <TextField
              name="launchMonth"
              value={defaultTime? getDefaultTime('launchMonth'): launchMonth}
              onBlur={handleChange}
              InputProps={{
                inputComponent: CustomNumberFormat, 
                disableUnderline: true,
                inputProps: {
                  className: classes.input,
                  min: 0,
                  max: 12
                }
              }}
              onKeyPress={(ev) => {
                if (ev.key === 'Enter') {
                  handleChange(ev);
                }
              }}
              disabled = {defaultTime}
              fullWidth
            />
          </Grid>
          <Grid item md = {1}>
            <Typography style = {{textAlign: 'center'}}>
              {'/'}
            </Typography>
          </Grid>
          <Grid item md={3}>
            <TextField
              name="launchYear"
              value={defaultTime? getDefaultTime('launchYear'): launchYear}
              onBlur={handleChange}
              InputProps={{
                inputComponent: CustomNumberFormat, 
                disableUnderline: true,
                inputProps: {
                  className: classes.input,
                  min: bounds.launchYear.min,
                  max: bounds.launchYear.max
                }
              }}
              onKeyPress={(ev) => {
                if (ev.key === 'Enter') {
                  handleChange(ev);
                }
              }}
              disabled = {defaultTime}
              fullWidth
            />
          </Grid>
          <Grid item md={12}>
            <Typography variant="body1" component="p" color="textPrimary">
              End Time (DD/MM/YYYY):
            </Typography>
          </Grid>
          <Grid item md={2}>
            <TextField
              name="endDay"
              value={defaultTime? getDefaultTime('endDay'): endDay}
              onBlur={handleChange}
              InputProps={{
                inputComponent: CustomNumberFormat, 
                disableUnderline: true,
                inputProps: {
                  className: classes.input,
                  min: 0,
                  max: getMaxDay(endMonth, endYear)
                }
              }}
              onKeyPress={(ev) => {
                if (ev.key === 'Enter') {
                  handleChange(ev);
                }
              }}
              disabled = {defaultTime}
              fullWidth
            />
          </Grid>
          <Grid item md = {1} >
            <Typography style = {{textAlign: 'center'}}>
              {'/'}
            </Typography>
          </Grid>
          <Grid item md={2}>
            <TextField
              name="endMonth"
              value={defaultTime? getDefaultTime('endMonth'): endMonth}
              onBlur={handleChange}
              InputProps={{
                inputComponent: CustomNumberFormat, 
                disableUnderline: true,
                inputProps: {
                  className: classes.input,
                  min: 0,
                  max: 12
                }
              }}
              onKeyPress={(ev) => {
                if (ev.key === 'Enter') {
                  handleChange(ev);
                }
              }}
              disabled = {defaultTime}
              fullWidth
            />
          </Grid>
          <Grid item md = {1} >
            <Typography style = {{textAlign: 'center'}}>
              {'/'}
            </Typography>
          </Grid>
          <Grid item md={3}>
            <TextField
              name="endYear"
              value={defaultTime? getDefaultTime('endYear'): endYear}
              onBlur={handleChange}
              InputProps={{
                inputComponent: CustomNumberFormat, 
                disableUnderline: true,
                inputProps: {
                  className: classes.input,
                  min: bounds.launchYear.min,
                  max: bounds.launchYear.max
                }
              }}
              onKeyPress={(ev) => {
                if (ev.key === 'Enter') {
                  handleChange(ev);
                }
              }}
              disabled = {defaultTime}
              fullWidth
            />
          </Grid>
        </Grid>
        </AccordionDetails>
      </Accordion>
      </Box>
    </div>
  );
};

export default TimeFrame;
