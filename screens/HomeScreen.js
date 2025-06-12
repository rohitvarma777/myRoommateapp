import React from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import { Text, Button, Card, Title, Paragraph, useTheme } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

function HomeScreen({ navigation }) { 
  const { colors } = useTheme();
  const route = useRoute();
  const { currentGroup, currentUser } = route.params || {};

  console.log('HomeScreen received params:', { currentGroup, currentUser });

  if (!currentGroup || !currentUser) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.error, fontSize: 18, textAlign: 'center', marginBottom: 20 }}>
          Error: Group or User information missing. Please go back and select/create a group.
        </Text>
        <Button mode="contained" onPress={() => navigation.replace('Group')} style={{marginTop: 20}}>
          Go to Group Selection
        </Button>
      </View>
    );
  }

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('currentUser');
    await AsyncStorage.removeItem('currentGroup');
    navigation.replace('Group');
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1517487881594-2787fef5ee43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80' }}
      style={styles.backgroundImage}
      imageStyle={styles.imageStyle}
    >
      <View style={[styles.overlay, { backgroundColor: 'rgba(255,255,255,0.8)' }]}>
        <Card style={[styles.card, { backgroundColor: colors.surface }]}>
          <Card.Content>
            <Title style={[styles.cardTitle, { color: colors.primary }]}>
              {currentGroup.group_name} ({currentGroup.group_code})
            </Title>
            <Paragraph style={[styles.cardParagraph, { color: colors.text }]}>
              Logged in as: {currentUser.username}
            </Paragraph>
            <Paragraph style={[styles.cardParagraph, { color: colors.text }]}>
              Your all-in-one app for effortlessly managing shared expenses and chores. Say goodbye to awkward conversations!
            </Paragraph>
          </Card.Content>
        </Card>

        <Button
          icon="calendar-check"
          mode="contained"
          onPress={() => navigation.navigate('TaskScheduling', { currentGroup, currentUser })}
          style={[styles.button, { backgroundColor: colors.primary }]}
          labelStyle={styles.buttonLabel}
        >
          Manage Chores
        </Button>

        <Button
          icon="currency-usd"
          mode="contained"
          onPress={() => navigation.navigate('ExpenseManagement', { currentGroup, currentUser })}
          style={[styles.button, { backgroundColor: colors.primary }]}
          labelStyle={styles.buttonLabel}
        >
          Manage Expenses
        </Button>

        {}
        <Button
          icon="account-group" 
          mode="contained"
          onPress={() => navigation.navigate('GroupMembers', { currentGroup, currentUser })}
          style={[styles.button, { backgroundColor: colors.primary }]}
          labelStyle={styles.buttonLabel}
        >
          Group Members
        </Button>
        {}

        <Button
          icon="logout"
          mode="outlined"
          onPress={handleLogout}
          style={[styles.logoutButton, { borderColor: colors.error, backgroundColor: colors.surface }]}
          labelStyle={[styles.logoutButtonLabel, { color: colors.error }]}
          textColor={colors.error}
        >
          Logout
        </Button>

        <Text style={[styles.footerText, { color: colors.onBackground }]}>Keeping your shared living space harmonious. ✨</Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  imageStyle: {
    opacity: 0.7,
  },
  overlay: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '90%',
    marginBottom: 40,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    borderRadius: 15,
  },
  cardTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  cardParagraph: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  button: {
    width: '85%',
    marginVertical: 12,
    paddingVertical: 10,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonLabel: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  logoutButton: {
    width: '85%',
    marginTop: 20,
    paddingVertical: 10,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
  },
  logoutButtonLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  footerText: {
    marginTop: 50,
    fontSize: 15,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default HomeScreen;