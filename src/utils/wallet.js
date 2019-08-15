// export function checkMetaMaskInstall() {
//   if (window.web3) {
//     // Use the browser's ethereum provider
//     window.isMetaMaskInstalled = true

//     const web3 = new Web3(web3.currentProvider)

//     // console.log('new web3', web3)
//     /* To see if the injected provider is from MetaMask */
//     if (web3.currentProvider.isMetaMask) {
//       console.log('The injected provider is from MetaMask！')
//     }
//   } else {
//     window.isMetaMaskInstalled = false
//     alert('No web3? You should consider trying MetaMask!')
//   }

//   web3.eth.getAccounts((err, account) => {
//     console.log('accoutn', account)
//   })
//   console.log('acc9unt', web3.eth.accounts[0])
// }
