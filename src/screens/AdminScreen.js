import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { Upload, CheckCircle, FileText, ArrowLeft } from 'lucide-react-native';
import manualsData from '../data/manuals.json';

export default function AdminScreen({ navigation }) {
    const [fileStatus, setFileStatus] = useState({});

    useEffect(() => {
        checkFiles();
    }, []);

    const checkFiles = async () => {
        const status = {};
        for (const manual of manualsData) {
            const fileUri = FileSystem.documentDirectory + manual.file;
            const info = await FileSystem.getInfoAsync(fileUri);
            status[manual.id] = info.exists;
        }
        setFileStatus(status);
    };

    const pickDocument = async (manualId, targetFilename) => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'application/pdf',
                copyToCacheDirectory: true
            });

            if (result.canceled) return;

            const sourceUri = result.assets[0].uri;
            const targetUri = FileSystem.documentDirectory + targetFilename;

            // Delete existing if any
            const info = await FileSystem.getInfoAsync(targetUri);
            if (info.exists) {
                await FileSystem.deleteAsync(targetUri);
            }

            // Copy new file
            await FileSystem.copyAsync({
                from: sourceUri,
                to: targetUri
            });

            Alert.alert('Success', `Updated ${targetFilename}`);
            checkFiles(); // Refresh status
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to upload file');
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.info}>
                <Text style={styles.manualTitle}>{item.title}</Text>
                <Text style={styles.filename}>{item.file}</Text>
                <View style={styles.statusContainer}>
                    {fileStatus[item.id] ? (
                        <View style={styles.badgeSuccess}>
                            <CheckCircle size={12} color="#fff" />
                            <Text style={styles.badgeText}>Ready</Text>
                        </View>
                    ) : (
                        <View style={styles.badgeMissing}>
                            <FileText size={12} color="#fff" />
                            <Text style={styles.badgeText}>Missing</Text>
                        </View>
                    )}
                </View>
            </View>

            <TouchableOpacity
                style={styles.uploadButton}
                onPress={() => pickDocument(item.id, item.file)}
            >
                <Upload color="#fff" size={20} />
                <Text style={styles.uploadText}>Upload</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#141E30', '#243B55']}
                style={styles.background}
            />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ArrowLeft color="#fff" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Admin Configuration</Text>
            </View>

            <Text style={styles.subHeader}>
                Upload PDF files for each manual below. These files will be stored locally on the device.
            </Text>

            <FlatList
                data={manualsData}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 50,
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    backButton: {
        marginRight: 15,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    subHeader: {
        color: '#ccc',
        paddingHorizontal: 20,
        marginBottom: 20,
        lineHeight: 20,
    },
    list: {
        padding: 20,
    },
    card: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    info: {
        flex: 1,
    },
    manualTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    filename: {
        color: '#aaa',
        fontSize: 12,
        marginTop: 2,
        fontFamily: 'monospace',
    },
    statusContainer: {
        marginTop: 8,
        flexDirection: 'row',
    },
    badgeSuccess: {
        flexDirection: 'row',
        backgroundColor: '#2ecc71',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        alignItems: 'center',
    },
    badgeMissing: {
        flexDirection: 'row',
        backgroundColor: '#e74c3c',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        alignItems: 'center',
    },
    badgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
        marginLeft: 4,
    },
    uploadButton: {
        backgroundColor: '#3498db',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
    },
    uploadText: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 8,
    },
});
