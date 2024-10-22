document.addEventListener("DOMContentLoaded", async function() {
    await populateCourseSelect();
    
    document.getElementById('course-select').addEventListener('change', async function() {
        const selectedCourseId = this.value;
        if (selectedCourseId) {
            await populateTeeBoxSelect(selectedCourseId);
            await constructScorecard(selectedCourseId);
        }
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
                    <th>Player</th>
                    <th>Hole</th>
                    ${holes.map(hole => `<th>${hole.hole}</th>`).join('')}
                    <th>Out</th>
                    <th>In</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                ${players.map(player => `
                    <tr>
                        <td>${player.name}</td>
                        <td></td>
                        ${holes.map(() => `<td><input type="number" class="form-control" onchange="updatePlayerScore(${player.id}, ${i}, this.value)" value="${player.scores[i]}"></td>`).join('')}
                        <td>${player.getOutScore()}</td>
                        <td>${player.getInScore()}</td>
                        <td>${player.getTotalScore()}</td>
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

class Player {
    constructor(name, id, scores = Array(18).fill(0)) {
        this.name = name;
        this.id = id;
        this.scores = scores;
    }
    getOutScore() {
        return this.scores.slice(0, 9).reduce((acc, score) => acc + score, 0);
    }
    getInScore() {
        return this.scores.slice(9).reduce((acc, score) => acc + score, 0);
    }
    getTotalScore() {
        return this.getOutScore() + this.getInScore();
    }
}

let players = [];

function addPlayer(playerName) {
    if (!playerName) {
        toastr.warning("Player name cannot be empty!", "Warning");
        return;
    }
    const playerId = players.length + 1;
    const newPlayer = new Player(playerName, playerId);
    players.push(newPlayer);
    renderPlayerRows();
}
function renderPlayerRows() {
    const scorecardTable = document.getElementById('scorecard-table');
    let playerRowsHtml = '';

    players.forEach(player => {
        let playerRow = `<tr><td>${player.name}</td>`;
        for (let i = 0; i < 18; i++) {
            playerRow += `<td><input type="number" class="form-control" onchange="updatePlayerScore(${player.id}, ${i}, this.value)" value="${player.scores[i]}"></td>`;
        }
        playerRow += `<td>${player.getOutScore()}</td><td>${player.getInScore()}</td><td>${player.getTotalScore()}</td></tr>`;
        playerRowsHtml += playerRow;
    });

    scorecardTable.innerHTML = playerRowsHtml;
}

function updatePlayerScore(playerId, holeIndex, score) {
    const player = players.find(p => p.id === playerId);
    if (player) {
        player.scores[holeIndex] = parseInt(score) || 0; 
        renderPlayerRows(); 
    }
}

function printScores() {
    players.forEach(player => {
        const totalScore = player.getTotalScore();
        toastr.success(`${player.name} has finished with a total score of ${totalScore}!`, 'Game Finished');
    });
}
