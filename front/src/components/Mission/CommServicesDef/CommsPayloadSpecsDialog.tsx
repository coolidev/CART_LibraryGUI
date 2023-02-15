import { Dialog, DialogTitle, DialogContent, Typography, TextField, DialogActions, useTheme, Grid, Button, makeStyles, Box, FormControl, Select, MenuItem, Icon, Checkbox, Tooltip } from "@material-ui/core";
import { ElementRef, FC, useEffect, useState } from "react";
import CustomNumberFormat from "src/components/CustomNumberFormat";
import { State } from "src/pages/home";
import { ChangeProps } from "src/pages/home/QuickAccess";
import { Theme } from "src/theme";
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { useSelector } from "src/store";
import { AttrValue } from ".";
import axios from "src/utils/axios";
import Calculator, { SubCalcProps } from "src/components/Calculator";
import { isNull } from "underscore";
import { TooltipList } from 'src/utils/constants/tooltips';
import { ArrowDropDown, HighlightOff as ClearIcon } from "@material-ui/icons";

export interface CommsPayloadSpecsDialogProps {
  state: State;
  bounds: { [key: string]: { min: number; max: number } };
  onChange: (values: ChangeProps) => void;
  commsPayloadSpecDialog: boolean;
  setCommsPayloadSpecDialog: (values: any) => void;
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
    border: `1px solid ${theme.palette.border.main
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
  header: {
    fontWeight: 'bold'
  },
  tooltip: {
    maxWidth: "500px",
  }
}));


export const TxPwrCalcUI: FC<SubCalcProps> = ({ open, setOpen, setResult }) => {
  return (
    <Calculator
      key={'key1'}
      descriptor={'System Noise Temperature (K)'}
      calcName={'System Noise Temperature Calculator'}
      resultVar={"SNT"}
      resultUnits={"K"}
      latex={'{SNT} = {T_{a}} + {T_0} + {T_{LNA}} + {L_{AntToLNA}}'}
      params={[
        {
          antTemp: {
            name: "Antenna Temperature (K)",
            labelTeX: "{T_{a}}"
          }
        },
        {
          ambTemp: {
            name: "Ambient Temperature (K)",
            labelTeX: "{T_0}"
          }
        },
        {
          lnaTemp: {
            name: "LNA Temperature (K)",
            labelTeX: "{T_{LNA}}"
          }
        },
        {
          lineLoss: {
            name: "Line Loss between Antenna and LNA (dB)",
            labelTeX: "{L_{AntToLNA}}"
          }
        }
      ]}
      calculate={txPwrCalcEqn}
      isOpen={open}
      setIsOpen={setOpen}
      infoLatex={''}
      setResult={setResult} />);
};

function txPwrCalcEqn(params: { antTemp: number, ambTemp: number, lnaTemp: number, lineLoss: number }) {
  return params.antTemp + params.ambTemp + params.lnaTemp + params.lineLoss;
}

const CommsPayloadSpecDialog: FC<CommsPayloadSpecsDialogProps> = ({ state, bounds, onChange, commsPayloadSpecDialog, setCommsPayloadSpecDialog }) => {
  const classes = useStyles();
  const theme = useTheme<Theme>();
  const { zoom } = useSelector((state) => state.zoom);
  const [modulationOptions, setModulationOptions] = useState<AttrValue[]>([]);
  const [modulationSelection, setModulationSelection] = useState<number>(state.constraints.modulationFilter ?? -1);
  const [codingOptions, setCodingOptions] = useState<AttrValue[]>([]);
  const [codingSelection, setCodingSelection] = useState<number>(state.constraints.codingFilter ?? -1);
  const [polarizationOptions, setPolarizationOptions] = useState<AttrValue[]>([]);
  const [polarizationSelection, setPolarizationSelection] = useState<number>(state.constraints.polarizationType ?? -1);
  const [eirpCalc, setEirpCalc] = useState<boolean>(false);
  const [eirpVal, setEirpVal] = useState<number>(null);

  useEffect(() => {
    const fetchModulationTypeData = async () => {
      const response = await axios.get<AttrValue[]>('/getAttributeValues', {
        params: { sub_key: 'antenna_modulation' }
      });
      response.data && setModulationOptions(response.data);
    };

    fetchModulationTypeData();
  }, []);

  useEffect(() => {
    const fetchCodingTypeData = async () => {
      const response = await axios.get<AttrValue[]>('/getAttributeValues', {
        params: { sub_key: 'channel_coding' }
      });

      response.data && setCodingOptions(response.data);
    };

    fetchCodingTypeData();
  }, []);

  useEffect(() => {
    const fetchPolarizationTypeData = async () => {
      const response = await axios.get<AttrValue[]>('/getAttributeValues', {
        params: { sub_key: 'antenna_polarization' }
      });

      response.data && setPolarizationOptions(response.data);
    };

    fetchPolarizationTypeData();
  }, []);

  useEffect(() => {
    if (modulationSelection !== state.constraints.modulationFilter) {
      setModulationSelection(state.constraints.modulationFilter ?? -1);
    }
  }, [state.constraints.modulationFilter]);

  useEffect(() => {
    if (codingSelection !== state.constraints.codingFilter) {
      setCodingSelection(state.constraints.codingFilter ?? -1);
    }
  }, [state.constraints.codingFilter]);

  useEffect(() => {
    if (polarizationSelection !== state.constraints.polarizationType) {
      setPolarizationSelection(state.constraints.polarizationType ?? -1);
    }
  }, [state.constraints.polarizationType]);

  const handleClick = (event): void => {
    const { name, value } = event.target;
    onChange({ name, value: parseFloat(value), category: 'constraints' });
  };

  return (
    <>
      <Dialog
        fullWidth
        open={commsPayloadSpecDialog}
        //TransitionComponent={Transition}
        keepMounted
        onClose={() => setCommsPayloadSpecDialog(false)}
      >
        <DialogTitle style={{
          margin: 0,
          padding: '16px',
          backgroundColor: theme.palette.primary.light
        }}>
          <Box display="flex" alignItems="center">
            <Box flexGrow={1}>Comms Payload Specifications</Box>
            <Box>
              <IconButton size="small" onClick={() => { setCommsPayloadSpecDialog(false) }}>
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
          <Grid container justifyContent="center" alignItems="center" spacing={2}>
            <Grid item md={12}>
              <Typography variant="body1" component="p" color="textPrimary" className={classes.header}>
                Antenna
              </Typography>
            </Grid>
            <Grid item md={1}>
              <Checkbox
                checked={false}
                size="small"
                onChange={(e) => { }}
                name="checkedShow"
                color="primary"
                disabled={true}
              />
            </Grid>
            <Grid item md={6}>
              <Tooltip title={TooltipList.gain}>
                <Typography variant="body1" component="p" color="textSecondary">
                  {'Gain (dBi)'}
                </Typography>
              </Tooltip>
            </Grid>
            <Grid item md={4}>
              <TextField
                name="gain"
                value={''}
                onBlur={() => { }}
                fullWidth
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
            <Grid item md={1}>
              <Tooltip
                title={'Gain Calculator'}
                placement="top-start"
                classes={{ tooltip: classes.tooltip }}
              >
                <IconButton size="small" onClick={() => { }} disabled={true}>
                  <Icon
                    style={{
                      width: (window.screen.availHeight / zoom) * 0.0284,
                      height: (window.screen.availHeight / zoom) * 0.0284,
                      textAlign: 'center',
                      overflow: 'visible'
                    }}
                  >
                    <img
                      alt="calculate"
                      src="/static/icons/calculator.svg"
                      style={{
                        height: (window.screen.availHeight / zoom) * 0.025,
                        opacity: 0.5
                      }}
                    />
                  </Icon>
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item md={1}>
              <Checkbox
                checked={true}
                size="small"
                onChange={(e) => { }}
                name="checkedShow"
                color="primary"
              />
            </Grid>
            <Grid item md={6}>
              <Tooltip title={TooltipList.EIRP}>
                <Typography variant="body1" component="p" color="textPrimary">
                  {'EIRP (dBW)'}
                </Typography>
              </Tooltip>
            </Grid>
            <Grid item md={4}>
              <TextField
                name="eirp"
                value={isNull(eirpVal) ? '' : eirpVal}
                onBlur={(ev) => setEirpVal(parseFloat(ev.target.value) ?? null)}
                fullWidth
                InputProps={{
                  inputComponent: CustomNumberFormat,
                  disableUnderline: true,
                  inputProps: {
                    className: classes.input,
                    min: -999999,
                    max: 999999
                  }
                }}
              />
            </Grid>
            <Grid item md={1}>
              <Tooltip
                title={'EIRP Calculator'}
                placement="top-start"
                classes={{ tooltip: classes.tooltip }}
              >
                <IconButton size="small" onClick={() => setEirpCalc(true)}>
                  <Icon
                    style={{
                      width: (window.screen.availHeight / zoom) * 0.0284,
                      height: (window.screen.availHeight / zoom) * 0.0284,
                      textAlign: 'center',
                      overflow: 'visible'
                    }}
                  >
                    <img
                      alt="calculate"
                      src="/static/icons/calculator.svg"
                      style={{
                        height: (window.screen.availHeight / zoom) * 0.025
                      }}
                    />
                  </Icon>
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item md={1} />
            <Grid item md={6}>
              <Tooltip title={TooltipList.polarizationType}>
                <Typography variant="body1" component="p" color="textPrimary">
                  {'Polarization Type'}
                </Typography>
              </Tooltip>
            </Grid>
            <Grid item md={4}>
              <FormControl variant="filled" size="small" fullWidth>
                <Select
                  className={classes.select}
                  name="polarizationType"
                  variant="outlined"
                  data-filter-network="true"
                  value={polarizationSelection}
                  color="primary"
                  onChange={(e: any) => { setPolarizationSelection(e.target.value) }}
                  IconComponent={props => polarizationSelection === -1 ? (
                    <ArrowDropDown {...props} className={`material-icons ${props.className}`} />
                  ) : <IconButton size='small' onClick={() => { setPolarizationSelection(-1) }}><ClearIcon /></IconButton>}
                >
                  <MenuItem value={-1}>---</MenuItem>
                  {polarizationOptions.map((option) => {
                    return <MenuItem value={option.id}>{option.name}</MenuItem>
                  })}
                </Select>
              </FormControl>
            </Grid>
            <Grid item md={1} />
            <Grid item md={1} />
            <Grid item md={6}>
              <Tooltip title={TooltipList.polarizationLoss}>
                <Typography variant="body1" component="p" color="textSecondary">
                  {'Polarization Loss (dB)'}
                </Typography>
              </Tooltip>

            </Grid>
            <Grid item md={4}>
              <TextField
                name="polarizationLoss"
                value={''}
                onBlur={() => { }}
                fullWidth
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
            <Grid item md={1} />
            <Grid item md={6}>
              <Tooltip title={TooltipList.pointingLoss}>
                <Typography variant="body1" component="p" color="textSecondary">
                  {'Pointing Loss (dB)'}
                </Typography>
              </Tooltip>
              <Typography color="textSecondary">

              </Typography>
            </Grid>
            <Grid item md={4}>
              <TextField
                name="pointingLoss"
                value={''}
                onBlur={() => { }}
                fullWidth
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
            <Grid item md={12}>
              <Typography variant="body1" component="p" color="textPrimary" className={classes.header}>
                RF Front End
              </Typography>
            </Grid>
            <Grid item md={1}>
              <Checkbox
                checked={false}
                size="small"
                onChange={(e) => { }}
                name="checkedShow"
                color="primary"
                disabled={true}
              />
            </Grid>
            <Grid item md={6}>
              <Tooltip title={TooltipList.transmitterPower}>
                <Typography variant="body1" component="p" color="textSecondary">
                  {'Transmitter Power (dBW)'}
                </Typography>
              </Tooltip>
              <Typography color="textSecondary">

              </Typography>
            </Grid>
            <Grid item md={4}>
              <TextField
                name="transmitterNoise"
                value={''}
                onBlur={() => { }}
                fullWidth
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
            <Grid item md={1}>
              {/* <Tooltip
              title={'System Noise Temperature Calculator'}
              placement="top-start"
              classes={{ tooltip: classes.tooltip }}
              >
                <IconButton size="small" onClick={()=>{}}>
                  <Icon
                    style={{
                      width: (window.screen.availHeight / zoom) * 0.0284,
                      height: (window.screen.availHeight / zoom) * 0.0284,
                      textAlign: 'center',
                      overflow: 'visible'
                    }}
                  >
                    <img
                      alt="calculate"
                      src="/static/icons/calculator.svg"
                      style={{
                        height: (window.screen.availHeight / zoom) * 0.025
                      }}
                    />
                  </Icon>
                </IconButton>
              </Tooltip> */}
            </Grid>
            <Grid item md={1} />
            <Grid item md={6}>
              <Tooltip title={TooltipList.otherLosses}>
                <Typography variant="body1" component="p" color="textSecondary">
                  {'Other Losses (dB)'}
                </Typography>
              </Tooltip>
            </Grid>
            <Grid item md={4}>
              <TextField
                name="otherLosses"
                value={''}
                onBlur={() => { }}
                fullWidth
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
            <Grid item md={1} />

            <Grid item md={12}>
              <Typography variant="body1" component="p" color="textPrimary" className={classes.header}>
                Modulator/Demodulator
              </Typography>
            </Grid>
            <Grid item md={1} />
            <Grid item md={6}>
              <Tooltip title={TooltipList.modulation}>
                <Typography variant="body1" component="p" color="textPrimary">
                  {'Modulation'}
                </Typography>
              </Tooltip>
            </Grid>
            <Grid item md={4}>
              <FormControl variant="filled" size="small" fullWidth>
                <Select
                  className={classes.select}
                  name="modulationFilter"
                  variant="outlined"
                  data-filter-network="true"
                  color="primary"
                  value={modulationSelection}
                  onChange={(e: any) => { setModulationSelection(e.target.value) }}
                  IconComponent={props => modulationSelection === -1 ? (
                    <ArrowDropDown {...props} className={`material-icons ${props.className}`} />
                  ) : <IconButton size='small' onClick={() => { setModulationSelection(-1) }}><ClearIcon /></IconButton>}
                >
                  <MenuItem value={-1}>---</MenuItem>
                  {modulationOptions.map((option) => {
                    return <MenuItem value={option.id}>{option.name}</MenuItem>
                  })}
                </Select>
              </FormControl>
            </Grid>
            <Grid item md={1} />
            <Grid item md={1} />
            <Grid item md={6}>
              <Tooltip title={TooltipList.coding}>
                <Typography variant="body1" component="p" color="textPrimary">
                  {'Coding'}
                </Typography>
              </Tooltip>
            </Grid>
            <Grid item md={4}>
              <FormControl variant="filled" size="small" fullWidth>
                <Select
                  className={classes.select}
                  name="codingFilter"
                  variant="outlined"
                  data-filter-network="true"
                  color="primary"
                  value={codingSelection}
                  onChange={(e: any) => { setCodingSelection(e.target.value) }}
                  IconComponent={props => codingSelection === -1 ? (
                    <ArrowDropDown {...props} className={`material-icons ${props.className}`} />
                  ) : <IconButton size='small' onClick={() => { setCodingSelection(-1) }}><ClearIcon /></IconButton>}
                >
                  <MenuItem value={-1}>---</MenuItem>
                  {codingOptions.map((option) => {
                    return <MenuItem value={option.id}>{option.name}</MenuItem>
                  })}
                </Select>
              </FormControl>
            </Grid>
            <Grid item md={1} />
            <Grid item md={12} />
          </Grid>
        </DialogContent>
        <DialogActions style={{ backgroundColor: theme.palette.component.main }}>
          {/* <Button onClick={()=>setCommsPayloadSpecDialog(false)} color="primary" variant='outlined'>
            Cancel
          </Button> */}
          <Button onClick={() => setCommsPayloadSpecDialog(false)} color="primary" variant='contained'>
            OK
          </Button>
        </DialogActions>
      </Dialog>
      <Calculator
        descriptor={'Calculate EIRP in dbW'}
        calcName={'EIRP Calculator'}
        resultVar={"EIRP"}
        resultUnits={"dBW"}
        latex={'{EIRP} = {P_T} + {G_{Ant}}'}
        params={[
          {
            gain: {
              name: "Antenna Gain in dB",
              labelTeX: "{G_{Ant}}",
            }
          },
          {
            txPwr: {
              name: "Transmitter Power in dBW",
              labelTeX: "{P_T}",
              calculator: { TxPwrCalcUI }
            }
          }
        ]}
        calculate={(params: { gain: number, txPwr: number }) => { return (params.gain + params.txPwr) }}
        isOpen={eirpCalc}
        setIsOpen={setEirpCalc}
        infoLatex={''}
        setResult={setEirpVal}
        key={'eirpCalc'}
      />
    </>
  );
};

export default CommsPayloadSpecDialog;