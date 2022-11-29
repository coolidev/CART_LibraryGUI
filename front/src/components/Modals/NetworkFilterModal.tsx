import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import {
  Grid,
  Box,
  Dialog,
  DialogTitle,
  Typography,
  DialogContent,
  Button,
  Select,
  MenuItem,
  TextField,
  IconButton,
  FormControl,
  makeStyles,
  useTheme,
  AccordionDetails
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import type { NetworkFilters } from 'src/types/preference';
import type { IOptions } from 'src/pages/home/Network/NetworkLibrary';
import type { Theme } from 'src/theme';
import AdvancedSearch from './AdvancedOptions';
import { SearchOption } from 'src/types/details';
import { Filterer } from 'src/utils/filterer';
import TagBox from 'devextreme-react/tag-box';
import Validator, { PatternRule } from 'devextreme-react/validator';
import { THEMES } from 'src/utils/constants/general';
import { Border } from 'devextreme-react/bar-gauge';
import { State } from 'src/pages/home';

interface NetworkFilterModalProps {
  open: boolean;
  filterer: Filterer;
  filters: NetworkFilters;
  source: SearchOption[]
  onOpen: () => void;
  onClear: () => void;
  onFilterChange: () => void;
  setSource: Dispatch<SetStateAction<SearchOption[]>>
  state: State;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  dialog: {
    maxWidth: '768px',
    minHeight: '55vh'
  },
  title: {
    margin: 0,
    padding: theme.spacing(4),
    backgroundColor: theme.palette.primary.light
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  },
  //attempt to remove the second border at some point in the future
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
  textBox: {
    backgroundColor: theme.palette.background.light,
    color: theme.palette.text.primary,
    '& .MuiOutlinedInput-root': {
      //boxShadow: theme.name == THEMES.DARK? '' :'3px 3px 7px #c0c0c0',  --To be added back when we make shadows everywhere
      borderRadius: '4px',
      border: `solid 1px ${theme.palette.border.main}`,
      '& fieldset': {
        border: '0px',
      },
    },
  },
  multiselect: {

    '& .dx-checkbox-checked .dx-checkbox-icon': {
      backgroundColor: theme.palette.border.main
    },
    '& .dx-dropdowneditor-input-wrapper .dx-texteditor-input': {
      color: theme.palette.text.primary
    }
    // '& .dx-selectbox-popup-wrapper .dx-list': {
    //   backgroundColor: 'purple',
    //   color: theme.palette.text.primary
    // },
  },
}));

