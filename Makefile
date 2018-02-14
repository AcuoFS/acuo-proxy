IMAGE_NAME=acuo-proxy
DOCKER_REGISTRY=038337692500.dkr.ecr.ap-southeast-1.amazonaws.com
DOCKER_LOGIN_CMD:=$(shell docker run -i --rm -e AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID} -e AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY} mesosphere/aws-cli ecr get-login --no-include-email --region ap-southeast-1)
K8_DEPLOYMENT=proxy
K8_DEPLOYMENT_CONTAINER=proxy
APP_VERSION:=$(shell docker run -i --rm -v $$(pwd)/package.json:/app/package.json -w /app node:alpine node -p "require('./package.json').version")

.PHONY: docker-build docker-tag docker-login docker-push k8-nodes k8-deployments k8-rollout k8-rollout-status docker k8 full

full: docker-build docker-tag docker-login docker-push k8-nodes k8-deployments k8-rollout k8-rollout-status k8-deployments

docker: docker-build docker-tag docker-login docker-push

k8: k8-nodes k8-deployments k8-rollout k8-rollout-status k8-deployments

docker-build:
	docker build -t ${IMAGE_NAME}:latest .

docker-tag:
	docker tag ${IMAGE_NAME}:latest ${DOCKER_REGISTRY}/${IMAGE_NAME}:latest
	docker tag ${IMAGE_NAME}:latest ${DOCKER_REGISTRY}/${IMAGE_NAME}:${APP_VERSION}
	docker tag ${IMAGE_NAME}:latest ${DOCKER_REGISTRY}/${IMAGE_NAME}:${GIT_COMMIT}
	docker tag ${IMAGE_NAME}:latest ${DOCKER_REGISTRY}/${IMAGE_NAME}:build_${BUILD_NUMBER}

docker-login:
	@eval ${DOCKER_LOGIN_CMD}

docker-push:
	docker push ${DOCKER_REGISTRY}/${IMAGE_NAME}:latest
	docker push ${DOCKER_REGISTRY}/${IMAGE_NAME}:${APP_VERSION}
	docker push ${DOCKER_REGISTRY}/${IMAGE_NAME}:${GIT_COMMIT}
	docker push ${DOCKER_REGISTRY}/${IMAGE_NAME}:build_${BUILD_NUMBER}

k8-nodes:
	kubectl get nodes

k8-deployments:
	kubectl -n ${K8_NAMESPACE} get deployment ${K8_DEPLOYMENT} -o wide

k8-rollout:
	kubectl -n ${K8_NAMESPACE} set image deployment/${K8_DEPLOYMENT} ${K8_DEPLOYMENT_CONTAINER}=${DOCKER_REGISTRY}/${IMAGE_NAME}:${GIT_COMMIT}

k8-rollout-status:
	kubectl -n ${K8_NAMESPACE} rollout status deployment/${K8_DEPLOYMENT}

