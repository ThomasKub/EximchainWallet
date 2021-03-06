- [Eximchain Wallet](#eximchain-wallet)
  * [Overview](#overview)
  * [Data Mangement](#data-mangement)
    + [App State(Data Structure)](#app-state-data-structure-)
    + [config](#config)
      - [reducer](#reducer)
      - [actions](#actions)
      - [selectors](#selectors)
    + [notifications](#notifications)
      - [reducers](#reducers)
      - [actions](#actions-1)
      - [selectors](#selectors-1)
    + [onboarding](#onboarding)
      - [reducers](#reducers-1)
      - [actions](#actions-2)
      - [selectors](#selectors-2)
    + [wallet](#wallet)
      - [reducers](#reducers-2)
      - [actions](#actions-3)
      - [selectors](#selectors-3)
    + [deterministicWallets](#deterministicwallets)
      - [reducers](#reducers-3)
      - [actions](#actions-4)
      - [selectors](#selectors-4)
    + [transaction](#transaction)
      - [reducers(combined reducers)](#reducers-combined-reducers-)
      - [actions(separated by each of the reducer that was combined)](#actions-separated-by-each-of-the-reducer-that-was-combined-)
      - [selectors(separated by each of the reducer that was combined)](#selectors-separated-by-each-of-the-reducer-that-was-combined-)
    + [transactions](#transactions)
      - [reducers](#reducers-4)
      - [actions](#actions-5)
      - [selectors](#selectors-5)
    + [addressBook](#addressbook)
      - [reducers](#reducers-5)
      - [actions](#actions-6)
      - [selectors](#selectors-6)
    + [gas](#gas)
      - [reducers](#reducers-6)
      - [actions](#actions-7)
      - [selectors](#selectors-7)
    + [routing(uses react-router-redux)](#routing-uses-react-router-redux-)
    + [Eximchain Governance Tab](#eximchain-governance-tab)
    + [AppState](#appstate)
      - [Governance/Index.tsx](#governance-indextsx)
      - [CostlyContractCallScreen](#costlycontractcallscreen)
      - [FreeContractCallScreen](#freecontractcallscreen)
    + [Changelog](#changelog)
      - [Refreshed UI/UX](#refreshed-ui-ux)
      - [Bug Patches/Fixes](#bug-patches-fixes)
    + [Signing Releases](#signing-releases)
    + [[**⬇︎ Download the latest release**](https://github.com/Eximchain/EximchainWallet/releases)](#------download-the-latest-release----https---githubcom-eximchain-eximchainwallet-releases-)
  * [Requirements](#requirements)
  * [Running the App](#running-the-app)
      - [Development](#development)
      - [Build Releases](#build-releases)
      - [Dev (HTTPS):](#dev--https--)
      - [Address Derivation Checker:](#address-derivation-checker-)
        * [The derivation checker utility assumes that you have:](#the-derivation-checker-utility-assumes-that-you-have-)
        * [Docker setup instructions:](#docker-setup-instructions-)
        * [Run Derivation Checker](#run-derivation-checker)
  * [Folder structure:](#folder-structure-)
    + [More information is available on the [Help Desk](https://eximchain.zendesk.com/hc/en-us)](#more-information-is-available-on-the--help-desk--https---eximchainzendeskcom-hc-en-us-)

<small><i><a href='http://ecotrust-canada.github.io/markdown-toc/'>Table of contents generated with markdown-toc</a></i></small>

# Eximchain Wallet

Eximchain wallet is a desktop wallet client that connects to the Eximchain network. We are currently still in beta, so if you see any issues, please report them to [support@eximchain.com](mailto:support@eximchain.com)


## Overview
This wallet is a forked version of MyCryptoWallet with some modifications specific to our very own Eximchain Network. Notably, we have added a governance tab that is used for interacting with the governance smart contract of our network, aesthetic changes to be on brand, and some ui/ux modifications for easier usage.



## Data Mangement
The main way any of the data within the app is interacted with is through the aptly named `AppState`, which describes the wallet app's state. The wallet utilizes the redux model of actions to signify a change that needs to happen, a reducer that will take the action and resolve it into a function that can modify the state, and selectors to get useful data from the state. Below are the relevant pieces of AppState that have been used in our changes or modified.

### App State(Data Structure)
  - `config` defines the chain config of the network you are connecting to,the blockexplorer url, and the web3/geth node url. Also, any other app related settings.
  - `notifications` multipurpose notifications that can be utilized throughout the app to notify a successful/failed transaction or any other important information we see fit.
  - `onboarding` modals that show how to use the app for the first time
  - `wallet` the current actual wallet that is active
  - `deterministicWallets` related to wallet but it can be used to describe a different dpath for a particular private key
  - `transaction` the current transaction being constructed
  - `transactions` a record of transaction history
  - `addressBook` a local storage of mapping of human readable names to ethereum addresses
  - `gas` keeps track of gas pricing and gas limits for a transaction
  - `routing` routing across the app
### config
#### reducer
  - `meta`
    - changeLanguage(not in use)
    - setOnline
    - setOffline
    - toggleAutoGasLimitEstimation(always turned off)
    - setLatestBlock
    - setTheme(not in use)
  - `networks` combines the reducer for custom and static Networks
    - customNetworks 
      - addCustomNetwork
      - removeCustomNetwork
    - staticNetworks(Currently modified to just return back the current state, so it doesn't do anything)
  - `nodes` combines the reducer of customNodes, staticNodes, and selectedNodes
    - `customNodes`
      - addCustomNode
      - removeCustomNode
    - `staticNodes`
    - `selectedNodes`
      - changeNodeSucceeded
      - changeNodeRequested
      - changeNodeFailed
#### actions
  - CHANGE_REQUESTED = 'CONFIG_NODES_SELECTED_CHANGE_REQUESTED',
  - CHANGE_SUCCEEDED = 'CONFIG_NODES_SELECTED_CHANGE_SUCCEEDED',
  - CHANGE_FAILED = 'CONFIG_NODES_SELECTED_CHANGE_FAILED',
  - CHANGE_REQUESTED_ONETIME = 'CONFIG_NODES_SELECTED_CHANGE_REQUESTED_ONETIME',
  - CHANGE_FORCE = 'CONFIG_NODES_SELECTED_CHANGE_FORCE'
#### selectors
  - getNodes
  - getSelectedNodes
  - getPreviouslySelectedNode
  - isNodeChanging
  - getNodeId
  
### notifications
#### reducers
  - showNotification
  - closeNotification
#### actions
  - SHOW = 'SHOW_NOTIFICATION',
  - CLOSE = 'CLOSE_NOTIFICATION'
#### selectors
  NONE

### onboarding
#### reducers
  - returns a state with onboardingState false
  - returns the action.payload of a slide
#### actions
  - COMPLETE = 'ONBOARDING_COMPLETE',
  - SET_SLIDE = 'ONBOARDING_SET_SLIDE'
#### selectors
  - getOnboarding
  - getActive
  - getSlide

### wallet
#### reducers
  - setWallet
  - resetWallet
  - setBalancePending
  - setBalanceFullfilled
  - setBalanceRejected
  - setWalletPending
  - setTokenBalancesPending
  - setTokenBalancesFulfilled
  - setTokenBalancesRejected
  - setTokenBalancePending
  - setTokenBalanceFulfilled
  - setTokenBalanceRejected
  - scanWalletForTokens
  - setWalletTokens
  - setWalletConfig
  - setPasswordPending
#### actions
  - UNLOCK_PRIVATE_KEY = 'WALLET_UNLOCK_PRIVATE_KEY',
  - UNLOCK_KEYSTORE = 'WALLET_UNLOCK_KEYSTORE',
  - UNLOCK_MNEMONIC = 'WALLET_UNLOCK_MNEMONIC',
  - UNLOCK_WEB3 = 'WALLET_UNLOCK_WEB3',
  - SET = 'WALLET_SET',
  - SET_BALANCE_PENDING = 'WALLET_SET_BALANCE_PENDING',
  - SET_BALANCE_FULFILLED = 'WALLET_SET_BALANCE_FULFILLED',
  - SET_BALANCE_REJECTED = 'WALLET_SET_BALANCE_REJECTED',
  - SET_TOKEN_BALANCES_PENDING = 'WALLET_SET_TOKEN_BALANCES_PENDING',
  - SET_TOKEN_BALANCES_FULFILLED = 'WALLET_SET_TOKEN_BALANCES_FULFILLED',
  - SET_TOKEN_BALANCES_REJECTED = 'WALLET_SET_TOKEN_BALANCES_REJECTED',
  - SET_PENDING = 'WALLET_SET_PENDING',
  - SET_NOT_PENDING = 'WALLET_SET_NOT_PENDING',
  - SET_TOKEN_BALANCE_PENDING = 'WALLET_SET_TOKEN_BALANCE_PENDING',
  - SET_TOKEN_BALANCE_FULFILLED = 'WALLET_SET_TOKEN_BALANCE_FULFILLED',
  - SET_TOKEN_BALANCE_REJECTED = 'WALLET_SET_TOKEN_BALANCE_REJECTED',
  - SCAN_WALLET_FOR_TOKENS = 'WALLET_SCAN_WALLET_FOR_TOKENS',
  - SET_WALLET_TOKENS = 'WALLET_SET_WALLET_TOKENS',
  - SET_CONFIG = 'WALLET_SET_CONFIG',
  - RESET = 'WALLET_RESET',
  - SET_PASSWORD_PENDING = 'WALLET_SET_PASSWORD_PENDING',
  - REFRESH_ACCOUNT_BALANCE = 'WALLET_REFRESH_ACCOUNT_BALANCE',
  - REFRESH_TOKEN_BALANCES = 'WALLET_REFRESH_TOKEN_BALANCES'
#### selectors
  - getWalletInst
  - getWalletConfig
  - isWalletFullyUnlocked
  - getWallet
  - getWalletTYpe
  - isUnlocked
  - isEtherBalancePending
  - getEtherBalance
  - getRecentAddresses
  
### deterministicWallets
#### reducers
  - returns state with modified wallets with a value from the action payload
  - returns state with modified desiredToken with a value from the action payload
  - returns state with modified wallets set by updateWalletValues
#### actions
  - GET = 'DETERMINISTIC_WALLETS_GET_WALLETS'
  - SET = 'DETERMINISTIC_WALLETS_SET_WALLETS',
  - SET_DESIRED_TOKEN = 'DETERMINISTIC_WALLETS_SET_DESIRED_TOKEN',
  - UPDATE_WALLET = 'DETERMINISTIC_WALLETS_UPDATE_WALLET'
#### selectors
  - getWallets
  - getDesiredToken

### transaction
#### reducers(combined reducers)
  - transactionBroadcastReducer
    - handleQueue
    - handleSuccess
    - handleFailure
  - transactionFieldsReducer
    - updateField('to')
    - updateField('value')
    - updateField('data')
    - updateField('gasLimit')
    - updateField('nonce')
    - updateField('gasPrice')
    - tokenToEther
    - etherToToken
    - tokenToToken
    - reset
  - transactionMetaReducer
    - unitMeta
    - updateMetaField('tokenValue')
    - updateMetaField('tokenTo')
    - updateMetaField('from')
    - tokenToEtherMeta
    - etherToTokenMeta
    - tokenToTokenMeta
    - returns the state with the isContractInteraction value to false
    - returns the state with the isContractInteraction value is true
  - transactionNetworkReducer
    - getNextState(FIELD) where FIELD can be: gasEstimationStatus, getFromStatus, getNonceStatus
  - transactionSignReducer
    - signTransactionRequested
    - signLocalTransactionSucceeded
    - signWeb3TransactionSucceeded
    - signTransactionFailed
    - resetSign
#### actions(separated by each of the reducer that was combined)
  - broadcast
    - WEB3_TRANSACTION_REQUESTED = 'BROADCAST_WEB3_TRANSACTION_REQUESTED',
    - TRANSACTION_SUCCEEDED = 'BROADCAST_TRANSACTION_SUCCEEDED',
    - LOCAL_TRANSACTION_REQUESTED = 'BROADCAST_LOCAL_TRANSACTION_REQUESTED',
    - TRANSACTION_QUEUED = 'BROADCAST_TRANSACTION_QUEUED',
    - TRANSACTION_FAILED = 'BROADCAST_TRANSACTION_FAILED'
  - fields
    - GAS_LIMIT_INPUT = 'GAS_LIMIT_INPUT',
    - GAS_PRICE_INPUT = 'GAS_PRICE_INPUT',
    - GAS_PRICE_INPUT_INTENT = 'GAS_PRICE_INPUT_INTENT',
    - DATA_FIELD_INPUT = 'DATA_FIELD_INPUT',
    - NONCE_INPUT = 'NONCE_INPUT',
    - GAS_LIMIT_FIELD_SET = 'GAS_LIMIT_FIELD_SET',
    - DATA_FIELD_SET = 'DATA_FIELD_SET',
    - TO_FIELD_SET = 'TO_FIELD_SET',
    - VALUE_FIELD_SET = 'VALUE_FIELD_SET',
    - NONCE_FIELD_SET = 'NONCE_FIELD_SET',
    - GAS_PRICE_FIELD_SET = 'GAS_PRICE_FIELD_SET'
  - meta
    - TOKEN_TO_META_SET = 'TOKEN_TO_META_SET',
    - UNIT_META_SET = 'UNIT_META_SET',
    - TOKEN_VALUE_META_SET = 'TOKEN_VALUE_META_SET',
    - IS_CONTRACT_INTERACTION = 'IS_CONTRACT_INTERACTION',
    - IS_VIEW_AND_SEND = 'IS_VIEW_AND_SEND'
  - network
    - ESTIMATE_GAS_REQUESTED = 'ESTIMATE_GAS_REQUESTED',
    - ESTIMATE_GAS_SUCCEEDED = 'ESTIMATE_GAS_SUCCEEDED',
    - ESTIMATE_GAS_FAILED = 'ESTIMATE_GAS_FAILED',
    - ESTIMATE_GAS_TIMEDOUT = 'ESTIMATE_GAS_TIMEDOUT',
    - GET_FROM_REQUESTED = 'GET_FROM_REQUESTED',
    - GET_FROM_SUCCEEDED = 'GET_FROM_SUCCEEDED',
    - GET_FROM_FAILED = 'GET_FROM_FAILED',
    - GET_NONCE_REQUESTED = 'GET_NONCE_REQUESTED',
    - GET_NONCE_SUCCEEDED = 'GET_NONCE_SUCCEEDED',
    - GET_NONCE_FAILED = 'GET_NONCE_FAILED'
  - sign
    - SIGN_TRANSACTION_REQUESTED = 'SIGN_TRANSACTION_REQUESTED',
    - SIGN_WEB3_TRANSACTION_SUCCEEDED = 'SIGN_WEB3_TRANSACTION_SUCCEEDED',
    - SIGN_LOCAL_TRANSACTION_SUCCEEDED = 'SIGN_LOCAL_TRANSACTION_SUCCEEDED',
    - SIGN_TRANSACTION_FAILED = 'SIGN_TRANSACTION_FAILED'
#### selectors(separated by each of the reducer that was combined)
  - broadcast
    - getBroacastState
    - getTransactionStatus
  - fields
    - getFields
    - getTo
    - getData
    - getGasLimit
    - getGasPrice
    - getValue
    - getNonce
  - meta
    - getMetaState
    - getDecimal
    - getTokenTo
    - getTokenValue
    - isContractInteraction
  - network
    - getNetworkStatus
    - nonceRequestPending
    - nonceRequestFailed
    - isNetworkRequestPending
    - getGasEstimationPending
    - getGasLimitEstimationTimedOut
  - sign
    - getSignState
    - getSignedTx
    - getWeb3Tx

### transactions
#### reducers
  - fetchTxData
  - setTxData
  - resetTxData
  - addRecentTx
#### actions
  - FETCH_TRANSACTION_DATA = 'TransactionsActions_FETCH_TRANSACTION_DATA',
  - SET_TRANSACTION_DATA = 'TransactionsActions_SET_TRANSACTION_DATA',
  - SET_TRANSACTION_ERROR = 'TransactionsActions_SET_TRANSACTION_ERROR',
  - RESET_TRANSACTION_DATA = 'TransactionsActions_RESET_TRANSACTION_DATA',
  - ADD_RECENT_TRANSACTION = 'TransactionsActions_ADD_RECENT_TRANSACTION'
#### selectors
  - getTransactionDatas
  - getRecentTransactions

### addressBook
#### reducers
  - returns the state with addresses and labels updated by the action's payload
  - returns the state with addresses and labels updated with an action's payload entry deleted
  - returns the state with entries updated by the action's payload
  - returns the state with a particular entry in entries deleted
#### actions
  - SET_LABEL = 'ADDRESS_BOOK_SET_LABEL',
  - CLEAR_LABEL = 'ADDRESS_BOOK_CLEAR_LABEL',
  - SET_LABEL_ENTRY = 'ADDRESS_BOOK_SET_LABEL_ENTRY',
  - CHANGE_LABEL_ENTRY = 'ADDRESS_BOOK_CHANGE_LABEL_ENTRY',
  - SAVE_LABEL_ENTRY = 'ADDRESS_BOOK_SAVE_LABEL_ENTRY',
  - CLEAR_LABEL_ENTRY = 'ADDRESS_BOOK_CLEAR_LABEL_ENTRY',
  - REMOVE_LABEL_ENTRY = 'ADDRESS_BOOK_REMOVE_LABEL_ENTRY'
#### selectors
  - getAddressLabels
  - getLabelAddresses
  - getAddressLabelEntry
  - getAddressLabelEtnries
  - getAddressBookTableEntry
  - getAccountAddressEntry
  - getAddressLabelEntryFromAddress
  - getAddressLabelRows
  - getNextAddressLabelId

### gas
#### reducers
  - fetchGasEstimates
  - setGasEstimates
#### actions
  - FETCH_ESTIMATES = 'GAS_FETCH_ESTIMATES',
  - SET_ESTIMATES = 'GAS_SET_ESTIMATES'
#### selectors
  - getEstimates
  - getIsEstimating

### routing(uses react-router-redux)
This is the main mechanism with which the App navigates around the various pages with the exception of within the governance tab where we have adopted the easier to use single page app with state changes model.

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
  - ***How input validation works***
    - Input validation in FreeContractCallScreen works a little differently from CostlyContractCallScreen because it handles quite a bit more of the contract functions as a whole. 
    - Furthermore, some of the rendered inputs are from a chained contract call and the output is the output of the contract call currently active. This was done to make it easier on the user, and avoid inputing the wrong values for inputs that look very much a like, namely ballotRecordId and withdrawRecordId. Otherwise, the inputs are validated by the type of the input it is much like in the CostlyContractCallScreen portion of the code.
    - In the future it would be best to separate these input validation in to it's own component and define them separately on a case by case basis.
  - ***How the request is made through the web3 provider***
    - nodeLib returns the current node component, and the node component should be already configured to which ever node/network you set as your web3 provider through the beauty of redux and sagas. 
    - Because nodeLib is already configured and stored within the redux state of the app all that is required to make a call to the web3 provider is simply use the sendCallRequest function defined within the nodeLib component.
  - ***Chaining contract calls***
    - Calling contract calls in FreeContractCallScreen are absolutely free and does not require any value or exc to fund the call. Therefore, we can chain the output of one call in to another to provide the end user with the most relevant information on the ui.
    - There is a supplementary function called handleChainedCalls which will run a sendCallRequest given an input and contractOption and return the decoded output. With which we can use as inputs in to the next contract call. 



### Changelog
#### Refreshed UI/UX
  - View and Send tab
    - It is now required to first enter in a wallet to access the functions of this tab.
    ![](screenshot_01.jpg)
  - Network changer
    - Has been vastly simplified to only include Eximchain's networks by default
    - Some work needs to be done in terms of adding back in network grouping in case you want to add nodes not part of the official Eximchain network
    ![](screenshot_02.jpg)
  - gas limit/gas pricing
    - The simple version of gas pricing is now super simple with a slow, medium, fast button options to determine the pricing rather than a slider.
    ![](screenshot_03.jpg)
    - The advanced version has some nicer css to keep in line with the look of the rest of the app
    ![](screenshot_04.jpg)
  - Governance Tab
    - Everything here is new.
    ![](screenshot_05.jpg)
#### Bug Patches/Fixes
  - One major bug that arrose, while working on this version of the wallet, was that ledger actually broke compatibility with MyCrypto with their firmware update. This would not be fixed by MyCrypto themselves, and I had to introduce my very own fix that is documented in this issue(https://github.com/MyCryptoHQ/MyCrypto/issues/2439) on MyCryptoWallet's repository.
  - Transaction history had been broken with the version of MyCryptoWallet we forked off of because the most up to date version at the time in the repo of MyCrypto is technically a development version. This is now fixed
  - Updated packages to keep in line with some of the npm packages that suffered security vulnerablities in line with github's suggestions


### Signing Releases
There are some issues still withstanding with trying to utilize electron-builder's signing. 
  - You can follow the steps outlined here(https://www.electron.build/code-signing).
  - However, after one successfuly run I have been unable to once again get code-signing to work. 
  - Windows signing is still not resolved.
  - Ideally we mimic the set up that MyCrypto already uses with jenkins to handle the signed releases
  - In the mean time I should work on getting something like a md5 checksum and update the hash in this readme so people can check they have the correct version. 


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



