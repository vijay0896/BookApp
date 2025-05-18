import React, { useEffect } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import ForResaleScreen from "./MyBooksScreens/ForResaleScreen";
import EbooksScreen from "./MyBooksScreens/EbooksScreen";


const Tab = createMaterialTopTabNavigator();

const MybookScreen = ({ navigation }) => {
 

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: "bold",
          color: "#3E494A", // Change color to confirm visibility
        },
        tabBarStyle: {
          backgroundColor: "white",
          elevation: 0,
        },
        tabBarIndicatorStyle: { backgroundColor: "#007BFF" },
        tabBarActiveTintColor: "#007BFF", // Active color
      }}
    >
      <Tab.Screen
        name="ForResale"
        component={ForResaleScreen}
        options={{ tabBarLabel: "For Resale" }}
      />
      <Tab.Screen
        name="Ebooks"
        component={EbooksScreen}
        options={{ tabBarLabel: "eBooks" }}
      />
    </Tab.Navigator>
  );
};

export default MybookScreen;
