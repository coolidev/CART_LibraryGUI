import { FC } from 'react';
import { makeStyles, Theme } from '@material-ui/core';
import { NetworkPanel, Modulation } from 'src/components/Results';
import type { State } from 'src/pages/home';

interface NetworkProps {
  state: State;
  visible: boolean;
  onState: (name: string, value: any) => void;
  onBounds: (name: string, type: string, value: number) => void;
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  hide: {
    display: 'none'
  }
}));

const Network: FC<NetworkProps> = ({ 
  state, 
  visible,
  onState,
  onBounds
}) => {
  const classes = useStyles();

  return (
    <div className={visible?classes.root:classes.hide}>
      <NetworkPanel
        state={state}
        onState={onState}
      />
      <Modulation 
        state={state}
        onState={onState}
        onBounds={onBounds}
      />
    </div>
  );
};

export default Network;
