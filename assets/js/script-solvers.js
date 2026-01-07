document.addEventListener("DOMContentLoaded", function() {
    
    fetch('assets/json/results.json')
        .then(response => response.json())
        .then(fullData => {
            let data = [];
            // Adaptation au format PHPMyAdmin
            if (fullData[2] && fullData[2].data) {
                data = fullData[2].data;
            } else {
                data = fullData;
            }
            
            processSolversTable(data);
            drawCactusPlot(data);
        })
        .catch(err => console.error("Erreur:", err));

    function processSolversTable(data) {
        if (data.length === 0) return;

        const sample = data[0];
        const keySolver = sample.hasOwnProperty('name') ? 'name' : 'solver';
        const keyStatus = sample.hasOwnProperty('status') ? 'status' : (sample.hasOwnProperty('statut') ? 'statut' : 'etat');
        const keyTime = sample.hasOwnProperty('time') ? 'time' : 'temps';

        let solversMap = {};

        data.forEach(row => {
            let name = row[keySolver];
            let status = row[keyStatus];
            let time = parseFloat(row[keyTime]);

            if (!solversMap[name]) {
                solversMap[name] = {
                    name: name,
                    totalCount: 0,
                    totalTime: 0,
                    solvedCount: 0,
                    solvedTime: 0
                };
            }

            let s = solversMap[name];
            s.totalCount++;
            s.totalTime += time;

            if (status === 'SAT' || status === 'UNSAT') {
                s.solvedCount++;
                s.solvedTime += time;
            }
        });

        let solversArray = Object.values(solversMap).map(s => {
            return {
                name: s.name,
                solvedCount: s.solvedCount,
                totalCount: s.totalCount,
                avgSolved: s.solvedCount > 0 ? (s.solvedTime / s.solvedCount) : 0,
                avgGlobal: s.totalCount > 0 ? (s.totalTime / s.totalCount) : 0,
                successRate: s.totalCount > 0 ? ((s.solvedCount / s.totalCount) * 100) : 0
            };
        });

        solversArray.sort((a, b) => {
            if (a.solvedCount === 0) return 1;
            if (b.solvedCount === 0) return -1;
            return a.avgSolved - b.avgSolved;
        });

        renderSolverTable(solversArray);
    }

    function renderSolverTable(solvers) {
        const tbody = document.getElementById('solvers-table-body');
        if(!tbody) return;
        tbody.innerHTML = '';

        solvers.forEach((s, index) => {
            let tr = document.createElement('tr');
            let rankDisplay = index + 1;
            if (index === 0) rankDisplay = '🥇';
            if (index === 1) rankDisplay = '🥈';
            if (index === 2) rankDisplay = '🥉';

            tr.innerHTML = `
                <td><p class="text-sm font-weight-bold mb-0 ps-3">${rankDisplay}</p></td>
                <td><div class="d-flex px-2"><h6 class="mb-0 text-sm">${s.name}</h6></div></td>
                <td><p class="text-sm font-weight-bold mb-0">${s.solvedCount} / ${s.totalCount}</p></td>
                <td><span class="badge badge-sm bg-gradient-success">${s.avgSolved.toFixed(2)} s</span></td>
                <td><span class="text-xs font-weight-bold">${s.avgGlobal.toFixed(2)} s</span></td>
                <td class="align-middle">
                    <div class="d-flex align-items-center justify-content-center">
                        <span class="me-2 text-xs font-weight-bold">${s.successRate.toFixed(1)}%</span>
                        <div><div class="progress"><div class="progress-bar bg-gradient-info" role="progressbar" aria-valuenow="${s.successRate}" aria-valuemin="0" aria-valuemax="100" style="width: ${s.successRate}%;"></div></div></div>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    function drawCactusPlot(data) {
        
        const sample = data[0];
        const keySolver = sample.hasOwnProperty('name') ? 'name' : 'solver';
        const keyStatus = sample.hasOwnProperty('status') ? 'status' : (sample.hasOwnProperty('statut') ? 'statut' : 'etat');
        const keyTime = sample.hasOwnProperty('time') ? 'time' : 'temps';

        let solversTimes = {};

        data.forEach(d => {
            if (d[keyStatus] === 'SAT' || d[keyStatus] === 'UNSAT') {
                let name = d[keySolver];
                let time = parseFloat(d[keyTime]);
                
                if (!solversTimes[name]) solversTimes[name] = [];
                solversTimes[name].push(time);
            }
        });

        let series = [];
        for (const [name, times] of Object.entries(solversTimes)) {
            times.sort((a, b) => a - b);
            
            let values = times.map((t, i) => {
                return { time: t, count: i + 1 };
            });
            
            series.push({ name: name, values: values });
        }

        const container = document.getElementById("d3-cactus-plot");
        if(!container) return;
        container.innerHTML = '';

        const margin = { top: 20, right: 100, bottom: 50, left: 50 };
        const width = container.parentElement.clientWidth - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;

        const svg = d3.select("#d3-cactus-plot")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleLinear()
            .domain([0, d3.max(series, s => d3.max(s.values, d => d.time))])
            .range([0, width]);

        const y = d3.scaleLinear()
            .domain([0, d3.max(series, s => s.values.length)])
            .range([height, 0]);

        const color = d3.scaleOrdinal(d3.schemeCategory10);

        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x))
            .attr("class", "axis");

        svg.append("g")
            .call(d3.axisLeft(y))
            .attr("class", "axis");

        svg.append("g")
            .attr("class", "grid")
            .attr("opacity", 0.1)
            .call(d3.axisLeft(y).tickSize(-width).tickFormat(""))

        const line = d3.line()
            .x(d => x(d.time))
            .y(d => y(d.count));

        series.forEach(serie => {
            svg.append("path")
                .datum(serie.values)
                .attr("class", "line")
                .attr("fill", "none")
                .attr("stroke", color(serie.name))
                .attr("stroke-width", 2.5)
                .attr("d", line)
                .on("mouseover", function(event, d) {
                    d3.select(this).attr("stroke-width", 4);
                })
                .on("mouseout", function(event, d) {
                    d3.select(this).attr("stroke-width", 2.5);
                });
        });

        // 5. Légende
        const legend = svg.selectAll(".legend")
            .data(series)
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", (d, i) => `translate(${width + 10},${i * 20})`);

        legend.append("rect")
            .attr("x", 0)
            .attr("width", 10)
            .attr("height", 10)
            .style("fill", d => color(d.name));

        legend.append("text")
            .attr("x", 15)
            .attr("y", 6)
            .attr("dy", ".35em")
            .style("text-anchor", "start")
            .style("font-size", "12px")
            .text(d => d.name);
            
        // Titres des axes
        svg.append("text")
            .attr("text-anchor", "end")
            .attr("x", width)
            .attr("y", height + 40)
            .style("fill", "#666")
            .text("Temps (secondes)");

        svg.append("text")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .attr("y", -30)
            .attr("x", 0)
            .style("fill", "#666")
            .text("Instances résolues");
    }
});