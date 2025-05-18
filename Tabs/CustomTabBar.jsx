import React from "react";
import { TouchableOpacity, View, Text, Image, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <SafeAreaView
      edges={['bottom']}
      style={{
        flexDirection: "row",
        backgroundColor: "rgba(138, 141, 147, 0.1)",
        borderTopWidth: 0,
        borderTopColor: "rgba(138, 141, 147, 0.5)",
        paddingBottom: Platform.OS === 'android' ? 5 : -10,
        // height: Platform.OS === 'android' ? 60 : 70,
      }}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel ?? options.title ?? route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const renderIcon = () => {
          switch (label) {
            case "Home":
              return isFocused
                ? require("../assets/Home.png")
                : require("../assets/HomeOutline.png");
            case "My Books":
              return isFocused
                ? require("../assets/Books_Fill.png")
                : require("../assets/Books.png");
            case "Notifications":
              return isFocused
                ? require("../assets/notifications_Fill.png")
                : require("../assets/notifications.png");
            case "Profile":
              return isFocused
                ? require("../assets/AccountFill.png")
                : require("../assets/AccountOutline.png");
            default:
              return null;
          }
        };

        return (
          <TouchableOpacity
            key={index}
            onPress={onPress}
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              paddingTop: 6,
            }}
          >
            <Image
              source={renderIcon()}
              style={{
                width: 24,
                height: 24,
                tintColor: isFocused ? "#3E494A" : "#616161",
              }}
            />
            <Text
              style={{ color: isFocused ? "#3E494A" : "#616161", fontSize: 10 }}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </SafeAreaView>
  );
};

export default CustomTabBar;
