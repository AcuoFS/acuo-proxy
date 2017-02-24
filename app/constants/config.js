const config = {
  dev: {
    GET_DASHBOARD_URL: 'http://margin.acuo.com/acuo/api/margin/dashboard',
    GET_RECON_URL: 'http://margin.acuo.com/acuo/api/margin/items/all/999',
    GET_UNMATCHED_URL: 'http://margin.acuo.com/acuo/api/margin/items/unmatched/999',
    GET_OPTIMISATION_URL: 'http://margin.acuo.com/acuo/api/pledge/settings/optimization/999',
    GET_PLEDGE_SELECTIONS_URL: 'http://margin.acuo.com/acuo/api/pledge/items/all/999',
    GET_COLLATERAL_URL: 'http://collateral.acuo.com/acuo/api/assets/eligible/client/999',
    GET_EARMARKED_COLLATERAL_URL: 'http://collateral.acuo.com/acuo/api/assets/reserved/client/999',
    POST_PLEDGE_SELECTIONS_URL: 'http://collateral.acuo.com/acuo/api/optimization/allocate',
    POST_PLEDGE_ALLOCATIONS_URL: 'http://collateral.acuo.com/acuo/api/pledge'
  },
  qa: {
    GET_DASHBOARD_URL: '',
    GET_RECON_URL: '',
    GET_UNMATCHED_URL: '',
    GET_OPTIMISATION_URL: '',
    GET_PLEDGE_SELECTIONS_URL: '',
    GET_COLLATERAL_URL: '',
    GET_EARMARKED_COLLATERAL_URL: '',
    POST_PLEDGE_SELECTIONS_URL: '',
    POST_PLEDGE_ALLOCATIONS_URL: ''
  },
  prod: {}
}

/**
 * https://medium.com/node-and-beyond/environment-dependent-node-js-configuration-b51149286e7e#.lq4cmz3dg
 * Use DOCKER_ENV='qa' node app.js to configure proxy to pick up URLs from config.qa
 *
 * @param env
 * @returns {*|config.dev|{GET_DASHBOARD_URL, GET_RECON_URL, GET_UNMATCHED_URL,
 * GET_OPTIMISATION_URL, GET_PLEDGE_SELECTIONS_URL, GET_COLLATERAL_URL,
 * GET_EARMARKED_COLLATERAL_URL, POST_PLEDGE_SELECTIONS_URL, POST_PLEDGE_ALLOCATIONS_URL}}
 */
exports.get = (env) => {
  return config[env] || config.dev
}