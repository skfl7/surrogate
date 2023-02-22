import React, { useEffect, useState } from 'react';
import { TreeSelect } from 'antd';
import './index.scss';
type Props = {
  options: Array<object>;
  flag?: string;
  sendSelectedValues?: Function;
  selectedValuesFromParent?: Array<string>;
  handleCloseModal?: any;
  reset?: any;
  filterValue?: any;
  dropdownReset?: boolean;
  toggle?: boolean;
};

export default function Multiselector({
  options,
  flag,
  sendSelectedValues,
  filterValue,
  reset,
  selectedValuesFromParent,
  dropdownReset,
  toggle,
}: Props) {
  const { SHOW_PARENT } = TreeSelect;

  const [value, setValue] = useState(selectedValuesFromParent || ['All']);
  const [visible, setVisible] = useState(false);

  const onChange = (newValue: string[]) => {
    setValue(newValue);
  };

  useEffect(() => {
    setValue(selectedValuesFromParent || ['All']);
  }, [selectedValuesFromParent]);

  const tProps = {
    options,
    value,
    onChange,
    treeCheckable: true,
    showCheckedStrategy: SHOW_PARENT,
    placeholder: 'Please select',
  };

  useEffect(() => {
    if (dropdownReset) {
      setValue(['All']);
    }
  }, [toggle]);
  return (
    <TreeSelect
      {...tProps}
      className="drop-md"
      showArrow
      maxTagCount={1}
      showSearch
      treeNodeFilterProp="title"
      treeDefaultExpandAll
      treeData={options || []}
      onDropdownVisibleChange={(visible) => {
        if (!visible) {
          sendSelectedValues && sendSelectedValues(value);
        }
        setVisible(visible);
        return true; // Return false will prevent visible change
      }}
      // suffixIcon={() => (
      //   <DownArrowIcon style={{ padding: '1px', marginTop: '3px' }} />
      // )}
      // suffixIcon={
      //   <DownArrowIcon style={{ padding: '1px', marginTop: '3px' }} />
      // }
    />
  );
}
