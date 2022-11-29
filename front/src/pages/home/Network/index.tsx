import { FC, useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  IconButton,
  Typography,
  makeStyles
} from '@material-ui/core';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import FiberManualRecordOutlinedIcon from '@material-ui/icons/FiberManualRecordOutlined';
import NetworkLibrary from './NetworkLibrary';
import StationLibrary from './StationLibrary';
import type { ICollapsed, State } from 'src/pages/home';
import type { ISave } from 'src/types/preference';
import type { Theme } from 'src/theme';
import { useSelector } from 'src/store';

interface NetworkProps {
  state: State;
  cache: ISave;
  isCollapsed: ICollapsed;
  onState: (name: string, value: any) => void;
  onBounds: (name: string, type: string, value: number) => void;
  onCollapsed: (value: ICollapsed) => void;
  visible: boolean;
  resultsCollapsed: boolean;
}

const tabs = [
  { name: 'networks', label: 'Networks' },
  { name: 'stations', label: 'Ground Stations' },
  { name: 'relays', label: 'Relays' }
];

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  hide: {
    display: 'none'
  },
  tabs: {
    minHeight: theme.spacing(4)
  },
  tab: {
    minHeight: theme.spacing(4)
  },
  indicator: {
    backgroundColor: 'transparent'
  }
}));

const Network: FC<NetworkProps> = ({
  state,
  cache,
  isCollapsed,
  onState,
  onBounds,
  onCollapsed,
  visible,
  resultsCollapsed
}) => {
  const classes = useStyles();
  const { zoom } = useSelector((state) => state.zoom);
  const [currentTab, setCurrentTab] = useState<string>('networks');
  const [stationCount, setFilterCount] = useState<number>(0);
  const [selectedNetworks, setSelectedNetworks] = useState<string[]>([]);

  const handleChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleUpClick = (): void => onCollapsed(!isCollapsed ? 'up' : null);

  const handleDownClick = (): void => onCollapsed(!isCollapsed ? 'down' : null);

  return (
    <div
      className={visible ? classes.root : classes.hide}
      style={{
        minHeight:
          isCollapsed === 'up'
            ? (window.screen.availHeight / zoom) * 0.855
            : isCollapsed !== 'down' && (window.screen.availHeight / zoom) * 0.3
      }}
    >
      <Box display="flex" alignItems="center">
        <Tabs
          value={currentTab}
          onChange={handleChange}
          className={classes.tabs}
          TabIndicatorProps={{ className: classes.indicator }}
          classes={{
            root: classes.tab
          }}
        >
          {tabs.map((tab) => (
            <Tab
              key={tab.name}
              label={
                <Box display="flex" alignItems="center" justifyContent="center">
                  {currentTab === tab.name && isCollapsed !== 'down' ? (
                    <FiberManualRecordIcon
                      color="primary"
                      style={{ fontSize: '0.8rem' }}
                    />
                  ) : (
                    <FiberManualRecordOutlinedIcon
                      color="primary"
                      style={{ fontSize: '0.8rem' }}
                    />
                  )}
                  <Box flexGrow={1} mr={2} />
                  <Typography
                    variant="body1"
                    style={{ fontWeight: 600 }}
                    color="textPrimary"
                  >
                    {tab.name === 'stations' && stationCount > 0
                      ? tab.label //+ ` (${stationCount})`
                      : tab.label}
                  </Typography>
                </Box>
              }
              value={tab.name}
              classes={{
                root: classes.tab
              }}
              onClick={() =>
                isCollapsed === 'down' ? onCollapsed(null) : null
              }
            />
          ))}
        </Tabs>
        <Box flexGrow={1} />
        <Box mr={2}>
          <IconButton
            style={{ padding: 0 }}
            onClick={handleUpClick}
            disabled={isCollapsed === 'up'}
            id={"upButton"}
          >
            <ArrowDropUpIcon fontSize="large" color="primary" />
          </IconButton>
          <IconButton
            style={{ padding: 0 }}
            onClick={handleDownClick}
            disabled={isCollapsed === 'down'}
            id={"downButton"}
          >
            <ArrowDropDownIcon fontSize="large" color="primary" />
          </IconButton>
        </Box>
      </Box>
      {isCollapsed !== 'down' && (
        <Box>
          <NetworkLibrary
            state={state}
            cache={cache}
            isCollapsed={isCollapsed}
            onState={onState}
            onBounds={onBounds}
            visible={currentTab === 'networks'}
            setNetworks={setSelectedNetworks}
            resultsCollapsed={resultsCollapsed}
          />
          <StationLibrary
            state={state}
            cache={cache}
            isCollapsed={isCollapsed}
            onState={onState}
            onBounds={onBounds}
            visible={currentTab === 'stations'}
            networkSelections={selectedNetworks}
            setCount={setFilterCount}
            resultsCollapsed={resultsCollapsed}
          />
        </Box>
      )}
    </div>
  );
};

export default Network;
