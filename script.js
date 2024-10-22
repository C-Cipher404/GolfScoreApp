async function getAvailableGolfCourses() {
    try {
      const response = await fetch("https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/courses.json", { mode: "no-cors" });
      const courses = await response.json();
      return courses;
    } catch (error) {
      console.error("Error fetching golf courses:", error);
    }
  }
  async function getGolfCourseDetails(golfCourseId) {
    try {
      const response = await fetch(`https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/course${golfCourseId}.json`, { mode: "no-cors" });
      const courseDetails = await response.json();
      return courseDetails;
    } catch (error) {
      console.error("Error fetching course details:", error);
    }
  }
  async function populateCourseSelect() {
    const courses = await getAvailableGolfCourses();
    if (courses) {
      let courseOptionsHtml = '';
      courses.forEach(course => {
        courseOptionsHtml += `<option value="${course.id}">${course.name}</option>`;
      });
      document.getElementById('course-select').innerHTML = courseOptionsHtml;
    }
  }

  document.getElementById('course-select').addEventListener('change', async function () {
    const selectedCourseId = this.value;
    const courseDetails = await getGolfCourseDetails(selectedCourseId);
    if (courseDetails) {
      let teeBoxSelectHtml = '';
      courseDetails.teeBoxes.forEach((teeBox, index) => {
        teeBoxSelectHtml += `<option value="${index}">${teeBox.teeType.toUpperCase()}, ${teeBox.totalYards} yards</option>`;
      });
      document.getElementById('tee-box-select').innerHTML = teeBoxSelectHtml;
    }
  });
  document.addEventListener("DOMContentLoaded", async function () {
    await populateCourseSelect();
  });
  