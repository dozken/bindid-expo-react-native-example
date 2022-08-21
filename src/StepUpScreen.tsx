import React, {useState} from 'react';
import {ActivityIndicator, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import type {NavigationStackProp} from 'react-navigation-stack';
import style from './style';

import XmBindIdSdk from '@transmitsecurity/bindid-react-native';
import {
    XmBindIdAuthenticationRequest,
    XmBindIdError,
    XmBindIdResponse,
    XmBindIdScopeType,
    XmBindIdTransactionSigningData,
    XmBindIdTransactionSigningDisplayData,
    XmBindIdTransactionSigningRequest
} from "@transmitsecurity/bindid-react-native/src/transmit-bind-id-api";
import env from "./env";

interface Props {
    navigation: NavigationStackProp<{}>;
}

const StepUpScreen: React.FC<Props> = ({navigation}) => {
    const [authenticationInProgress, setAuthenticationInProgress] = useState(false);
    const [isAuthenticationError, setIsAuthenticationError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const authenticateWithBindID = async (): Promise<void> => {
        /**
         * redirectURI: A valid URL that will be triggered by the BindID serviec. The app should be able to support handling it
         * usePkce: This enables using a PKCE flow (RFC-7636) to securely obtain the ID and access token through the client.
         * scope: openId is the default configuration, you can also add .email, .networkInfo, .phone
         */
        setAuthenticationInProgress(false);
        setIsAuthenticationError(false);
        setErrorMessage('');

        const request: XmBindIdAuthenticationRequest = {
            redirectUri: env.RedirectURI,
            scope: [XmBindIdScopeType.OpenId, XmBindIdScopeType.Email],
            usePkce: true
        };

        XmBindIdSdk.authenticate(request)
            .then((response: XmBindIdResponse) => {
                console.log(`BindID Authentication Completed: ${JSON.stringify(response)}`);
                handleAuthenticationResponse(response);
            }).catch((error: XmBindIdError) => {
            console.log(`BindID Authentication Failed: ${JSON.stringify(error)}`);
            handleAuthenticationError(error);
        });
    }

    const signTransactionBindID = async (): Promise<void> => {
        /**
         * redirectURI: A valid URL that will be triggered by the BindID serviec. The app should be able to support handling it
         * usePkce: This enables using a PKCE flow (RFC-7636) to securely obtain the ID and access token through the client.
         * scope: openId is the default configuration, you can also add .email, .networkInfo, .phone
         */
        setAuthenticationInProgress(false);
        setIsAuthenticationError(false);
        setErrorMessage('');

        const displayData: XmBindIdTransactionSigningDisplayData = {
            payee: "John Doe",
            paymentAmount: "100$",
            paymentMethod: "PayPal"
        };

        const transactionSigningData: XmBindIdTransactionSigningData = {
            displayData: displayData
        };

        const request: XmBindIdTransactionSigningRequest = {
            redirectUri: env.RedirectURI,
            transactionSigningData: transactionSigningData,
            encrypted: true,
            usePkce: true
        };

        XmBindIdSdk.signTransaction(request)
            .then((response: XmBindIdResponse) => {
                console.log(`BindID Sign Transaction Completed: ${JSON.stringify(response)}`);
                handleAuthenticationResponse(response);
            }).catch((error: XmBindIdError) => {
            console.log(`BindID Sign Transaction Failed: ${JSON.stringify(error)}`);
            handleAuthenticationError(error);
        });
    }

    const handleAuthenticationResponse = async (response: XmBindIdResponse): Promise<void> => {
        setAuthenticationInProgress(false);
        setIsAuthenticationError(false);
        setErrorMessage('');

        // After validation of the token we can navigate to the Authenticated User Screen and present the token data
        navigation.navigate('AuthenticatedUserScreen', {response: response});
    }

    const handleAuthenticationError = (error: XmBindIdError): void => {
        setAuthenticationInProgress(false);
        setIsAuthenticationError(true);
        setErrorMessage(`${error.code} ${error.message}`);
    }

    return (
        <SafeAreaView style={styles.container}>
            <Image
                style={styles.brandingLogo}
                source={require('./assets/img/transmit_logo.png')}
            />
            <View style={styles.authenticateButtonContainer}>
                {authenticationInProgress
                    ? <ActivityIndicator size="small"/>
                    : <View style={{flexDirection: "column"}}>
                        <View>
                            <TouchableOpacity onPress={() => authenticateWithBindID()}>
                                <View style={styles.authenticateButton}>
                                    <Text style={styles.authenticateButtonText}>
                                        Step-Up
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <TouchableOpacity onPress={() => signTransactionBindID()}>
                                <View style={styles.authenticateButton}>
                                    <Text style={styles.authenticateButtonText}>
                                        Transaction
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                }
            </View>
            {isAuthenticationError &&
                <Text style={styles.errorMessage}>Error authenticating with BindID: {errorMessage}</Text>
            }
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: style.white,
        flex: 1
    },
    brandingLogo: {
        width: '80%',
        resizeMode: "contain",
        alignSelf: "center",
        marginTop: 20
    },
    authenticateButtonContainer: {
        width: '80%',
        alignSelf: 'center',
    },
    authenticateButton: {
        backgroundColor: style.primary,
        justifyContent: 'center',
        height: 50,
        borderRadius: 8,
        margin: 16
    },
    authenticateButtonText: {
        color: style.white,
        textAlign: "center",
        fontSize: 20
    },
    errorMessage: {
        width: '80%',
        alignSelf: "center",
        marginTop: 20,
        color: "red"
    }
});

export default StepUpScreen;
