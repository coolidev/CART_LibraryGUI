import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';
import { Typography, IconButton } from '@material-ui/core';
import { Input } from '@material-ui/icons';
import {
  fade,
  withStyles,
  makeStyles,
  Theme,
  createStyles
} from '@material-ui/core';
import TreeItem, { TreeItemProps } from '@material-ui/lab/TreeItem';
import Collapse from '@material-ui/core/Collapse';
import { useSpring, animated } from 'react-spring'; // web.cjs is required for IE 11 support
import { TransitionProps } from '@material-ui/core/transitions';
import { Button } from 'devextreme-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { IconProp } from '@fortawesome/fontawesome-svg-core';

type StyledTreeItemProps = TreeItemProps & {
  labelText: string;
  nodeId: string;
  isRowEvent?: boolean;
  labelIcon?: React.ElementType<SvgIconProps>;
  onClick?: (event, nodeId) => void;
  onRowClick?: () => void;
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0.5, 0)
  },
  labelText: {
    fontWeight: 'inherit',
    flexGrow: 1
  },
  labelIcon: {
    fontWeight: 'inherit', //theme.typography.fontWeightLight,
    fontSize: theme.typography.pxToRem(15)
  },
  btn: {
    padding: 0
  },
  relationIcon: {
    padding: '0.5px',
    margin: '0.5px 1.5px',
    borderRadius: '50%'
  },
  onHoldRelationIcon: {
    padding: '0.5px',
    margin: '0.5px 1.5px',
    borderRadius: '50%',
    backgroundColor: 'black',
    color: 'white'
  }
}));

export const MinusSquare = (props: SvgIconProps) => {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
    </SvgIcon>
  );
};

export const PlusSquare = (props: SvgIconProps) => {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
    </SvgIcon>
  );
};

export const InputIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon fontSize='inherit' style={{ width: 18, height: 18 }} {...props} viewBox="0 0 864.000000 864.000000">
      <g transform="translate(0.000000, 864.000000) scale(0.100000,-0.100000)" stroke="none">
        <path d="M1390 4275 l0 -2925 2030 0 2030 0 0 505 0 505 -1530 0 -1530 0 2 1913 3 1912 1528 3 1527 2 0 505 0 505 -2030 0 -2030 0 0 -2925z"/>
        <path d="M5080 5334 c-80 -46 -152 -88 -160 -94 -8 -5 -40 -23 -70 -40 -30 -16 -73 -41 -95 -55 -22 -13 -56 -33 -75 -43 -38 -21 -147 -83 -195 -113 -16 -10 -70 -41 -120 -69 -49 -28 -108 -61 -130 -75 -22 -14 -47 -28 -55 -32 -16 -9 -230 -131 -258 -148 -9 -6 -52 -31 -95 -55 -44 -25 -95 -55 -115 -67 -21 -12 -44 -26 -52 -30 -17 -9 -158 -89 -180 -103 -8 -5 -60 -35 -115 -66 -55 -32 -104 -61 -108 -65 -5 -4 53 -42 130 -85 76 -44 145 -83 154 -89 9 -5 59 -34 110 -63 52 -29 112 -64 134 -77 22 -13 82 -48 133 -77 51 -29 110 -63 130 -75 20 -13 44 -26 52 -30 54 -28 157 -89 168 -100 7 -7 17 -13 21 -13 7 0 150 -82 211 -120 8 -5 56 -32 105 -60 50 -28 108 -61 130 -75 22 -13 81 -47 130 -75 50 -28 108 -61 130 -75 22 -13 65 -38 95 -55 89 -49 119 -67 135 -80 13 -11 15 26 17 316 l3 329 1178 3 1177 2 0 500 0 500 -1177 2 -1178 3 -3 318 c-1 174 -6 317 -10 316 -4 -1 -72 -39 -152 -85z"/>
      </g>
    </SvgIcon>
  )
}

