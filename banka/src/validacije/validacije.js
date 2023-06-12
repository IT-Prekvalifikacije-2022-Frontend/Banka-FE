// sve validacije koje su neophodne na jednom mestu 

// primaoc i posiljaoc moraju da budu popunjeni 
export const validateTextField = (value, field) => {
    // field - koje polje validiramo 
    if(value === ''){
        return {
            valid: false, 
            cause: `${field} mora da postoji.`
        }
    }else {
        return {
            valid: true, 
            cause: '${field}'
        }
    }
}


// validacija iznosa
export const validateAmount = (value) => {
    if(value === ''){
      return  { valid: false,
        cause: 'Iznos mora da postoji'}
    }
    if(value[0] === '0'){
        return {
            valid: false, 
            cause: 'Molim vas unosite ispravan format broja'
        }
    }
    if (parseInt(value) <= 0){
        return {
            valida: false, 
            cause: 'Iznos treba da bude pozitivan broj'
        }
    }else {
        return {
            valid: true,
            cause: 'Iznos'
        }
    }
}