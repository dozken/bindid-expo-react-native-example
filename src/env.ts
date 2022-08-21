import {XmBindIdServerEnvironmentMode} from "@transmitsecurity/bindid-react-native/src/transmit-bind-id-api";

// Configure your BindID ClientID and Redirect URI in the BindID console at https://admin.bindid-sandbox.io/console/#/applications
export default {
    ClientID: "XXXXXXX.XXXXXXXX.dev_6fa9320b.bindid.io",
    RedirectURI: "bindid://mobile-app-example",
    BindIDEnvironmentMode: XmBindIdServerEnvironmentMode.Sandbox,

    getHostName: (envMode: XmBindIdServerEnvironmentMode): string => {
        switch (envMode) {
            case XmBindIdServerEnvironmentMode.Sandbox: {
                return 'signin.bindid-sandbox.io';
            }
            case XmBindIdServerEnvironmentMode.Production: {
                return 'signin.bindid.io';
            }
            default: {
                return 'signin.bindid-sandbox.io';
            }
        }
    }
}
