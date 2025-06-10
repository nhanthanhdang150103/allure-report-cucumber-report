pipeline {
    agent {
        nodejs 'Node22' // Đảm bảo tên khớp với cấu hình Jenkins
    }

    environment {
        BASE_URL = credentials('base-url') // Lưu URL trong Jenkins Credentials
        LOGIN_USERNAME = credentials('login-username')
        LOGIN_PASSWORD = credentials('login-password')
        HEADLESS_MODE = 'true'
        CI = 'true'
    }

    triggers {
        pollSCM('H/15 * * * *') // Kiểm tra mỗi 15 phút
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                retry(3) {
                    sh 'npm install'
                    sh 'npx playwright install --with-deps' // Cài đặt trình duyệt Playwright
                }
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test || exit 1'
            }
        }

        stage('Archive Artifacts') {
            steps {
                archiveArtifacts artifacts: 'cucumber-report.json', allowEmptyArchive: true
                cucumber fileIncludePattern: 'cucumber-report.json', sortingMethod: 'ALPHABETICAL'
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo 'Build successful!'
            slackSend channel: '#ci-channel', message: "Build ${env.JOB_NAME} #${env.BUILD_NUMBER} succeeded!", color: 'good'
        }
        failure {
            echo 'Build failed.'
            slackSend channel: '#ci-channel', message: "Build ${env.JOB_NAME} #${env.BUILD_NUMBER} failed. Check ${env.BUILD_URL}", color: 'danger'
        }
    }
}