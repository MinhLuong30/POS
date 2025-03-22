import { useEffect, useState } from "react";
import { View, Text, Modal, TouchableOpacity, ScrollView } from "react-native";

import axios from "axios";
import { Button, Picker } from "@ant-design/react-native";

export default function RevenueModal({ visible, onClose }) {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [orders, setOrders] = useState([]);
  const [cashRevenue, setCashRevenue] = useState(0);
  const [filter, setFilter] = useState("day");

  const API_URL = "https://67da6f3835c87309f52c737a.mockapi.io/Orders/FoodOrders";

  const fetchOrders = async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      return [];
    }
  };

  useEffect(() => {
    async function getOrdersData() {
      const ordersData = await fetchOrders();
      const today = new Date();
      let filteredOrders = [];

      if (filter === "day") {
        const todayString = today.toLocaleDateString("en-GB");
        filteredOrders = ordersData.filter(order => order.date === todayString);
      } else if (filter === "week") {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(today.getDate() - 7);
        filteredOrders = ordersData.filter(order => new Date(order.date.split("/").reverse().join("-")) >= oneWeekAgo);
      } else if (filter === "month") {
        const thisMonth = today.getMonth();
        const thisYear = today.getFullYear();
        filteredOrders = ordersData.filter(order => {
          const [day, month, year] = order.date.split("/").map(Number);
          return month - 1 === thisMonth && year === thisYear;
        });
      }

      setOrders(filteredOrders);
      const revenue = filteredOrders.reduce((total, order) => total + parseFloat(order.total), 0);
      setTotalRevenue(revenue.toFixed(2));

      const cashTotal = filteredOrders
        .filter(order => order.paymentMethod.toLowerCase() === "cash")
        .reduce((total, order) => total + parseFloat(order.total), 0);
      setCashRevenue(cashTotal.toFixed(2));
    }

    if (visible) {
      getOrdersData();
    }
  }, [visible, filter]);

  return (
    <Modal transparent visible={visible} onRequestClose={onClose}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
        <View style={{ width: 600, maxHeight: 500, backgroundColor: "white", borderRadius: 20, padding: 20 }}>
          <Text className="text-2xl text-center mb-4 font-bold">Revenue Report</Text>
          <View style={{ flexDirection: "row", justifyContent: "center", marginBottom: 10 }}>
            <Button type={filter === "day" ? "primary" : "default"} onPress={() => setFilter("day")}>Day</Button>
            <Button type={filter === "week" ? "primary" : "default"} onPress={() => setFilter("week")} style={{ marginHorizontal: 10 }}>Week</Button>
            <Button type={filter === "month" ? "primary" : "default"} onPress={() => setFilter("month")} >Month</Button>
          </View>
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
              <Text className="text-2xl text-center mb-4 font-bold">Cash</Text>
              <Text className="text-xl text-center font-bold mb-4">${cashRevenue}</Text>
            </View>
            <View className="bg-blue-400 p-4 min-w-32 rounded-3xl">
              <Text className="text-2xl text-center mb-4 font-bold">Bank</Text>
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