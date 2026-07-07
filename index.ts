import { registerRootComponent } from "expo";
import { installNetworkLogger } from "@/debug/networkLog";
import { runAppDiagnostics } from "@/debug/appDiagnostics";

installNetworkLogger();
void runAppDiagnostics();

import App from "./App";

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
