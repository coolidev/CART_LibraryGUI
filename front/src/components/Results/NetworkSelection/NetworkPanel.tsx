/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'src/store';
import { updateResults } from 'src/slices/results';
import clsx from 'clsx';
import _ from 'underscore';
import {
  Box,
  colors,
  makeStyles,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Radio,
  Icon,
  useTheme,
  Divider,
  Tooltip
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import type { State } from 'src/pages/home';
import type { Theme } from 'src/theme';
import { THEMES } from 'src/utils/constants/general';

interface NetworkPanelProps {
  state: State;
  onState: (name: string, value: any) => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    color: theme.palette.text.primary
  },
  title: {
    textAlign: 'center',
    cursor: 'default',
    userSelect: 'none',
    MozUserSelect: 'none',
    WebkitUserSelect: 'none',
    msUserSelect: 'none'
  },
  box: {
    margin: theme.spacing(0, 5, 0, 5),
    backgroundColor: theme.palette.background.light,
    borderRadius: 6
  },
  listBox: {
    overflowY: 'auto',
    border: `1px solid ${theme.palette.border.main}`
  },
  none: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: theme.spacing(3, 5, 0, 5),
    borderRadius: 6
  },
  item: {
    paddingTop: 0,
    paddingBottom: 0,
    backgroundColor: theme.palette.component.main,
    userSelect: 'none',
    MozUserSelect: 'none',
    WebkitUserSelect: 'none',
    msUserSelect: 'none'
  },
  iconBtn: {
    padding: 0
  },
  icon: {
    display: 'flex',
    height: 'inherit',
    width: 'inherit'
  },
  divider: {
    backgroundColor: theme.palette.border.main
  },
  radio: {
    color: theme.palette.border.main
  },
}));

const NetworkPanel: FC<NetworkPanelProps> = ({ state, onState }) => {
  const classes = useStyles();
  const { zoom } = useSelector((state) => state.zoom);
  const theme = useTheme<Theme>();
  const [open, setOpen] = useState<boolean>(false);
  const dispatch = useDispatch();

  useEffect(() => {
    // Set the currently selected item to null
    // if no systems are in the selection list.
    if (state.selectedItems.length === 0) {
      onState('radioButtonSelectionId', 0);
      return;
    }

    // If the currently selected item is null, set
    // it to the first item in the selection list.
    state.radioButtonSelectionId === 0 &&
      onState('radioButtonSelectionId', state.selectedItems[0].id);

    // If every system in the selection list has the `supportedFrequencies`
    // parameter set to some value, filter out any potential duplicate items.
    // NOTE: Currently, only ground stations have the `supportedFrequencies`
    // parameter.
    if (
      state.selectedItems.every((item) => Boolean(item?.supportedFrequencies))
    ) {
      // Removes duplicate entries from the list of ground stations and relays.
      let selectedItems = state.selectedItems;
      const numberOfItemsBeforeFiltering = selectedItems.length;
      selectedItems = selectedItems.filter(
        (e, i) => selectedItems.findIndex((a) => a.id === e.id) === i
      );

      // If some items were filtered out of the list, update the
      // selected items.
      numberOfItemsBeforeFiltering !== selectedItems.length &&
        onState('selectedItems', selectedItems);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.selectedItems]);

  useEffect(() => {
    // If nothing is selected, set frequency bands and
    // network type to null.
    if (state.radioButtonSelectionId > 0 || state.selectedItems.length > 0)
      return;

    onState('networkType', null);
    onState('noRegression', false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.radioButtonSelectionId, state.selectedItems]);

  // Removes a selected system (relay or ground station) from the
  // selection list.
  const handleDelete = (event) => {
    onState('isDataLoaded', false);

    const { name } = event.currentTarget;

    const newSelectedItems = state.selectedItems.filter(
      (item) => item.id !== parseInt(name)
    );

    // If the item being deleted is the currently selected item,
    // select another one, or indicate that no item is currently
    // selected.
    if (parseInt(name) === state.radioButtonSelectionId) {
      if (newSelectedItems.length > 0) {
        onState('radioButtonSelectionId', newSelectedItems[0].id);
      } else {
        onState('radioButtonSelectionId', 0);
      }
    }

    // Clear results returned from last API call.
    dispatch(updateResults());

    onState('selectedItems', newSelectedItems);
    onState('isLastSave', false);
    onState('isMarkedForComparison', false);
    onState('isLastAnalysis', false);
    onState('isDataLoaded', false);
  };

  // Called when the radio button selection is changed.
  const handleChange = (event): void => {
    const { name } = event.currentTarget;

    // Sets the selected system (relay or ground station).
    onState('radioButtonSelectionId', parseInt(name));
    onState('isLastSave', false);
    onState('isMarkedForComparison', false);
  };

  // Responsible for triggering the Antenna Modal open
  // event when the antenna name under the ground station
  // is clicked.
  const handleRowClick = (event): void => {
    //setOpen(true);
  };

  // Opens and closes the Antenna Modal.
  // NOT CURRENTLY USED
  const handleOpen = (): void => setOpen(!open);

  const handleClear = () => {
    // Clear results returned from last API call.
    dispatch(updateResults());

    onState('radioButtonSelectionId', 0);
    onState('selectedItems', []);
    onState('isLastSave', false);
    onState('isMarkedForComparison', false);
    onState('isLastAnalysis', false);
    onState('isDataLoaded', false);
    onState('noRegression', false);
  };

  return (
    <div className={classes.root}>
      <Box display="flex" justifyContent="flex-end" mr={2}>
        <Tooltip title="Remove All Selections" placement="left">
          <IconButton onClick={handleClear}>
            <Icon>
              <img
                alt="Custom Icon"
                className={classes.icon}
                src={'/static/icons/Exit_Dropdown_Icon-Red-SVG.svg'}
              />
            </Icon>
          </IconButton>
        </Tooltip>
      </Box>
      <Box
        className={clsx(classes.box, classes.listBox)}
        style={{ height: (window.screen.availHeight / zoom) * 0.425 }}
      >
        {state.selectedItems.length > 0 ? (
          <List className={classes.item}>
            {state.selectedItems.map((item, i) => (
              <Fragment key={i}>
                <ListItem className={classes.item}>
                  <Radio
                    name={item.id.toString()}
                    checked={state.radioButtonSelectionId === item.id}
                    onChange={handleChange}
                    className={classes.radio}
                  />
                  <ListItemText
                    primary={
                      <Typography
                        variant="h6"
                        component="h6"
                        color="textPrimary"
                      >
                        {item?.system ?? item.name}
                      </Typography>
                    }
                    secondary={
                      item?.freqBands ??
                      `Antenna: ${item.antennaName ?? 'Optimized'}`
                    }
                    onClick={item?.supportedFrequencies && handleRowClick}
                  />
                  <Box flexGrow={1} />
                  <IconButton
                    name={item.id.toString()}
                    className={classes.iconBtn}
                    onClick={handleDelete}
                  >
                    <CloseIcon fontSize="large" color={'primary'} />
                  </IconButton>
                </ListItem>
                <Divider className={classes.divider} />
              </Fragment>
            ))}
          </List>
        ) : (
          <Box
            className={classes.none}
            style={{ minHeight: (window.screen.availHeight / zoom) * 0.4 }}
          >
            <Typography variant="body1" component="p" className={classes.title}>
              Right-click and Select a Network or <br></br>Ground Station to add
              to this list.
            </Typography>
          </Box>
        )}
      </Box>
    </div>
  );
};

export default NetworkPanel;
