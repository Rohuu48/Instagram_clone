import React from "react";
import { Header } from "react-navigation-stack";
import {
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  FlatList,
  Text,
  View,
  Image
} from "react-native";
import { f, storage, auth, database } from "./config/config";
class comments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      comments_list: []
    };
  }

  checkParams = () => {
    var params = this.props.navigation.state.params;
    if (params) {
      if (params.photoId) {
        this.setState({
          photoId: params.photoId
        });
      }
      this.fetchComments(params.photoId);
    }
  };

  addToComments = (comments_list, data, comment) => {
    var that = this;
    var commentObj = data[comment];
    console.log(
      comments_list,
      comment,
      data,
      data[comment],
      data[comment].comment,
      data[comment].author
    );

    database
      .ref("users")
      .child(commentObj.author)
      .child("username")
      .once("value")
      .then(function(snapshot) {
        const exists = snapshot.val() != null;
        console.log(exists);
        if (exists) data = snapshot.val();

        comments_list.push({
          id: comment,
          comment: commentObj.comment,
          posted: that.timeConverter(commentObj.posted),
          authorId: commentObj.author,
          author: data
        });

        console.log(comments_list + "saas");
        that.setState({
          refresh: false,
          loading: false
        });
      })
      .catch(err => console.log(err));
  };

  fetchComments = photoId => {
    var that = this;
    database
      .ref("comments")
      .child(photoId)
      .orderByChild("posted")
      .once("value")
      .then(function(snapshot) {
        const exists = snapshot.val() !== null;
        if (exists) {
          data = snapshot.val();
          var comments_list = that.state.comments_list;
          for (var comment in data) {
            that.addToComments(comments_list, data, comment);
          }
        } else {
          that.setState({
            comments_list: []
          });
        }
      })
      .catch(error => console.log(error));
  };

  postComment = () => {
    var comment = this.state.comment;
    if (comment != "") {
      var dateTime = Date.now();
      var timestamp = Math.floor(dateTime / 1000);
      var imageId = this.state.photoId;
      var userId = f.auth().currentUser.uid;
      var commentId = this.uniqueid();

      this.setState({
        comment: ""
      });
      var commentObj = {
        posted: timestamp,
        author: userId,
        comment: comment
      };
      database.ref("/comments/" + imageId + "/" + commentId).set(commentObj);
      this.reloadCommentList();
    } else {
      alert("Cannot post an empty comment");
    }
  };

  reloadCommentList = () => {
    this.setState({
      comments_list: []
    });
    this.fetchComments(this.state.photoId);
  };

  plural = s => {
    if (s == 1) return " ago";
    else return "s ago";
  };

  timeConverter = timestamp => {
    var a = new Date(timestamp * 1000);
    var seconds = Math.floor((new Date() - a) / 1000);
    var interval = Math.floor(seconds / 31536000);
    if (interval > 1) {
      return interval + " year" + this.plural(interval);
    }
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
      return interval + " month" + this.plural(interval);
    }
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
      return interval + " day" + this.plural(interval);
    }
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
      return interval + " hour" + this.plural(interval);
    }
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
      return interval + " minute" + this.plural(interval);
    }
    return Math.floor(seconds) + " second" + this.plural(seconds);
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
    this.checkParams();
  };
  render() {
    return (
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
            Comments
          </Text>
        </View>

        {this.state.comments_list.length !== 0 ? (
          <FlatList
            refreshing={this.state.refresh}
            data={this.state.comments_list}
            keyExtractor={(item, index) => index.toString()}
            style={{ flex: 1, backgroundColor: "white" }}
            renderItem={({ item, index }) => {
              return (
                <View
                  key={index}
                  style={{
                    width: "100%",
                    overflow: "hidden",
                    marginBottom: 5,
                    justifyContent: "space-between",
                    borderBottomWidth: 1,
                    borderColor: "grey"
                  }}
                >
                  <View>
                    <View style={{ flexDirection: "row" }}>
                      <TouchableOpacity
                        onPress={() =>
                          this.props.navigation.navigate("User", {
                            userId: item.authorId
                          })
                        }
                        style={{
                          padding: 5,
                          flexDirection: "row",
                          width: "25%",
                          borderRadius: 5,
                          marginVertical: 10
                        }}
                      >
                        <Text>{item.author}</Text>
                      </TouchableOpacity>
                      <View style={{ padding: 5 }}>
                        <Text style={{ fontSize: 25 }}>{item.comment}</Text>
                        <Text style={{ fontSize: 10 }}>{item.posted}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              );
            }}
          />
        ) : (
          //no comments
          <View>
            <Text>No Comments</Text>
          </View>
        )}
        {this.state.loggedIn == true ? (
          <KeyboardAvoidingView
            keyboardVerticalOffset={Header.HEIGHT + 35}
            behavior="padding"
            enabled
            style={{
              borderTopWidth: 1,
              borderTopColor: "grey",
              padding: 10,
              marginBottom: 15
            }}
          >
            <Text style={{ fontWeight: "bold" }}>Post a comment</Text>
            <View style={{ flexDirection: "row" }}>
              <TextInput
                editable={true}
                placeholder={"Enter comment here"}
                onChangeText={text => this.setState({ comment: text })}
                style={{
                  marginVertical: 10,
                  height: 50,
                  padding: 5,
                  borderColor: "grey",
                  borderWidth: 2,
                  borderRadius: 3,
                  backgroundColor: "white",
                  color: "black"
                }}
              />
              <TouchableOpacity
                onPress={() => {
                  this.postComment();
                }}
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 10,
                  borderRadius: 50,
                  backgroundColor: "blue"
                }}
              >
                <Text style={{ color: "white" }}>Post</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        ) : (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text></Text>
          </View>
        )}
      </View>
    );
  }
}

export default comments;
