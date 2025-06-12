import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, StyleSheet, Alert, RefreshControl, Share } from 'react-native';
import { Text, Button, Card, Title, Paragraph, useTheme, List } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';

const API_BASE_URL = 'http://10.0.0.70/roommate_api'; 

function GroupMembersScreen({ navigation }) {
    const { colors } = useTheme();
    const route = useRoute();
    const { currentGroup, currentUser } = route.params || {};

    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const fetchGroupMembers = useCallback(async () => {
        if (!currentGroup?.group_id) {
            Alert.alert('Error', 'Group information missing. Please go back.');
            navigation.goBack();
            return;
        }
        setLoading(true);
        setRefreshing(true);
        try {
            const response = await fetch(`${API_BASE_URL}/get_group_members.php?group_id=${currentGroup.group_id}`);
            const data = await response.json();
            console.log('Fetched group members data:', data);

            if (data.success) {
                setMembers(data.members);
            } else {
                Alert.alert('Error', data.message || 'Failed to fetch group members.');
                setMembers([]);
            }
        } catch (error) {
            console.error('Error fetching group members:', error);
            Alert.alert('Error', 'Failed to connect to the server or process data.');
            setMembers([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [currentGroup, navigation]);

    useEffect(() => {
        fetchGroupMembers();
    }, [fetchGroupMembers]);

    const onShare = async () => {
        try {
            const result = await Share.share({
                message: `Join my roommate group "${currentGroup.group_name}" using this code: ${currentGroup.group_code}. Download the Roommate App today!`,
                title: `Join ${currentGroup.group_name} on Roommate App`
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
            }
        } catch (error) {
            Alert.alert('Sharing Error', error.message);
        }
    };


    if (!currentGroup || !currentUser) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <Text style={{ color: colors.error, fontSize: 18, textAlign: 'center', marginBottom: 20 }}>
                    Error: Group or User information missing. This screen cannot be accessed directly.
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
                    <RefreshControl refreshing={refreshing} onRefresh={fetchGroupMembers} />
                }
            >
                <Title style={[styles.headerTitle, { color: colors.primary }]}>
                    Group: {currentGroup.group_name}
                </Title>
                <Paragraph style={[styles.groupCode, { color: colors.text }]}>
                    Group Code: <Text style={{fontWeight: 'bold', color: colors.primary}}>{currentGroup.group_code}</Text>
                </Paragraph>

                <Button
                    icon="share-variant"
                    mode="outlined"
                    onPress={onShare}
                    style={[styles.shareButton, { borderColor: colors.primary, backgroundColor: colors.surface }]}
                    labelStyle={{ color: colors.primary }}
                >
                    Share Group Code
                </Button>

                <Title style={[styles.sectionTitle, { color: colors.primary }]}>
                    Members
                </Title>

                {members.length === 0 ? (
                    <Card style={[styles.memberCard, { backgroundColor: colors.surface }]}>
                        <Card.Content>
                            <Paragraph style={{ color: colors.text }}>No members found yet.</Paragraph>
                            <Paragraph style={{ color: colors.textSecondary, marginTop: 10 }}>
                                Invite new members using the Group Code above!
                            </Paragraph>
                        </Card.Content>
                    </Card>
                ) : (
                    <List.Section>
                        {members.map((member) => (
                            <List.Item
                                key={member.user_id}
                                title={member.username}
                                description={member.user_id === currentUser.user_id ? 'You' : 'Member'}
                                left={() => <List.Icon icon="account-circle" color={colors.primary} />}
                                style={[styles.memberItem, { backgroundColor: colors.surface }]}
                                titleStyle={{ color: colors.text }}
                                descriptionStyle={{ color: colors.textSecondary }}
                            />
                        ))}
                    </List.Section>
                )}
            </ScrollView>
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
    groupCode: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20,
    },
    shareButton: {
        marginVertical: 15,
        paddingVertical: 5,
        borderRadius: 10,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
        textAlign: 'center',
    },
    memberCard: {
        marginVertical: 8,
        borderRadius: 10,
        elevation: 3,
        padding: 10,
    },
    memberItem: {
        marginVertical: 4,
        borderRadius: 8,
        elevation: 1,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#ddd',
    }
});

export default GroupMembersScreen;