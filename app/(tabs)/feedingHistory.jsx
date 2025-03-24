import React, { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { Text,View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { format, parseISO } from 'date-fns';
import { db, ref, onValue } from './../../configs/FirebaseConfig';
import { Colors } from './../../constant/Colors';

export default function HistoryScreen() {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastFed, setLastFed] = useState(null);
  const [nextFeeding, setNextFeeding] = useState(null);

  useEffect(() => {
    // Listen to feeding history changes
    const historyRef = ref(db, 'feeding/history');
    const scheduleRef = ref(db, 'feedingSchedule');

    const unsubscribeHistory = onValue(historyRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convert object to array and sort by timestamp (newest first)
        const historyArray = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...value,
          timestamp: parseInt(value.timestamp) * 1000 // Convert to milliseconds
        }));
        
        historyArray.sort((a, b) => b.timestamp - a.timestamp);
        setHistory(historyArray);
        
        // Set last feeding time
        if (historyArray.length > 0) {
          setLastFed(historyArray[0]);
        }
      } else {
        setHistory([]);
        setLastFed(null);
      }
      setIsLoading(false);
    });

    // Listen to schedule changes
    const unsubscribeSchedule = onValue(scheduleRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.times && data.times.length > 0) {
        const now = new Date();
        const today = now.toISOString().split('T')[0];
        const currentTime = now.getHours().toString().padStart(2, '0') + ':' + 
                          now.getMinutes().toString().padStart(2, '0');
        
        // Find next feeding time
        const nextTime = data.times
          .sort()
          .find(time => time > currentTime);
        
        if (nextTime) {
          setNextFeeding({
            time: nextTime,
            date: today
          });
        } else if (data.times.length > 0) {
          // If no time today is left, set first time tomorrow
          setNextFeeding({
            time: data.times[0],
            date: new Date(now.setDate(now.getDate() + 1)).toISOString().split('T')[0]
          });
        }
      } else {
        setNextFeeding(null);
      }
    });

    return () => {
      unsubscribeHistory();
      unsubscribeSchedule();
    };
  }, []);

  const renderSummary = () => (
    <View style={styles.summaryCard}>
      <View style={styles.summarySection}>
        <Text style={styles.summaryLabel}>Last Fed</Text>
        <Text style={styles.summaryValue}>
          {lastFed 
            ? format(new Date(lastFed.timestamp), 'PPp')
            : 'No feeding history yet'}
        </Text>
      </View>

      <View style={styles.summarySection}>
        <Text style={styles.summaryLabel}>Next Scheduled Feeding</Text>
        <Text style={styles.summaryValue}>
          {nextFeeding
            ? `${format(parseISO(nextFeeding.date), 'PP')} at ${nextFeeding.time}`
            : 'No scheduled feedings'}
        </Text>
      </View>
    </View>
  );

  const renderHistoryItem = ({ item }) => (
    <View style={styles.historyCard}>
      <Text style={styles.historyTitle}>
        {item.type === 'scheduled' ? '🕒 Scheduled Feeding' : '👆 Manual Feeding'}
      </Text>
      
      <Text style={styles.historyTime}>
        {format(new Date(item.timestamp), 'PPpp')}
      </Text>

      <View style={styles.statusContainer}>
        <View style={[
          styles.statusDot,
          { backgroundColor: item.status === 'completed' ? '#4CAF50' : Colors.PURPLE }
        ]} />
        <Text style={[
          styles.statusText,
          { color: item.status === 'completed' ? '#4CAF50' : Colors.PURPLE }
        ]}>
          {item.status}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Feeding History</Text>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.PURPLE} />
        </View>
      ) : (
        <FlatList
          data={history}
          renderItem={renderHistoryItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          ListHeaderComponent={renderSummary}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No feeding history yet{'\n'}
                History will appear here when you feed your pet
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.LIGHT_GRAY,
  },
  headerText: {
    padding: 25,
    fontSize: 30,
    color: Colors.DARK,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryCard: {
    backgroundColor: Colors.WHITE,
    margin: 20,
    padding: 20,
    borderRadius: 15,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  summarySection: {
    marginBottom: 15,
  },
  summaryLabel: {
    fontSize: 16,
    color: Colors.GRAY,
    marginBottom: 5,
  },
  summaryValue: {
    fontSize: 18,
    color: Colors.PURPLE,
  },
  historyCard: {
    backgroundColor: Colors.WHITE,
    padding: 15,
    marginHorizontal: 20,
    marginVertical: 8,
    borderRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  historyTitle: {
    fontSize: 16,
    marginBottom: 5,
    color: Colors.PURPLE,
  },
  historyTime: {
    fontSize: 14,
    color: Colors.GRAY,
    marginBottom: 3,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    textTransform: 'capitalize',
  },
  listContainer: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.GRAY,
    textAlign: 'center',
  },
});
