///cardInfo -> prop
//where -> Сырцех
//date -> 25.06.2022
//message -> Бла-бла-бла
//who -> [Employee object]

import * as React from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import { Button, CardActionArea, CardActions } from '@mui/material';

const NotificationCard = ({ cardInfo }) => {
    return (
        <Card sx={{maxWidth: 500}}>
            <CardActionArea onClick={()=>console.log(`going to chat: ${cardInfo?.who.fullName}`)}>
                <CardContent>
                    <Typography gutterBottom  variant='h2' component="div">{cardInfo?.date}</Typography>
                    <Typography variant='h3' component="div">{cardInfo?.where}</Typography>
                    <Typography variant="h4" marginTop={3} color="text.secondary">
                        {cardInfo?.message}
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions>
                <Button color="error" size="large" onClick={()=>console.log("removing")}>Просмотрено</Button>
            </CardActions>
        </Card>);
}

export default NotificationCard;