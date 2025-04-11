import { StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useState, useEffect } from 'react';

interface IIpInputProps {
    passToParent: (data: IpInputData) => void,
    initialData: IpInputData
}

export interface IpInputData {
    value: string | null,
    valid: boolean
}

const IpInput: React.FC<IIpInputProps> = ({passToParent, initialData}) => {
    const [text, setText] = useState<string>('');
    const [errorStrings, setErrorStrings] = useState<string[]>(['', '', '', '']);

    const autoCorrect = (text: string) => {
        // only allow digits and .
        text = text.replace(/[^0-9.]/g, '');
        let octets = text.split('.');

        octets.forEach((octet, index) => {
            // ensure  octets aren't bigger than 3 digits
            if (octet.length > 3) {
                const extraChars = octet.slice(3 - octet.length);
                if (octets.length > index + 1) {
                    octets[index + 1] = extraChars + octets[index + 1];
                } else {
                    octets.splice(index + 1, 0, extraChars);
                }
                octets[index] = octet.slice(0, 3);
            }

            // remove leading zeros in octet
            // if (octet.length == 3) {
            //     let chars = [...octet];
            //     chars.slice(0, -1).forEach((char, index, arr) => {
            //         if (char == '0') {
            //             chars.shift();
            //         }
            //     });
            //     octets[index] = chars.join();
            // }
        });

        if (octets.length > 4) {
            octets = octets.slice(0,4);
        }

        // check errors
        octets.forEach((octet, index) => {
            octet = octet.replace(/[^0-9.]/g, '');
            let errStr = ''
            if (parseInt(octet) > 255) {
                errStr = `ERROR: Octet ${index + 1} greater than 255!`;
            } else if (parseInt(octet) < 0) {
                errStr = `ERROR: Octet ${index + 1} less than 0!`;
            }

            setErrorStrings(arr => [...arr.slice(0, index), errStr, ...arr.slice(index + 1)]);
        });

        let str = octets.join('.').replace(/[^0-9.]/g, '');
        return str;
    }

    const checkValid = (value: string) : boolean => {
        const octets = value.split('.');
        return octets.length === 4 && errorStrings.every(str => str === '') ? true : false;
    }

    const changeHandler = (value: string) => {
        const correctedValue = autoCorrect(value);
        setText(correctedValue);
        passToParent({value: correctedValue, valid: checkValid(value)});
    }

    useEffect(()=>{
        if (initialData.value !== null)
            setText(initialData.value);
    }, [initialData])

    return (
        <View style={styles.container}>
            <Text style={styles.label}>IP Address</Text>
            <TextInput
                style={styles.input}
                value={text}
                onChangeText={changeHandler}
                placeholder={'Nao IP Address'}
                placeholderTextColor={'#e7e7e7'}
                keyboardType={'decimal-pad'}
            />
            {errorStrings.map((str, index) => (
                str !== '' && (
                    <Text style={styles.errorText} key={`errStr${index}`}>{str}</Text>
                )
            ))}
            {/* <Text style={styles.errorText}>{text}</Text> */}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        // flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        borderRadius: 3,
        // width: 200
        textAlign: 'left',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#29292b',
        height: 45,
        // marginRight: 12,
        borderWidth: 1,
        padding: 10,
        color: '#e7e7e7',
        borderColor: '#e7e7e7',
        borderRadius: 3,
        width: 150,
    },
    label: {
        // margin: 12,
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 10,
        color: '#e7e7e7',
        fontSize: 14,
        width:150
    },
    errorText: {
        color: 'red'
    }
});

export default IpInput;