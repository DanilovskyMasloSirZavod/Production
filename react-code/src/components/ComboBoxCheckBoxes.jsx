import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { useEffect } from 'react';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const ComboBoxCheckBoxes = (props) => {
    return (
        <Autocomplete
          onChange={(event, newValue) => {
            let res = []
            newValue.forEach(x=>{
              res.push(x.productName);
            })
            props?.changed(res);         
          }}
          multiple
          limitTags={2}
          options={props.data}
          disableCloseOnSelect
          getOptionLabel={(option) => option.productName}
          isOptionEqualToValue={(option, value) => option.productName === value.productName}
          defaultValue={[props.defaultVal]}
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={selected}
              />
              {option.productName}
            </li>
          )}
          style={{ width: props.width }}
          renderInput={(params) => (
            <TextField {...params} label={props.title} placeholder={props.inner} />
          )}
        />
      );
}

export default ComboBoxCheckBoxes;