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
                checkout scm
            }
        }

        stage('Deploy Node & NGINX to Azure') {
            steps {
                sshagent(['azure-vps-key']) {
                    sh """
                        # 1. Create directory on VPS
                        ssh -o StrictHostKeyChecking=no \$VPS_USER@\$VPS_IP "mkdir -p \$APP_DIR"
                        
                        # 2. Securely copy workspace files to Azure VPS
                        scp -o StrictHostKeyChecking=no -r * \$VPS_USER@\$VPS_IP:\$APP_DIR/
                        
                        # 3. SSH into VPS to deploy Docker containers
                        ssh -o StrictHostKeyChecking=no \$VPS_USER@\$VPS_IP '''
                            cd \$APP_DIR
                            
                            # Get the absolute path for Docker volume mounting
                            ABS_DIR=\$(pwd)
                            
                            echo "1. Creating Docker Network..."
                            docker network create my-app-network || true
                            
                            echo "2. Building Node.js Docker Image..."
                            docker build -t node-azure-app .
                            
                            echo "3. Stopping existing containers..."
                            docker stop my-node-app my-nginx || true
                            docker rm my-node-app my-nginx || true
                            
                            echo "4. Starting Node.js Container (Hidden from public internet)..."
                            docker run -d --name my-node-app --network my-app-network node-azure-app
                            
                            echo "5. Starting NGINX Container (Exposed on Port 80)..."
                            docker run -d --name my-nginx \\
                                -p 80:80 \\
                                --network my-app-network \\
                                -v \$ABS_DIR/nginx.conf:/etc/nginx/nginx.conf:ro \\
                                nginx:alpine
                        '''
                    """
                }
            }
        }
    }
}
// pipeline {
//     agent any

//     environment {
//         // Securely fetching sensitive data from Jenkins Credentials
//         VPS_IP = credentials('azure-vps-ip')
//         VPS_USER = credentials('azure-vps-user')
//         APP_DIR = '~/node-app-deployment'
//     }

//     stages {
//         stage('Checkout Code') {
//             steps {
//                 // Pulls code from the GitHub branch that triggered the build
//                 checkout scm
//             }
//         }

//         stage('Deploy to Azure VPS via SSH') {
//             steps {
//                 // Uses the SSH Credentials ID we created in Step 4.2
//                 sshagent(['azure-vps-key']) {
//                     sh """
//                         # 1. Create directory on VPS
//                         ssh -o StrictHostKeyChecking=no ${VPS_USER}@${VPS_IP} "mkdir -p ${APP_DIR}"
                        
//                         # 2. Securely copy current workspace files to Azure VPS
//                         scp -o StrictHostKeyChecking=no -r * ${VPS_USER}@${VPS_IP}:${APP_DIR}/
                        
//                         # 3. SSH into VPS to build Docker image and run container
//                         ssh -o StrictHostKeyChecking=no ${VPS_USER}@${VPS_IP} '''
//                             cd ${APP_DIR}
                            
//                             echo "Building Docker Image..."
//                             docker build -t node-azure-app .
                            
//                             echo "Stopping existing container if running..."
//                             docker stop my-running-app || true
//                             docker rm my-running-app || true
                            
//                             echo "Running new container..."
//                             # Maps port 80 on Azure VM to port 3000 in container
//                             docker run -d -p 80:3000 --name my-running-app node-azure-app
//                         '''
//                     """
//                 }
//             }
//         }
//     }
// }
