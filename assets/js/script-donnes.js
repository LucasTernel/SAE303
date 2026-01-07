document.addEventListener("DOMContentLoaded", function() {
    
    let allData = [];

    // Chargement du JSON
    fetch('assets/json/results.json')
        .then(response => response.json())
        .then(fullData => {
            if (fullData[2] && fullData[2].data) {
                allData = fullData[2].data;
            } else {
                allData = fullData;
            }

            
            initFilters(allData);
            renderTable(allData);
        })
        .catch(err => console.error("Erreur chargement:", err));


    function initFilters(data) {
        if (data.length === 0) return;

        const sample = data[0];
        const keySolver = sample.hasOwnProperty('name') ? 'name' : 'solver';

        const solvers = [...new Set(data.map(item => item[keySolver]))].sort();

        const select = document.getElementById('filterSolver');
        select.innerHTML = '<option value="all">Tous les solveurs</option>';
        
        solvers.forEach(solver => {
            let option = document.createElement('option');
            option.value = solver;
            option.innerText = solver;
            select.appendChild(option);
        });

        document.getElementById('filterSolver').addEventListener('change', filterData);
        document.getElementById('filterStatus').addEventListener('change', filterData);
    }

    function filterData() {
        const selectedSolver = document.getElementById('filterSolver').value;
        const selectedStatus = document.getElementById('filterStatus').value;
        
        if (allData.length === 0) return;

        const sample = allData[0];
        const keySolver = sample.hasOwnProperty('name') ? 'name' : 'solver';
        const keyStatus = sample.hasOwnProperty('status') ? 'status' : (sample.hasOwnProperty('statut') ? 'statut' : 'etat');

        const filtered = allData.filter(item => {
            const matchSolver = (selectedSolver === 'all') || (item[keySolver] === selectedSolver);
            const matchStatus = (selectedStatus === 'all') || (item[keyStatus] === selectedStatus);

            return matchSolver && matchStatus;
        });

        renderTable(filtered);
    }

    function renderTable(data) {
        const tbody = document.getElementById('table-body');
        const countSpan = document.getElementById('rows-count');
        
        tbody.innerHTML = '';
        countSpan.innerText = data.length;

        if(data.length === 0) return;
        
        const sample = data[0];
        const keySolver = sample.hasOwnProperty('name') ? 'name' : 'solver';
        const keyStatus = sample.hasOwnProperty('status') ? 'status' : (sample.hasOwnProperty('statut') ? 'statut' : 'etat');
        const keyTime = sample.hasOwnProperty('time') ? 'time' : 'temps';
        const keyProblem = sample.hasOwnProperty('fullName') ? 'fullName' : (sample.hasOwnProperty('problem') ? 'problem' : 'id'); 

        data.slice(0, 500).forEach(row => {
            
            let tr = document.createElement('tr');
            
            let badgeClass = 'bg-gradient-secondary';
            if (row[keyStatus] === 'SAT') badgeClass = 'bg-gradient-success'; 
            if (row[keyStatus] === 'UNSAT') badgeClass = 'bg-gradient-danger'; 
            if (row[keyStatus] === 'UNSUPPORTED') badgeClass = 'bg-gradient-warning';

            tr.innerHTML = `
                <td>
                    <div class="d-flex px-2 py-1">
                        <div class="d-flex flex-column justify-content-center">
                            <h6 class="mb-0 text-sm">${row[keySolver]}</h6>
                        </div>
                    </div>
                </td>
                <td>
                    <p class="text-xs font-weight-bold mb-0">${row[keyProblem] || 'N/A'}</p>
                </td>
                <td class="align-middle text-center text-sm">
                    <span class="badge badge-sm ${badgeClass}">${row[keyStatus]}</span>
                </td>
                <td class="align-middle text-center">
                    <span class="text-secondary text-xs font-weight-bold">${row[keyTime] ? parseFloat(row[keyTime]).toFixed(2) : '-'} s</span>
                </td>
            `;
            tbody.appendChild(tr);
        });
        
        if (data.length > 500) {
            let tr = document.createElement('tr');
            tr.innerHTML = `<td colspan="4" class="text-center text-secondary text-xs py-3">... et ${data.length - 500} autres résultats masqués pour la performance ...</td>`;
            tbody.appendChild(tr);
        }
    }
});