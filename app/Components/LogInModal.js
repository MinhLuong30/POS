import { useEffect, useState } from "react";
import { View, Text, Modal, TextInput, TouchableOpacity, Alert } from "react-native";
import { Button } from "@ant-design/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useLocation from "../../hooks/useLocation";
import axios from "axios";

export default function LogInModal({ visible, onClose, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState([]);
  const { location } = useLocation();

  const API_URL = "https://67de1bf4471aaaa742834afe.mockapi.io/POS"; // Replace with your actual API URL

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_URL}/User`);
        setUsers(response.data);
      } catch (error) {
        Alert.alert("Error", "Failed to fetch users");
      }
    };
    fetchUsers();
  }, []);

  // Handle login API call
  const loginUser = async (name, email, location) => {
    try {
      const time = new Date().toISOString();
      const response = await axios.post(`${API_URL}/Attendance`, {
        name,
        email,
        location,
        type: "CheckIn",
        time,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || "Login failed";
    }
  };

  // Handle login logic
  const handleLogin = async () => {
    const user = users.find((u) => u.email === email && u.password === password);
    if (user) {
      try {
        await loginUser(user.name, user.email, location[0]?.formattedAddress || "Unknown Location");
        await AsyncStorage.setItem("user", JSON.stringify(user));
        Alert.alert("Login Successful", `Welcome, ${user.name}!`);
        onLogin(user);
        onClose();
      } catch (error) {
        Alert.alert("Login Error", error.toString());
      }
    } else {
      Alert.alert("Login Failed", "Invalid email or password");
    }
  };

  return (
    <Modal transparent visible={visible} onRequestClose={onClose}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
        <View style={{ width: 300, backgroundColor: "white", padding: 20, borderRadius: 10 }}>
          <Text style={{ fontSize: 20, textAlign: "center", marginBottom: 16, fontWeight: "bold" }}>Login</Text>

          <Text style={{ fontSize: 16 }}>Email:</Text>
          <TextInput
            style={{ borderWidth: 1, padding: 8, marginBottom: 12 }}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter email"
            keyboardType="email-address"
          />

          <Text style={{ fontSize: 16 }}>Password:</Text>
          <TextInput
            style={{ borderWidth: 1, padding: 8, marginBottom: 12 }}
            value={password}
            onChangeText={setPassword}
            placeholder="Enter password"
            secureTextEntry
          />

          <Button type="primary" onPress={handleLogin}>Login</Button>
          <TouchableOpacity onPress={onClose}>
            <Text style={{ textAlign: "center", fontSize: 16, color: "blue", marginTop: 16 }}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
