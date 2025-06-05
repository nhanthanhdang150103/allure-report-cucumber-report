// d:\playwright-cucumber-login-test\Jenkinsfile
pipeline {
    agent any // Hoặc chỉ định một agent cụ thể, ví dụ Docker container có Node.js

    tools {
        // Đảm bảo bạn đã cấu hình NodeJS installation trong Jenkins Global Tool Configuration
        // Thay 'NodeJS-LTS' bằng tên NodeJS installation của bạn
        nodejs 'NodeJS'
    }

    environment {
        // Định nghĩa ID của Jenkins credentials cho các secret của bạn
        // Tạo các credentials này trong Jenkins: Manage Jenkins -> Credentials
        // Ví dụ:
        // - 'YOUR_PROJECT_BASE_URL' (Secret text cho BASE_URL)
        // - 'YOUR_PROJECT_LOGIN_USERNAME' (Secret text cho LOGIN_USERNAME)
        // - 'YOUR_PROJECT_LOGIN_PASSWORD' (Secret text cho LOGIN_PASSWORD)
        CI_BASE_URL        = credentials('YOUR_PROJECT_BASE_URL')
        CI_LOGIN_USERNAME  = credentials('YOUR_PROJECT_LOGIN_USERNAME')
        CI_LOGIN_PASSWORD  = credentials('YOUR_PROJECT_LOGIN_PASSWORD')

        // Các biến môi trường cho CI, sẽ ghi đè giá trị mặc định từ .env
        CI_DEFAULT_TIMEOUT = '60000' // Timeout mặc định cho các action của Playwright
        CI_HEADLESS_MODE   = 'true'  // Luôn chạy headless trên CI
        CI_SLOW_MO         = '0'     // Không dùng slow motion trên CI
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Đang checkout code từ SCM...'
                checkout scm // Lấy code từ Git repository đã cấu hình trong Jenkins job
            }
        }

        stage('Setup Environment File') {
            steps {
                echo 'Đang tạo file .env cho build...'
                sh """
                echo "BASE_URL=${env.CI_BASE_URL}" > .env
                echo "LOGIN_USERNAME=${env.CI_LOGIN_USERNAME}" >> .env
                echo "LOGIN_PASSWORD=${env.CI_LOGIN_PASSWORD}" >> .env
                echo "DEFAULT_TIMEOUT=${env.CI_DEFAULT_TIMEOUT}" >> .env
                echo "HEADLESS_MODE=${env.CI_HEADLESS_MODE}" >> .env
                echo "SLOW_MO=${env.CI_SLOW_MO}" >> .env
                echo "File .env đã được tạo:"
                cat .env
                """
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Đang cài đặt các dependencies từ npm...'
                sh 'npm install'
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                echo 'Đang cài đặt các trình duyệt cho Playwright...'
                // Lệnh này đảm bảo các trình duyệt cần thiết được cài đặt.
                // Mặc dù @playwright/test thường tự cài đặt sau khi npm install,
                // chạy lệnh này một cách tường minh có thể tránh lỗi trên một số môi trường CI.
                sh 'npx playwright install --with-deps'
            }
        }

        stage('Run Tests') {
            steps {
                echo 'Đang chạy Playwright Cucumber tests...'
                // Giả định 'npm test' sẽ thực thi 'cucumber-js'
                // và file cucumber.json đã được cấu hình để xuất ra 'cucumber_report.json'
                sh 'npm test'
            }
        }
    }

    post {
        always {
            echo 'Đang lưu trữ báo cáo test...'

            // Lưu trữ Cucumber JSON report
            // Đảm bảo lệnh cucumber-js của bạn (thông qua npm test hoặc cucumber.json)
            // tạo ra file 'cucumber_report.json' ở thư mục gốc.
            archiveArtifacts artifacts: 'cucumber_report.json', allowEmptyArchive: true, fingerprint: true

            // Lưu trữ Playwright HTML report (thường nằm trong thư mục 'playwright-report/')
            archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true, fingerprint: true

            // (Tùy chọn) Publish Playwright HTML report (yêu cầu plugin HTML Publisher)
            // Đảm bảo plugin HTML Publisher đã được cài đặt trên Jenkins.
            /*
            publishHTML(target: [
                allowMissing: true,          // Không lỗi nếu không tìm thấy report
                alwaysLinkToLastBuild: true, // Luôn link tới build mới nhất
                keepAll: true,               // Giữ lại tất cả các report
                reportDir: 'playwright-report', // Thư mục chứa report
                reportFiles: 'index.html',   // File HTML chính
                reportName: 'Playwright HTML Report', // Tên hiển thị trên Jenkins
                allowStable: true            // Cũng publish nếu build stable
            ])
            */

            echo 'Dọn dẹp workspace...'
            cleanWs() // Dọn dẹp workspace sau khi build xong
        }
        success {
            echo 'Build thành công!'
            // Thêm các hành động khi build thành công (ví dụ: thông báo)
        }
        failure {
            echo 'Build thất bại.'
            // Thêm các hành động khi build thất bại (ví dụ: thông báo)
        }
    }
}
