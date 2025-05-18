import React, { useState } from "react";
import { View, Text, Alert } from "react-native";
import { TextInput, Button } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

import { BASE_URLS } from "../../Utils/config";

const LoginScreen = ({ route, navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureText, setSecureText] = useState(true);
  const { setLoggedIn } = route.params; // Receive setLoggedIn from route.params

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "All fields are required!");
      return;
    }

    try {
      const response = await axios.post(`${BASE_URLS}/api/auth/login`, {
        email,
        password,
      });

      const token = response.data.token;

      // Store token
      await AsyncStorage.setItem("authToken", token);

      // ✅ Decode token to extract and store user ID
      const decoded = jwtDecode(token);
      await AsyncStorage.setItem("userId", decoded.id.toString());

      console.log("User ID stored:", decoded.id);
      const storedUserId = await AsyncStorage.getItem("userId");
      console.log("📦 Stored userId:", storedUserId); // Check this shows correctly

      // Update app state
      setLoggedIn(true);
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert(
        "Login Failed",
        error.response?.data?.message || "Invalid credentials"
      );
    }
  };

  return (
    <View style={{ padding: 20, flex: 1, justifyContent: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        Login
      </Text>
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        keyboardType="email-address"
        activeOutlineColor="#007BFF"
        outlineColor="#3E494A"
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        secureTextEntry={secureText}
        right={
          <TextInput.Icon
            icon={secureText ? "eye-off" : "eye"}
            onPress={() => setSecureText(!secureText)}
          />
        }
        outlineColor="#3E494A"
        activeOutlineColor="#007BFF"
      />

      <Button
        mode="contained"
        onPress={handleLogin}
        style={{ marginTop: 20, backgroundColor: "#007BFF" }}
      >
        Login
      </Button>
      <Button
        mode="text"
        onPress={() => navigation.navigate("Signup")}
        style={{ marginTop: 10 }}
        textColor="#3E494A"
      >
        Sign up
      </Button>
    </View>
  );
};

export default LoginScreen;
