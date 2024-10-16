function getAvailableGolfCourses() {
    return fetch(
      "https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/courses.json",
    { mode: "no-cors" }
    ).then(function (response) {
      return response.json();
    });
  }

  function getGolfCourseDetails(golfCourseId) {
    return fetch(
      `https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/course${golfCourseId}.json`,
      { mode: "no-cors" }
    ).then(function (response) {
      return response.json();
    });
  }

  let courseOptionsHtml = '';
courses.forEach((course) => {
 courseOptionsHtml += `<option value="${course.id}">${course.name}</option>`;
});

document.getElementById('course-select').innerHTML = courseOptionsHtml;

let teeBoxSelectHtml = ''
teeBoxes.forEach(function (teeBox, index) {
   teeBoxSelectHtml += `<option value="${index}">${teeBox.teeType.toUpperCase()}, ${
     teeBox.totalYards
   } yards</option>`
});

document.getElementById('tee-box-select').innerHTML = teeBoxSelectHtml;

class Player {
    constructor(name, id = getNextId(), scores = []) {
      this.name = name;
      this.id = id;
      this.scores = scores;
    }
  }