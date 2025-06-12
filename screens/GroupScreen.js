import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { TextInput, Button, Card, Title, Paragraph, useTheme } from 'react-native-paper';

const API_BASE_URL = 'http://10.0.0.70/roommate_api';

function GroupScreen({ navigation }) {
  const { colors } = useTheme();
  const [username, setUsername] = useState('');
  const [groupName, setGroupName] = useState('');
  const [groupCode, setGroupCode] = useState('');
  const [activeTab, setActiveTab] = useState('create'); 

  const handleCreateGroup = async () => {
    if (!username.trim() || !groupName.trim()) {
      Alert.alert('Missing Info', 'Please enter your username and a group name.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/create_group.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, group_name: groupName }),
      });
      const data = await response.json();

      if (data.success) {
        Alert.alert('Success', `${data.message}\nYour Group Code: ${data.group.group_code}`);
        navigation.replace('Home', {
          currentGroup: data.group,
          currentUser: data.user,
        });
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      console.error('Error creating group:', error);
      Alert.alert('Network Error', 'Could not connect to the server. Please check your IP and XAMPP.');
    }
  };

  const handleJoinGroup = async () => {
    if (!username.trim() || !groupCode.trim()) {
      Alert.alert('Missing Info', 'Please enter your username and the group code.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/join_group.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, group_code: groupCode }),
      });
      const data = await response.json();

      if (data.success) {
        Alert.alert('Success', data.message);
        navigation.replace('Home', {
          currentGroup: data.group,
          currentUser: data.user,
        });
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      console.error('Error joining group:', error);
      Alert.alert('Network Error', 'Could not connect to the server. Please check your IP and XAMPP.');
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.scrollContainer, { backgroundColor: colors.background }]}>
      <Card style={[styles.card, { backgroundColor: colors.surface }]}>
        <Card.Content>
          <Title style={[styles.title, { color: colors.primary }]}>Welcome to Roommate Hub!</Title>
          <Paragraph style={[styles.paragraph, { color: colors.text }]}>
            Start by entering your username and then either create a new group or join an existing one.
          </Paragraph>

          <TextInput
            label="Your Username"
            value={username}
            onChangeText={setUsername}
            mode="outlined"
            style={styles.textInput}
            activeOutlineColor={colors.primary}
            outlineColor={colors.outline}
            textColor={colors.text}
          />

          <View style={styles.tabContainer}>
            <Button
              mode={activeTab === 'create' ? 'contained' : 'outlined'}
              onPress={() => setActiveTab('create')}
              style={[styles.tabButton, activeTab === 'create' && { backgroundColor: colors.primary }]}
              labelStyle={[styles.tabButtonLabel, activeTab === 'create' && { color: colors.onPrimary }]}
              textColor={activeTab === 'create' ? colors.onPrimary : colors.primary}
            >
              Create Group
            </Button>
            <Button
              mode={activeTab === 'join' ? 'contained' : 'outlined'}
              onPress={() => setActiveTab('join')}
              style={[styles.tabButton, activeTab === 'join' && { backgroundColor: colors.primary }]}
              labelStyle={[styles.tabButtonLabel, activeTab === 'join' && { color: colors.onPrimary }]}
              textColor={activeTab === 'join' ? colors.onPrimary : colors.primary}
            >
              Join Group
            </Button>
          </View>

          {activeTab === 'create' ? (
            <View>
              <TextInput
                label="New Group Name"
                value={groupName}
                onChangeText={setGroupName}
                mode="outlined"
                style={styles.textInput}
                activeOutlineColor={colors.primary}
                outlineColor={colors.outline}
                textColor={colors.text}
              />
              <Button
                mode="contained"
                onPress={handleCreateGroup}
                style={[styles.actionButton, { backgroundColor: colors.primary }]}
                labelStyle={styles.actionButtonLabel}
              >
                Create Group
              </Button>
            </View>
          ) : (
            <View>
              <TextInput
                label="Group Code"
                value={groupCode}
                onChangeText={setGroupCode}
                mode="outlined"
                style={styles.textInput}
                activeOutlineColor={colors.primary}
                outlineColor={colors.outline}
                textColor={colors.text}
                autoCapitalize="characters" 
              />
              <Button
                mode="contained"
                onPress={handleJoinGroup}
                style={[styles.actionButton, { backgroundColor: colors.primary }]}
                labelStyle={styles.actionButtonLabel}
              >
                Join Group
              </Button>
            </View>
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 400, 
    padding: 15,
    borderRadius: 15,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  paragraph: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 25,
  },
  textInput: {
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 25,
    width: '100%',
  },
  tabButton: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 8,
    paddingVertical: 5,
    borderColor: '#6200EE', 
    borderWidth: 1,
  },
  tabButtonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionButton: {
    marginTop: 10,
    paddingVertical: 10,
    borderRadius: 10,
    elevation: 5,
  },
  actionButtonLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default GroupScreen;