import { FC, useEffect, useState } from 'react';
import TagBox from 'devextreme-react/tag-box';
import TextBox from 'devextreme-react/text-box';
import { Box, Switch } from 'devextreme-react';
import FormControl from '@material-ui/core/FormControl';
import { MenuItem, Select } from '@material-ui/core';
import { multiSelectList } from  './AdvancedOptions'
import axios from 'axios';
import { string } from 'yup';
import Validator, { PatternRule, RequiredRule } from 'devextreme-react/validator';

interface VariedCellProps {
  event: any;
  attributes: Map<any,any>;
}

interface AttrValue {
  id: number;
  name: string;
}

/**
 * Multi-select type cell for changing select type in network filters
 * @param {any} event
 * @param {any[]} attributes
 * @return {=>}
 */
const VariedCell: FC<VariedCellProps> = ({event, attributes}) => {
  const [multiVisible, setMultiVisible] = useState<boolean>(false);
  const [value, setValue] = useState([]);

  useEffect(() => {
        if(multiSelectList.includes(event.data.row.data.filterName)){
            setMultiVisible(true);
        } else {
            setMultiVisible(false);
        }
  }, []);

  //parses the value to be readable to the filters
  const handleChange = (e) => {
    let newVal = ""
    if(e.event != null){
        if(e.value.length > 0 && multiVisible){
            newVal = e.value[0];
            for(let i = 1; i < e.value.length; i++){
                newVal = newVal + ','+ e.value[i];
            }
        } else {
            newVal = e.value;
        }
        event.data.setValue(newVal); 
    }
  }

  return (
    <> 
      {multiVisible ? (
        <TagBox
          dataSource={attributes.get(event.data.row.data.filterName)}
          defaultValue = {value}
          valueExpr="name"
          displayExpr="name"
          showSelectionControls={true}
          maxDisplayedTags={3}
          showMultiTagOnly={false}
          applyValueMode="useButtons"
          searchEnabled={true}
          stylingMode="outlined"
          onValueChanged={handleChange}
          width="200px"
          
        />
      ) :
        <TextBox
          defaultValue={event.data.value}
          onValueChanged={handleChange}
        >
        </TextBox>
      }
    </>
  );
};

export default VariedCell;
