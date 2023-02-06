import { FC, useState, useEffect } from 'react';
import {
  makeStyles,
  colors,
  useTheme
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyBoardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined';
import ClearOutlinedIcon from '@material-ui/icons/ClearOutlined';
import Delete from '@material-ui/icons/Delete';
import { useSelector, useDispatch } from 'src/store';
import { updatePreference } from 'src/slices/preference';
import { AccordionSummary } from 'src/components/Results/StyledAccordion';
import type { State } from 'src/pages/home';
import type { Status } from 'src/pages/home/Results/Comparison';
import type { ICompare } from 'src/types/comparison';
import { THEMES } from 'src/utils/constants/general';
import { TooltipList } from 'src/utils/constants/tooltips';
import { USER_BURDEN_KEYS } from 'src/utils/constants/analysis';
import { addComma, parseComma } from 'src/utils/util';
import Menu from 'devextreme-react/menu';
import type { Theme } from 'src/theme';
import { ReactTable } from './ReactTable/ReactTable';
import axios from "src/utils/axios";

interface IData {
  [key: string]: string;
}

interface IColumnType<T> {
  key: string;
  name: string;
  removeEnabled?: boolean;
  width?: number;
  render?: (column: IColumnType<T>, item: T) => void;
}

interface IRowType<T> {
  key: string;
  name: string;
  rowBreakdownOptions?: string[];
  height?: number;
  render?: (row: IRowType<T>, item: T) => void;
}

export interface IRowBreakdownOption<T> {
  key: string;
  name: string;
  action: Function;
  render?: (option: IRowBreakdownOption<T>, item: T) => void;
}

interface ICellType<T> {
  key: string;
  colKey: string;
  value: string;
  rowBreakdownOptions?: IRowBreakdownOption<IData>[];
  render?: (cell: ICellType<T>, item: T) => void;
}

interface CompareTableProps {
  state: State;
  status: Status;
  result: ICompare;
  source: ICompare;
  rankState: boolean;
  onStatus: (values) => void;
  onModal: (values) => void;
  onResult: (values: ICompare) => void;
  onSelect: (index: number) => void;
  handlePlotOptions: (name: string, value: boolean) => void;
}

interface IAccordion {
  [key: string]: boolean;
}

const initialAccordion: IAccordion = {
  'table-group-Parameters': true,
  'table-group-Nav and Tracking': true,
  'table-group-Performance': true,
  'table-group-Ranking': true,
  'table-group-User Burden: Antenna Options': true,
  'table-group-User Burden: Mission Impacts': true
};

const DEEP_DIVE_PARAMS = [
  'Effective Comms Time (%)',
  'RF Coverage (%)',
  'Average Gap (minutes)',
  'Tracking Rate (deg/s)',
  'Slew Rate (deg/s)',
  'Pointing-Adjusted RF Coverage (%)',
  'Mean Number of RF Contacts Per Orbit',
  'Mean RF Contact Duration (seconds)',
  'Max RF Coverage Gap (minutes)',
  'Mean Response Time (seconds)',
  'RF Coverage (minutes/day)',
  'Contacts Per Day',
  'Average Contact Duration (minutes)',
  'Max Coverage Duration (minutes)',
  'Max Gap (minutes)',
  'Mean Response Time (minutes)'
];

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    margin: theme.spacing(3),
    overflowY: 'hidden',
    overflowX: 'scroll'
  },
  table: {
    '& .MuiTableCell-root': {
      borderBottom: `1px solid ${theme.palette.border.main}`
    }
  },
  tooltip: {
    maxWidth: '500px'
  },
  analyzeResultLink: {
    textDecoration: 'underline !important',
    '&:hover': {
      cursor: 'pointer !important',
      color: '#3f51b5 !important'
    }
  },
  iconBtn: {
    padding: theme.spacing(1)
  },
  rankingLabel: {
    width: '20px',
    height: '20px',
    border: '3px solid ' + colors.grey[700],
    borderRadius: '10px',
    color: colors.grey[700],
    fontSize: '15px',
    fontWeight: 'bold',
    position: 'relative'
  },
  column: {
    backgroundColor: theme.palette.background.light,
    padding: 0
  },
  normalPointer: {
    userSelect: 'none',
    MozUserSelect: 'none',
    WebkitUserSelect: 'none',
    msUserSelect: 'none',
    cursor: 'default'
  },
  paramName: {
    display: 'inline-block',
    verticalAlign: 'middle'
  },
  graphMenu: {
    display: 'inline-block',
    verticalAlign: 'middle'
  },
  accordion: {
    backgroundColor: theme.palette.component.main
  }
}));

interface IGroupItem {
  name: string;
  key: string;
  rowBreakdownOptions: string[];
}
interface IGroup {
  name: string;
  info: string | null;
  items: IGroupItem[];
}
interface ITableStructure {
  group: IGroup[];
  rowBreakdownOptions: IRowBreakdownOption<IData>[]
}
interface IColumnData {
  name: string;
  key: string;
  data: IData[]
}
interface IComparisonType {
  tableStructure: ITableStructure;
  columnData: IColumnData[];
  columnSequence: string[]
}

