export const  makeid=(length,onlyNumbers?:boolean)=> {
    let result = '';
    const characters =onlyNumbers ? "0123456789"  : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

export const makeidNumbers=()=>Math.floor(Math.random() * 90000) + 10000