// komponenta za prikaz svih transakcija

import { Box, Chip, Container, Typography } from "@mui/material";
import { useLoaderData, useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

// definisemo kolone koje ce biti prikazane u tabeli
// sva polja ce da budu samo za citanje
const columns = [
  { field: "id", headerName: "R. Br", width: 80 },
  {
    field: "from", // ime atributa
    headerName: "Posiljaoc", //zaglavlje
    width: 150, //sirina kolone
    editable: false,
  },
  {
    field: "to",
    headerName: "Primaoc",
    width: 150,
    editable: false,
  },
  {
    field: "date",
    headerName: "Datum",
    width: 200,
    editable: false,
    // valueFormatter koristimo ako zelimo samo da primenimo transformacije nad vrednosti koja se prikazuje,a ona ce da prikaze na unapred definisan nacin tj podrazumevan nacin
    valueFormatter: (params) => {
      const date = new Date(params.value);
      // console.log(date.getDay());
      // mozemo da navedemo opcije kako zelimo da se prikaze datum
      // opcije mogu da budu da hocemo da se prikaze i dan, da bude prikazan naziv meseca a ne broj itd.
      const options = { year: "numeric", day: "numeric", month: "numeric" };
      // navedemo opcije i lokaciju i na osnovu lokacije i opcija koje smo izabrali ce se prikazati datum
      return `${date.toLocaleDateString(
        "sr-RS",
        options
      )} ${date.toLocaleTimeString("sr-RS")}`;
    },
  },
  {
    field: "amount",
    headerName: "Iznos [RSD]",
    width: 110,
    editable: false,
    // posto je broj u pitanju onda se i naziv kolone i sadrzaj desno poravnavaju
    headerAlign: "right",
    align: "right", //poravnanje sadrzaja u koloni
    // renderCell se koristi kad hocemo da celija izgleda drugacije
    renderCell: (params) => {
      return <Typography textAlign="right">{params.value}</Typography>;
    },
  },
  {
    field: "status",
    headerName: "Status",
    width: 150,
    editable: false,
    // hocemo da nam se podaci u celiji prikazuje na neki specifican nacin
    renderCell: (params) => {
      // params = podatak koji se prikazuje u  nasem slucaju da li je transakcija uspesna ili ne
      if (params.value === "successful") {
        return (
          <Chip variant="outlined" color="success"
            icon={ <CheckCircleOutlineOutlinedIcon sx={{ color: "green" }} /> }            
            label="Uspesno">
          </Chip>
        
        );
      } else {
        return (
          <Chip variant="outlined" color="error"
            icon={ <CancelOutlinedIcon sx={{ color: "red" }} /> }            
            label="Neuspesno">
          </Chip>
        );
      }
    },
  },
];
const Transactions = () => {
  //sve transakcije koje smo dobavili pomocu loadera
  const transactions = useLoaderData();
  const navigate  = useNavigate(); //ovo nam treba kako bi mogli da predjemo na neku odredjenu stranicu
  const rows = [...transactions];

  // dvoklikom na red prikazuju se podaci o transakciji
  const showTransaction = (e) => {
    // console.log(JSON.stringify(e.row));
    // navigiramo na komponentu koja prikazuje transakciju
    navigate(`/transaction/${e.row.id}`);
  }

  // transakcije cemo prikazati u vidu tabele tako da cemo koristiti DataGrid kontrolu
  // DataGrid je kontrola slican tabeli samo sto nam nudi dosta dodatnih mogucnosti, sortiranje, filtriranje i paginacije
  // da biste koristili DataGrid kontrolu neophodno je da je prvo instalirate pomocu komande npm install @mui/x-data-grid

  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          
          height: "400px",
          width: '80%',
          margin: 'auto',
          marginTop: 10,
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          rowHeight={48}
          initialState={{
            pagination: {
              // stranicenje, dovoljno je samo da definisemo koliko elemenata je prikazano na jednoj stranici
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
          // dvoklikom na red prikazuju se podaci o transakciji
          onRowDoubleClick={(e) => showTransaction(e)}
        />
      </Box>
    </Container>
  );
};

export default Transactions;
