import { FC, useEffect, useState } from 'react';
import TagBox from 'devextreme-react/tag-box';
import TextBox from 'devextreme-react/text-box';
import { Box, Switch } from 'devextreme-react';
import { calcStateKeyList, multiKeyList, dropdownList, booleanKeyList, subKeyList } from '.';
import FormControl from '@material-ui/core/FormControl';
import { MenuItem, Select } from '@material-ui/core';

interface DataTagBoxProps {
  event: any;
  attrValues: AttrValue[];
  platformAttrValues: AttrValue[];
  referenceBodyAttrValues: AttrValue[];
  vcmVdrAttrValues: AttrValue[];
  polarizationAttrValues: AttrValue[];
  dataFormatAttrValues: AttrValue[];
  codingAttrValues: AttrValue[];
}

interface AttrValue {
  id: number;
  name: string;
}

/**
 * Multi-select box for editing network attributes
 * @param {any} {event
 * @param {any} attrValues}
 * @return {=>}
 */
const DataTagBox: FC<DataTagBoxProps> = ({ event, attrValues, platformAttrValues, referenceBodyAttrValues, vcmVdrAttrValues, polarizationAttrValues, dataFormatAttrValues, codingAttrValues}) => {
  const [multiVisible, setMultiVisible] = useState<boolean>(false);
  const [calcStateVisible, setCalcStateVisible] = useState<boolean>(false);
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const [booleanVisible, setBooleanVisible] = useState<boolean>(false);
  const [values, setValues] = useState<AttrValue[]>([]);
  const [attributes, setAttributes] = useState<AttrValue[]>([]);
  const [calcState, setCalcState] = useState<boolean>(event.data.key.value !== '');
  const [selectedItem, setSelectedItem] = useState<number>(Number(event.data.value));

  useEffect(() => {
    if (multiKeyList.includes(event.data.key.sub_key)) {
      let data = null;
      const list =
        typeof event.data.value === 'string'
          ? event.data.value.split(',')
          : event.data.value;
      if(event.data.key.sub_key === 'antenna_modulation' || event.data.key.sub_key === 'modulationType' || event.data.key.sub_key === 'antenna_subcarrier_modulation'){
        setAttributes(attrValues);
        data = (list || []).map((element) => {
          const value = attrValues.find((item) => item.id === parseInt(element));
          if(typeof value === 'undefined' || value === null){
            return null;
          }
          return value.id;
        });
      }else if(event.data.key.sub_key === 'antenna_data_format' || event.data.key.sub_key === 'antenna_subcarrier_format' || event.data.key.sub_key === 'subcarrierDataFormat'){
        setAttributes(dataFormatAttrValues);
        data = (list || []).map((element) => {
          const value = attrValues.find((item) => item.id === parseInt(element));
          if(typeof value === 'undefined' || value === null){
            return null;
          }
          return value.id;
        });
      }else if(event.data.key.sub_key === 'decoding' || event.data.key.sub_key === 'channelCodingType'){
        setAttributes(codingAttrValues);
        data = (list || []).map((element) => {
          const value = attrValues.find((item) => item.id === parseInt(element));
          if(typeof value === 'undefined' || value === null){
            return null;
          }
          return value.id;
        });
      }
      else{
        data = (list || []).map((element) => {
          const value = attributes.find((item) => item.id === parseInt(element));
          if(typeof value === 'undefined' || value === null){
            return null;
          }
          return value.id;
        });
      }

      setMultiVisible(true);
      setCalcStateVisible(false);
      setDropdownVisible(false);
      setBooleanVisible(false);
      setValues(data);
      
    } else if(calcStateKeyList.includes(event.data.key.sub_key)){
      setMultiVisible(false);
      setDropdownVisible(false);
      setCalcStateVisible(true);
      setBooleanVisible(false);
      setCalcState(event.data.key.value !== '');
    } 
    else if(dropdownList.includes(event.data.key.sub_key)){
      const list =
      typeof event.data.value === 'string'
        ? event.data.value.split(',')
        : event.data.value;
      if(event.data.key.sub_key === 'platform_type'){
        setAttributes(platformAttrValues);
      }
      if(event.data.key.sub_key === 'reference_body'){
        setAttributes(referenceBodyAttrValues);
      }
      if(event.data.key.sub_key === 'vcmVdrSupport'){
        setAttributes(vcmVdrAttrValues);
      }
      if(event.data.key.sub_key === 'antenna_polarization'){
        setAttributes(polarizationAttrValues);
      }
      if(event.data.key.sub_key === 'antenna_data_format'){
        setAttributes(dataFormatAttrValues);
      }
      if(event.data.key.sub_key === 'decoding'){
        setAttributes(codingAttrValues);
      }
      setMultiVisible(false);
      setCalcStateVisible(false);
      setDropdownVisible(true);
      setBooleanVisible(false);
    } 
    else if(booleanKeyList.includes(event.data.key.sub_key)){
      setMultiVisible(false);
      setCalcStateVisible(false);
      setDropdownVisible(false);
      setBooleanVisible(true);
    }
  }, [attrValues, platformAttrValues, referenceBodyAttrValues, vcmVdrAttrValues, codingAttrValues, dataFormatAttrValues, event]);

  const handleChange = (e) => {
    const type = typeof e.value;
    if(type !== 'string' && type !== 'number' && type !== 'boolean'){
      event.data.setValue(e.value.join(','));
      return;
    }
    if(e.value.replace(' ','') === '' && calcState){
      return; 
    }
    if(e.value !== 'Calculated' && e.value.replace(' ','') !== ''){
      event.data.setValue(e.value);
    }else{
      event.data.setValue(''); 
    }
  }

  const handleDropdownChange = (e) => {
    setSelectedItem(Number(e.target.value))
    event.data.setValue(e.target.value.toString()); 
  }
  const handleSwitch = (e) => {
    setCalcState(e);
  }

  return (
    <>
      {multiVisible ? (
        <TagBox
          dataSource={attributes}
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
      ) : calcStateVisible ? 
        <><div style={{ display: 'flex', flexDirection: 'row' }}>
            <TextBox
              value={!calcState?'Calculated':event.data.value}
              onValueChanged={handleChange}
              disabled={!calcState}
            />
            <Switch
              defaultValue={calcState}
              onValueChange={handleSwitch}
              hint={calcState?'Disable to allow automatic calculation':'Enable to set a custom static value'}
              style={{ paddingTop: '7px' }} 
            />
          </div></>
        : dropdownVisible ?
            <FormControl variant="outlined" size="small" fullWidth>
                <Select
                  name="antenna"
                  variant="outlined"
                  color="primary"
                  value={selectedItem}
                  onChange={handleDropdownChange}
                >
                  {attributes.map((item) => (
                    <MenuItem value={item.id} key={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
        : booleanVisible ?
        <FormControl variant="outlined" size="small" fullWidth>
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
        </FormControl>
        :
        <TextBox
          defaultValue={event.data.value}
          onValueChanged={handleChange}
        />
      }
    </>
  );
};

export default DataTagBox;
