import "./App.css";
import React, { Component } from "react";
import web3 from "./web3";
import lottery from "./lottery";

class App extends Component {
  state = {
    manager: '',
    players: [],
    balance: '',
    value: '',
    message: ''
  }

  async componentDidMount() {
    //當我們使用metamask provider時，呼叫call方法時，我們可以省略宣告from屬性，metamask provider已經指定了預設帳戶(ACCOUNT 1，如果沒改名的話)。
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ manager, players, balance });
  }

  onSubmit = async (event) => {
    //阻止submit event提交HTML Form
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Waiting on transaction success......' });

    //自動指定帳戶的功能並不沒有包含send方法
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether') 
    });

    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ message: 'You have been entered !', players, balance });
    
  };

  onClick = async (event) => {
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Waiting on transaction success......' });

    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });

    const winner = await lottery.methods.latestWinner().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    
    this.setState({ message: `A winner has been picked ! The winner is: ${ winner }`, players, balance });
  }

  render() {
    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>
          This contract is managed by { this.state.manager }. 
          There are currently { this.state.players.length } people entered,
          competing to win { web3.utils.fromWei(this.state.balance, "ether") } ether!
        </p>
        <hr />
        <form onSubmit={ this.onSubmit }>
          <h4>Want to try your luck ?</h4>
          <div>
            <label>Amount of ether to enter </label>
            <input
              value={ this.state.value }
              onChange={ event => this.setState({ value: event.target.value })}
            />
          </div>
          <button>Enter</button>
        </form>
        <hr />
        <h4>Ready to pick a winner ?</h4>
        <button onClick={ this.onClick }>Pick a winner!</button>
        <hr />
        <h1>{ this.state.message }</h1>
      </div>
    );
  }
}

export default App;
