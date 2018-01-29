var configJson = {
  'baseUrl' : 'https://dev.acuo.com/',
  '$qa_baseUrl' : 'http://traefik/',
  '$uat_baseUrl' : 'http://traefik/',
  '$kube_baseUrl' : 'http://',
  GET_DASHBOARD_URL: '<%= baseUrl %>margin/acuo/api/margin/dashboard',
  GET_RECON_URL: '<%= baseUrl %>margin/acuo/api/margin/items/all/999',
  GET_UNMATCHED_URL: '<%= baseUrl %>margin/acuo/api/margin/items/unmatched/999',
  GET_OPTIMISATION_URL: '<%= baseUrl %>margin/acuo/api/pledge/settings/optimization/999',
  GET_PLEDGE_SELECTIONS_URL: '<%= baseUrl %>margin/acuo/api/pledge/items/all/999',
  GET_COLLATERAL_URL: '<%= baseUrl %>collateral/acuo/api/assets/eligible/client/999',
  GET_EARMARKED_COLLATERAL_URL: '<%= baseUrl %>collateral/acuo/api/assets/reserved/client/999',
  POST_PLEDGE_SELECTIONS_URL: '<%= baseUrl %>collateral/acuo/api/optimization/allocate',
  POST_PLEDGE_ALLOCATIONS_URL: '<%= baseUrl %>margin/acuo/api/pledge/assets/transfer',
  GET_RECON_DISPUTES_URL: '<%= baseUrl %>margin/acuo/api/dispute/items/all/999',
  POST_RECON_DISPUTE_URL: '<%= baseUrl %>margin/acuo/api/dispute/add',
  GET_CURRENCY_INFO_URL : '<%= baseUrl %>margin/acuo/api/margin/fxvalue/999',
  POST_REMOVE_ALLOCATED_ASSET: '<%= baseUrl %>collateral/acuo/api/optimization/update',
  POST_UPLOAD_PORTFOLIO: '<%= baseUrl %>valuation/acuo/api/upload/v1',
  GET_RECONCILE_URL: '<%= baseUrl %>margin/acuo/api/margin/reconcile/',
  REQUEST_VALUATION: '<%= baseUrl %>valuation/acuo/api/calls/split/portfolios',
  REQUEST_GENERATE_MARGINCALLS: '<%= baseUrl %>valuation/acuo/api/calls/generate/portfolios',
  GET_DEPLOYED_DEPARTURES: '<%= baseUrl %>margin/acuo/api/pledge/assets/all',
  GET_NAVBAR_ALERTS: '<%= baseUrl %>margin/acuo/api/dashboard/menu',
  MARGIN_HEALTH_CHECK: '<%= baseUrl %>margin/acuo/admin/ping',
  VALUATION_HEALTH_CHECK: '<%= baseUrl %>valuation/acuo/admin/ping',
  COLLATERAL_HEALTH_CHECK: '<%= baseUrl %>collateral/acuo/admin/ping',
  LOGIN_URL: '<%= baseUrl %>auth/acuo/api/login/clientId/',
  REQUEST_SEND_MARGIN_CALLS: '<%= baseUrl %>margin/acuo/api/margin/send/calls',

  GET_ANALYTICS_TEST_CLIENT: '<%= baseUrl %>analytics/analytics',
  GET_ANALYTICS_TEST_CPTY: '<%= baseUrl %>analytics/analytics/cpty'
};

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
  console.log('Current config environment accessed is ' + (env || 'dev'))
  var config = require('json-configurator')(configJson, env);
  return config
}
