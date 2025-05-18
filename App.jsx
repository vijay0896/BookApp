import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, View, Button } from "react-native";
import HomeTabs from "./Tabs/HomeTabs";
import LoginScreen from "./Screens/AuthScreens/LoginScreen";
import SignupScreen from "./Screens/AuthScreens/SignupScreen";
import resaleBooksDetails from "./Screens/MyBooksDetails/ResaleDetailsScreen";
import EBooksDetails from "./Screens/MyBooksDetails/EbookDetailsScreen";
import PDFViewer from "./Screens/MyBooksDetails/PDFViewer";
import AddResaleBookScreen from "./Screens/MyBooksScreens/AddResaleBookScreen";
import AddEbookScreen from "./Screens/MyBooksScreens/AddEbookScreen";
import OrderDetailsScreen from "./Screens/NotificationsScreens/OrderDetailsScreen";
import AllBooksScreen from "./Screens/AllBooksScreen";
import AllUsersScreen from "./Screens/AllUsersScreen";
import { SafeAreaProvider } from "react-native-safe-area-context";
const Stack = createStackNavigator();
import CustomBackButton from "./CustomBackButton";
import BooksDetails from "./Screens/BooksDetails";
import OwnerDetailsScreen from "./Screens/OwnerDetailsScreen";
export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        if (storedUserId) {
          setUserId(storedUserId);
          console.log("Fetched userId:", storedUserId);
        }
      } catch (error) {
        console.error("Failed to fetch userId:", error);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        setIsLoggedIn(!!token);
      } catch (error) {
        console.error("Error checking login status:", error);
      } finally {
        setIsLoading(false);
      }
    };
    checkLoginStatus();
  }, []);

  const handleSignOut = async () => {
    try {
      await AsyncStorage.removeItem("authToken");
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator tabBar={(props) => <CustomTabBar {...props} />}>
          {isLoggedIn ? (
            <>
              <Stack.Screen
                name="HomeTabs"
                component={HomeTabs}
                options={{
                  headerShown: false,
                  title: " ",
                  headerRight: () => (
                    <Button title="Sign Out" onPress={handleSignOut} />
                  ),
                }} // Add sign-out button
                initialParams={{ setLoggedIn: setIsLoggedIn }} // Pass setIsLoggedIn
              />
              <Stack.Screen
                name="resaleBooksDetails"
                component={resaleBooksDetails}
                options={{
                  title: "Resale Books",
                  headerLeft: () => <CustomBackButton />,
                }}
              />
              <Stack.Screen
                name="EBooksDetails"
                component={EBooksDetails}
                options={{
                  title: "eBooks",
                  headerLeft: () => <CustomBackButton />,
                }}
              />
              <Stack.Screen
                name="PDFViewer"
                component={PDFViewer}
                options={{
                  title: "eBooks",
                  headerLeft: () => <CustomBackButton />,
                }}
              />
              <Stack.Screen
                name="AddResaleBookScreen"
                component={AddResaleBookScreen}
                options={{
                  title: "Add book",
                  headerLeft: () => <CustomBackButton />,
                }}
              />
              <Stack.Screen
                name="AddEbookScreen"
                component={AddEbookScreen}
                options={{
                  title: "Add eBook",
                  headerLeft: () => <CustomBackButton />,
                }}
              />
              <Stack.Screen
                name="BooksDetails"
                component={BooksDetails}
                options={{
                  title: "Books Details",
                  headerLeft: () => <CustomBackButton />,
                }}
              />
              <Stack.Screen
                name="OwnerDetailsScreen"
                component={OwnerDetailsScreen}
                options={{
                  title: "Books Provider",
                  headerLeft: () => <CustomBackButton />,
                }}
              />
              <Stack.Screen
                name="OrderDetails"
                component={OrderDetailsScreen}
                options={{
                  title: "Order Details",
                  headerLeft: () => <CustomBackButton />,
                }}
              />

              <Stack.Screen
                name="AllBooksScreen"
                component={AllBooksScreen}
                options={{
                  title: "Books",
                  headerLeft: () => <CustomBackButton />,
                }}
              />
              <Stack.Screen
                name="AllUsersScreen"
                component={AllUsersScreen}
                options={{
                  title: "All Users",
                  headerLeft: () => <CustomBackButton />,
                }}
              />
            </>
          ) : (
            <>
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                initialParams={{ setLoggedIn: setIsLoggedIn }}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Signup"
                component={SignupScreen}
                options={{ headerShown: false }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
