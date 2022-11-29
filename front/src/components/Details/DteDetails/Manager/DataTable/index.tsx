import { FC, useEffect, useState } from 'react';
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.material.blue.light.compact.css';
import DataGrid, { Column, Editing } from 'devextreme-react/data-grid';
import axios from 'src/utils/axios';
import { useSelector } from 'src/store';
import { SubSection, UpdatedAttribute } from 'src/types/details';
import DataTagBox from './DataTagBox';

interface DataTableProps {
  id: string;
  source: SubSection[];
  isAdmin: boolean;
}

interface AttrValue {
  id: number;
  name: string;
}

export const subKeyList = ['antenna_modulation', 'platform_type', 'reference_body', 'vcmVdrSupport', 'antenna_polarization','modulationType','antenna_data_format','antenna_subcarrier_format','decoding', 'channelCodingType','antenna_subcarrier_modulation', 'subcarrierDataFormat'];
export const multiKeyList = ['antenna_modulation','modulationType','antenna_data_format','antenna_subcarrier_format','decoding','channelCodingType','antenna_subcarrier_modulation', 'subcarrierDataFormat'];
export const dropdownList = ['platform_type', 'reference_body', 'vcmVdrSupport', 'antenna_polarization']
export const calcStateKeyList = [];
//   'bandwidth',
//   'antenna_size',
//   'antenna_efficiency',
//   'antenna_gain',
//   'polarization_losses',
//   'antenna_beamwidth',
//   'eirp',
// ];
export const booleanKeyList = [
  'scanAgreement', 
  'dte_scan_agreement'
];

/**
 * DTE Network Details grid in Network library
 * @param {any} id
 * @param {any} isAdmin
 * @param {any} source
 * @return {=>}
 */
