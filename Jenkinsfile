// d:\playwright-cucumber-login-test\Jenkinsfile
pipeline {
    agent {
        // Sử dụng NodeJS agent. Đảm bảo bạn đã cấu hình NodeJS trong Jenkins Global Tool Configuration
        // và đặt tên cho nó (ví dụ: 'NodeJS-18')
        nodejs 'Node22' // Thay 'NodeJS-18' bằng tên cấu hình NodeJS của bạn
    }

    environment {
        // Định nghĩa các biến môi trường cần thiết cho tests
        // Sử dụng Jenkins Credentials để quản lý các thông tin nhạy cảm.
        // Thay 'your-base-url-credential-id', 'your-login-username-credential-id',
        // và 'your-login-password-credential-id' bằng ID của Credentials bạn đã tạo trong Jenkins.
        BASE_URL = credentials('your-base-url-credential-id')
        LOGIN_USERNAME = credentials('your-login-username-credential-id')
        LOGIN_PASSWORD = credentials('your-login-password-credential-id')
        HEADLESS_MODE = 'true'       // Chạy ở headless mode trên CI
        CI = 'true'                  // Biến để báo hiệu đang chạy trong môi trường CI
    }

    triggers {
        // Kiểm tra SCM mỗi 5 phút. Bạn có thể điều chỉnh lịch trình cron theo nhu cầu.
        // Ví dụ: 'H/5 * * * *' nghĩa là kiểm tra mỗi 5 phút.
        // Để hiểu rõ hơn về cú pháp cron, bạn có thể tham khảo tài liệu của Jenkins.
        pollSCM('H/5 * * * *')
    }

    stages {
        stage('Checkout') {
            steps {
                // Checkout code từ SCM (Git)
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                // Cài đặt các dependencies từ package.json
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                // Chạy Playwright tests với Cucumber
                // Đảm bảo 'test' script trong package.json của bạn chạy đúng lệnh
                // Ví dụ: "test": "cucumber-js tests/features/**/*.feature --require tests/step-definitions/**/*.ts --require tests/hooks/hooks.ts --format json:cucumber-report.json --format summary --format progress-bar --publish-quiet"
                sh 'npm test'
            }
        }

        stage('Archive Artifacts') {
            steps {
                // Lưu trữ báo cáo test (nếu có)
                archiveArtifacts artifacts: 'cucumber-report.json', allowEmptyArchive: true
                // Bạn có thể thêm các plugin như "Cucumber reports" để hiển thị báo cáo đẹp hơn
            }
        }
    }

    post {
        always {
            // Các hành động luôn được thực hiện sau khi build, ví dụ dọn dẹp workspace
            cleanWs()
        }
        success {
            echo 'Build successful!'
            // Gửi thông báo thành công (ví dụ: email, Slack)
        }
        failure {
            echo 'Build failed.'
            // Gửi thông báo thất bại
        }
    }
}
