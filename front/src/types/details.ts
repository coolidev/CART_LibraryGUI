export interface Master {
  key: string;
  value: string;
}

export interface SubSection {
  key: string;
  sub_key: string;
  name: string;
  value: string;
  explanation: string;
  references: string;
  antennaId?: string | null;
  frequencyBand?: string | null;
  modDemod?: string | null;
}

export interface Section {
  section_key: string;
  section_name: string;
  section_value: SubSection[];
}

export interface Detail {
  section_key?: string;
  system_name: string;
  system_value: Section[];
}

export interface Overview {
  id: string;
  title: string;
  data: Section;
  csv: any;
}

export interface UpdatedAttribute {
  system_name: number | string;
  sub_key: number | string;
  antenna?: number | string;
  band?: number | string;
  modDemod?: number | string;
  key: number | string; // this is the groupid / platform
  newData: {
    value: string | number;
    explanation: string;
    references: string;
  };
}
export interface SearchOption {
    filterName: string
    value: string
    operator: string
}