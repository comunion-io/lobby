# Comunion


> The DAO Collaboration NetWork

**Live demo:** http://u.comunion.io



## Build Setup


```bash
# clone the project
git clone https://github.com/comunion-io/lobby.git

# enter the project directory
cd comunion

# install dependency
npm install

# develop
npm run dev
```

This will automatically open http://localhost:9528

## Build

```bash
# build for test environment
npm run build:stage

# build for production environment
npm run build:prod
```

## Advanced

```bash
# preview the release environment effect
npm run preview

# preview the release environment effect + static resource analysis
npm run preview -- --report

# code format check
npm run lint

# code format check and auto fix
npm run lint -- --fix
```


## todo

* style optimization
* interaction logic modification
* adding real backend interface and data
* wallet related investigation and research

## progress

* [2019-07-15]

Add data interface.

* [2019-07-12]

Add organization module, including organization search, create, login and display.

* [2019-07-05]

Complete the frontend framework structure of Comunion 1.0.

Add team manager, profile module.

## Components
*[@/components/Common/MetaMaskTrans]
to handle the action that have to use the metamask and write down at the chain.
include:
1. check if the browser has installed metamask
2. check if login the metamask and connect to the comunion account,
   then we will get the address of the wallet => this.coinbase
3. to wake up the metamask to do the transation
4. send info to server
5. begin to show the progress bar, setInterval to get info until the server tells us the info has written to the chain, then close the progress bar
6. show action successful tip

*[@/mixins/GetInfo]
to get if the user is the owner of current organization
us e=> this.isOwner

*[@/mixins/MetaMaskInstall]
add single function respectively to check
1. check if the browser has installed metamask
2. check if login the metamask and connect to the comunion account,
   then we will get the address of the wallet => this.coinbase
3. to Login the metamask