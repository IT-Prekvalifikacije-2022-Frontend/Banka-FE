// komponenta koja ce se prikazati ako nekoj ruti ne mozemo da pristupimo

import { Box, Container, Icon, Stack, Typography } from "@mui/material";
import { Navigate, useRouteError } from "react-router-dom";
import { Error } from '@mui/icons-material';

const ErrorDisplay = ({ entity }) => {
  const error = useRouteError();

  // ako niko nije ulogovan prebacimo ga na stranicu za logovanje
  if (error.cause === "login") {
    return <Navigate to="/" />;
  } else if (error.cause === "security") {
    //ako nije ulogovan korisnik sa odgovarajucom ulogom
    return (
      <Container>
        <Stack direction={"row"}>
          <Icon>
            <Error />
          </Icon>
          <Typography variant="h4">Nemate prava pristupa!</Typography>
          <Icon>
            <Error />
          </Icon>
        </Stack>
      </Container>
    );
  }

  return <Container>
    <Stack direction={'column'} spacing={1}>
      <Typography variant='h4'>Desila se greška u učitavanju {entity}</Typography>
      <Typography>
      Jako nam je žao. Da li ste pokrenuli back-end server, možda? 
      </Typography>
      <Typography variant='h6'>Interna greška je: </Typography>
      <Box>
        <pre>
          {error.message}          
        </pre>
      </Box>
    </Stack>
  </Container>
};


export default ErrorDisplay;