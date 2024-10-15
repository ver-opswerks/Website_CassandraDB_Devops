pipeline {
    agent {
        kubernetes {
            inheritFrom 'k8s-agent' // Inherit from your Kubernetes agent template
            defaultContainer 'node' // Set 'node' as the default container for the Node.js commands
            yaml """
apiVersion: v1
kind: Pod
spec:
  containers:
    - name: node
      image: node:18
      command:
        - cat
      tty: true
"""
        }
    }
    stages {
        stage('Check Node.js and npm Versions') {
            steps {
                // Run commands in the Node.js container
                container('node') {
                    script {
                        // Check Node.js version
                        sh 'node -v'
                        
                        // Check npm version
                        sh 'npm -v'
                    }
                }
            }
        }
    }
}
