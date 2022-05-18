import { NETWORK_CONFIG } from "./customize";

/* App config for apis
 */
const ApiConfig = {

  BASE_EXPLORER_URL: NETWORK_CONFIG.BASE_EXPLORER_URL,
  UNI_SCAN_URL: NETWORK_CONFIG.UNI_SCAN_URL,
  BASE_URL: NETWORK_CONFIG.BASE_URL,
  RELAY_NODE: NETWORK_CONFIG.RELAY_NODE,

  LOGIN: '/api/login',
  VALIDATE_LOGIN: '/validate/validate_login_mobile',
  NEW_ACCESS_TOKEN: '',
  GET_ALL_TRANSACTION: '/get-transactions-address',
  SEND_FUTURE: '/wallet/createfuturetransaction',
  LIST_FUTURE_TOKEN_TRANSFER: '/wallet/getfuturetoken',
  TRANSFER_TOKEN: '/wallet/transfertoken',
  LIST_FUTURE_COIN: '/wallet/getfuturetransfer',
  WITHDRAW_FUTURE_TRANSACTIONS: '/wallet/withdrawfuturetransaction',
  WITHDRAW_FUTURE_TOKEN: '/wallet/withdrawfuturetoken',
  GET_ALL_TOKEN_POOL: '/wallet/gettokenpool',
  GET_TOKEN_DETAIL: '/wallet/gettokenpool',
  PURCHASE_TOKEN: '/wallet/exchangetoken',
  MINE_TOKEN: '/wallet/minetoken',
  BURN_TOKEN: '/wallet/burntoken',
  CONTRIBUTE_TOKEN: '/wallet/contributetokenfee',
  CREATE_NFT_TEMPLATE: '/wallet/createnftcontract',
  FETCH_NFT_TEMPLATES: '/wallet/listnftcontract',
  MINT_NFT_TOKEN: '/wallet/mintnfttoken',
  FETCH_NFT_TOKENS: '/wallet/listnfttoken',
  TRANSFER_NFT_TOKENS: '/wallet/transfernfttoken',
  RENOUNCE_NFT_MINTER: '/wallet/renouncenftminter',
  REPLACE_NFT_MINTER: '/wallet/addnftminter',
  BURN_NFT_TOKEN: '/wallet/burnnfttoken',
  APPROVE_NFT_TOKENS: '/wallet/approvenfttoken',
  FETCH_NFT_APPROVE_TOKENS: '/wallet/listnfttokenapprove',
  APPROVE_ALL_NFT_TOKENS: '/wallet/approveforallnfttoken',
  GET_APPROVE_ALL_TOKEN: '/wallet/listnfttokenapproveall',
  GET_S3_SIGNED_URL: '/v1/s3/signed-url',
};

export default ApiConfig;
