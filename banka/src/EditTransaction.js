import {
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputAdornment,
  Radio,
  RadioGroup,
  Stack,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { useImmer } from "use-immer";


// komponenta za editovanje transakcije
const EditTransaction = () => {
  const transaction = useLoaderData(); //transakcija za izmenu
  //mozemo da koristimo Immer za slozeno stanje
  const [edit_transaction, setEditTransaction] = useImmer(transaction);
  const [errorMessage, setErrorMessage] = useState(null); //poruka za iznos
  const [statusErrorMessage, setStatusErrorMessage] = useState(null); //poruka za status, mora da bude izabrana jedna od dve opcije
  const [errorToMessage, setErrorToMessage] = useState(null); //poruka da mora da bude unesen primalac

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
          onChange={(e) =>
            setEditTransaction((draftState) => {
              draftState.to = e.target.value;
            })
          }
        />
        <TextField
          id="from"
          label="Posiljaoc"
          variant="outlined"
          sx={{ marginBottom: 3 }}
          value={edit_transaction.from}
          onChange={(e) =>
            setEditTransaction((draftState) => {
              draftState.from = e.target.value;
            })
          }
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
          onChange={(e) => {
            if (e.target.value < 0) {
              setErrorMessage("Iznos transakcije mora da bude pozitivan broj");

            } else {
              setErrorMessage(null);
            }
            setEditTransaction((draftState) => {
                draftState.amount = e.target.value;
              });
          }}
          helperText={errorMessage}
          error={errorMessage}
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
        <Button>Izmeni</Button>
      </Box>
    </Container>
  );
};

export default EditTransaction;
