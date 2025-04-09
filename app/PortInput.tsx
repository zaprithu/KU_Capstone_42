import { StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useState, useEffect } from 'react';

interface IPortInputProps {
    passToParent: (data: PortInputData) => void,
    initialData: PortInputData
}

export interface PortInputData {
    value: number | null,
    valid: boolean
}

const PortInput: React.FC<IPortInputProps> = ({ passToParent, initialData }) => {
    const [text, setText] = useState<string>('');
    const [errorString, setErrorString] = useState<string | null>(null);


    const autoCorrect = (text: string) => {
        // only allow digits and .
        text = text.replace(/[^0-9.]/g, '');
        if (text.length > 4) {
            text = text.slice(0, 4);
        }
        if (text.length !== 4) {
            setErrorString("ERROR: Port number must be four digits!");
        } else {
            setErrorString(null);
        }
        const numVal = parseInt(text);
        return numVal;
    }

    const checkValid = (value: string): boolean => {
        return value.length !== 4 ? false : true;
    }

    const changeHandler = (value: string) => {
        const correctedValue = autoCorrect(value);
        setText(correctedValue.toString());
        passToParent({ value: correctedValue, valid: checkValid(value.toString()) });
    }

    useEffect(() => {
        
        console.log("init port", typeof (initialData), initialData)
        if (Number.isNaN(initialData.value))
            setText('');
        else if (initialData.value !== null)
            setText(initialData.value.toString());
        // setText('')
    }, [initialData])

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Port</Text>
            <TextInput
                style={styles.input}
                value={text}
                onChangeText={changeHandler}
                placeholder={'Nao Port Number'}
                placeholderTextColor={'#e7e7e7'}
                keyboardType={'number-pad'}
            />
            {errorString &&
                <Text style={styles.errorText} key={`errStrPort`}>{errorString}</Text>}
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
        textAlign: 'left'
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
        width: 150
    },
    errorText: {
        color: 'red'
    }
});

export default PortInput;