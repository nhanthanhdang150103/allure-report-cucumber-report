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
        // DEBUG = 'pw:api' // Bỏ comment nếu muốn log API của Playwright
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
                sh 'npm run test:report'
            }
        }
    }

    post {
        always {
            // Lưu trữ artifacts để debug
            archiveArtifacts artifacts: 'cucumber-report.json, test-results/, allure-results/', allowEmptyArchive: true

            // Xuất bản báo cáo Cucumber
            cucumber fileIncludePattern: '**/cucumber-report.json', sortingMethod: 'ALPHABETICAL'

            script {
                // Kiểm tra xem thư mục allure-results có tồn tại không
                if (fileExists('allure-results')) {
                    echo 'Generating Allure report...'
                    // Sử dụng lệnh phù hợp với hệ điều hành
                    script {
                        if (isUnix()) {
                            sh './node_modules/.bin/allure generate allure-results --clean -o allure-report'
                        } else {
                            // Bọc đường dẫn trong dấu nháy kép để xử lý dấu cách trên Windows
                            bat '"%WORKSPACE%\\node_modules\\.bin\\allure.cmd" generate allure-results --clean -o allure-report'
                        }
                    }
                    // Xuất bản báo cáo Allure với plugin
                    allure results: [[path: 'allure-results']]
                } else {
                    echo 'No allure-results found, skipping Allure report generation.'
                }
            }
            cleanWs() // Dọn dẹp workspace
        }
        success {
            echo 'Build successful!'
            emailext (
                subject: "[Jenkins] SUCCESS: ${env.JOB_NAME} - Build #${env.BUILD_NUMBER}",
                body: """<p>Build SUCCESSFUL for job: <b>${env.JOB_NAME}</b></p>
                         <p>Build Number: <b>${env.BUILD_NUMBER}</b></p>
                         <p>Build URL: <a href="${env.BUILD_URL}">${env.BUILD_URL}</a></p>
                         <p>Check out the Allure report: <a href="${env.BUILD_URL}allure">${env.BUILD_URL}allure</a></p>
                         <p>Changes:</p>
                         <pre>${getChangeString()}</pre>""",
                to: 'nhanthanhdang2003@gmail.com',
                recipientProviders: [[$class: 'DevelopersRecipientProvider']]
            )
        }
        failure {
            echo 'Build failed.'
            emailext (
                subject: "[Jenkins] FAILURE: ${env.JOB_NAME} - Build #${env.BUILD_NUMBER}",
                body: """<p>Build FAILED for job: <b>${env.JOB_NAME}</b></p>
                         <p>Build Number: <b>${env.BUILD_NUMBER}</b></p>
                         <p>Build URL: <a href="${env.BUILD_URL}">${env.BUILD_URL}</a></p>
                         <p>Check out the Allure report: <a href="${env.BUILD_URL}allure">${env.BUILD_URL}allure</a></p>
                         <p>Error: Check console output for details.</p>
                         <p>Changes:</p>
                         <pre>${getChangeString()}</pre>""",
                to: 'nhanthanhdang2003@gmail.com',
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
                         <p>Check out the Allure report: <a href="${env.BUILD_URL}allure">${env.BUILD_URL}allure</a></p>
                         <p>Changes:</p>
                         <pre>${getChangeString()}</pre>""",
                to: 'nhanthanhdang2003@gmail.com',
                recipientProviders: [[$class: 'DevelopersRecipientProvider']]
            )
        }
    }
}

// Hàm để lấy danh sách thay đổi
def getChangeString() {
    def changeString = ""
    def changeSets = currentBuild.changeSets
    if (changeSets.isEmpty()) {
        changeString = "No changes in this build."
    } else {
        for (changeSet in changeSets) {
            for (entry in changeSet.items) {
                changeString += "${entry.comment} (${entry.author.fullName})\n"
            }
        }
    }
    return changeString
}