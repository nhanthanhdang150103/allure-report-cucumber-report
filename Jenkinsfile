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
                sh 'npm run test:report'
            }
        }

    }

    post {
        // Stage này sẽ chạy sau khi các stage khác hoàn thành (kể cả thành công hay thất bại)
        always {
            // Luôn lưu trữ artifacts để có thể debug, đặc biệt là khi test thất bại
            // (Playwright trace và screenshot được tạo khi fail)
            archiveArtifacts artifacts: 'cucumber-report.json, test-results/, allure-results/', allowEmptyArchive: true

            // Luôn xuất bản Cucumber report
            step([$class: 'CucumberReportPublisher', jsonReportDirectory: '.', fileIncludePattern: 'cucumber-report.json', fileExcludePattern: ''])

            script {
                // Kiểm tra xem thư mục allure-results có tồn tại không
                if (fileExists('allure-results')) {
                    echo 'Generating Allure report...'
                    // Sử dụng allure-commandline đã cài đặt trong node_modules hoặc cấu hình global tool trong Jenkins
                    // Nếu allure không có trong PATH, bạn có thể cần chỉ định đường dẫn đầy đủ: ./node_modules/.bin/allure
                    sh 'npx allure generate allure-results --clean -o allure-report'
                    allure reportBuildPolicy: 'ALWAYS', results: [[path: 'allure-report']]
                } else {
                    echo 'No allure-results found, skipping Allure report generation.'
                }
            }
            cleanWs() // Dọn dẹp workspace
        }
        success {
            echo 'Build successful!'
            // Có thể thêm thông báo qua email hoặc Slack
            emailext (
                subject: "[Jenkins] SUCCESS: ${env.JOB_NAME} - Build #${env.BUILD_NUMBER}",
                body: """<p>Build SUCCESSFUL for job: <b>${env.JOB_NAME}</b></p>
                             <p>Build Number: <b>${env.BUILD_NUMBER}</b></p>
                             <p>Build URL: <a href="${env.BUILD_URL}">${env.BUILD_URL}</a></p>
                             <p>Check out the Allure report: <a href="${env.BUILD_URL}allure/">${env.BUILD_URL}allure/</a></p>
                             <p>Changes:</p>
                             <pre>${currentBuild.changeSets.collect { it.msg + ' (' + it.author + ')' }.join('\n')}</pre>""",
                to: 'nhanthanhdang2003@gmail.com', // Email của bạn
                recipientProviders: [[$class: 'DevelopersRecipientProvider']] // Gửi cho những người đã commit code
            )
        }
        failure {
            echo 'Build failed.'
            // Có thể thêm thông báo qua email hoặc Slack
            emailext (
                subject: "[Jenkins] FAILURE: ${env.JOB_NAME} - Build #${env.BUILD_NUMBER}",
                body: """<p>Build FAILED for job: <b>${env.JOB_NAME}</b></p>
                             <p>Build Number: <b>${env.BUILD_NUMBER}</b></p>
                             <p>Build URL: <a href="${env.BUILD_URL}">${env.BUILD_URL}</a></p>
                             <p>Check out the Allure report: <a href="${env.BUILD_URL}allure/">${env.BUILD_URL}allure/</a></p>
                             <p>Error: Check console output for details.</p>
                             <p>Changes:</p>
                             <pre>${currentBuild.changeSets.collect { it.msg + ' (' + it.author + ')' }.join('\n')}</pre>""",
                to: 'nhanthanhdang2003@gmail.com', // Email của bạn (có thể thêm email khác nếu cần, ví dụ: 'nhanthanhdang2003@gmail.com, ops-team@example.com')
                recipientProviders: [[$class: 'DevelopersRecipientProvider'], [$class: 'CulpritsRecipientProvider']]
            )
        }
        unstable {
            echo 'Build unstable, likely due to test failures.'
            emailext (
                subject: "[Jenkins] UNSTABLE: ${env.JOB_NAME} - Build #${env.BUILD_NUMBER}",
                body: """<p>Build UNSTABLE for job: <b>${env.JOB_NAME}</b> (likely due to test failures)</p>
                             <p>Build Number: <b>${env.BUILD_NUMBER}</b></p>
                             <p>Build URL: <a href="${env.BUILD_URL}">${env.BUILD_URL}</a></p>
                             <p>Check out the Allure report: <a href="${env.BUILD_URL}allure/">${env.BUILD_URL}allure/</a></p>
                             <p>Changes:</p>
                             <pre>${currentBuild.changeSets.collect { it.msg + ' (' + it.author + ')' }.join('\n')}</pre>""",
                to: 'nhanthanhdang2003@gmail.com', // Email của bạn (có thể thêm email khác nếu cần)
                recipientProviders: [[$class: 'DevelopersRecipientProvider']]
            )
        }
    }
}
