import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton'

//data -> [{id: "", primaryText: "", secondaryText: "", icon}]
//clickFunction

const ListOfItems = (props) => {

    const handleClick = (val) => {
        props?.clickFunction(val);
    }

    return (
        <>
            <Grid item xs={12} md={6}>
                <List>
                    {props?.data.length > 0 && props?.data.map(x => (
                        <ListItem>
                            <ListItemButton key={x.id} onClick={() => handleClick(x)}>
                                <ListItemIcon>
                                    {x.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={x.primaryText}
                                    secondary={x.secondaryText}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Grid>
        </>
    );
}

export default ListOfItems;