import { useEffect, useState } from 'react';
import { Grid } from "@material-ui/core";
import { CheckBox } from "devextreme-react";
import { FC } from "react";
import { ConnectivitySource } from "..";

interface ConnectivityPanelProps {
  id: number;
  selected: string[];
  source: ConnectivitySource[];
  updateConnectivity: Function;
}

const ConnectivityPanel: FC<ConnectivityPanelProps> = ({ id, selected, source, updateConnectivity }) => {
  const [outputTo, setOutputTo] = useState<ConnectivitySource[]>([]);
  const [inputFrom, setInputFrom] = useState<ConnectivitySource[]>([]);

  useEffect(() => {
    const output = []
    const input = []
    source.filter((one) => {
      return (selected.toString().replace(/^,+|,+$/gm,'') == [one.platform_1, one.antenna_1, one.rfFrontEnd_1, one.modDemod_1].toString().replace(/^,+|,+$/gm,''))
    }).forEach((value, index) => {
      if (value.down === true) {
        output.push(value)
      }
      else {
        input.push(value)
      }
    })
    setOutputTo(output)
    setInputFrom(input)
  }, [selected])

  // useEffect(() => {
  //   console.log(outputTo.map(one => one.isconnected))
  // }, [outputTo])

  const handleConnectivity = (id: number, indexInList: number) => {
    let newConnectivity = outputTo
    newConnectivity[indexInList].isconnected = !newConnectivity[indexInList].isconnected
    setOutputTo([...newConnectivity])
    updateConnectivity(id)
  } // this comes from super component

  return (<>
    <Grid container spacing={4}>
      <Grid item xs={6}>
        <h5>Select output to:</h5>
        <Grid style={{ height: '300px', backgroundColor: "white", border: 'solid 1px blue', overflowY: "scroll", padding: "1rem" }}>
          {outputTo.map((source, index) => (
            <div 
              key={source.id + '_' + index}
              className="dx-field"
            >
              <CheckBox
                defaultValue={source.isconnected}
                text={`${[source.platform_2, source.antenna_2, source.rfFrontEnd_2, source.modDemod_2].join('/').replace(/^\/+|\/+$/gm,'')}`}
                onValueChanged={() => {handleConnectivity(source.id, index)}}
              />
            </div>
          ))}
        </Grid>
      </Grid>
      <Grid item xs={6}>
        <h5>Select input from:</h5>
        <Grid style={{ height: '300px', backgroundColor: "white", border: 'solid 1px blue', overflowY: "scroll", padding: "1rem" }}>
          <h6>Will do "output to" first</h6>
        </Grid>
      </Grid>
    </Grid>
  </>);
}

export default ConnectivityPanel;
