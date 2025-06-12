import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, StyleSheet, Alert, RefreshControl } from 'react-native';
import { Text, Button, Card, Title, Paragraph, useTheme, Dialog, Portal, IconButton, TextInput, Divider, RadioButton } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import CustomTextInput from '../components/CustomTextInput'; 

const API_BASE_URL = 'http://10.0.0.70/roommate_api'; 

function TaskSchedulingScreen({ navigation }) { 
    console.log('TaskSchedulingScreen: navigation prop is', navigation);

    const { colors } = useTheme();
    const route = useRoute();
    const { currentGroup, currentUser } = route.params || {};

    const [chores, setChores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const [addDialogVisible, setAddDialogVisible] = useState(false);
    const [newChoreName, setNewChoreName] = useState('');
    const [newChoreHours, setNewChoreHours] = useState('');
    const [newChoreFrequency, setNewChoreFrequency] = useState('weekly'); 

    const fetchChores = useCallback(async () => {
        if (!currentGroup?.group_id) {
            console.log('No group ID, skipping fetchChores.');
            Alert.alert('Error', 'Group information missing. Please go back and re-select your group.');
            navigation.replace('Group'); 
            return;
        }
        setLoading(true);
        setRefreshing(true);
        try {
            const response = await fetch(`${API_BASE_URL}/fetch_chores.php?group_id=${currentGroup.group_id}`);
            const data = await response.json();
            console.log('Fetched chores data:', data); 

            if (data.success) {
                setChores(data.chores); 
            } else {
                Alert.alert('Error', data.message || 'Failed to fetch chores.');
                setChores([]);
            }
        } catch (error) {
            console.error('Error fetching chores:', error); 
            Alert.alert('Error', 'Failed to connect to the server or process data.');
            setChores([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [currentGroup, navigation]); 

    useEffect(() => {
        fetchChores();
    }, [fetchChores]);

    const showAddDialog = () => {
        setNewChoreName('');
        setNewChoreHours('');
        setNewChoreFrequency('weekly');
        setAddDialogVisible(true);
    };
    const hideAddDialog = () => setAddDialogVisible(false);

    const handleAddChore = async () => {
        if (!newChoreName || !newChoreHours) {
            Alert.alert('Error', 'Please fill in all chore details.');
            return;
        }
        const hours = parseFloat(newChoreHours);
        if (isNaN(hours) || hours <= 0) {
            Alert.alert('Error', 'Please enter a valid positive number for estimated hours.');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/add_chore.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    group_id: currentGroup.group_id,
                    chore_name: newChoreName,
                    estimated_hours: hours,
                    frequency: newChoreFrequency,
                }),
            });
            const data = await response.json();
            console.log('Add chore response:', data); 

            if (data.success) {
                Alert.alert('Success', data.message);
                hideAddDialog();
                fetchChores(); 
            } else {
                Alert.alert('Error', data.message || 'Failed to add chore.');
            }
        } catch (error) {
            console.error('Error adding chore:', error); 
            Alert.alert('Error', 'Failed to connect to the server or process data.');
        } finally {
            setLoading(false);
        }
    };

    const handleMarkComplete = async (assignmentId, choreName) => {
        Alert.alert(
            "Confirm Completion",
            `Have you completed "${choreName}"?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Yes",
                    onPress: async () => {
                        setLoading(true);
                        try {
                            const response = await fetch(`${API_BASE_URL}/mark_chore_complete.php`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    assignment_id: assignmentId,
                                    user_id: currentUser.user_id, 
                                }),
                            });
                            const data = await response.json();
                            console.log('Mark complete response:', data); 

                            if (data.success) {
                                Alert.alert('Success', data.message);
                                fetchChores(); 
                            } else {
                                Alert.alert('Error', data.message || 'Failed to mark chore complete.');
                            }
                        } catch (error) {
                            console.error('Error marking chore complete:', error); 
                            Alert.alert('Error', 'Failed to connect to the server or process data.');
                        } finally {
                            setLoading(false);
                        }
                    }
                }
            ]
        );
    };

    const handleAssignChores = async () => {
        if (!currentGroup?.group_id || !currentUser?.user_id) {
            Alert.alert('Error', 'Group or user information is missing for assignment.');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/assign_chores.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    group_id: currentGroup.group_id,
                    user_id: currentUser.user_id, 
                }),
            });
            const data = await response.json();
            console.log('Assign chores response:', data);

            if (data.success) {
                Alert.alert('Success', data.message);
                fetchChores(); 
            } else {
                Alert.alert('Error', data.message || 'Failed to assign chores.');
            }
        } catch (error) {
            console.error('Error assigning chores:', error);
            Alert.alert('Error', 'Failed to connect to the server or process assignment.');
        } finally {
            setLoading(false);
        }
    };

    if (!currentGroup || !currentUser) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <Text style={{ color: colors.error, fontSize: 18, textAlign: 'center', marginBottom: 20 }}>
                    Error: Group or User information missing. This screen cannot be accessed directly.
                    Please go back and select/create a group first.
                </Text>
                <Button mode="contained" onPress={() => navigation.replace('Group')} style={{ marginTop: 20 }}>
                    Go to Group Selection
                </Button>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView
                style={styles.scrollView}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={fetchChores} />
                }
            >
                <Title style={[styles.headerTitle, { color: colors.primary }]}>
                    Chores for {currentGroup.group_name}
                </Title>
                <Paragraph style={[styles.groupInfo, { color: colors.text }]}>
                    Logged in as: {currentUser.username}
                </Paragraph>

                {}
                <Button
                    icon="plus"
                    mode="contained"
                    onPress={showAddDialog}
                    style={[styles.addButton, { backgroundColor: colors.primary }]}
                    labelStyle={{ color: '#fff' }}
                    loading={loading}
                    disabled={loading}
                >
                    Add New Chore
                </Button>

                {}
                <Button
                    icon="playlist-check" 
                    mode="contained"
                    onPress={handleAssignChores}
                    style={[styles.assignButton, { backgroundColor: colors.accent }]}
                    labelStyle={{ color: '#fff' }}
                    loading={loading}
                    disabled={loading}
                >
                    Assign Chores (Equal Load)
                </Button>
                {}

                {}
                <Title style={[styles.sectionTitle, { color: colors.primary }]}>Your Chores</Title>
                {chores.length === 0 ? (
                    <Card style={[styles.choreCard, { backgroundColor: colors.surface }]}>
                        <Card.Content>
                            <Paragraph style={{ color: colors.text }}>No chores added yet.</Paragraph>
                        </Card.Content>
                    </Card>
                ) : (
                    chores.map((chore) => {
                        const currentChoreAssignment = chore.assignments && chore.assignments.length > 0
                            ? chore.assignments.find(assignment => assignment.status === 'pending') || chore.assignments[0]
                            : null;

                        return (
                            <Card key={chore.chore_id} style={[styles.choreCard, { backgroundColor: colors.surface }]}>
                                <Card.Content>
                                    <View style={styles.choreHeader}>
                                        <Text style={[styles.choreName, { color: colors.text }]}>{chore.chore_name}</Text>
                                        {}
                                        {currentChoreAssignment && 
                                         currentChoreAssignment.status === 'pending' &&
                                         currentChoreAssignment.user_id === currentUser.user_id && (
                                            <Button
                                                mode="contained"
                                                compact
                                                onPress={() => handleMarkComplete(currentChoreAssignment.assignment_id, chore.chore_name)}
                                                style={{ backgroundColor: colors.accent, marginLeft: 10 }}
                                                labelStyle={{ color: '#fff' }}
                                            >
                                                Mark Done
                                            </Button>
                                        )}
                                    </View>
                                    <Text style={[styles.choreDetails, { color: colors.textSecondary }]}>
                                        Estimated: {chore.estimated_hours} hours
                                    </Text>
                                    <Text style={[styles.choreDetails, { color: colors.textSecondary }]}>
                                        Frequency: {chore.frequency}
                                    </Text>
                                    <Text style={[styles.choreDetails, { color: colors.textSecondary }]}>
                                        Assigned To: {currentChoreAssignment ? currentChoreAssignment.username : "Not Assigned"}
                                    </Text>
                                    {currentChoreAssignment && (
                                        <>
                                            <Text style={[styles.choreDetails, { color: colors.textSecondary }]}>
                                                Assigned Date: {currentChoreAssignment.assigned_date}
                                            </Text>
                                            <Text style={[styles.choreDetails, { color: colors.textSecondary }]}>
                                                Due Date: {currentChoreAssignment.due_date}
                                            </Text>
                                            {currentChoreAssignment.status === 'completed' && (
                                                <Text style={[styles.choreDetails, { color: colors.textSecondary }]}>
                                                    Completed: {currentChoreAssignment.completed_date}
                                                </Text>
                                            )}
                                            <Text style={[styles.choreStatus, { color: currentChoreAssignment.status === 'completed' ? colors.primary : (currentChoreAssignment.status === 'overdue' ? colors.error : colors.textSecondary) }]}>
                                                Status: {currentChoreAssignment.status.charAt(0).toUpperCase() + currentChoreAssignment.status.slice(1)}
                                            </Text>
                                        </>
                                    )}
                                    {!currentChoreAssignment && ( 
                                        <Text style={[styles.choreDetails, { color: colors.textSecondary, fontStyle: 'italic' }]}>
                                            This chore is currently unassigned or has no pending assignments.
                                        </Text>
                                    )}
                                </Card.Content>
                            </Card>
                        );
                    })
                )}
            </ScrollView>

            {}
            <Portal>
                <Dialog visible={addDialogVisible} onDismiss={hideAddDialog}>
                    <Dialog.Title>Add New Chore</Dialog.Title>
                    <Dialog.Content>
                        <CustomTextInput
                            label="Chore Name"
                            value={newChoreName}
                            onChangeText={setNewChoreName}
                            style={styles.input}
                        />
                        <CustomTextInput
                            label="Estimated Hours (e.g., 0.5, 1.0, 2.5)"
                            value={newChoreHours}
                            onChangeText={setNewChoreHours}
                            keyboardType="numeric"
                            style={styles.input}
                        />
                        <Text style={[styles.dialogSectionTitle, { color: colors.text }]}>Frequency:</Text>
                        <View style={styles.frequencyOptions}>
                            {['daily', 'weekly', 'bi-weekly', 'monthly'].map(freq => (
                                <View key={freq} style={styles.radioOption}>
                                    <Text>{freq.charAt(0).toUpperCase() + freq.slice(1)}</Text>
                                    <RadioButton
                                        value={freq}
                                        status={newChoreFrequency === freq ? 'checked' : 'unchecked'}
                                        onPress={() => setNewChoreFrequency(freq)}
                                        color={colors.primary}
                                    />
                                </View>
                            ))}
                        </View>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={hideAddDialog}>Cancel</Button>
                        <Button onPress={handleAddChore} loading={loading} disabled={loading}>Add Chore</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
    },
    scrollView: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 5,
    },
    groupInfo: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    addButton: {
        marginVertical: 10, 
        paddingVertical: 8,
        borderRadius: 10,
    },
    assignButton: { 
        marginVertical: 10,
        paddingVertical: 8,
        borderRadius: 10,
        backgroundColor: '#4CAF50', 
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
        textAlign: 'center',
    },
    choreCard: {
        marginVertical: 8,
        borderRadius: 10,
        elevation: 3,
    },
    choreHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    choreName: {
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
    },
    choreDetails: {
        fontSize: 14,
        marginBottom: 2,
    },
    choreStatus: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 5,
    },
    input: {
        marginBottom: 10,
    },
    dialogSectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 5,
    },
    frequencyOptions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        marginTop: 5,
    },
    radioOption: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
        minWidth: '45%',
        justifyContent: 'space-between',
        paddingHorizontal: 5,
    },
});

export default TaskSchedulingScreen;