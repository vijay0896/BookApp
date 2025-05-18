// NotificationsTabs.js
import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import BookRequests from "./NotificationsScreens/BookRequests"; // your existing Notifications
import MyOrders from "./NotificationsScreens/MyOrders"; // new screen

const Tab = createMaterialTopTabNavigator();

const NotificationsTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: { fontSize: 14 },
        tabBarIndicatorStyle: { backgroundColor: "#007bff" },
        tabBarStyle: { backgroundColor: "white" },
      }}
    >
      <Tab.Screen name="Book Requests" component={BookRequests} />
      <Tab.Screen name="My Orders" component={MyOrders} />
    </Tab.Navigator>
  );
};

export default NotificationsTabs;
