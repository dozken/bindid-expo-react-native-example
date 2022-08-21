import React, {useState} from 'react';
import {ActivityIndicator, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import style from './style';

import XmBindIdSdk from '@transmitsecurity/bindid-react-native';
import {
    XmBindIdAuthenticationRequest,
    XmBindIdResponse,
    XmBindIdScopeType
} from "@transmitsecurity/bindid-react-native/src/transmit-bind-id-api";

import env from "./env";
import {NavigationStackProp} from "react-navigation-stack";

interface Props {
    navigation: NavigationStackProp<{}>;
}

const AuthenticateScreen: React.FC<Props> = ({navigation}) => {
    const [authenticationInProgress, setAuthenticationInProgress] = useState(false);
    const [isAuthenticationError, setIsAuthenticationError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const authenticateWithBindID = async (): Promise<void> => {
        setAuthenticationInProgress(false);
        setErrorMessage('');
        setIsAuthenticationError(false);

        const request: XmBindIdAuthenticationRequest = {
            redirectUri: env.RedirectURI,
            scope: [XmBindIdScopeType.OpenId, XmBindIdScopeType.Email],
            usePkce: true
        };

        try {
            const response: XmBindIdResponse = await XmBindIdSdk.authenticate(request);
            console.log(`BindID Authentication Completed: ${JSON.stringify(response)}`);

            // After validation of the token we can navigate to the Authenticated User Screen and present the token data
            navigation.navigate('StepUpScreen', {response: response});
        } catch (error) {
            console.log(`BindID Authentication Failed: ${JSON.stringify(error)}`);

            setAuthenticationInProgress(true);
            setErrorMessage(`${error.code} ${error.message}`);
            setIsAuthenticationError(false);
        }
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
                    : <TouchableOpacity onPress={() => authenticateWithBindID()}>
                        <View style={styles.authenticateButton}>
                            <Text style={styles.authenticateButtonText}>
                                Login with Biometrics
                            </Text>
                        </View>
                    </TouchableOpacity>}
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
        borderRadius: 8
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

export default AuthenticateScreen;
