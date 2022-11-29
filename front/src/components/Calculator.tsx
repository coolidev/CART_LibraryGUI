import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Icon,
  IconButton,
  Input,
  makeStyles,
  Tooltip,
  useTheme
} from '@material-ui/core';
import { FC, useEffect, useState } from 'react';
import CustomNumberFormat from './CustomNumberFormat';
import CloseIcon from '@material-ui/icons/Close';
import MathJax from 'react-mathjax';
import { Theme } from 'src/theme';
import { isNull } from 'underscore';
import { useSelector } from 'src/store';
import { number } from 'yup';

/**
 * Required Calculator Properties
 *
 * @export
 * @interface CalcProps
 */
export interface CalcProps {
  descriptor: string; //Description string that appears before the equation
  calcName: string; //Name of calculator (displayed in header bar)
  resultVar: string; //Variable being calculated (LaTeX)
  resultUnits?: string; //Units of result
  latex: string; //Associated Equation of Calculator (LaTeX)
  params: any; //
  constants?: any;
  calculate: (vals: any) => number; //Function used to calculate results. Requires 'vals' parameter to be defined as a JSON object containing each of the parameters defined in the 'params' prop.
  isOpen: boolean; //Boolean flag used to show or hide calculator dialog
  setIsOpen: (val: boolean) => void; //Function used to set visible/hidden state of dialog
  infoLatex?: string; //Not yet implemented - contains link or LaTeX text with detailed background info of calculation approach
  setResult: (val: number) => void; //Function used to set the result
}

export interface SubCalcProps {
  open?: boolean;
  setOpen?: (state: boolean) => void;
  setResult?: (value: number) => void;
}

interface localValProps {
  key: string;
  value: number;
  name: string;
  label: string;
  subCalcOpen: boolean;
  SubCalcObj?: FC<SubCalcProps>;
}
const useStyles = makeStyles((theme: Theme) => ({
  input: {
    textAlign: 'center',
    borderRadius: 6,
    border: `1px solid ${theme.palette.border.main}`,
    backgroundColor: theme.palette.component.main
  },
  tooltip: {
    maxWidth: '500px'
  }
}));

/**
 * Common Calculator Object
 *
 * descriptor: This will appear at the top of the
 *
 * @param {*} {descriptor: hello, resultVar: hi, resultUnits, latex, params, constants, calculate, isOpen, setIsOpen, infoLatex, setResult}
 * @return {*}
 */
