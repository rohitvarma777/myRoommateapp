import * as React from 'react';
import { AppRegistry } from 'react-native';
import { Provider as PaperProvider, MD3LightTheme as DefaultTheme } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import TaskSchedulingScreen from './screens/TaskSchedulingScreen';
import ExpenseManagementScreen from './screens/ExpenseManagementScreen';
import GroupMembersScreen from './screens/GroupMembersScreen';
import GroupScreen from './screens/GroupScreen'; 

const Stack = createNativeStackNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6200EE',   
    accent: '#03DAC6',    
    background: '#F8F9FA', 
    surface: '#FFFFFF',   
    text: '#212529',      
    onSurface: '#212529',  
    onBackground: '#212529', 
    error: '#B00020',     
    outline: '#BDBDBD',   
    primaryContainer: '#D0BCFF', 
    onPrimaryContainer: '#21005D', 
  },
};

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Group">
          {}
          <Stack.Screen
            name="Group"
            component={GroupScreen}
            options={{ title: 'Select Group', headerTitleAlign: 'center' }}
          />
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: 'My Roommate', headerTitleAlign: 'center' }}
          />
          <Stack.Screen
            name="TaskScheduling"
            component={TaskSchedulingScreen}
            options={{ title: 'Manage Chores', headerTitleAlign: 'center' }}
          />
          <Stack.Screen
            name="ExpenseManagement"
            component={ExpenseManagementScreen}
            options={{ title: 'Manage Expenses', headerTitleAlign: 'center' }}
          />
          <Stack.Screen
            name="GroupMembers"
            component={GroupMembersScreen}
            options={{ title: 'Group Members', headerTitleAlign: 'center' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

AppRegistry.registerComponent('RoommateApp', () => App);