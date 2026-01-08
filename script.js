// 1. Select DOM Elements
const form = document.getElementById('course-form');
const courseList = document.getElementById('course-list');
const emptyMsg = document.getElementById('empty-msg');
const clearBtn = document.getElementById('clear-btn');

// Stats Elements
const finalGradeEl = document.getElementById('final-grade');
const letterGradeEl = document.getElementById('letter-grade');
const highScoreEl = document.getElementById('high-score');

// 2. State Management (Initialize from LocalStorage or empty array)
let courses = JSON.parse(localStorage.getItem('studentCourses')) || [];

// 3. Event Listeners
form.addEventListener('submit', addCourse);
clearBtn.addEventListener('click', clearAll);
document.addEventListener('DOMContentLoaded', renderUI); // Load on startup

// 4. Function: Add Course
function addCourse(e) {
    e.preventDefault(); // Stop form from refreshing page

    // Get input values
    const name = document.getElementById('course-name').value;
    const mark = parseFloat(document.getElementById('course-mark').value);
    const weight = parseFloat(document.getElementById('course-weight').value);

    // Validation Check
    if (name === '' || isNaN(mark) || isNaN(weight)) {
        alert("Please fill in all fields correctly.");
        return;
    }

    // Create course object
    const course = {
        id: Date.now(), // Unique ID based on timestamp
        name,
        mark,
        weight
    };

    // Add to state and save
    courses.push(course);
    saveData();
    renderUI();
    form.reset(); // Clear form inputs
}

// 5. Function: Delete Single Course
function deleteCourse(id) {
    // Filter out the course with the matching ID
    courses = courses.filter(course => course.id !== id);
    saveData();
    renderUI();
}

// 6. Function: Clear All
function clearAll() {
    if(confirm('Are you sure you want to clear all data?')) {
        courses = [];
        saveData();
        renderUI();
    }
}

// 7. Function: Save to LocalStorage
function saveData() {
    localStorage.setItem('studentCourses', JSON.stringify(courses));
}

// 8. Function: Render UI (Displays list and calculates stats)
function renderUI() {
    // Clear current table list
    courseList.innerHTML = '';

    // Check if list is empty
    if (courses.length === 0) {
        emptyMsg.style.display = 'block';
        resetStats();
        return;
    } else {
        emptyMsg.style.display = 'none';
    }

    // Loop through courses to build table rows
    courses.forEach(course => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${course.name}</td>
            <td>${course.mark}%</td>
            <td>${course.weight}</td>
            <td>
                <button class="delete-btn" onclick="deleteCourse(${course.id})">&times;</button>
            </td>
        `;
        courseList.appendChild(row);
    });

    // Calculate Statistics
    calculateStats();
}

// 9. Function: Calculate Statistics (Weighted Average & Logic)
function calculateStats() {
    let totalWeight = 0;
    let totalWeightedScore = 0;
    let highest = 0;

    // Loop for calculations
    for (let i = 0; i < courses.length; i++) {
        let c = courses[i];
        
        // Accumulate totals
        totalWeightedScore += (c.mark * c.weight);
        totalWeight += c.weight;

        // Find highest score
        if (c.mark > highest) highest = c.mark;
    }

    // Avoid division by zero
    const weightedAvg = totalWeight === 0 ? 0 : (totalWeightedScore / totalWeight);

    // Update UI
    finalGradeEl.innerText = weightedAvg.toFixed(2) + '%';
    highScoreEl.innerText = highest + '%';
    letterGradeEl.innerText = getLetterGrade(weightedAvg);
}

// Helper: Get Letter Grade
function getLetterGrade(avg) {
    if (avg >= 90) return 'A';
    if (avg >= 80) return 'B';
    if (avg >= 70) return 'C';
    if (avg >= 60) return 'D';
    return 'F';
}

function resetStats() {
    finalGradeEl.innerText = '--%';
    letterGradeEl.innerText = '--';
    highScoreEl.innerText = '--';
}