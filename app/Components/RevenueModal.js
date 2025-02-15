import { useEffect, useState } from "react";
import { View, Text, Modal, TouchableOpacity, ScrollView } from "react-native";
import { Button } from "@ant-design/react-native";
import { getOrders } from "./Orders";

export default function RevenueModal({ visible, onClose }) {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [orders, setOrders] = useState([]);
  const [cashRevenue, setCashRevenue] = useState(0);

  useEffect(() => {
    async function fetchOrders() {
      const ordersData = await getOrders();
      
      // Get today's date in dd/mm/yyyy format
      const today = new Date();
      const todayString = today.toLocaleDateString("en-GB"); // "dd/mm/yyyy"

      // Filter orders for today
      const todayOrders = ordersData.filter(order => order.date === todayString);

      setOrders(todayOrders);
      
      // Calculate total revenue for today
      const revenue = todayOrders.reduce((total, order) => total + parseFloat(order.total), 0);
      setTotalRevenue(revenue.toFixed(2));
    

    const cashTotal = todayOrders
        .filter(order => order.paymentMethod.toLowerCase() === "cash")
        .reduce((total, order) => total + parseFloat(order.total), 0);
        setCashRevenue(cashTotal.toFixed(2));
    }

    if (visible) {
      fetchOrders();
    }
  }, [visible]);

  return (
    <Modal transparent visible={visible} onRequestClose={onClose}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
        <View style={{ width: 600, maxHeight: 500, backgroundColor: "white", borderRadius: 20, padding: 20 }}>
          <Text className="text-2xl text-center mb-4 font-bold">Revenue day: {new Date().toLocaleDateString('en-GB')}</Text>
          <View className="flex-row justify-between items-center p-4">
            <View className="bg-red-400 p-4 rounded-3xl">
              <Text className="text-2xl text-center mb-4 font-bold">Total Revenue</Text>
              <Text className="text-xl text-center font-bold mb-4">${totalRevenue}</Text>
            </View>

            <View className="bg-yellow-400 p-4 min-w-32 rounded-3xl">
              <Text className="text-2xl text-center mb-4 font-bold">Orders</Text>
              <Text className="text-xl text-center font-bold mb-4">{orders.length}</Text>
            </View>

            <View className="bg-green-400 p-4 min-w-32 rounded-3xl">
              <Text className="text-2xl text-center mb-4 font-bold">Cashs</Text>
              <Text className="text-xl text-center font-bold mb-4">${cashRevenue}</Text>
            </View>            

            <View className="bg-blue-400 p-4 min-w-32 rounded-3xl">
              <Text className="text-2xl text-center mb-4 font-bold">Banks</Text>
              <Text className="text-xl text-center font-bold mb-4">${(totalRevenue - cashRevenue).toFixed(2)}</Text>
            </View>
          </View>
          
          <ScrollView>
            {orders.map((order, index) => (
              <View key={index} style={{ marginBottom: 10, padding: 10, borderBottomWidth: 1 }}>
                <Text className="text-lg">Order ID: {order.orderId}</Text>
                <Text className="text-lg">Total: ${order.total}</Text>
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity onPress={onClose}>
            <Text className="text-center text-lg text-blue-500 mt-4">Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
