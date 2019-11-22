import React from "react";

import feed from "./src4/feed";
import profile from "./src4/profile";
import upload from "./src4/upload";
import userProfile from "./src4/userProfile";
import comments from "./src4/comments";
import { createAppContainer } from "react-navigation";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { createStackNavigator } from "react-navigation-stack";
import { FlatList, Text, View, Image } from "react-native";
import { f, storage, auth, database } from "./src4/config/config";

const TabStack = createBottomTabNavigator({
  Feed: { screen: feed },
  Upload: { screen: upload },
  Profile: { screen: profile }
});
const MainStack = createStackNavigator(
  {
    Home: { screen: TabStack },
    User: { screen: userProfile },
    Comments: { screen: comments }
  },
  {
    initialRouteName: "Home",
    defaultNavigationOptions: {
      title: "Instagram",
      headerStyle: {
        backgroundColor: "white"
      },
      headerTitleStyle: {
        fontWeight: "bold",
        fontStyle: "italic"
      }
    },
    mode: "modal"
  }
);
const styles = {
  container: {
    display: "flex",
    flex: 1,
    borderColor: "red",
    borderWidth: 1
  }
};
const Navigator = createAppContainer(MainStack);
class App extends React.Component {
  constructor(props) {
    super(props);
    this.login();
  }
  login = async () => {
    //Forcing user to log in
    try {
      let user = await auth.signInWithEmailAndPassword(
        "test@user.com",
        "123456"
      );
    } catch (error) {
      console.log(error);
    }
  };
  render() {
    return <Navigator />;
  }
}
export default App;
