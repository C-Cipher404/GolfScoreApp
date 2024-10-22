document.addEventListener("DOMContentLoaded", async function() {
    await populateCourseSelect();
    
    document.getElementById('course-select').addEventListener('change', async function() {
      const selectedCourseId = this.value;
      await populateTeeBoxSelect(selectedCourseId);
      await constructScorecard(selectedCourseId);
    });
  });
  async function populateCourseSelect() {
    try {
      const courses = await getAvailableGolfCourses();
      let courseOptionsHtml = '<option value="">Select a course</option>';
      courses.forEach(course => {
        courseOptionsHtml += `<option value="${course.id}">${course.name}</option>`;
      });
      document.getElementById('course-select').innerHTML = courseOptionsHtml;
    } catch (error) {
      console.error("Error loading courses:", error);
    }
  }
  async function populateTeeBoxSelect(courseId) {
    try {
      const courseDetails = await getGolfCourseDetails(courseId);
      let teeBoxOptionsHtml = '<option value="">Select a tee box</option>';
      courseDetails.teeBoxes.forEach((teeBox, index) => {
        teeBoxOptionsHtml += `<option value="${index}">${teeBox.teeType.toUpperCase()} - ${teeBox.totalYards} yards</option>`;
      });
      document.getElementById('tee-box-select').innerHTML = teeBoxOptionsHtml;
    } catch (error) {
      console.error("Error loading tee boxes:", error);
    }
  }
  async function constructScorecard(courseId) {
    try {
      const courseDetails = await getGolfCourseDetails(courseId);
      const holes = courseDetails.holes;
  
      let scorecardHtml = `
        <thead>
          <tr>
            <th>Hole</th>
            ${holes.map(hole => `<th>${hole.hole}</th>`).join('')}
          </tr>
          <tr>
            <th>Yardage</th>
            ${holes.map(hole => `<th>${hole.teeBoxes[0].yards}</th>`).join('')}
          </tr>
          <tr>
            <th>Par</th>
            ${holes.map(hole => `<th>${hole.teeBoxes[0].par}</th>`).join('')}
          </tr>
          <tr>
            <th>Handicap</th>
            ${holes.map(hole => `<th>${hole.teeBoxes[0].hcp}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${Array.from({ length: 4 }).map((_, playerIndex) => `
            <tr>
              <td>Player ${playerIndex + 1}</td>
              ${holes.map(() => `<td><input type="number" class="form-control" placeholder="Score"></td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      `;
  
      document.getElementById('scorecard-table').innerHTML = scorecardHtml;
    } catch (error) {
      console.error("Error constructing scorecard:", error);
    }
  }
  async function getAvailableGolfCourses() {
    try {
      const response = await fetch("https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/courses.json", { mode: "no-cors" });
      return await response.json();
    } catch (error) {
      console.error("Error fetching golf courses:", error);
    }
  }
  async function getGolfCourseDetails(courseId) {
    try {
      const response = await fetch(`https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/course${courseId}.json`, { mode: "no-cors" });
      return await response.json();
    } catch (error) {
      console.error("Error fetching course details:", error);
    }
  }
  