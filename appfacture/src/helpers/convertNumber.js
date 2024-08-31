
const units = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf'];
const teens = ['dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];
const tens = ['', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante', 'quatre-vingt', 'quatre-vingt'];
const powers = ['', 'mille', 'million', 'milliard'];

 export default function numberToWord(number) {

    if (number === 0) {
        return 'zéro';
    }

    let word = '';
    let negative = false;

    if (number < 0) {
        negative = true;
        number = Math.abs(number);
    }

    let i = 0;
    while (number > 0) {
        if (number % 1000 !== 0) {
            if (i === 1 && number % 100 === 1) {
                word = `${powers[i]} ${word}`;
            } else {
                word = `${convertThreeDigitNumber(number % 1000)} ${powers[i]} ${word}`;
            }
        }
        number = Math.floor(number / 1000);
        i++;
    }

    if (negative) {
        word = `moins ${word}`;
    }
    if(word.includes("un cent")){
        word=word.replace("un cent","cent")
    }

    return word.trim();
}

function convertThreeDigitNumber(number) {
    let word = '';
    const hundreds = Math.floor(number / 100);
    const tensAndUnits = number % 100;

    if (hundreds > 0) {
        word += `${units[hundreds]} cent `;
    }

    if (tensAndUnits >= 10 && tensAndUnits <= 19) {
        word += `${teens[tensAndUnits - 10]} `;
    } else {
        const tensDigit = Math.floor(tensAndUnits / 10);
        const unitsDigit = tensAndUnits % 10;

        if (tensDigit > 0) {
            word += `${tens[tensDigit]} `;
        }

        if (unitsDigit > 0) {
            if (tensDigit === 7 || tensDigit === 9) {
                word += `-${units[10 + unitsDigit]} `;
            } else {
                word += `${units[unitsDigit]} `;
            }
        }
    }

    return word.trim();
}
