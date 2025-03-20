pipeline {
    agent any

    environment {
        DOCKER_USERNAME = credentials('docker-username') // Make sure to set this up in Jenkins credentials
        DOCKER_PASSWORD = credentials('docker-password')
    }

    stages {
        // Stage 1: Install Dependencies
        stage('Install Dependencies') {
            steps {
                script {
                    // Install Node.js dependencies
                    sh 'npm install'
                }
            }
        }

        // Stage 2: Run Tests
        stage('Run Tests') {
            steps {
                script {
                    // Run tests using Mocha and Chai
                    sh 'npm run test'
                }
            }
        }

        // Stage 3: Build Docker Image
        stage('Build Docker Image') {
            steps {
                script {
                    // Build Docker images for your services
                    sh 'docker build -t amitmakhija2308/apigateway:v3 ./api-gateway'
                    sh 'docker build -t amitmakhija2308/ward-service:v3 ./04-WardService'
                    sh 'docker build -t amitmakhija2308/admission-service:v3 ./03-AdmissionService'
                    sh 'docker build -t amitmakhija2308/patient-service:v3 ./02-PatientService'
                    sh 'docker build -t amitmakhija2308/auth-service:v3 ./01-AuthService'
                }
            }
        }

        // Stage 4: Push Docker Image to Docker Hub
        stage('Push Docker Image to Docker Hub') {
            steps {
                script {
                    // Push Docker images to Docker Hub
                    sh 'docker push amitmakhija2308/apigateway:v3'
                    sh 'docker push amitmakhija2308/ward-service:v3'
                    sh 'docker push amitmakhija2308/admission-service:v3'
                    sh 'docker push amitmakhija2308/patient-service:v3'
                    sh 'docker push amitmakhija2308/auth-service:v3'
                }
            }
        }
    }

    post {
        always {
            // Clean up if needed or notify for success/failure
            echo 'This will always run after the pipeline execution.'
        }
    }
}