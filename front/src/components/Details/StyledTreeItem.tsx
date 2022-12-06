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
)((props: StyledTreeItemProps & { relations?: string[] }) => {
  const {
    nodeId,
    labelText,
    labelIcon: LabelIcon,
    isRowEvent,
    onClick,
    onRowClick,
    relations,
    ...rest
  } = props;
  const classes = useStyles();

  const iconElements = (relations || []).map((relation, index) => {
    if (relation === 'input') {
      return <Button icon={"import"}></Button>
    } else {
      return <Button icon={"export"}></Button>
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
