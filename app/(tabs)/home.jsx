import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import { db } from './../../configs/FirebaseConfig';
import { ref, set, onValue } from './../../configs/FirebaseConfig';
import { Colors } from './../../constant/Colors';

export default function Dashboard() {
  const [feedingTime, setFeedingTime] = useState("");
  const [feedingSchedule, setFeedingSchedule] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load existing schedule from Realtime Database
  useEffect(() => {
    const scheduleRef = ref(db, 'feedingSchedule');

    // Listen for real-time updates
    const unsubscribe = onValue(scheduleRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.times) {
        setFeedingSchedule(data.times);
      } else {
        setFeedingSchedule([]);
      }
      setIsLoading(false);
    });

    return () => unsubscribe(); // Cleanup listener
  }, []);

  const validateTimeFormat = (time) => {
    const regex = /^([01]\d|2[0-3]):([0-5]\d)$/; // Matches HH:mm (24-hour)
    return regex.test(time);
  };

  const setSchedule = async () => {
    if (!feedingTime) return alert("Enter feeding time");
    if (!validateTimeFormat(feedingTime)) return alert("Invalid time format. Use HH:mm");

    try {
      const newSchedule = [...feedingSchedule, feedingTime];

      // Save to Realtime Database
      const scheduleRef = ref(db, 'feedingSchedule');
      await set(scheduleRef, {
        times: newSchedule,
        updatedAt: Math.floor(Date.now() / 1000)
      });

      setFeedingTime("");
      alert("Feeding Schedule Updated!");
    } catch (error) {
      console.error("Error setting schedule: ", error);
      alert("Error setting schedule. Check console.");
    }
  };

  const removeSchedule = async (index) => {
    const updatedSchedule = feedingSchedule.filter((_, i) => i !== index);

    try {
      const scheduleRef = ref(db, 'feedingSchedule');
      await set(scheduleRef, {
        times: updatedSchedule,
        updatedAt: Math.floor(Date.now() / 1000)
      });

      setFeedingSchedule(updatedSchedule);
    } catch (error) {
      console.error("Error updating schedule: ", error);
      alert("Error updating schedule. Check console.");
    }
  };

  const handleFeedNow = async () => {
    try {
      const commandRef = ref(db, 'feedingCommands/current');
      await set(commandRef, {
        action: "feed",
        timestamp: Math.floor(Date.now() / 1000),
        status: "pending"
      });
      alert("Feed command sent!");
    } catch (error) {
      console.error("Error sending feed command: ", error);
      alert("Error sending feed command. Check console.");
    }
  };

  return (
    <View style={{ height: '100%', backgroundColor: Colors.WHITE, padding: 20 }}>
      <Text style={{ fontFamily: 'outfit-bold', fontSize: 30, marginBottom: 20 }}>Dashboard</Text>

      <TouchableOpacity 
        onPress={handleFeedNow} 
        style={{ backgroundColor: 
          Colors.PURPLE, padding: 15, 
          marginBottom: 20, 
          borderRadius: 8 }}
      >
        <Text style={{ 
          color: Colors.WHITE, 
          textAlign: 'center',
           fontFamily: 'outfit-bold', 
           fontSize: 16 }}>
          Feed Now
        </Text>
      </TouchableOpacity>

      <Text>Enter Feeding Time (HH:mm format)</Text>
      
      <TextInput
        placeholder="e.g 08:00"
        value={feedingTime}
        onChangeText={setFeedingTime}
        style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
      />

      <TouchableOpacity onPress={setSchedule} style={{ backgroundColor: Colors.PURPLE, padding: 10, marginBottom: 20 }}>
        <Text style={{ color: Colors.WHITE, textAlign: 'center' }}>Set Schedule</Text>
      </TouchableOpacity>

      {isLoading ? (
        <Text>Loading schedule...</Text>
      ) : (
        <FlatList
          data={feedingSchedule}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 10,
              borderWidth: 1,
              marginBottom: 5
            }}>
              <Text>{item}</Text>
              <TouchableOpacity onPress={() => removeSchedule(index)}>
                <Text style={{ color: 'red' }}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={() => (
            <Text style={{ textAlign: 'center', marginTop: 20, color: '#666' }}>
              No feeding times scheduled
            </Text>
          )}
        />
      )}
    </View>
  );
}
