import { useEffect, useState } from 'react';
import type { FC } from 'react';
import { useSelector } from 'src/store';
import _ from 'underscore';
import {
  Grid,
  Box,
  Breadcrumbs,
  Link,
  Menu,
  MenuItem,
  Typography,
  makeStyles,
  Theme
} from '@material-ui/core';
import TreeView from '@material-ui/lab/TreeView';
import {
  StyledTreeItem,
  PlusSquare,
  MinusSquare
} from 'src/components/Details/StyledTreeItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Source, State } from 'src/components/Details/DteDetails';
import { Section, SubSection } from 'src/types/details';
import { OVERVIEW_KEY, ANTENNA_KEY, STATION_KEY } from 'src/utils/constants/network-library';
import DataTable from './DataTable';
import AddStation from './AddStation';
import AddAntenna from './AddAntenna';
import AddBand from './AddBand';
import AddModDemod from './AddModDemod';

interface ManagerProps {
  state: State;
  dataSource: Source;
  initialize: () => void;
  onState: (name: string, value: string | boolean) => void;
}

interface NodeMenu {
  nodeId: string;
  add: string;
  remove: string;
}

const initialMenu: NodeMenu = {
  nodeId: '',
  add: '',
  remove: ''
};

const MENU_NAMES = [
  { key: 'station', keyName: 'stationName', name: 'Platform' },
  { key: 'antenna', keyName: 'antennaName', name: 'Antenna' },
  { key: 'band', keyName: 'bandName', name: 'Antenna Subsystem' },
  { key: 'modDemod', keyName: 'modDemodName', name: 'Mod/Demod' }
];

const depths = ['system', 'antennaId', 'frequencyBand', 'modDemod'];

const banned = [STATION_KEY, ANTENNA_KEY];

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(1)
  },
  tree: {
    height: '49vh',
    padding: theme.spacing(5),
    flexGrow: 1,
    overflow: 'auto'
  },
  main: {
    height: '49vh',
    padding: theme.spacing(5),
    overflow: 'auto',
    '& .dx-switch-on-value .dx-switch-handle::before': {
      backgroundColor: theme.palette.primary.main
    },
    '& .dx-switch-on-value .dx-switch-container::before': {
      backgroundColor: theme.palette.primary.main,
      opacity: 0.5
    },
    '& .dx-datagrid .dx-link': {
      color: theme.palette.primary.main,
    },
    //For multi-select checkboxes (need to find correct style class to move this to)
    // '& .dx-checkbox-indeterminate .dx-checkbox-icon': {
    //   backgroundColor: theme.palette.primary.main
    // },
    '& .dx-datagrid-focus-overlay:after': {
      backgroundColor: theme.palette.primary.main
    }
  },
  dialog: {
    width: '25vw'
  },
  note: {
    textAlign: 'right'
  }
}));

/**
 * DTE Network Details tab
 *
 * @param {*} {
 *   dataSource,
 *   state,
 *   onState,
 *   initialize
 * }
 * @return {*} 
 */
