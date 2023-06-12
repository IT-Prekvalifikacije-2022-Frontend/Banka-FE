import { Alert, Box, Button, Chip, Container, Divider, IconButton, Paper, Snackbar, Typography, useScrollTrigger } from "@mui/material";

import { NavLink, useLoaderData, useNavigate } from "react-router-dom";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import EastIcon from "@mui/icons-material/East";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useImmer } from "use-immer";
import { useContext, useState } from "react";
import { UserContext } from "../App";
// komponenta za prikaz jedne transakcije
const Transaction = () => {
  const transaction = useLoaderData();
  // podaci koji su neophodni za prikaz poruke da li je brisanje uspesno ili ne 
  const [result, setResult] = useImmer({message: '', error: false});
  const [open, setOpen] = useState(false); 
  const navigate = useNavigate();

  // treba nam user da znamo sta smemo da dozvolimo od opcija
  // izvucicemo ga iz konteksta
  const {user, login, logout} = useContext(UserContext);

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

// kada se iskljuci poruka precicemo na pocetnu stranicu ako je brisanje uspesno, a ako nije samo cemo zatvoriti poruku
  const handleClose = (event, reason) => {
    if(reason === 'clickaway'){
      return;
    }
    setOpen(false);
    if(!result.error)
      navigate(`/transactions`);

  }

  const deleteTransaction = async() => {
    // brisanje transakcije
    const result = await fetch(`http://localhost:3003/api/v1/transaction/${transaction.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (result.ok) {
      const new_t = await result.json();
      setResult((draftState) => {draftState.message = new_t.message; draftState.error = false});
      setOpen(true);
    } else {
      setResult((draftState) => {draftState.message = "Doslo je do greske prilikom izmene transakcije.";
      draftState.error = true});
      setOpen(true);
    }

  }

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
      { user && user.role === 'admin' ? 
      <>
      <Box sx={{display: 'flex', justifyContent: 'space-around', margin: '15px'}}> 
        <Button variant="outlined" startIcon={<DeleteIcon/>} onClick={deleteTransaction}>
            Izbrisi 
        </Button>
        <Button component={NavLink} to={`/edit_transaction/${transaction.id}`} variant="outlined" startIcon={<EditIcon/>}>
            Izmeni
        </Button>
      </Box>

        {/* /* snackbar cemo iskoristiti za prikaz poruke  */ }
        <Snackbar open={open} onClose={handleClose}>
          <Alert onClose={handleClose} severity={result.error ? 'error' : 'success'} sx={{width: '60%'}}>
            {result.message}
          </Alert>
        </Snackbar> </> : <></> }
    </Container>
  );
};

export default Transaction;
