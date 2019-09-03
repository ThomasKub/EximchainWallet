# Eximchain Wallet

Eximchain wallet is a desktop wallet client that connects to the Eximchain network. We are currently still in beta, so if you see any issues, please report them to [support@eximchain.com](mailto:support@eximchain.com)


## Major Changes From MyCryptoWallet
This forked MyCryptoWallet contains some notable changes consisting of the following:

- Eximchain Governance Tab
- UI/Functionality Changes
- Bug Patches/Fixes
- Signing Releases

### Eximchain Governance Tab

The Governance Tab was originally a modified version of the Contracts tab, and still utilizes a lot of the same components to do the render of the individual components. To maintain some more levels of consistency across the app it is within containers/tabs section of the folder just like the other tab entries.

Furthermore it can be broken down in to its file which consists of three primary components.

- The index.tsx (which is the entry point of the tab)
- components/FreeContractCallScreen.tsx (handles any free reads from the governance smart contract)
- components/CostlyContractCallScreen.tsx (handles any writes/transactions to the governance smart contract)

The rest of the components are there to support the two contract call screens. Realstically, any of the calls made through this tab can also been done through the Contracts tab, but the governance tabs have built in further checks to prevent users from submitting "bad" transactions that will later be rejected by the blockchain. That being said if there is a situation in which a "bad" transaction goes through our ui, rest assured, the governance smart contract will still not accept the transaction as it is not supported by the given state of the contract.

### AppState
As far as the app is concerned, any state data that needs to be reset or carried over from the various tabs is stored through redux on master component state called the AppState. Defined inside the AppState are the core pieces of code that makes the rest of the application function. Listed below are some of the AppState attributes and what they control
- The AppState contains:
  - `config` (chain config aka. the variables defining which network you are connected to as well as the block explorer you want to link to when viewing transactions through an external source)
  - `notifications` (multipurpose notifications that can be accessed throughout the app to inform the client of useful bits of information)
  - `onboarding` (the modal that shows how to use the app for the first time as well as storing the information about whether the user has opened this app before)
  - `ens` (ethereum name service. The state in here is not relevant to the changes that this wallet has made)
  - `wallet` (the wallet that is currently active should be undefined if no wallet is currently active, furthermore the values in here should be reset whenever clicking to a different tab/section of the app)
  - `customTokens` (contains information about erc20 tokens that the client may want to keep track of)
  - `rates` (This feature is currently broken and unused in our wallet because it queries information about the current pricing of etherum/bitcoin which are no longer relevant to this wallet)
  - `deterministicWallets` (Related to the wallet, and describes the dpath of a particular private key/seed phrase of a wallet you are using)
  - `swap` (keeps track of bitcoin/ethereum swap rates as well as swap rates of other erc20 tokens currently not in use by our wallet)
  - `transaction` (the current transaction that is being constructed)
  - `transactions` (a local transaction history that is searchable)
  - `message` (a message that is being constructed)
  - `addressBook` (a local storage of human readable names to addresses)
  - `gas` (defines all things related to gas in a transaction)
  - `schedule` (keeps track of transactions that you want to schedule for a future date)
  - `routing` (passes in a routerReducer for navigating throughout the app however the usage of the implementation throughout the app is poor)
  