const Calculator: FC<CalcProps> = ({
  descriptor,
  calcName,
  resultVar,
  resultUnits,
  latex,
  params,
  constants,
  calculate,
  isOpen,
  setIsOpen,
  infoLatex,
  setResult
}) => {
  const { zoom } = useSelector((state) => state.zoom);
  const classes = useStyles();
  const theme = useTheme<Theme>();
  const [localVals, setLocalVals] = useState<localValProps[]>(
    params
      .map((attr) => {
        return {
          key: Object.keys(attr)[0],
          value: null,
          name: attr[Object.keys(attr)[0]].name,
          label: attr[Object.keys(attr)[0]].labelTeX,
          subCalcOpen: false,
          SubCalcObj: attr[Object.keys(attr)[0]].calculator
            ? attr[Object.keys(attr)[0]].calculator[
                Object.keys(attr[Object.keys(attr)[0]].calculator)[0]
              ]
            : null
        };
      })
      .sort((a, b) => a.key.localeCompare(b.key))
  );
  const [subParams, setSubParams] = useState<{ value: number; currParam: any }>(
    { value: null, currParam: null }
  );

  const constantsVar: {
    key: string;
    value: number;
    name: string;
    label: string;
  }[] = constants
    ?.map((attr) => {
      return {
        key: Object.keys(attr)[0],
        value: attr[Object.keys(attr)[0]].value,
        name: attr[Object.keys(attr)[0]].name,
        label: attr[Object.keys(attr)[0]].labelTeX
      };
    })
    ?.sort((a, b) => a.key.localeCompare(b.key));
  const [result, updateResult] = useState<number>(null);

  useEffect(() => {
    if (
      localVals.filter((attr) => {
        return isNull(attr.value);
      }).length > 0
    ) {
      updateResult(null);
      return;
    }
    updateResult(
      calculate(
        localVals.reduce(
          (allParams, param) => ({ ...allParams, [param.key]: param.value }),
          {}
        )
      )
    );
  }, [localVals]);

  // Had to use this roundabout way to update the sub-calculator parameters.
  // Timing issues prevented result from being set.
  // subCalcOpen also doesn't work the same as the top level value, so we're also updating that here.
  useEffect(() => {
    if (!subParams.currParam) {
      return;
    }
    const cleanedList: any[] = localVals.filter((x) => {
      return x.key !== subParams.currParam.key;
    });
    setLocalVals(
      [
        ...cleanedList,
        { ...subParams.currParam, value: subParams.value, subCalcOpen: false }
      ].sort((a, b) => a.key.localeCompare(b.key))
    );
  }, [subParams]);

  const resetVals = (): void => {
    setLocalVals(
      params
        .map((attr) => {
          return {
            key: Object.keys(attr)[0],
            value: null,
            name: attr[Object.keys(attr)[0]].name,
            label: attr[Object.keys(attr)[0]].labelTeX,
            subCalcOpen: false,
            SubCalcObj: attr[Object.keys(attr)[0]].calculator
              ? attr[Object.keys(attr)[0]].calculator[
                  Object.keys(attr[Object.keys(attr)[0]].calculator)[0]
                ]
              : null
          };
        })
        ?.sort((a, b) => a.key.localeCompare(b.key))
    );
  };

  const handleOpenState = (value: boolean, currParam: any): void => {
    //To update the specific value, lets create a temporary object without the updated parameter and add it back in (keeping alphabetic sorting)
    const cleanedList: any[] = localVals.filter((x) => {
      return x.key !== currParam.key;
    });
    setLocalVals(
      [...cleanedList, { ...currParam, subCalcOpen: value }].sort((a, b) =>
        a.key.localeCompare(b.key)
      )
    );
  };

  const handleUpdate = (value: number, currParam: any): void => {
    //To update the specific value, lets create a temporary object without the updated parameter and add it back in (keeping alphabetic sorting)
    const cleanedList: any[] = localVals.filter((x) => {
      return x.key !== currParam.key;
    });
    setLocalVals(
      [...cleanedList, { ...currParam, value: value }].sort((a, b) =>
        a.key.localeCompare(b.key)
      )
    );
  };

  return (
    <Dialog
      maxWidth={'sm'}
      open={isOpen}
      //TransitionComponent={Transition}
      keepMounted
      onClose={() => setIsOpen(false)}
    >
      <DialogTitle
        style={{
          margin: 0,
          padding: '16px',
          backgroundColor: theme.palette.primary.light
        }}
      >
        <Box display="flex" alignItems="Left">
          <Box flexGrow={1}>{calcName}</Box>
          <Box>
            <IconButton size="small" onClick={() => setIsOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent
        style={{
          backgroundColor: theme.palette.component.main,
          maxHeight: '70vh',
          overflowY: 'scroll',
          minWidth: '20vw',
          alignItems: 'left'
        }}
      >
        <Box sx={{ display: 'flex', p: 1 }}>
          <MathJax.Provider>
            <MathJax.Node
              format={'TeX'}
              formula={descriptor?.replaceAll(' ', '\\,')}
            />
          </MathJax.Provider>
        </Box>
        <Box sx={{ display: 'flex', p: 1, paddingLeft: '30px' }}>
          <MathJax.Provider>
            <MathJax.Node format={'TeX'} formula={latex} />
          </MathJax.Provider>
        </Box>
        <Box sx={{ display: 'flex', p: 1 }}>
          <MathJax.Provider>
            <MathJax.Node format={'TeX'} formula={'Where:'} />
          </MathJax.Provider>
        </Box>
        {constantsVar?.map((constant) => {
          return (
            <>
              <p style={{ display: 'inline-block', width: '79%' }}>
                <Box sx={{ display: 'flex', p: 1, paddingLeft: '30px' }}>
                  <MathJax.Provider>
                    <MathJax.Node
                      format={'TeX'}
                      formula={
                        constant.label +
                        '\\,(' +
                        constant.name.replaceAll(' ', '\\,') +
                        ')\\,' +
                        ' ='
                      }
                    />
                  </MathJax.Provider>
                </Box>
              </p>

              <p
                style={{
                  display: 'inline-block',
                  width: '20%',
                  textAlign: 'right'
                }}
              >
                <Input
                  name={constant.key}
                  type="number"
                  inputProps={{
                    inputcomponent: CustomNumberFormat,
                    disableUnderline: false,
                    inputProps: {
                      className: classes.input,
                      min: -999999,
                      max: 999999
                    },
                    style: {
                      textAlign: 'center',
                      color: theme.palette.text.primary
                    }
                  }}
                  value={constant.value}
                  disabled={true}
                  disableUnderline
                  fullWidth
                />
              </p>
            </>
          );
        })}

        {localVals.map((param) => {
          return (
            <>
              <p style={{ display: 'inline-block', width: '79%' }}>
                <Box sx={{ display: 'flex', p: 1, paddingLeft: '30px' }}>
                  <MathJax.Provider>
                    <MathJax.Node
                      format={'TeX'}
                      formula={
                        param.label +
                        '\\,(' +
                        param.name.replaceAll(' ', '\\,') +
                        ')\\,' +
                        ' ='
                      }
                    />
                  </MathJax.Provider>
                </Box>
              </p>

              <p
                style={{
                  display: 'inline-block',
                  width: param.SubCalcObj ? '15%' : '20%',
                  textAlign: 'right'
                }}
              >
                <Input
                  name={param.key}
                  type="number"
                  style={{ backgroundColor: theme.palette.grey[200] }}
                  inputProps={{
                    inputcomponent: CustomNumberFormat,
                    disableUnderline: false,
                    inputProps: {
                      className: classes.input,
                      min: -999999,
                      max: 999999
                    },
                    style: { textAlign: 'center' }
                  }}
                  value={param.value ?? ''}
                  onInput={(ev) => {
                    //@ts-ignore
                    handleUpdate(parseFloat(ev.target.value), param);
                  }}
                  disableUnderline
                  fullWidth
                />
                {param.SubCalcObj && (
                  <>
                    <p
                      style={{
                        display: 'inline-block',
                        width: '5%',
                        textAlign: 'right',
                        paddingLeft: '5px'
                      }}
                    >
                      <Tooltip
                        title={param.name + ' Calculator'}
                        placement="top-start"
                        classes={{ tooltip: classes.tooltip }}
                      >
                        <IconButton
                          size="small"
                          onClick={() => handleOpenState(true, param)}
                        >
                          <Icon
                            style={{
                              width:
                                (window.screen.availHeight / zoom) * 0.0284,
                              height:
                                (window.screen.availHeight / zoom) * 0.0284,
                              textAlign: 'center',
                              overflow: 'visible'
                            }}
                            onClick={() => handleOpenState(true, param)}
                          >
                            <img
                              alt="calculate"
                              src="/static/icons/calculator.svg"
                              style={{
                                height:
                                  (window.screen.availHeight / zoom) * 0.025
                              }}
                            />
                          </Icon>
                        </IconButton>
                      </Tooltip>
                      <param.SubCalcObj
                        open={param.subCalcOpen}
                        setOpen={(state: boolean) => {
                          handleOpenState(state, param);
                        }}
                        setResult={(val: number) => {
                          setSubParams({ value: val, currParam: param });
                        }}
                      />
                    </p>
                  </>
                )}
              </p>
            </>
          );
        })}
        <p>
          <hr
            style={{
              borderColor: theme.palette.grey[200],
              height: '1px'
            }}
          />
        </p>
        <Box border={'2px'} borderColor={'black'}>
          <p
            style={{
              display: 'inline-block',
              width: '79%',
              textAlign: 'right'
            }}
          >
            <Box sx={{ display: 'flex', p: 3 }}>
              <MathJax.Provider>
                <MathJax.Node
                  speakText={false}
                  format={'TeX'}
                  formula={`{${resultVar}}\\,(${resultUnits}) = `}
                ></MathJax.Node>
              </MathJax.Provider>
            </Box>
          </p>
          <p
            style={{ display: 'inline-block', width: '20%', textAlign: 'left' }}
          >
            <Input
              name={'result'}
              type="string"
              style={{
                backgroundColor: theme.palette.grey[200],
                color: theme.palette.text.primary
              }}
              inputProps={{ style: { textAlign: 'center' } }}
              disabled={true}
              value={isNaN(result) || isNull(result) ? '' : result.toString()}
              disableUnderline
              fullWidth
            />
          </p>
        </Box>
      </DialogContent>
      <DialogActions style={{ backgroundColor: theme.palette.component.main }}>
        <Button
          onClick={() => {
            resetVals();
          }}
          color="primary"
          variant="outlined"
        >
          Reset
        </Button>
        <Button
          onClick={() => {
            setResult(result);
            setIsOpen(false);
          }}
          color="primary"
          variant="contained"
          disabled={!result}
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Calculator;
