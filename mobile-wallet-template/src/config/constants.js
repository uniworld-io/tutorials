import ApiConfig from './api-config';
import { CONSTANTS } from './customize';

export const Constants = {
  ACCESS_TOKEN: 'ACCESS_TOKEN',
  REFRESH_TOKEN: 'REFRESH_TOKEN',
  LOCALE_PERSISTENCE_KEY: 'LANGUAGE',
  ENCRYPT_ALGOROTHMS: 'aes-256-cbc',
  ENCRYPTION_KEY: 'F!@@%12trf@!#D@!%@#4t23fg1',
  IMPORTANT_WALLET: [
    'UWP6ZUUXGtd5HYBVu8VBkLzy1nya6ouyWT',
    'UPyPVSpNfxLtZR79FJ8YV52qmXpQRxHqUM',
    'Uj5Nxco2ADWpkr2fk5F87gSQmhMZcKB8iP',
    'UkLNAL4EQSf9o9uDvPLKwQC6fSHnbTsR61',
  ],
  MY_WALLET_ADDRESS: 'UgHXvUjsvX1a91PkHwwoR6gUxoXecYBb34',
};

export const checkImportantWallet = val => {
  // return Constants.IMPORTANT_WALLET.includes(val);
  return false;
};

export const EXPLORE_URL = 'https://uniscan.world/transaction/';

export const MESSAGES = {
  WRONG_PWD: 'Password is incorrect',
  NOT_BLANK: 'This field must be filled',
  ISSUE_TOKEN_FAILS: 'Issue Token Fails! Pleas try again',
  ISSUE_TOKEN_SUCCESS: 'Issue Token success',
  ISSUE_TOKEN_FUTURE_SUCCESS: 'Issue Token future success',
  ISSUE_TOKEN_UPDATE_SUCCESS: 'Update Token success',

  CONTRIBUTE_TOKEN_SUCCESS: 'Contribute Token success',
  BURN_TOKEN_SUCCESS: 'Burn Token success',
  MINE_TOKEN_SUCCESS: 'Mine Token success',
  TRANSFER_TOKEN_SUCCESS: 'Transfer Token success',
  WITHDRAW_TOKEN_FUTURE_SUCCESS: 'Withdraw Token future success',

  WITHDRAW_TOKEN_FUTURE_TRANSACTION_SUCCESS:
    'Withdraw Token transaction future success',
  LOCK_UNW_SUCCESS: `Lock ${CONSTANTS.CURRENCY} success! You can vote now!`,
  LOCK_UNW_FAILS: `Lock ${CONSTANTS.CURRENCY} fails! Please try again`,
  BALANCE_NOT_ENOUGH: 'Your balance not available!',

  VOTE_WITNESS_SUCCESS: 'Vote witness success',
  VOTE_WITNESS_FAILS: 'Vote witness fails',

  BUY_UNW_TOKEN_SUCCESS: 'Buy token success',
  BUY_UNW_TOKEN_FAILS: 'Buy token fails',

  PWD_BLANK: 'Password blank!',
  INPUT_PASSWORD_COMPLEX:
    'Password has least 8 character, there is a lower-case letter, least 1 lowercase,  1 uppercase,  1 numeric or symbol character',
  UNW_ADDRESS_INCORRECT: `${CONSTANTS.CURRENCY} address is incorrect!`,
  ADDRESS_NOT_VALID: ' Address is invalid!',
  PASSWORD_INCORRECT: 'Password wrong! Please try again!',

  SEND_UNW_SUCCESS: 'Your transaction is completed!',
  SEND_FAIL: 'Sorry, your transaction has been rejected!',
  SEND_UNW_FAILS: `Sent ${CONSTANTS.CURRENCY} fails!`,
  SEND_UNW_FAILS_PASSWORD:
    `Sent ${CONSTANTS.CURRENCY} fails, please check your password confirm and try again!`,
  SEND_OWNER_ADDRESS: 'Can not send to your address',
  BALANCE_NOT_ENOUGH: 'Balance is not enough! please try again!',

  SEND_UNW_TOKEN_SUCCESS: `Sent ${CONSTANTS.CURRENCY} Token successfully`,
  SEND_UNW_TOKEN_FAILS: `Sent ${CONSTANTS.CURRENCY} Token fails!`,

  PASSWORD_NOT_MATCH: 'Confirm password is not match!',

  FILE_KEY_STORE_INVALIDATE:
    'The input file is not in the correct format! Please select file keystore!',
  NORMAL_ERROR: 'Oop! Have an error',
  INVALID_ADDRESS: 'Invalid address provided',
  ERROR_YOURSELF: 'You cannot send to your own address',
  WITHDRAW_SUCCESS: 'Withdraw successfully!',
  CLAIM_SUCCESS: 'Claim successfully!',

  INVALID_AMOUNT: 'Invalid amount',
  SAVED: 'Saved!',
  EXISTING_ACC: 'Existing name',

  CREATE_NFT_FAILED:
    'Something wrong, create the Nft template failed. Please try again!',
  MINT_NFT_FAILED:
    'Something wrong, mint the Nft token failed. Please try again!',
  GET_NFT_TEMPLATE_FAILED:
    'Something wrong, get the Nft templates failed. Please try again!',
  GET_NFT_TOKEN_FAILED:
    'Something wrong, get the Nft token failed. Please try again!',
  TRANSFER_NFT_TOKEN_FAILED:
    'Something wrong, transfer Nft token failed. Please try again!',
  RENOUNCE_NFT_MINTER_FAILED:
    'Something wrong, renounce Nft minter failed. Please try again!',
  REPLACE_NFT_MINTER_FAILED:
    'Something wrong, replace Nft minter failed. Please try again!',
  BURN_NFT_TOKEN_FAILED:
    'Something wrong, burn Nft token failed. Please try again!',
  APPROVE_NFT_TOKEN_FAILED:
    'Something wrong, approve Nft token failed. Please try again!',
  GET_APPROVE_ALL_NFT_TOKEN_FAILED:
    'Something wrong, get approve all Nft token failed. Please try again!',
  UPLOAD_S3_FAILED: 'Something wrong, upload data failed. Please try again!',
};

