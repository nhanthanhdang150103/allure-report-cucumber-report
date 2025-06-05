export const TasksSelectors = {
  tasksMenuLink: 'a[href*="my-tasks-list"]', // Menu Tasks
  addNewButton: 'a[href="#add_form"]:has(svg.feather-plus)', // Nút Add New
  titleInput: 'input[name="task_name"]', // Tiêu đề
  startDateInput: 'input[name="start_date"]', // Ngày bắt đầu
  endDateInput: 'input[name="end_date"]', // Ngày kết thúc
  // datePickerDay: 'td[data-date="4"] a.dtp-select-day', // Chọn ngày 4
  // datePickerOkButton: 'button.dtp-btn-ok', // Nút OK của date picker
  estimatedHourInput: 'input[name="task_hour"]', // Giờ ước tính
  projectSelect: 'span[id*="select2-project_id"][role="textbox"]', // Dropdown Project
  projectOption: 'li.select2-results__option.select2-results__option--highlighted', // Tùy chọn được highlight trong danh sách project
  summaryTextarea: 'textarea[name="summary"]', // Tóm tắt
  descriptionEditor: 'body[contenteditable="true"]', // Editor mô tả
  saveButton: 'button[type="submit"].btn-primary.ladda-button', // Nút Save
  successMessage: '.toast-message:has-text("Task added.")', // Thông báo thành công
  errorMessage: '.toast-message:has-text("The summary field must be at least 60 characters in length.")' // Thông báo lỗi
};