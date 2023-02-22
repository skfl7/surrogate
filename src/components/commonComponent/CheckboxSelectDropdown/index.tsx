import React, { useState, useEffect } from 'react';

// MUI components
import Select, { SelectChangeEvent } from '@mui/material/Select';
import {
  FormControlLabel,
  Grid,
  Typography,
  TextField,
  IconButton,
  Checkbox,
  Box,
} from '@mui/material';
import { Stack } from '@mui/system';
import { SearchOutlined } from '@mui/icons-material';

// Common component
import BtnContained from '../../../components/commonComponent/CustomText/Button/Contained';
import BtnOutlined from '../../../components/commonComponent/CustomText/Button/Outlined';

// styles
import './style.scss';

type Props = {
  options: Array<object>;
  flag?: string;
  sendSelectedValues?: Function;
  selectedValuesFromParent?: Array<string>;
  handleCloseModal?: any;
  reset?: any;
  filterValue?: any;
  sendSelectedValuesfilter?: any;
};

function CheckboxSelectDropdown({
  sendSelectedValuesfilter,
  options,
  flag,
  sendSelectedValues,
  filterValue,
  reset,
  selectedValuesFromParent,
}: Props) {
  const [selectedValues, setSelectedValues] = useState<string[]>(
    selectedValuesFromParent || ['All']
  );
  const [isAllSelected, setIsAllSelected] = useState(true);
  const [listOptions, setListOptions] = useState<Array<object>>(options);
  const [isSelectLayoutOpen, setIsSelectLayoutOpen] = useState<boolean>(false);

  // useEffect(() => {
  //   setSelectedValues(['All']);
  //   setIsAllSelected(true);
  // }, [filterValue, reset]);

  useEffect(() => {
    prepareOptions(options);
  }, [isAllSelected]);

  useEffect(() => {
    if (filterValue) {
      setIsAllSelected(true);
      setSelectedValues(['All']);
    }
  }, [filterValue]);

  // useEffect(() => {
  //   setSelectedValues(['All']);
  //   setIsAllSelected(true);
  // }, []);

  useEffect(() => {
    setListOptions(options);
    setSelectedValues(['All']);
    setIsAllSelected(true);
    prepareOptions(options);
  }, [options]);

  const prepareOptions = async (dataOptions: any) => {
    let array = [] as any;
    dataOptions?.map((eachOption: any) => {
      if (isAllSelected) eachOption.isSelected = true;
      else {
        if (selectedValues.find((value: string) => value === eachOption.code))
          eachOption.isSelected = true;
        else eachOption.isSelected = false;
      }
      array.push(eachOption);
    });
    setListOptions(array);
  };

  const handleChange = (event: SelectChangeEvent<typeof selectedValues>) => {
    const {
      target: { value },
    } = event;
    setSelectedValues(typeof value === 'string' ? value.split(',') : value);
  };

  const checkboxHandleChange = (each: any, event: any) => {
    const allSelected = each?.name.toUpperCase() === 'All';

    if (allSelected) {
      setIsAllSelected(event?.target?.checked);
      setSelectedValues(event?.target?.checked ? ['All'] : []);
    } else {
      const array = [] as any;
      const selectedItems = [] as any;

      listOptions?.forEach((eachItem: any) => {
        if (!event?.target?.checked && eachItem.name?.toUpperCase() === 'All') {
          eachItem.isSelected = false;
        }
        if (each.name === eachItem.name) {
          eachItem.isSelected = !eachItem.isSelected;
        }
        if (!eachItem.isSelected) {
          setIsAllSelected(false);
        } else {
          selectedItems.push(eachItem.code);
        }
        array.push(eachItem);
      });

      setListOptions(array);
      setSelectedValues(selectedItems);
    }
  };

  const resetAllOptions = () => {
    let array = [] as any;
    listOptions?.map((eachOption: any) => {
      eachOption.isSelected = false;
      array.push(eachOption);
    });
    setListOptions(array);
    setIsAllSelected(false);
    setSelectedValues(['All']);
  };

  const submitSelectedOptions = () => {
    setIsSelectLayoutOpen(false);
    sendSelectedValues && sendSelectedValues(selectedValues);
  };

  useEffect(() => {
    sendSelectedValuesfilter && sendSelectedValuesfilter(selectedValues);
  }, [selectedValues]);

  return (
    <Stack className="checkbox-select-dropdown">
      <Select
        style={{
          textTransform: 'capitalize',
          contain: flag === 'userlistscreen' ? 'size' : 'none',
        }}
        open={isSelectLayoutOpen}
        onOpen={() => setIsSelectLayoutOpen(true)}
        labelId="demo-multiple-checkbox-label"
        id="demo-multiple-checkbox"
        multiple
        value={selectedValues}
        onChange={handleChange}
        renderValue={(selected) => selected.join(', ')}
        onClose={() => setIsSelectLayoutOpen(false)}
      >
        <Stack className="checkbox-dropdown-options">
          <TextField
            className="search-text-field"
            placeholder="Search by..."
            InputProps={{
              startAdornment: (
                <IconButton edge="start">
                  <SearchOutlined />
                </IconButton>
              ),
            }}
          />
          <Stack className="dropdown-option-container">
            {listOptions?.map((each: any, index: number) => (
              <Grid px={3} key={index}>
                <FormControlLabel
                  label={
                    <Typography sx={{ fontSize: '14px' }}>
                      {each?.name}
                    </Typography>
                  }
                  control={
                    <Checkbox
                      sx={{
                        transform: 'scale(1.2)',
                        color: '#A8A8A9',
                      }}
                      style={
                        each?.name?.toUpperCase() === 'All'
                          ? { marginLeft: '0px' }
                          : { marginLeft: '20px' }
                      }
                      color="secondary"
                      className="each-option"
                      checked={each.isSelected}
                      onChange={(event) => checkboxHandleChange(each, event)}
                    />
                  }
                />
              </Grid>
            ))}
          </Stack>

          <div className="underline"></div>
          <Box className="button-container">
            <BtnOutlined
              title="Reset"
              BtnHeight={32}
              BtnWidth={70}
              onClick={resetAllOptions}
            />
            <BtnContained
              title="Select"
              BtnHeight={32}
              BtnWidth={70}
              disabled={!isAllSelected && selectedValues.length === 0}
              onClick={submitSelectedOptions}
            />
          </Box>
        </Stack>
      </Select>
    </Stack>
  );
}

export default CheckboxSelectDropdown;
