import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import LoginScreen from './src/screens/LoginScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import ManualsScreen from './src/screens/ManualsScreen';
import ContactsScreen from './src/screens/ContactsScreen';
import AdminScreen from './src/screens/AdminScreen';

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <StatusBar style="light" />
            <Stack.Navigator
                initialRouteName="Login"
                screenOptions={{
                    headerShown: true,
                    headerTransparent: true,
                    headerTintColor: '#fff',
                    headerTitleStyle: { fontWeight: 'bold' },
                    headerBackTitleVisible: false,
                }}
            >
                <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Welcome"
                    component={WelcomeScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Manuals"
                    component={ManualsScreen}
                    options={{ title: '' }}
                />
                <Stack.Screen
                    name="Contacts"
                    component={ContactsScreen}
                    options={{ title: '' }}
                />
                <Stack.Screen
                    name="Admin"
                    component={AdminScreen}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
