import logo from "./logo.svg";
import "./App.css";

import {
  AppBar,
  Box,
  Button,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  Stack,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
} from "@mui/material";
import { ChevronLeft, Menu } from "@mui/icons-material";
import { createContext, useEffect, useMemo, useState } from "react";
import { useLogin } from "./login_logic";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

// funkcija za kreiranje teme
const create_palette = (mode) => {
  let result = {};
  if (mode === "light") {
    result = {
      mode: "light",
      primary: {
        main: "#009127",
      },
      text: {
        primary: "#000000",
        secondary: "#424242",
      },
    };
  } else {
    result = {
      mode: "dark",
    };
  }

  return { palette: result };
};

export const UserContext = createContext(null);

// komponenta koja se prikazuje kao pocetna stranica aplikacije
// definisati meni
function App() {
  // da li je meni otvoren ili ne
  const [otvoreno, setOtvoreno] = useState(false);
  // ovo koristimo da definisemo temu
  const [mode, setMode] = useState("light");
  const theme = useMemo(() => createTheme(create_palette("light")), [mode]);
  const [user, login, logout] = useLogin();
  const navigate = useNavigate();

  useEffect(() => {
    console.log(JSON.stringify(user));
    if (!user) {
      navigate("login");
    }
  }, []);
  return (
    <ThemeProvider theme={theme}>
      {/* sve komponente koje se nadju u okviru providera mocice da pristupie user-u, login-u i logout-u */}
      <UserContext.Provider value={{ user, login, logout }}>
        <CssBaseline />
        <Stack direction="column">
          <AppBar
            sx={{
              height: "60px",
              flexDirection: "row",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Toolbar>
              <IconButton onClick={(e) => setOtvoreno(true)}>
                <Menu />
              </IconButton>
            </Toolbar>
            <Typography variant="h6" sx={{ textAlign: "center", flexGrow: 1 }}>
              Banka
            </Typography>
            {user ? (
              <Stack>
                <Typography sx={{ textAlign: "center", paddingRight: "30px" }}>
                  {" "}
                  Zdravo {user.username}!{" "}
                </Typography>
                <Button sx={{ color: "white" }}>Odjavi se</Button>
              </Stack>
            ) : (
              <Button component={NavLink} to="login">
                {" "}
                Uloguj se{" "}
              </Button>
            )}
          </AppBar>

          <Drawer
            anchor="left"
            open={otvoreno}
            onClose={(e) => setOtvoreno(false)}
          >
            <Box>
              <IconButton>
                <ChevronLeft onClick={(e) => setOtvoreno(false)} />
              </IconButton>
            </Box>
            <Divider />
            <Stack direction="column">
              <Button component={NavLink} to="transactions">
                {" "}
                Transakcije{" "}
              </Button>
              <Button component={NavLink} to="add_transaction">
                {" "}
                Nova transakcije{" "}
              </Button>
            </Stack>
          </Drawer>
        </Stack>
        {/* element u okviru kojeg ce nam se prikazivati komponente  */}
        <Box sx={{ paddingTop: "60px" }}>
          <Outlet />
        </Box>
      </UserContext.Provider>
    </ThemeProvider>
  );
}

export default App;
