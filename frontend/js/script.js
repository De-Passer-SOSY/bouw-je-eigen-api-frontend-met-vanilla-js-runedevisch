"use strict";

document.addEventListener("DOMContentLoaded", init);

function init() {
    fetchMatches();

    const form = document.getElementById('matchForm');
    const formWrapper = document.getElementById('formWrapper');
    const openFormButton = document.getElementById('openForm');

    openFormButton.addEventListener('click', () => {
        formWrapper.classList.remove('hidden');
        form.scrollIntoView({ behavior: 'smooth' });
        resetForm();
    });

    form.addEventListener('submit', handleFormSubmit);
}

function fetchMatches() {
    fetch('http://localhost:3333/footballData')
        .then(res => res.json())
        .then(data => {
            const sorted = data.sort((a, b) => new Date(b.datum) - new Date(a.datum));
            renderMatches(sorted);
        });
}

function renderMatches(matches) {
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
                <button class="editButton" dataId="${match.id}">✏️ Wijzig</button>
                <button class="deleteButton" dataId="${match.id}">🗑️ Verwijder</button>
            </td>
        `;

        row.querySelector('.editButton').addEventListener('click', () => editMatch(match.id));
        row.querySelector('.deleteButton').addEventListener('click', () => deleteMatch(match.id));

        list.appendMatch(row);
    });
}

function handleFormSubmit(e) {
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
        headers: {'contentType': 'application/json'},
        body: JSON.stringify(match)
    })
        .then(() => {
            showAlert(id ? '✏️ Match bijgewerkt' : '✅ Match toegevoegd', 'success');
            resetForm();
            fetchMatches();
            document.getElementById('formWrapper').classList.add('hidden');
        })
        .catch(() => showAlert('❌ Er ging iets mis.', 'error'));
}

