import { useState } from "react";
import { View, Text, Modal, TextInput, TouchableOpacity, Alert } from "react-native";
import { Button } from "@ant-design/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const users = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    isAdmin: true,
  },
  {
    name: "Regular User",
    email: "user@example.com",
    password: "user123",
    isAdmin: false,
  },
];

export default function LogInModal({ visible, onClose, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  

  const handleLogin = async () => {
    const user = users.find((u) => u.email === email && u.password === password);
    if (user) {
      try {
        await AsyncStorage.setItem("user", JSON.stringify(user));
        Alert.alert("Login Successful", `Welcome, ${user.name}!`);
        onLogin(user);
        onClose();
      } catch (error) {
        Alert.alert("Storage Error", "Failed to save user data");
      }
    } else {
      Alert.alert("Login Failed", "Invalid email or password");
    }
  };

  return (
    <Modal transparent visible={visible} onRequestClose={onClose}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
        <View style={{ width: 300, backgroundColor: "white", padding: 20, borderRadius: 10 }}>
          <Text className="text-2xl text-center mb-4 font-bold">Login</Text>
          
          <Text className="text-lg">Email:</Text>
          <TextInput
            className="border p-2 mb-4"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter email"
            keyboardType="email-address"
          />
          
          <Text className="text-lg">Password:</Text>
          <TextInput
            className="border p-2 mb-4"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter password"
            secureTextEntry
          />
          
          <Button type="primary" onPress={handleLogin}>Login</Button>
          <TouchableOpacity onPress={onClose}>
            <Text className="text-center text-lg text-blue-500 mt-4">Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}