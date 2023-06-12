import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App, { UserContext } from './App';
import reportWebVitals from './reportWebVitals';
import {RouterProvider, createBrowserRouter} from 'react-router-dom'
import Login from './Login';
import NewTransaction from './transaction/NewTransaction';
import Transaction from './transaction/Transaction';
import Transactions from './transaction/Transactions';
import EditTransaction from './transaction/EditTransaction';
import { check_login, get_login } from './login_logic';
import ErrorDisplay from './ErrorDisplay';



const router = createBrowserRouter([
  {
    path: '/', //localhost:3000
    element: <App></App>,
    children: [
      {
        path: '/login',
        element: <Login></Login>,
      },
      {
        path: '/transactions',
        element: <Transactions></Transactions>,
        loader: //dobavimo sve transakcije
          async () => {
            // transakcije moze da vidi ulogovan korisnika nema veze da li je admin ili obicni korisnik 
            const user = check_login(['admin', 'user']);
            return fetch('http://localhost:3003/api/v1/transaction')
          },
          errorElement: <ErrorDisplay entity='transakcije'/>
      },
      {
        path: '/transaction/:id', 
        element: <Transaction/>,
        loader: //dobavimo jednu konkretnu transakciju na osnovu id-a
          async ({params}) => {
            const user = check_login(['admin', 'user']);
            return fetch(`http://localhost:3003/api/v1/transaction/${params.id}`)
          },
          errorElement: <ErrorDisplay entity='transakcija'/>

      },
      {
        path: '/edit_transaction/:id',
        element: <EditTransaction/>,
        loader: //dobavimo transakciju za izmenu, izmenu moze da radi samo admin
          async ({params}) => {
            const user = check_login(['admin']);
            return fetch(`http://localhost:3003/api/v1/transaction/${params.id}`)
          },
          errorElement: <ErrorDisplay entity='transakcija'/>
      },
      {
        path: '/add_transaction',
        element: <NewTransaction></NewTransaction>,
        loader: //kreiranje transakcije moze samo admin
          () => {
            const user = check_login(['admin']);
            return null;
          },
        errorElement: <ErrorDisplay entity='transakcija'/>
      }
    ]
  },
])



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
