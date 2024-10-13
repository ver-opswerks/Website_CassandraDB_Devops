pipeline {
    agent any
    environment {
        DOCKERHUB_USER = 'imalicatopswerks'
        IMAGE_TAG = 'latest'  // Change to a specific version if needed, like 'v1.0'
    }
    stages {
        stage('Docker Login') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'dockerhubCreds', passwordVariable: 'DOCKER_PASS', usernameVariable: 'DOCKER_USER')]) {
                        sh "echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin"
                    }
                }
            }
        }
        stage('Build Docker Images') {
            steps {
                script {
                    // Build the images using Docker Compose
                    sh 'docker compose build'
                }
            }
        }
        stage('Tag and Push Docker Images') {
            steps {
                script {
                    // List all services that need to be tagged and pushed
                    def services = ['frontend', 'backend', 'cassandra']
                    
                    // Loop through each service to tag and push to Docker Hub
                    for (service in services) {
                        def imageName = "${DOCKERHUB_USER}/${service}:${IMAGE_TAG}"
                        
                        // Tag the service image
                        sh "docker tag test-${service}:latest ${imageName}"
                        
                        // Push the tagged image to Docker Hub
                        sh "docker push ${imageName}"
                    }
                }
            }
        }
    }
    post {
        always {
            // Clean up Docker images to keep the environment clean
            sh 'docker system prune -f'
        }
    }
}

