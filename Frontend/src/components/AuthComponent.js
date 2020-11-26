import React, { Component } from 'react';
import { Button, Modal, ModalHeader, Form, ModalBody, Label, Input
            , FormGroup } from 'reactstrap';
import fetch from 'cross-fetch';
import { baseUrl } from '../shared/baseUrl';
import { Redirect } from 'react-router-dom';

String.prototype.splice = function(idx, rem, str) {
  return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem))
};

class Auth extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoginOpen: false,
      isRegistrarOpen: false,
      isWarningOpen: false,
      localStorageInitialized: false,
      warning: {
        head: '',
        message: ''
      }
    };

    this.toggleLoginModal = this.toggleLoginModal.bind(this);
    this.toggleRegisterModal = this.toggleRegisterModal.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleRegistrar = this.handleRegistrar.bind(this);
    this.LoginModal = this.LoginModal.bind(this);
    this.RegistrarModal = this.RegistrarModal.bind(this);
    this.UsersList = this.UsersList.bind(this);
    this.checkJWT = this.checkJWT.bind(this);
    this.toggleWarningModal = this.toggleWarningModal.bind(this);
    this.WarningModal = this.WarningModal.bind(this);
    this.toggleLocalStorage = this.toggleLocalStorage.bind(this);
    this.beMyGuest = this.beMyGuest.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  toggleLoginModal() {
    this.setState({
      isLoginOpen: !this.state.isLoginOpen
    })
  }

  toggleRegisterModal() {
    this.setState({
      isRegistrarOpen: !this.state.isRegistrarOpen
    })
  }

  toggleWarningModal() {
    this.setState({
      isWarningOpen: !this.state.isWarningOpen
    })
  }

  toggleLocalStorage() {

    if (!this.state.localStorageInitialized && window.localStorage.webcam.length === 0) 
      window.localStorage.setItem('webcam', "{}");

    this.setState({
      localStorageInitialized: true
    })
  }

  handleLogin(event) {
    this.toggleLoginModal(); // close the modal
    
    const user = {
      username: this.username.value,
      password: this.password.value
    }
    
    console.log(user);
    
    fetch(baseUrl + 'users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user),
      credentials: 'same-origin',
      mode: 'cors'
    })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        const user_ = {
          'username': user.username,
          'token': data.token,
          'guest': false
        }

        const rememberUser = { 
          [user.username] : data.token
        }

        const localData = window.localStorage.getItem('webcam');
        const len = JSON.stringify(rememberUser).length;
        const addendum = localData.length === 2 ? (JSON.stringify(rememberUser).slice(1, len-1)) : (',' + JSON.stringify(rememberUser).slice(1, len-1))
        const tmp = localData.splice(localData.length-1, 0, addendum);
        window.localStorage.setItem(`webcam`, tmp);

        this.props.toggleLogin(user_);
      }
    })
    .catch((err) => console.log(err))

    event.preventDefault();
  }
  
  handleRegistrar(event) {
    this.toggleRegisterModal(); // close the modal
    
    const user = {
      username: this.username.value,
      password: this.password.value
    }
    
    console.log(user);
    
    fetch(baseUrl + 'users/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user),
      credentials: 'same-origin',
      mode: 'cors'
    })
    .then((res) => res.json())
    .then((data) => console.log(data))
    .catch((err) => console.log(err))

    event.preventDefault();
  }

  checkJWT(username, token) {

    fetch(baseUrl+'users/checkJWTToken', {
      method: 'GET',
      headers: {
        'Authorization': `bearer ${token}`
      },
      credentials: 'same-origin',
      mode: 'cors'
    })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);

      if (data.success) {
        const user = {
          'username': username,
          'token': token,
          'guest': false
        }

        this.props.toggleLogin(user);
      } else {

        const warning = {
          head: 'Login error',
          message: 'Your token is not valid now. Please login again by using your ceredentials'
        }
        this.setState({
          warning: warning
        }, () => {
          this.toggleWarningModal();
        })
      }
    })
  }

  UsersList() {
    let list = JSON.parse(window.localStorage.webcam);
    let tmp;

    tmp = Object.keys(list).map((key, index) => {
      return(
        <Button onClick={() => {this.checkJWT(key, list[key])}} key={index}>{key}</Button>
      )
    })

    return (tmp);
  }

  LoginModal() {
    return(
      <React.Fragment>
        <Modal isOpen={this.state.isLoginOpen} toggle={this.toggleLoginModal}>
          <ModalHeader toggle={this.toggleLoginModal}>Login</ModalHeader>
          <ModalBody>
            <Form onSubmit = {this.handleLogin}>
              <FormGroup>
                <Label htmlFor="username">Username</Label>
                <Input type="text" id="username" name="username" 
                  innerRef={(input) => this.username = input} />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="password">Password</Label>
                <Input type="password" id="password" name="password" 
                  innerRef={(input) => this.password = input} />
              </FormGroup>
              <Button value="submit" type="submit" color="primary">Login</Button>
            </Form>
            <hr />
            <h4>Or continue as:</h4>
            <this.UsersList />
          </ModalBody>
        </Modal>
      </React.Fragment>
    );
  };

  RegistrarModal() {
    return(
      <React.Fragment>
        <Modal isOpen={this.state.isRegistrarOpen} toggle={this.toggleRegisterModal}>
          <ModalHeader toggle={this.toggleRegisterModal}>Register</ModalHeader>
          <ModalBody>
            <Form onSubmit = {this.handleRegistrar}>
              <FormGroup>
                <Label htmlFor="username">Username</Label>
                <Input type="text" id="username" name="username" 
                  innerRef={(input) => this.username = input} />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="password">Password</Label>
                <Input type="password" id="password" name="password" 
                  innerRef={(input) => this.password = input} />
              </FormGroup>
              <Button value="submit" type="submit" color="primary">Register</Button>
            </Form>
          </ModalBody>
        </Modal>
      </React.Fragment>
    );
  };

  WarningModal() {
    return (
      <React.Fragment>
        <Modal isOpen = {this.state.isWarningOpen} toggle={this.toggleWarningModal}>
          <ModalHeader toggle={this.toggleWarningModal}>{this.state.warning.head}</ModalHeader>
          <ModalBody>
            {this.state.warning.message}
          </ModalBody>
        </Modal>
      </React.Fragment>
    )
  }

  beMyGuest() {
    const user = {
      'username': 'guest',
      'token': '',
      'guest': true
    }

    this.props.toggleLogin(user);
  }

  componentDidMount() {
    if (!this.state.localStorageInitialized)
      this.toggleLocalStorage();
  }
  
  render() {  
    return(
      <div>
        <Button onClick={this.toggleLoginModal}>Login</Button>
        <Button onClick={this.toggleRegisterModal}>Register</Button>
        <Button onClick={this.beMyGuest}>Be my guest</Button>

        <this.LoginModal />
        <this.RegistrarModal />
        <this.WarningModal />

        {this.props.isLoggedIn ? <Redirect to="/" /> : <div />}
      </div>
    )
  }
}

export default Auth;