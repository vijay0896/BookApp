// src/styles/sharedStyles.js

import { StyleSheet } from "react-native";

export const sharedStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 10,
    // alignItems: "center",
  },
  list: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: "flex-start",
  },
  card: {
    borderRadius: 5,
    padding: 6,
    width: "32%",
    alignItems: "center",
    marginBottom: 7,
    borderColor: "#CFCFCF",
    borderWidth: 1,
    marginEnd:7,
  },
  bookImage: {
    width: "100%",
    height: 140,
    resizeMode: "stretch",
    borderRadius: 4,
    marginBottom: 8,
  },
  placeholderImage: {
    width: "100%",
    height: 140,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    borderRadius: 6,
  },
  title: {
    fontSize: 11,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
  status: {
    fontSize: 11,
    color: "#666",
    textAlign: "center",
  },
  noBooksText: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
  },
  skeletonImage: {
    width: "100%",
    height: 140,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    marginBottom: 8,
  },
  skeletonText: {
    width: "80%",
    height: 12,
    backgroundColor: "#ddd",
    borderRadius: 4,
    marginBottom: 6,
  },
  skeletonTextSmall: {
    width: "60%",
    height: 10,
    backgroundColor: "#ddd",
    borderRadius: 4,
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
    backgroundColor: "#3E494A",
  },
  listWithTopMargin: {
    // paddingBottom: 100,
    paddingTop: 4,
  },
  requestButton: {
    backgroundColor: "#4CAF50",
    padding: 6,
    borderRadius: 6,
    marginTop: 8,
    alignItems: "center",
  },

  requestButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
