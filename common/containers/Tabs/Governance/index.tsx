import React, { Component } from 'react';
import * as selectors from 'features/selectors';
import { setCurrentTo, TSetCurrentTo } from 'features/transaction/actions';
import { Option } from 'react-select';
import { AppState } from 'features/reducers';
import { notificationsActions } from 'features/notifications';
import { connect } from 'react-redux';
import Contract from 'libs/contracts';
import translate, { translateRaw } from 'translations';
import TabSection from 'containers/TabSection';
import { FreeContractCallScreen } from './components/FreeContractCallScreen';
import { configSelectors } from 'features/config';
import VoteOrNominateIcon from 'assets/images/vote-or-nominate.svg';
import CollectTokensIcon from 'assets/images/collect-tokens.svg';
import ClaimTokensIcon from 'assets/images/claim-tokens.svg';
import { NetworkContract } from 'types/network';
import { Link } from 'react-router-dom';
import { transactionFieldsActions } from 'features/transaction';
import './index.scss';
import { Button } from './components/Button';
import { CostlyContractCallScreen } from './components/CostlyContractCallScreen';

//add all functioncall names here.
//Maybe change this so it can be generated by the contract
//though for user experience doing it here would probably make more sense
export enum CostlyContractCallName {
  VOTE = 'VOTE',
  CLAIM = 'CLAIM',
  COLLECT = 'COLLECT'
}

export enum FreeContractCallName {
  BALLOT_HISTORY = 'BALLOT_HISTORY',
  BALLOT_RECORDS = 'BALLOT_RECORDS',
  WITHDRAW_HISTORY = 'WITHDRAW_HISTORY',
  WITHDRAW_RECORDS = 'WITHDRAW_RECORDS',
  CURRENT_GOVERNANCE_CYCLE = 'CURRENT_GOVERNANCE_CYCLE',
  GOVERNANCE_CYCLE_RECORDS = 'GOVERNANCE_CYCLE_RECORDS',
  NOMINEE_BALLOTS = 'NOMINEE_BALLOTS',
  CAN_GOVERN = 'CAN_GOVERN',
  IS_KYC_APPROVED = 'IS_KYC_APPROVED',
  IS_KYC_DENIED = 'IS_KYC_DENIED'
}

export type ContractFuncNames = CostlyContractCallName | FreeContractCallName;

export interface ContractCallDesc {
  name: ContractFuncNames;
  icon?: string;
  description: string;
  contractcall: string;
  example?: string;
}

const COSTLYFUNCTIONCALLS: ContractFuncNames[] = Object.values(CostlyContractCallName);
const FREEFUNCTIONCALLS: ContractFuncNames[] = Object.values(FreeContractCallName);
type CostlyContractCall = { [key in CostlyContractCallName]: ContractCallDesc };
type FreeContractCall = { [key in FreeContractCallName]: ContractCallDesc };
export type GovernanceCall = CostlyContractCall | FreeContractCall;

export enum GovernanceFlowStages {
  START_PAGE = 'start page',
  FREE_CALL_PAGE = 'free call page',
  COSTLY_CALL_PAGE = 'costly call page'
}

export interface State {
  stage: GovernanceFlowStages;
  chosenCall: ContractFuncNames | null;
  currentContract: Contract;
  currentCall: null | ContractOption;
  inputs?: any;
}

interface ContractOption {
  name: string;
  icon?: string;
  value: string;
}

interface DispatchProps {
  setCurrentTo: TSetCurrentTo;
  showNotification: notificationsActions.TShowNotification;
  resetTransactionRequested: transactionFieldsActions.TResetTransactionRequested;
}
interface StateProps {
  currentTo: ReturnType<typeof selectors.getCurrentTo>;
  contracts: NetworkContract[];
  isValidAddress: ReturnType<typeof configSelectors.getIsValidAddressFn>;
}

type Props = DispatchProps & StateProps;