const CompareTable: FC<CompareTableProps> = ({
  state,
  status,
  result,
  source,
  rankState,
  onStatus,
  onModal,
  onResult,
  onSelect,
  handlePlotOptions
}) => {
  const classes = useStyles();
  const theme = useTheme<Theme>();
  
  const [initialData, setInitialData] = useState<IComparisonType>()
  
  const [columns, setColumns] = useState<IColumnType<IData>[]>([])
  const [rowNames, setRowNames] = useState<IRowType<IData>[]>([])
  const [rowBreakdownOptions, setRowBreakdownOptions] = useState<IRowBreakdownOption<IData>[]>([])
  const [cellData, setCellData] = useState<IData[]>([])
  const [columnSequence, setColumnSequence] = useState<string[]>([])
  const [pageLoaded, setPageLoaded] = useState<boolean>(false)
  const [sortString, setSortString] = useState<string>('')
  
  const deleteColumn = (columnKey: string) => {
    const columnsBuffer = columns;
    setColumns(columnsBuffer.filter((column) => column.key !== columnKey))
    const dataBuffer = cellData;
    const newData = dataBuffer.map((row) => {
      delete row[columnKey];
      return row;
    })
    setCellData(newData);
  }

  const sortColumn = () => {
    const columnsBuffer = [...columns];
    const sortedColumns = columnsBuffer.sort((column1, column2) => {
      const idx1 = columnSequence.indexOf(column1.key)
      const idx2 = columnSequence.indexOf(column2.key)
      if (column2.key === 'comparison') {
        return 0;
      }
      return idx1 - idx2;
    })
    setColumns(sortedColumns)
  }

  useEffect(() => {
    const initializeData = async () => {
      try {
				const params = {
				};
        
        const initialData = await axios.post<IComparisonType>('/requestComparison', params);

        setInitialData(initialData.data)
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
      // Columns
      const columnData = initialData.columnData
      const columnsBuffer = [
        { key: 'comparison', name: "" },
        ...columnData.map((column) => {
          return { key: column.key, name: column.name, removeEnabled: true }
        })
      ]
      setColumns(columnsBuffer);
      // Column sequence
      const sequenceData = initialData.columnSequence;
      setSortString(sequenceData.toString());
      // Row Breakdown options
      const optionsData = initialData.tableStructure.rowBreakdownOptions;
      setRowBreakdownOptions(optionsData);
      // Row names
      const rowData = initialData.tableStructure.group;
      const rows = rowData.map((group, idx) => {
        return [
          {
            name: group.name,
            key: `group_${idx}`
          }, ...group.items];
      }).flat();
      setRowNames(rows);
    }
  }, [initialData])

  useEffect(() => {
    const handleData = () => {
      if (!pageLoaded) {
        const comparison = rowNames.map((row: IRowType<IData>): ICellType<IData> => {
          return {
            key: row.key,
            colKey: "comparison",
            value: row.name,
            rowBreakdownOptions: row.rowBreakdownOptions
                  ? row.rowBreakdownOptions
                    .map((key) => (rowBreakdownOptions.filter((option) => option.key === key)[0]))
                  : undefined
          }
        })
        // fetch data initially
        const columnData = initialData.columnData.map((column) => {
          return column.data.map((row: IData): ICellType<IData> => {
            return {
              key: row.key,
              colKey: column.key,
              value: row.value
            }
          })
        })
        // combine row names to data
        columnData.unshift(comparison)

        const processed = columnData[0].map((rowKey, idx) => {
          return columnData.map(row => {
            return row.filter((cell) => cell.key === rowKey.key)[0]
          })
        }).map((row) => {
          let grouped = {}
          row.filter(cell => cell !== undefined).map((cell) => {
            grouped = {
              ...grouped,
              [cell.colKey]: cell.value
            }
            return { [cell.colKey]: cell.value }
          })
          grouped = {
            ...grouped,
            rowBreakdownOptions: row[0].rowBreakdownOptions
          }
          return grouped
        })
        setCellData(processed)
      } else {
        // Todo: need to manage table data
        // const columnData = [...data]
        // setCellData(columnData)
      }
    }
    if (initialData !== undefined) {
      handleData()
    }
  }, [initialData, columns, rowNames, rowBreakdownOptions, cellData, pageLoaded])

  useEffect(() => {
    if (cellData.length) {
      setPageLoaded(true)
    }
  }, [cellData])

  useEffect(() => {
    const handleColumnSequence = () => {
      const sequenceData = sortString.split(',');
      const columnData = [...columns];
      sequenceData.push(...columnData.map((column) => column.key).filter((column) => column !== 'comparison'));
      const buffer = sequenceData.filter((c, index) => {
        return sequenceData.indexOf(c) === index;
      });
      setColumnSequence(buffer);
    }
  
    handleColumnSequence();
  }, [sortString, columns])

  return (
    <div data-rank-table='true' className={classes.root}>
      <ReactTable data={cellData} columns={columns} actions={{ deleteColumn: deleteColumn}} />
      <input type={'text'} value={sortString} onChange={(e) => {setSortString(e.target.value);}} />
      <button onClick={sortColumn}>Sort</button>
    </div>
  );
};

export default CompareTable;
