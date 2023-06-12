import { Alert, Box, Button, Container, Snackbar, TextField } from "@mui/material";
import { UserContext } from "./App";
import { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

const Login = () => {
  // mogu iz konteksta da izvucem podatke pomocu useContext hook-a tako sto mu prosledim ime konkteksta iz kojeg izvlacim podatke
  const { user, login, logout } = useContext(UserContext);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  // result -> da li je logovanje uspelo ili ne, ako je logovanje neuspesno prikazace se poruka
  const [errorLogin, setErrorLogin] = useState(false);

  const handleClose = () => {
    setErrorLogin(false); //samo zatvorimo poruku
  }

const loginUser = async () => 
{
    //logujem korisnika, obracam se back-end-u 
    let response = await fetch('http://localhost:3003/api/v1/login', {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
    })

    if(response.ok){
         const user = await response.json();
         login(user);         
         setErrorLogin(false);
         navigate('/transactions');
    }else {
        console.log('Problem prilikom logovanja');
        setErrorLogin(true);
    }
}

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
          id="username"
          label="Username"
          variant="outlined"
          sx={{ marginBottom: 3 }}
          onChange={(e) => {
            //kopija objekta loginData
            const ld = { ...loginData };
            ld.username = e.target.value;
            setLoginData(ld);
          }}
        />
        <TextField
          id="password"
          label="Password"
          type="password"
          variant="outlined"
          sx={{ marginBottom: 3 }}
          onChange={(e) => {
            const ld = { ...loginData };
            ld.password = e.target.value;
            setLoginData(ld);
          }}
        />
        <Button onClick={loginUser}>Login</Button>
      </Box>
      <Snackbar open={errorLogin} onClose={handleClose}>
          <Alert onClose={handleClose} severity='error' sx={{width: '60%'}}>
            {"Pogresno korisnicko ime ili lozinka"}
          </Alert>
        </Snackbar>
    </Container>
  );
};

export default Login;
