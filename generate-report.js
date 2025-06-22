const reporter = require('cucumber-html-reporter');
const fs = require('fs');
const path = require('path');

const reportDir = path.join(__dirname, 'reports');
const reportJsonFile = path.join(__dirname, 'cucumber-report.json');
const reportHtmlFile = path.join(reportDir, 'cucumber-report.html');

// Đảm bảo thư mục reports tồn tại
if (!fs.existsSync(reportDir)) {
  fs.mkdirSync(reportDir, { recursive: true });
}

const options = {
  theme: 'bootstrap',
  jsonFile: reportJsonFile,
  output: reportHtmlFile,
  reportSuiteAsScenarios: true,
  scenarioTimestamp: true,
  launchReport: false, // Tắt tự động mở báo cáo
  metadata: {
    "App Version": "1.0.0",
    "Test Environment": "STAGING",
    "Browser": "Chromium",
    "Platform": process.platform
  }
};

reporter.generate(options);