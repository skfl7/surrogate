import React, { useState, useEffect } from 'react';
import BtnContained from '../../../commonComponent/CustomText/Button/Contained';
import BtnOutlined from '../../../commonComponent/CustomText/Button/Outlined';
import { SearchOutlined } from '@mui/icons-material';
import {
  FormControlLabel,
  Grid,
  Typography,
  TextField,
  IconButton,
  Checkbox,
  Box,
  Button,
  Popover,
} from '@mui/material';
import '../../CheckboxSelectDropdown/style.scss';
import { Stack } from '@mui/system';
import { ReactComponent as DownArrow } from '../../../../assets/icons/downArrow.svg';

type Props = {
  options: Array<object>;
  flag?: string;
  sendSelectedValues?: Function;
  displayText?: string;
};

function CheckBoxPopOver({
  options,
  flag,
  sendSelectedValues,
  displayText,
}: Props) {
  const [selectedValues, setSelectedValues] = useState<any>([
    displayText?.toUpperCase,
  ]);
  const [isAllSelected, setIsAllSelected] = useState(true);
  const [listOptions, setListOptions] = useState<Array<object>>(options);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  console.log('ListItem:', listOptions);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const handleClose = () => {
    console.log('closed');
    setAnchorEl(null);
  };

  useEffect(() => {
    prepareOptions();
  }, [isAllSelected]);

  const prepareOptions = async () => {
    let array = [] as any;
    listOptions?.map((eachOption: any) => {
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

  const checkboxHandleChange = (each: any, event: any) => {
    const allSelected = each?.name.includes('All');

    if (allSelected) {
      if (event?.target?.checked) {
        setIsAllSelected(true);
        setSelectedValues([displayText?.toUpperCase]);
      } else {
        setIsAllSelected(false);
        setSelectedValues([]);
      }
    } else {
      const array = [] as any;
      const selectedItems = [] as any;

      listOptions?.forEach((eachItem: any) => {
        if (!event?.target?.checked && eachItem.name?.includes('All')) {
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
    setSelectedValues([displayText?.toUpperCase]);
  };

  const submitSelectedOptions = () => {
    sendSelectedValues && sendSelectedValues(selectedValues);
    setAnchorEl(null);
  };

  return (
    <Stack className="checkbox-select-dropdown">
      <Button
        endIcon={<DownArrow />}
        sx={{
          fontSize: '14.08px',
          marginRight: '20px',
          fontWeight: '400',
          color: '#0662B7',
          textTransform: 'none',
        }}
        onClick={handleClick}
      >
        {displayText}
      </Button>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
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
                        each?.name?.includes('All')
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
      </Popover>
    </Stack>
  );
}

export default CheckBoxPopOver;
