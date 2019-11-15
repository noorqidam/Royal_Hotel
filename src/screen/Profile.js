import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  AsyncStorage,
  Image,
  Dimensions,
} from 'react-native';
import { Header, Title, Card } from 'native-base';
import { StackActions, NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
// const image= this.props.navigation.getParam('image');
// const profName= this.props.navigation.getParam('name');
const { width } = Dimensions.get('window');
export class Profile extends Component {
  state = {
    // image: this.props.adminsLocal.login.image,
    // name: this.props.adminsLocal.login.name,
    // email: this.props.adminsLocal.login.email,
    image: '',
    name: '',
    email: '',
  };
  async componentDidMount() {
    const image = await AsyncStorage.getItem('image');
    const name = await AsyncStorage.getItem('name');
    const email = await AsyncStorage.getItem('email');
    this.setData(image, name, email);
  }
  async setData(image, name, email) {
    this.setState({ name, image, email });
  }
  async handleLogOut() {
    await AsyncStorage.removeItem('token');
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'login' })],
    });
    this.props.navigation.dispatch(resetAction);
  }
  render() {
    console.disableYellowBox = true;
    return (
      <View style={styles.mainView}>
        <View>
          <Header style={styles.header}>
            <Title style={styles.titleHeader}>Admin</Title>
          </Header>
        </View>
        <Card style={styles.profile}>
          <View style={{ justifyContent: 'center' }}>
            <Image
              source={{ uri: this.state.image }}
              style={styles.iconProfile}
            />
          </View>
          <View style={{ justifyContent: 'center' }}>
            <Text style={styles.iconName}>
              {'Email   : '}
              {this.state.email}
            </Text>
            <Text style={styles.iconName}>
              {'Name   : '}
              {this.state.name}
            </Text>
          </View>
        </Card>
        <View style={styles.logout}>
          <TouchableOpacity
            style={styles.btnLogout}
            onPress={() => this.handleLogOut()}>
            <Text style={styles.text}> Log Out </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
// const mapStateToProps = state => {
//   return {
//     adminsLocal: state.login,
//   };
// };
export default connect(/*mapStateToProps}*/)(Profile);

const styles = {
  header: {
    backgroundColor: '#111832',
    height: 70,
    justifyContent: 'center',
  },
  titleHeader: {
    alignSelf: 'center',
    color: '#ded47b',
    fontSize: 30,
  },
  profile: {
    alignSelf: 'center',
    width: 400,
    // flexDirection: 'row',
    borderRadius: 10,
    paddingLeft: 10,
    marginTop: 30,
    paddingBottom: 30,
    backgroundColor: '#3d3d3d',
  },
  mainView: {
    backgroundColor: '#dfe4ea',
    flex: 1,
  },
  iconProfile: {
    borderWidth: 1,
    borderColor: '#f1f2f6',
    width: 100,
    height: 100,
    borderRadius: 60,
    alignSelf: 'center',
    marginVertical: 30
  },
  iconName: {
    fontSize: 20,
    color: '#fff',
    marginHorizontal: 30
  },
  logout: {
    marginTop: 10,
    paddingTop: 10,
    backgroundColor: '#3d3d3d',
    alignSelf: 'center',
    width: 150,
    height: 50,
    borderRadius: 8,
  },
  btnLogout: {
    alignSelf: 'center',
  },
  text: {
    fontSize: 20,
    color: '#fff',
  },
  iconButtonText: {
    flex: 1,
    marginTop: 5,
    fontSize: 40,
  },
  imageProfile: {
    alignSelf: 'center',
    width: 200,
    height: 200,
    marginTop: 25,
    borderRadius: 100,
  },
};
