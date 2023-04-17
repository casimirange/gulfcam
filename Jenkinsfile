pipeline {
   environment{
        registryProject='registry.gitlab.com/afrikpay1/gulfcam-angular'
        IMAGE="${registryProject}"
        dockerImage = ""
        REMOTE_BRANCH_NAME = "${GIT_BRANCH.split("/")[1]}"
   }

   agent any

   stages {
      stage('Clone') {
         steps {
            checkout scm
         }
      }

      stage('Build docker image'){        
         steps{
            script {   
               if("${REMOTE_BRANCH_NAME}" == 'dev'){
                  sh "rm -f src/environments/environment.ts && cp src/environments/environment.dev.ts src/environments/environment.ts"
                  docker.withTool('docker'){
                        dockerImage = docker.build("$IMAGE", '.')
                  }
               }else if ("${REMOTE_BRANCH_NAME}" == 'master') {
                  sh "rm -f src/environments/environment.ts && cp src/environments/environment.prod.ts src/environments/environment.ts"
                  docker.withTool('docker'){
                        dockerImage = docker.build("$IMAGE", '.')
                  }
               }                         
            }
         }
      }

      stage('Push in registry'){
         steps{
            script{
               if ("${REMOTE_BRANCH_NAME}" == 'dev'){
                  docker.withRegistry('https://registry.gitlab.com', 'gitlab-credential') {
                     dockerImage.push("dev-$BUILD_NUMBER")
                     dockerImage.push 'dev-latest'
                  }
               }else if("${REMOTE_BRANCH_NAME}" == 'master'){
                   docker.withRegistry('https://registry.gitlab.com', 'gitlab-credential') {
                     dockerImage.push("$BUILD_NUMBER")
                     dockerImage.push 'latest'
                  }
               }
            }
         }
      }

      stage ('Deploy on gulfcam dev server') {
         steps{
               sshagent(credentials : ['connect-ssh-dev-server']) {
                  sh 'ssh -o StrictHostKeyChecking=no -t $USERNAME@$SSH_HOST_GULFCAM  "docker pull ${registryProject}:${BUILD_NUMBER} && docker ps -q --filter name=$APPLICATION_NAME | grep -q . && docker stop $APPLICATION_NAME || true && docker rm $APPLICATION_NAME || true && docker run -p 9010:80 -d --restart=always --name $APPLICATION_NAME --network=local-network ${registryProject}:${BUILD_NUMBER}"'
               }
         }
         post{
            always{
               emailext to: "$RECIPIENTS",
               subject: "${env.JOB_NAME}:${currentBuild.currentResult}",
               body: "${currentBuild.currentResult}: Job ${env.JOB_NAME} is ${currentBuild.currentResult}."
            }
         }
      }
   }
}


