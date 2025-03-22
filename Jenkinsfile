pipeline {
    agent any

    environment {
        DOCKER_USERNAME = credentials('docker-username') // Use the ID from Jenkins credentials
        DOCKER_PASSWORD = credentials('docker-password') // Use the ID from Jenkins credentials
        NODEJS_HOME = tool name: 'NodeJS', type: 'NodeJSInstallation' // Add this line to set NodeJS path
        PATH = "${NODEJS_HOME}/bin:${env.PATH}" // Ensure npm and node are accessible
    }
    
    stages {
        stage('Checkout SCM') {
            steps {
                checkout scm
            }
        }

        stage('Run OWASP ZAP Security Scan') {
            steps {
                script {
                    // Start OWASP ZAP in the background (Docker container)
                    sh 'docker run -d -u zap --name zap -t owasp/zap2docker-stable zap-full-scan.py -t http://your-app-url.com'
                }
            }
        }

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
                    // Build Docker image for your services
                    sh 'docker build -t amitmakhija2308/api-gateway:${BUILD_ID} ./api-gateway'
                    // Additional docker build commands
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    // Push Docker image to Docker Hub
                    sh 'docker push amitmakhija2308/api-gateway:${BUILD_ID}'
                    // Additional docker push commands
                }
            }
        }
    }

    post {
        always {
            // Clean up or notify after the pipeline execution
            echo 'Security scan and tests are completed.'
        }
    }
}