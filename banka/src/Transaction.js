import { Box, Button, Chip, Container, Divider, IconButton, Paper, Typography } from "@mui/material";

import { NavLink, useLoaderData } from "react-router-dom";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import EastIcon from "@mui/icons-material/East";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
// komponenta za prikaz jedne transakcije
const Transaction = () => {
  const transaction = useLoaderData();

  const convertDate = () => {
    // FUNKCIJA KOJA KONVERTUJE DATUM U NORMALAN ISPIS KAO STO SMO IMALI U DATAGRID-U
    // OVO SMO MOGLI IZDVOJITI I U POSEBAN FAJL, PA SAMO POZVATI FUNKCIJU POSTO JE KORISTIMO NA VISE MESTA
    const date = new Date(transaction.date);
    const options = { year: "numeric", day: "numeric", month: "numeric" };
    return `${date.toLocaleDateString(
      "sr-RS",
      options
    )} ${date.toLocaleTimeString("sr-RS")}`;
  };

  return (
    <Container sx={{ width: "60%", margin: "auto", marginTop: "40px" }}>
      <Paper
        elevation={3}
        
      >
        <Box
          sx={{
            padding: "20px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography component="h1" sx={{ fontSize: "25px" }}>
            ID #{transaction.id}
          </Typography>
          {transaction.status === "successful" ? (
            <Chip
              variant="outlined"
              color="success"
              icon={<CheckCircleOutlineOutlinedIcon sx={{ color: "green" }} />}
              label="Uspesna"
            ></Chip>
          ) : (
            <Chip
              variant="outlined"
              color="error"
              icon={<CancelOutlinedIcon sx={{ color: "red" }} />}
              label="Neuspesna"
            ></Chip>
          )}
        </Box>
        <Divider />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            height: "100px",
          }}
        >
          <Chip label={transaction.from} color="secondary" variant="outlined" />
          <MoreHorizIcon />
          <EastIcon />
          <MoreHorizIcon />
          <Chip label={transaction.to} color="warning" variant="outlined" />
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            padding: "10px",
          }}
        >
          <Chip
            sx={{ grow: 1, height: "40px", width: "30%", fontSize: "25px" }}
            label={transaction.amount + " RSD"}
            variant="outlined"
          />
        </Box>

        <Divider />
        <Box sx={{display: 'flex', justifyContent: 'space-between'}}> 
            <Typography> Opis </Typography>
            <Typography> {transaction.description}</Typography>
        </Box>
        <Divider/>
        <Box>
          <Typography> Datum i vreme</Typography>
          <Typography> {convertDate()}</Typography>
        </Box>
      </Paper>

      <Box sx={{display: 'flex', justifyContent: 'space-around', margin: '15px'}}> 
        <Button variant="outlined" startIcon={<DeleteIcon/>}>
            Izbrisi 
        </Button>
        <Button component={NavLink} to={`/edit_transaction/${transaction.id}`} variant="outlined" startIcon={<EditIcon/>}>
            Izmeni
        </Button>
      </Box>
    </Container>
  );
};

export default Transaction;
