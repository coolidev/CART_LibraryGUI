import { FC, useEffect, useState } from 'react';
import TagBox from 'devextreme-react/tag-box';
import TextBox from 'devextreme-react/text-box';
import { FormControl, Select, MenuItem } from '@material-ui/core';

interface DataTagBoxProps {
  event: any;
  codingAttrValues: AttrValue[];
  accessSchemeAttrValues: AttrValue[];
  modulationAttrValues: AttrValue[];
}

interface AttrValue {
  id: number;
  name: string;
}

const subKeyList = [
  'forward_link_coding',
  'return_link_coding',
  'multiple_access_scheme',
  'antenna_modulation',
  'forward_link_modulation',
  'return_link_modulation'
];

const booleanList = ['relay_scan_agreement']

const DataTagBox: FC<DataTagBoxProps> = ({ event, codingAttrValues, accessSchemeAttrValues, modulationAttrValues }) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [values, setValues] = useState<AttrValue[]>([]);
  const [booleanView, setBooleanView] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<number>(Number(event.data.value));

  useEffect(() => {
    
    if (subKeyList.includes(event.data.key.sub_key)) {
      const list =
        typeof event.data.value === 'string'
          ? event.data.value.split(',')
          : event.data.value;

      const data = (list || []).map((element) => {
        const value = (event.data.key.sub_key === 'multiple_access_scheme')?accessSchemeAttrValues.find((item) => item.id === parseInt(element)):((event.data.key.sub_key.includes('modulation')?modulationAttrValues.find((item) => item.id === parseInt(element)):codingAttrValues.find((item) => item.id === parseInt(element))));
        if(typeof value === 'undefined' || value === null){
          return null;
        }
        return value.id;
      });

      setVisible(true);
      setValues(data);
    }
    if(booleanList.includes(event.data.key.sub_key)){
      setBooleanView(true);
    } else{
      setBooleanView(false);
    }
  }, [modulationAttrValues, codingAttrValues, accessSchemeAttrValues, event]);

  const handleChange = (e) => event.data.setValue(e.value);

  const handleDropdownChange = (e) => {
    setSelectedItem(Number(e.target.value))
    event.data.setValue(e.target.value.toString()); 
  }

  return (
    <>
      {(visible && !booleanView) ? (
        <TagBox
          dataSource={event.data.key.sub_key === 'multiple_access_scheme'?accessSchemeAttrValues:(event.data.key.sub_key.includes('modulation')?modulationAttrValues:codingAttrValues)}
          defaultValue={values}
          valueExpr="id"
          displayExpr="name"
          showSelectionControls={true}
          maxDisplayedTags={3}
          showMultiTagOnly={false}
          applyValueMode="useButtons"
          searchEnabled={true}
          onValueChanged={handleChange}
          width="200px"
        />
      ) : 
      booleanView
      ?
      (<FormControl variant="outlined" size="small" fullWidth>
        <Select
          name="YesNo"
          variant="outlined"
          color="primary"
          value={selectedItem}
          onChange={handleDropdownChange}
        >
          <MenuItem value={1} key={1}>
            Yes
          </MenuItem>
          <MenuItem value={0} key={0}>
            No
          </MenuItem>
        </Select>
      </FormControl>)
      :
      (<TextBox
        defaultValue={event.data.value}
        onValueChanged={handleChange}
      />)
    }
    </>
  );
};

export default DataTagBox;
