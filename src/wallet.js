// import Web3 from 'web3'
// console.log('window.ethereum', window.ethereum)
// console.log('Web3.givenProvider', web3.givenProvider)

// const web3i = new Web3(Web3.givenProvider || 'ws://localhost:8546', null, {})
// const web3i = new Web3('ws://localhost:8546');
// console.log('web3:new Web3(...)', web3i)

// checkMetaMaskNetWork()
// function checkMetaMaskNetWork() {
//   web3.version.getNetwork((err, netId) => {
//     switch (netId) {
//       case '1':
//         console.log('This is mainnet')
//         break
//       case '2':
//         console.log('This is the deprecated Morden test network.')
//         break
//       case '3':
//         console.log('This is the ropsten test network.')
//         break
//       case '4':
//         console.log('This is the Rinkeby test network.')
//         break
//       case '42':
//         console.log('This is the Kovan test network.')
//         break
//       default:
//         console.log('This is an unknown network.')
//     }
//   })
// }

// ///////////////////
// console.log('acc9unt', web3.eth.accounts[0])

// var account = web3.eth.accounts[0];

// var accountInterval = setInterval(function() {
//   if (web3.eth.accounts[0] !== account) {
//     account = web3.eth.accounts[0];
//     updateInterface();
//   }
// }, 100);

//
// web3.eth.getCoinbase((err, coinbase) => {
//   console.log('coninbase', coinbase)
// })

// web3.eth.getAccounts((err, account) => {
//   console.log('accoutn', account)
// })

// ////////////
// if (window.ethereum) {
//   try {
//     if (typeof window.ethereum.selectedAddress === 'undefined') {
//       window.ethereum.enable()
//     }
//   } catch (err) {
//     alert('you denied access to your metamask.')
//   }
// }

// var web3;
// // 创建web3对象并连接到以太坊节点
// if (typeof web3 !== 'undefined') {
//   web3 = new Web3(web3.currentProvider);
// } else {
//   // set the provider you want from Web3.providers
//   web3 = new Web3(new Web3.providers.HttpProvider("http://192.168.53.60:8545"));
// }

// 合约ABI
// var abi = [{"constant":true,"inputs":[],"name":"say","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];
// // // 合约地址
// // var address = "0xf77976c9a552f2934d3694c38fbd057ae803ef45";
// // // 通过ABI和地址获取已部署的合约对象
// // var helloContract = new web3.eth.Contract(abi,address);

//
// helloContract.methods.say().call().then(function(result){
//   console.log("返回值:" + result);
// } // 调用合约的say方法