const Manager: FC<ManagerProps> = ({
  dataSource,
  state,
  onState,
  initialize
}) => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState<string[]>([]);
  const [results, setResults] = useState<Section[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [source, setSource] = useState<SubSection[]>([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menu, setMenu] = useState<NodeMenu>(initialMenu);
  const { isEngineer } = useSelector(state => state.user);

  useEffect(() => {
    setSelected(new Array(dataSource.detail.system_value[0]?.section_name??null));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const values = results.map((item) => item.section_name);
    setExpanded(values);
  }, [results]);

  useEffect(() => {
    const data = dataSource.detail.system_value.filter(
      (item: Section) => item.section_key !== OVERVIEW_KEY
    );
    setResults(data);
  }, [dataSource.detail]);

  useEffect(() => {
    if (selected.length === 0) return;

    const keyName = banned[selected.length - 1];
    const keyId = depths[selected.length];
    const data = results.find(
      (result) => result.section_name === selected[0]
    )?.section_value;

    const values =
      data &&
      data.filter((result) => {
        if(result.name[0] !== '['){ //filter out the attributes with '[' character (name attributes)
          return keyName && keyId
            ? result[keyId] === keyName &&
                selected
                  .slice(1)
                  .every((item, i) => result[depths[i + 1]] === item)
            : keyId
            ? !result[keyId] &&
              selected.slice(1).every((item, i) => result[depths[i + 1]] === item)
            : selected
                .slice(1)
                .every((item, i) => result[depths[i + 1]] === item);
        }
      });
    setSource(values ?? []);
  }, [selected, results]);

  const handleClose = () => setAnchorEl(null);

  const handleMenuItem = (event, checked: boolean) => {
    event.preventDefault();
    const value = checked ? 'remove' : 'add';
    const name = MENU_NAMES.find((item) => item.name === menu[value]).key;
    const str = 'is' + name.charAt(0).toUpperCase() + name.slice(1);

    menu.nodeId.split('---').forEach((item, idx) => {
      onState(MENU_NAMES[idx].keyName, item);
    });

    onState(str, checked);
    !checked && onState(name, true);
    setAnchorEl(null);
  };

  const handleSelect = (event, nodeIds) => {
    setSelected(nodeIds.split('---'));
  };

  const handleMenu = (event, nodeId) => {
    event.preventDefault();
    event.stopPropagation();
    const values = nodeId.split('---');
    const params = { nodeId };

    if (MENU_NAMES[values.length])
      params['add'] = MENU_NAMES[values.length].name;

    if (MENU_NAMES[values.length - 1].name)
      params['remove'] = MENU_NAMES[values.length - 1].name;

    //@ts-ignore
    setMenu(params);
    setAnchorEl(event.currentTarget);
  };

  const handleAddStation = () => onState('station', true);

  const handleToggle = (event, nodeIds) => setExpanded(nodeIds);

  const handleOpen = (event) => {
    const name = event.currentTarget
      ? event.currentTarget.getAttribute('name')
      : event;
    state[name] && initialize();
    onState(name, !state[name]);
  };

  const handleState = (event) => {
    const { name, value } = event.target;
    onState(name, value);
  };

  const handleClick = (idx: number) => {
    setSelected(selected.filter((item, i) => i <= idx));
  };

  const renderTree = (key: string, result: SubSection[], parent?: string) => {
    const index = depths.indexOf(key);
    const keys = _.uniq(
      // eslint-disable-next-line array-callback-return
      result.map((item: SubSection) => {
        if (item[key] && item[key] !== '') return item[key];
      })
    );
    const uniqueKeys = index !== 0 ? keys : [''];

    return uniqueKeys.map((item, idx) => {
      const suffix = parent ? `${parent}` : '';
      const nodeId = item ? suffix + `---${item}` : suffix;
      const data =
        index !== 0
          ? result.filter(
              (el) => el[key] && !banned.includes(el[key]) && el[key] === item
            )
          : result;
      const nextValid =
        depths[index + 1] && data.some((el) => Boolean(el[depths[index + 1]]));
      const isValid = index === 0 || data.length > 0;
      const treelabel = index === 3 ? `${item}` : index === 2 ? `${item}`  : index === 0 ? nodeId : item;

      return isValid ? (
        <div key={idx} id={depths[index] ?? ''}>
          <StyledTreeItem
            nodeId={nodeId}
            labelText={treelabel}
            labelIcon={isEngineer ? MoreVertIcon : null}
            onClick={(event) => handleMenu(event, nodeId)}
          >
            {depths[index + 1] &&
              nextValid &&
              renderTree(depths[index + 1], data, nodeId)}
          </StyledTreeItem>
        </div>
      ) : null;
    });
  };

  return (
    <Grid item md={12} className={classes.root}>
      <Box border={1}>
        <Grid container>
          <Grid item md={3}>
            <TreeView
              className={classes.tree}
              expanded={expanded}
              selected={selected.join('---')}
              defaultCollapseIcon={<MinusSquare />}
              defaultExpandIcon={<PlusSquare />}
              onNodeSelect={handleSelect}
              onNodeToggle={handleToggle}
            >
              {results.map((result: Section, i: number) =>
                renderTree(depths[0], result.section_value, result.section_name)
              )}
              {isEngineer && (
                <StyledTreeItem
                  nodeId=""
                  labelText="Add Ground Station"
                  onRowClick={handleAddStation}
                  isRowEvent
                />
              )}
              {isEngineer && (
                <Menu
                  keepMounted
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  getContentAnchorEl={null}
                  anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                  {menu.add && menu.add !== '' && (
                    <MenuItem onClick={(event) => handleMenuItem(event, false)}>
                      Add {menu.add}
                    </MenuItem>
                  )}
                  {menu.remove && menu.remove !== '' && (
                    <MenuItem onClick={(event) => handleMenuItem(event, true)}>
                      Remove {menu.remove}
                    </MenuItem>
                  )}
                </Menu>
              )}
            </TreeView>
          </Grid>
          <Grid item md={9} className={classes.main}>
            <Breadcrumbs aria-label="breadcrumb">
              {selected.map((item, idx) => (
                <div key={idx}>
                  {idx !== selected.length - 1 ? (
                    <Link
                      component="button"
                      color="inherit"
                      href=""
                      onClick={() => handleClick(idx)}
                    >
                      {idx === 3 ? `${item}` : idx === 2 ? `${item}` : item}
                    </Link>
                  ) : (
                    <Typography color="textPrimary">
                      {idx === 3 ? `${item}` : idx === 2 ? `${item}` : item}
                    </Typography>
                  )}
                </div>
              ))}
            </Breadcrumbs>
            <Box mt={3}>
              <DataTable
                // @ts-ignore
                id={dataSource.id}
                isAdmin={dataSource.isAdmin}
                source={source}
              />
              {/* {(source[0] != null) && (source[0].sub_key === "antenna_frequency")
                  ?<Typography display="block" align="right" variant="caption" className="classes.note"><br></br>{DTE_NOTES}</Typography>
                  :null
                } */}
            </Box>
          </Grid>
        </Grid>
      </Box>
      {isEngineer && (
        <Box m={2}>
          <AddStation
            id={dataSource.id.toString()}
            state={state}
            onState={handleState}
            onOpen={handleOpen}
            initialize={initialize}
          />
          <AddAntenna
            id={dataSource.id.toString()}
            state={state}
            onState={handleState}
            onOpen={handleOpen}
            initialize={initialize}
          />
          <AddBand
            state={state}
            onState={handleState}
            onOpen={handleOpen}
            initialize={initialize}
          />
          <AddModDemod
            state={state}
            onState={handleState}
            onOpen={handleOpen}
            initialize={initialize}
          />
        </Box>
      )}
    </Grid>
  );
};

export default Manager;