export const OutputIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon fontSize='inherit' style={{ width: 18, height: 18 }} {...props} viewBox="0 0 864.000000 864.000000">
      <g transform="translate(0.000000, 864.000000) scale(0.100000,-0.100000)" stroke="none">
        <path d="M1540 4340 l0 -2920 2030 0 2030 0 0 500 0 500 -1525 0 -1525 0 0 1915 0 1915 1525 0 1525 0 0 505 0 505 -2030 0 -2030 0 0 -2920z"/>
        <path d="M5758 5163 l-3 -318 -1177 -3 -1178 -2 0 -500 0 -500 1180 0 1180 0 0 -325 c0 -179 2 -325 4 -325 3 0 769 442 1136 655 158 92 331 192 485 280 61 34 126 72 145 83 19 12 76 44 127 73 51 29 90 56 87 60 -2 4 -17 14 -32 22 -15 8 -56 31 -92 52 -36 21 -81 46 -100 57 -19 10 -51 28 -70 39 -19 12 -98 58 -175 102 -77 44 -175 101 -218 126 -100 58 -85 50 -462 268 -176 101 -327 188 -335 193 -36 21 -380 219 -431 248 -31 18 -59 32 -63 32 -3 0 -7 -143 -8 -317z"/>
      </g>
    </SvgIcon>
  )
}

const TransitionComponent = (props: TransitionProps) => {
  const style = useSpring({
    from: { opacity: 0, transform: 'translate3d(20px,0,0)' },
    to: {
      opacity: props.in ? 1 : 0,
      transform: `translate3d(${props.in ? 0 : 20}px,0,0)`
    }
  });

  return (
    <animated.div style={style}>
      <Collapse {...props} />
    </animated.div>
  );
};

export const StyledTreeItem = withStyles((theme: Theme) =>
  createStyles({
    iconContainer: {
      '& .close': {
        opacity: 0.3
      }
    },
    group: {
      marginLeft: 7,
      paddingLeft: 18,
      borderLeft: `1px dashed ${fade(theme.palette.text.primary, 0.4)}`
    }
  })
)((props: StyledTreeItemProps & { relations?: string[], onRelationCLick?: Function, onRelationEject?: Function, relationHoldID?: number }) => {
  const {
    nodeId,
    labelText,
    labelIcon: LabelIcon,
    isRowEvent,
    onClick,
    onRowClick,
    relations,
    onRelationCLick,
    onRelationEject,
    relationHoldID,
    ...rest
  } = props;
  const classes = useStyles();

  const iconElements = (relations || []).map((relation, index) => {
    const properties = relation.split('_')
    if (properties[1] === 'output') {
      return <OutputIcon className={`${properties[2] === relationHoldID.toString() ? classes.onHoldRelationIcon : classes.relationIcon}`} onMouseDown={() => {onRelationCLick(properties[2])}} onMouseUp={() => {onRelationEject()}} onMouseLeave={() => {onRelationEject()}} />
    }
    if (properties[1] === 'input') {
      return <InputIcon className={`${properties[2] === relationHoldID.toString() ? classes.onHoldRelationIcon : classes.relationIcon}`} onMouseDown={() => {onRelationCLick(properties[2])}} onMouseUp={() => {onRelationEject()}} onMouseLeave={() => {onRelationEject()}} />
    }
  })

  return (
    <TreeItem
      nodeId={nodeId}
      label={
        <>
          {!LabelIcon ? (
            <>
              {isRowEvent ? (
                <div className={classes.root} onClick={() => onRowClick()}>
                  <Typography variant="body2" className={classes.labelText}>
                    {props.labelText}
                    {iconElements}
                  </Typography>
                </div>
              ) : (
                <div className={classes.root}>
                  <Typography variant="body2" className={classes.labelText}>
                    {props.labelText}
                    {iconElements}
                  </Typography>
                </div>
              )}
            </>
          ) : (
            <div className={classes.root}>
              <Typography variant="body2" className={classes.labelText}>
                {props.labelText}
                {iconElements}
              </Typography>
              <IconButton
                className={classes.btn}
                onClick={(event) => onClick(event, nodeId)}
              >
                <LabelIcon color="inherit" className={classes.labelIcon} />
              </IconButton>
            </div>
          )}
        </>
      }
      TransitionComponent={TransitionComponent}
      {...rest}
    />
  );
});