const mapStateToProps = (state: AppState) => ({
  contracts: configSelectors.getNetworkContracts(state) || [],
  isValidAddress: configSelectors.getIsValidAddressFn(state),
  currentTo: selectors.getCurrentTo(state)
});

export const GOVERNANCECALLS: GovernanceCall = {
  [CostlyContractCallName.VOTE]: {
    name: CostlyContractCallName.VOTE,
    description: 'Requires EXC',
    icon: VoteOrNominateIcon,
    contractcall: 'vote'
  },
  [CostlyContractCallName.CLAIM]: {
    name: CostlyContractCallName.CLAIM,
    description: 'Requires EXC',
    icon: ClaimTokensIcon,
    contractcall: 'startWithdraw'
  },
  [CostlyContractCallName.COLLECT]: {
    name: CostlyContractCallName.COLLECT,
    description: 'Requires EXC',
    icon: CollectTokensIcon,
    contractcall: 'finalizeWithdraw'
  },
  [FreeContractCallName.BALLOT_HISTORY]: {
    name: FreeContractCallName.BALLOT_HISTORY,
    contractcall: 'ballotHistory'
  },
  [FreeContractCallName.BALLOT_RECORDS]: {
    name: FreeContractCallName.BALLOT_RECORDS,
    contractcall: 'ballotRecords',
    chained: true
  },
  [FreeContractCallName.CURRENT_GOVERNANCE_CYCLE]: {
    name: FreeContractCallName.CURRENT_GOVERNANCE_CYCLE,
    contractcall: 'currentGovernanceCycle'
  },
  [FreeContractCallName.WITHDRAW_HISTORY]: {
    name: FreeContractCallName.WITHDRAW_HISTORY,
    contractcall: 'withdrawHistory'
  },
  [FreeContractCallName.WITHDRAW_RECORDS]: {
    name: FreeContractCallName.WITHDRAW_RECORDS,
    contractcall: 'withdrawRecords',
    chained: true
  },
  [FreeContractCallName.GOVERNANCE_CYCLE_RECORDS]: {
    name: FreeContractCallName.GOVERNANCE_CYCLE_RECORDS,
    contractcall: 'governanceCycleRecords'
  },
  [FreeContractCallName.NOMINEE_BALLOTS]: {
    name: FreeContractCallName.NOMINEE_BALLOTS,
    contractcall: 'nomineeBallots'
  },
  [FreeContractCallName.CAN_GOVERN]: {
    name: FreeContractCallName.CAN_GOVERN,
    contractcall: 'canGovern'
  },
  [FreeContractCallName.IS_KYC_APPROVED]: {
    name: FreeContractCallName.IS_KYC_APPROVED,
    contractcall: 'isKYCApproved'
  },
  [FreeContractCallName.IS_KYC_DENIED]: {
    name: FreeContractCallName.IS_KYC_DENIED,
    contractcall: 'isKYCDenied'
  }
};
class GovernanceClass extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const contractNumber = this.props.contracts.length;
    let i = 0;
    for (i; i < contractNumber; i++) {
      let currentInstance = this.props.contracts[i];
      console.log(currentInstance);
      if (currentInstance.name === 'Weyl Governance') {
        if (currentInstance.address === '0x000000000000000000000000000000000000002a') {
          // this.props.setCurrentTo(currentInstance.address);
          break;
        }
      }
    }

    const x = this.accessContract(this.props.contracts[i].abi);
    this.state = {
      stage: GovernanceFlowStages.START_PAGE,
      chosenCall: null,
      // @ts-ignore
      currentCall: null,
      currentContract: x
    };

    const currentContract = this.state.currentContract;
    const contractFunctions = Contract.getFunctions(currentContract);
    const contractOptions = this.contractOptions(contractFunctions);

    const formattedContract = this.formatOptions(contractOptions);

    this.goTo = this.goTo.bind(this);
    this.goBack = this.goBack.bind(this);
  }

  private formatOptions = (options: Option[]) => {
    if (typeof options[0] === 'object') {
      return options;
    }
    const formatted = options.map(opt => {
      return { value: opt, label: opt };
    });
    return formatted;
  };
  private setContract() {
    const contractNumber = this.props.contracts.length;
    let i = 0;
    for (i; i < contractNumber; i++) {
      let currentInstance = this.props.contracts[i];
      if (currentInstance.name === 'Weyl Governance') {
        if (currentInstance.address === '0x000000000000000000000000000000000000002a') {
          this.props.setCurrentTo(currentInstance.address);
          break;
        }
      }
    }
  }
  componentWillMount() {
    this.props.resetTransactionRequested();
  }
  componentDidMount() {
    this.setContract();
  }

  goTo(stage: GovernanceFlowStages, declaredCall: ContractFuncNames, inputs?: any) {
    console.log(declaredCall);
    this.setState((state: State) => {
      let newState = Object.assign({}, state);
      if (inputs) {
        newState.inputs = inputs;
      }
      newState.stage = stage;
      newState.chosenCall = declaredCall;
      newState.currentCall = this.contractOptionsMap()[GOVERNANCECALLS[declaredCall].contractcall];
      return newState;
    });
  }

  private contractOptionsMap() {
    const currentContract = this.state.currentContract;
    const contractFunctions = Contract.getFunctions(currentContract);
    const contractOptions = this.contractOptions(contractFunctions);
    let contractOptionsMap: { [name: string]: any } = {};
    contractOptions.map(value => {
      contractOptionsMap[value.name] = value;
    });
    return contractOptionsMap as any;
  }

  private accessContract(contractAbi: string) {
    const parsedAbi = JSON.parse(contractAbi);
    return new Contract(parsedAbi);
  }
  //Remember that the first chained contract call will also have it's outputs displayed
  //So the order somewhat matters in this situation.
  private chainedContractCalls = new Map([
    ['ballotHistory', ['ballotRecords', 'governanceCycleRecords', 'withdrawRecords']],
    ['withdrawHistory', ['withdrawRecords', 'ballotRecords']],
    ['currentGovernanceCycle', ['governanceCycleRecords']]
  ]);

  private buildFunctionOptions(
    contractCallMap: ContractFuncNames[],
    stateTransition: GovernanceFlowStages
  ) {
    let link: String;
    if (stateTransition === GovernanceFlowStages.FREE_CALL_PAGE) {
      link = 'freeinteract';
    } else if (stateTransition === GovernanceFlowStages.COSTLY_CALL_PAGE) {
      link = 'costlyinteract';
    } else {
      link = 'landingpage';
    }

    return (
      <div className="GovernanceSection-row">
        {contractCallMap.map((contractCall: ContractFuncNames) => {
          const call = GOVERNANCECALLS[contractCall];
          if (!call.chained) {
            return (
              // <Link to={{
              //   pathname:`/${link}`,
              //   state: {

              //   }
              // }}>
              //   <Button
              //     key={contractCall}
              //     name={translateRaw(call.name)}
              //     icon={call.icon}
              //     onClick={() => this.goTo(stateTransition, contractCall)}
              //     description={translateRaw(call.description)}
              //   />
              // </Link>
              <Button
                key={contractCall}
                name={translateRaw(call.name)}
                icon={call.icon}
                onClick={() => this.goTo(stateTransition, contractCall)}
                description={translateRaw(call.description)}
              />
            );
          }
        })}
      </div>
    );
  }

  private goBack() {
    // your transition
    const stage = GovernanceFlowStages.START_PAGE;
    this.props.resetTransactionRequested();
    this.setContract();
    this.setState((state: State) => {
      let newState = Object.assign({}, state);
      newState.stage = stage;
      newState.chosenCall = null;
      newState.inputs = null;
      return newState;
    });
  }

  public componentWillUnmount() {
    this.props.resetTransactionRequested();
  }
  private contractOptions = (contractFunctions: any) => {
    const transformedContractFunction: ContractOption[] = Object.keys(contractFunctions).map(
      contractFunction => {
        const contract = contractFunctions[contractFunction];
        return {
          name: contractFunction,
          contract
        };
      }
    );
    return transformedContractFunction;
  };
  private makePropsForFreeContractCall(chosenCall: ContractFuncNames) {
    const chainedCalls = this.chainedContractCalls.get(GOVERNANCECALLS[chosenCall].contractcall);
    const contractOptionsMap = this.contractOptionsMap();

    const chainedFunctions = chainedCalls
      ? chainedCalls.map(function(value, index, array) {
          return contractOptionsMap[value];
        })
      : null;
    let selectedFunction = contractOptionsMap[GOVERNANCECALLS[chosenCall].contractcall];
    console.log(selectedFunction.contract.outputs, 'selected');
    //Remapping withdrawhistory to ballotHistory function because we can derive the withdrawrecordid
    //throught ballotrecord, and this way people only need to remember the ballot history number not
    //the withdraw history number and ballot history number
    if (chosenCall === FreeContractCallName.WITHDRAW_HISTORY) {
      selectedFunction = contractOptionsMap['ballotHistory'];
      selectedFunction.name = 'withdrawHistory';
    }
    return {
      selectedFunction,
      chosenCall,
      chainedCalls,
      chainedFunctions
    };
  }
  public render() {
    const currentContract = this.state.currentContract;
    const contractFunctions = Contract.getFunctions(currentContract);
    let stages = GovernanceFlowStages;
    let body;
    console.log(this.state.stage);
    console.log(this.state.chosenCall);
    // console.log(this.GOVERNANCECALLS[this.state.chosenCall])
    switch (this.state.stage) {
      case GovernanceFlowStages.START_PAGE:
        body = (
          <React.Fragment>
            <div className="GovernanceSection-topsection">
              <h2 className="ContractSection-topsection-title">
                {translate('GENERATE_GOVERNANCE_TITLE')}
              </h2>
            </div>
            <section className="Tab-content GovernanceSection-content">
              <div>
                {/* <h2 className="GovernanceSection-topsection-subtitle">
                  {translate('GENERATE_GOVERNANCE_DESC')}
                </h2> */}
                {this.buildFunctionOptions(COSTLYFUNCTIONCALLS, stages.COSTLY_CALL_PAGE)}
                {this.buildFunctionOptions(FREEFUNCTIONCALLS, stages.FREE_CALL_PAGE)}
                <a
                  href="https://support.eximchain.com/hc/en-us/articles/360020960333-How-to-participate-in-Governance/"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  How to participate in Governance
                </a>
              </div>
            </section>
          </React.Fragment>
        );
        break;
      case GovernanceFlowStages.FREE_CALL_PAGE:
        let freeProps = this.makePropsForFreeContractCall(this.state.chosenCall);
        // console.log(freeProps)
        body = (
          <FreeContractCallScreen
            selectedFunction={freeProps.selectedFunction}
            contractCall={freeProps.chosenCall}
            chainedCalls={freeProps.chainedCalls}
            chainedFunctions={freeProps.chainedFunctions}
            goBack={this.goBack}
            goTo={this.goTo}
          />
        );
        break;
      case GovernanceFlowStages.COSTLY_CALL_PAGE:
        body = (
          <CostlyContractCallScreen
            selectedFunction={this.state.currentCall}
            goBack={this.goBack}
            contractCall={this.state.chosenCall}
            defaultInput={this.state.inputs}
          />
        );
        break;
    }
    return (
      <TabSection isUnavailableOffline={true}>
        <React.Fragment>{body}</React.Fragment>
      </TabSection>
    );
  }
}

export default connect(mapStateToProps, {
  setCurrentTo,
  resetTransactionRequested: transactionFieldsActions.resetTransactionRequested
})(GovernanceClass);