const NetworkFilterModal: FC<NetworkFilterModalProps> = ({
  open,
  filterer,
  filters,
  onOpen,
  onClear,
  source,
  onFilterChange,
  setSource,
  state
}) => {
  const theme = useTheme<Theme>();
  const classes = useStyles();
  const [isOpen, setIsOpen] = useState(false);


  const getDataSource = () => {
    if(filterer.getFilteredList() == null){
      return []
    } else {
      return filterer.getFilteredList().map(e => e.system)
    }
  }
  return (
    <Dialog
      open={open}
      onClose={onOpen}
      maxWidth="md"
      disableBackdropClick
      disableEscapeKeyDown
      keepMounted
      fullWidth
    >
      <DialogTitle disableTypography className={classes.title}>
        <Typography variant="h6">Network Filters</Typography>
        <IconButton className={classes.closeButton} onClick={onOpen}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers style={{ backgroundColor: theme.palette.component.main }}>
        <Grid container justify="flex-start" alignItems="center" spacing = {5}>
        <Grid item xs={2}>
            <Typography variant="body1">Network Type</Typography>
          </Grid>
          <Grid item xs={4}>
            <FormControl variant="filled" size="small" fullWidth >
              <Select
                className={classes.select}
                name="type"
                variant="outlined"
                data-filter-network="true"
                value={
                  filters.type !== '' && filters.type !== 'none'
                    ? filters.type
                    : 'none'
                }
                color="primary"
                onChange={(e) => {
                  const { name, value } = e.target;
                  if(filterer.getFilters().has(name)) {
                    filterer.removeFilter(name);
                  }
                  const newFilter = (val : any) => {
                    return value == "none" || val.type == value;
                  };
                  filterer.addFilter(name, newFilter);
                  filters.type = value.toString();
                  onFilterChange();
                }}
                fullWidth
              >
                <MenuItem value="none">All</MenuItem>
                <MenuItem value="relay">Relay</MenuItem>
                <MenuItem value="dte">DTE</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={2}>
            <Typography variant="body1" style = {{textAlign: 'left'}}>Agreements With SCaN</Typography>
          </Grid>
          <Grid item xs={4}>
            <FormControl variant="filled" size="small" fullWidth>
              <Select
                name="SCAN"
                className={classes.select}
                variant="outlined"
                value={
                  filters.scanAgreement !== '' && filters.scanAgreement !== 'none'
                    ? filters.scanAgreement
                    : 'none'
                }
                onChange={(e) => {
                  const { name, value } = e.target;
                  if(filterer.getFilters().has(name)) {
                    filterer.removeFilter(name);
                  }
                  if(value != 'none'){
                    let boolVal = value == "Yes" ? true:false;
                    const newFilter = (val : any) => {
                      return val.scanAgreement == boolVal;
                    };
                    filterer.addFilter(name, newFilter);
                  }
                  filters.scanAgreement = value.toString();
                  onFilterChange();
                }}

                fullWidth
              >
                <MenuItem value="none">--</MenuItem>
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={2}>
            <Typography variant="body1">System Name</Typography>
          </Grid>
          <Grid item xs={4}>
          <TagBox
          style = {{
            borderRadius: '4px',
            //I don't know why, but having this shadow disables the annoying highlight feature this component has. Even though it does nothing, do not remove the shadow.
            boxShadow: '0px 0px 0px #c0c0c0', 
            border: `solid 1px ${theme.palette.border.main}`,
            color: theme.palette.text.primary,
          }}          
          dataSource={getDataSource()}
          showSelectionControls={true}
          maxDisplayedTags={3}
          showMultiTagOnly={false}
          applyValueMode="useButtons"
          searchEnabled={true}
          stylingMode="outlined"
          className= {classes.multiselect}
          id="filter-name"
          onValueChanged={(e) => {
            const { name, values } = {name: 'name', values: e.value};
            if(filterer.getFilters().has(name)) {
              filterer.removeFilter(name);
            }
            const newFilter = (val : any) => {
              for(let i = 0; i < values.length; i++){
                if(val.system.toLowerCase().includes(values[i].toLowerCase())) return true; 
              }
              return false;
            };
            if(values.length > 0){
              filterer.addFilter(name, newFilter);
            }
            filters.name = values;
            onFilterChange();
          }}
          value = {filters.name}
        />
          </Grid>
          <Grid item xs={2}>
            <Typography variant="body1">Operational Year</Typography>
          </Grid>
          <Grid item xs={4}>
            <TextField
              className= {classes.textBox}
              variant="outlined"
              size="small"
              fullWidth
              name="operationalYear"
              onChange={(e) => {
                const { name, value } = e.target;
                let x = Number(value);
                if(Number(value) !== NaN){
                  if(filterer.getFilters().has(name)) {
                    filterer.removeFilter(name);
                  }
                  const newFilter = (val : any) => {
                    if(value === '') return true;
                    return Number(val.year) <= Number(value);
                  };
                
                filterer.addFilter(name, newFilter);
                filters.operationalYear = parseInt(value) != NaN? value: filters.operationalYear;
                onFilterChange();
                } 
                if(value === ''){
                  if(filterer.getFilters().has(name)) {
                    filterer.removeFilter(name);
                  }
                  filters.operationalYear = value;
                } 
              }}
              value = {filters.operationalYear}
            >

            </TextField>
          </Grid>
        <Grid item xs = {12} >
          <AdvancedSearch filtererHasBeenChanged={onFilterChange} 
          filterer = {filterer} 
          source = {source} 
          filters = {filters} 
          setSource = {setSource}
          onClear = {onClear}
          onOpen = {onOpen}
          state = {state}
          />
      </Grid>
    </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default NetworkFilterModal;
