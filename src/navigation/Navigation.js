import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import Home from '../screens/Home';
import Add from '../screens/Add';
import LogIn from '../screens/LogIn';
import SingUp from '../screens/SingUp';

const Stack = createNativeStackNavigator();

const Navigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen 
                    name="LogIn" 
                    component={LogIn} 
                    options={{ title: 'LogIn', headerShown: false }} 
                />
                <Stack.Screen 
                    name="SingUp" 
                    component={SingUp} 
                    options={{ title: 'SingUp', headerShown: false }} 
                />
                <Stack.Screen 
                    name="Home" 
                    component={Home} 
                    options={{ title: 'Home', headerShown: true }} 
                />
                <Stack.Screen 
                    name="Add" 
                    component={Add} 
                    options={{ presentation: 'modal', title: 'Agregar productos', headerShown: true }} 
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default Navigation;
