import Slide from '@mui/material/Slide';
import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import { Box } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

const FullScreenDialog = (props) => {
    const handleClose = () => {
        props.closeFunc();
    }

    return (
        <>
            <Dialog
                fullScreen
                sx={{m: props?.size ? props?.size : "10%"}}
                open={props.openClick}
                onClose={handleClose}
                TransitionComponent={Transition}
            >
                <AppBar sx={{ position: 'relative' }} color="secondary">
                    <Toolbar>
                        <IconButton
                            edge="start"
                            sx={{color:"#fff"}}
                            onClick={handleClose}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1, color:"#fff" }} variant="h6" component="div">
                            {props.title}
                        </Typography>
                    </Toolbar>
                </AppBar>
            {props.children}
        </Dialog>
        </>
    );
}

export default FullScreenDialog;