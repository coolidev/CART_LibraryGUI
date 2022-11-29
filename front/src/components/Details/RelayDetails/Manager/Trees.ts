export interface TreeItemTab {
  key: string;
  name: string;
}

export interface TreeItem {
  key: string;
  name: string;
  node: number;
  tabs: TreeItemTab[];
}

export const TREES: TreeItem[] = [
  {
    key: 'overview',
    name: 'Network Overview',
    node: 0,
    tabs: [
      {
        key: 'Relay Communications Topology - General',
        name: 'General'
      },
      {
        key: 'Navigation',
        name: 'Navigation'
      },
      {
        key: 'Other: Modeling',
        name: 'Other'
      }
    ]
  },
  {
    key: 'Constellation Topology',
    name: 'Constellation',
    node: 1,
    tabs: []
  },
  {
    key: 'rx-tx',
    name: 'Rx/Tx',
    node: 2,
    tabs: [
      {
        key: 'Relay Communications Topology - Return Link',
        name: 'Rx'
      },
      {
        key: 'Relay Communications Topology - Forward Link',
        name: 'Tx'
      }
    ]
  },
  {
    key: 'Ground Topology',
    name: 'Gateway Cluster',
    node: 1,
    tabs: []
  }
];
