import Web3 from "web3";

window.ethereum.request({
    method: "eth_requestAccounts"
});

const web3 = new Web3(window.ethereum);
//透過取用已經被注入網頁的web3 provider，將其放入到新版本的web3 建構子中，從而確保可以使用到新版本的web3

export default web3;