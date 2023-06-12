
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

export const get_login = () => {
    // vracamo ulogovanog korisnika
    const user = JSON.parse(localStorage.getItem('user'));
    return user;
}
// korisnik ulogovan ili ne, ali se proveravaju role korisnika koji je ulogovan
export const check_login = (roles) => {
    const user = get_login();
          if(user === null){
            const err = {
              cause: 'login',
              message: 'Korisnik nije logovan'
            };
            throw err;
          }else if(roles){
            if(!roles.includes(user.role)){
                console.log(user.role);
                const err = {
                    cause: 'security',
                    message: 'Korisnik nema pravo pristupa'
                };
                throw err;
          }
        }
    return user;
}

export const valid_login = (roles) => {
    const user = get_login();
          if(user === null){
            return false;
          }else if(roles){
            if(!roles.includes(user.role)){
                console.log(user.role);
                return false;
          }
        }
    return true;
}
