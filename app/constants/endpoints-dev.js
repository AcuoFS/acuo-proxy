// Dashboard
const GET_DASHBOARD_URL = 'http://margin.acuo.com/acuo/api/margin/dashboard'

// Recon
const GET_RECON_URL = 'http://margin.acuo.com/acuo/api/margin/items/all/999'

// Unmatched
const GET_UNMATCHED_URL = 'http://margin.acuo.com/acuo/api/margin/items/unmatched/999'

// Pledge
const GET_OPTIMISATION_URL = 'http://margin.acuo.com/acuo/api/pledge/settings/optimization/999'
const GET_PLEDGE_SELECTIONS_URL = 'http://margin.acuo.com/acuo/api/pledge/items/all/999'
const GET_COLLATERAL_URL = 'http://collateral.acuo.com/acuo/api/assets/eligible/client/999'
const GET_EARMARKED_COLLATERAL_URL = 'http://collateral.acuo.com/acuo/api/assets/reserved/client/999'
const POST_PLEDGE_SELECTIONS_URL = 'http://collateral.acuo.com/acuo/api/optimization/allocate'
const POST_PLEDGE_ALLOCATIONS_URL = 'http://collateral.acuo.com/acuo/api/pledge'

module.exports = {
  GET_DASHBOARD_URL,
  GET_RECON_URL,
  GET_UNMATCHED_URL,
  GET_OPTIMISATION_URL,
  GET_PLEDGE_SELECTIONS_URL,
  GET_COLLATERAL_URL,
  GET_EARMARKED_COLLATERAL_URL,
  POST_PLEDGE_SELECTIONS_URL,
  POST_PLEDGE_ALLOCATIONS_URL
}