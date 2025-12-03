import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import GradientButton from '../components/GradientButton';
import { BookOpen, Users, Mail } from 'lucide-react-native';
import * as Linking from 'expo-linking';

export default function WelcomeScreen({ navigation }) {
    const handleEmail = () => {
        Linking.openURL('mailto:support@company.com');
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#2c3e50', '#4ca1af']}
                style={styles.background}
            />
            <SafeAreaView style={styles.content}>
                <View style={styles.headerContainer}>
                    <Text style={styles.header}>Dashboard</Text>
                    <Text style={styles.subHeader}>Select an option below</Text>
                </View>

                <View style={styles.menuContainer}>
                    <GradientButton
                        title="Manuals"
                        subtitle="Access instruction guides"
                        icon={BookOpen}
                        colors={['#FF416C', '#FF4B2B']}
                        onPress={() => navigation.navigate('Manuals')}
                    />

                    <GradientButton
                        title="Contacts"
                        subtitle="Get in touch with us"
                        icon={Users}
                        colors={['#11998e', '#38ef7d']}
                        onPress={() => navigation.navigate('Contacts')}
                    />

                    <GradientButton
                        title="Email Us"
                        subtitle="Send a direct message"
                        icon={Mail}
                        colors={['#8E2DE2', '#4A00E0']}
                        onPress={handleEmail}
                    />
                </View>
            </SafeAreaView>
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
    content: {
        flex: 1,
        padding: 20,
    },
    headerContainer: {
        marginTop: 40,
        marginBottom: 40,
    },
    header: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
    },
    subHeader: {
        fontSize: 18,
        color: 'rgba(255,255,255,0.8)',
    },
    menuContainer: {
        flex: 1,
        justifyContent: 'center',
    },
});
