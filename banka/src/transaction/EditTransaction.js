import {
  Alert,
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputAdornment,
  Radio,
  RadioGroup,
  Snackbar,
  Stack,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { useImmer } from "use-immer";
import { validateAmount, validateTextField } from "../validacije/validacije";

// komponenta za editovanje transakcije
const EditTransaction = () => {
  const transaction = useLoaderData(); //transakcija za izmenu
  //mozemo da koristimo Immer za slozeno stanje
  const navigate = useNavigate();
  const [edit_transaction, setEditTransaction] = useImmer(transaction);
  const [error, setError] = useImmer({
    to: "",
    from: "",
    amount: "",
  });
  // ovo cemo koristiti kako bi prikazali poruku koju dobijemo sa back-enda prilikom izmene transakcije
  const [result, setResult] = useImmer({message: '', error: false});

  // ovo cemo koristiti za prikaz poruke
  const [open, setOpen] = useState(false);

  const handleClose = (event, reason) => {
    if(reason === 'clickaway'){
      return;
    }
    setOpen(false);
    //ako nije greska tj ako je uspesno izmenjena transakcija onda posaljemo korisnika na stranicu gde se prikazuju podaci o jednoj transakciji
    if(!result.error)
      navigate(`/transaction/${edit_transaction.id}`);
  }

  const change = async () => {
    // obracamo se back-u da unese novu transakciju
    const result = await fetch(`http://localhost:3003/api/v1/transaction/${edit_transaction.id}`, {
      method: "PUT",
      body: JSON.stringify(edit_transaction),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (result.ok) {
      const new_t = await result.json();
      setResult((draftState) => {draftState.message = "Uspesno ste izmenili transakciju"});
      setOpen(true);
    } else {
      setResult((draftState) => {draftState.message = "Doslo je do greske prilikom izmene transakcije.";
      draftState.error = true});
      setOpen(true);
    }
    
  };

  // forma za editovanje transakcije
  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignContent: "center",
          flexWrap: "wrap",
          marginTop: 10,
        }}
      >
        <TextField
          id="to"
          label="Primaoc"
          variant="outlined"
          sx={{ marginBottom: 3, width: "50%" }}
          value={edit_transaction.to}
          error={error.to}
          helperText={error.to}
          onChange={(e) => {
            const validate = validateTextField(e.target.value, "Primaoc");
            if (validate.valid) {
              //validno, postavimo vrednost
              setEditTransaction((draftState) => {
                draftState.to = e.target.value;
              });
              setError((draftState) => {
                draftState.to = "";
              });
            } else {
              setError((draftState) => {
                draftState.to = validate.cause;
              });
            }
          }}
        />
        <TextField
          id="from"
          label="Posiljaoc"
          variant="outlined"
          sx={{ marginBottom: 3 }}
          value={edit_transaction.from}
          error={error.from}
          helperText={error.from}
          onChange={(e) => {
            const validate = validateTextField(e.target.value, "Posiljaoc");
            if (validate.valid) {
              //validno, postavimo vrednost
              setEditTransaction((draftState) => {
                draftState.from = e.target.value;
              });
              setError((draftState) => {
                draftState.from = "";
              });
            } else {
              setError((draftState) => {
                draftState.from = validate.cause;
              });
            }
          }}
        />
        {/* status - posto je izbor izmedju dve opcije  onda cemo staviti radio button  */}
        <FormControl
          sx={{
            border: "1px solid #ccc",
            borderRadius: "5px",
            marginBottom: "20px",
            padding: "5px",
          }}
        >
          <FormLabel id="status_group"> Status </FormLabel>
          <RadioGroup
            aria-labelledby="status_group"
            value={edit_transaction.status}
            name="status_group_rb"
            onChange={(e) =>
              // validacija stanja, mora da se odabere jedno od dva stanja

              setEditTransaction((draftState) => {
                draftState.status = e.target.value;
              })
            }
          >
            <FormControlLabel
              value="successful"
              control={<Radio />}
              label="Uspesna transakcija"
            />
            <FormControlLabel
              value="unsuccessful"
              control={<Radio />}
              label="Neuspesna transakcija"
            />
          </RadioGroup>
        </FormControl>

        <TextField
          id="amount"
          label="Iznos"
          variant="outlined"
          type="number"
          min="0"
          sx={{ marginBottom: 3 }}
          value={edit_transaction.amount}
          //   ovo koristimo da bi korisniku predocili u kojoj valuti se unosi iznos
          InputProps={{
            endAdornment: <InputAdornment position="end">RSD</InputAdornment>,
          }}
          error={error.amount}
          helperText={error.amount}
          onChange={(e) => {
            const validate = validateAmount(e.target.value);
            if (validate.valid) {
              //validno, postavimo vrednost
              setEditTransaction((draftState) => {
                draftState.amount = e.target.value;
              });
              setError((draftState) => {
                draftState.amount = "";
              });
            } else {
              setError((draftState) => {
                draftState.amount = validate.cause;
              });
            }
          }}
        />
        <TextField
          id="description"
          label="Opis"
          variant="outlined"
          sx={{ marginBottom: 3 }}
          multiline
          maxRows={5}
          value={edit_transaction.description}
          onChange={(e) =>
            setEditTransaction((draftState) => {
              draftState.description = e.target.value;
            })
          }
        />
        <Button onClick={change}>Izmeni</Button>
        {/* snackbar cemo iskoristiti za prikaz poruke  */}
        <Snackbar open={open} onClose={handleClose}>
          <Alert onClose={handleClose} severity={result.error ? 'error' : 'success'} sx={{width: '30%'}}>
            {result.message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default EditTransaction;
