import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert, FlatList, StyleSheet } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import DateTimePicker from "@react-native-community/datetimepicker";

// Request notification permissions
async function registerForPushNotificationsAsync() {
  if (Device.isDevice) {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      alert("Permission for notifications was denied!");
      return;
    }
  }
}

export default function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [goals, setGoals] = useState([]);
  const [completedGoals, setCompletedGoals] = useState(0);
  const [lastMessage, setLastMessage] = useState(""); // Stores last entered task/goal

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  // Function to schedule notification
  const scheduleTaskNotification = async (taskName, taskTime) => {
    const triggerTime = new Date(taskTime).getTime();
    const now = new Date().getTime();
    const secondsUntilNotification = (triggerTime - now) / 1000;

    if (secondsUntilNotification < 0) {
      alert("Please select a future time!");
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Task Reminder!",
        body: `Time to: ${taskName}`,
        sound: true,
      },
      trigger: { seconds: secondsUntilNotification },
    });
  };

  // Function to add task
  const addTask = () => {
    if (!task) {
      alert("Please enter a task!");
      return;
    }
    const newTask = { id: Date.now().toString(), name: task, time: date };
    setTasks([...tasks, newTask]);
    scheduleTaskNotification(newTask.name, newTask.time);
    setLastMessage(`Task Added: ${task}`); // Update last message
    setTask("");
  };

  // Function to add goal
  const addGoal = () => {
    if (!task) {
      alert("Please enter a goal!");
      return;
    }
    setGoals([...goals, { id: Date.now().toString(), name: task, completed: false }]);
    setLastMessage(`Goal Added: ${task}`); // Update last message
    setTask("");
  };

  // Function to mark goal as completed
  const completeGoal = (goalId) => {
    const updatedGoals = goals.map(goal => goal.id === goalId ? { ...goal, completed: true } : goal);
    setGoals(updatedGoals);
    setCompletedGoals(completedGoals + 1);
    setLastMessage("Goal Completed! ✅"); // Show completion message
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Productivity Tracker</Text>

      {/* Task Input */}
      <TextInput
        placeholder="Enter Task/Goal"
        value={task}
        onChangeText={setTask}
        style={styles.input}
        placeholderTextColor="gray"
      />

      {/* Display Last Entered Message */}
      {lastMessage ? <Text style={styles.message}>{lastMessage}</Text> : null}

      {/* Date Picker */}
      <Button title="Pick Time" onPress={() => setShowPicker(true)} />
      {showPicker && (
        <DateTimePicker
          value={date}
          mode="datetime"
          display="default"
          onChange={(event, selectedDate) => {
            setShowPicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      {/* Buttons */}
      <Button title="Add Task" onPress={addTask} />
      <Button title="Add Goal" onPress={addGoal} />

      {/* Task List */}
      <Text style={styles.subtitle}>Tasks</Text>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Text style={styles.listItem}>{item.name} - {item.time.toLocaleString()}</Text>}
      />

      {/* Goals List */}
      <Text style={styles.subtitle}>Goals</Text>
      <FlatList
        data={goals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.goalItem}>
            <Text>{item.name}</Text>
            {!item.completed && <Button title="Mark Done" onPress={() => completeGoal(item.id)} />}
          </View>
        )}
      />

      {/* Progress */}
      <Text style={styles.progress}>Completed Goals: {completedGoals} / {goals.length}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#000",
    padding: 10,
    marginVertical: 10,
    backgroundColor: "#fff",
    color: "black",
  },
  message: {
    fontSize: 16,
    fontWeight: "bold",
    color: "green",
    textAlign: "center",
    marginVertical: 10,
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
  },
  goalItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
  },
  progress: {
    marginTop: 20,
    fontSize: 16,
    textAlign: "center",
  },
});

