document.addEventListener("DOMContentLoaded", function() {
    
    fetch('assets/json/results.json')
        .then(response => {
            if (!response.ok) {
                throw new Error("Erreur HTTP " + response.status);
            }
            return response.json();
        })
        .then(fullData => {
            let data = [];
            if (fullData[2] && fullData[2].data) {
                data = fullData[2].data;
            } else {
                data = fullData;
            }
            updateDashboard(data);
        })
        .catch(err => {
            console.error("Erreur de chargement :", err);
            alert("Erreur ! Vérifie la console (F12) pour les détails.");
        });
});

function updateDashboard(data) {
    const KEY_SOLVER = 'name'; 
    let sample = data[0];
    let KEY_STATUS = 'status';
    
    if (sample.hasOwnProperty('statut')) KEY_STATUS = 'statut';
    if (sample.hasOwnProperty('etat')) KEY_STATUS = 'etat';

    const total = data.length;
    const resolved = data.filter(d => d[KEY_STATUS] === 'SAT' || d[KEY_STATUS] === 'UNSAT');
    const successRate = total > 0 ? ((resolved.length / total) * 100).toFixed(1) : 0;

    let solverCounts = {};
    
    let statusCounts = {'SAT': 0, 'UNSAT': 0, 'UNKNOWN': 0, 'UNSUPPORTED': 0};

    data.forEach(d => {
        let nomSolveur = d[KEY_SOLVER]; 
        let statut = d[KEY_STATUS];

        if (statusCounts[statut] !== undefined) {
            statusCounts[statut]++;
        } else {
        }

        if (!solverCounts[nomSolveur]) solverCounts[nomSolveur] = 0;
        
        if (statut === 'SAT' || statut === 'UNSAT') {
            solverCounts[nomSolveur]++;
        }
    });

    let sortedSolvers = Object.keys(solverCounts).sort((a,b) => solverCounts[b] - solverCounts[a]);
    let bestSolver = sortedSolvers.length > 0 ? sortedSolvers[0] : "-";


    try {
        document.getElementById('kpi-total').innerText = total;
        document.getElementById('kpi-success').innerText = successRate + ' %';
        document.getElementById('kpi-best').innerText = bestSolver;
        document.getElementById('kpi-solvers-count').innerText = Object.keys(solverCounts).length;
    } catch (e) {
        console.warn("Certains IDs de KPI manquent dans le HTML", e);
    }

    const ctxBars = document.getElementById('chart-bars');
    if (ctxBars) {
        new Chart(ctxBars.getContext('2d'), {
            type: 'bar',
            data: {
                labels: sortedSolvers,
                datasets: [{
                    label: 'Problèmes Résolus',
                    data: sortedSolvers.map(s => solverCounts[s]),
                    backgroundColor: '#e91e63',
                    barThickness: 10,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } }
            }
        });
    }

    const ctxPie = document.getElementById('chart-pie');
    if (ctxPie) {
        new Chart(ctxPie.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['SAT', 'UNSAT', 'UNKNOWN', 'UNSUPPORTED'],
                datasets: [{
                    data: [
                        statusCounts.SAT, 
                        statusCounts.UNSAT, 
                        statusCounts.UNKNOWN, 
                        statusCounts.UNSUPPORTED
                    ],
                    backgroundColor: [
                        '#4CAF50', 
                        '#F44336', 
                        '#9E9E9E', 
                        '#fb8c00' 
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'right' } }
            }
        });
    }
}