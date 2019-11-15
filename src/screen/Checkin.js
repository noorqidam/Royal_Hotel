import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  Modal,
  AsyncStorage,
  Picker,
  FlatList,
  KeyboardAvoidingView,
} from 'react-native';
import { Button, Header, Body, Title, Item, Input } from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';
import moment from 'moment';
import * as actionCheckin from './../redux/actions/actionOrders';
import { connect } from 'react-redux';

const { height, width } = Dimensions.get('window');
class Checkin extends Component {
  state = {
    roomId: '',
    room: '',
    orderId: '',
    customerId: '',
    customer: '',
    duration: '',
    orderEndTime: '',
    isEmpCust: true,
    isEmpDur: true,
    modalCheckIn: false,
    modalCheckOut: false,
    time: '',
  };

  componentWillMount() {
    this.getCurrentTime();
    this.getData();
  }

  getCurrentTime = () => {
    this.setState({
      time: moment().format('dddd, MMMM Do YYYY, h:mm:ss a'),
    });
  };

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  componentDidMount() {
    this.timer = setInterval(() => {
      this.getCurrentTime();
      this.autoCheckOut();
    }, 1000);
  }
  async autoCheckOut() {
    const data = this.props.checkinLocal.checkins;
    const loading = this.props.checkinLocal.isLoading;
    await data.map(async item => {
      item.order.length > 0
        ? moment(item.order[0].order_end_time).diff(moment(), 's') <= 0
          ? loading === false
            ? await (this.setState({ orderId: item.order[0].id }),
              this.checkout())
            : null
          : null
        : null;
    });
  }

