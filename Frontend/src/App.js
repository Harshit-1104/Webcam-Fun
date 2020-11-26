import React, { Component } from 'react';
import Auth from './components/AuthComponent';
import Main from './components/mainComponent';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';

class App extends Component {
  constructor() {
    super();

    this.state = {
      isLoggedIn: false,
      user: null
    }

    this.toggleLogin = this.toggleLogin.bind(this);
  }

  toggleLogin(user) {
    this.setState({
      isLoggedIn: true,
      user: user
    })

    console.log(this.state.user);
  }

  logout() {
    this.setState({
      isLoggedIn: false,
      user: null
    })
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          <Switch>
            <Route exact path='/'>
              {!this.state.isLoggedIn ? <Redirect to="/auth" /> : <Redirect to ="/webcam" />}
            </Route>
            <Route path="/auth" component={() => <Auth toggleLogin={this.toggleLogin} isLoggedIn={this.state.isLoggedIn}/>}/>
            <Route path="/webcam" component={() => <Main user={this.state.user} logout={this.logout}/>}/>
            <Redirect to="/auth" />
          </Switch>
          <audio hidden className="snap"><source src="../public/assets/audio/snap.mp3" type="audio/mp3" /></audio>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
