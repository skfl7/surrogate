import { FormControl, MenuItem, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import React, { useEffect } from 'react';
import './cardAndDropDown.scss';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import dropDown_icon from '../../../assets/icons/dropDown_icon.svg';
type dataProps = {
  value: any;
  onChange?: any;
  showDropDown: boolean;
  subModuleName?: any;
  moduleName?: any;
  moduleCode?: any;
  subModuleCode?: any;
};
export const icon = () => {
  return <img src={dropDown_icon} alt="" />;
};
const list = [{ content: 0 }, { content: 1 }, { content: 2 }, { content: 3 }];

const CardAndDropDown = ({
  value = '',
  onChange = null,
  showDropDown = false,
  subModuleName,
  moduleName,
  moduleCode,
  subModuleCode,
}: dataProps) => {
  const [age, setAge] = React.useState('');

  useEffect(() => {
    console.log(value, 'value');
    setAge(value);
  }, [value]);

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value);
  };
  return (
    <Stack className="cardAndDropDownContainer">
      {showDropDown ? (
        <Stack className="dropDownContainer">
          <FormControl>
            <Select
              // IconComponent={icon}
              value={value}
              onChange={(e) => onChange(e, moduleCode, subModuleCode)}
              displayEmpty
              inputProps={{ 'aria-label': 'Without label' }}
            >
              {list &&
                list?.map((item: any) => {
                  return (
                    <MenuItem value={item.content}>{item.content}</MenuItem>
                  );
                })}
            </Select>
          </FormControl>
        </Stack>
      ) : (
        <Stack className="count">
          <Typography className="modelAccessControlModelnumber">
            {value}
          </Typography>
        </Stack>
      )}
    </Stack>
  );
};

export default CardAndDropDown;
