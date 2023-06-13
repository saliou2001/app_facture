import {Asset} from "expo-asset";
import {manipulateAsync} from "expo-image-manipulator";
import numberToWord from "./convertNumber";


export default  async function generateInvoiceTemplate(data) {

    const asset = Asset.fromModule(require('../../assets/logo.jpg'));
    const cachet = Asset.fromModule(require('../../assets/cachet.png'));
    const signature = Asset.fromModule(require('../../assets/sign.jpg'));
    const image =  await manipulateAsync(asset.localUri ?? asset.uri, [], { base64: true });
    const image1 =  await manipulateAsync(signature.localUri ?? signature.uri, [], { base64: true });
    const image2 =await  manipulateAsync(cachet.localUri ?? cachet.uri, [], { base64: true });

    const liste=data.items
    console.log(liste)
    // Define the invoice template using HTML
    const htmlContent = `
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<style>
    .info-all{
        display: flex;
        justify-content: space-around;
    }
    .header-img{
        position:absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        height: 100px;
        width: 100%;
    }
    .header-img img
    {
        width: 100px;
        height: 100px;
        border-radius: 20px;
        justify-content: center;
        align-items: center;
        text-align: center;
    }
    .body{
        position: relative;
        top: 100px;
    }
    .div-facture-header{
        width: 100%;               
    }
    .div-facture-header h3{
        color: black;
        margin: 0 30px;   
        background-color: gray;     
        text-align: center;
    }
    .location{
        font-size: 20px;
        font-weight: normal;
    }
    .date{
        font-size: 20px;
        font-weight: normal;
    }
    .div-tab-facture{
        width: 100%;
        justify-content: center;
        align-content: center;
        justify-items: center;
        text-align: center;
        margin: auto;
        display: flex;

    }
    .div-tab-facture table{
        justify-items: center;
        justify-content: center;
        align-items: center;
        text-align: center;
    }
    .none{
        border-bottom: white 1px solid;
        border-left: white 1px solid;
    }
    .before-footer
    {
        margin-top: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    .before-footer p{
        margin: 0;
    }
    strong{
        font-size: 20px;
    }
    .footer{
        margin-top: 20px;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
    }
</style>
<body>

<div class="header-img">
    <img
        src="data:image/jpeg;base64,${image.base64}"
        style="width: 90vw;" />
</div>
<div class="body">
<section class="info-all">
    <div class="info-owner">
        <h3>Cherif Abdoul Rahim</h3>
        <h3>Adresse : Cosa</h3>
        <h3>Téléphone : 621 00 00 00</h3>
        <h3>Email :cheriftatadiallo@gmail.com</h3>
    </div>
    <div class="info-client">
        <h3>Client: ${data.nom}</h3>
        <h3>Date: ${displayDate(data.date)}</h3>
    </div>
</section>
<section class="facture-charge">
    <div class="div-facture-header"><h3 style="background-color: black; color: white">FACTURE N°${data.num}</h3></div>
    <section class="info-all">
        <div class="info-owner">
            <h3>Location:</h3>
            <h3>Période:</h3>
        </div>
        <div class="info-client">
            <h3 class="location">${data.location}</h3>
            <h3 class="date"> ${displayDate(data.dateBegin)}  au ${displayDate(data.dateEnd)}</h3>
        </div>
    </section>
    <div class="div-tab-facture">
        <table border="1" style="border-collapse: collapse">
            <tr>
                <th>Prise en charge</th>
                <th>QUANTITE</th>
                <th>PRIX UNITAIRE (GNF)</th>
                <th>TOTAL (GNF)</th>
            </tr>
            ${liste
        .map(
            (item) => `                
                  <tr>
                    <td>${item.pc}</td>
                    <td>${item.quantite}</td>
                    <td>${item.prix}</td>
                    <td>${prixTTC(item.quantite,item.prix)}</td>
                  </tr>
                `
        ).join('')
        }            
            <tr>
                <td colspan="3">TOTAL</td>
                <td>${prixTotalOfList(liste)}</td>
            </tr>
            <tr>
                <td class="none"></td>
                <td colspan="2">Net à payer</td>
                <td>${prixTotalOfList(liste)}</td>
            </tr>
        </table>
    </div>
<div class="before-footer">
<p><strong>Arrêté à la facture de : </strong> ${numberToWord(prixTotalOfList(liste))} GNF </p>
    <p><strong>NB : </strong>Le Carburant revient à la charge du Client</p>
</div>
    <div class="footer">
        <div class="footer-left">
            <h4>Chérif Abdoul Rahim</h4>
            <img src="data:image/jpeg;base64,${image1.base64}" alt="" width="100" />

        </div>
        <div class="footer-right">
            <h4>GERANT</h4>
            <img src="data:image/png;base64,${image2.base64}" alt="" width="100">
        </div>
    </div>
</section>

</div>
</body>
</html>`;
    return htmlContent
}
const displayDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('fr-FR', options);
}
const prixTTC = (quantite, prix) => {
    return parseInt(quantite) * parseFloat(prix);
}

const prixTotalOfList = (liste) => {
    let total = 0;
    liste.forEach(element => {
        total += prixTTC(element.quantite, element.prix);
    });
    return total;
}



