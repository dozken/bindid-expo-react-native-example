# BindID example using Expo React Native
BindID example using Expo prebuild ./android and ./ios

## Prerequisites
### Set GitHub personal access token
Change or set environment variable `GITHUB_PAT` with your [GitHub personal access](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) token at [`./.npmrc`](./.npmrc)

### BindID Installation   
Before you begin, you'll need to have an application configured in the [BindID Admin Portal](https://admin.bindid-sandbox.io/console/#/applications). From the application settings, obtain the client credentials and configure a redirect URI for this client that will receive the authentication result.

- Example ClientID: `XXXXXXX.XXXXXXXX.dev_6fa9320b.bindid.io"` (This is auto generated in the console)
- Example RedirectURI: `rnbindidexample://login`  

For more, see:   
[BindID Admin Portal: Get Started](https://developer.bindid.io/docs/guides/admin_portal/topics/getStarted/get_started_admin_portal)    
[BindID React Native SDK](https://github.com/TransmitSecurity/bindid-react-native#installation)  
-----------

### Configure BinID in project
Before running the application on your iOS or Android devices you will need to configure the application.

Configure `env.ts`:
Open `example/src/env.ts` and setup your ClientID and Redirect URI
```bash
'ClientID' # Client ID obtained from the BindID Admin Portal
'RedirectURI' # Redirect URI you defined in the BindID Admin Portal
```
Note: in this project RedirectURI is `bindid://mobile-app-example`  
Where `bid_scheme: bindid` and `bid_host: mobile-app-example`, at [`./android/app/build.gradle`](./android/app/build.gradle)

## Run the application
1. `yarn` to install node modules
2. `yarn android` to run Android application
3. `yarn ios` to run iOS application

## Known issues of bindid-react-native library 
### iOS bindid-react-native pod linking
CocoaPods checks if the name of spec contains `/` which fails in current version where pod name is `@transmitsecurity/bind-react-native`  

Give proper name to [`./node_modules/@transmitsecurity/bindid-react-native/bindid-react-native.podspec`](./node_modules/@transmitsecurity/bindid-react-native/bindid-react-native.podspec)
```text
Pod::Spec.new do |s|
  s.name         = "bindid-react-native"
  s.version      = package["version"]
```

PR to fix it: https://github.com/TransmitSecurity/bindid-react-native/pull/8

## Troubleshoot
### Cannot login in Android emulator
1. Setup fingerprint on [emulator](https://stackoverflow.com/questions/35335892/android-m-fingerprint-scanner-on-android-emulator)
2. Open Chrome browser at least once before opening application to agree with chrome policy