export const CONTRACT_TYPE_MAPPING = {
  AccountCreateContract: 'Create Account',
  TransferContract: 'Transfer',
  TransferAssetContract: 'Transfer Token ',
  VoteAssetContract: 'Vote Asset',
  VoteWitnessContract: 'Vote Witness',
  WitnessCreateContract: 'Apply Witness',
  AssetIssueContract: 'Create Token V1',
  WitnessUpdateContract: 'Update Witness',
  ParticipateAssetIssueContract: 'Buy Token',
  AccountUpdateContract: 'Update Account',
  FreezeBalanceContract: 'Lock Coin',
  UnfreezeBalanceContract: 'Unlock Coin',
  WithdrawBalanceContract: 'Withdraw Reward',
  UnfreezeAssetContract: 'Unlock Token',
  UpdateAssetContract: 'Update Token',
  ProposalCreateContract: 'Create Proposal',
  ProposalApproveContract: 'Approve Proposal',
  ProposalDeleteContract: 'Delete Proposal',
  SetAccountIdContract: 'Set Account ID',
  CustomContract: 'Custom ',
  CreateSmartContract: 'Create Smart Contract',
  TriggerSmartContract: 'Trigger Smart Contract',
  GetContract: 'Get Contract',
  UpdateSettingContract: 'Update Setting ',
  UpdateEnergyLimitContract: 'Update Enery Limit',
  AccountPermissionUpdateContract: 'Update Account Permission',
  ClearABIContract: 'Clear ABI',
  UpdateBrokerageContract: 'Update Witness Ratio',
  FutureTransferContract: 'Future Transfer ',
  FutureWithdrawContract: `Withdraw Future ${CONSTANTS.CURRENCY}`,
  CreateTokenContract: 'Create Token ',
  ContributeTokenPoolFeeContract: 'Contribute Token Fee ',
  UpdateTokenParamsContract: 'Update Token ',
  MineTokenContract: 'Mint Token ',
  BurnTokenContract: 'Burnt Token ',
  TransferTokenContract: 'Transfer Token ',
  WithdrawFutureTokenContract: 'Withdraw Future Token ',
  TransferTokenOwnerContract: 'Change Token Owner',
  ExchangeTokenContract: 'Exchange Token',
};

