import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

export default function HomeScreen() {
    const [task, setTask] = useState('');
    const [tasks, setTasks] = useState([]);

    const addTask = () => {
        if (task.trim() !== '') {
            setTasks([...tasks, { id: Date.now().toString(), text: task, completed: false }]);
            setTask('');
        }
    };

    const toggleTaskCompletion = (id) => {
        setTasks(tasks.map(task => 
            task.id === id ? { ...task, completed: !task.completed } : task
        ));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Productivity Tracker 📊</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter a task..."
                value={task}
                onChangeText={setTask}
            />
            <Button title="Add Task" onPress={addTask} />
            
            <FlatList
                data={tasks}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        style={[styles.task, item.completed && styles.completedTask]}
                        onPress={() => toggleTaskCompletion(item.id)}
                    >
                        <Text style={styles.taskText}>{item.text}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    task: {
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 5,
        marginTop: 10,
    },
    completedTask: {
        backgroundColor: '#d4edda',
    },
    taskText: {
        fontSize: 16,
    },
});
