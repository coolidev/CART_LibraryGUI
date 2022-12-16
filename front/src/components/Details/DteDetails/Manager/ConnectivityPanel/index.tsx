import { useEffect, useState } from 'react';
import { Grid, makeStyles, Theme } from "@material-ui/core";
import { CheckBox } from "devextreme-react";
import { FC } from "react";
import { ConnectivitySource } from "..";
import { SubSection } from 'src/types/details';

interface ConnectivityPanelProps {
  id: number;
  selected: string[];
  selectedSource: SubSection[];
  relations: ConnectivitySource[];
  updateConnectivity: Function;
}

const useStyles = makeStyles((theme: Theme) => ({
  checkBox: {
    '& .dx-checkbox-icon': {
      backgroundColor: 'white',
      border: '2px solid rgba(0,0,0,.54)'
    },
    '&.dx-checkbox-checked .dx-checkbox-icon::before': {
      color: 'black',
      content: '"\\00d7"'
    }
  }
}))

const ConnectivityPanel: FC<ConnectivityPanelProps> = ({ id, selected, selectedSource, relations, updateConnectivity }) => {
  const [outputTo, setOutputTo] = useState<ConnectivitySource[]>([]);
  const [inputFrom, setInputFrom] = useState<ConnectivitySource[]>([]);

  const classes = useStyles()

  const getTreeID = (param) => {
    return [param.platform_Id, param.antenna_Id, param.rfFrontEnd_Id, param.modDemod_Id].join('_').replace(/^_+|_+$/gm,'')
  }

  useEffect(() => {
    const output = []
    const input = []

    const selectedKey = selectedSource.length > 0 ? getTreeID(selectedSource[0]) : ''

    relations.forEach((one) => {
      if (selectedKey == [one.platform_1_id, one.antenna_1_id, one.rfFrontEnd_1_id, one.modDemod_1_id].join('_').replace(/^_+|_+$/gm,'')) {
        output.push(one)
      }
      if (selectedKey == [one.platform_2_id, one.antenna_2_id, one.rfFrontEnd_2_id, one.modDemod_2_id].join('_').replace(/^_+|_+$/gm,'')) {
        input.push(one)
      }
    })

    setOutputTo(output)
    setInputFrom(input)
  }, [selected, selectedSource])

  const handleConnectivity = (id: number, indexInList: number, isOutput: boolean) => {
    let newConnectivity = isOutput ? outputTo : inputFrom
    newConnectivity[indexInList].isconnected = !newConnectivity[indexInList].isconnected
    if (isOutput) {
      setOutputTo([...newConnectivity])
    } else {
      setInputFrom([...newConnectivity])
    }
    updateConnectivity(id)
  } // this comes from super component

  return (<>
    <Grid container spacing={4}>
      <Grid item xs={6}>
        <h5>Select output to:</h5>
        <Grid style={{ height: '300px', backgroundColor: "white", border: 'solid 1px', overflowY: "scroll", padding: "1rem" }}>
          {outputTo.map((relations, index) => (
            <div 
              key={'output' + relations.id + '_' + index}
              className="dx-field"
            >
              <CheckBox
                defaultValue={relations.isconnected}
                text={`${[relations.platform_2, relations.antenna_2, relations.rfFrontEnd_2, relations.modDemod_2].join('/').replace(/^\/+|\/+$/gm,'')}`}
                onValueChanged={() => {handleConnectivity(relations.id, index, true)}}
                className={classes.checkBox}
              />
            </div>
          ))}
        </Grid>
      </Grid>
      <Grid item xs={6}>
        <h5>Select input from:</h5>
        <Grid style={{ height: '300px', backgroundColor: "white", border: 'solid 1px', overflowY: "scroll", padding: "1rem" }}>
          {inputFrom.map((relations, index) => (
            <div 
              key={'input' + relations.id + '_' + index}
              className="dx-field"
            >
              <CheckBox
                defaultValue={relations.isconnected}
                text={`${[relations.platform_1, relations.antenna_1, relations.rfFrontEnd_1, relations.modDemod_1].join('/').replace(/^\/+|\/+$/gm,'')}`}
                onValueChanged={() => {handleConnectivity(relations.id, index, false)}}
                className={classes.checkBox}
              />
            </div>
          ))}
        </Grid>
      </Grid>
    </Grid>
  </>);
}

export default ConnectivityPanel;
