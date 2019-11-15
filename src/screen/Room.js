import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Modal,
  Dimensions,
  AsyncStorage,
  FlatList,
  KeyboardAvoidingView,
} from 'react-native';
import { Header, Body, Title, Button, Input, Item } from 'native-base';

import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as actionRoom from './../redux/actions/actionRooms';
import * as actionCheckin from './../redux/actions/actionOrders';

const { height, width } = Dimensions.get('window');
class Room extends Component {
  state = {
    id: '',
    name: '',
    modalAdd: false,
    modalEdit: false,
    isEmpty: true,
    state: false,
    spinner: false,
  };
  // async componentDidMount() {
  //   const tok = await AsyncStorage.getItem('token');
  //   await this.props.handleGetRooms(tok);
  // }

  listAll(item) {
    return (
      <View style={styles.allList} key={item.id}>
        <TouchableOpacity
          style={styles.allList2}
          onPress={() => this.showEdit(item)}>
          <Text style={styles.txtdataRoom}> {item.name} </Text>
        </TouchableOpacity>
      </View>
    );
  }

  checkInput(input) {
    if (input === '') {
      this.setState({ isEmpty: true });
    } else {
      this.setState({ isEmpty: false, name: input });
    }
    this.setState({ name: input });
  }

  async showEdit(item) {
    this.setState({
      id: item.id,
      name: item.name,
      modalEdit: true,
      isEmpty: true,
    });
  }

  editRoom() {
    setTimeout(async () => {
      this.setState({ spinner: true });
      const id = this.state.id;
      const name = this.state.name;
      const tok = await AsyncStorage.getItem('token');
      await this.props.handleEditRoom(tok, name, id);
      this.getData();
      this.setState({ modalEdit: false, spinner: false });
    }, 1500);
  }

  async DeleteRoom() {
    const tok = await AsyncStorage.getItem('token');
    const room = this.state.id;
    await this.props.handleDeleteRoom(tok, room)
    this.getData();
    this.setState({ modalEdit: false, spinner: false });
  }

  async addRoom() {
    setTimeout(async () => {
      this.setState({ spinner: true });
      const name = this.state.name;
      const tok = await AsyncStorage.getItem('token');
      await this.props.handleAddRoom(tok, name);
      this.getData();
      this.setState({ modalAdd: false, spinner: false });
    }, 1500);
  }

  getData = async () => {
    const tok = await AsyncStorage.getItem('token');
    await this.props.handleGetRooms(tok);
    await this.props.handleGetCheckin(tok);
  };

  render() {
    console.disableYellowBox = true;
    const { rooms } = this.props.roomsLocal;
    const { name } = this.state;
    return (
      <View style={styles.mainView}>
        <Spinner
          visible={this.state.spinner}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />
        <View>
          <Header style={styles.header}>
            <Title style={styles.titleHeader}> Room </Title>
          </Header>
        </View>
        <FlatList
          numColumns={3}
          data={rooms}
          renderItem={({ item }) => this.listAll(item)}
          keyExtractor={item => item.title}
        />
        <View>
          <TouchableOpacity
            style={styles.btnPlus}
            onPress={() => this.setState({ modalAdd: true, isEmpty: true })}>
            <Icon name="plus" size={40} color={'#fff'} />
          </TouchableOpacity>
        </View>

        {/* Modal that is used to Add a New Room */}
        <Modal
          visible={this.state.modalAdd}
          transparent={true}
          animationType={'fade'}>
          <KeyboardAvoidingView style={styles.dimBg} behavior="padding" enabled>
            <View style={styles.modalBg}>
              <View style={styles.subViewTitle}>
                <Text style={styles.titleView}> Add Room </Text>
              </View>
              <View style={styles.subViewInput}>
                <View>
                  <Text style={styles.modalItem}> Room Name : *</Text>
                  <Item>
                    <Input
                      onChangeText={input => this.checkInput(input)}
                      style={styles.inputStyle}
                      autoCapitalize="none"
                      keyboardType="email-address"
                      placeholder="Input Room Name"
                    />
                  </Item>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                  <Button
                    style={styles.buttonX}
                    onPress={() =>
                      this.setState({ modalAdd: false, name: '', id: '' })
                    }
                    disabled={false}>
                    <Text style={styles.buttonTextX}> Cancel </Text>
                  </Button>
                  <Button
                    style={styles.buttonY}
                    onPress={() => this.addRoom()}
                    disabled={this.state.isEmpty}>
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
                <Text style={styles.titleView}> Edit Room </Text>
                <Icon name='trash-o' style={styles.iconDelete} onPress={() => this.DeleteRoom()} />
              </View>
              <View style={styles.subViewInput}>
                <Text style={styles.modalItem}> Room Name : *</Text>
                <Item>
                  <Input
                    onChangeText={input => this.checkInput(input)}
                    value={name}
                    style={styles.inputStyle}
                    autoCapitalize="none"
                    keyboardType="name-phone-pad"
                  />
                </Item>
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                  <Button
                    style={styles.buttonX}
                    onPress={() =>
                      this.setState({ modalEdit: false, name: '', id: '' })
                    }
                    disabled={false}>
                    <Text style={styles.buttonTextX}> Cancel </Text>
                  </Button>
                  <Button
                    rounded
                    style={styles.buttonY}
                    onPress={() => this.editRoom()}
                    disabled={this.state.isEmpty}>
                    <Text style={styles.buttonTextY}> Edit </Text>
                  </Button>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    roomsLocal: state.rooms,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    handleEditRoom: (tok, name, id) => dispatch(actionRoom.handleUpdateRooms(tok, name, id)),
    handleAddRoom: (tok, name) => dispatch(actionRoom.handleAddRooms(tok, name)),
    handleGetRooms: tok => dispatch(actionRoom.handleGetRooms(tok)),
    handleGetCheckin: tok => dispatch(actionCheckin.handleGetCheckins(tok)),
    handleDeleteRoom: (tok, id) => dispatch(actionRoom.handleDeleteRooms(tok, id))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Room);

const styles = StyleSheet.create({
  buttonX: {
    justifyContent: 'center',
    width: 150,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#d63031',
    marginHorizontal: 10,
    marginVertical: 40
  },
  buttonY: {
    justifyContent: 'center',
    marginBottom: 100,
    width: 150,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#686de0',
    marginHorizontal: 10,
    marginVertical: 40
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
    height: height * 0.4,
    borderRadius: 15,
    position: 'relative',
  },
  btnPlus: {
    marginHorizontal: 20,
    backgroundColor: '#3d3d3d',
    borderColor: '#211717',
    borderWidth: 3,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    marginVertical: 15,
  },
  txtdataRoom: {
    color: '#ecf0f1',
    alignSelf: 'center',
    fontSize: 45,
  },
  allList: {
    marginVertical: 10,
    width: 130,
    height: 130,
    borderColor: '#57606f',
    borderWidth: 3,
    borderRadius: 8,
    marginHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#cc8e35',
  },
  allList2: {
    backgroundColor: '#f6c89f',
    marginHorizontal: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
  },
  mainView: {
    backgroundColor: '#dfe4ea',
    flex: 1,
  },
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
  subViewInput: {
    marginTop: 10,
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
    fontSize: 40,
    fontWeight: 'bold',
    color: '#ffffff'
  },
  iconDelete: {
    marginRight: 20,
    fontSize: 30,
    color: '#fff'
  },
  modalItem: {
    fontSize: 20
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
