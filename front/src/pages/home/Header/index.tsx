import { FC, useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  InputBase,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  makeStyles,
  SvgIcon,
  IconButton,
  Tooltip,
  Badge,
  Icon,
  useTheme
} from '@material-ui/core';
import axios from 'src/utils/axios';
import { useAuth, useSMS } from 'src/hooks/useAuth';
import { LogoLight, LogoDark } from 'src/components/Logo';
import SaveIcon from '@material-ui/icons/Save';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbtack } from '@fortawesome/free-solid-svg-icons';
import AccountCircle from '@material-ui/icons/AccountCircleOutlined';
import ExitToApp from '@material-ui/icons/ExitToAppOutlined';
import Timeline from '@material-ui/icons/Timeline';
import { Menu as MenuIcon } from 'react-feather';
import { useDispatch, useSelector } from 'src/store';
import { getPreference, updatePreference } from 'src/slices/preference';
import { getProject, updateProject } from 'src/slices/project';
import HelpModal from './HelpModal';
import ComparisonModal from './ComparisonModal';
import type { Project, ISave } from 'src/types/preference';
import type { State } from 'src/pages/home';
import { convertStateToSave } from 'src/pages/home';
import { version } from 'src/releaseVersion';
import ManageAccounts from '../ManageAccounts';
import type { Theme } from 'src/theme';
import { THEMES } from 'src/utils/constants/general';
import Settings from './Settings';
import { PlayCircleFilled } from '@material-ui/icons';
import AnalysisSelection from '../Results/AnalysisSelection';
import { PerformancePanel, RelayCharacteristics } from 'src/types/evaluation';
import { updateResults } from 'src/slices/results';
import { getValue } from 'src/algorithms/regressions';
import { parseComma } from 'src/utils/util';

interface HeaderProps {
  state: State;
  cache: ISave;
  onOpen: () => void;
  onCache: (data: ISave) => void;
  onState: (name: string, value: any) => void;
  setAskSinglePoint: any;
  askSinglePoint: boolean;
  bounds: { [key: string]: { min: number, max: number } };
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    margin: theme.spacing(3, 3, 3, 3),
    paddingTop: '8vh'
  },
  toolbar: {
    minHeight: '7.2vh',
    backgroundColor: theme.palette.background.header
  },
  link: {
    textDecoration: 'none',
    '&:hover': {
      color: '#FFF'
    }
  },
  divider: {
    backgroundColor: theme.palette.border.main
  },
  title: {
    position: 'relative',
    paddingTop: '0.2rem',
    paddingBottom: '0.2rem',
    paddingRight: theme.spacing(2)
  },
  subTitle: {
    fontStyle: 'italic'
  },
  tab: {
    color: '#FFF',
    '&:hover': {
      color: '#AAA'
    }
  },
  refresh: {
    color: '#4066BA',
    '&:hover': {
      color: '#EEE'
    }
  },
  refreshDisabled: {
    color: '#000',
    opacity: 0.3
  },
  item: {
    color: theme.palette.text.primary
  },
  inputRoot: {
    color: theme.palette.text.primary,
    background: theme.palette.background.light,
    border: `1px solid ${theme.palette.border.main}`,
    borderRadius: theme.spacing(2)
  },
  inputInput: {
    padding: theme.spacing(2),
    width: '18vw',
    textAlign: 'center'
  },
  sync: {
    background: theme.palette.background.dark,
    marginLeft: theme.spacing(2)
  },
  versionFormat: {
    textAlign: 'center',
    paddingBottom: '0.5rem',
    color: 'grey',
    margin: 'auto'
  }
}));

