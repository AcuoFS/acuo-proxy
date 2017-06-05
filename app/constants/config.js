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
        POST_PLEDGE_ALLOCATIONS_URL: 'http://margin.acuo.com/acuo/api/pledge/assets/transfer',
        GET_RECON_DISPUTES_URL: 'http://margin.acuo.com/acuo/api/dispute/items/all/999',
        POST_RECON_DISPUTE_URL: 'http://margin.acuo.com/acuo/api/dispute/add',
        GET_CURRENCY_INFO_URL : 'http://margin.acuo.com/acuo/api/margin/fxvalue/999',
        POST_REMOVE_ALLOCATED_ASSET: 'http://collateral.acuo.com/acuo/api/optimization/update'
    },
  docker: {
      GET_DASHBOARD_URL: 'http://traefik/margin/acuo/api/margin/dashboard',
        GET_RECON_URL: 'http://traefik/margin/acuo/api/margin/items/all/999',
        GET_UNMATCHED_URL: 'http://traefik/margin/acuo/api/margin/items/unmatched/999',
        GET_OPTIMISATION_URL: 'http://traefik/margin/acuo/api/pledge/settings/optimization/999',
        GET_PLEDGE_SELECTIONS_URL: 'http://traefik/margin/acuo/api/pledge/items/all/999',
        GET_COLLATERAL_URL: 'http://traefik/collateral/acuo/api/assets/eligible/client/999',
        GET_EARMARKED_COLLATERAL_URL: 'http://traefik/collateral/acuo/api/assets/reserved/client/999',
        POST_PLEDGE_SELECTIONS_URL: 'http://traefik/collateral/acuo/api/optimization/allocate',
        POST_PLEDGE_ALLOCATIONS_URL: 'http://traefik/margin/acuo/api/pledge/assets/transfer',
        GET_RECON_DISPUTES_URL: 'http://traefik/margin/acuo/api/dispute/items/all/999',
        POST_RECON_DISPUTE_URL: 'http://traefik/margin/acuo/api/dispute/add',
        GET_CURRENCY_INFO_URL : 'http://traefik/margin/acuo/api/margin/fxvalue/999',
        POST_REMOVE_ALLOCATED_ASSET: 'http://traefik/collateral/acuo/api/optimization/update'
    },
  qa: {
      GET_DASHBOARD_URL: 'http://margin:7070/acuo/api/margin/dashboard',
        GET_RECON_URL: 'http://margin:7070/acuo/api/margin/items/all/999',
        GET_UNMATCHED_URL: 'http://margin:7070/acuo/api/margin/items/unmatched/999',
        GET_OPTIMISATION_URL: 'http://margin:7070/acuo/api/pledge/settings/optimization/999',
        GET_PLEDGE_SELECTIONS_URL: 'http://margin:7070/acuo/api/pledge/items/all/999',
        GET_COLLATERAL_URL: 'http://collateral:8080/acuo/api/assets/eligible/client/999',
        GET_EARMARKED_COLLATERAL_URL: 'http://collateral:8080/acuo/api/assets/reserved/client/999',
        POST_PLEDGE_SELECTIONS_URL: 'http://collateral:8080/acuo/api/optimization/allocate',
        POST_PLEDGE_ALLOCATIONS_URL: 'http://margin:7070/acuo/api/pledge/assets/transfer',
        GET_RECON_DISPUTES_URL: 'http://margin:7070/acuo/api/dispute/items/all/999',
        POST_RECON_DISPUTE_URL: 'http://margin:7070/acuo/api/dispute/add',
        GET_CURRENCY_INFO_URL : 'http://margin:7070/acuo/api/margin/fxvalue/999',
        POST_REMOVE_ALLOCATED_ASSET: 'http://collateral:8080/acuo/api/optimization/update'
    },
  prod: {}
}



/**
 * https://medium.com/node-and-beyond/environment-dependent-nodejs-configuration-b51149286e7e#.lq4cmz3dg
 * Use DOCKER_ENV='qa' node app.js to configure proxy to pick up URLs from config.qa
 *
 * @param env
 * @returns {*|config.dev|{GET_DASHBOARD_URL, GET_RECON_URL, GET_UNMATCHED_URL,
 * GET_OPTIMISATION_URL, GET_PLEDGE_SELECTIONS_URL, GET_COLLATERAL_URL,
 * GET_EARMARKED_COLLATERAL_URL, POST_PLEDGE_SELECTIONS_URL, POST_PLEDGE_ALLOCATIONS_URL}}
 */
exports.get = (env) => {
  console.log('Current config environment accessed is ' + (env || 'dev'))
  return config[env] || config.dev
}