import React from "react";
import { TouchableOpacity, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";


const CustomBackButton = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.backButton}
      onPress={() => navigation.goBack()}
    >
      
      <Image
       source={require("./assets/arrow_back.png")}
        style={{
          width: 24,
          height: 24,
          tintColor: "#3E494A",
        }}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backButton: {
    marginLeft: 15,
    padding: 10,
  },
 
});

export default CustomBackButton;
