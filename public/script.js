const API_URL = 'http://localhost:3000/api/students';

// Show toast notification
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast ${type} show`;
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Show/hide loading indicator
function setLoading(isLoading) {
  const loadingIndicator = document.getElementById('loadingIndicator');
  const studentsTable = document.getElementById('studentsTable');
  const emptyState = document.getElementById('emptyState');
  
  if (isLoading) {
    loadingIndicator.style.display = 'block';
    studentsTable.style.display = 'none';
    emptyState.style.display = 'none';
  } else {
    loadingIndicator.style.display = 'none';
  }
}

// Show error message
function showError(message) {
  const errorMessage = document.getElementById('errorMessage');
  errorMessage.textContent = message;
  errorMessage.style.display = 'block';
  
  setTimeout(() => {
    errorMessage.style.display = 'none';
  }, 5000);
}

// Fetch all students
async function fetchStudents() {
  setLoading(true);
  const errorMessage = document.getElementById('errorMessage');
  errorMessage.style.display = 'none';
  
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch students');
    
    const students = await response.json();
    displayStudents(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    showError('Failed to load students. Please check your connection.');
    setLoading(false);
  }
}

// Display students in table
function displayStudents(students) {
  const tbody = document.getElementById('studentsTableBody');
  const studentsTable = document.getElementById('studentsTable');
  const emptyState = document.getElementById('emptyState');
  
  setLoading(false);
  
  if (students.length === 0) {
    studentsTable.style.display = 'none';
    emptyState.style.display = 'block';
    return;
  }
  
  studentsTable.style.display = 'table';
  emptyState.style.display = 'none';
  
  tbody.innerHTML = students.map(student => `
    <tr id="row-${student._id}">
      <td>
        <input 
          type="text" 
          id="name-${student._id}" 
          value="${student.name}" 
          disabled
        >
      </td>
      <td>
        <input 
          type="number" 
          id="age-${student._id}" 
          value="${student.age}" 
          disabled
        >
      </td>
      <td>
        <input 
          type="text" 
          id="major-${student._id}" 
          value="${student.major}" 
          disabled
        >
      </td>
      <td>
        <div class="action-buttons">
          <button 
            class="btn btn-success" 
            onclick="toggleEdit('${student._id}')"
            id="edit-btn-${student._id}"
          >
            Edit
          </button>
          <button 
            class="btn btn-success" 
            onclick="saveStudent('${student._id}')"
            id="save-btn-${student._id}"
            style="display: none;"
          >
            Save
          </button>
          <button 
            class="btn btn-danger" 
            onclick="deleteStudent('${student._id}')"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

// Add new student
document.getElementById('addStudentForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const name = document.getElementById('name').value.trim();
  const age = parseInt(document.getElementById('age').value);
  const major = document.getElementById('major').value.trim();
  
  if (!name || !age || !major) {
    showToast('Please fill all fields', 'error');
    return;
  }
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, age, major })
    });
    
    if (!response.ok) throw new Error('Failed to add student');
    
    showToast('Student added successfully!', 'success');
    document.getElementById('addStudentForm').reset();
    fetchStudents();
  } catch (error) {
    console.error('Error adding student:', error);
    showToast('Failed to add student', 'error');
  }
});

// Toggle edit mode
function toggleEdit(id) {
  const nameInput = document.getElementById(`name-${id}`);
  const ageInput = document.getElementById(`age-${id}`);
  const majorInput = document.getElementById(`major-${id}`);
  const editBtn = document.getElementById(`edit-btn-${id}`);
  const saveBtn = document.getElementById(`save-btn-${id}`);
  
  const isDisabled = nameInput.disabled;
  
  nameInput.disabled = !isDisabled;
  ageInput.disabled = !isDisabled;
  majorInput.disabled = !isDisabled;
  
  if (isDisabled) {
    editBtn.style.display = 'none';
    saveBtn.style.display = 'inline-flex';
    nameInput.focus();
  } else {
    editBtn.style.display = 'inline-flex';
    saveBtn.style.display = 'none';
  }
}

// Save updated student
async function saveStudent(id) {
  const name = document.getElementById(`name-${id}`).value.trim();
  const age = parseInt(document.getElementById(`age-${id}`).value);
  const major = document.getElementById(`major-${id}`).value.trim();
  
  if (!name || !age || !major) {
    showToast('Please fill all fields', 'error');
    return;
  }
  
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, age, major })
    });
    
    if (!response.ok) throw new Error('Failed to update student');
    
    showToast('Student updated successfully!', 'success');
    toggleEdit(id);
    fetchStudents();
  } catch (error) {
    console.error('Error updating student:', error);
    showToast('Failed to update student', 'error');
  }
}

// Delete student
async function deleteStudent(id) {
  if (!confirm('Are you sure you want to delete this student?')) {
    return;
  }
  
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) throw new Error('Failed to delete student');
    
    showToast('Student deleted successfully!', 'success');
    fetchStudents();
  } catch (error) {
    console.error('Error deleting student:', error);
    showToast('Failed to delete student', 'error');
  }
}

// Load students on page load
document.addEventListener('DOMContentLoaded', fetchStudents);