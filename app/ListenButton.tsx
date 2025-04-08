import React, { useState, useEffect } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

const RECORD_DURATION = 2500

// get from:  `ipconfig getifaddr en0` on mac
const LOCAL_IP = '10.104.161.193'
const PORT = 8080 // port running docker container for lambda function
const LAMBDA_URL = `http://${LOCAL_IP}:${PORT}/2015-03-31/functions/function/invocations`

const ListenButton: React.FC = () => {
    const [recording, setRecording] = useState<Audio.Recording | null>();
    const [uploading, setUploading] = useState<boolean>(false);
    const [permissionResponse, requestPermission] = Audio.usePermissions();
    // const [sharePermission, requestSharePermission] = Sharing.;
    const [buttonText, setButtonText] = useState<string>('Start Listening');

    const startRecording = async () => {
        setButtonText("pressed")
        try {
            console.log("start recording");
            if (permissionResponse?.status !== 'granted') {
                console.log('Requesting permission..');
                await requestPermission();
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: true,
                    playsInSilentModeIOS: true,
                })
            }

            setButtonText("Recording");
            console.log("recording")

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
            setTimeout(() => stopAndUploadRecording(recording), RECORD_DURATION);
            setRecording(recording);

        } catch (error) {
            console.error("Failed to start recording", error);
        }
    }

    const stopAndUploadRecording = async (currentRecording: Audio.Recording) => {
        if (!currentRecording) return;

        currentRecording.stopAndUnloadAsync();
        await Audio.setAudioModeAsync(
            {
                allowsRecordingIOS: false,
            }
        );
        const uri = currentRecording.getURI();
        setRecording(null);

        if (uri) {
            const base64 = await FileSystem.readAsStringAsync(uri, {
                encoding: FileSystem.EncodingType.Base64,
            });

            console.log("base64", typeof(base64), base64)

            try {
                const payload = JSON.stringify({
                    file: base64, 
                  });
                const response = await fetch(LAMBDA_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                });
                // console.log("got data")
                const text = await response.text(); 
                // console.log("Raw response:", text);
                const data = JSON.parse(text); 
                // console.log("data:", data);
                const parsedData = JSON.parse(data.body);
                // console.log("parsedData", parsedData);

                // Extract song title and artist
                const songName: string = parsedData.track.artist;
                const artist: string = parsedData.track.song_name;

                console.log(`Song: ${songName}, Artist: ${artist}`);
                setButtonText(`Song: ${songName}, Artist: ${artist}`)
            } catch (error) {
                console.error("ERROR!", error)
            }

        }

        if (!uri) {
            Alert.alert("Error", "Recording failed.");
        }
    }

    return (
        <>
            <TouchableOpacity style={styles.listenButton} onPress={startRecording}>
                <Text style={styles.listenButtonText}>{buttonText}</Text>
            </TouchableOpacity>
        </>
    );


}

const styles = StyleSheet.create({
    listenButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2bd659',
        height: 200,
        width: 200,
        borderRadius: 100,
        padding: 20,
    },
    listenButtonText: {
        fontSize: 20,
        fontWeight: 'bold'
    },
});

export default ListenButton;