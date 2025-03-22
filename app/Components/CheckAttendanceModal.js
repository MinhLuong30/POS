import { useEffect, useState } from "react";
import { View, Text, Modal, TouchableOpacity, ScrollView } from "react-native";
import axios from "axios";
import { Button } from "@ant-design/react-native";

export default function CheckAttendanceModal({ visible, onClose }) {
  const [checkIns, setCheckIns] = useState([]);
  const [checkOuts, setCheckOuts] = useState([]);
  const [filter, setFilter] = useState("day");

  const API_URL = "https://67de1bf4471aaaa742834afe.mockapi.io/POS/Attendance";

  const fetchAttendance = async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error("Error fetching attendance records:", error);
      return [];
    }
  };

  useEffect(() => {
    async function getAttendanceData() {
      const attendanceData = await fetchAttendance();
      const today = new Date();
      let filteredCheckIns = [];
      let filteredCheckOuts = [];

      if (filter === "day") {
        const todayString = today.toISOString().split("T")[0]; // YYYY-MM-DD format
        filteredCheckIns = attendanceData.filter(record => record.type === "CheckIn" && record.time.startsWith(todayString));
        filteredCheckOuts = attendanceData.filter(record => record.type === "CheckOut" && record.time.startsWith(todayString));
      } else if (filter === "week") {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(today.getDate() - 7);
        filteredCheckIns = attendanceData.filter(record => record.type === "CheckIn" && new Date(record.time) >= oneWeekAgo);
        filteredCheckOuts = attendanceData.filter(record => record.type === "CheckOut" && new Date(record.time) >= oneWeekAgo);
      } else if (filter === "month") {
        const thisMonth = today.getMonth();
        const thisYear = today.getFullYear();
        filteredCheckIns = attendanceData.filter(record => {
          const recordDate = new Date(record.time);
          return record.type === "CheckIn" && recordDate.getMonth() === thisMonth && recordDate.getFullYear() === thisYear;
        });
        filteredCheckOuts = attendanceData.filter(record => {
          const recordDate = new Date(record.time);
          return record.type === "CheckOut" && recordDate.getMonth() === thisMonth && recordDate.getFullYear() === thisYear;
        });
      }

      setCheckIns(filteredCheckIns);
      setCheckOuts(filteredCheckOuts);
    }

    if (visible) {
      getAttendanceData();
    }
  }, [visible, filter]);

return (
    <Modal transparent visible={visible} onRequestClose={onClose}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
            <View style={{ width: 600, maxHeight: 500, backgroundColor: "white", borderRadius: 20, padding: 20 }}>
                <Text className="text-2xl text-center mb-4 font-bold">Attendance Report</Text>
                <View style={{ flexDirection: "row", justifyContent: "center", marginBottom: 10 }}>
                    <Button type={filter === "day" ? "primary" : "default"} onPress={() => setFilter("day")}>Day</Button>
                    <Button type={filter === "week" ? "primary" : "default"} onPress={() => setFilter("week")} style={{ marginHorizontal: 10 }}>Week</Button>
                    <Button type={filter === "month" ? "primary" : "default"} onPress={() => setFilter("month")}>Month</Button>
                </View>
                <View className="flex-row justify-center items-center p-4">
                    <View className="bg-green-400 p-3 rounded-3xl mx-2">
                        <Text className="text-2xl text-center mb-1 font-bold">Check-Ins</Text>
                        <Text className="text-xl text-center font-bold">{checkIns.length}</Text>
                    </View>
                    <View className="bg-red-400 p-3 rounded-3xl mx-2">
                        <Text className="text-2xl text-center mb-1 font-bold">Check-Outs</Text>
                        <Text className="text-xl text-center font-bold">{checkOuts.length}</Text>
                    </View>
                </View>
                <ScrollView>
                    <Text className="text-xl font-bold text-center mb-2">Check-Ins</Text>
                    {checkIns.map((record, index) => {
                         if (!record.time) return null;
                        const checkInTime = record.time ? new Date(record.time) : null;
                        const workingTime = new Date(checkInTime);
                        workingTime.setHours(8, 0, 0, 0); // Set to 8:00 AM
                        const isLate = checkInTime > workingTime;

                        return (
                            <View key={index} style={{ marginBottom: 10, padding: 10, borderBottomWidth: 1 }}>
                                <View className="flex-row items-center justify-between">
                                    <Text className="text-lg font-bold">User: {record.name}</Text>
                                    <Text className={`text-lg p-1 rounded-md ${isLate ? "bg-yellow-400" : "bg-green-400"}`}>
                                        {isLate ? "Check In Late" : "Check In"}
                                    </Text>
                                </View>
                                <Text className="text-lg">Email: {record.email}</Text>
                                <Text className="text-lg">Location: {record.location}</Text>
                                <Text className="text-lg">Check-in Time: {checkInTime.toLocaleString()}</Text>
                                {isLate && (
                                    <Text className="text-lg text-red-500">
                                        Late by: {Math.floor((checkInTime - workingTime) / (1000 * 60))} minutes
                                    </Text>
                                )}
                            </View>
                        );
                    })}
                    <Text className="text-xl font-bold text-center mb-2">Check-Outs</Text>
                    {checkOuts.map((record, index) => {
                        const checkOutTime = new Date(record.time);
                        const endOfDay = new Date(checkOutTime);
                        endOfDay.setHours(17, 0, 0, 0); // Set to 5:00 PM
                        const isEarly = checkOutTime < endOfDay;

                        return (
                            <View key={index} style={{ marginBottom: 10, padding: 10, borderBottomWidth: 1 }}>
                                <View className="flex-row items-center justify-between">
                                    <Text className="text-lg font-bold">User: {record.name}</Text>
                                    <Text className={`text-lg p-1 rounded-md ${isEarly ? "bg-orange-500" : "bg-red-400"}`}>
                                        {isEarly ? "Check Out Early" : "Check Out"}
                                    </Text>
                                </View>
                                <Text className="text-lg">Email: {record.email}</Text>
                                <Text className="text-lg">Location: {record.location}</Text>
                                <Text className="text-lg">Check-out Time: {checkOutTime.toLocaleString()}</Text>
                                {isEarly && (
                                    <Text className="text-lg text-red-500">
                                        Left early by: {Math.ceil((endOfDay - checkOutTime) / (1000 * 60))} minutes
                                    </Text>
                                )}
                            </View>
                        );
                    })}
                </ScrollView>
                <TouchableOpacity onPress={onClose}>
                    <Text className="text-center text-lg text-blue-500 mt-4">Close</Text>
                </TouchableOpacity>
            </View>
        </View>
    </Modal>
);
}
