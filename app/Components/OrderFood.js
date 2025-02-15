import { useEffect, useState } from "react";
import { View, Text, ScrollView, Alert, Modal, TouchableOpacity } from "react-native";
import { Card, Button, Picker, Collapse, Input } from "@ant-design/react-native";
import { saveOrder, getOrders } from "./Orders";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import * as Print from "expo-print"; 
import japaneseFoodData from "../Data";
import { printOrder } from "./PrintOrder";
import BillModal from "./BillModal";
import RevenueModal from "./RevenueModal";

export default function OrderFood({ quantities, resetQuantities }) {
  const [orderType, setOrderType] = useState("Eat Here");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [modalVisible, setModalVisible] = useState(false);
  const [billModalVisible, setBillModalVisible] = useState(false);
  const [orderCounter, setOrderCounter] = useState(1);
  const [currentOrder, setCurrentOrder] = useState(null); // Store the latest order for the bill
  const [amountPaid, setAmountPaid] = useState("");
  const [revenueModalVisible, setRevenueModalVisible] = useState(false);
  

  

  const handleAmountPaidChange = (text) => {
    // Convert text input to a number, default to 0 if empty or invalid
    const value = parseFloat(text);
    setAmountPaid(isNaN(value) ? "" : value);
  };

  const handlePaymentChange = (val) => {
    const selectedMethod = val[0];
    setPaymentMethod(selectedMethod);
  
    if (selectedMethod === "Bank Transfer") {
      setAmountPaid(totalAmount); // Ensure amountPaid matches totalAmount
    } else {
      setAmountPaid("");
    }
  };
  
  useEffect(() => {
    if (paymentMethod === "Bank Transfer") {
      setAmountPaid(totalAmount);
    }
  }, [totalAmount]); 
  


  const getOrderItemPrice = (itemName, quantity) => {
    const item = japaneseFoodData.find((food) => food.name === itemName);
    return item ? item.price * quantity : 0; // Return calculated price or 0 if item not found
  };
  // Function to handle order placement
  const handlePlaceOrder = () => {
    const orderItems = Object.entries(quantities)
  .filter(([_, quantity]) => quantity > 0)
  .map(([itemName, quantity]) => ({
    name: itemName,
    price: getOrderItemPrice(itemName, quantity),
    quantity,
  }));

  if (orderItems.length === 0) {
    Alert.alert("Order Error", "No items selected!");
    return;
  }
    const total = orderItems.reduce((acc, item) => acc + item.price , 0).toFixed(2); 

    // Generate Order ID in format OD-001, OD-002...
    const orderId = `OD-${String(orderCounter).padStart(3, "0")}`;

    // Create the new order object
    const date = new Date().toLocaleDateString("en-GB"); // Format date as dd/mm/yyyy
    const newOrder = {
      orderId,
      orderType,
      items: orderItems,
      total,
      date,
      timestamp: new Date().toLocaleString(),
      paymentMethod,
    };

    // Save the order
    saveOrder(newOrder);
    setOrderCounter((prevCounter) => prevCounter + 1);

    setCurrentOrder(newOrder); // Set the current order for printing
    setBillModalVisible(true); // Show bill modal

  };

  const handleClose = () => {
    setBillModalVisible(false);
    handlePaymentChange(["Cash"]);
    setAmountPaid("");
    resetQuantities();
  };

  const totalAmount = Object.entries(quantities).reduce(
    (acc, [itemName, quantity]) => acc + getOrderItemPrice(itemName, quantity), 0).toFixed(2);

  const balanceDue = Math.max(amountPaid - totalAmount , 0).toFixed(2);
  

  return (
    <View className="flex-1 h-fit ml-3 bg-gray-100 p-4 mb-10">
      <Text className="text-3xl text-center mb-4 font-bold">Order Food</Text>

      {/* Select Order Type */}
      <Picker
        data={[
          { label: "Eat Here", value: "Eat Here" },
          { label: "Take-Away", value: "Take-Away" },
        ]}
        cols={1}
        value={[orderType]}
        onChange={(val) => setOrderType(val[0])}
      >
        <Button>{orderType}</Button>
      </Picker>

      {/* Order Summary */}
      <View style={{ flex: 1, maxHeight: 250, marginTop: 20 }}>
        <ScrollView
          style={{ backgroundColor: "white", borderRadius: 20, padding: 10 }}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {Object.entries(quantities).map(([itemName, quantity]) => {
            if (quantity > 0) {
              return (
                <Card key={itemName} style={{ marginBottom: 10, borderRadius: 20 }}>
                  <Card.Header title={<Text className="w-auto text-center text-xl">{itemName}</Text>} />
                  <Card.Body>
                    <View className="flex-row items-center justify-between ml-5 mr-5">
                      <Text className="text-xl font-bold">Price: {getOrderItemPrice(itemName, quantity)}$</Text>
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

            <View className="mt-5 flex-row items-center justify-between">
            <Text className="text-xl font-bold">Payment Method:</Text>
            <Picker
            data={[
              { label: "Cash", value: "Cash" },
              { label: "Bank Transfer", value: "Bank Transfer" },
            ]}
            cols={1}
            value={[paymentMethod]}
            onChange={handlePaymentChange}
            >
            <Button>{paymentMethod}</Button>
            </Picker>
            </View>

            <View className="mt-5 flex-row items-center justify-between">
            <Text className="text-xl font-bold">Total:</Text>
            <Text className="text-xl font-bold">{totalAmount} $</Text>
            </View>

            <View className="mt-5 flex-row items-center justify-between">
            <Text className="text-xl font-bold">Amount Paid:</Text>
            <Input
              style={{
                flex: 1,
                marginLeft: 10,
                marginRight: 10,
                fontSize: 16,
                justifyContent: "flex-end",
                borderColor: "black",
                borderWidth: 1, 
                borderRadius: 5, 
                paddingHorizontal: 10,
              }}
              placeholder="Enter Number"
              keyboardType="number-pad"
              value={amountPaid.toString()} 
              onChangeText={handleAmountPaidChange}
              editable={paymentMethod !== "Bank Transfer"}
            />
            <Text className="text-xl font-bold">$</Text>
            </View>

            <View className="mt-5 flex-row items-center justify-between">
            <Text className="text-xl font-bold">Balance Due:</Text>
            <Text className="text-xl font-bold">{balanceDue} $</Text>
            </View>

            {/* Place Order Button */}
      <View className="flex-row items-center justify-center mt-5">

        <Button type="primary" onPress={handlePlaceOrder} disabled={amountPaid < totalAmount}>
          Place Order
        </Button>
      </View>

      {/* Show Orders Button */}
      <View className="flex-row items-center justify-between mt-5">
        <Button type="default" onPress={() => setModalVisible(true)}>Show Orders</Button>
        <Button type="warning" onPress={() => setRevenueModalVisible(true)}>Revenue</Button>
      </View>

      {/* Orders List Modal */}
      <Modal transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <View style={{ width: 600, maxHeight: 500, backgroundColor: "white", borderRadius: 20, padding: 20 }}>
            <Text className="text-2xl text-center mb-4 font-bold">Orders</Text>
            <ScrollView>
              <Collapse accordion>
                {getOrders().map((order, index) => (
                  <Collapse.Panel title={`Order ID: ${order.orderId}`} key={index}>
                    <Text className="text-lg">Order Type: {order.orderType}</Text>
                    
                    <Text className="text-lg">Timestamp: {order.timestamp}</Text>
                    <Text className="text-lg">Items:</Text>
                    {order.items.map((item, idx) => (
                      <Text key={idx} className="text-lg">- {item.name} x {item.quantity}</Text>
                    ))}
                    <Text className="text-lg font-bold text-center mb-4">Total: {order.total} $</Text>
                    <Button type="primary"  
                            style={{ width: 200, alignSelf: "center" }}
                            onPress={() => printOrder(currentOrder, getOrderItemPrice)} className="mt-4">
                      <Text>Print Receipt</Text>
                    </Button>
                  </Collapse.Panel>
                ))}
              </Collapse>
            </ScrollView>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text className="text-center text-lg text-blue-500 mt-4">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

       {/* Bill Modal */}
       <BillModal
          visible={billModalVisible}
          onClose={handleClose}
          currentOrder={currentOrder}
          paymentMethod={paymentMethod}
          getOrderItemPrice={getOrderItemPrice}
        />

        {/* Revenue Modal */}
        <RevenueModal
          visible={revenueModalVisible}
          onClose={() => setRevenueModalVisible(false)}
        /> 
    </View>
  );
}
