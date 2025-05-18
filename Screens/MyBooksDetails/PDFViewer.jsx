import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";
import { useRoute } from "@react-navigation/native";

const PDFViewer = () => {
  const route = useRoute();
  const { pdfUrl, title } = route.params;

  return (
    <View style={styles.container}>
      {/* <View style={styles.header}>
        <Text style={styles.headerText}>{title}</Text>
      </View> */}
      <WebView
        source={{ uri: pdfUrl }}
        style={{ flex: 1 }}
        startInLoadingState={true}
        originWhitelist={["*"]}
        useWebKit={true}
        javaScriptEnabled={true}
        renderLoading={() => <ActivityIndicator size="large" color="#007BFF" />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: "#007bff",
    padding: 15,
  },
  headerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default PDFViewer;
