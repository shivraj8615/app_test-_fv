import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Phone, Mail, User } from 'lucide-react-native';
import * as Linking from 'expo-linking';
import contactsData from '../data/contacts.json';

export default function ContactsScreen() {

    const handleCall = (phone) => {
        Linking.openURL(`tel:${phone}`);
    };

    const handleEmail = (email) => {
        Linking.openURL(`mailto:${email}`);
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <User color="#333" size={24} />
                <View style={styles.headerText}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.role}>{item.role}</Text>
                </View>
            </View>

            <View style={styles.actions}>
                <TouchableOpacity style={styles.actionButton} onPress={() => handleCall(item.phone)}>
                    <Phone color="#11998e" size={20} />
                    <Text style={styles.actionText}>{item.phone}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton} onPress={() => handleEmail(item.email)}>
                    <Mail color="#8E2DE2" size={20} />
                    <Text style={styles.actionText}>{item.email}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#2c3e50', '#4ca1af']}
                style={styles.background}
            />
            <FlatList
                data={contactsData}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                ListHeaderComponent={
                    <Text style={styles.header}>Contacts</Text>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    listContent: {
        padding: 20,
        paddingTop: 60,
    },
    header: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20,
    },
    card: {
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderRadius: 15,
        padding: 20,
        marginBottom: 15,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    headerText: {
        marginLeft: 15,
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    role: {
        fontSize: 14,
        color: '#666',
    },
    actions: {
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 15,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    actionText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#444',
    },
});
