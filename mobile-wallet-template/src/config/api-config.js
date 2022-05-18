/* App config for apis
 */
const ApiConfig = {
  /* Mainnet */
  BASE_EXPLORER_URL: 'https://uniscan.world/api',
  UNI_SCAN_URL: 'https://uniscan.world',
  BASE_URL: 'https://node.unichain.world',
  RELAY_NODE: 'https://relay-node-1.unichain.world',

  /* Testnet */
  // BASE_EXPLORER_URL: 'https://testnet.unichain.world/api',
  // UNI_SCAN_URL: 'https://testnet.unichain.world',
  // BASE_URL: 'https://test-seed.unichain.world',
  // RELAY_NODE: 'https://test-seed-relay.unichain.world',

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