  listAll(item) {
    return (
      <View key={item.id}>
        <TouchableOpacity
          style={item.order.length > 0 ? styles.allList2 : styles.allList}
          onPress={() => {
            if (item.order.length > 0) {
              return this.modalCheckOut(item);
            } else {
              return this.modalCheckIn(item);
            }
          }}>
          <Text
            style={item.order.length > 0 ? styles.allRoom2 : styles.allRoom}>
            {' '}
            {item.name}{' '}
          </Text>
          <Text
            style={item.order.length > 0 ? styles.duration2 : styles.duration}>
            {item.order.length > 0
              ?
              (moment(item.order[0].order_end_time).diff(moment(), 'minutes') % 60) + ' : ' +
              (moment(item.order[0].order_end_time).diff(moment(), 'seconds') % 60) : 'available'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  modalCheckIn(item) {
    this.setState({ modalCheckIn: true, room: item.name, roomId: item.id });
  }

  modalCheckOut(item) {
    this.setState({
      modalCheckOut: true,
      roomId: item.id,
      room: item.name,
      orderId: item.order[0].id,
      customerId: item.order[0].customerId.id,
      customer: item.order[0].customerId.name,
      duration: item.order[0].duration,
      orderEndTime: item.order[0].order_end_time,
    });
  }

  checkCustomer(input) {
    if (input === '') {
      this.setState({ isEmpCust: true });
    } else {
      this.setState({ isEmpCust: false });
    }
    this.setState({ customerId: input });
  }

  checkDuration(input) {
    this.setState({
      duration: Number(input),
      orderEndTime: moment()
        .add(Number(input), 'm')
        .toJSON(),
    });
    let reg = /^[0-9]*$/;
    if (reg.test(input) && input !== '') {
      this.setState({ isEmpDur: false });
    } else {
      this.setState({ isEmpDur: true });
    }
  }

  check(cust, duration) {
    if (cust === false && duration === false) {
      return false;
    } else {
      return true;
    }
  }

  async checkin() {
    this.setState({ spinner: true });
    const { roomId, customerId, duration, orderEndTime } = this.state;
    const tok = await AsyncStorage.getItem('token');
    await this.props.handleCheckIn(
      tok,
      duration,
      orderEndTime,
      customerId,
      roomId,
    );
    await this.getData();
    this.setState({
      modalCheckIn: false,
      spinner: false,
      isEmpDur: true,
      customerId: '',
    });
  }

  async checkout() {
    this.setState({ spinner: true });
    const { orderId } = this.state;
    const tok = await AsyncStorage.getItem('token');
    await this.props.handleCheckOut(tok, orderId);
    await this.getData();
    this.setState({
      modalCheckOut: false,
      spinner: false,
      duration: '',
      customerId: '',
    });
  }

  getData = async () => {
    const tok = await AsyncStorage.getItem('token');
    await this.props.handleGetCheckin(tok);
  };

  render() {
    console.disableYellowBox = true;
    const { checkins } = this.props.checkinLocal;
    const { id, room, customer, duration, time } = this.state;
    const { cust } = this.props.custLocal;

    return (
      <View style={styles.mainView}>
        <Spinner
          visible={this.state.spinner}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />
        <Header style={styles.header}>
          <Title style={styles.titleHeader}> Checkin </Title>
        </Header>
        <FlatList
          numColumns={3}
          data={checkins}
          renderItem={({ item }) => this.listAll(item)}
          keyExtractor={item => item.title}
        />

        {/* Modal that is used to CheckIn */}
        <Modal
          visible={this.state.modalCheckIn}
          transparent={true}
          animationType={'fade'}>
          <KeyboardAvoidingView style={styles.dimBg} behavior="padding" enabled>
            <View style={styles.modalBg}>
              <View style={styles.subViewTitle}>
                <Text style={styles.titleView}> CheckIn </Text>
              </View>
              <View style={styles.subViewInput}>
                <Text style={styles.txtItem}> Room :</Text>
                <Item>
                  <Input
                    style={styles.inputStyle}
                    autoCapitalize="none"
                    disabled
                    value={room}
                  />
                </Item>
                <Text style={styles.txtItem}> Customer : *</Text>
                <Item>
                  <View style={styles.inputStyle}>
                    <Picker
                      selectedValue={this.state.customerId}
                      mode={'dropdown'}
                      style={styles.inputStyle}
                      onValueChange={item => this.checkCustomer(item)}>
                      {cust.map((item, index) => {
                        return (
                          <Picker.Item
                            label={item.name}
                            value={item.id}
                            key={index}
                          />
                        );
                      })}
                    </Picker>
                  </View>
                </Item>
                <Text style={styles.txtItem}> Duration : *</Text>
                <Item>
                  <Input
                    onChangeText={input => this.checkDuration(input)}
                    style={styles.inputStyle}
                    autoCapitalize="none"
                    keyboardType="number-pad"
                    placeholder="... in Minute"
                  />
                </Item>
                <View style={styles.viewModalButt}>
                  <Button
                    style={styles.buttonX}
                    onPress={() =>
                      this.setState({
                        modalCheckIn: false,
                        customer: '',
                        duration: '',
                        isEmpDur: false,
                      })
                    }>
                    <Text style={styles.buttonTextX}> Cancel </Text>
                  </Button>
                  <Button
                    style={styles.buttonY}
                    onPress={() => this.checkin()}
                    disabled={this.check(
                      this.state.isEmpCust,
                      this.state.isEmpDur,
                    )}>
                    <Text style={styles.buttonTextY}> CheckIn </Text>
                  </Button>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>

        {/* Modal that use to CheckOut */}
        <Modal
          visible={this.state.modalCheckOut}
          transparent={true}
          animationType={'fade'}>
          <KeyboardAvoidingView style={styles.dimBg} behavior="padding" enabled>
            <View style={styles.modalBg}>
              <View style={styles.subViewTitle}>
                <Text style={styles.titleView}> CheckOut </Text>
              </View>
              <View style={styles.subViewInput}>
                <Text style={styles.txtItem}> Room : *</Text>
                <Item>
                  <Input
                    value={room}
                    style={styles.inputStyle}
                    autoCapitalize="none"
                    disabled
                  />
                </Item>
                <Text style={styles.txtItem}> Customer :*</Text>
                <Item>
                  <View style={styles.inputStyle}>
                    <Picker
                      enabled={false}
                      selectedValue={this.state.customer}
                      style={styles.inputStyle}
                      onValueChange={(itemValue, itemIndex) =>
                        this.setState({ customerId: itemValue })
                      }>
                      <Picker.Item label={customer} value={id} fontSize={30} />
                    </Picker>
                  </View>
                </Item>
                <Text style={styles.txtItem}> Duration :*</Text>
                <Item>
                  <Input
                    value={`${duration}`}
                    style={styles.inputStyle}
                    autoCapitalize="none"
                    disabled
                  />
                </Item>
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                  <Button
                    style={styles.buttonX}
                    onPress={() =>
                      this.setState({ modalCheckOut: false, name: '', id: '' })
                    }>
                    <Text style={styles.buttonTextX}> Cancel </Text>
                  </Button>
                  <Button
                    style={styles.buttonY}
                    onPress={() => this.checkout()}>
                    <Text style={styles.buttonTextY}> CheckOut </Text>
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
    checkinLocal: state.checkins,
    custLocal: state.cust,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    handleCheckIn: (tok, duration, orderEndTime, customerId, roomId) =>
      dispatch(
        actionCheckin.handleCheckIn(
          tok,
          duration,
          orderEndTime,
          customerId,
          roomId,
        ),
      ),
    handleCheckOut: (token, id) =>
      dispatch(actionCheckin.handleCheckOut(token, id)),
    handleGetCheckin: tok => dispatch(actionCheckin.handleGetCheckins(tok)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Checkin);

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
  duration: {
    color: 'white',
    marginBottom: 5,
    fontSize: 25,
  },
  duration2: {
    color: 'black',
    textAlign: 'center',
    marginBottom: 5,
    fontSize: 25,
  },
  allRoom: {
    marginVertical: 1,
    borderRadius: 5,
    fontSize: 32,
    color: 'white',
  },
  allRoom2: {
    marginVertical: 1,
    borderRadius: 5,
    fontSize: 32,
    color: 'black',
  },
  favoriteToon: {
    height: 200,
    width: 170,
    borderWidth: 3,
    borderColor: 'silver',
    marginRight: 10,
    borderRadius: 5,
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
    backgroundColor: '#44bd32',
  },
  allList2: {
    marginVertical: 10,
    width: 130,
    height: 130,
    borderColor: 'black',
    borderWidth: 3,
    borderRadius: 8,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'gray',
  },
  mainView: {
    backgroundColor: '#dfe4ea',
    flex: 1,
  },
  txtItem: {
    fontSize: 20
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
    width: 160,
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
    alignSelf: 'center',
    justifyContent: 'center'
  },
  modalBg: {
    backgroundColor: 'white',
    alignSelf: 'center',
    width: width * 0.9,
    height: height * 0.58,
    borderRadius: 15,
    position: 'relative',
  },
  subViewInput: {
    marginTop: 10,
    marginHorizontal: 25,
    justifyContent: 'center',
  },
  subViewTitle: {
    backgroundColor: '#d63031',
    alignItems: 'center'
  },
  titleView: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#ffffff'
  },
  inputStyle: {
    borderWidth: 2,
    borderRadius: 5,
    borderColor: 'black',
    height: height * 0.06,
    width: width * 0.77
  },
  dimBg: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    height,
    width,
    justifyContent: 'center',
  },
  viewModalButt: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
  },
});
