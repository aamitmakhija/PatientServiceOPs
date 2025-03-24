pipeline {
    agent any

    environment {
        NODEJS_HOME = tool name: 'NodeJS', type: 'NodeJSInstallation'
        PATH = "${NODEJS_HOME}/bin:${env.PATH}"
    }

    stages {
        stage('Checkout SCM') {
            steps {
                checkout scm
            }
        }

        stage('OWASP ZAP Security Scan') {
            steps {
                sh '''
                  docker run -u zap --network host -v $(pwd):/zap/wrk owasp/zap2docker-stable zap-baseline.py \
                  -t http://localhost:5005 \
                  -r zap-report.html || true
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm run test || true'
                junit 'test-results/results.xml'
            }
        }

        stage('Build & Push Docker Image') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                    sh '''
                      echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
                      docker build -t amitmakhija2308/api-gateway:${BUILD_ID} ./api-gateway
                      docker push amitmakhija2308/api-gateway:${BUILD_ID}
                    '''
                }
            }
        }
    }

    post {
        always {
            echo 'Security scan and pipeline completed.'
            archiveArtifacts artifacts: 'zap-report.html', fingerprint: true
        }
    }
}