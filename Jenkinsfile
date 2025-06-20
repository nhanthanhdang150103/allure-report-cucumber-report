pipeline {
    agent any
    tools {
        nodejs 'Node22' // Đảm bảo tên này khớp với cấu hình trong Jenkins Global Tool Configuration và Node.js được cài đặt trên agent
    }

    environment {
        BASE_URL = credentials('BASE_URL') // Sử dụng Jenkins Credentials để bảo mật
        LOGIN_USERNAME = credentials('LOGIN_USERNAME')
        LOGIN_PASSWORD = credentials('LOGIN_PASSWORD')
        // HEADLESS_MODE = 'true'
        // CI = 'true'
        // Thêm DEBUG để có log chi tiết từ Playwright khi chạy trên Jenkins
        // DEBUG = 'pw:api' // Bỏ comment dòng này nếu muốn log API của Playwright
        // Đảm bảo biến môi trường PATH bao gồm thư mục .bin của node_modules
        PATH = "${env.PATH}:${pwd()}/node_modules/.bin"
    }

    triggers {
        pollSCM('H/5 * * * *') // Kiểm tra SCM mỗi 5 phút
    }

    stages {
        stage('Install Dependencies') {
            steps {
                // Cài đặt dependencies và kiểm tra lỗi
                sh 'npm install --no-optional' // --no-optional để giảm nguy cơ lỗi phụ thuộc không cần thiết
            }
        }

        stage('Run Tests') {
            steps {
                // Chạy test
                // Nếu bạn đã bỏ comment DEBUG=pw:api ở trên, lệnh này sẽ có thêm log
                // Thêm Allure reporter: --format allure-cucumberjs/reporter
                // Sử dụng biến môi trường PATH đã cập nhật để tìm npx và các binary khác
                sh 'npx cucumber-js tests/features/**/*.feature --require tests/step-definitions/**/*.ts --require tests/hooks/hooks.ts --format json:cucumber-report.json --format summary --format progress-bar --format allure-cucumberjs/reporter || true' // Thêm || true để stage không fail nếu test fail, cho phép post actions chạy
            }
        }

        stage('Archive Artifacts') {
            steps {
                // Lưu trữ báo cáo test và kết quả test (bao gồm trace và screenshot nếu có)
                // Thêm allure-results vào artifacts
                archiveArtifacts artifacts: 'cucumber-report.json, test-results/, allure-results/', allowEmptyArchive: true // allure-results cần được tạo ra bởi cucumber-js
                // Thêm Cucumber Reports plugin nếu có
                step([$class: 'CucumberReportPublisher', jsonReportDirectory: '.', fileIncludePattern: 'cucumber-report.json'])
            }
        }
    }

    post {
        // Stage này sẽ chạy sau khi các stage khác hoàn thành (kể cả thành công hay thất bại)
        // để đảm bảo Allure report luôn được tạo nếu có allure-results
        always {
            // Kiểm tra xem thư mục allure-results có tồn tại không
            // Allure report generation should ideally happen here if allure-results are guaranteed
            // to be produced even on test failures by the test runner itself.
            // If allure-results are only produced on success, move this block to 'success' post section.
            // Dựa trên log, lỗi Allure xảy ra ở đây, cần đảm bảo allure có trong PATH hoặc dùng đường dẫn đầy đủ.
            // Đã thêm node_modules/.bin vào PATH ở trên.
            script { // Script block is needed for Groovy logic like fileExists
                if (fileExists('allure-results')) {
                    echo 'Generating Allure report...'
                    // Lệnh này sẽ sử dụng allure từ node_modules/.bin nhờ cập nhật PATH
                    // Sử dụng npx để đảm bảo allure được tìm thấy và thực thi đúng cách
                    sh 'npx allure generate allure-results --clean -o allure-report'
                    allure([reportBuildPolicy: 'ALWAYS', results: [[path: 'allure-report']]])
                } else {
                    echo 'No allure-results found, skipping Allure report generation.'
                }
            }
            cleanWs() // Dọn dẹp workspace
        }
        success {
            script { // Script block is needed for Groovy logic
                echo 'Build successful!'
                // Lấy thông tin thay đổi một cách an toàn hơn
                def changes = ""
                if (currentBuild.changeSets != null) {
                    currentBuild.changeSets.each { changeSet ->
                        changeSet.items.each { item ->
                            changes += "${item.msg} (${item.author})\n"
                        }
                    }
                }
                // Gửi thông báo qua email
                emailext (
                    subject: "[Jenkins] SUCCESS: ${env.JOB_NAME} - Build #${env.BUILD_NUMBER}",
                    body: """<p>Build SUCCESSFUL for job: <b>${env.JOB_NAME}</b></p>
                                 <p>Build Number: <b>${env.BUILD_NUMBER}</b></p>
                                 <p>Build URL: <a href="${env.BUILD_URL}">${env.BUILD_URL}</a></p>
                                 <p>Check out the Allure report: <a href="${env.BUILD_URL}allure/">${env.BUILD_URL}allure/</a></p>
                                 <p>Changes:</p>
                                 <pre>${changes}</pre>""", // Sử dụng biến 'changes'
                    to: 'nhanthanhdang2003@gmail.com', // Email của bạn
                    // Tạm thời loại bỏ recipientProviders để debug lỗi "unregistered user"
                    // recipientProviders: [[$class: 'DevelopersRecipientProvider']]
                )
            }
        }
        failure {
            script { // Script block is needed for Groovy logic
                echo 'Build failed.'
                // Lấy thông tin thay đổi một cách an toàn hơn
                def changes = ""
                if (currentBuild.changeSets != null) {
                    currentBuild.changeSets.each { changeSet ->
                        changeSet.items.each { item ->
                            changes += "${item.msg} (${item.author})\n"
                        }
                    }
                }
                // Gửi thông báo qua email
                emailext (
                    subject: "[Jenkins] FAILURE: ${env.JOB_NAME} - Build #${env.BUILD_NUMBER}",
                    body: """<p>Build FAILED for job: <b>${env.JOB_NAME}</b></p>
                                 <p>Build Number: <b>${env.BUILD_NUMBER}</b></p>
                                 <p>Build URL: <a href="${env.BUILD_URL}">${env.BUILD_URL}</a></p>
                                 <p>Check out the Allure report: <a href="${env.BUILD_URL}allure/">${env.BUILD_URL}allure/</a></p>
                                 <p>Error: Check console output for details.</p>
                                 <p>Changes:</p>
                                 <pre>${changes}</pre>""", // Sử dụng biến 'changes'
                    to: 'nhanthanhdang2003@gmail.com', // Email của bạn (có thể thêm email khác nếu cần, ví dụ: 'nhanthanhdang2003@gmail.com, ops-team@example.com')
                    // Tạm thời loại bỏ recipientProviders để debug lỗi "unregistered user"
                    // recipientProviders: [[$class: 'DevelopersRecipientProvider'], [$class: 'CulpritsRecipientProvider']]
                )
            }
        }
        unstable {
            script { // Script block is needed for Groovy logic
                echo 'Build unstable, likely due to test failures.'
                // Lấy thông tin thay đổi một cách an toàn hơn
                def changes = ""
                if (currentBuild.changeSets != null) {
                    currentBuild.changeSets.each { changeSet ->
                        changeSet.items.each { item ->
                            changes += "${item.msg} (${item.author})\n"
                        }
                    }
                }
                // Gửi thông báo qua email
                emailext (
                    subject: "[Jenkins] UNSTABLE: ${env.JOB_NAME} - Build #${env.BUILD_NUMBER}",
                    body: """<p>Build UNSTABLE for job: <b>${env.JOB_NAME}</b> (likely due to test failures)</p>
                                 <p>Build Number: <b>${env.BUILD_NUMBER}</b></p>
                                 <p>Build URL: <a href="${env.BUILD_URL}">${env.BUILD_URL}</a></p>
                                 <p>Check out the Allure report: <a href="${env.BUILD_URL}allure/">${env.BUILD_URL}allure/</a></p>
                                 <p>Changes:</p>
                                 <pre>${changes}</pre>""", // Sử dụng biến 'changes'
                    to: 'nhanthanhdang2003@gmail.com', // Email của bạn (có thể thêm email khác nếu cần)
                    // Tạm thời loại bỏ recipientProviders để debug lỗi "unregistered user"
                    // recipientProviders: [[$class: 'DevelopersRecipientProvider']]
                )
            }
        }
    }
}