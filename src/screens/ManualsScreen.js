import React from 'react';
import { View, Text, StyleSheet, FlatList, Alert, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import GradientButton from '../components/GradientButton';
import * as FileSystem from 'expo-file-system';
import * as IntentLauncher from 'expo-intent-launcher';
import * as Sharing from 'expo-sharing';
import { Asset } from 'expo-asset';
import { manualsMap } from '../data/manuals_map';
import { ShieldCheck, Settings, Wrench, AlertTriangle, FileText } from 'lucide-react-native';
import manualsData from '../data/manuals.json';

const iconMap = {
    ShieldCheck,
    Settings,
    Wrench,
    AlertTriangle,
    FileText
};

export default function ManualsScreen() {

    const openPdf = async (filename) => {
        try {
            // Check if we have a bundled asset for this file
            const bundledAsset = manualsMap[filename];

            let fileUri;

            if (bundledAsset) {
                // If bundled, we need to ensure it's available as a local file
                const asset = Asset.fromModule(bundledAsset);
                await asset.downloadAsync(); // Ensure it's downloaded/cached
                fileUri = asset.localUri || asset.uri;
            } else {
                // Fallback to document directory (for the "USB" method or if not bundled)
                fileUri = FileSystem.documentDirectory + filename;
                const fileInfo = await FileSystem.getInfoAsync(fileUri);
                if (!fileInfo.exists) {
                    Alert.alert('Error', 'Manual not found. Please upload it via the Admin Dashboard.');
                    return;
                }
            }

            // Open the file
            if (Platform.OS === 'android') {
                const contentUri = await FileSystem.getContentUriAsync(fileUri);
                await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
                    data: contentUri,
                    flags: 1,
                    type: 'application/pdf',
                });
            } else {
                await Sharing.shareAsync(fileUri);
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Could not open manual: ' + error.message);
        }
    };

    const renderItem = ({ item }) => {
        const IconComponent = iconMap[item.icon] || FileText;

        return (
            <GradientButton
                title={item.title}
                icon={IconComponent}
                colors={['#2193b0', '#6dd5ed']}
                onPress={() => openPdf(item.file)}
            />
        );
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#2c3e50', '#4ca1af']}
                style={styles.background}
            />
            <FlatList
                data={manualsData}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                ListHeaderComponent={
                    <Text style={styles.header}>Instruction Manuals</Text>
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
});
