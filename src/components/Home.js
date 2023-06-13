import {Text, StyleSheet, View, Button} from "react-native";

export default function Home({navigation})
{
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Bienvenue dans l'application OPENFAC</Text>
            </View>
            <View>
                <Text>Vous pouvez imprimer vos factures en cliquant sur le bouton ci-dessous</Text>
                <Button title={"Imprimer"} onPress={() => {navigation.navigate("Print")}}/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        backgroundColor: '#fff',
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',

    }
})