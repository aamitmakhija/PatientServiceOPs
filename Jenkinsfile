pipeline {
    agent any

    environment {
        DOCKER_USERNAME = credentials('docker-username') // Use the ID from Jenkins credentials
        DOCKER_PASSWORD = credentials('docker-password') // Use the ID from Jenkins credentials
        NODEJS_HOME = tool name: 'NodeJS', type: 'NodeJSInstallation' // Add this line to set NodeJS path
        PATH = "${NODEJS_HOME}/bin:${env.PATH}" // Ensure npm and node are accessible
    }

    stages {
        stage('Install Dependencies') {
            steps {
                script {
                    // Install Node.js dependencies
                    sh 'npm install'
                }
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    // Run tests using Mocha and Chai
                    sh 'npm run test'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // Build Docker images for your services
                    sh 'docker build -t amitmakhija2308/apigateway:${BUILD_ID} ./api-gateway'
                    sh 'docker build -t amitmakhija2308/ward-service:${BUILD_ID} ./04-WardService'
                    sh 'docker build -t amitmakhija2308/admission-service:${BUILD_ID} ./03-AdmissionService'
                    sh 'docker build -t amitmakhija2308/patient-service:${BUILD_ID} ./02-PatientService'
                    sh 'docker build -t amitmakhija2308/auth-service:${BUILD_ID} ./01-AuthService'
                }
            }
        }

        stage('Push Docker Image to Docker Hub') {
            steps {
                script {
                    // Login to Docker Hub
                    sh 'docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD'
                    // Push Docker images to Docker Hub
                    sh 'docker push amitmakhija2308/apigateway:${BUILD_ID}'
                    sh 'docker push amitmakhija2308/ward-service:${BUILD_ID}'
                    sh 'docker push amitmakhija2308/admission-service:${BUILD_ID}'
                    sh 'docker push amitmakhija2308/patient-service:${BUILD_ID}'
                    sh 'docker push amitmakhija2308/auth-service:${BUILD_ID}'
                }
            }
        }
    }

    post {
        always {
            echo 'This will always run after the pipeline execution.'
        }
    }
}