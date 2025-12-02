// screens/AnalyticsScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
  Dimensions,
} from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { fetchAttendanceStats, downloadPdfUrl } from '../api'; // ✅ Use your centralized API file

const screenWidth = Dimensions.get('window').width;

export default function AnalyticsScreen() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [pdfLink, setPdfLink] = useState('');

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchAttendanceStats();
        setStats(data?.data || []);
      } catch (err) {
        console.error('Error fetching stats:', err);
        Alert.alert('Error', 'Failed to load attendance stats.');
      } finally {
        setLoading(false);
      }
    };

    loadStats();

    // Set today's PDF link
    const today = new Date().toISOString().split('T')[0];
    setPdfLink(downloadPdfUrl(today));
  }, []);

  const handleDownloadPdf = () => {
    if (!pdfLink) return Alert.alert('Error', 'No PDF link found');
    Linking.openURL(pdfLink);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={{ marginTop: 10 }}>Loading analytics...</Text>
      </View>
    );
  }

  const labels = stats.map((s) => s.date || '');
  const data = stats.map((s) => s.present_count || 0);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>📊 Attendance Analytics (Last 7 Days)</Text>

      {stats.length > 0 ? (
        <BarChart
          data={{
            labels,
            datasets: [{ data }],
          }}
          width={screenWidth - 20}
          height={260}
          yAxisLabel=""
          chartConfig={{
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            barPercentage: 0.6,
            decimalPlaces: 0,
          }}
          verticalLabelRotation={30}
          style={styles.chart}
        />
      ) : (
        <Text style={styles.noData}>No attendance data available</Text>
      )}

      <TouchableOpacity style={styles.button} onPress={handleDownloadPdf}>
        <Text style={styles.buttonText}>📄 Download Attendance PDF</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f5f5f5',
  },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#000' },
  chart: { borderRadius: 10, marginBottom: 25 },
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    width: '90%',
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  noData: { color: '#777', marginTop: 15, fontSize: 16 },
});
