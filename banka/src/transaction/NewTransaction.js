// komponenta za unos nove transakcije

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
  TextField,
} from "@mui/material";
import { validateAmount, validateTextField } from "../validacije/validacije";
import { useImmer } from "use-immer";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const NewTransaction = () => {
    const navigate = useNavigate();
  const [transaction, setTransaction] = useImmer({
    to: "",
    from: "",
    description: "",
    status: "successful",
    amount: 0,
  });
  const [error, setError] = useImmer({
    to: "",
    from: "",
    amount: ""
  });

  // ovo cemo koristiti kako bi prikazali poruku koju dobijemo sa back-enda prilikom dodavanja nove transakcije
  const [result, setResult] = useImmer({message: '', error: false});

  // ovo cemo koristiti za prikaz poruke
  const [open, setOpen] = useState(false);

  const handleClose = (event, reason) => {
    if(reason === 'clickaway'){
      return;
    }
    setOpen(false);
    if(!result.error)
      navigate(`/transactions`);

  }

  const save = async () => {
    // alert(JSON.stringify(transaction));
    // obracamo se back-u da unese novu transakciju
   const result = await fetch('http://localhost:3003/api/v1/transaction', {
    method: 'POST',
    body: JSON.stringify(transaction),
    headers: {
        'Content-Type' : 'application/json'
    }
   })
   if(result.ok){
    const new_t = await result.json();
    setResult((draftState) => {
      draftState.message = 'Uspesno ste dodali transakciju';
      draftState.error = false;
    })
    setOpen(true);
   }else {
    setResult((draftState) => {
      draftState.message = 'Doslo je do greske prilikom dodavanja nove transakcije.';
      draftState.error = true;
    })
    setOpen(true);
     }
  };
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
          error={error.to}
          helperText={error.to}
          onChange={(e) => {
            const validate = validateTextField(e.target.value, "Primaoc");
            if (validate.valid) {
              //validno, postavimo vrednost
              setTransaction((draftState) => {
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
          error={error.from}
          helperText={error.from}
          onChange={(e) => {
            const validate = validateTextField(e.target.value, "Posiljaoc");
            if (validate.valid) {
              //validno, postavimo vrednost
              setTransaction((draftState) => {
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
            name="status_group_rb"
            defaultValue="successful"
            onChange={(e) =>
              setTransaction((draftState) => {
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
              setTransaction((draftState) => {
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
          onChange={(e) =>
            setTransaction((draftState) => {
              draftState.description = e.target.value;
            })
          }
        />
        <Button
          disabled={error.to || error.from || error.amount}
          onClick={save}
        >
          Sacuvaj
        </Button>
      </Box>
      {/* snackbar cemo iskoristiti za prikaz poruke  */}
      <Snackbar open={open} onClose={handleClose}>
          <Alert onClose={handleClose} severity={result.error ? 'error' : 'success'} sx={{width: '60%'}}>
            {result.message}
          </Alert>
        </Snackbar>
    </Container>
  );
};

export default NewTransaction;
