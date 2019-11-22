import React from "react";
import { TouchableOpacity, FlatList, Text, View, Image } from "react-native";
import { f, storage, auth, database } from "./config/config";

const styles = {
  header: {
    height: 70,
    padding: 30,
    backgroundColor: "white",
    borderColor: "lightgrey",
    borderBottomWidth: 2
  }
};

class feed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photo_feed: [],
      refresh: false,
      loading: true
    };
  }

  componentDidMount = () => {
    this.loadFeed();
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

  addtoFlatList = (photofeed, data2, photo) => {
    var that = this;
    var photoObj = data2[photo];

    console.log(photoObj);
    database
      .ref("users")
      .child(photoObj.author)
      .child("username")
      .once("value")
      .then(function(snapshot) {
        const exists = snapshot.val() != null;
        console.log(exists);
        if (exists) data = snapshot.val();
        console.log("USERS", data, data2, photoObj.author);

        photofeed.push({
          id: photo,
          url: photoObj.url,
          caption: photoObj.caption,
          author: data,
          authorId: photoObj.author,
          posted: that.timeConverter(photoObj.posted)
        });
        console.log("bfcffcgcjghj", photofeed);
        that.setState({
          photo_feed: photofeed,
          refresh: false,
          loading: false
        });
        console.log("Entire feed", that.state.photo_feed);
      })
      .catch(error => console.log(error));
  };

  loadFeed = () => {
    this.setState({
      refresh: true,
      photo_feed: []
    });
    var that = this;

    database
      .ref("photos")
      .orderByChild("posted")
      .once("value")
      .then(function(snapshot) {
        const exists = snapshot.val() !== null;
        if (exists) data = snapshot.val();
        console.log("PHOTO");
        var photofeed = that.state.photo_feed;
        console.log(data);
        for (var photo in data) {
          console.log("photoooooo", photo, data[photo].caption);
          that.addtoFlatList(photofeed, data, photo);
        }
      })
      .catch(error => console.log(error));
  };

  loadNew = () => {
    this.loadFeed();
  };
  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text
            style={{
              fontWeight: "bold",
              textAlign: "center"
            }}
          >
            Feed
          </Text>
        </View>

        {this.state.loading == true ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text>Loading...</Text>
          </View>
        ) : (
          <FlatList
            refreshing={this.state.refresh}
            onRefresh={this.loadNew}
            data={this.state.photo_feed}
            keyExtractor={(item, index) => index.toString()}
            style={{ flex: 1, backgroundColor: "white" }}
            renderItem={({ item, index }) => (
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
                <View
                  style={{
                    padding: 5,
                    width: "100%",
                    flexDirection: "row",
                    justifyContent: "space-between"
                  }}
                >
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate("User", {
                        userId: item.authorId
                      })
                    }
                  >
                    <Text>{item.author}</Text>
                  </TouchableOpacity>

                  <Text>{item.posted}</Text>
                </View>
                <Image
                  source={{
                    uri: item.url
                  }}
                  style={{ resizeMode: "cover", width: "100%", height: 275 }}
                />
                <View style={{ padding: 5 }}>
                  <Text>{item.caption}</Text>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate("Comments", {
                        photoId: item.id
                      })
                    }
                  >
                    <Text
                      style={{
                        color: "blue",
                        marginTop: 10,
                        textAlign: "center"
                      }}
                    >
                      Add a comment
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        )}
      </View>
    );
  }
}

export default feed;
