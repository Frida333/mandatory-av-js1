import React from 'react';
import { Helmet } from "react-helmet";


class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {name: '',
    valid: true,
  };
  this.onSubmit = this.onSubmit.bind(this);
  this.onChange = this.onChange.bind(this);
}

  onSubmit(e) {
    e.preventDefault();
    let regEx = /^[A-ZÅÄÖa-zåäö\d\s-_]{1,12}$/.test(this.state.name);
    if (regEx){
      this.props.onSubmit(this.state.name);
    }
    this.setState({
      valid: regEx,
    })
  }

  onChange(e) {
    e.preventDefault();
    this.setState({name:
      e.target.value,
    });
  }

  render() {
    let p;
    if (this.state.valid === false){
      p = <p><b>Invalid username</b></p>
    }

    return(
      <div className="login">
      <Helmet>
      <title>Home</title>
      </Helmet>
      <div className="valid">
      {p}
      </div>
      <div className="input">
      <form onSubmit={this.onSubmit}>
      <input value={this.props.name} type="text"placeholder="Username" onChange={this.onChange}/>
      <button className="log-inbutton">Log in </button>
      </form>
      </div>
      </div>
    );
  }
}

export default Login;
