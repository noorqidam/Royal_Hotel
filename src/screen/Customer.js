import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  Modal,
  Dimensions,
  AsyncStorage,
  FlatList,
  KeyboardAvoidingView,
} from 'react-native';
import {
  Header,
  Body,
  Title,
  Button,
  Input,
  Item,
  Fab,
  Card,
  CardItem,
} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import ImagePicker from 'react-native-image-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import * as firebase from 'firebase';
import * as actionCustomer from './../redux/actions/actionCustomers';
import moment from 'moment';

const options = {
  title: 'Select Avatar',
  customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
  storageOptions: {
    skipBackup: true,
  },
};
var firebaseConfig = {
  apiKey: "AIzaSyDcoQ_YdWlANGbphL2uuJtMLrZL3Q8Fgj0",
  authDomain: "royalhotel-8dd3c.firebaseapp.com",
  databaseURL: "https://royalhotel-8dd3c.firebaseio.com",
  projectId: "royalhotel-8dd3c",
  storageBucket: "royalhotel-8dd3c.appspot.com",
  messagingSenderId: "647604357152",
  appId: "1:647604357152:web:3929b494105dfd1b55d445",
  measurementId: "G-W5FNFTSYG5"
};
// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const { height, width } = Dimensions.get('window');
export class Customer extends Component {
  state = {
    search: '',
    id: '',
    name: '',
    identity_number: '',
    phone_number: '',
    image: '',
    isEmpName: true,
    isEmpIdCard: true,
    isEmpPhoneNum: true,
    modalAdd: false,
    modalEdit: false,
    avatarSource: '',
    spinner: false,
    spinnerImage: false,
  };
  async uploadImageAsync(uri) {
    this.setState({ spinner: true });
    // Why are we using XMLHttpRequest? See:
    // https://github.com/expo/expo/issues/2402#issuecomment-443726662
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });
    const ref = firebase
      .storage()
      .ref()
      .child(moment().toISOString());
    const snapshot = await ref.put(blob);
    // We're done with the blob, close and release it
    blob.close();
    this.setState({ avatarSource: await snapshot.ref.getDownloadURL() });
    this.setState({ spinner: false });
    return await snapshot.ref.getDownloadURL();
  }

  imagePicker() {
    ImagePicker.showImagePicker(options, response => {
      console.log('Success');
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri };
        this.setState({
          avatarSource: source.uri,
        });
        this.uploadImageAsync(this.state.avatarSource);
      }
    });
  }
  listFavoriteAll(item) {
    return (
      <View key={item.id}>
        <Card>
          <CardItem
            style={styles.listCardCustomer}
            button
            onPress={() => this.showEdit(item)}>
            <View>
              <Image source={{ uri: item.image }} style={styles.sizeImage} />
            </View>
            <View>
              <Text style={styles.txtdataCustomer}>
                {'Name                   : '}
                {item.name}
              </Text>
              <Text style={styles.txtdataCustomer}>
                {'Identity Number  : '}
                {item.identity_number}
              </Text>
              <Text style={styles.txtdataCustomer}>
                {'Phone Number    : '}
                {item.phone_number}
              </Text>
            </View>
          </CardItem>
        </Card>
      </View>
    );
  }

  checkName(input) {
    if (input === '') {
      this.setState({ isEmpName: true });
    } else {
      this.setState({ isEmpName: false });
    }
    this.setState({ name: input });
  }

  checkIdCard(input) {
    if (input === '') {
      this.setState({ isEmpIdCard: true });
    } else {
      this.setState({ isEmpIdCard: false });
    }
    this.setState({ identity_number: input });
  }

  checkPhoneNum(input) {
    if (input === '') {
      this.setState({ isEmpPhoneNum: true });
    } else {
      this.setState({ isEmpPhoneNum: false });
    }
    this.setState({ phone_number: input });
  }

  check(name, idCard, phoneNum) {
    if (name === false && idCard === false && phoneNum === false) {
      return false;
    } else {
      return true;
    }
  }

  showEdit(item) {
    this.setState({
      id: item.id,
      name: item.name,
      identity_number: item.identity_number,
      phone_number: item.phone_number,
      image: item.image,
      avatarSource: item.image,
      modalEdit: true,
      isEmpName: false,
      isEmpIdCard: false,
      isEmpPhoneNum: false,
    });
  }

  editCustomer() {
    setTimeout(async () => {
      this.setState({ spinner: true });
      const {
        id,
        name,
        identity_number,
        phone_number,
        avatarSource,
      } = this.state;
      const tok = await AsyncStorage.getItem('token');
      await this.props.handleEditCustomer(
        tok,
        id,
        name,
        identity_number,
        phone_number,
        avatarSource,
      );
      this.getData();
      this.setState({ modalEdit: false, avatarSource: '', spinner: false });
    }, 1500);
  }

  deleteCustomer = async () => {
    const tok = await AsyncStorage.getItem('token');
    const customer = this.state.id;
    await this.props.handleDeleteCustomer(tok, customer)
    this.getData();
    this.setState({ modalEdit: false, spinner: false });
  }

  addCustomer() {
    setTimeout(async () => {
      this.setState({ spinner: true });
      const { name, identity_number, phone_number, avatarSource } = this.state;
      const tok = await AsyncStorage.getItem('token');
      await this.props.handleAddCustomer(
        tok,
        name,
        identity_number,
        phone_number,
        avatarSource,
      );
      this.getData();
      this.setState({ modalAdd: false, avatarSource: '', spinner: false });
    }, 1500);
  }

  getData = async () => {
    const tok = await AsyncStorage.getItem('token');
    await this.props.handleGetCustomer(tok);
  };

  handleSearch(item) {
    this.setState({ search: item.toLowerCase() });
  }

  render() {
    console.disableYellowBox = true;
    const { cust } = this.props.custLocal;
    const { name, identity_number, phone_number, image } = this.state;
    return (
      <View style={styles.mainView}>
        <Header style={styles.header}>
          <Title style={styles.titleHeader}> Customers </Title>
        </Header>
        <View style={{ flex: 1, marginHorizontal: 7 }}>
          <View style={styles.txtInput}>
            <Input
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="Search Your Customer ..."
              onChangeText={item => this.handleSearch(item)}
            />
            <TouchableOpacity>
              <Icon name="search" size={30} style={styles.search} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={cust.filter(item =>
              item.name.toLowerCase().includes(this.state.search),
            )}
            renderItem={({ item }) => this.listFavoriteAll(item)}
            keyExtractor={item => item.title}
          />
        </View>
        <View style={{ position: 'relative' }}>
          <Fab
            onPress={() => this.setState({ modalAdd: true })}
            active="true"
            style={styles.fab}
            position="bottomRight">
            <Icon style={styles.fabIcon} name="plus" />
          </Fab>
        </View>

        {/* Modal that is used to Add a New Room */}
        <Modal
          visible={this.state.modalAdd}
          transparent={true}
          animationType={'fade'}>
          <KeyboardAvoidingView style={styles.dimBg} behavior="padding" enabled>
            <View style={styles.modalBg}>
              <View style={styles.subViewTitle}>
                <Text style={styles.titleView}> Add Customer </Text>
              </View>
              <View style={styles.subViewInput}>
                <Text style={styles.modalItem}> Name : *</Text>
                <Item>
                  <Input
                    onChangeText={input => this.checkName(input)}
                    style={styles.inputStyle}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    placeholder="Input Customer Name"
                  />
                </Item>
                <Text style={styles.modalItem}> Identity number : *</Text>
                <Item>
                  <Input
                    onChangeText={input => this.checkIdCard(input)}
                    style={styles.inputStyle}
                    autoCapitalize="none"
                    keyboardType="number-pad"
                    placeholder="Input Customer Identity Number"
                  />
                </Item>
                <Text style={styles.modalItem}> Phone Number : *</Text>
                <Item>
                  <Input
                    onChangeText={input => this.checkPhoneNum(input)}
                    style={styles.inputStyle}
                    autoCapitalize="none"
                    keyboardType="phone-pad"
                    placeholder="Input Customer Phone Number"
                  />
                </Item>
                <TouchableOpacity onPress={() => this.imagePicker()}>
                  {this.state.avatarSource === '' ? (
                    <Image
                      style={styles.imageProfile}
                      source={{
                        uri:
                          'https://www.gkipeterongan.org/wp-content/uploads/2019/01/user_circle_1048392.png',
                      }}
                    />
                  ) : (
                      <Image
                        source={{ uri: this.state.avatarSource }}
                        style={styles.imageProfile}
                      />
                    )}
                  <Icon name="camera-retro" style={styles.iconCamera} />
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                  <Button
                    rounded
                    style={styles.buttonX}
                    onPress={() =>
                      this.setState({
                        modalAdd: false,
                        name: '',
                        id: '',
                        identity_number: '',
                        phone_number: '',
                        isEmpName: true,
                        isEmpIdCard: true,
                        isEmpPhoneNum: true,
                        avatarSource: '',
                      })
                    }
                    disabled={false}>
                    <Text style={styles.buttonTextX}> Cancel </Text>
                  </Button>
                  <Button
                    rounded
                    style={styles.buttonY}
                    onPress={() => this.addCustomer()}
                    disabled={this.check(
                      this.state.isEmpName,
                      this.state.isEmpIdCard,
                      this.state.isEmpPhoneNum,
                    )}>
                    <Text style={styles.buttonTextY}> Add </Text>
                  </Button>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>

        {/* Modal that use to Edit an existing room */}
        <Modal
          visible={this.state.modalEdit}
          transparent={true}
          animationType={'fade'}>
          <KeyboardAvoidingView style={styles.dimBg} behavior="padding" enabled>
            <View style={styles.modalBg}>
              <View style={styles.subViewTitle}>
                <Text style={styles.titleView}> Update Customer </Text>
                <Icon name='trash-o' style={styles.iconDelete} onPress={() => this.deleteCustomer()} />
              </View>
              <View style={styles.subViewInput}>
                <Text style={styles.modalItem}> Name : *</Text>
                <Item>
                  <Input
                    onChangeText={input => this.checkName(input)}
                    value={name}
                    style={styles.inputStyle}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    placeholder="Input Customer Name"
                  />
                </Item>
                <Text style={styles.modalItem}> Identity number : *</Text>
                <Item>
                  <Input
                    onChangeText={input => this.checkIdCard(input)}
                    value={identity_number}
                    style={styles.inputStyle}
                    autoCapitalize="none"
                    keyboardType="phone-pad"
                    placeholder="Input Customer Identity Number"
                  />
                </Item>
                <Text style={styles.modalItem}> Phone Number : *</Text>
                <Item>
                  <Input
                    onChangeText={input => this.checkPhoneNum(input)}
                    value={phone_number}
                    style={styles.inputStyle}
                    autoCapitalize="none"
                    keyboardType="number-pad"
                    placeholder="Input Customer Phone Number"
                  />
                </Item>
                <TouchableOpacity onPress={() => this.imagePicker()}>
                  {this.state.avatarSource === '' ? (
                    <Image
                      style={styles.imageProfile}
                      source={{
                        uri: image,
                      }}
                    />
                  ) : (
                      <Image
                        source={{ uri: this.state.avatarSource }}
                        style={styles.imageProfile}
                      />
                    )}
                  <Icon name="camera-retro" style={styles.iconCamera} />
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                  <Button
                    style={styles.buttonX}
                    onPress={() =>
                      this.setState({
                        modalEdit: false,
                        name: '',
                        id: '',
                        identity_number: '',
                        phone_number: '',
                        isEmpName: true,
                        isEmpIdCard: true,
                        isEmpPhoneNum: true,
                        avatarSource: '',
                      })
                    }
                    disabled={false}>
                    <Text style={styles.buttonTextX}> Cancel </Text>
                  </Button>
                  <Button
                    style={styles.buttonY}
                    onPress={() => this.editCustomer()}
                    disabled={this.check(
                      this.state.isEmpName,
                      this.state.isEmpIdCard,
                      this.state.isEmpPhoneNum,
                    )}>
                    <Text style={styles.buttonTextY}> Edit </Text>
                  </Button>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
        <View style={styles.container}>
          <Spinner
            visible={this.state.spinner}
            textContent={'Loading...'}
            textStyle={styles.spinnerTextStyle}
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    custLocal: state.cust,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    handleGetCustomer: tok => dispatch(actionCustomer.handleGetCust(tok)),
    handleAddCustomer: (tok, name, idCard, phoNum, image) => dispatch(actionCustomer.handleAddCust(tok, name, idCard, phoNum, image)),
    handleEditCustomer: (tok, id, name, idCard, PhoNum, image) => dispatch(actionCustomer.handleUpdateCust(tok, id, name, idCard, PhoNum, image)),
    handleDeleteCustomer: (tok, id) => dispatch(actionCustomer.handleDeleteCust(tok, id))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Customer);

const styles = StyleSheet.create({
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
  modalItem: {
    fontSize: 20
  },
  spinnerTextStyle: {
    color: '#FFF',
  },
  txtInput: {
    flexDirection: 'row',
    borderColor: '#2f3542',
    borderWidth: 3,
    height: 60,
    borderRadius: 5,
    marginVertical: 10
  },
  search: {
    marginRight: 10,
    marginVertical: 10,
  },
  sizeImage: {
    height: 70,
    width: 70,
    borderWidth: 1,
    borderColor: '#f1f2f6',
    marginRight: 10,
    borderRadius: 70 / 2,
  },
  listCardCustomer: {
    backgroundColor: '#3d3d3d',
    borderRadius: 5
  },
  txtdataCustomer: {
    fontSize: 14,
    marginRight: 30,
    color: '#fff',
  },
  iconCamera: {
    marginLeft: 80,
    marginTop: -30,
    fontSize: 30,
    color: 'black',
    alignSelf: 'center',
  },
  imageProfile: {
    borderWidth: 2,
    borderColor: 'silver',
    alignSelf: 'center',
    width: 100,
    height: 100,
    marginTop: 25,
    borderRadius: 100 / 2,
  },
  fab: {
    backgroundColor: '#3d3d3d',
    width: 70,
    height: 70,
    borderRadius: 100,
    position: 'absolute',
  },
  fabIcon: {
    fontSize: 30,
    color: 'white',
  },
  mainView: {
    backgroundColor: '#dfe4ea',
    flex: 1,
  },
  buttonX: {
    justifyContent: 'center',
    width: 150,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#d63031',
    marginHorizontal: 10,
    marginVertical: 30
  },
  buttonY: {
    justifyContent: 'center',
    marginBottom: 100,
    width: 150,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#686de0',
    marginHorizontal: 10,
    marginVertical: 30
  },
  buttonTextX: {
    fontSize: 30,
    color: '#ffffff',
  },
  buttonTextY: {
    fontSize: 30,
    color: '#ffffff',
  },
  modalBg: {
    backgroundColor: 'white',
    alignSelf: 'center',
    width: width * 0.9,
    height: height * 0.7,
    borderRadius: 15,
    position: 'relative',
  },
  subViewInput: {
    marginVertical: 10,
    marginHorizontal: 25,
    justifyContent: 'center',
  },
  subViewTitle: {
    backgroundColor: '#d63031',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  titleView: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  iconDelete: {
    marginRight: 20,
    fontSize: 30,
    color: '#fff'
  },
  inputStyle: {
    borderWidth: 2,
    borderRadius: 5,
    borderColor: 'black',
    height: height * 0.06,
    width: width * 0.77
  },
  dimBg: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    height,
    width,
    justifyContent: 'center',
  },
});
