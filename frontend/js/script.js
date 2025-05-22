"use strict";

document.addEventListener("DOMContentLoaded", init);

function init() {
    try {
        fetchMatches();

        const form = document.getElementById('matchForm');
        const formWrapper = document.getElementById('formWrapper');
        const openFormButton = document.getElementById('openForm');

        openFormButton.addEventListener('click', () => {
            try {
                formWrapper.classList.remove('hidden');
                form.scrollIntoView({ behavior: 'smooth' });
                console.log('open');
                resetForm();
            } catch (error) {
                console.error('Error opening form:', error);
                showAlert('❌ Fout bij openen formulier.', 'error');
            }
        });

        form.addEventListener('submit', handleFormSubmit);
    } catch (error) {
        console.error('Error during initialization:', error);
        showAlert('❌ Fout bij initialisatie van de applicatie.', 'error');
    }
}

function fetchMatches() {
    try {
        fetch('http://localhost:3333/footballData')
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                const sorted = data.sort((a, b) => new Date(b.datum) - new Date(a.datum));
                renderMatches(sorted);
            })
            .catch(error => {
                console.error('Error fetching matches:', error);
                showAlert('❌ Fout bij ophalen wedstrijden.', 'error');
            });
    } catch (error) {
        console.error('Error in fetchMatches:', error);
        showAlert('❌ Fout bij ophalen wedstrijden.', 'error');
    }
}

function renderMatches(matches) {
    try {
        const list = document.getElementById('matchList');
        list.innerHTML = '';

        matches.forEach(match => {
            const row = document.createElement('tr');
            row.innerHTML =`
                <td>${match.match_date}</td>
                <td>${match.competition_name}</td>
                <td>${match.season}</td>
                <td>${match.home_team_name}</td>
                <td>${match.away_team_name}</td>
                <td>${match.home_score}</td>
                <td>${match.away_score}</td>
                <td>${match.stadium}</td>
                <td>
                    <button class="editButton" data-id="${match.id}">✏️ Wijzig</button>
                    <button class="deleteButton" data-id="${match.id}">🗑️ Verwijder</button>
                </td>
            `;

            row.querySelector('.editButton').addEventListener('click', () => editMatch(match.id));
            row.querySelector('.deleteButton').addEventListener('click', () => deleteMatch(match.id));

            list.appendChild(row);
        });
    } catch (error) {
        console.error('Error rendering matches:', error);
        showAlert('❌ Fout bij weergeven wedstrijden.', 'error');
    }
}

function handleFormSubmit(e) {
    try {
        e.preventDefault();

        const id = document.getElementById('matchId').value;
        const match = {
            match_date: document.getElementById('matchDate').value,
            competition_name: document.getElementById('competitionName').value,
            season: document.getElementById('season').value,
            home_team_name: document.getElementById('homeTeamName').value,
            away_team_name: document.getElementById('awayTeamName').value,
            home_score: document.getElementById('homeScore').value,
            away_score: document.getElementById('awayScore').value,
            stadium: document.getElementById('stadium').value
        };

        const method = id ? 'PUT' : 'POST';
        const url = id
            ? `http://localhost:3333/updateMatch/${id}`
            : 'http://localhost:3333/newMatch';

        fetch(url, {
            method,
            headers: {'content-type': 'application/json'},
            body: JSON.stringify(match)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response;
            })
            .then(() => {
                showAlert(id ? '✏️ Match bijgewerkt' : '✅ Match toegevoegd', 'success');
                console.log(match);
                resetForm();
                fetchMatches();
                document.getElementById('formWrapper').classList.add('hidden');
            })
            .catch(error => {
                console.error('Error submitting form:', error);
                showAlert('❌ Er ging iets mis.', 'error');
            });
    } catch (error) {
        console.error('Error in handleFormSubmit:', error);
        showAlert('❌ Fout bij verwerken formulier.', 'error');
    }
}

function editMatch(id) {
    try {
        fetch(`http://localhost:3333/match/${id}`)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                document.getElementById('matchId').value = data.id;
                document.getElementById('matchDate').value = data.match_date;
                document.getElementById('competitionName').value = data.competition_name;
                document.getElementById('season').value = data.season;
                document.getElementById('homeTeamName').value = data.home_team_name;
                document.getElementById('awayTeamName').value = data.away_team_name;
                document.getElementById('homeScore').value = data.home_score;
                document.getElementById('awayScore').value = data.away_score;
                document.getElementById('stadium').value = data.stadium;
                document.getElementById('formWrapper').classList.remove('hidden');
                document.getElementById('matchForm').scrollIntoView({ behavior: 'smooth' });
            })
            .catch(error => {
                console.error('Error editing match:', error);
                showAlert('❌ Fout bij bewerken wedstrijd.', 'error');
            });
    } catch (error) {
        console.error('Error in editMatch:', error);
        showAlert('❌ Fout bij bewerken wedstrijd.', 'error');
    }
}

function deleteMatch(id){
    try {
        fetch(`http://localhost:3333/match/${id}`, {method: 'DELETE'})
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response;
            })
            .then(() => {
                showAlert('🗑️ Match verwijderd', 'success');
                fetchMatches();
            })
            .catch(error => {
                console.error('Error deleting match:', error);
                showAlert('❌ Verwijderen mislukt.', 'error');
            });
    } catch (error) {
        console.error('Error in deleteMatch:', error);
        showAlert('❌ Verwijderen mislukt.', 'error');
    }
}

function resetForm(){
    try {
        document.getElementById('matchId').value = '';
        document.getElementById('matchForm').reset();
    } catch (error) {
        console.error('Error resetting form:', error);
        showAlert('❌ Fout bij resetten formulier.', 'error');
    }
}

function showAlert(message, type = 'success') {
    try {
        const alertBox = document.getElementById('alert');
        alertBox.textContent = message;
        alertBox.className = `alert ${type}`;
        alertBox.classList.remove('hidden');
        setTimeout(() => alertBox.classList.add('hidden'), 3000);
    } catch (error) {
        console.error('Error showing alert:', error);
        // Fallback naar console log als alert element niet beschikbaar is
        console.log(`Alert: ${message} (${type})`);
    }
}

function updateDate(){
    const now = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }
    document.getElementById('date').innerHTML = now.toLocaleDateString('en-US', options);
}

updateDate();
setInterval(updateDate, 1000);