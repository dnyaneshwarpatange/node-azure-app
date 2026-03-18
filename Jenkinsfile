pipeline {
    agent any

    environment {
        // Securely fetching sensitive data from Jenkins Credentials
        VPS_IP = credentials('azure-vps-ip')
        VPS_USER = credentials('azure-vps-user')
        APP_DIR = '~/node-app-deployment'
    }

    stages {
        stage('Checkout Code') {
            steps {
                // Pulls code from the GitHub branch that triggered the build
                checkout scm
            }
        }

        stage('Deploy to Azure VPS via SSH') {
            steps {
                // Uses the SSH Credentials ID we created in Step 4.2
                sshagent(['azure-vps-key']) {
                    sh """
                        # 1. Create directory on VPS
                        ssh -o StrictHostKeyChecking=no ${VPS_USER}@${VPS_IP} "mkdir -p ${APP_DIR}"
                        
                        # 2. Securely copy current workspace files to Azure VPS
                        scp -o StrictHostKeyChecking=no -r * ${VPS_USER}@${VPS_IP}:${APP_DIR}/
                        
                        # 3. SSH into VPS to build Docker image and run container
                        ssh -o StrictHostKeyChecking=no ${VPS_USER}@${VPS_IP} '''
                            cd ${APP_DIR}
                            
                            echo "Building Docker Image..."
                            docker build -t node-azure-app .
                            
                            echo "Stopping existing container if running..."
                            docker stop my-running-app || true
                            docker rm my-running-app || true
                            
                            echo "Running new container..."
                            # Maps port 80 on Azure VM to port 3000 in container
                            docker run -d -p 80:3000 --name my-running-app node-azure-app
                        '''
                    """
                }
            }
        }
    }
}
