/**
 * Created by ChitSwe on 12/20/16.
 */
const Preference = {
    format: {
        currency: {
            symbol: "MMK", // default currency symbol is '$'
            format: {
                pos: "%v %s ",
                neg: "(%v %s)",
                zero: "-- %s"
            },
            decimal: ".", // decimal point separator
            thousand: ",", // thousands separator
            precision: 0 // decimal places
        },
        number: {
            precision: 2, // default precision on numbers is 0
            thousand: ",",
            decimal: "."
        },
        date:{
            short:'DD/MM/YYYY',
            long:'DD/MM/YYYY hh:mm:ss A'
        },
        time:{
            short:'hh:mm A',
            long:'hh:mm:ss A'
        }
    },
    letterIconPath:(char)=>(`http://mt.com.mm/img/letter/letter_${char.toLowerCase()}.png`),
    apiUrl:`http://mt.com.mm`,
    fontType:null,
    resolveFontType:(w1,w2)=>{
      if(w1===w2)
        Preference.fontType=1;
      else
        Preference.fontType=2;
    }
}



export default Preference;
