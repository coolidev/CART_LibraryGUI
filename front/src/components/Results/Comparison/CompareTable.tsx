import { FC, useState, useEffect } from 'react';
import {
  Box,
  Tooltip,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Accordion,
  AccordionDetails,
  IconButton,
  Link,
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

const initialDataSource = {
  columns: [],
  rows: []
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
    overflowX: 'hidden'
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
  const dispatch = useDispatch();
  const [pinRows, setPinRows] = useState({});
  const [dataSource, setDataSource] = useState(initialDataSource);
  const [accordion, setAccordion] = useState<IAccordion>(initialAccordion);
  const { preference } = useSelector((state) => state.preference);
  const { project } = useSelector((state) => state.project);

  useEffect(() => {
    if (!source) return;

    let rowData = [];
    let pinRowData = {};
    let colData = source.columns.slice(
      (status.page - 1) * status.amount,
      status.page * status.amount + 1
    );

    rowData = source.rows.map((group) => {
      pinRowData[group.group] = [];

      return group.rows.map((item) => {
        let rowItem = item;
        let pinItem = item.slice(0, 1);
        let columnIdxList = [];
        //rowItem = item
        //  .slice(1, item.length)
        //  .filter((dt, index) => !columnIdxList.includes(index));

        pinRowData[group.group].push(pinItem);
        return rowItem.slice(
          (status.page - 1) * status.amount + 1,
          status.page * status.amount + 1
        );
      });
    });

    const totalPage = Math.max(1, Math.ceil((source.columns.length - 1) / status.amount));
    setPinRows(pinRowData);
    onStatus((prevState) => ({ ...prevState, totalPage }));
    totalPage < status.page &&
      onStatus((prevState) => ({ ...prevState, page: totalPage }));
    setDataSource({
      columns: colData,
      rows: rowData
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source, status.page, status.amount]);

  const handleAccordion = (event) => {
    const { id } = event.currentTarget;
    const value = event.currentTarget.getAttribute('aria-expanded') === 'false';
    setAccordion((prevState) => ({ ...prevState, [id]: value }));
  };

  const handleDeepPanel = async (
    id,
    paramName,
    columnIndex: number
  ): Promise<void> => {
    const regressionQuality = source.columnData[columnIndex].state.qualityIndicators[id.split('/')[1]];
    handlePlotOptions('show_surface', regressionQuality !== 1);
    onSelect(columnIndex);
    onModal((prevState) => ({
      ...prevState,
      deep: {
        params: {
          ...state.parameters,
          ...state.specifications,
          ...state.constraints
        },
        deepDive: id,
        resultId: result.resultId,
        parameter: paramName,
        regressionQuality: regressionQuality
        //system: response.data.systemId,
        //version: systemIDs.system_attribute_version_id,
        // @ts-ignore
        //model: systemIDs.model_id
      }
    }));
    onStatus((prevState) => ({
      ...prevState,
      deepOpen: !status.deepOpen
    }));
  };

  const handleUserBurdenPopup = async (id, system, columnIndex: number) => {
    onSelect(columnIndex);
    onModal((prevState) => ({
      ...prevState,
      deep: {
        deepDive: id,
        system: system
      }
    }));
    onStatus((prevState) => ({ ...prevState, diveOpen: !status.diveOpen }));
  };

  const handleCheckRow = (id, checked, param) => {
    //const { id } = event.currentTarget;

    if (checked) {
      let data = [];
      result.rows.forEach((group) => {
        group.rows.forEach((row) => {
          if (row[0] === param) {
            data = row;
          }
        });
      });

      const systems = result.columns.slice(1);
      const paramKey = result.keyList[param];
      const vals = data.slice(1).map((item: any, i: number) => {
        item = item.toString();
        const idx = item.indexOf('cart_result');
        if (idx >= 0) {
          item = item.slice(0, idx - 1);
        }

        item = parseFloat(item);

        if (isNaN(item)) item = 0;

        return {
          key: paramKey,
          value: item,
          system_name: systems[i]
        };
      });

      let chartData = [
        {
          [param]: vals
        }
      ];

      onModal((prevState) => ({ ...prevState, chart: chartData }));
      onStatus((prevState) => ({
        ...prevState,
        checked: { [id]: checked },
        chartOpen: true
      }));
    }
  };

  const handleCompareLinePlot = (parameterName: string) => {
    const parameterKey = result.keyList[parameterName];
    const hideRegressions = source.columnData.map(c => c.state.qualityIndicators[parameterKey]).some(quality => quality === 1 && quality);
    handlePlotOptions('show_surface', !hideRegressions);
    onModal((prevState) => ({ 
      ...prevState, 
      selectedParameter: parameterKey,
      hideRegressions: hideRegressions
    }));
    onStatus((prevState) => ({
      ...prevState,
      isCompareLinePlotOpen: true
    }));
  };

  const handleColDelete = (index: number): void => {
    const saveId = result.columnMapping[index];
    const columnMapping = result.columnMapping.filter((item, i) => index !== i);
    const columns = result.columns.filter((item, i) => index !== i);
    const rows = result.rows.map((group) => ({
      group: group.group,
      rows: group.rows.map((row) => row.filter((item, i) => index !== i))
    }));
    let temp = JSON.parse(JSON.stringify(preference));
    const selected = temp.project.find((item) => item.id === project);
    selected.saves = selected.saves.filter((item) => item.id !== saveId);
    const data = [
      ...temp.project.filter((item) => item.id !== project),
      selected
    ];
    dispatch(updatePreference({ project: data }));
    // @ts-ignore
    onResult({ ...result, columns, rows, columnMapping });
  };

  return (
    <div data-rank-table='true' className={classes.root}>
      {dataSource.rows.map((group, groupIdx) => {
        if (groupIdx === 0 && !rankState) {
          return null;
        }
        if (source.rows.length !== dataSource.rows.length) return null;
        const summaryStyle =
          groupIdx % 2 === 0
            ? {
                backgroundColor: theme.palette.component.main,
                maxHeight: '20px'
              }
            : {
                backgroundColor: THEMES.DARK
                  ? theme.palette.component.main
                  : '#F8F8F8',
                maxHeight: '20px'
              };
        const arr = new Array(6 - dataSource.columns.length).fill(0);

        return (
          <div key={source['rows'][groupIdx].group}>
            <Accordion
              square
              key={source['rows'][groupIdx].group}
              className={classes.accordion}
              expanded={
                Object.keys(accordion).includes(
                  `table-group-${source['rows'][groupIdx].group}`
                ) && accordion[`table-group-${source['rows'][groupIdx].group}`]
              }
            >
              <AccordionSummary
                aria-controls="table-group"
                id={`table-group-${source['rows'][groupIdx].group}`}
                onClick={handleAccordion}
                style={summaryStyle}
              >
                {!Object.keys(accordion).includes(
                  `table-group-${source['rows'][groupIdx].group}`
                ) ||
                !accordion[`table-group-${source['rows'][groupIdx].group}`] ? (
                  <KeyBoardArrowRightIcon fontSize="small" />
                ) : (
                  <KeyboardArrowDownIcon fontSize="small" />
                )}
                <Typography
                  component="h6"
                  variant="h6"
                  style={{ fontSize: '20px' }}
                  color="textPrimary"
                >
                  {source['rows'][groupIdx].group}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Table stickyHeader size="small" className={classes.table}>
                <TableHead>
                    <TableRow>
                      {dataSource.columns.map((column, idx) => (
                        <TableCell
                          key={idx + (status.page - 1) * 5}
                          align="left"
                          style={{
                            padding: 0,
                            backgroundColor: theme.palette.background.paper
                          }}
                        >
                          <Box display="flex" alignItems="center">
                            {result.columnMapping[
                              idx + (status.page - 1) * 5
                            ] !== 'current-config' &&
                            result.columnMapping[idx] ? (
                              <IconButton
                                size="small"
                                color="primary"
                                id={`${idx}-${groupIdx}ColDeleteBtn`}
                                onClick={() =>
                                  handleColDelete(idx + (status.page - 1) * 5)
                                }
                              >
                                <Delete />
                              </IconButton>
                            ) : null}
                            <Box ml={2}>
                              {idx + (status.page - 1) * 5 != 0
                                ? column ?? 'Current Configuration'
                                : ''}
                              {result.columnMapping[
                                idx + (status.page - 1) * 5
                              ] === 'current-config'
                                ? result.columnMapping[
                                    idx + (status.page - 1) * 5
                                  ] === 'current-config' &&
                                  (column ? <span>&nbsp;(current)</span> : null)
                                : null}
                            </Box>
                          </Box>
                        </TableCell>
                      ))}
                      {arr.map((item, idx) => (
                        <TableCell
                          key={idx}
                          align="left"
                          style={{
                            padding: 0,
                            backgroundColor: theme.palette.background.paper
                          }}
                        >
                          {' '}
                          <Box ml={2}>{''}</Box>
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {group.map((row, index) => {
                      const rowId = source.rows[groupIdx].rows[index][0]
                        // @ts-ignore
                        .split(' ')
                        .join('_');
                      const checked = status.checked?.[rowId]
                        ? !status.checked[rowId]
                        : true;

                      return (
                        <TableRow
                          role="checkbox"
                          tabIndex={-1}
                          key={`${rowId}-${status.page}`}
                          style={{ background: theme.palette.component.main }}
                          hover
                        >
                          {pinRows[source['rows'][groupIdx].group][index].map(
                            (item: any, idx: number) => {
                              const align = 'left';
                              const width: any =
                                idx === 0
                                  ? {
                                      maxWidth: '350px',
                                      minWidth: '350px',
                                      fontWeight: 'bold'
                                    }
                                  : {};
                              const paramName =
                                source['rows'][groupIdx].rows[index][0];

                              if (
                                item.toString().includes('cart_result_success')
                              ) {
                                if (
                                  // @ts-ignore
                                  paramName.toLowerCase().includes('year')
                                ) {
                                  item = item.replace(
                                    'cart_result_success',
                                    ''
                                  );
                                } else {
                                  const displayVal = item.replace(
                                    'cart_result_success',
                                    ''
                                  );
                                  item = !isNaN(parseFloat(displayVal))
                                    ? addComma(
                                        parseFloat(displayVal)
                                      ).toString()
                                    : displayVal;
                                }
                              } else if (
                                item.toString().includes('cart_result_fail')
                              ) {
                                if (
                                  // @ts-ignore
                                  paramName.toLowerCase().includes('year')
                                ) {
                                  item = item.replace('cart_result_fail', '');
                                } else {
                                  const displayVal = item.replace(
                                    'cart_result_fail',
                                    ''
                                  );
                                  item = !isNaN(parseFloat(displayVal))
                                    ? addComma(
                                        parseFloat(displayVal)
                                      ).toString()
                                    : displayVal;
                                }
                              }

                              const paramKey = result.keyList[paramName];

                              return (
                                <TableCell
                                  key={`group_${source['rows'][groupIdx].group}_${rowId}_${idx}`}
                                  id={`group_${source['rows'][groupIdx].group}_${rowId}_${idx}`}
                                  style={width}
                                  align={align}
                                >
                                  <div className={classes.normalPointer}>
                                    {TooltipList[paramKey] ? (
                                      <Tooltip
                                        title={
                                          <Typography
                                            gutterBottom
                                            component="p"
                                            variant="body1"
                                            dangerouslySetInnerHTML={{
                                              __html: TooltipList[paramKey]
                                            }}
                                          />
                                        }
                                        placement="top-start"
                                        classes={{
                                          tooltip: classes.tooltip
                                        }}
                                      >
                                        <span className={classes.paramName}>
                                          {paramName}&nbsp;
                                        </span>
                                      </Tooltip>
                                    ) : (
                                      <span className={classes.paramName}>
                                        {paramName}&nbsp;
                                      </span>
                                    )}
                                    <Menu
                                      defaultItems={DEEP_DIVE_PARAMS.includes(paramName as string)
                                        ?[
                                        {
                                          id: '0',
                                          name: '▼',
                                          icon:
                                            '/static/icons/Graph_Dropdown_Menu_Icon-Selected-SVG.svg',
                                          items: [
                                            {
                                              id: '2',
                                              name: 'View Bar Graph'
                                            },
                                            {
                                              id: '1',
                                              name: 'View Line Plot'
                                            }
                                          ]
                                        }
                                      ]
                                      :[
                                        {
                                          id: '0',
                                          name: '▼',
                                          icon:
                                            '/static/icons/Graph_Dropdown_Menu_Icon-Selected-SVG.svg',
                                          items: [
                                            {
                                              id: '2',
                                              name: 'View Bar Graph'
                                            }
                                          ]
                                        }
                                      ]
                                      
                                    }
                                      className={classes.graphMenu}
                                      displayExpr="name"
                                      disabled={row.length === 0}
                                      orientation="horizontal"
                                      onItemClick={(param) => {
                                        if (param.itemData['id'] === '2') {
                                          handleCheckRow(
                                            groupIdx,
                                            checked,
                                            paramName
                                          );
                                        } else if (param.itemData['id'] === '1') {
                                          handleCompareLinePlot(paramName.toString());
                                        }
                                      }
                                      }
                                    />
                                  </div>
                                  {/*isRankParam && (
                                    <Tooltip
                                      title={
                                        <Typography
                                          gutterBottom
                                          component="p"
                                          variant="body1"
                                          dangerouslySetInnerHTML={{
                                            __html: 'Parameter ranking weight'
                                          }}
                                        />
                                      }
                                      placement="top-start"
                                      classes={{
                                        tooltip: classes.tooltip
                                      }}
                                    >
                                      <span>
                                        <IconButton
                                          id={rowId}
                                          disabled={true}
                                          className={classes.iconBtn}
                                        >
                                          <div className={classes.rankingLabel}>
                                            <p
                                              style={{
                                                position: 'absolute',
                                                top: '-3px',
                                                left: '3px'
                                              }}
                                            >
                                              {rankParam !== 'exclude'
                                                ? rankParam
                                                : '5'}
                                            </p>
                                          </div>
                                        </IconButton>
                                      </span>
                                    </Tooltip>
                                  )*/}
                                </TableCell>
                              );
                            }
                          )}
                          {row.map((item: any, idx: number) => {
                            const col = dataSource.columns[idx];
                            const colId =
                              col !== undefined
                                ? 'col_' + col.split(' ').join('_') + '_'
                                : '';
                            const paramName =
                              source['rows'][groupIdx].rows[index][0];
                            let val: any = item;

                            if (item === null) {
                              val = <div>{'-'}</div>;
                            } else if (item === true) {
                              val = (
                                <CheckOutlinedIcon
                                  style={{ color: colors.green[500] }}
                                />
                              );
                            } else if (item === false) {
                              val = (
                                <ClearOutlinedIcon
                                  style={{ color: colors.red[500] }}
                                />
                              );
                            } else if (
                              item?.toString().includes('cart_result_success')
                            ) {
                              // @ts-ignore
                              if (paramName.toLowerCase().includes('year')) {
                                item = item.replace('cart_result_success', '');
                              } else {
                                const displayVal = item.replace(
                                  'cart_result_success',
                                  ''
                                );
                                item = !isNaN(parseFloat(displayVal))
                                  ? addComma(parseFloat(displayVal)).toString()
                                  : displayVal;
                              }
                              val = (
                                <div>
                                  {item}{' '}
                                  <CheckOutlinedIcon
                                    fontSize="small"
                                    style={{ color: colors.green[500] }}
                                  />
                                </div>
                              );
                            } else if (
                              item?.toString().includes('cart_result_fail')
                            ) {
                              // @ts-ignore
                              if (paramName.toLowerCase().includes('year')) {
                                item = item.replace('cart_result_fail', '');
                              } else {
                                const displayVal = item.replace(
                                  'cart_result_fail',
                                  ''
                                );
                                item = !isNaN(parseFloat(displayVal))
                                  ? addComma(parseFloat(displayVal)).toString()
                                  : displayVal;
                              }
                              val = (
                                <div>
                                  {item}{' '}
                                  <ClearOutlinedIcon
                                    fontSize="small"
                                    style={{ color: colors.red[500] }}
                                  />
                                </div>
                              );
                            }

                            val =
                              !isNaN(parseFloat(val)) &&
                              paramName !== 'Relative Overall Performance' &&
                              paramName !== 'Fwd Link Frequency Band (MHz)' &&
                              paramName !== 'Rtn Link Frequency Band (MHz)' &&
                              paramName !==
                                'Spectrum Regulatory Status - Fwd Link Frequency' &&
                              paramName !==
                                'Spectrum Regulatory Status - Rtn Link Frequency' &&
                              // @ts-ignore
                              !paramName.toLowerCase().includes('year')
                                ? addComma(parseFloat(val).toString())
                                : val;

                            let value: any = val;
                            const isDeepDive =
                              DEEP_DIVE_PARAMS.includes(paramName as string) &&
                              !isNaN(parseFloat(parseComma(val)));
                            const isUserBurden =
                              USER_BURDEN_KEYS.hasOwnProperty(paramName);

                            value =
                              col !== undefined && isDeepDive ? (
                                <Link
                                  id={`${col}/${result.keyList[paramName]}`}
                                  onClick={() =>
                                    handleDeepPanel(
                                      `${col}/${result.keyList[paramName]}`,
                                      paramName,
                                      idx
                                    )
                                  }
                                  className={classes.analyzeResultLink}
                                >
                                  {value}
                                </Link>
                              ) : (
                                value
                              );

                            value =
                              col !== undefined && isUserBurden ? (
                                <Link
                                  id={`${col.split(' ').join('_')}/${
                                    result.keyList[paramName]
                                  }`}
                                  onClick={() =>
                                    handleUserBurdenPopup(
                                      `${col}/${result.keyList[paramName]}`,
                                      col,
                                      idx
                                    )
                                  }
                                  className={classes.analyzeResultLink}
                                >
                                  {value}
                                </Link>
                              ) : (
                                value
                              );

                            value =
                              col !== undefined &&
                              paramName === 'Mission Requirements Not Met' ? (
                                <div>
                                  {value}{' '}
                                  {value !== '0' ? (
                                    <ClearOutlinedIcon
                                      fontSize="small"
                                      style={{ color: colors.red[500] }}
                                    />
                                  ) : (
                                    <CheckOutlinedIcon
                                      fontSize="small"
                                      style={{ color: colors.green[500] }}
                                    />
                                  )}
                                </div>
                              ) : (
                                value
                              );

                            return (
                              <TableCell
                                id={`${colId}${rowId}`}
                                key={`group_${source['rows'][groupIdx].group}_${colId}${rowId}_${idx}`}
                                align="left"
                                style={{
                                  padding: 0,
                                  maxWidth: status.width,
                                  minWidth: status.width
                                }}
                              >
                                {isNaN(value)
                                  ? value
                                  : value.toLocaleString('en-US')}
                              </TableCell>
                            );
                          })}
                          {arr.map((item, idx) => (
                            <TableCell
                              key={idx}
                              align="left"
                              style={{
                                padding: 0,
                                maxWidth: status.width,
                                minWidth: status.width
                              }}
                            >
                              {' '}
                              <Box ml={2}>{''}</Box>
                            </TableCell>
                          ))}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </AccordionDetails>
            </Accordion>
          </div>
        );
      })}
      <Box display="flex" p={4} justifyContent="flex-end">
        <Pagination
          count={status.totalPage}
          page={status.page}
          defaultPage={1}
          color="primary"
          variant="text"
          shape="rounded"
          onChange={(e, page) =>
            onStatus((prevState) => ({ ...prevState, page }))
          }
          style={{
            justifyContent: 'flex-end',
            display: 'flex'
          }}
        />
      </Box>
    </div>
  );
};

export default CompareTable;
