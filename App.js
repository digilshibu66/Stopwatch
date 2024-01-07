import React, { useState, useRef } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const StopwatchApp = () => {
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const lapsRef = useRef([]);

  const startStop = () => {
    setIsRunning(!isRunning);
    if (!isRunning) {
      // Start the stopwatch
      const startTime = Date.now() - timer;
      const intervalId = setInterval(() => {
        setTimer(Date.now() - startTime);
      }, 10);
      lapsRef.current.push({ id: lapsRef.current.length + 1, time: timer, running: true, intervalId });
    } else {
      // Stop the stopwatch
      lapsRef.current[lapsRef.current.length - 1].running = false;
      clearInterval(lapsRef.current[lapsRef.current.length - 1].intervalId);
    }
  };

  const reset = () => {
    setTimer(0);
    setIsRunning(false);
    lapsRef.current.forEach((lap) => clearInterval(lap.intervalId));
    lapsRef.current = [];
  };

  const lap = () => {
    if (isRunning) {
      const lapTime = timer - lapsRef.current.reduce((acc, lap) => acc + lap.time, 0);
      lapsRef.current.push({ id: lapsRef.current.length + 1, time: lapTime, running: true });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>{formatTime(timer)}</Text>
      <View style={styles.buttonRow}>
        <Button title={isRunning ? 'Stop' : 'Start'} onPress={startStop} />
        <Button title="Reset" onPress={reset} />
        <Button title="Lap" onPress={lap} />
      </View>
      <View style={styles.lapList}>
        {lapsRef.current.map((lap) => (
          <Text key={lap.id} style={styles.lapItem}>
            Lap {lap.id}: {formatTime(lap.time)}
          </Text>
        ))}
      </View>
    </View>
  );
};

const formatTime = (time) => {
  const minutes = Math.floor(time / 60000);
  const seconds = Math.floor((time % 60000) / 1000);
  const milliseconds = Math.floor((time % 1000) / 10);
  return `${padWithZero(minutes)}:${padWithZero(seconds)}.${padWithZero(milliseconds)}`;
};

const padWithZero = (value) => (value < 10 ? `0${value}` : `${value}`);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  timer: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  lapList: {
    alignItems: 'flex-start',
  },
  lapItem: {
    fontSize: 18,
    marginBottom: 8,
  },
});

export default StopwatchApp;
