import { FC, useEffect, useState } from 'react';
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.material.blue.light.compact.css';
import DataGrid, { Column, Editing } from 'devextreme-react/data-grid';
import axios from 'src/utils/axios';
import { useSelector } from 'src/store';
import { SubSection, UpdatedAttribute } from 'src/types/details';
import DataTagBox from './DataTagBox';

interface DataTableProps {
  id: number;
  source: SubSection[];
  isAdmin: boolean;
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

const booleanList = ['relay_scan_agreement'];

const DataTable: FC<DataTableProps> = ({ id, isAdmin, source }) => {
  const [codingAttrValues, setCodingAttrValues] = useState<AttrValue[]>([]);
  const [accessSchemeAttrValues, setAccessSchemeAttrValues] = useState<AttrValue[]>([]);
  const [modulationAttrValues, setModulationAttrValues] = useState<AttrValue[]>([]);
  const { isEngineer } = useSelector(state => state.user);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get<AttrValue[]>('/getAttributeValues', {
        params: { sub_key: 'forward_link_coding' }
      });
      response.data && setCodingAttrValues(response.data);
    };
    fetchData();

    const fetchData2 = async () => {
      const response = await axios.get<AttrValue[]>('/getAttributeValues', {
        params: { sub_key: 'multiple_access_scheme' }
      });
      response.data && setAccessSchemeAttrValues(response.data);
    };
    fetchData2();

    const fetchData3 = async () => {
      const response = await axios.get<AttrValue[]>('/getAttributeValues', {
        params: { sub_key: 'forward_link_modulation' }
      });
      response.data && setModulationAttrValues(response.data);
    };
    fetchData3();
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
    if (!options?.data) return;

    if(booleanList.includes(options.data.sub_key)){
      container.textContent = options.value === '0'?'No':'Yes';
      return;
    }

    if (subKeyList.includes(options.data.sub_key)) {
      const values =
        typeof options.value === 'string'
          ? options.value.split(',')
          : options.value;

      const noBreakSpace = '\u00A0',
        text = (values || [])
          .map((element) => {
            const value = (options.data.sub_key === 'multiple_access_scheme')
            ?(accessSchemeAttrValues.find((item) => item.id === parseInt(element)))
            :((options.data.sub_key.includes('modulation'))?(modulationAttrValues.find((item) => item.id === parseInt(element))):(codingAttrValues.find((item) => item.id === parseInt(element))));
            if(typeof value === 'undefined' || value === null){
              return null;
            }
            return value.name;
          })
          .join(', ');

      container.textContent = text || noBreakSpace;
      container.title = text;
    } else {
      container.textContent = options.value;
    }
  };

  return (
    <DataGrid
      dataSource={source}
      showBorders={true}
      //columnAutoWidth={true}
      onRowUpdating={handleRowUpdating}
      wordWrapEnabled={true}
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
        editCellComponent={(event) => DataTagBox({ event, codingAttrValues, accessSchemeAttrValues, modulationAttrValues})}
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
  );
};

export default DataTable;
