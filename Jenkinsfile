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
                // Thêm Allure reporter: --format allure-cucumberjs/reporter
                sh 'npx cucumber-js tests/features/**/*.feature --require tests/step-definitions/**/*.ts --require tests/hooks/hooks.ts --format json:cucumber-report.json --format summary --format progress-bar --format allure-cucumberjs/reporter'
            }
        }

        stage('Archive Artifacts') {
            steps {
                // Lưu trữ báo cáo test và kết quả test (bao gồm trace và screenshot nếu có)
                // Thêm allure-results vào artifacts
                archiveArtifacts artifacts: 'cucumber-report.json, test-results/, allure-results/', allowEmptyArchive: true
                // Thêm Cucumber Reports plugin nếu có
                step([$class: 'CucumberReportPublisher', jsonReportDirectory: '.', fileIncludePattern: 'cucumber-report.json'])
            }
        }
    }

    post {
        // Stage này sẽ chạy sau khi các stage khác hoàn thành (kể cả thành công hay thất bại)
        // để đảm bảo Allure report luôn được tạo nếu có allure-results
        always {
            script {
                // Kiểm tra xem thư mục allure-results có tồn tại không
                if (fileExists('allure-results')) {
                    echo 'Generating Allure report...'
                    // Sử dụng allure-commandline đã cài đặt trong node_modules hoặc cấu hình global tool trong Jenkins
                    // Nếu allure không có trong PATH, bạn có thể cần chỉ định đường dẫn đầy đủ: ./node_modules/.bin/allure
                    sh 'npm run report:allure:generate'
                    allure([reportBuildPolicy: 'ALWAYS', results: [[path: 'allure-report']]])
                } else {
                    echo 'No allure-results found, skipping Allure report generation.'
                }
            }
            cleanWs() // Dọn dẹp workspace
        }
        success {
            echo 'Build successful!'
            script {
                def changeSummaries = []
                if (currentBuild.changeSets) {
                    currentBuild.changeSets.each { logSet ->
                        if (logSet.items) {
                            logSet.items.each { entry ->
                                changeSummaries.add("${entry.msg} (${entry.author.fullName})")
                            }
                        }
                    }
                }
                def changesText = changeSummaries.join('\n')
                emailext (
                    subject: "[Jenkins] SUCCESS: ${env.JOB_NAME} - Build #${env.BUILD_NUMBER}",
                    body: """<p>Build SUCCESSFUL for job: <b>${env.JOB_NAME}</b></p>
                                 <p>Build Number: <b>${env.BUILD_NUMBER}</b></p>
                                 <p>Build URL: <a href="${env.BUILD_URL}">${env.BUILD_URL}</a></p>
                                 <p>Check out the Allure report: <a href="${env.BUILD_URL}allure/">${env.BUILD_URL}allure/</a></p>
                                 <p>Changes:</p>
                                 <pre>${changesText}</pre>""",
                    to: 'nhanthanhdang2003@gmail.com',
                    recipientProviders: [[$class: 'DevelopersRecipientProvider']]
                )
            }
        }
        failure {
            echo 'Build failed.'
            script {
                def changeSummaries = []
                if (currentBuild.changeSets) {
                    currentBuild.changeSets.each { logSet ->
                        if (logSet.items) {
                            logSet.items.each { entry ->
                                changeSummaries.add("${entry.msg} (${entry.author.fullName})")
                            }
                        }
                    }
                }
                def changesText = changeSummaries.join('\n')
                emailext (
                    subject: "[Jenkins] FAILURE: ${env.JOB_NAME} - Build #${env.BUILD_NUMBER}",
                    body: """<p>Build FAILED for job: <b>${env.JOB_NAME}</b></p>
                                 <p>Build Number: <b>${env.BUILD_NUMBER}</b></p>
                                 <p>Build URL: <a href="${env.BUILD_URL}">${env.BUILD_URL}</a></p>
                                 <p>Check out the Allure report: <a href="${env.BUILD_URL}allure/">${env.BUILD_URL}allure/</a></p>
                                 <p>Error: Check console output for details.</p>
                                 <p>Changes:</p>
                                 <pre>${changesText}</pre>""",
                    to: 'nhanthanhdang2003@gmail.com',
                    recipientProviders: [[$class: 'DevelopersRecipientProvider'], [$class: 'CulpritsRecipientProvider']]
                )
            }
        }
        unstable {
            echo 'Build unstable, likely due to test failures.'
            // Có thể thêm thông báo qua email hoặc Slack
            emailext (
                subject: "[Jenkins] UNSTABLE: ${env.JOB_NAME} - Build #${env.BUILD_NUMBER}",
                body: """<p>Build UNSTABLE for job: <b>${env.JOB_NAME}</b> (likely due to test failures)</p>
                             <p>Build Number: <b>${env.BUILD_NUMBER}</b></p>
                             <p>Build URL: <a href="${env.BUILD_URL}">${env.BUILD_URL}</a></p>
                             <p>Check out the Allure report: <a href="${env.BUILD_URL}allure/">${env.BUILD_URL}allure/</a></p>
                             <p>Changes:</p>
                             <pre>${changesText}</pre>""",
                to: 'nhanthanhdang2003@gmail.com', // Email của bạn (có thể thêm email khác nếu cần)
                recipientProviders: [[$class: 'DevelopersRecipientProvider']]
            )
        }
    }
}