- What pieces of the data (selectors/StateProps) is needed from the app state in redux
  - `toChecksumAddress` (a function to turn an address to it's checksummed version)
  - `wallet` (the wallet and related functions of the current activated wallet)
  - `currentTo` (the current receipient or receiver of a transaction)
  - `contracts` (list of contracts from local storage)
  - `isValidAddress` (a function that runs a checksum for a given address to maintain validity
- What pieces of the AppState that need to be set. (actions/DispatchProps)
  - `resetWallet` (resets the wallet state)
  - `setCurrentTo` (resets the address a transaction should be sent to)
  - `showNotification` (sets the notification with the message you want to display to the user)
  - `resetTransactionRequested` (reset all current transaction variables)

- How the contract abi is stored
  - Grabbing the contract abi: We use the the AppState selector to grab the array of locally stored contracts, and we can define these locally stored contracts abi inside common/config/contracts/eth.json. Then we filter the array and select for the one that has the correct name and address. Then we take the abi of the selected contract and throw it into a Contract constructor which returns a Contract instance. The Contract instance has all the neccessary decode/encode functions to interact with the abi, and let's us forgo the need to have define each of these contract function interfaces manually.
  - Passing the functions through to the costlycontractcall/freecontractcall component
    - Within the index file of the governance tab the functions that need be made available to the costlycontractcall or freecontractcall are defined. 
    - Filter through costlycontractcall defined functions and we create buttons based on the functions, we do the same for the freecontractcall defined functions. We do this by using the buildFunctionOptions which returns the button components that needs to be rendered.
    - When a button is clicked the instance of the function is passed through either to the costlycontractcall or freecontractcall component alongside additional props that is specific to each component.
#### Governance/Index.tsx
- Main child components/
  - CostlyContractCallScreen
  - FreeContractCallScreen
- **Actions** that are utilized by this component
  - `resetWallet: walletActions.resetWallet` (resets the wallet currently in use)
  - `setCurrentTo` (sets the address a transaction is to be sent to)
  - `resetTransactionRequested: transactionFieldsActions.resetTransactionRequested` (resets all transaction datafields)
- ***What the index.tsx does***
  - The index file for the governance tab is the entry point for all things related to the governance tab. Here we render the intial view of buttons that refer to the various contract function calls we want to make.
  - When one of the contract call buttons are clicked depending on whether name of the buttons `GovernanceCall` is of the type `FreeContractCallName` or `CostlyContractCallName` the index will render the screen of `FreeContractCallScreen` or `CostlyContractCallScreen`
  - Furthermore, a lot of the code is based of the contracts tabs, and we try to utilize some of the generative component elements, and taking a look at the `buildFunctionOptions` function will give you a clue as to how the buttons are rendered.
  - When clicking on to the governance tab the `setCurrentTo` function will be set to the governance contract call screen.
  - Another feature that is utilized throughout the app is that when clicking to other tabs the wallet state is reset through `resetWallet`. Likewise when clicking on to the governance tab the wallet is reset to ensure that the wallet in use is capable of sending transactions.
  - Furthermore, when we return to the main button screen from any of the other contract call screens we make sure to `resetTransactionRequested` to sanitize the inputs when clicking another contract call button. 
#### CostlyContractCallScreen
- **Actions** that are utilized by this component to set various props within the AppState:
  - `showNotification: notificationsActions.showNotification`
  - `setDataField: transactionFieldsActions.setDataField`
  - `resetTransactionRequested: transactionFieldsActions.resetTransactionRequested`
  - `setAsContractInteraction: transactionMetaActions.setAsContractInteraction`
  - `setAsViewAndSend: transactionMetaActions.setAsViewAndSend`
  - `setCurrentValue: transactionActions.setCurrentValue`
  - `setScheduleGasLimitField: scheduleActions.setScheduleGasLimitField`
- **Selectors** that are utilized by this component to grab values from AppState:
  - `wallet: walletSelectors.getWalletInst(state)`
  - `nodeLib: configNodesSelectors.getNodeLib(state)`
  - `to: transactionFieldsSelectors.getTo(state)`
  - `dataExists: transactionSelectors.getDataExists(state)`
  - `txBroadcasted: transactionSelectors.currentTransactionBroadcasted(state)`
  - `currentTransactionFailed: transactionSelectors.currentTransactionFailed(state)`
  - `currentTransactionIndex: transactionSignSelectors.getSignState(state)`
  - `broadcastState: transactionBroadcastSelectors.getBroadcastState(state)`
  - `isValidAddress: configSelectors.getIsValidAddressFn(state)`
- ***How signing and submitting transaction works in `CostlyContractCallScreen.tsx`***
  - ***Grabbing the input values for the transaction***
    - Render the input fields based on the contract function call instance
    - The inputs are then set as inputs are entered by a designated setter based on input type.
      - `handleInputChange`(for the basic input)
      - `handleIntegerDropdownChange`(for specific integer values)
      - `handleSelectAddressFromBook`(for inputs that are addresses)
      - `handleBooleanDropdownChange`(for inputs that are booleans)
    
  - ***How input validation works***
    - For each of the 3 different costlycontractcall functions we have 3 different validator functions and they work by checking the inputs as they are entered, and are surrounded by a try catch block that will throw if requirements of the function aren't met.
    - `handleClaimInputs`(handles the validation requirements for a claim function instance)
    - `handleCollectInputs`(handles the validation requirements for a collect function instance
    - `handleVoteInputs`(handles the validation requirements for a vote function instance)
    - For some of the validation the inputs are parsed into a chained function call by handleChainedCalls, which has the functionality of the most basic form of the freecontractcall. Then we use those values, for example, check if a particular address has been validated through our governance contract. 
    - The validation, while not necessary for a valid transaction, prevents a good chunk of "bad" transactions from going through that will just eventually enter a failure state.
    - Ideally in the future we should better generalize how the validation works for each transaction.
  - ***How setting the gas limit/ gas price works***
    - Gas limits on our ethereum based chain has been set at 8 million, so that our contract will simply not run in to bottlenecks with how far the chain can process state. Likewise, we had to modify mycryptowallet's default gas limits to reflect our changes because it was using the gas limits set by the ethereum chain.
    - Gas Pricing for the sake of our users who might not be apt in the intricansies of gas pricing we made a simpler ui to switch from a high gas price for faster transactions and lower gas price for slower transactions.
    - The gas pricing is set in the App State through redux actions and reducers, but for our particular case we have modified the action call order manually to set pricing instead of calling the average gas pricing from the geth node.
    - There is currently an issue with retrieving the amount of gas required for a transaction from the geth node. This is probably an artifact with setting the gas limit to 8 million on top of geth having some hard coded values that returns invalid gas limits for anything above the original ethereum defaults.
  - ***How the transaction to be sent is signed***
    - After the validation step and the input values for the transaction are deteremined to be valid. We encode the input values based on the spec of the input values that are required by the abi of the smart contract that was passed through from the AppState
    - Set the datafield to the encoded input of the AppState by utilizing the `setDataField` redux function
  - ***How the the transaction is sent the web3 provider***
    - Once the datafield and rest of the transaction values(gas limit, gas price, value of transaction) are set, it passes those values in to the wallet component as a raw transaction.
    - The wallet comoponent then handles what sort of wallet we are using be it hardware(trezor and ledger) or software(private key, seed phrase, etc..), and signs the transaction based on the ethereum specifications.
    - We then get the signed transaction output which is passed in to a transaction reducer through a transaction broadcast action.
    - The reducer takes values defined in the App State, which have already defined the web3/geth node url we want to use.
    
#### FreeContractCallScreen

- ***Actions*** used by this component
  - `showNotification: notificationsActions.showNotification`
  - `setDataField: transactionFieldsActions.setDataField`
  - `resetTransactionRequested: transactionFieldsActions.resetTransactionRequested`
  - `setAsContractInteraction: transactionMetaActions.setAsContractInteraction`
  - `setAsViewAndSend: transactionMetaActions.setAsViewAndSend`
  - `setCurrentValue: transactionActions.setCurrentValue`
- ***Selectors*** used by this component
  - `nodeLib: configNodesSelectors.getNodeLib(state)`
  - `to: transactionFieldsSelectors.getTo(state)`
  - `dataExists: transactionSelectors.getDataExists(state)`
    
- How reads happen in `FreeContractCallScreen.tsx`
  - ***Grabbing the input values for the read***
    - Input values are defined by the contract call instance, and depending on the contract call an additional chained contract call instance. 
    - Some of the calls such as withdraw history input interface is that of the ballot history because the original input value is the output value from the ballot history, and the inputs for ballot history are easier to keep track of. 
  - ***Chaining contract calls***
    - Calling contract calls in FreeContractCallScreen are absolutely free and does not require any value or exc to fund the call. Therefore, we can chain the output of one call in to another to provide the end user with the most relevant information on the ui.
      - For example: TODO
  - ***How input validation works***
    - TODO: name the functions that validate inputs
  - ***How the request is made through the web3 provider***
    - TODO: nodeLib usage


### UI/Functionality Changes
TODO: Go over Chris's changes to match our design language various css style changes
(show the screenshots of before and after)

TODO: Explain how we have changed gas limit/gas pricing functionality to be simpler, and the ui changes to reflect it.(screenshots from before and after)

TODO: Network changer overhaul (screenshots from before and after)

TODO: View and Send tab flow/layout changes (screenshots from before and after)

### Bug Patches/Fixes
TODO: Talk about the pr that andreweximchain made to MyCryptoWallet that fixed issues regarding ledger. (add a link to the issue)


TODO: Talk about fixing the recent transactions history (add a link to the commit)

TODO: Updated packages to keep in line with some of the npm packages that suffered security vulnerablities (go over the list of package.json changes)


### Signing Releases
TODO: Issues regarding signing software with electron-builder
- There are some issues still withstanding with trying to utilize electron-builder's signing. 
  - Name the env variables that need to be set.
  - Ideally we mimic the set up that MyCrypto already uses with jenkins to handle the signed releases
  - More research needs to be done as to how to set it up correctly.


### [**⬇︎ Download the latest release**](https://github.com/Eximchain/EximchainWallet/releases)

## Requirements

* Node 8.9.4\*
* Yarn >= 1.7.0\*\*
* Python 2.7.X\*\*\*

<sub>\*Higher versions should work fine, but may cause inconsistencies. It's suggested you run 8.9.4 using `nvm`.</sub>
<br/>
<sub>**npm is NOT supported for package management. Eximchain Wallet uses yarn.lock to ensure sub-dependency versions are pinned, so yarn is required to install node_modules</sub>
<br/>
<sub>\***Python 3 is **not** supported, since our dependencies use `node-gyp`.</sub>

## Running the App

After `yarn`ing all dependencies you can run various commands depending on what you want to do:

#### Development

```bash
# run app in dev mode in browser, rebuild on file changes
yarn dev
```

```bash
# run app in dev mode in electron, rebuild on file changes
yarn dev:electron
```

#### Build Releases

```bash
# builds the production server app
yarn build
```

```bash
# builds the downloadable version of the site
yarn build:downloadable
```

```bash
# builds the electron apps
yarn build:electron

# builds only one OS's electron app
yarn build:electron:(osx|linux|windows)
```

All of these builds are output to a folder in `dist/`.


#### Dev (HTTPS):

Some parts of the site, such as the Ledger wallet, require an HTTPS environment to work. To develop on HTTPS, do the following:

1.  Create your own SSL Certificate (Heroku has a [nice guide here](https://devcenter.heroku.com/articles/ssl-certificate-self))
2.  Move the `.key` and `.crt` files into `webpack_config/server.*`
3.  Run the following command:

```bash
yarn dev:https
```

#### Address Derivation Checker:

EthereumJS-Util previously contained a bug that would incorrectly derive addresses from private keys with a 1/128 probability of occurring. A summary of this issue can be found [here](https://www.reddit.com/r/ethereum/comments/48rt6n/using_myetherwalletcom_just_burned_me_for/d0m4c6l/).

As a reactionary measure, the address derivation checker was created.

To test for correct address derivation, the address derivation checker uses multiple sources of address derivation (EthereumJS and PyEthereum) to ensure that multiple official implementations derive the same address for any given private key.

##### The derivation checker utility assumes that you have:

1.  Docker installed/available
2.  [dternyak/eth-priv-to-addr](https://hub.docker.com/r/dternyak/eth-priv-to-addr/) pulled from DockerHub

##### Docker setup instructions:

1.  Install docker (on macOS, [Docker for Mac](https://docs.docker.com/docker-for-mac/) is suggested)
2.  `docker pull dternyak/eth-priv-to-addr`

##### Run Derivation Checker

The derivation checker utility runs as part of the integration test suite.

```bash
yarn test:int
```

## Folder structure:

```
│
├── common
│   ├── actions - Application actions
│   ├── api - Services and XHR utils
│   ├── assets - Images, fonts, etc.
│   ├── components - Components according to "Redux philosophy"
│   ├── config - Various config data and hard-coded json
│   ├── containers - Containers according to "Redux philosophy" any major views will be inside containers
│   │   ├── OnboardingModal
│   │   ├── Tabs - breaks down the major pieces that the entire app is divided in to
│   │   │   ├── ... - These tabs also include their own components folder which consists of
│   │   │   ├── ... - the pieces that aren't being shared across the app.
│   │   │   ├── Governance
│   │   │   └── ... (BroadcastTx, CheckTransaction)
│   │   └─ TabSection
│   ├── libs - Framework-agnostic libraries and business logic
│   ├── reducers - Redux reducers
│   ├── sagas - Redux sagas
│   ├── sass - SCSS styles, variables, mixins
│   ├── selectors - Redux selectors
│   ├── translations - Language JSON dictionaries
│   ├── typescript - Typescript definition files
│   ├── utils - Common use utility functions
│   ├── index.tsx - Entry point for app
│   ├── index.html - Html template file for html-webpack-plugin
│   ├── Root.tsx - Root component for React
│   └── store.ts - Redux reducer combiner and middleware injector
├── electron-app - Code for the native electron app
├── jest_config - Jest testing configuration
├── spec - Jest unit tests, mirror's common's structure
├── static - Files that don't get compiled, just moved to build
└── webpack_config - Webpack configuration
```

### More information is available on the [Help Desk](https://eximchain.zendesk.com/hc/en-us)