const DataTable: FC<DataTableProps> = ({ id, isAdmin, source }) => {
  const [attrValues, setAttrValues] = useState<AttrValue[]>([]);
  const [platformAttrValues, setPlatformTypeAttrValues] = useState<AttrValue[]>([]);
  const [referenceBodyAttrValues, setReferenceBodyAttrValues] = useState<AttrValue[]>([]);
  const [vcmVdrAttrValues, setVcmVdrAttrValues] = useState<AttrValue[]>([]);
  const [polarizationAttrValues, setPolarizationAttrValues] = useState<AttrValue[]>([]);
  const [dataFormatAttrValues, setDataFormatAttrValues] = useState<AttrValue[]>([]);
  const [codingAttrValues, setCodingAttrValues] = useState<AttrValue[]>([]);

  const { isEngineer } = useSelector(state => state.user);

  useEffect(() => {
    const fetchAntennaData = async () => {
      const response = await axios.get<AttrValue[]>('/getAttributeValues', {
        params: { sub_key: 'antenna_modulation ' }
      });
      response.data && setAttrValues(response.data);
    };

    const fetchPlatformTypeData = async () => {
      const response = await axios.get<AttrValue[]>('/getAttributeValues', {
        params: { sub_key: 'platform_type ' }
      });
      response.data && setPlatformTypeAttrValues(response.data);
    };

    const fetchReferenceBodyData = async () => {
      const response = await axios.get<AttrValue[]>('/getAttributeValues', {
        params: { sub_key: 'reference_body ' }
      });
      response.data && setReferenceBodyAttrValues(response.data);
    };

    const fetchVcmVdrData = async () => {
      const response = await axios.get<AttrValue[]>('/getAttributeValues', {
        params: { sub_key: 'vcmVdrSupport ' }
      });
      response.data && setVcmVdrAttrValues(response.data);
    };

    const fetchPolarizationData = async () => {
      const response = await axios.get<AttrValue[]>('/getAttributeValues', {
        params: { sub_key: 'antenna_polarization ' }
      });
      response.data && setPolarizationAttrValues(response.data);
    };

    const fetchDataFormatData = async () => {
      const response = await axios.get<AttrValue[]>('/getAttributeValues', {
        params: { sub_key: 'data_format ' }
      });
      response.data && setDataFormatAttrValues(response.data);
    };

    const fetchCodingData = async () => {
      const response = await axios.get<AttrValue[]>('/getAttributeValues', {
        params: { sub_key: 'forward_link_coding ' }
      });
      response.data && setCodingAttrValues(response.data);
    };

    fetchAntennaData();
    fetchPlatformTypeData();
    fetchReferenceBodyData();
    fetchVcmVdrData();
    fetchPolarizationData();
    fetchDataFormatData();
    fetchCodingData();
  }, []);

  const handleRowUpdating = async (event) => {
    const value =
      typeof event.newData.value === 'string'
        ? event.newData.value
        : event.newData.value
        ? event.newData.value.join(',')
        : event.oldData.value;

    const params: UpdatedAttribute = {
      system_name: id,
      sub_key: event.oldData.sub_key,
      antenna: event.oldData.antennaId,
      band: event.oldData.frequencyBand,
      modDemod: event.oldData.modDemod,
      key: event.oldData.key,
      newData: {
        value,
        explanation: event.newData.explanation,
        references: event.newData.references
      }
    };
    await axios.post('/updateSystemAttribute', params);
  };

  const cellTemplate = (container, options) => {

    if((!options.data.value || options.data.value?.length === 0) && !calcStateKeyList.includes(options.data.sub_key)){
      container.textContent = '-';
      return;
    }
    if (!options?.data) return;
    if (subKeyList.includes(options.data.sub_key)) {
      const values =
        typeof options.value === 'string'
          ? options.value.split(',')
          : options.value;
      const noBreakSpace = '\u00A0';
      let text;

      //Maybe find a better way than if-else statements in the future for this
      if(options.data.sub_key === 'antenna_modulation' || options.data.sub_key === 'modulationType' || options.data.sub_key === 'antenna_subcarrier_modulation'){
        text = (values || [])
        .map((element) => {
          const value = attrValues.find(
            (item) => item.id === parseInt(element)
          );
          if (typeof value === 'undefined' || value === null) {
            return null;
          }
          return value.name;
        })
        .join(', ');
      }
      else if(options.data.sub_key === 'platform_type'){
        text = (values || [])
        .map((element) => {
          const value = platformAttrValues.find(
            (item) => item.id === parseInt(element)
          );
          if (typeof value === 'undefined' || value === null) {
            return null;
          }
          return value.name;
        })
        .join(', ');
      }
      else if(options.data.sub_key === 'reference_body'){
        text = (values || [])
        .map((element) => {
          const value = referenceBodyAttrValues.find(
            (item) => item.id === parseInt(element)
          );
          if (typeof value === 'undefined' || value === null) {
            return null;
          }
          return value.name;
        })
        .join(', ');
      } else if(options.data.sub_key === 'vcmVdrSupport'){
        text = (values || [])
        .map((element) => {
          const value = vcmVdrAttrValues.find(
            (item) => item.id === parseInt(element)
          );
          if (typeof value === 'undefined' || value === null) {
            return null;
          }
          return value.name;
        })
        .join(', ');
      } else if(options.data.sub_key === 'antenna_polarization'){
        text = (values || [])
        .map((element) => {
          const value = polarizationAttrValues.find(
            (item) => item.id === parseInt(element)
          );
          if (typeof value === 'undefined' || value === null) {
            return null;
          }
          return value.name;
        })
        .join(', ');
      } else if(options.data.sub_key === 'antenna_data_format' || options.data.sub_key === 'antenna_subcarrier_format' || options.data.sub_key === 'subcarrierDataFormat'){
        text = (values || [])
        .map((element) => {
          const value = dataFormatAttrValues.find(
            (item) => item.id === parseInt(element)
          );
          if (typeof value === 'undefined' || value === null) {
            return null;
          }
          return value.name;
        })
        .join(', ');
      } else if(options.data.sub_key === 'decoding' || options.data.sub_key === 'channelCodingType'){
        text = (values || [])
        .map((element) => {
          const value = codingAttrValues.find(
            (item) => item.id === parseInt(element)
          );
          if (typeof value === 'undefined' || value === null) {
            return null;
          }
          return value.name;
        })
        .join(', ');
      }
      container.textContent = text || noBreakSpace;
      container.title = text;
    } else if(options.value === '' && calcStateKeyList.includes(options.data.sub_key)){
      container.textContent = 'Calculated';
      container.style.fontStyle = 'italic';
    // } else if (container.options.value.toString()[0] === '[') {
    //   container.visible = 'false';
    }
    else if(booleanKeyList.includes(options.data.sub_key)){
      if(options.value === '1'){
        container.textContent = 'Yes';
      }else{
        container.textContent = 'No';
      }
    } 
    
    else {
      container.textContent = options.value;
    }
    //Replace replace the references from the datatable with the actual string values
  };

  return (
    <>
      <DataGrid
        dataSource={source}
        showBorders={true}
        //columnAutoWidth={true}
        onRowUpdating={handleRowUpdating}
        wordWrapEnabled={true}
        columnWidth={200}
      >
        <Editing mode="row" allowUpdating={isEngineer} />
        <Column
          dataField="name"
          caption="Attribute"
          width="20%"
          allowEditing={false}
        />
        <Column
          dataField="value"
          caption="Data"
          width="20%"
          allowSorting={false}
          cellTemplate={cellTemplate}
          editCellComponent={(event) => DataTagBox({ event, attrValues, platformAttrValues, referenceBodyAttrValues, vcmVdrAttrValues, polarizationAttrValues, dataFormatAttrValues, codingAttrValues })}
        />
        <Column type="adaptive" visible={false} />
        <Column
          dataField="explanation"
          caption="Notes or Explanation"
          width="30%"
          allowSorting={false}
        />
        <Column
          dataField="references"
          caption="References"
          width="30%"
          allowSorting={false}
        />
      </DataGrid>
    </>
  );
};

export default DataTable;
