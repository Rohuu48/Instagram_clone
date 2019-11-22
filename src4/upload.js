import React from "react";
import {
  TextInput,
  ActivityIndicator,
  FlatList,
  Text,
  View,
  Image
} from "react-native";
import { f, storage, auth, database } from "./config/config";
import { TouchableOpacity } from "react-native";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";

const styles = {
  header: {
    height: 70,
    padding: 30,
    backgroundColor: "white",
    borderColor: "lightgrey",
    borderBottomWidth: 2
  }
};

class upload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      imageId: this.uniqueid(),
      imageSelected: false,
      uploading: false,
      caption: "",
      progress: 0
    };
  }

  checkPermissions = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ camera: status });
    const { statusRoll } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    this.setState({ cameraRoll: statusRoll });
  };

  s4S = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  };

  uniqueid = () => {
    return (
      this.s4S() +
      "-" +
      this.s4S() +
      "-" +
      this.s4S() +
      "-" +
      this.s4S() +
      "-" +
      this.s4S() +
      "-" +
      this.s4S() +
      "-" +
      this.s4S() +
      "-" +
      this.s4S()
    );
  };

  selectnewImage = async () => {
    console.log("Upload");
    this.checkPermissions();
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "Images",
      allowsEditing: true,
      quality: 1
    });
    console.log(result);
    if (!result.cancelled) {
      this.setState({
        imageSelected: true,
        imageId: this.uniqueid(),
        uri: result.uri
      });
      console.log("Upload image");
      // this.uploadImage(result.uri);
    } else {
      console.log("cancel");
      this.setState({
        imageSelected: false
      });
    }
  };
  uploadImage = async uri => {
    var that = this;
    var userid = f.auth().currentUser.uid;
    var imageId = this.state.imageId;

    var re = /(?:\.([^.]+))?$/;
    var ext = re.exec(uri)[1];
    this.setState({ currentFileType: ext, uploading: true });

    const response = await fetch(uri);
    const blob = await response.blob();
    var filePath = imageId + "." + that.state.currentFileType;

    var uploadTask = storage
      .ref("user/" + userid + "/img")
      .child(filePath)
      .put(blob);

    uploadTask.on(
      "state_changed",
      function(snapshot) {
        var progress = (
          (snapshot.bytesTransferred / snapshot.totalBytes) *
          100
        ).toFixed(0);
        console.log("Upload:" + progress + "% complete");
        that.setState({
          progress: progress
        });
      },
      function(error) {
        console.log("Error with upload - " + error);
      },
      function() {
        that.setState({
          progress: 100
        });
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
          console.log(downloadURL);
          that.processUpload(downloadURL);
        });
      }
    );
  };

  processUpload = imageUrl => {
    var userId = f.auth().currentUser.uid;
    var caption = this.state.caption;
    var dateTime = Date.now();
    var timestamp = Math.floor(dateTime / 1000);
    var imageId = this.state.imageId;
    var photoObj = {
      author: userId,
      caption: caption,
      posted: timestamp,
      url: imageUrl
    };

    //Adding photo to profile
    database.ref("/users/" + userId + "/photos/" + imageId).set(photoObj);

    //Adding photo to feed
    database.ref("/photos/" + imageId).set(photoObj);

    alert("image uploaded");
    this.setState({
      uploading: false,
      imageSelected: false,
      caption: "",
      uri: ""
    });
  };

  uploadPublish = () => {
    if (this.state.uploading == false) {
      {
        this.state.caption != ""
          ? this.uploadImage(this.state.uri)
          : alert("Please enter a caption");
      }
    } else {
      console.log("Ignore button tap");
    }
  };

  componentDidMount = () => {
    var that = this;
    f.auth().onAuthStateChanged(function(user) {
      if (user) {
        //Logged In
        that.setState({
          loggedIn: true
        });
      } else {
        //Not Logged In
        that.setState({
          loggedIn: false
        });
      }
    });
  };
  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.state.loggedIn == true ? (
          <View style={{ flex: 1 }}>
            {this.state.imageSelected === true ? (
              <View style={{ flex: 1 }}>
                <View style={styles.header}>
                  <Text
                    style={{
                      fontWeight: "bold",
                      textAlign: "center"
                    }}
                  >
                    Upload
                  </Text>
                </View>
                <View style={{ padding: 5 }}>
                  <Text style={{ marginTop: 5 }}>Caption:</Text>
                  <TextInput
                    editable={true}
                    placeholder={"Enter caption"}
                    maxLength={150}
                    numberOfLines={7}
                    multiline={true}
                    onChangeText={text => this.setState({ caption: text })}
                    style={{
                      marginVertical: 10,
                      height: 100,
                      padding: 5,
                      borderColor: "grey",
                      borderWidth: 1,
                      borderRadius: 3,
                      backgroundColor: "white",
                      color: "black"
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => this.uploadPublish()}
                    style={{
                      alignSelf: "center",
                      width: 170,
                      marginHorizontal: "auto",
                      backgroundColor: "purple",
                      borderRadius: 5,
                      paddingVertical: 10,
                      paddingHorizontal: 20
                    }}
                  >
                    <Text style={{ textAlign: "center", color: "white" }}>
                      Upload and Publish
                    </Text>
                  </TouchableOpacity>

                  {this.state.uploading == true ? (
                    <View style={{ marginTop: 10 }}>
                      <Text>{this.state.progress}%</Text>
                      {this.state.progress != 100 ? (
                        <ActivityIndicator size="small" color="blue" />
                      ) : (
                        <Text>Uploaded</Text>
                      )}
                    </View>
                  ) : (
                    <View></View>
                  )}
                  <Image
                    source={{ uri: this.state.uri }}
                    style={{
                      marginTop: 10,
                      resizeMode: "cover",
                      width: "100%",
                      height: "50%"
                    }}
                  />
                </View>
              </View>
            ) : (
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    flex: 1
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      textAlign: "center",
                      fontSize: 40,
                      paddingBottom: 15
                    }}
                  >
                    Upload
                  </Text>
                  <TouchableOpacity
                    onPress={() => this.selectnewImage()}
                    style={{
                      borderRadius: 5,
                      backgroundColor: "blue",
                      paddingHorizontal: 30,
                      paddingVertical: 20
                    }}
                  >
                    <Text style={{ color: "white", textAlign: "center" }}>
                      Select Photo
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        ) : (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text>You are not logged in.Please Log in</Text>
          </View>
        )}
      </View>
    );
  }
}

export default upload;
