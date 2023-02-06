import { ContextMenu } from "devextreme-react";
import lodash from "lodash";
import { useEffect, useState } from "react";

import { IColumnType } from "./ReactTable";

interface Props<T> {
  index: number;
  item: T;
  column: IColumnType<T>;
}

interface Option {
  key: string;
  name: string;
  action: Function;
}

interface IContextItem {
  key: string;
  text: string;
  action: string;
}

export function ReactTableRowCell<T>({ item, column, index }: Props<T>): JSX.Element {
  const [options, setOptions] = useState<Option[]>()
  const [contextItems, setContextItems] = useState<IContextItem[]>([])
  const [isRowHeader, setIsRowHeader] = useState<boolean>(false)
  const value = lodash.get(item, column.key);
  
  useEffect(() => {
    if (column.key === 'comparison') {
      const rowBreakdownOptions = lodash.get<typeof item, string>(item, 'rowBreakdownOptions');
      setOptions(rowBreakdownOptions)
      setIsRowHeader(true)
    }
  }, [item, column.key])

  useEffect(() => {
    const buffer = [];
    lodash.forEach(options, (option) => {
      buffer.push({ key: option.key, text: option.name, action: option.action })
    })
    setContextItems(buffer)
  }, [options])

  const handleSelectOption = (e) => {
    if (!e.itemData.items) {
      const test = contextItems.filter((option) => option.key === e.itemData.key)[0]
      const fn = new Function("return " + test.action)();
      fn(e.itemData.key)
    }
  }
  
  return (<>
      <td id={isRowHeader && `context-menu-${index}`}>
        {column.render ? column.render(column, item) : value}
        {isRowHeader && <ContextMenu
          dataSource={contextItems}
          width={200}
          target={`#context-menu-${index}`}
          onItemClick={handleSelectOption} />}
      </td>
    </>
  );
}