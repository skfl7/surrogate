import React, { useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { TextField, IconButton } from '@mui/material';
import { SearchOutlined } from '@mui/icons-material';
import './style.scss';

export default function SearchDropdown(props: { data: any,onHandleChange?: Function,parentValue?:string }) {
  const [selectedValue, setSelectedValue] = useState(props?.parentValue ?? '');
  const handleChange = async (event: SelectChangeEvent) => {
    setSelectedValue(event?.target?.value ?? "--");
    await props?.data?.options?.map((eachOption: any, index: number) => {
      if((eachOption.userId || eachOption.id) === event.target.value){
        props?.onHandleChange && props?.onHandleChange(eachOption);
      }
     })
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} className="editReviewStyle">
      <Select
        style={{ height: '45px', paddingLeft: '10px' }}
        value={selectedValue ?? '-' }
        onChange={handleChange}
        displayEmpty
        inputProps={{ 'aria-label': 'Without label' }}
        MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}
      >
        <TextField
          className="search-dropdown-text-field"
          placeholder="Search by..."
          style={{ width: '90%', margin: '5px 18px', height: '46px' }}
          InputProps={{
            startAdornment: (
              <IconButton edge="start">
                <SearchOutlined />
              </IconButton>
            ),
          }}
        />
        {props?.data?.options?.map((eachOption: any, index: number) => {
          return (
            <MenuItem
              value={eachOption.userId || eachOption.id}
              key={index}
              style={{ height: '45px', margin: '0px 18px'}}
            >
              {eachOption?.name.length > 0 ? eachOption?.name : '--'}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}
