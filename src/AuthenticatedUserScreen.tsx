import * as React from 'react';
import {useEffect, useState} from 'react';
import type {NavigationStackProp} from 'react-navigation-stack';
import {ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import type {
    XmBindIdError,
    XmBindIdExchangeTokenResponse
} from "@transmitsecurity/bindid-react-native/src/transmit-bind-id-api";
import XmBindIdSdk from '@transmitsecurity/bindid-react-native';
import style from './style';

import env from './env';

import {jsonObjectToArray} from './utils';

interface PassportItem {
    title: string;
    value: any;
}

interface Props {
    navigation: NavigationStackProp<{}>;
    route: any;
}

const AuthenticatedUserScreen: React.FC<Props> = ({navigation, route}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [sortedPassportKeys, setSortedPassportKeys] = useState([]);
    const [passportData, setPassportData] = useState({});

    useEffect(() => {
        parseIDToken();
    }, []);


    const items: PassportItem[] = sortedPassportKeys.map((key: string) => {

        const k = key.toString().split(",")[0]
        const v = key.toString().split(",")[1]
        console.log(`key ${k}`);
        console.log(`value ${v}`);
        return {title: k, value: v};
    });

    const parseIDToken = async (): Promise<void> => {
        XmBindIdSdk.exchangeToken(route.params.response)
            .then((response: XmBindIdExchangeTokenResponse) => {
                console.log(`BindID Exchange Token Completed: ${JSON.stringify(response)}`);
                handleExchangeResponseResponse(response);
            }).catch((error: XmBindIdError) => {
            console.log(`BindID AuthenticateExchange Token Failed: ${error.message}`);
            setHasError(true);
            setErrorMessage(error.message);
            setIsLoading(false);        });
    }

    const handleExchangeResponseResponse = async (response: XmBindIdExchangeTokenResponse): Promise<void> => {
        console.log(`idToken: ${response.idToken}`);

        if (!response.idToken) {
            console.log("Invalid response returned from authentication");
            return handleMessageError(`Invalid response returned from authentication: ${response}`);
        }

        const idToken = response.idToken;
        if (!idToken) {
            console.log("Invalid ID Token" + idToken);
            return handleMessageError("Invalid ID Token" + idToken);
        }

        // Once we receive the ID Token response we should verify the validity of the token
        const isValid = await XmBindIdSdk.validate(idToken, env.getHostName(env.BindIDEnvironmentMode));
        if (!isValid) {
            console.log("Invalid ID Token");
            return handleMessageError("Invalid ID Token");
        }

        //Parse the ID Token to components and present them on a Flat List
        const passportData = await XmBindIdSdk.parse(idToken);
        if (!passportData) {
            console.log("Error parsing ID Token");
            return handleMessageError("Error parsing ID Token");
        }

        const json = JSON.stringify(passportData);
        console.log(`Passport ${json}`);

        const passportDataArray = jsonObjectToArray(passportData)
        console.log(`passportDataArray ${passportDataArray}`);

        setIsLoading(false);
        setSortedPassportKeys(passportDataArray);
        setPassportData(passportData);
    }

    const handleMessageError = (error: string): void => {
        setHasError(true);
        setErrorMessage(error);
        setIsLoading(false);
    }

    if (isLoading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large"/>
            </View>
        );
    }

    if (hasError) {
        return (
            <View style={styles.container}>
                <Text>{errorMessage}</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={items}
                renderItem={({item}) => (
                    <View>
                        <View style={styles.listItem}>
                            <Text style={styles.itemTitle}>{item.title}</Text>
                            <Text style={styles.itemValue}>{item.value}</Text>
                        </View>
                        <View style={styles.separator}/>
                    </View>
                )}
                keyExtractor={({title}) => {
                    return title
                }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: style.white,
        flex: 1
    },
    listItem: {
        flex: 1,
        padding: 12
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#000000"
    },
    itemValue: {
        fontSize: 16,
        fontWeight: "400",
        color: "#000000",
        marginTop: 2
    },
    separator: {
        backgroundColor: "#f5f5f5",
        height: 0.5,
        width: "98%",
        marginLeft: "2%"
    }
});

export default AuthenticatedUserScreen;
