import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, Alert, ScrollView } from 'react-native';
import {
  Text,
  Button,
  List,
  Modal,
  Portal,
  TextInput,
  Chip,
  Divider,
  useTheme,
} from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect, useRoute } from '@react-navigation/native';

const API_BASE_URL = 'http://10.0.0.70/roommate_api';

function ExpenseManagementScreen({ navigation }) { 
  const { colors } = useTheme();
  const route = useRoute();
  const { currentGroup, currentUser } = route.params || {};

  const [expenses, setExpenses] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidByUserId, setPaidByUserId] = useState(currentUser?.user_id || '');
  const [participantsUserIds, setParticipantsUserIds] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);

  if (!currentGroup || !currentUser) {
    Alert.alert('Error', 'Group or User information missing. Please select or create a group first.');
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.error, fontSize: 18, textAlign: 'center' }}>
          Group or User information not loaded. Please restart the app or go back to group selection.
        </Text>
        <Button mode="contained" onPress={() => navigation.navigate('Group')} style={{ marginTop: 20 }}>
          Go to Group Selection
        </Button>
      </View>
    );
  }

  const fetchGroupMembers = useCallback(async () => {
    console.log('Fetching group members for group_id:', currentGroup.group_id);
    try {
      const response = await fetch(`${API_BASE_URL}/get_group_members.php?group_id=${currentGroup.group_id}`); // <<< Use get_group_members.php
      const data = await response.json();
      console.log('Fetched group members data in ExpenseManagement:', data);
      if (data.success) {
        setGroupMembers(data.members);
        setPaidByUserId(currentUser.user_id);
        setParticipantsUserIds([currentUser.user_id]);
      } else {
        Alert.alert('Error', `Failed to load group members: ${data.message}`);
        setGroupMembers([]); 
      }
    } catch (error) {
      console.error('Error fetching group members:', error);
      Alert.alert('Network Error', 'Could not fetch group members. Check your IP and XAMPP.');
      setGroupMembers([]); 
    }
  }, [currentGroup.group_id, currentUser.user_id]);


  const fetchExpenses = useCallback(async () => {
    console.log('Fetching expenses for group_id:', currentGroup.group_id);
    try {
      const response = await fetch(`${API_BASE_URL}/get_expenses.php?group_id=${currentGroup.group_id}`);
      const data = await response.json();
      console.log('Fetched expenses data in ExpenseManagement:', data);
      if (data.success) {
        const parsedExpenses = data.expenses.map(exp => ({
          ...exp,
          amount: parseFloat(exp.amount) 
        }));
        setExpenses(parsedExpenses);
      } else {
        Alert.alert('Error', `Failed to load expenses: ${data.message}`);
        setExpenses([]); 
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
      Alert.alert('Network Error', 'Could not fetch expenses. Check your IP and XAMPP.');
      setExpenses([]); 
    }
  }, [currentGroup.group_id]);

  useFocusEffect(
    useCallback(() => {
      fetchGroupMembers();
      fetchExpenses();
      return () => {
      };
    }, [fetchGroupMembers, fetchExpenses])
  );

  const showModal = () => setModalVisible(true);
  const hideModal = () => {
    setModalVisible(false);
    setDescription('');
    setAmount('');
    setPaidByUserId(currentUser.user_id); 
    setParticipantsUserIds([currentUser.user_id]); 
  };

  const addExpense = async () => {
    if (!description.trim() || !amount || !paidByUserId || participantsUserIds.length === 0) {
      Alert.alert('Missing Info', 'Please fill all fields and select at least one participant.');
      return;
    }
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid positive number for the amount.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/add_expense.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          group_id: currentGroup.group_id,
          description: description.trim(),
          amount: parsedAmount,
          paid_by_user_id: paidByUserId,
          participants_user_ids: participantsUserIds,
        }),
      });
      const data = await response.json();

      if (data.success) {
        Alert.alert('Success', data.message);
        hideModal();
        fetchExpenses(); 
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      console.error('Error adding expense:', error);
      Alert.alert('Network Error', 'Could not add expense. Please check your IP and XAMPP.');
    }
  };

  const calculateSettlements = useCallback(() => { 
    const balances = {};
    groupMembers.forEach(member => {
        balances[member.username] = 0; 
    });

    console.log('Initial Balances:', JSON.stringify(balances));

    expenses.forEach(expense => {
      const expenseParticipantsUsernames = expense.participants.map(p => p.username);
      const perPersonShare = expense.amount / expenseParticipantsUsernames.length; // expense.amount is now guaranteed number

      console.log(`Processing expense: ${expense.description}, Amount: ${expense.amount}, Paid by: ${expense.paid_by_username}, Participants: ${expenseParticipantsUsernames.join(', ')}`);

      if (balances[expense.paid_by_username] !== undefined) {
          balances[expense.paid_by_username] += expense.amount;
      } else {
          console.warn(`Payer ${expense.paid_by_username} not found in current group members.`);
          balances[expense.paid_by_username] = (balances[expense.paid_by_username] || 0) + expense.amount;
      }


      expenseParticipantsUsernames.forEach(pUsername => {
        if (balances[pUsername] !== undefined) {
            balances[pUsername] -= perPersonShare;
        } else {
            console.warn(`Participant ${pUsername} not found in current group members for expense ${expense.description}`);
            balances[pUsername] = (balances[pUsername] || 0) - perPersonShare;
        }
      });
      console.log('Balances after expense:', JSON.stringify(balances));
    });

    console.log('Final Balances after all expenses:', JSON.stringify(balances));

    const settlements = [];
    let positiveBalances = Object.entries(balances).filter(([, amount]) => amount > 0);
    let negativeBalances = Object.entries(balances).filter(([, amount]) => amount < 0);

    console.log('Positive Balances before sorting:', JSON.stringify(positiveBalances));
    console.log('Negative Balances before sorting:', JSON.stringify(negativeBalances));

    positiveBalances.sort((a, b) => b[1] - a[1]); 
    negativeBalances.sort((a, b) => a[1] - b[1]); 

    while (positiveBalances.length > 0 && negativeBalances.length > 0) {
      let [debtor, owes] = negativeBalances[0]; 
      let [creditor, gets] = positiveBalances[0]; 

      owes = Math.abs(owes); 

      const amountToSettle = Math.min(owes, gets);

      if (amountToSettle > 0.01) { 
        settlements.push({
          from: debtor,
          to: creditor,
          amount: amountToSettle.toFixed(2),
        });
      }

      negativeBalances[0][1] += amountToSettle; 
      positiveBalances[0][1] -= amountToSettle; 

      negativeBalances = negativeBalances.filter(([, amount]) => Math.abs(amount) > 0.01);
      positiveBalances = positiveBalances.filter(([, amount]) => amount > 0.01);

      console.log(`Settling: ${debtor} owes ${creditor} $${amountToSettle.toFixed(2)}`);
      console.log('Remaining positive balances:', JSON.stringify(positiveBalances));
      console.log('Remaining negative balances:', JSON.stringify(negativeBalances));
    }
    console.log('Final Settlements:', JSON.stringify(settlements));
    return settlements;
  }, [groupMembers, expenses]); 

  const settlements = calculateSettlements();

  const toggleParticipant = (userId) => {
    if (participantsUserIds.includes(userId)) {
      setParticipantsUserIds(participantsUserIds.filter((id) => id !== userId));
    } else {
      setParticipantsUserIds([...participantsUserIds, userId]);
    }
  };

  const renderExpenseItem = ({ item }) => (
    <List.Item
      title={item.description}
      description={`Amount: $${parseFloat(item.amount).toFixed(2)} | Paid by: ${item.paid_by_username}`}
      left={(props) => <List.Icon {...props} icon="cash" color={colors.primary} />}
      right={() => (
        <View style={styles.participantsContainer}>
          {item.participants.map(p => (
            <Chip key={p.user_id || p.username} style={styles.participantChip} mode="outlined">{p.username}</Chip> // Ensure key is stable
          ))}
        </View>
      )}
      style={[styles.listItem, { backgroundColor: colors.surface }]}
      titleStyle={{ color: colors.text }}
      descriptionStyle={{ color: colors.onSurfaceVariant }}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.primary }]}>
        Expenses for {currentGroup.group_name} ({currentGroup.group_code})
      </Text>
      <Text style={[styles.subHeaderSmall, { color: colors.text }]}>
        Logged in as: {currentUser.username}
      </Text>

      <Button
        icon="plus-circle-outline"
        mode="contained"
        onPress={showModal}
        style={[styles.addButton, { backgroundColor: colors.primary }]}
        labelStyle={styles.addButtonLabel}
      >
        Add New Expense
      </Button>

      <Text style={[styles.subHeader, { color: colors.text }]}>Recent Expenses</Text>
      {expenses.length > 0 ? (
        <FlatList
          data={expenses}
          renderItem={renderExpenseItem}
          keyExtractor={(item) => item.expense_id.toString()}
          contentContainerStyle={styles.listContentContainer}
        />
      ) : (
        <Text style={[styles.emptyListText, { color: colors.onBackground }]}>No expenses added yet.</Text>
      )}

      <Divider style={[styles.divider, { backgroundColor: colors.outline }]} />

      <Text style={[styles.subHeader, { color: colors.text }]}>Who Owes Whom?</Text>
      <ScrollView contentContainerStyle={styles.settlementListContainer}>
        {settlements.length > 0 ? (
          settlements.map((item, index) => (
            <List.Item
              key={`${item.from}-${item.to}-${index}`} 
              title={`${item.from} owes ${item.to}`}
              description={`$${item.amount}`}
              left={(props) => <List.Icon {...props} icon="arrow-right-thin-circle-outline" color={colors.accent} />}
              style={[styles.settlementItem, { backgroundColor: colors.surface, borderLeftColor: colors.accent }]}
              titleStyle={{ fontWeight: 'bold', color: colors.text }}
              descriptionStyle={{ color: colors.primary }}
            />
          ))
        ) : (
          <Text style={[styles.emptyListText, { color: colors.onBackground }]}>No outstanding settlements. Everyone's even!</Text>
        )}
      </ScrollView>

      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={hideModal}
          contentContainerStyle={[styles.modalContainer, { backgroundColor: colors.surface }]}
        >
          <Text style={[styles.modalTitle, { color: colors.primary }]}>Add New Expense</Text>
          <TextInput
            label="Description"
            value={description}
            onChangeText={setDescription}
            mode="outlined"
            style={styles.textInput}
            activeOutlineColor={colors.primary}
            outlineColor={colors.outline}
            textColor={colors.text}
          />
          <TextInput
            label="Amount"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            mode="outlined"
            style={styles.textInput}
            activeOutlineColor={colors.primary}
            outlineColor={colors.outline}
            textColor={colors.text}
          />

          <Text style={[styles.pickerLabel, { color: colors.text }]}>Paid By:</Text>
          <View style={[styles.pickerWrapper, { borderColor: colors.outline }]}>
            <Picker
              selectedValue={paidByUserId}
              onValueChange={(itemValue) => setPaidByUserId(itemValue)}
              style={[styles.picker, { color: colors.text }]}
              itemStyle={{ color: colors.text }}
            >
              {groupMembers.map((member) => (
                <Picker.Item key={member.user_id.toString()} label={member.username} value={member.user_id} />
              ))}
            </Picker>
          </View>

          <Text style={[styles.pickerLabel, { color: colors.text }]}>Participants (Who shares this expense?)</Text>
          <View style={styles.chipContainer}>
            {groupMembers.map((member) => (
              <Chip
                key={member.user_id.toString()}
                icon={participantsUserIds.includes(member.user_id) ? "check" : null}
                onPress={() => toggleParticipant(member.user_id)}
                selected={participantsUserIds.includes(member.user_id)}
                style={[styles.chip, participantsUserIds.includes(member.user_id) && { backgroundColor: colors.primaryContainer }]}
                textStyle={participantsUserIds.includes(member.user_id) && { color: colors.onPrimaryContainer }}
              >
                {member.username}
              </Chip>
            ))}
          </View>

          <Button mode="contained" onPress={addExpense} style={[styles.modalButton, { backgroundColor: colors.primary }]}>
            Add Expense
          </Button>
          <Button mode="outlined" onPress={hideModal} style={[styles.modalButton, { borderColor: colors.primary }]} textColor={colors.primary}>
            Cancel
          </Button>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  subHeaderSmall: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  subHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 25,
    marginBottom: 15,
  },
  listContentContainer: {
    paddingBottom: 10,
  },
  listItem: {
    marginVertical: 6,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
  },
  participantsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginRight: 10,
  },
  participantChip: {
    marginHorizontal: 2,
    marginVertical: 2,
    height: 30,
  },
  emptyListText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  addButton: {
    marginTop: 10,
    marginBottom: 15,
    paddingVertical: 10,
    borderRadius: 10,
    elevation: 5,
  },
  addButtonLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  modalContainer: {
    padding: 25,
    margin: 20,
    borderRadius: 15,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
  },
  textInput: {
    marginBottom: 18,
  },
  pickerLabel: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  chip: {
    margin: 4,
    height: 35,
    justifyContent: 'center',
  },
  modalButton: {
    marginVertical: 10,
    paddingVertical: 8,
    borderRadius: 10,
    elevation: 3,
  },
  divider: {
    marginVertical: 30,
    height: 2,
  },
  settlementListContainer: {
    paddingBottom: 20,
  },
  settlementItem: {
    marginVertical: 6,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    borderLeftWidth: 5,
  },
});

export default ExpenseManagementScreen;