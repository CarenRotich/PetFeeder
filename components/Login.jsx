import { Text, View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "@/constant/Colors"; 

export default function LoginScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
      <Image
        source={require("../assets/images/home.jpg")}
        style={styles.image}
      />
      <View style={styles.container}>
        <Text style={styles.title}>PetFeeder</Text>
        <Text style={styles.description}>
          Want to track your pet's feeding habits😊😍 and check how it's doing? Worry no more!😌We gotchu😎
        </Text>
        <Text style={styles.continueText}>Click here to continue</Text>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.7}
          onPress={() => {
             
            router.push("auth/Sign-In");
          }}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 500,
  },
  container: {
    backgroundColor: Colors.WHITE,
    marginTop: -20,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    padding: 15,
    height: "100%",
  },
  title: {
    fontSize: 30,
    fontFamily: "outfit-bold",
    color: Colors.PURPLE,
    textAlign: "center",
  },
  description: {
    fontFamily: "outfit-regular",
    color: Colors.PRIMARY,
    fontSize: 20,
    textAlign: "center",
  },
  continueText: {
    textAlign: "center",
    fontFamily: "outfit-bold",
    fontSize: 20,
  },
  button: {
    padding: 15,
    backgroundColor: Colors.PURPLE,
    borderRadius: 99,
    marginTop: "15%",
  },
  buttonText: {
    color: Colors.WHITE,
    textAlign: "center",
    fontFamily: "outfit-medium",
    fontSize: 20,
  },
});
