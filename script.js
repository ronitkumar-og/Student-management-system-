const studentForm = document.getElementById("studentForm");
const studentTable = document.getElementById("studentTable");
const searchInput = document.getElementById("searchInput");
const emptyMessage = document.getElementById("emptyMessage");
const studentIdInput = document.getElementById("studentId");
const formTitle = document.getElementById("formTitle");
const saveButton = document.getElementById("saveButton");
const cancelEdit = document.getElementById("cancelEdit");

let students = JSON.parse(localStorage.getItem("students")) || [];

function saveStudents() {
  localStorage.setItem("students", JSON.stringify(students));
}

function renderStudents(searchText = "") {
  const search = searchText.toLowerCase();
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(search) ||
    student.roll.toLowerCase().includes(search) ||
    student.email.toLowerCase().includes(search) ||
    student.course.toLowerCase().includes(search)
  );

  studentTable.innerHTML = "";
  filteredStudents.forEach(student => {
    const row = document.createElement("tr");
    [student.name, student.roll, student.email, student.course].forEach(value => {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.appendChild(cell);
    });

    const actionCell = document.createElement("td");
    const actions = document.createElement("div");
    actions.className = "action-buttons";

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.className = "edit-button";
    editButton.addEventListener("click", () => editStudent(student.id));

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete-button";
    deleteButton.addEventListener("click", () => deleteStudent(student.id));

    actions.append(editButton, deleteButton);
    actionCell.appendChild(actions);
    row.appendChild(actionCell);
    studentTable.appendChild(row);
  });

  emptyMessage.classList.toggle("hidden", filteredStudents.length > 0);
  if (students.length > 0 && filteredStudents.length === 0) {
    emptyMessage.textContent = "No matching students found.";
  } else {
    emptyMessage.textContent = "No students yet. Add your first student using the form above.";
  }

  document.getElementById("totalStudents").textContent = students.length;
  document.getElementById("totalCourses").textContent = new Set(students.map(s => s.course)).size;
}

studentForm.addEventListener("submit", function(event) {
  event.preventDefault();

  const student = {
    id: studentIdInput.value || String(Date.now()),
    name: document.getElementById("name").value.trim(),
    roll: document.getElementById("roll").value.trim(),
    email: document.getElementById("email").value.trim(),
    course: document.getElementById("course").value
  };

  const duplicateRoll = students.some(existing =>
    existing.roll.toLowerCase() === student.roll.toLowerCase() && existing.id !== student.id
  );
  if (duplicateRoll) {
    alert("This roll number already exists. Please use a unique roll number.");
    return;
  }

  const existingIndex = students.findIndex(existing => existing.id === student.id);
  if (existingIndex >= 0) {
    students[existingIndex] = student;
  } else {
    students.push(student);
  }

  saveStudents();
  renderStudents(searchInput.value);
  resetForm();
});

function editStudent(id) {
  const student = students.find(item => item.id === id);
  if (!student) return;

  studentIdInput.value = student.id;
  document.getElementById("name").value = student.name;
  document.getElementById("roll").value = student.roll;
  document.getElementById("email").value = student.email;
  document.getElementById("course").value = student.course;
  formTitle.textContent = "Edit Student";
  saveButton.textContent = "Save Changes";
  cancelEdit.classList.remove("hidden");
  document.getElementById("name").focus();
}

function deleteStudent(id) {
  const student = students.find(item => item.id === id);
  if (!student || !confirm(`Delete ${student.name}'s record?`)) return;
  students = students.filter(item => item.id !== id);
  saveStudents();
  renderStudents(searchInput.value);
  if (studentIdInput.value === id) resetForm();
}

function resetForm() {
  studentForm.reset();
  studentIdInput.value = "";
  formTitle.textContent = "Add Student";
  saveButton.textContent = "Add Student";
  cancelEdit.classList.add("hidden");
}

cancelEdit.addEventListener("click", resetForm);
searchInput.addEventListener("input", () => renderStudents(searchInput.value));
renderStudents();
