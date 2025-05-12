import { Text, View } from "react-native";
import Footer from "@/components/Footer/Footer";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Footer />
    </View>
  );
}