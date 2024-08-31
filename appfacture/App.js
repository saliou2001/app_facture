import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import Home from "./src/components/Home";
import PrintScreen from "./src/components/PrintScreen";

export default function App() {
  const stack= createNativeStackNavigator()
  return (
    <NavigationContainer>
        <stack.Navigator>
            <stack.Screen name="Home" component={Home} options={
                {
                    title: 'OPENFAC',
                }
            }/>
            <stack.Screen name="Print" component={PrintScreen} options={
                {
                    title: 'Facture',
                }
            }/>

        </stack.Navigator>

    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
