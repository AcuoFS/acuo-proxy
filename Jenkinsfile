@Library('github.com/anaxo-io/pipeline-library@develop') _

pipeline {

    agent { label 'ubuntu_agent' }
    triggers {
        pollSCM("")
    }
    
    stages {
        stage ('Checkout') {
            steps {
                deleteDir()
                checkout scm
            }
        }
        stage("Docker Build & Push") {
            steps {
                aws {
                    sh 'make docker-build'
                    sh 'make docker-tag'
                    sh 'make docker-login'
                    sh 'make docker-push'
                }
            }
        }
        stage("Kubernetes Deploy 'acuo'") {
            when {
                expression {
                    return env.BRANCH_NAME == "develop"
                }
            }
            steps {
                aws {
                    useKubeConfig {
                        withEnv(['K8_NAMESPACE=acuo']) {
                            sh 'make k8-nodes'
                            sh 'make k8-deployments'
                            sh 'make k8-rollout'
                            sh 'make k8-rollout-status'
                            sh 'make k8-deployments'
                        }
                    }
                }
            }
        }
        stage("Kubernetes Deploy 'qa'") {
            when {
                expression {
                    return env.BRANCH_NAME == "develop"
                }
            }
            steps {
                aws {
                    useKubeConfig {
                        withEnv(['K8_NAMESPACE=qa']) {
                            sh 'make k8-nodes'
                            sh 'make k8-deployments'
                            sh 'make k8-rollout'
                            sh 'make k8-rollout-status'
                            sh 'make k8-deployments'
                        }
                    }
                }
            }
        }
    }        
}