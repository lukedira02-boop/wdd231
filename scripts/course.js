const courses = [
  { subject: 'CSE', number: 110, title: 'Introduction to Programming', credits: 2, completed: true },
  { subject: 'WDD', number: 130, title: 'Web Fundamentals', credits: 2, completed: true },
  { subject: 'CSE', number: 111, title: 'Programming with Functions', credits: 2, completed: false },
  { subject: 'CSE', number: 210, title: 'Programming with Classes', credits: 2, completed: false },
  { subject: 'WDD', number: 131, title: 'Dynamic Web Fundamentals', credits: 2, completed: false },
  { subject: 'WDD', number: 231, title: 'Web Frontend Development I', credits: 3, completed: false }
];

const courseList = document.querySelector('#course-list');
const creditCount = document.querySelector('#credit-count');
const filterButtons = document.querySelectorAll('[data-filter]');

function renderCourses(filter = 'all') {
  const visibleCourses = filter === 'all' ? courses : courses.filter((course) => course.subject === filter);
  courseList.innerHTML = visibleCourses.map((course) => `
    <article class="course-card ${course.completed ? 'completed' : ''}">
      <h3>${course.subject} ${course.number} &mdash; ${course.title}</h3>
      <p class="course-meta">${course.credits} credits</p>
      <p class="course-status">${course.completed ? 'Completed' : 'Required course'}</p>
    </article>
  `).join('');
  creditCount.textContent = visibleCourses.reduce((total, course) => total + course.credits, 0);
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((filterButton) => filterButton.classList.remove('active'));
    button.classList.add('active');
    renderCourses(button.dataset.filter);
  });
});

renderCourses();
