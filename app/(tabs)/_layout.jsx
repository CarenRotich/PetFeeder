import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import AntDesign from '@expo/vector-icons/AntDesign';
import { Colors } from '../../constant/Colors';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: Colors.PRIMARY
    }}>
        <Tabs.Screen 
          name="home"
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({color}) => <AntDesign name="home" size={24} color={color} />
          }}
        />
        
        <Tabs.Screen 
          name="feedingHistory"
          options={{
            tabBarLabel: 'Feeding History',
            tabBarIcon: ({color}) => <AntDesign name="calendar" size={24} color={color} />
          }}
        />
    </Tabs>
  )
}