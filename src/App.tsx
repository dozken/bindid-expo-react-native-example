import React, {useEffect, useState} from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import XmBindIdSdk from '@transmitsecurity/bindid-react-native';
import type {XmBindIdError} from "@transmitsecurity/bindid-react-native/src/transmit-bind-id-api";

import AuthenticateScreen from './AuthenticateScreen';
import StepUpScreen from './StepUpScreen';
import AuthenticatedUserScreen from './AuthenticatedUserScreen';
import env from './env';

const Stack = createNativeStackNavigator();

const App: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSdkError, setIsSdkError] = useState(false);

    useEffect(() => {
        // Initialize the BindID SDK Wrapper with environment mode (sandbox/production) and the ClientID
        XmBindIdSdk.initialize({
            clientId: env.ClientID,
            serverEnvironment: {
                environmentMode: env.BindIDEnvironmentMode,
                environmentUrl: ""
            }
        }).then((success: boolean) => {
            console.log(`BindID initialize Completed: ${success}`);
            setIsLoading(false);
            setIsSdkError(!success)
        }).catch((error: XmBindIdError) => {
            console.log(`BindID initialized Failed: ${JSON.stringify(error)}`);
        });
    }, [])


    if (isLoading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large"/>
            </View>
        )
    }

    if (isSdkError) {
        return (
            <View style={styles.container}>
                <Text>Error initializing the BindID SDK</Text>
            </View>
        )
    }

    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="AuthenticateScreen" component={AuthenticateScreen}
                              options={{title: 'BindID Example'}}/>
                <Stack.Screen name="StepUpScreen" component={StepUpScreen}
                              options={{title: "Step Up", headerBackTitleVisible: false}}/>
                <Stack.Screen name="AuthenticatedUserScreen" component={AuthenticatedUserScreen}
                              options={{title: "Authenticated", headerBackTitleVisible: false}}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    box: {
        width: 60,
        height: 60,
        marginVertical: 20,
    },
});

export default App;
