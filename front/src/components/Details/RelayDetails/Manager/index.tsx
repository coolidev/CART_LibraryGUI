import { FC, useEffect, useState } from 'react';
import {
  Grid,
  Box,
  Breadcrumbs,
  Link,
  Typography,
  Tabs,
  Tab,
  makeStyles,
  Theme
} from '@material-ui/core';
import TreeView from '@material-ui/lab/TreeView';
import {
  StyledTreeItem,
  PlusSquare,
  MinusSquare
} from 'src/components/Details/StyledTreeItem';
import type { Source } from 'src/components/Details/RelayDetails';
import { Section, SubSection } from 'src/types/details';
import { TREES, TreeItem, TreeItemTab } from './Trees';
import DataTable from './DataTable';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(1)
  },
  tree: {
    height: '50vh',
    padding: theme.spacing(5),
    flexGrow: 1,
    overflow: 'auto'
  },
  main: {
    height: '50vh',
    padding: theme.spacing(5),
    overflow: 'auto'
  },
  dialog: {
    width: '25vw'
  }
}));

const Manager: FC<Source> = ({ id, detail, isAdmin }) => {
  const classes = useStyles();
  const [results, setResults] = useState<SubSection[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [tab, setTab] = useState<string>(TREES[0]?.tabs[0].name);

  useEffect(() => {
    setSelected(new Array('Network Overview'));
  }, []);

  useEffect(() => {
    let value: string;

    if (selected.length === 0 || selected.length === 1) {
      value = TREES[0]?.tabs[0].name;
    } else {
      value = TREES.find(
        (tree: TreeItem) => tree.name === selected[selected.length - 1]
      )?.tabs[0]?.name;
    }
    setTab(value);
  }, [selected]);

  useEffect(() => {
    let key: string;

    if (tab) {
      TREES.forEach((tree: TreeItem) =>
        tree?.tabs.forEach((item: TreeItemTab) => {
          if (item.name === tab) key = item.key;
        })
      );
    } else {
      key = TREES.find(
        (tree: TreeItem) => tree.name === selected[selected.length - 1]
      )?.key;
    }

    const data = detail.system_value.find(
      (item: Section) => item.section_key === key
    )?.section_value;
    data && setResults(data);
  }, [selected, tab, detail]);

  const handleSelect = (event, nodeIds) => {
    setSelected(nodeIds.split('---'));
    setTab(null);
  };

  const handleClick = (idx: number) => {
    setSelected(selected.filter((item, i) => i <= idx));
    setTab(null);
  };

  const handleChange = (event, value) => setTab(value);

  const renderTree = (node: number, parent?: string) => {
    return TREES.filter((tree: TreeItem) => tree.node === node).map(
      (tree: TreeItem, i) => {
        const nodeId = parent ? parent + `---${tree.name}` : tree.name;

        return (
          <div key={tree.key}>
            <StyledTreeItem nodeId={nodeId} labelText={tree.name}>
              {tree.node < 2 &&
                tree.key !== 'Ground Topology' &&
                renderTree(node + 1, nodeId)}
            </StyledTreeItem>
          </div>
        );
      }
    );
  };

  return (
    <Grid item md={12} className={classes.root}>
      <Box border={1}>
        <Grid container>
          <Grid item md={3}>
            <TreeView
              className={classes.tree}
              defaultExpanded={[
                'Network Overview',
                'Network Overview---Constellation'
              ]}
              selected={selected.join('---')}
              defaultCollapseIcon={<MinusSquare />}
              defaultExpandIcon={<PlusSquare />}
              onNodeSelect={handleSelect}
            >
              {renderTree(0)}
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
                      onClick={() => handleClick(idx)}
                    >
                      {item}
                    </Link>
                  ) : (
                    <Typography color="textPrimary">{item}</Typography>
                  )}
                </div>
              ))}
            </Breadcrumbs>
            {tab && selected.length > 0 && (
              <Tabs
                value={tab}
                indicatorColor="primary"
                textColor="primary"
                onChange={handleChange}
              >
                {TREES.find(
                  (tree: TreeItem, i) =>
                    tree.name === selected[selected.length - 1]
                )?.tabs.map((item: TreeItemTab, i) => (
                  <Tab key={i} label={item.name} value={item.name} />
                ))}
              </Tabs>
            )}
            <Box mt={3}>
              <DataTable
                id={id}
                isAdmin={isAdmin}
                source={selected.length > 0 ? results : []}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Grid>
  );
};

export default Manager;
