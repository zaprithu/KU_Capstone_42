import React, { useState, useEffect } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";

const RECORD_DURATION = 5000
// get from:  `ipconfig getifaddr en0` on mac
const LOCAL_IP = '192.168.0.28'
const PORT = 8080 // port running docker container for lambda function
const LAMBDA_URL = `http://${LOCAL_IP}:${PORT}/2015-03-31/functions/function/invocations`

interface Track {
    artist: string,
    song_name: string
}

interface ListenButtonProps {
    ip: string | null,
    port: number | null
}

const ListenButton: React.FC<ListenButtonProps> = ({ ip, port }) => {
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
        if (!currentRecording)
            return;

        currentRecording.stopAndUnloadAsync();

        console.log("Stopping");
        setButtonText("Stopping");

        await Audio.setAudioModeAsync(
            {
                allowsRecordingIOS: false,
            }
        );
        const uri = currentRecording.getURI();
        setRecording(null);

        if (uri) {
            fetchSongInfo(uri);
        } else {
            Alert.alert("Error", "Recording failed.");
        }
    }

    const fetchSongInfo = async (uri: string) => {
        console.log("Preparing Audio");
        setButtonText("Preparing Audio");

        const base64 = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
        });

        try {
            const payload = JSON.stringify({
                file: base64,
            });
            console.log("Uploading");
            setButtonText("Uploading");
            const response = await fetch(LAMBDA_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const json = await response.json();
            const data = JSON.parse(json.body);
            const track: Track = data.track;

            console.log("TRACK", track);
            setButtonText(`${track.song_name} by ${track.artist}`);

            sendSongToBot(track);

        } catch (error) {
            console.error("ERROR!", error)
            setButtonText("ERROR")
        }
    }

    const fetchWithTimeout = (
        url: string,
        options: RequestInit = {},
        timeout: number = 5000 // 5 seconds
    ): Promise<Response> => {
        return Promise.race([
            fetch(url, options),
            new Promise<Response>((_, reject) =>
                setTimeout(() => reject(new Error("Timeout")), timeout)
            ),
        ]);
    };


    const sendSongToBot = async (track: Track) => {
        const timeout = 2000;
        try {
            console.log("fetching", ip, port);
            const response = await fetchWithTimeout(`http://${ip}:${port}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(track),
            }, timeout)

            if (!response.ok) {
                throw new Error(`Server responded with status ${response.status}`);
            }

            const data = await response.json();

            if (data.artist == track.artist && data.song_name === track.song_name) {
                setButtonText(`Dancing to '${track.song_name}' by ${track.artist}`)
            } else {
                setButtonText("ERROR sending track to robot!s")
            }
        } catch (error: unknown) {
            console.error("Failed to send song to bot:", error);

            console.log("ERROR", error);
            if (error instanceof Error) {
                if (error.message === "Timeout") {
                    setButtonText("ERROR: Request timed out");
                } else {
                    setButtonText("ERROR: Could not connect to robot. \nCheck IP/port.");
                }
            } else {
                setButtonText("ERROR: Unknown error occurred");
            }
            console.log("aborted")
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
            fontWeight: 'bold',
            textAlign: 'center'
        },
    });

    export default ListenButton;