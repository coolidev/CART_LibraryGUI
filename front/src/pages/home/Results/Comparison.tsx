/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from 'react';
import {
  colors,
  makeStyles,
  useTheme
} from '@material-ui/core';
import axios from 'src/utils/axios';
import { useDispatch, useSelector } from 'src/store';
import { useWindowSize } from 'src/utils/util';
import {
  CompareHeader,
  CompareTable
} from 'src/components/Results';
import type { State } from 'src/pages/home';
import type { Theme } from 'src/theme';
import { THEMES } from 'src/utils/constants/general';
import { IComparisonType, Status } from 'src/types/comparison';

interface ComparisonProps {
  state: State;
  onState: (name: string, value: any) => void;
  visible: boolean;
}

const initialStatus: Status = {
  page: 1,
  perPage: 5,
  totalPage: 1,
  isSize: true,
  width: '150px',
  disabled: false,
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    maxHeight: '93vh',
    overflowX: 'hidden',
    overflowY: 'auto',
    backgroundColor: theme.palette.component.main
  },
  hide: {
    display: 'none',
    maxHeight: '93vh',
    overflowX: 'hidden',
    overflowY: 'auto'
  },
  dialog: {
    maxWidth: '500px',
    minHeight: '55vh'
  },
  title: {
    margin: 0,
    padding: theme.spacing(4),
    backgroundColor: THEMES.DARK
      ? theme.palette.background.light
      : colors.grey[200]
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.background.dark
  },
  select: {
    verticalAlign: 'middle',
    backgroundColor: theme.palette.background.light,
    border: `1px solid ${theme.palette.border.main}`,
    color: `${theme.palette.text.primary} !important`,
    '& .MuiSelect-iconOutlined': {
      color: theme.palette.border.main
    }
  }
}));

// Group names
export const PARAMETERS_NAME = 'Parameters';
export const RANKING_NAME = 'Ranking';
export const PERFORMANCE_NAME = 'Performance';
export const ANTENNA_OPTIONS_NAME = 'User Burden: Antenna Options';
export const MISSION_IMPACTS_NAME = 'User Burden: Mission Impacts';
export const NAV_AND_TRACKING_NAME = 'Nav and Tracking';

const Comparison: FC<ComparisonProps> = ({ state, onState, visible }) => {
  const size = useWindowSize();
  const theme = useTheme<Theme>();
  const [status, setStatus] = useState(initialStatus);
  const [source, setSource] = useState<IComparisonType>();

  const [initialData, setInitialData] = useState<IComparisonType>()

  const classes = useStyles();

  const dispatch = useDispatch();

  useEffect(() => {
    const initializeData = async () => {
      try {
        const params = {
        };

        const fetchInitialData = await axios.post<IComparisonType>('/requestComparison', params);

        setInitialData(fetchInitialData.data)
        setStatus((prevState) => ({
          ...prevState,
          page: Math.ceil(fetchInitialData.data.columnData.length / status.perPage)
        }))
      }
      catch (e) {
        console.log(e)
        throw e;
      }
    }
    initializeData();
  }, [])

  useEffect(() => {
    if (initialData !== undefined) {
      const buffer = {
        tableStructure: initialData.tableStructure,
        columnData: initialData.columnData.filter((column, index) => index >= (status.page - 1) * status.perPage && index < status.page * status.perPage),
        columnSequence: initialData.columnSequence
      }
      setSource(buffer)
    }
  }, [initialData, status])

  useEffect(() => {
    size.width > 1200 &&
      status.isSize &&
      setStatus((prevState) => ({
        ...prevState,
        isSize: false,
        perPage: status.perPage + 2
      }));

    size.width <= 1200 &&
      !status.isSize &&
      setStatus((prevState) => ({
        ...prevState,
        isSize: true,
        perPage: status.perPage - 2
      }));

    setStatus((prevState) => ({
      ...prevState,
      width: (size.width - 0.15 * size.width - 420) / 6 + 'px'
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size]);

  const handleStatus = (values: Status) => setStatus(values);

  return (
    <div className={visible ? classes.root : classes.hide}>
      <CompareHeader
        status={status}
        onStatus={handleStatus}
        handleDialog={() => { }}
        disabled={state.radioButtonSelectionId === 0}
      />
      <CompareTable
        state={state}
        status={status}
        source={source}
      />
    </div>
  );
};

export default Comparison;
