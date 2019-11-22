import React from 'react';
import {TouchableOpacity, FlatList, Text, View, Image} from 'react-native';
import {f, storage, auth, database} from './config/config';
class profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
    };
  }
  componentDidMount = () => {
    var that = this;
    f.auth().onAuthStateChanged(function(user) {
      if (user) {
        //Logged In
        that.setState({
          loggedIn: true,
        });
      } else {
        //Not Logged In
        that.setState({
          loggedIn: false,
        });
      }
    });
  };
  render() {
    return (
      <View style={{flex: 1}}>
        {this.state.loggedIn == true ? (
          <View style={{flex: 1}}>
            <View
              style={{
                height: 70,
                padding: 30,
                backgroundColor: 'white',
                borderColor: 'lightgrey',
                borderBottomWidth: 2,
              }}>
              <Text
                style={{
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}>
                Profile
              </Text>
            </View>
            <View
              style={{
                justifyContent: 'space-evenly',
                alignItems: 'center',
                flexDirection: 'row',
                paddingVertical: 10,
              }}>
              <Image
                source={{
                  uri: 'https://api.adorable.io/avatars/285/test@user.i.png',
                }}
                style={{
                  marginLeft: 10,
                  height: 100,
                  width: 100,
                  borderRadius: 50,
                }}
              />
              <View style={{marginRight: 10}}>
                <Text>Name</Text>
                <Text>Username</Text>
              </View>
            </View>
            <View style={{paddingBottom: 20, borderBottomWidth: 1}}>
              <TouchableOpacity
                style={{
                  marginTop: 10,
                  marginHorizontal: 40,
                  paddingVertical: 15,
                  borderRadius: 20,
                  borderColor: 'grey',
                  borderWidth: 1.5,
                }}>
                <Text style={{textAlign: 'center', color: 'grey'}}>
                  Log Out
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  marginTop: 10,
                  marginHorizontal: 40,
                  paddingVertical: 15,
                  borderRadius: 20,
                  borderColor: 'grey',
                  borderWidth: 1.5,
                }}>
                <Text style={{textAlign: 'center', color: 'grey'}}>
                  Edit Profile
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Upload')}
                style={{
                  backgroundColor: 'grey',
                  marginTop: 10,
                  marginHorizontal: 40,
                  paddingVertical: 35,
                  borderRadius: 20,
                  borderColor: 'grey',
                  borderWidth: 1.5,
                }}>
                <Text style={{textAlign: 'center', color: 'white'}}>
                  Upload New +
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'blue',
              }}>
              <Text>Photos Loading...</Text>
            </View>
          </View>
        ) : (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>You are not logged in.Please Log in</Text>
          </View>
        )}
      </View>
    );
  }
}

export default profile;
