pipeline {
    agent any
    tools {
        nodejs 'Node22' // Đảm bảo tên này khớp với cấu hình trong Jenkins Global Tool Configuration
    }

    environment {
        BASE_URL = credentials('BASE_URL') // Sử dụng Jenkins Credentials để bảo mật
        LOGIN_USERNAME = credentials('LOGIN_USERNAME')
        LOGIN_PASSWORD = credentials('LOGIN_PASSWORD')
        // HEADLESS_MODE = 'true'
        // CI = 'true'
        // Thêm DEBUG để có log chi tiết từ Playwright khi chạy trên Jenkins
        // DEBUG = 'pw:api' // Bỏ comment dòng này nếu muốn log API của Playwright
    }

    triggers {
        pollSCM('H/5 * * * *') // Kiểm tra SCM mỗi 5 phút
    }

    stages {
        stage('Checkout') {
            steps {
                // Kiểm tra lỗi SCM trước khi checkout
                script {
                    try {
                        checkout scm
                    } catch (Exception e) {
                        echo "Checkout failed: ${e.getMessage()}"
                        throw e
                    }
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                // Cài đặt dependencies và kiểm tra lỗi
                sh 'npm install --no-optional' // --no-optional để giảm nguy cơ lỗi phụ thuộc
            }
        }

        stage('Run Tests') {
            steps {
                // Chạy test
                // Nếu bạn đã bỏ comment DEBUG=pw:api ở trên, lệnh này sẽ có thêm log
                sh 'npx cucumber-js tests/features/**/*.feature --require tests/step-definitions/**/*.ts --require tests/hooks/hooks.ts --format json:cucumber-report.json --format summary --format progress-bar'
            }
        }

        stage('Archive Artifacts') {
            steps {
                // Lưu trữ báo cáo test và kết quả test (bao gồm trace và screenshot nếu có)
                archiveArtifacts artifacts: 'cucumber-report.json, test-results/', allowEmptyArchive: true
                // Thêm Cucumber Reports plugin nếu có
                step([$class: 'CucumberReportPublisher', jsonReportDirectory: '.', fileIncludePattern: 'cucumber-report.json'])
            }
        }
    }

    post {
        always {
            cleanWs() // Dọn dẹp workspace
        }
        success {
            echo 'Build successful!'
            // Có thể thêm thông báo qua email hoặc Slack
        }
        failure {
            echo 'Build failed.'
            // Có thể thêm thông báo qua email hoặc Slack
        }
        unstable {
            echo 'Build unstable, likely due to test failures.'
        }
    }
}