const Header: FC<HeaderProps> = ({
  state,
  cache,
  onOpen,
  onCache,
  onState,
  setAskSinglePoint,
  askSinglePoint,
  bounds,
}) => {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const { setAuthTokens } = useAuth();
  const { setSMSTokens } = useSMS();
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [isModal, setModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isEngineer, setEngineer] = useState(false);
  const [user, setUser] = useState(null);
  const [projectName, setProjectName] = useState<string | null>(null);
  const [headerText, setHeaderText] = useState('');
  const { preference } = useSelector((state) => state.preference);
  const { project } = useSelector((state) => state.project);
  const [manageAcctVisible, setManageAcctVisible] = useState<boolean>(false);
  const [queuedComparisons, setQueuedComparisons] = useState<number>(0);
  const [analysisType, setAnalysisType] = useState<string>('no-point');
  const [pointExists, setPointExists] = useState<boolean>(false);
  const [metricType, setMetricType] = useState<string>();
  const [data, setData] = useState<PerformancePanel>(null);
  const [analysisDone, setAnalysisDone] = useState<boolean>(false);
  const [noRegressionHere, setNoRegressionHere] = useState<boolean>(false);
  const theme = useTheme<Theme>();

  useEffect(() => {
    dispatch(getPreference());
    dispatch(getProject());
  }, [dispatch]);

  useEffect(() => {
    setUser(localStorage.getItem('name'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localStorage.getItem('name')]);

  useEffect(() => {
    const value = preference.project.find((item) => item.id === project);
    value && setProjectName(value.projectName);
    //count the number of saves that are marked as 'isCompared' and match the necessary criteria (Relay/Orbit, Relay/Terrestrial, DTE)
    setQueuedComparisons(
      value?.saves?.filter(
        (save) =>
          save.isCompared &&
          save.selectedNetworks[0]?.type ===
            //handling absence of type for DTE selections (occurs when not saved)
            (state.selectedItems.length > 0
              ? state.selectedItems[0]?.type ?? 'dte'
              : undefined) &&
          //if relay, check to see if isOrbital state matchesk
          (state.selectedItems[0]?.type === 'relay'
            ? state.parameters.isOrbital === save.parameters.isOrbital
            : true) //true for DTEs
      )?.length ?? 0
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preference, project, state.parameters.isOrbital]);

  useEffect(() => {
    if (projectName && project) {
      if (state.isLastSave && !state.isMarkedForComparison) {
        setHeaderText(projectName + ' - Saved Successfully');
      } else if (!state.isMarkedForComparison) {
        setHeaderText(projectName + '* - Unsaved Changes');
      }
    } else {
      setHeaderText('Please Load a Mission to Continue');
    }
  }, [state.isLastSave, state.isMarkedForComparison, projectName]);

  useEffect(() => {
    const value = preference.project.find((item) => item.id === project);
    setQueuedComparisons(
      value?.saves?.filter(
        (save) =>
          save.isCompared &&
          //handling absence of type for DTE selections (occurs when not saved)
          save.selectedNetworks[0]?.type ===
            (state.selectedItems.length > 0
              ? state.selectedItems[0]?.type ?? 'dte'
              : undefined)
      )?.length ?? 0
    );
  }, [state.selectedItems]);

  useEffect(() => {
    // Query the database for the current user's privileges.
    const fetchData = async () => {
      const params = { email: localStorage.getItem('email') };
      const response = await axios.post('/getEngineerStatus', params);

      // Returns 1 if the user has engineer privileges,
      // and 0 if the user does not have engineer privileges.
      if (response.data) {
        localStorage.setItem('isEngineer', response.data);
        setEngineer(response.data);
      } else if (localStorage.getItem('isEngineer') == null) {
        localStorage.setItem('isEngineer', 'false');
        setEngineer(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    // When the cache ID changes, this means a new save
    // should be created.
    let temp = JSON.parse(JSON.stringify(preference));

    // Check if every item in the saves array has a different ID
    // than the current ID of the cache object.
    const selected = temp.project.find((item) => item.id === project);
    const findCache =
      selected && selected.saves.every((item: ISave) => item.id !== cache.id);

    // If the ID of the cache object does not exist in the saves
    // array, add the current cache object to the saves array
    // of the loaded project.
    if (findCache) {
      // Construct the new save entry using the current
      // state of the application.
      const newSave = convertStateToSave(cache, state);

      selected.saves = [...selected.saves, newSave];
      const data = [
        ...temp.project.filter((item: Project) => item.id !== project),
        selected
      ];

      // Update the database.
      dispatch(updatePreference({ project: data }));

      const savesExceptIsCompared =
        selected.saves && selected.saves.filter((save) => !save.isCompared);
      const mostRecentSave =
        savesExceptIsCompared &&
        savesExceptIsCompared.length > 0 &&
        savesExceptIsCompared[savesExceptIsCompared.length - 1];
      if (mostRecentSave.id !== state.save) {
        onState('save', mostRecentSave.id ?? '');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cache.id]);

  useEffect(() => {
    if(state.networkType == 'relay'){
      setMetricType('coverage');
    } else {
      setMetricType('coverageMinutes');
    }   
  }, [state.networkType])

  useEffect(() => {
    if(data){
      
      setPointExists(data.modelData.orbital[metricType].points.filter(point => point.altitude == state.parameters.altitude && point.inclination == state.parameters.inclination).length !== 0);

    } else {
      setPointExists(false);
    }
  }, [state.parameters.altitude, state.parameters.inclination, data])
  const logout = () => {
    setAuthTokens('');
    setSMSTokens('');
    dispatch(updateProject(null));
    localStorage.clear();
  };

  const handleModal = (): void => setModal(!isModal);

 const handleRequestAnalysis =  async (): Promise<void> => {
    setAskSinglePoint(!askSinglePoint);
  };

  const handleMenu = (event) => setAnchorEl(event.currentTarget);

  const handleClose = () => setAnchorEl(null);

  // When the Save button is triggered, add an
  // entry to the project's saves.
  const handleSave = (): void => {
    onCache({
      ...cache,
      id: uuidv4(),
      isCompared: false,
      dateTime: parseInt(moment().format('X'))
    });
  };

  // Adds an entry to the project's saves when a
  // configuration is marked for comparison.
  const markForComparison = (name: string): void => {
    onCache({
      ...cache,
      id: uuidv4(),
      name: name,
      isCompared: true,
      dateTime: parseInt(moment().format('X'))
    });

    setHeaderText(`Marked for Comparison`);
    onState('isMarkedForComparison', true);
  };

  
  const handleManageAccount = (): void => {
    handleClose();
    setManageAcctVisible(!manageAcctVisible);
  };

  const handleChange = async (values: any): Promise<void> => {
    const { name, value, category } = values;
    const parsedValue = parseFloat(parseComma(value));

    if (Object.keys(bounds).includes(name)) {
      if (
        bounds[name].min <= parsedValue &&
        bounds[name].max >= parsedValue &&
        !isNaN(parsedValue)
      ) {
        onState(category, { ...state[category], [name]: parsedValue });
      }
    } else {
      onState(category, { ...state[category], [name]: typeof value === 'boolean' ? value : parsedValue });
    }
  };

  useEffect(() => {
   console.log(state.parameters.altitude, ' ', state.parameters.inclination);
  }, [state.parameters.altitude, state.parameters.inclination])

  return (
    <AppBar position="fixed">
      <Toolbar className={classes.toolbar}>
        <Box display="flex" alignItems="center" width="100%">
        <IconButton
            style={{ color: theme.palette.border.main }}
            size="small"
            onClick={() => onOpen()}
          >
            <SvgIcon fontSize="small">
              <MenuIcon />
            </SvgIcon>
          </IconButton>
          <Box ml={4}>
            {theme.name === THEMES.LIGHT ? <LogoDark /> : <LogoLight />}
          </Box>
          <Box>
            <Link to="/" className={classes.link}>
            <Typography
                variant="h5"
                className={classes.title}
                style={{ color: theme.palette.text.primary }}
              >
                CoSMOS <br />
              </Typography>
              <Divider className={classes.divider} />
              <Typography
                variant="body1"
                component="p"
                className={classes.subTitle}
                color="textPrimary"
              >
                Commercial Systems for Mission Operations Suitability
              </Typography>
            </Link>
          </Box>
          <Box ml={3} flexGrow={1.4} />
          <Box>
            <InputBase
              placeholder={headerText}
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput
              }}
              inputProps={{ readOnly: true }}
            />
          </Box>
          <Box>
            <Tooltip id="saveButton" title="Save Project">
              <span>
                <IconButton
                  className={classes.tab}
                  onClick={handleSave}
                  disabled={state.isLastSave}
                >
                  <SaveIcon style={{ color: '#e14748' }} 
                    className={
                      state.isLastSave
                      ? classes.refreshDisabled
                      : classes.refresh
                    }
                  />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip
              id="compareButton"
              title="Pin this selection for comparison"
            >
              <span>
                <IconButton
                  className={classes.tab}
                  onClick={() => setIsComparisonOpen(true)}
                  disabled={
                    state.selectedItems.length === 0 ||
                    state.isMarkedForComparison
                  }
                >
                  <Badge
                    badgeContent={queuedComparisons}
                    color="secondary"
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                  >
                    <FontAwesomeIcon
                      icon={faThumbtack}
                      style={{ color: '#e14748' }}
                      size="sm"
                      className={
                        state.selectedItems.length === 0 ||
                        state.isMarkedForComparison
                          ? classes.refreshDisabled
                          : classes.refresh
                      }
                    />
                  </Badge>
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip id="refreshButton" title="Run Analysis">
              <span>
                <IconButton
                  className={classes.sync}
                  onClick= {handleRequestAnalysis}
                  //{state.isLastAnalysis? setAskSinglePoint: handleSync}
                  size="small"
                  disabled={ 
                    state.selectedItems.length === 0 ||
                    (state.networkType === 'dte' && !state.parameters.isOrbital)
                  }
                >
                  <PlayCircleFilled
                    style={{ color: theme.palette.primary.main }}
                    className={
                       state.selectedItems.length === 0
                        ? classes.refreshDisabled
                        : classes.refresh
                    }
                  />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
          <Box flexGrow={1} />
          <Box mr={2}>
            <Settings />
          </Box>
          <Box>
            <IconButton
              color="inherit"
              onClick={handleModal}
              className={classes.tab}
            >
              <Icon
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center'
                }}
              >
                <img
                  alt="help"
                  style={{
                    height: '1em',
                    fontSize: '0.875rem'
                  }}
                  src="/static/icons/help.svg"
                />
              </Icon>
            </IconButton>
            <IconButton
              size="small"
              onClick={handleMenu}
              className={classes.tab}
              style={{ borderRadius: 0 }}
            >
              <Avatar
                style={{
                  color: theme.palette.text.primary,
                  backgroundColor: theme.palette.component.main,
                  border: `1px solid ${theme.palette.border.main}`
                }}
              >
                {user &&
                  user.split(' ').length > 1 &&
                  user.split(' ')[0].charAt(0).toUpperCase() +
                    user.split(' ')[1].charAt(0).toUpperCase()}
                {user &&
                  user.split(' ').length === 1 &&
                  user.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
              style={{ marginTop: '3rem' }}
            >
              <MenuItem>
                <Link
                  to="./"
                  onClick={handleManageAccount}
                  className={classes.item}
                >
                  <AccountCircle fontSize="large" color="primary" />
                  Account Settings
                </Link>
              </MenuItem>
              {/* <MenuItem>
                <Link to="#" className={classes.item}>
                  <Work fontSize="large" className={classes.icon} />
                  User Preferences
                </Link>
              </MenuItem> */}
              {isEngineer && (
                <MenuItem>
                  <Link
                    to="/statistics-dashboard"
                    target="_blank"
                    className={classes.item}
                  >
                    <Timeline fontSize="large" color="primary" />
                    Engineer Dashboard
                  </Link>
                </MenuItem>
              )}
              <MenuItem>
                <Link to="/signin" onClick={logout} className={classes.item}>
                  <ExitToApp fontSize="large" color="primary" />
                  Log Out
                </Link>
              </MenuItem>
              <hr></hr>
              <div className={classes.versionFormat}>
                CoSMOS Version: v{version}
              </div>
            </Menu>
          </Box>
        </Box>
      </Toolbar>
      <HelpModal open={isModal} onOpen={handleModal} />
      {isComparisonOpen && (
        <ComparisonModal
          open={isComparisonOpen}
          onOpen={() => setIsComparisonOpen(!isComparisonOpen)}
          markForComparison={markForComparison}
          selectedItems={state.selectedItems}
        />
      )}
      <ManageAccounts open={manageAcctVisible} onOpen={handleManageAccount} />
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
            setNoRegressionHere(false);
            setAnalysisDone(true);
            if(response.status === 200){
              setData(response.data);
            } else {
              setData(null);
            }
          }}
          onClose = {async () => {
            setAskSinglePoint(!askSinglePoint);
            onState('noRegression', noRegressionHere)
            if(analysisType === 'point'){
              onState('pointSync', true);
              onState('parametric', false);
              onState('mathematical', false);
              if(!pointExists || data.systemParams == null){
                dispatch(updateResults());
                onState('sync', true);
              }
            } 
            else if (analysisType === 'parametric'){
              //These values should really be sanitized in the future
              onState('parameters', { ...state['parameters'], altitude: state.altitudeStep.start, inclination: state.inclinationStep.start});
              onState('parametric', true);
              onState('pointSync', false);
              onState('mathematical', false);
              dispatch(updateResults());
              onState('sync', true);
            } else if (analysisType === 'math'){
              onState('parametric', false);
              onState('pointSync', false);
              onState('mathematical', true);
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
          containsPoint = {pointExists}
          analysisDone = {analysisDone}
          onState = {onState}
          bounds = {bounds}
          />
        )}
  </AppBar>
  );
};

export default Header;
