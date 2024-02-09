class starUpdater {
    constructor() {
        this.stars = [];
    }
    async saveStars(star) {
        this.stars.push({star});
        try {
            await fetch('/feedback', {
                method: 'POST',
                headers: {'Content-Type': 'application/json',},
                body: JSON.stringify({stars: star})
            });
        }
        catch(err) {
            console.log(err);
        }
    }
    async totalStarRatings() {
        const response = await fetch('/totalFeedback', {
            method: 'GET',
            headers: {'Content-Type': 'application/json',},
        });
        const ratings = await response.json();
        return ratings;
    }
}

class timeUpdater {
    constructor() {
        this.curSessionTimes = [];
    }
    async saveTime(time) {
        this.curSessionTimes.push({time});
        try {
            await fetch('/completionTime', {
                method: 'POST',
                headers: {'Content-Type': 'application/json',},
                body: JSON.stringify({time})
            });
        }
        catch(err) {
            console.log(err);
        }
    }
    async top10Times() {
        // const response = await fetch('/top10Times', {
        //     method: 'GET',
        //     headers: {'Content-Type': 'application/json',},
        // });
        const response = await fetch('/top10Times');
        const times = await response.json();
        return times;
    }
    async deleteTime(time) {
        try {
            const response = await fetch('/deleteTime', {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json',},
                body: JSON.stringify({time})
            });
        }
        catch (err) {
            console.log(err);
        }
    }
    async resetTime() {
        const response = await fetch('/resetTime', {
            method: 'PUT',
            headers: {'Content-Type': 'application/json',},
        });
        const data = response.json();
        return data;
    }
    async render(element) {
        let timesHTML = '<h1>Top Word Scores</h1>';
        timesHTML += '<table>';
        const response = await fetch('/top10Times', {
          method: 'GET',
            headers: {'Content-Type': 'application/json',},
        });
        const topTimes = await response.json();
        topTimes.forEach(time => {
            timesHTML += `
          <tr>
            <td>${time.time}</td>
          </tr>
          `;
        });
        timesHTML += '</table>';
        element.innerHTML = timesHTML;
    }
}

export const timeUpdate = new timeUpdater();
export const starUpdate = new starUpdater();

