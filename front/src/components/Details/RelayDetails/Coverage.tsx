import React from 'react';
import { Grid, makeStyles, Theme } from '@material-ui/core';
import DialogBox from 'src/components/DialogBox';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    minWidth: theme.spacing(350) + 'px !important',
    minHeight: theme.spacing(150) + 'px !important',
    maxWidth: theme.spacing(350) + 'px !important',
    maxHeight: theme.spacing(150) + 'px !important'
  },
  visualizer: {
    minHeight: theme.spacing(125) + '!important',
    maxHeight: theme.spacing(125) + '!important',
    minWidth: theme.spacing(290) + '!important',
    maxWidth: theme.spacing(290) + '!important',
    margin: 'auto'
  }
}));

function Coverage(props) {
  const token = localStorage.getItem('tokens').slice(1, -1);
  const message = 'Too many satellites to render';
  const classes = useStyles();

  const alt = '300';
  const inc = '30';
  let url: string = '';
  if (props.system === 'spacex_1110') {
    url = message;
  } else if (props.system) {
    url = `https://cart.teltrium.com/visualizer/?config=${props.system}&token=${token}&alt=${alt}&inc=${inc}&panel=true`;
  }

  return (
    <DialogBox
      title={'Coverage Visualizer'}
      isOpen={props.isOpen}
      onClose={() => props.onClose()}
      className={{ paper: classes.root }}
    >
      <Grid className={classes.visualizer}>
        {url && url !== message ? (
          <iframe className={classes.visualizer} src={url} title="ifr"></iframe>
        ) : (
          <p
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%'
            }}
          >
            {url}
          </p>
        )}
      </Grid>
    </DialogBox>
  );
}

export default Coverage;
