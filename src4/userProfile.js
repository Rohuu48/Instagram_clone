import React from "react";
import { TouchableOpacity, FlatList, Text, View, Image } from "react-native";
import { f, storage, auth, database } from "./config/config";

class profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false
    };
  }

  checkParams = () => {
    var params = this.props.navigation.state.params;
    if (params) {
      if (params.userId) {
        this.setState({
          userId: params.userId
        });
      }
      this.fetchUserInfo(params.userId);
      this.setState({ loaded: true });
    }
  };

  fetchUserInfo = userId => {
    var that = this;
    database
      .ref("users")
      .child(userId)
      .child("username")
      .once("value")
      .then(function(snapshot) {
        const exists = snapshot.val() !== null;
        if (exists) data = snapshot.val();
        that.setState({
          username: data
        });
      })
      .catch(error => console.log(error));

    database
      .ref("users")
      .child(userId)
      .child("name")
      .once("value")
      .then(function(snapshot) {
        const exists = snapshot.val() !== null;
        if (exists) data = snapshot.val();
        that.setState({
          name: data
        });
      })
      .catch(error => console.log(error));

    database
      .ref("users")
      .child(userId)
      .child("avatar")
      .once("value")
      .then(function(snapshot) {
        const exists = snapshot.val() !== null;
        if (exists) data = snapshot.val();
        that.setState({
          avatar: data
        });
      })
      .catch(error => console.log(error));
  };

  componentDidMount = () => {
    this.checkParams();
  };
  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.state.loaded == true ? (
          <View style={{ flex: 1 }}>
            <View
              style={{
                height: 70,
                padding: 30,
                backgroundColor: "white",
                borderColor: "lightgrey",
                borderBottomWidth: 2
              }}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  textAlign: "center"
                }}
              >
                Profile
              </Text>
            </View>
            <View
              style={{
                justifyContent: "space-evenly",
                alignItems: "center",
                flexDirection: "row",
                paddingVertical: 10
              }}
            >
              <Image
                source={{
                  uri: this.state.avatar
                }}
                style={{
                  marginLeft: 10,
                  height: 100,
                  width: 100,
                  borderRadius: 50
                }}
              />
              <View style={{ marginRight: 10 }}>
                <Text>{this.state.name}</Text>
                <Text>{this.state.username}</Text>
              </View>
            </View>

            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "green"
              }}
            >
              <Text>Photos Loading...</Text>
            </View>
          </View>
        ) : (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text>Loading...</Text>
          </View>
        )}
      </View>
    );
  }
}

export default profile;
