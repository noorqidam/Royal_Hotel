import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  AsyncStorage,
  ImageBackground,
  Dimensions,
  KeyboardAvoidingView,
  Image
} from 'react-native';
import { Button, Input, Item, Card } from 'native-base';
import { StackActions, NavigationActions, SafeAreaView } from 'react-navigation';
import PasswordInputText from 'react-native-hide-show-password-input';
import * as actionUsers from './../redux/actions/actionUsers';
import Spinner from 'react-native-loading-spinner-overlay';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/Octicons';
import Icon2 from 'react-native-vector-icons/AntDesign';

const { height, width } = Dimensions.get('window');
export class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      isPasswordValid: false,
      isMailValid: false,
      creative: true,
      spin: false,
    };
  }

  checkPassword(pass) {
    if (pass === '') {
      this.setState({ isPasswordValid: false });
    } else {
      this.setState({ isPasswordValid: true });
    }
    this.setState({ password: pass });
  }
  checkMail(mail) {
    this.setState({ email: mail });
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(mail)) {
      return this.setState({ isMailValid: true });
    } else {
      return this.setState({ isMailValid: false });
    }
  }
  check(mail, pass) {
    if (mail === true && pass === true) {
      return false;
    } else {
      return true;
    }
  }
  async handleLogin() {
    this.setState({ spin: true });
    const email = this.state.email;
    const password = this.state.password;
    await this.props.handleLogin(email, password);
    const users = this.props.userLocal.login;
    console.log('users files' + users);

    if (users.token) {
      await AsyncStorage.multiSet([
        ['token', users.token],
        ['userid', `${users.id}`],
        ['name', users.name],
        ['email', users.email],
        ['image', users.image],
      ]);

      this.setState({ spin: false });
      const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'loading' })],
      });
      this.props.navigation.dispatch(resetAction);
    } else {
      alert('Invalid email or password!');
      this.setState({ spin: false });
    }
  }

  render() {
    console.disableYellowBox = true;
    return (
      <ImageBackground
        style={styles.imageBackground}
        source={require('../assets/hotel.jpg')}>
        <KeyboardAvoidingView style={styles.dim} behavior="padding" enabled>
          <SafeAreaView style={styles.imgHeader}>
            <Text style={styles.title}>Login</Text>
            <Image source={require('../assets/logo.png')} style={styles.image}></Image>
            <Card style={styles.card}>

              <View style={styles.form}>
                <Item style={styles.formItem}>
                  <Icon1 name='mail' style={styles.iconMail} />
                  <Input
                    onChangeText={text => this.checkMail(text)}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    placeholder="Input your email"
                  />
                </Item>
                <Item style={styles.formItem}>
                  <Icon2 name='lock1' style={styles.iconPassword} />
                  <Input
                    placeholder="input your password"
                    secureTextEntry={this.state.creative}
                    onChangeText={password => this.checkPassword(password)}
                  />
                  <Icon
                    onPress={() =>
                      this.setState({ creative: !this.state.creative })
                    }
                    name={this.state.creative == true ? 'eye' : 'eye-slash'}
                    style={styles.iconEye}
                  />
                </Item>
              </View>
              <Button
                style={styles.button}
                onPress={() => this.handleLogin()}
                disabled={this.check(
                  this.state.isMailValid,
                  this.state.isPasswordValid,
                )}>
                <Text style={styles.txtLogin}>Login</Text>
              </Button>
            </Card>
          </SafeAreaView>
          {/* <Spinner
            visible={this.state.spin}
            textContent={'Loading...'}
            textStyle={styles.spinnerTextStyle}
          /> */}
        </KeyboardAvoidingView>
      </ImageBackground>

    );
  }
}

const mapStateToProps = state => {
  return {
    userLocal: state.login,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    handleLogin: (email, password) =>
      dispatch(actionUsers.handleLogin(email, password)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Login);

const styles = StyleSheet.create({
  title: {
    fontSize: 40,
    color: '#dfd37b',
    fontWeight: 'bold',
    alignSelf: 'center',
    marginVertical: 20
  },
  imgHeader: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  image: {
    width: 200,
    height: 200,
    alignSelf: 'center',
  },
  form: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    height: height * 0.5,
    borderRadius: 20,
    opacity: 0.7,
    marginHorizontal: 10
  },
  formItem: {
    marginBottom: 20,
    backgroundColor: '#ffffff',
    opacity: 0.7,
    borderRadius: 8,
    width: 300,
    height: 70,
  },
  card: {
    borderRadius: 20,
    width: '90%',
    height: '30%',
    marginLeft: 20,
    marginTop: 50,
  },
  imageBackground: {
    width: '100%',
    height: '100%'
  },
  dim: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    height,
    width,
    justifyContent: 'center',
  },
  iconMail: {
    fontSize: 20,
    marginLeft: 10
  },
  iconPassword: {
    fontSize: 20,
    marginLeft: 10
  },
  iconEye: {
    color: 'black',
    fontSize: 20,
    paddingHorizontal: 10
  },
  button: {
    padding: 10,
    backgroundColor: '#7ed6df',
    marginTop: -200,
    borderRadius: 8,
    alignSelf: 'center',
    justifyContent: 'center',
    width: 300,
    height: 70,
  },
  txtLogin: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
