import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';

export default function EditDialog(props) {
    const handleClose = () => {
      props.onClose(props.selectedValue) 
    };
  
    const handleListItemClick = (value) => {
      if (value === props.selectedValue) {
        props.onClose(value);
        return;
      }
      let redefined = props.selectedValue;
      redefined.role = value?.textValue ? value?.textValue : value;
      
      if (value?.textValue) {
        let obj = {id: value?.id, data: null, role: value?.textValue ? value?.textValue : null};
        props.onNewRole(obj);
        return;
      }
      props.onNewRole(redefined);
    };
  
    return (
      <Dialog onClose={handleClose} open={props.open}>
        <DialogTitle>{props.title}</DialogTitle>
        <List sx={{ pt: 0 }}>
          {props.data.length > 0 && props.data.map((item) => (
            <ListItem disableGutters>
              <ListItemButton       
              sx = {{
                backgroundColor: props?.selectedValue?.role ? props.selectedValue.role === item 
                    ? props.colors.grey[800]
                    : null
                    : null
              }} 
              onClick={() => handleListItemClick(item)} key={item}>
                <ListItemText primary={item?.textValue ? item?.textValue : item} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Dialog>
    );
  }