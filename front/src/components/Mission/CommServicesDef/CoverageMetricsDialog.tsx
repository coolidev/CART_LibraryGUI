import { Dialog, DialogTitle, DialogContent, Typography, TextField, DialogActions, useTheme, Grid, Button, makeStyles, Box, Tooltip} from "@material-ui/core";
import { FC } from "react";
import CustomNumberFormat from "src/components/CustomNumberFormat";
import { State } from "src/pages/home";
import { ChangeProps } from "src/pages/home/QuickAccess";
import { Theme } from "src/theme";
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import {TooltipList} from 'src/utils/constants/tooltips'

interface CoverageMetricsDialogProps {
    state: State;
    bounds: { [key: string]: { min: number; max: number } };
    onChange: (values: ChangeProps) => void;
    coverageDialog: boolean;
    setCoverageDialog: (values: any) => void;
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
      border: `1px solid ${
        theme.palette.border.main
      }`,
      backgroundColor: theme.palette.component.main
    },
    disabledInput: {
      textAlign: 'center',
      borderRadius: 6,
      border: `1px solid grey`,
      backgroundColor: theme.palette.component.main
    },
    interiorBox: {
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
    header:{
      fontWeight: 'bold'
    }
  }));

const CoverageMetricsDialog: FC<CoverageMetricsDialogProps> = ({ state, bounds, onChange, coverageDialog, setCoverageDialog}) => {
    const classes = useStyles();
    const theme = useTheme<Theme>();

    const handleClick = (event): void => {
      const { name, value } = event.target;
      if(name === 'tolerableGap'){
        onChange({ name: 'tolerableGap', value: value, category: 'specifications' });
      }else{
        onChange({ name, value: value, category: 'specifications' });
      }
    };

    return (
        <Dialog
      fullWidth
      open={coverageDialog}
      //TransitionComponent={Transition}
      keepMounted
      onClose={()=>setCoverageDialog(false)}
    >
      <DialogTitle style={{
          margin: 0,
          padding: '16px',
          backgroundColor: theme.palette.primary.light
          
      }}>
        <Box display="flex" alignItems="center">
            <Box flexGrow={1} >Coverage Metrics</Box>
            <Box>
                <IconButton size="small" onClick={()=>{setCoverageDialog(false)}}>
                        <CloseIcon />
                </IconButton>
            </Box>
        </Box>
    </DialogTitle>
      <DialogContent
        style={{ 
          backgroundColor: theme.palette.component.main,
          maxHeight: '70vh',
          overflowY: 'auto',
        }}>
        <Grid container justify="center" alignItems="center" spacing={2}>
          <Grid item md = {1}/>
         <Grid item md={6}>
         <Tooltip title= {TooltipList.meanNumberOfContactsPerOrbit}>
            <Typography variant="body1" component="p" color="textSecondary">
              {'Mean Number of Contacts Per Orbit'}
            </Typography>
          </Tooltip>
          </Grid>
          <Grid item md={5}>
            <TextField
              name="meanNumContacts"
              value={''}
              onBlur={()=>{}}
              InputProps={{
                inputComponent: CustomNumberFormat,
                disableUnderline: true,
                inputProps: {
                  className: classes.disabledInput,
                  min: 0,
                  max: 0
                }
              }}
              disabled={true}
              onKeyPress={(ev) => {
                if (ev.key === 'Enter') {
                  //handleClick(ev);
                }
              }}
            />
          </Grid>
          <Grid item md = {1}/>
         <Grid item md={6}>
         <Tooltip title= {TooltipList.meanRFContactDuration}>
            <Typography variant="body1" component="p" color="textSecondary">
              {'Mean RF Contact Duration (min)'}
            </Typography>
          </Tooltip>
          </Grid>
          <Grid item md={5}>
            <TextField
              name="meanContactDur"
              value={''}
              onBlur={()=>{}}
              InputProps={{
                inputComponent: CustomNumberFormat,
                disableUnderline: true,
                inputProps: {
                  className: classes.disabledInput,
                  min: 0,
                  max: 0
                }
              }}
              disabled={true}
              onKeyPress={(ev) => {
                if (ev.key === 'Enter') {
                  //handleClick(ev);
                }
              }}
            />
          </Grid>
          <Grid item md = {1}/>
         <Grid item md={6}>
         <Tooltip title= {TooltipList.averageGap}>
            <Typography variant="body1" component="p" color="textSecondary">
              {'Average Gap (min)'}
            </Typography>
          </Tooltip>
          </Grid>
          <Grid item md={5}>
            <TextField
              name="averageGap"
              value={''}
              onBlur={()=>{}}
              InputProps={{
                inputComponent: CustomNumberFormat,
                disableUnderline: true,
                inputProps: {
                  className: classes.disabledInput,
                  min: 0,
                  max: 0
                }
              }}
              disabled={true}
              onKeyPress={(ev) => {
                if (ev.key === 'Enter') {
                  //handleClick(ev);
                }
              }}
            />
          </Grid>
          <Grid item md = {1}/>
         <Grid item md={6}>
         <Tooltip title= {TooltipList.maxGap}>
            <Typography variant="body1" component="p" color="textPrimary">
              {'Max Gap (min)'}
            </Typography>
          </Tooltip>
          </Grid>
          <Grid item md={5}>
            <TextField
              name="tolerableGap"
              value={state.specifications.tolerableGap}
              onBlur={handleClick}
              InputProps={{
                inputComponent: CustomNumberFormat,
                disableUnderline: true,
                inputProps: {
                  className: classes.input,
                  min: bounds.tolerableGap.min,
                  max: bounds.tolerableGap.max
                }
              }}
              onKeyPress={(ev) => {
                if (ev.key === 'Enter') {
                  handleClick(ev);
                }
              }}
            />
          </Grid>
          <Grid item md = {1}/>
         <Grid item md={6}>
         <Tooltip title= {TooltipList.meanResponseTime}>
            <Typography variant="body1" component="p" color="textSecondary">
              {'Mean Response Time (s)'}
            </Typography>
          </Tooltip>
          </Grid>
          <Grid item md={5}>
            <TextField
              name="meanResponseTime"
              value={''}
              onBlur={()=>{}}
              InputProps={{
                inputComponent: CustomNumberFormat,
                disableUnderline: true,
                inputProps: {
                  className: classes.disabledInput,
                  min: 0,
                  max: 0
                }
              }}
              disabled={true}
              onKeyPress={(ev) => {
                if (ev.key === 'Enter') {
                  //handleClick(ev);
                }
              }}
            />
          </Grid>
          <Grid item md = {1}/>
         <Grid item md={6}>
         <Tooltip title= {TooltipList.meanRFCoverage}>
            <Typography variant="body1" component="p" color="textSecondary">
              {'Mean RF Coverage (% of Orbit)'}
            </Typography>
          </Tooltip>
          </Grid>
          <Grid item md={5}>
            <TextField
              name="meanRFCoverage"
              value={''}
              onBlur={()=>{}}
              InputProps={{
                inputComponent: CustomNumberFormat,
                disableUnderline: true,
                inputProps: {
                  className: classes.disabledInput,
                  min: 0,
                  max: 0
                }
              }}
              disabled={true}
              onKeyPress={(ev) => {
                if (ev.key === 'Enter') {
                  //handleClick(ev);
                }
              }}
            />
          </Grid>
          <Grid item md = {1}/>
         <Grid item md={6}>
         <Tooltip title= {TooltipList.serviceEfficiency}>
            <Typography variant="body1" component="p" color="textSecondary">
              {'Service Efficiency (%)'}
            </Typography>
          </Tooltip>
          </Grid>
          <Grid item md={5}>
            <TextField
              name="serviceEfficiency"
              value={''}
              onBlur={()=>{}}
              InputProps={{
                inputComponent: CustomNumberFormat,
                disableUnderline: true,
                inputProps: {
                  className: classes.disabledInput,
                  min: 0,
                  max: 0
                }
              }}
              disabled={true}
              onKeyPress={(ev) => {
                if (ev.key === 'Enter') {
                  //handleClick(ev);
                }
              }}
            />
          </Grid>

        </Grid>
      </DialogContent>
      <DialogActions style={{ backgroundColor: theme.palette.component.main}}>
        {/* <Button onClick={()=>setCoverageDialog(false)} color="primary" variant='outlined'>
          Cancel
        </Button> */}
        <Button onClick={()=>setCoverageDialog(false)} color="primary" variant='contained'>
          OK
        </Button>
      </DialogActions>
    </Dialog>
    );
};

export default CoverageMetricsDialog;