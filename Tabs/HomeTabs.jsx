import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../Screens/Home";
import ProfileScreen from "../Screens/Profile";
import MybookScreen from "../Screens/MyBooks";
import NotificationScreen from "../Screens/NotificationsTabs";
import CustomTabBar from "./CustomTabBar";
import CustomBackButton from "../CustomBackButton";

// ✅ Import SafeAreaProvider
import { SafeAreaProvider } from "react-native-safe-area-context";

const Tab = createBottomTabNavigator();

const HomeTabs = ({ route }) => {
  const { setLoggedIn } = route.params; // Get setLoggedIn from App.js

  return (
    // ✅ Wrap the tab navigator in SafeAreaProvider
    <SafeAreaProvider>
      <Tab.Navigator
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerStyle: {
            borderBottomWidth: 0,
            elevation: 0,
          },
          headerTintColor: "#424242",
          headerTitleStyle: {
            fontWeight: "600",
            fontFamily: "Rubik-Medium",
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="My Books"
          component={MybookScreen}
          options={{
            headerLeft: () => <CustomBackButton />,
          }}
        />
        <Tab.Screen
          name="Notifications"
          component={NotificationScreen}
          options={{
            headerLeft: () => <CustomBackButton />,
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            headerLeft: () => <CustomBackButton />,
          }}
          initialParams={{ setLoggedIn }} // Pass setLoggedIn to ProfileScreen
        />
      </Tab.Navigator>
    </SafeAreaProvider>
  );
};

export default HomeTabs;
