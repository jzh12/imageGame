import { timeUpdate, starUpdate } from './endpoint.js';

const body = document.body;
const playRating = document.getElementById('playRating');
const resetButton = document.getElementById('resetRating');
const playButton = document.getElementById('play');
const sessionTimes = document.getElementById('sessionScores');
const timeDeletion = document.getElementById('timeDeletion');
const deleteButton = document.getElementById('confirmTimeDeletion');
const clearSession = document.getElementById('clearSession');

const progressBar = document.getElementById('progressBar');
const level1 = document.getElementById('level1');
const level2 = document.getElementById('level2');
const level3 = document.getElementById('level3');
const level4 = document.getElementById('level4');
const level5 = document.getElementById('level5');
const homeScreen = document.getElementById('homescreen');
const gameScreen = document.getElementById('gamescreen');
const firstImage = document.getElementById('image1');
const secondImage = document.getElementById('image2');
const thirdImage = document.getElementById('image3');
const fourthImage = document.getElementById('image4');
const fourthWordImage = document.getElementById('wordImage');
const fifthDiv = document.getElementById('image5');
const fifthImage = document.getElementById('finalImage');
const completionImage = document.getElementById('completion');
const firstImageArea = document.getElementById('bunnyArea');
const secondImageArea = document.getElementById('carrotArea');
const thirdImageArea = document.getElementById('saturatedArea');
const fourthImageDraggable = document.getElementById('draggableImage');
const fifthImageArea = document.getElementById('faceArea');
const fifthText = document.getElementById('5thText');
const time = document.getElementById('elapsedTime');
const finishScreen = document.getElementById('finishscreen');
const close = document.getElementById('closeButton');
const shareButtons = document.getElementById('share');


homeScreen.style.display = 'block';
gameScreen.style.display = 'none';
firstImage.style.display = 'none';
secondImage.style.display = 'none';
thirdImage.style.display = 'none';
fourthImage.style.display = 'none';
fifthDiv.style.display = 'none';
fifthDiv.style.display = 'none';
fifthText.style.display = 'none';
completionImage.style.display = 'none';
shareButtons.style.display = 'none';

playRating.addEventListener('click', async () => {
    const value = document.getElementById('starvalue').value;
    if (isNaN(value)) {
        return;
    }
    if (value > 5 || value < 1) {
        return;
    }
    const stars = document.querySelectorAll('.stars span');
    stars.forEach(star => star.classList.remove('checked'));
    for (let curStar = 1; curStar <= value; curStar++) {
        const star = document.getElementById(`star${curStar}`);
        star.classList.add('checked');
    }
    localStorage.setItem('starCount', value);
    await starUpdate.saveStars(value);
});

resetButton.addEventListener('click', () => {
    const stars = document.querySelectorAll('.stars span');
    stars.forEach(star => star.classList.remove('checked'));
    localStorage.removeItem('starCount');
    timeUpdate.resetTime();
    
});

const avgRating = document.getElementById('avgRating');
avgRating.addEventListener('click', async () => {
    const text = document.getElementById('avgStarText');
    const starJSON = await starUpdate.totalStarRatings();
    let totalStars = 0;
    let starCount = 0;
    for (const curObj of starJSON) {
        ++starCount;
        totalStars += curObj.stars;
    }
    text.innerHTML = `<p>The average star count is: ${totalStars/starCount}</p>`
});

function restoreState() {
    const starValue = localStorage.getItem('starCount');
    for (let i = 1; i <= starValue; i++) {
        const star = document.getElementById(`star${i}`);
        star.classList.add('checked');
    }
    const topTimes = JSON.parse(localStorage.getItem('bestTimes'));
    if (topTimes === null) {
        return;
    }
    timeUpdate.render(sessionTimes);
}
restoreState();

let startTime = 0;
let finalTime = 0;
let elapsedTime = 0;

playButton.addEventListener('click', () => {
    homeScreen.style.display = 'none';
    gameScreen.style.display = 'block';
    firstImage.style.display = 'block';
    startTime = Date.now();
});

firstImageArea.addEventListener('click', () => {
    document.getElementById('image1').style.display = 'none';
    level1.classList.add('progressLevelComplete');
    document.getElementById('image2').style.display = 'block';
});

secondImageArea.addEventListener('click', () => {
    level2.classList.add('progressLevelComplete');
    document.getElementById('image2').style.display = 'none';
    document.getElementById('image3').style.display = 'block';
});
thirdImageArea.addEventListener('click', async () => {
    level3.classList.add('progressLevelComplete');
    document.getElementById('image3').style.display = 'none';
    document.getElementById('image4').style.display = 'block';
})

fourthImageDraggable.addEventListener('dragstart', e => {
    e.dataTransfer.setData('text/plain', 'currently dragging can');
});

fourthWordImage.addEventListener('dragover', e => {
    e.preventDefault();
});

fourthWordImage.addEventListener('drop', e => {
    if (e.dataTransfer.getData('text/plain') === 'currently dragging can') {
        fourthImage.style.display = 'none';
        fifthText.style.display = 'block';
        fifthDiv.style.display = 'block';
        fifthImage.style.display = 'block';
        level4.classList.add('progressLevelComplete');
    }
});

let xPos = 0;
let yPos = 0;
fifthDiv.addEventListener("mousemove", e => {
    xPos = e.clientX - 410;
    yPos = e.clientY - 339;
    fifthDiv.style.setProperty("--Xpos", xPos + "px");
    fifthDiv.style.setProperty("--Ypos", yPos + "px");
});
fifthDiv.addEventListener('mousemove', (e) => {
    console.log(e.clientX);
    console.log(e.clientY);
});
fifthImageArea.addEventListener('click', async() => {
    level5.classList.add('progressLevelComplete');
    fifthImage.style.display = 'none';
    completionImage.style.display = 'block';
    finishScreen.style.display = 'block';
    finalTime = Date.now();
    elapsedTime = (finalTime - startTime)/1000;
    time.innerHTML = `<p>Your finishing time was ${elapsedTime} seconds!</p>`;
    await timeUpdate.saveTime(elapsedTime);
    const times = await timeUpdate.top10Times();
    await timeUpdate.render(sessionTimes);
    localStorage.setItem('bestTimes', JSON.stringify(times));
});
completionImage.addEventListener('click', () => {
    finishScreen.style.display = 'block';
});

close.addEventListener('click', () => {
    finishScreen.style.display = 'none';
});

deleteButton.addEventListener('click', async () => {
    const value = timeDeletion.value;
    if (isNaN(value)) {
        return;
    }
    const curTimes = JSON.parse(localStorage.getItem('bestTimes'));
    const filteredTimes = curTimes.filter(obj => obj.time !== value);
    localStorage.setItem('bestTimes', JSON.stringify(filteredTimes));
    await timeUpdate.deleteTime(value);
    await timeUpdate.render(sessionTimes);
});

clearSession.addEventListener('click', async () => {
    localStorage.removeItem('bestTimes');
    sessionTimes.innerHTML = '';
    await timeUpdate.resetTime();
});
