const DashboardRoute = require('./Dashboard')
const ReconRoute = require('./Recon')
const PledgeRoute = require('./Pledge')
const UnmatchedRoute = require('./UnmatchedPortfolio')
const CommonRoute = require('./Common')
const UploadPortfolioRoute = require('./UploadPortfolio')

module.exports = [
  DashboardRoute,
  ReconRoute,
  PledgeRoute,
  UnmatchedRoute,
  CommonRoute,
  UploadPortfolioRoute
]