export const ITEM_PER_PAGE = 10;

export const TOKEN_ACTIONS = {
  CONTRIBUTE: 'CONTRIBUTE',
  BUY: 'BUY',
  BURN: 'BURN',
  MINE: 'MINE',
};

export const ACTION_TOKEN_MAPPING = {
  [TOKEN_ACTIONS.BUY]: ApiConfig.PURCHASE_TOKEN,
  [TOKEN_ACTIONS.BURN]: ApiConfig.BURN_TOKEN,
  [TOKEN_ACTIONS.MINE]: ApiConfig.MINE_TOKEN,
  [TOKEN_ACTIONS.CONTRIBUTE]: ApiConfig.CONTRIBUTE_TOKEN,
};

export const ACTION_TOKEN_BY_NATIVE_UNW = [
  TOKEN_ACTIONS.BUY,
  TOKEN_ACTIONS.CONTRIBUTE,
];

export const LOCAL_KEYS = {
  FAV_ACC: 'FAV_ACC',
};

export const TOKEN_TOOLTIPS = {
  tokenName:
    'The name of the token. The name must be unique, less than 32 human readable characters.',
  abbr: 'Abbreviation of the token, Token Symbol should less than 32 human readable characters',
  totalSupply:
    'Total supply is the supply at the token creation. It should be integer number with the range from 1 to 2^63 - 1',
  maxSupply:
    'The maximum supply of the token. It should be integer number with the range from 1 to 2^63 -1',
  startTime:
    'Start time is the time that token can be used. Token can be issued for future uses. Date and time are from UTC timezone. The default value is now (token can be used after creation)',
  url: 'The url to website or information of token creators.',
  endTime:
    'End time is the time that token cannot be used. The default value is 50 years and maximum value is 200 years (from now)',
  extraFeeRate:
    'The extra fee rate is the transaction fee calculated in percentage of transferred amount. For example, if the extra fee rate is 1%, when transferring  100 token X from user A to user B, there will be 100 token X transferred from A to B, 1 token X will be transferred to the token creator. Value range of extra fee is from 0 - 100',
  fee: 'The transaction fee for transferring a token regardless of token amount. Please note that the token transaction fee of transferring a token will be transaction fee and extra fee.  For example, if the fee is set to 2, the extra fee rate is set to 1%. The total transaction fee when transfering 100 token X will be 2 + 1% * 100 = 3 token X, total token subtracted  from source account will be 103 token X.',
  lot: 'The minimum token amount to transfer in each transaction. It should be integer number with the range from 1 to 2^63 - 1',
  feePool:
    `The initial fee pool for token. Minimum value is 10 ${CONSTANTS.CURRENCY} (enough for 37453 transactions at the moment) and everyone can alway contribute a token fee pool later.`,
  description: 'The brief description of the token',
  conversionRate:
    `The rate when users exchange ${CONSTANTS.CURRENCY} to token. This conversion rate is calculated by the number of token and number of ${CONSTANTS.CURRENCY} in Ginza unit below. Please note that 1 ${CONSTANTS.CURRENCY} = 10^6 Ginza.`,
  create_account_fee:
    'Fee measured by token if creating new account (0 < fee < 10,000,000)',
};
