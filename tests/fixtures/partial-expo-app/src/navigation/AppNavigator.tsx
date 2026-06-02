import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Tabs" component={TabsNavigator} />
    </Stack.Navigator>
  );
}

function TabsNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={() => null} />
    </Tab.Navigator>
  );
}
