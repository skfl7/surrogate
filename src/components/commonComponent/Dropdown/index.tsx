/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import './style.scss';
import { InputLabel, Stack } from '@mui/material';
import { ReactComponent as DownArrowIcon } from '../../../assets/icons/dropdownarrow.svg';
export default function SearchDropdown(props: {
  data: any;
  onSelect?: Function;
  selectedValue?: string;
  label?: any;
  dropdownType?: string;
}) {
  const [dropDownValue, setDropDownValue] = useState(props.selectedValue || '');

  useEffect(() => {
    setDropDownValue(props.selectedValue ?? '');
  }, [props.selectedValue]);

  const handleChange = (event: SelectChangeEvent) => {
    props?.onSelect && props?.onSelect(event);
    setDropDownValue(event.target.value);
  };
  return (
    <FormControl className="dropDown" sx={{ m: 1, minWidth: 120 }}>
      <Select
        className="single-select-dropdown"
        IconComponent={(prop) => (
          <DownArrowIcon
            {...prop}
            style={{
              marginTop: '2px',
              marginRight: '4px',
              padding: '1px',
            }}
          />
        )}
        style={{ height: 40 }}
        value={dropDownValue}
        onChange={handleChange}
        displayEmpty
        inputProps={{ 'aria-label': 'Without label' }}
        renderValue={(selected: any) => {
          if (!selected) {
            return (
              <Stack
                sx={{
                  color: '#D2D2D3',
                  fontWeight: '400',
                  fontSize: '14px',
                  letterSpacing: '0.0025em',
                }}
              >
                {props?.label}
              </Stack>
            );
          }
          
          return (
            <Stack sx={{ fontSize: '14px' }}>
              {dropDownValue} {props.dropdownType ? props.dropdownType : ''}
            </Stack>
          );
        }}
      >
        {props?.data?.map((eachOption: any, index: number) => {
          return (
            <MenuItem
              sx={{
                borderLeft: '1px solid #e0e0de',
                borderRight: '1px solid #e0e0de',
              }}
              className="menu-item"
              value={eachOption.code}
              key={index}
              onChange={() => setDropDownValue(eachOption.code)}
            >
              {eachOption?.name}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}
