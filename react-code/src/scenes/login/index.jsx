import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useNavigate } from "react-router-dom";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";

import { Alert } from '@mui/material';

import API from '../../API';
import OutsideAction from '../../components/OutsideAction';
import jwt from 'jwt-decode'

function Copyright(props) {
    return (
        <Typography variant="body2" align="center" {...props}>
            {'Copyright © '}
            <a color="inherit" href="https://danilovcheese.ru/">
                DMSZ
            </a>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const LogIn = (props) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [state, setState] = React.useState({ val: undefined, show: false });

    const handleVisibility = (val, where, data) => {
        props?.setTopVis(val);
        props?.setSideVis(val);
        props?.setLogged({access: data, state: val});
        console.log(data);
        navigate(where);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        API.post('/Login', {
            login: data.get('email'),
            password: data.get('password')
        })
            .then(function (response) {
                API.defaults.headers.common = { 'Authorization': `Bearer ${response?.data}` };
                handleVisibility(true, "/", jwt(response?.data));
            })
            .catch(function (error) {
                setState({
                    val: <OutsideAction children={
                        <Alert severity="error">{error?.response?.data ? error.response?.data.ru : "Ошибка входа."}</Alert>}
                        callback={() => setState({ show: false })} />,
                    show: true
                });

                console.log(error.response?.data);
            });
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: colors.greenAccent[500] }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Вход
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Логин"
                        name="email"
                        autoComplete="email"
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Пароль"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                    />
                    <FormControlLabel
                        control={<Checkbox value="remember" />}
                        label="Сохранить пароль"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2, backgroundColor: colors.blueAccent[500] }}>
                        Войти
                    </Button>
                    {state.show ? state.val : null}
                    <Grid container
                        direction="row"
                        justifyContent="center"
                        alignItems="baseline">
                        <Grid item>
                            <a href="#" color="inherit" variant="body2">
                                Забыли пароль?
                            </a>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
    );
}

export default LogIn;