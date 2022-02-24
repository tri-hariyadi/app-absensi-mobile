import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  SplashScreen,
  WelcomeScreen,
  LoginPage,
  HomePage,
  ProfilePage,
  AddAttendancePage,
  DetailAttendancePage,
  ChangeProfilePage,
  AttendanceOutPage,
  ReimbursementPage,
  ApplyReimbursementPage,
  ReportPage,
  NotificationPage,
  NotificationDetailPage,
  OffWorkPage,
  ChangePassword,
  Reminder
} from '../pages';
import { BottomNavigator } from '../components';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainApp = () => {
  return (
    <Tab.Navigator tabBar={props => <BottomNavigator {...props} />}>
      <Tab.Screen name="Home" component={HomePage} />
      <Tab.Screen name="Reimbursement" component={ReimbursementPage} />
      <Tab.Screen name="Profile" component={ProfilePage} options={{ tabBarBadge: 2 }} />
    </Tab.Navigator>
  )
}

const Routes = () => {
  return (
    <Stack.Navigator initialRouteName='SplashScreen'>
      <Stack.Screen
        name='SplashScreen'
        component={SplashScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='WelcomeScreen'
        component={WelcomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='LoginPage'
        component={LoginPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='MainApp'
        component={MainApp}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='AddAttendancePage'
        component={AddAttendancePage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='DetailAttendancePage'
        component={DetailAttendancePage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='ChangeProfilePage'
        component={ChangeProfilePage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='AttendanceOutPage'
        component={AttendanceOutPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='ApplyReimbursementPage'
        component={ApplyReimbursementPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='ReportPage'
        component={ReportPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='NotificationPage'
        component={NotificationPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='NotificationDetailPage'
        component={NotificationDetailPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='OffWorkPage'
        component={OffWorkPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='ChangePassword'
        component={ChangePassword}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='Reminder'
        component={Reminder}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  )
}

export default Routes;
