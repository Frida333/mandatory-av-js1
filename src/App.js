import React from 'react';
import './App.css';
import Chat from "./chat";
import Login from "./login";

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      login: false,
      name: "",
    };
    this.onSubmit= this.onSubmit.bind(this);
    this.logOut= this.logOut.bind(this);
  }
  onSubmit(name){
    this.setState({
      login: true,
      name: name,
    });
  }
  logOut(){
    this.setState({
      login:false,
    });
  }
  render(){
    return(
      <div>
      {
        this.state.login?<Chat name={this.state.name} logOut={this.logOut}/>:<Login onSubmit={this.onSubmit}/>
      }
      </div>
    );
  }
}

export default App;
