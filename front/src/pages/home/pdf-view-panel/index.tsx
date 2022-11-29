import React, { FC } from 'react';
import Viewer, { Worker } from '@phuocng/react-pdf-viewer';
import '@phuocng/react-pdf-viewer/cjs/react-pdf-viewer.css';
import { importAll } from 'src/utils/util';
import Layout from './pdf-layout';
import DialogBox from 'src/components/DialogBox';
import { makeStyles, Theme } from '@material-ui/core';

interface PDFViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  dialog: {
    minWidth: '70vw',
    minHeight: '90vh',
    maxWidth: '70vw',
    maxHeight: '90vh',
  }
}));

export const PDFViewerADD: FC<PDFViewerProps> = ({ isOpen, onClose }) => {
  const classes = useStyles();
  const files = importAll(
    require['context']('../../../../public/static/pdf/add', false, /\.(pdf)$/)
  );
  const handleClose = () => onClose();

  return (
    <div className={classes.root}>
      <DialogBox
        title="Algorithm Description Document"
        isOpen={isOpen}
        onClose={handleClose}
        className={{ paper: classes.dialog }}
      >
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.4.456/build/pdf.worker.min.js">
          <Viewer
            fileUrl={files[0]?.default}
            layout={Layout}
            defaultScale={1.5}
          />
        </Worker>
      </DialogBox>
    </div>
  );
};

export const PDFViewerGuide: FC<PDFViewerProps> = ({ isOpen, onClose }) => {
  const classes = useStyles();
  const files = importAll(
    require['context']('../../../../public/static/pdf/guide', false, /\.(pdf)$/)
  );
  const handleClose = () => onClose();

  return (
    <div className={classes.root}>
      <DialogBox
        title="Users Guide"
        isOpen={isOpen}
        onClose={handleClose}
        className={{ paper: classes.dialog }}
      >
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.4.456/build/pdf.worker.min.js">
          <Viewer
            fileUrl={files[0]?.default}
            layout={Layout}
            defaultScale={1.5}
          />
        </Worker>
      </DialogBox>
    </div>
  );
};
