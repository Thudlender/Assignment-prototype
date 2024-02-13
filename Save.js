// ฟังก์ชันโหลดข้อมูลจากไฟล์ JSON และแสดงบนหน้าเว็บ
function loadAttendanceData() {
  fetch("student_attendance.json") // ตรงนี้ให้เปลี่ยนเส้นทางไฟล์ให้ถูกต้อง
    .then((response) => response.json())
    .then((data) => {
      const tableBody = document.getElementById("attendance-table-body");
      tableBody.innerHTML = ""; // Clear previous data
      data.forEach((student) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                    <td>${student["รหัสประจำตัว"]}</td>
                    <td>${student["ชื่อ"]}</td>
                    <td><button class="attendance-button" data-week="1">${
                      student["สัปดาห์1"] ? "Present" : "Absent"
                    }</button></td>
                    <td><button class="attendance-button" data-week="2">${
                      student["สัปดาห์2"] ? "Present" : "Absent"
                    }</button></td>
                    <td><button class="save-button">Save</button></td>
                `;
        tableBody.appendChild(row);
      });
      addAttendanceListeners(); // Add event listeners after creating rows
    })
    .catch((error) => console.error("Error loading the data:", error));
}

// ฟังก์ชันเพิ่มกำหนดการเข้าร่วม
function addAttendanceListeners() {
  const attendanceButtons = document.querySelectorAll(".attendance-button");
  attendanceButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const studentIndex = this.parentNode.parentNode.rowIndex - 1; // Get the row index
      const week = this.getAttribute("data-week");
      if (attendanceData[studentIndex][`สัปดาห์${week}`]) {
        attendanceData[studentIndex][`สัปดาห์${week}`] = null; // Toggle attendance
        this.textContent = "Absent";
      } else {
        attendanceData[studentIndex][`สัปดาห์${week}`] = "Present"; // Toggle attendance
        this.textContent = "Present";
      }
      // Provide a visual indicator of changes (optional)
      this.classList.toggle("present");
    });
  });

  const saveButtons = document.querySelectorAll(".save-button");
  saveButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Create a Blob with the updated attendance data
      const blob = new Blob([JSON.stringify(attendanceData, null, 2)], {
        type: "application/json",
      });
      // Create a link element to trigger the download
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "updated_attendance.json";
      // Trigger the click event of the link to start the download
      a.click();
      // Clean up resources
      URL.revokeObjectURL(url);
    });
  });
}

// เรียกใช้ฟังก์ชันโหลดข้อมูลเมื่อหน้าเว็บโหลดเสร็จสมบูรณ์
window.onload = () => {
  loadAttendanceData();
  document
    .getElementById("search-button")
    .addEventListener("click", searchAttendanceData);
  document
    .getElementById("search-input")
    .addEventListener("keyup", searchAttendanceData);
};
