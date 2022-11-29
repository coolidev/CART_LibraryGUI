import { FC, useEffect, useState } from 'react';
import { Box, makeStyles, Typography } from '@material-ui/core';
import { CommServicesDef, Parameters, TimeFrame } from 'src/components/Mission';
import type { ChangeProps } from 'src/pages/home/QuickAccess';
import type { State } from 'src/pages/home';
import type { Theme } from 'src/theme';

interface MissionProps {
  state: State;
  bounds: { [key: string]: { min: number; max: number } };
  onChange: (values: ChangeProps) => void;
  onState: (name: string, value: any) => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    color: '#fff'
  },
  title: {
    fontStyle: 'italic',
    fontWeight: 'normal'
  },
  box: {
    backgroundColor: theme.palette.background.light,
    borderRadius: '4px'
  }
}));

const Mission: FC<MissionProps> = ({ state, bounds, onChange, onState }) => {
  const classes = useStyles();
  const [accordion, setAccordion] = useState({});
  
  return (
    <div className={classes.root}>
      <Box my={4}>
        {/* <Typography
          variant="h5"
          component="h5"
          className={classes.title}
          color="textPrimary"
        >
          Parameters
        </Typography> */}
        <Box className={classes.box}>
          <Parameters
            state = {state}
            parameters={state.parameters}
            networkType={state.networkType}
            noRegression = {state.noRegression}
            bounds={bounds}
            onChange={onChange}
            onState = {onState}
          />
        </Box>
      </Box>
      <Box my={4}>
        {/* <Typography
          variant="h5"
          component="h5"
          className={classes.title}
          color="textPrimary"
        >
          Specifications
        </Typography> */}
        <Box className={classes.box}>
          <TimeFrame
            result={state}
            bounds={bounds}
            onChange={onChange}
            accordion={accordion}
            setAccordion={setAccordion}
            onState = {onState}
          />
        </Box>
      </Box>
      <Box my={4}>
        {/* <Typography
          variant="h5"
          component="h5"
          className={classes.title}
          color="textPrimary"
        >
          Constraints
        </Typography> */}
        <Box className={classes.box}>
          <CommServicesDef 
            state={state} 
            bounds={bounds}
            onChange={onChange}
            accordion={accordion}
            setAccordion={setAccordion}
          />
        </Box>
      </Box>
    </div>
  );
};

export default Mission;
