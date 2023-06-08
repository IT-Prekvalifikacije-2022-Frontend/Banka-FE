
//rad sa localStorage-om

import { useState } from "react";

export const useLogin = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

    return [
        user, //korisnik, ako je ulogovan bice user koji je ulogovan, a ako nije null
        //login, ubacujem korisnika u localStorage
        (userData) => {
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
        },
        // logOut
        () => {
            localStorage.removeItem('user');
            setUser(null);
        } 

    ]
}
