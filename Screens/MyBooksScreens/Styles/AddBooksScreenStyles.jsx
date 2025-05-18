import { StyleSheet } from "react-native";
export const sharedStyles = StyleSheet.create({
    container: {
        padding: 20,
      },
      
      imageUpload: {
        height: 180,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: "#B0BEC5",
        borderStyle: "dashed",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
        backgroundColor: "#ECEFF1",
        overflow: "hidden",
      },
      uploadPlaceholder: {
        alignItems: "center",
      },
      uploadText: {
        marginTop: 6,
        color: "#555",
        fontSize: 14,
      },
      coverImage: {
        width: "100%",
        height: "100%",
        borderRadius: 12,
      },
      card: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 16,
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
      },
      input: {
        marginBottom: 14,
        backgroundColor: "#fff",
      },
      buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 30,
      },
      button: {
        flex: 1,
        marginHorizontal: 5,
        borderRadius: 10,
        paddingVertical: 5,
      },
      cancelButton: {
        borderColor: "#B0BEC5",
      },
      addButton: {
        backgroundColor: "#2E7D32",
      },
      pdfUpload: {
        height: 80,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: "#d32f2f",
        borderStyle: "dashed",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
        backgroundColor: "#FFEBEE",
      },
})