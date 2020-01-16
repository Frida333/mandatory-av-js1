import React from 'react';
import io from "socket.io-client";
import { Helmet } from "react-helmet";
import {emojify} from "react-emojione";
import Linkify from "react-linkify";

class Chat extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      message: "",
      messages: [],
      new_message: []
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.socket = null;
    this.scrollBar = React.createRef();
    this.handleScrollbar = this.handleScrollbar.bind(this);
  }

  handleScrollbar(){
    this.scrollBar.current.scrollTo(0, this.scrollBar.current.scrollHeight);
  }

  componentDidUpdate(){
    this.handleScrollbar();
  }

  componentDidMount(){
    this.socket = io("http://3.120.96.16:3000");
    this.socket.on('messages', data => {
        this.setState({messages: data});
    });
    this.socket.on('new_message', data => {
      this.setState({messages: [...this.state.messages, data]})
    });
  }

  componentWillUnmount(){
    this.socket.off();
  }

  onChange(e){
    e.preventDefault();
    if (e.target.value.length <= 200){
      this.setState({
        message: e.target.value,
      });
    }
  }

  onSubmit(e){
    e.preventDefault();
    if (this.state.message.length === 0){
      return;
    }
    let msg =
    {id: "own-" + this.state.messages.length,
    username:this.props.name ,
    content:this.state.message
  }

  this.setState({
    messages: [...this.state.messages,
      msg], message: '',
    });

    this.socket.emit("message", {
      username: this.props.name,
      content: this.state.message,

    }, (response) => {
      console.log("Emitted", response);
    });
  }

  render(){
    return (
      <div className="chat">
      <Helmet>
      <title>Chat</title>
      </Helmet>
      <div className="list" ref={this.scrollBar}>
      <ul>
      {this.state.messages.map(data => (
        <li key={data.id}>
        {data.username}: <Linkify>{emojify(data.content)}</Linkify>
        </li>
      ))
      }
      </ul>
      </div>
      <div className ="form">
      <form>
      <textarea value={this.state.message} onChange={this.onChange} />
      <div className="buttons">
      <button  className ="send" onClick={this.onSubmit}> Send </button>
      <button onClick={this.props.logOut}> Log out </button>
      </div>
      {this.state.message.length}/200
      </form>
      </div>
      </div>
    );
  }
}
export default Chat;
