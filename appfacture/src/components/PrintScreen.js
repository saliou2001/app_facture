import * as React from 'react';
import {View, StyleSheet, Button, Platform, Text, TextInput, DatePickerIOS, ScrollView} from 'react-native';
import * as Print from 'expo-print';
import { Asset } from 'expo-asset';
import { printAsync } from 'expo-print';
import { manipulateAsync } from 'expo-image-manipulator';
import { shareAsync } from 'expo-sharing';
import generateInvoiceTemplate from "../helpers/generateHtml"
import DateTimePicker from '@react-native-community/datetimepicker';
import {useEffect} from "react";

async function generateHTML() {
    const asset = Asset.fromModule(require('../../assets/logo.jpg'));
    const image = await manipulateAsync(asset.localUri ?? asset.uri, [], { base64: true });
    return `
    <html>
      <img
        src="data:image/jpeg;base64,${image.base64}"
        style="width: 90vw;" />
    </html>
  `;
}

function fillHmtl(data)
{
    return `<p>${data}</p>`
}


export default function App() {
    const [selectedPrinter, setSelectedPrinter] = React.useState();




    const print = async (nom) => {
        console.log("print"+nom)
        let nhtml=generateInvoiceTemplate(nom)
        // On iOS/android prints the given html. On web prints the HTML from the current page.
        /* @info */ await Print.printAsync({
            nhtml,
            printerUrl: selectedPrinter?.url, // iOS only
        }); /* @end */
    };

    const printToFile = async (data) => {
        console.log("printToFile")
        let html = await generateInvoiceTemplate(data);
        // On iOS/android prints the given html. On web prints the HTML from the current page.
        /* @info */ const { uri } = await Print.printToFileAsync({html}); /* @end */
        console.log('File has been saved to:', uri);
        await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    };

    const selectPrinter = async () => {
        /* @info */ const printer = await Print.selectPrinterAsync(); // iOS only
        /* @end */
        setSelectedPrinter(printer);
    };

    const [nom, setNom] = React.useState('');
    const [adresse, setAdresse] = React.useState('');
    const [date, setDate] = React.useState(new Date());
    const [dateBegin, setDateBegin] = React.useState(new Date());
    const [dateEnd, setDateEnd] = React.useState(new Date());
    const [showDatePicker, setShowDatePicker] = React.useState(false);
    const [showTimePickerBegin, setShowTimePickerBegin] = React.useState(false);
    const [showTimePickerEnd, setShowTimePickerEnd] = React.useState(false);
    const [num, setNum] = React.useState('');
    const [location, setLocation] = React.useState('');
    const [inc, setInc] = React.useState('');
    const [items, setItems] = React.useState([
        {
            pc: '',
            prix: '',
            quantite: '',
        }
    ]);
    const [data, setData] = React.useState({
        nom: nom,
        adresse: adresse,
        date: date,
        dateBegin: dateBegin,
        dateEnd: dateEnd,
        num: num,
        location: location,
        items: items,
    });
    useEffect(() => {
        setData({
            nom: nom,
            adresse: adresse,
            date: date,
            dateBegin: dateBegin,
            dateEnd: dateEnd,
            num: num,
            location: location,
            items: items,
        },)
    } ,[nom, adresse, date, dateBegin, dateEnd, num,location,items])
    const increment = () => {
        setInc(inc + 1);
        setItems([...items, { pc: '', prix: '', quantite: '' }]);
    }

    const handleDateSelect = (event, selectedDate) => {
        if (selectedDate !== undefined) {
            setDate(selectedDate);
        }
        setShowDatePicker(Platform.OS === 'ios'); // Hide the DatePicker on iOS after selection
    };

    const handleTimeSelectBegin = (event, selectedDate) => {
        if (selectedDate !== undefined) {
            setDateBegin(selectedDate);
        }
        setShowTimePickerBegin(Platform.OS === 'ios'); // Hide the DatePicker on iOS after selection
    }
    const handleTimeSelectEnd = (event, selectedDate) => {
        if (selectedDate !== undefined) {
            setDateEnd(selectedDate);
        }
        setShowTimePickerEnd(Platform.OS === 'ios'); // Hide the DatePicker on iOS after selection
    }

    const handleInputChange = (index, name, value) => {

        const list = [...items];
        list[index][name] = value;
        setItems(list);
    }
    const handleSubmit=()=>{
        console.log(items)
    }

    return (
        <ScrollView >
            <View style={styles.header}>
                <Text>Information pour la facture</Text>
                {/*Formulaire en bas*/}
                <TextInput placeholder={"Nom du client"} style={styles.input} value={nom} onChangeText={setNom}/>
                <TextInput placeholder={"Adresse du client"} style={styles.input} value={adresse} onChangeText={setAdresse}/>
                <View >
                    <Text style={styles.label}>Date de la facture</Text>
                    <View style={styles.dateButton}>
                        <Button title="Choisir une date" onPress={() => setShowDatePicker(true)} />
                        {showDatePicker && (
                            <DateTimePicker
                                value={date}
                                mode="date"
                                display="default"
                                onChange={handleDateSelect}
                            />
                        )}
                    </View>
                </View>

                <View >
                    <Text>Information pour la facture</Text>
                    <TextInput placeholder={"Numéro de la facture"} style={styles.input} value={num} onChangeText={setNum}/>
                    <TextInput placeholder={"Objet de location"} style={styles.input} value={location} onChangeText={setLocation}/>
                    <View>
                        <Text>Période de location</Text>
                        <View style={styles.dateButton}>
                            <View>
                                {showTimePickerBegin || <Button title="Choisir une date de début" onPress={() => setShowTimePickerBegin(true)} />}
                                {showTimePickerBegin && (
                                    <DateTimePicker
                                        value={dateBegin}
                                        mode="date"
                                        display="default"
                                        onChange={handleTimeSelectBegin}
                                    />
                                )}
                            </View>
                            {showTimePickerEnd && showTimePickerBegin && <Text> au </Text>}
                            <View>
                                {showTimePickerEnd || <Button title="Choisir une date de fin" onPress={() => setShowTimePickerEnd(true)} />}
                                {showTimePickerEnd && (
                                    <DateTimePicker
                                        value={dateEnd}
                                        mode="date"
                                        display="default"
                                        onChange={handleTimeSelectEnd}
                                    />
                                )}
                            </View>
                        </View>
                    </View>
                    <View>
                        <Text style={styles.label}>Détails de la facture</Text>
                        <View>
                            {items.map((item, index) => (
                                <View key={index}>
                                    <TextInput
                                        placeholder="Prise en charge"
                                        style={styles.input}
                                        value={item.pc}
                                        onChangeText={(text) => handleInputChange(index,"pc", text)}
                                    />
                                    <TextInput
                                        placeholder="Quantité"
                                        style={styles.input}
                                        value={item.quantite}
                                        onChangeText={(text) => handleInputChange(index,"quantite",text)}
                                    />
                                    <TextInput
                                        placeholder="Prix unitaire de la location"
                                        style={styles.input}
                                        value={item.prix}
                                        onChangeText={(text) => handleInputChange(index,"prix", text)}
                                    />
                                </View>
                            ))}

                            <Button title={"Ajouter"} onPress={()=> increment()}/>
                        </View>
                    </View>
                </View>
                <Button title={"Valider"} onPress={handleSubmit}/>
            </View>
            <View style={styles.spacer} />
            <View>
            <Button title="Print" onPress={print} />
            <View style={styles.spacer} />
            <Button title="Print to PDF file" onPress={()=>printToFile(data)} />
            {Platform.OS === 'ios' && (
                <>
                    <View style={styles.spacer} />
                    <Button title="Select printer" onPress={selectPrinter} />
                    <View style={styles.spacer} />
                    {selectedPrinter ? (
                        <Text style={styles.printer}>{`Selected printer: ${selectedPrinter.name}`}</Text>
                    ) : undefined}
                </>
            )}
            </View>
        </ScrollView>
    );
}

/* @hide const styles = StyleSheet.create({ ... }); */
const styles = StyleSheet.create({
    input: {
        height: 40,
        margin: 12,
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
    },
    header: {
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#ecf0f1',
        flexDirection: 'column',
        padding: 8,
    },
    dateButton: {
      flexDirection: 'row',
        justifyContent: 'center',
        alignContent:'space-between'
    },
    spacer: {
        height: 8,
    },
    printer: {
        textAlign: 'center',
    },
    containerFooter: {
        flex: 2,
        justifyContent: 'flex-end',
        MarginTop: 10,


    },
    date: {
        textAlign: 'center',
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 12,
    },
    inputGroup: {
        flexDirection: 'row',
    },
    label: {
        textAlign: 'center',
        padding: 10,
        fontSize: 20,
        fontWeight: 'bold',
    }
});
/* @end */