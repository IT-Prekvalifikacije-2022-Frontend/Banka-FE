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
            return fetch('http://localhost:3003/api/v1/transaction')
          }
      },
      {
        path: '/transaction/:id', 
        element: <Transaction/>,
        loader: //dobavimo jednu konkretnu transakciju na osnovu id-a
          async ({params}) => {
            return fetch(`http://localhost:3003/api/v1/transaction/${params.id}`)
          }

      },
      {
        path: '/edit_transaction/:id',
        element: <EditTransaction/>,
        loader: //dobavimo transakciju za izmenu
          async ({params}) => {
            return fetch(`http://localhost:3003/api/v1/transaction/${params.id}`)
          }
      },
      {
        path: '/add_transaction',
        element: <NewTransaction></NewTransaction>
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
