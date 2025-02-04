import { useState } from "react";
import { View, Text, ScrollView, Alert, Modal, TouchableOpacity } from "react-native";
import { Card, Button, Picker, Collapse } from "@ant-design/react-native";
import japaneseFoodData from "../Data";
import { saveOrder, getOrders } from "./Orders";
import { CollapsePanel } from "@ant-design/react-native/lib/collapse/collapse";

export default function OrderFood({ quantities }) {
  const [orderType, setOrderType] = useState("Eat Here");
  const [modalVisible, setModalVisible] = useState(false);
  const [orderCounter, setOrderCounter] = useState(1); 
    // Function to handle order placement with auto-generated Order ID
    const handlePlaceOrder = () => {
        const orderItems = Object.entries(quantities)
          .filter(([_, quantity]) => quantity > 0)
          .map(([itemName, quantity]) => {
            const item = japaneseFoodData.find((food) => food.name === itemName);
            return { name: item.name, quantity, price: item.price };
          });
    
        if (orderItems.length === 0) {
          Alert.alert("Order Error", "No items selected!");
          return;
        }
    
        const total = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    
        // Generate a unique Order ID using the current timestamp
        const orderId = `OD-${String(orderCounter).padStart(3, '0')}`;
    
        // Create the new order object
        const newOrder = { 
          orderId,          // New generated order ID
          orderType, 
          items: orderItems, 
          total, 
          timestamp: new Date().toISOString() 
        };
    
        // Save the order
        saveOrder(newOrder);
        setOrderCounter(prevCounter => prevCounter + 1);

        Alert.alert("Order Placed", "Your order has been saved with ID: " + orderId);
      };
    

  // Function to handle showing orders
  const handleShowOrders = () => {
    setModalVisible(true);
  };

  return (
    <View className="flex-1 h-fit ml-3 bg-gray-100 p-4 mb-10">
      <Text className="text-3xl text-center mb-4 font-bold">Order Food</Text>
      
      {/* Select Dropdown for Order Type */}
      <Picker
        data={[
          { label: "Eat Here", value: "Eat Here" },
          { label: "Take-Away", value: "Take-Away" }
        ]}
        cols={1}
        value={[orderType]}
        onChange={(val) => setOrderType(val[0])}
      >
        <Button>{orderType}</Button>
      </Picker>

      {/* Scrollable Food List */}
      <View style={{ flex: 1, maxHeight: 250, marginTop: 20 }}>
        <ScrollView
          style={{ backgroundColor: "white", borderRadius: 20, padding: 10 }}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {Object.entries(quantities).map(([itemName, quantity]) => {
            if (quantity > 0) {
              const item = japaneseFoodData.find((food) => food.name === itemName);
              return (
                <Card key={itemName} style={{ marginBottom: 10, borderRadius: 20 }}>
                  <Card.Header title={<Text className="w-auto text-center text-xl">{item.name}</Text>} />
                  <Card.Body>
                    <View className="flex-row items-center justify-between ml-5 mr-5">
                      <Text className="text-xl font-bold">{item.price} $</Text>
                      <Text className="text-lg">Quantity: {quantity}</Text>
                    </View>
                  </Card.Body>
                </Card>
              );
            }
            return null;
          })}
        </ScrollView>
      </View>

      {/* Fixed Button at Bottom */}
      <View className="flex-row items-center justify-between mt-5">
        <Text className="text-xl font-bold">
          Total: {Object.entries(quantities).reduce((acc, [itemName, quantity]) => {
            const item = japaneseFoodData.find((food) => food.name === itemName);
            return acc + (item.price * quantity);
          }, 0)} $
        </Text>
        <Button type="primary" onPress={handlePlaceOrder}>Place Order</Button>
      </View>

      {/* Show Orders Button */}
      <View className="flex-row items-center justify-between mt-5">
        <Button type="default" onPress={handleShowOrders}>Show Orders</Button>
      </View>

      {/* Modal to display orders */}
      <Modal
  style={{ flex: 1 }}
  animationType="slide"
  transparent={true}
  visible={modalVisible}
  onRequestClose={() => setModalVisible(false)}
>
  <View style={{ 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "rgba(0,0,0,0.5)" 
  }}>
    <View style={{ 
      width: 300, 
      maxHeight: 500, 
      backgroundColor: "white", 
      borderRadius: 20, 
      padding: 20 
    }}>
      <Text className="text-2xl text-center mb-4 font-bold">Orders</Text>
      
      {/* Collapse to show order details */}
      <ScrollView>
        <Collapse accordion>
          {getOrders().map((order, index) => (
            <CollapsePanel
              title={`Order ID: ${order.orderId || 'Unknown'}`}
              key={index}
            >
              <Text className="text-lg font-bold">Total: {order.total} $</Text>
              <Text className="text-lg">Timestamp: {order.timestamp}</Text>
              <Text className="text-lg">Items:</Text>
              {order.items.map((item, idx) => (
                <Text key={idx} className="text-lg">- {item.name} x {item.quantity}</Text>
              ))}
            </CollapsePanel>
          ))}
        </Collapse>
      </ScrollView>

      <TouchableOpacity onPress={() => setModalVisible(false)}>
        <Text className="text-center text-lg text-blue-500 mt-4">Close</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

    </View>
  );
}
