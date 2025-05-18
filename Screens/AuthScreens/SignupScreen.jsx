import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { TextInput, Button } from "react-native-paper";
import axios from "axios";
import { BASE_URLS } from "../../Utils/config";
const SignupScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureText, setSecureText] = useState(true);
  const handleSignup = async ({ navigation }) => {
    if (!name || !email || !password) {
      Alert.alert("Error", "All fields are required!");
      return;
    }
    try {
      const response = await axios.post(`${BASE_URLS}/api/auth/signup`, {
        name,
        email,
        password,
      });
      Alert.alert("Success", "Account created! Please login.");
      navigation.navigate("Login");
      
    } catch (error) {
      Alert.alert(
        "Signup Failed",
        error.response?.data?.errors[0]?.message || "Something went wrong"
      );
    }
  };

  return (
    <View style={{ padding: 20, flex: 1, justifyContent: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        Signup
      </Text>
      <TextInput
        label="Name"
        value={name}
        onChangeText={setName}
        mode="outlined"
        activeOutlineColor="#007BFF"
        outlineColor="#3E494A"
      />
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
            icon={secureText ? "eye-off" : "eye"} // Toggle between eye and eye-off
            onPress={() => setSecureText(!secureText)} // Toggle password visibility
          />
        }
        outlineColor="#3E494A"
        activeOutlineColor="#007BFF"
      />
      <Button mode="contained" onPress={handleSignup} style={{ marginTop: 20 , backgroundColor: "#007BFF"}}>
        Sign Up
      </Button>
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={{ textAlign: "center", marginTop: 10 }}>
          Already have an account? Login
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignupScreen;
