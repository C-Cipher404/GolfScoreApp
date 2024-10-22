document.addEventListener("DOMContentLoaded", function() {
    getAvailableGolfCourses().then(courses => {
      let courseOptionsHtml = '';
      courses.forEach((course) => {
        courseOptionsHtml += `<option value="${course.id}">${course.name}</option>`;
      });
      document.getElementById('course-select').innerHTML = courseOptionsHtml;
    });
  
    document.getElementById('course-select').addEventListener('change', function() {
      const selectedCourseId = this.value;
      getGolfCourseDetails(selectedCourseId).then((courseDetails) => {
        let teeBoxSelectHtml = '';
        courseDetails.teeBoxes.forEach((teeBox, index) => {
          teeBoxSelectHtml += `<option value="${index}">${teeBox.teeType.toUpperCase()}, ${teeBox.totalYards} yards</option>`;
        });
        document.getElementById('tee-box-select').innerHTML = teeBoxSelectHtml;
      });
    });
  });
  
  function getAvailableGolfCourses() {
    return fetch(
      "https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/courses.json",
      { mode: "no-cors" }
    ).then(function (response) {
      return response.json();
    }).catch(error => {
      console.error("Error fetching courses:", error);
    });
  }
  
  function getGolfCourseDetails(golfCourseId) {
    return fetch(
      `https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/course${golfCourseId}.json`,
      { mode: "no-cors" }
    ).then(function (response) {
      return response.json();
    }).catch(error => {
      console.error("Error fetching course details:", error);
    });
  }
  function addList() {
    const newListName = document.getElementById('new-list-name-input').value;
    if (newListName) {
      console.log("New list added:", newListName);
    } else {
      alert('Please enter a list name.');
    }
  }
  class Player {
    constructor(name, id = getNextId(), scores = []) {
      this.name = name;
      this.id = id;
      this.scores = scores;
    }
  }
  function getNextId() {
    return Math.floor(Math.random() * 10000);
  }
  