document.addEventListener('DOMContentLoaded', () => {
    const moodButtons = document.querySelectorAll('.emoji-btn');
    const journalText = document.getElementById('journal-text');
    const saveButton  = document.getElementById('save-btn');
    const resetButton = document.getElementById('reset-btn');
    const entriesList = document.getElementById('entries-list');
    const chartTypeSelect = document.getElementById('chart-type');
    const chartCanvas = document.getElementById('moodChart').getContext('2d');


    let selectedMood = null;

    // User Story #1
    // this loads the counts from local storage or default to 0
    const moodCounts = JSON.parse(localStorage.getItem('moodCounts')) || {
        happy: 0,
        sad: 0,
        angry: 0,
        excited: 0,
        calm: 0,
    };

    // update counts on page load
    updateMoodCounts();

    moodButtons.forEach(button => {
        button.addEventListener('click', () => {
            selectedMood = button.dataset.mood;
            moodButtons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
        });
    });

    function updateMoodCounts() {
        for (const mood in moodCounts) {
            const countElement = document.querySelector(`.emoji-btn[data-mood="${mood}"] + .count`);
            if (countElement) {
                countElement.textContent = moodCounts[mood];
            }
        }
    }

    saveButton.addEventListener('click', () => {
        const text = journalText.value.trim();
        if (selectedMood && text) {
            // increment count for the selected mood
            moodCounts[selectedMood]++;
            
            // save counts to local storage
            localStorage.setItem('moodCounts', JSON.stringify(moodCounts));
            
            // update UI
            updateMoodCounts();

            const entry = document.createElement('li');
            const emoji = document.querySelector(`.emoji-btn[data-mood="${selectedMood}"]`).textContent;
            entry.innerHTML = `<strong>Feeling ${selectedMood.charAt(0).toUpperCase() + selectedMood.slice(1)} ${emoji}</strong> ${text}`;
            entriesList.prepend(entry);

            // clear inputs
            journalText.value = '';
            moodButtons.forEach(btn => btn.classList.remove('selected'));
            selectedMood = null;

        } else if (!selectedMood) {
            alert('Please select your mood first!');
        } else if (!text) {
            alert('Please write something about your feeling.');
        }
    });

    // User Story #2
    // display live chart that summarizes mood frequency

    let moodChart = new Chart(chartCanvas, {
        type: 'bar',
        data: {
            labels: Object.keys(moodCounts),
            datasets: [{
                label: 'Mood Frequency',
                data: Object.values(moodCounts),
                backgroundColor: [
                    'rgba(255, 205, 86, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { precision: 0 }
                }
            }
        }
    });

    function updateMoodChart() {
        moodChart.data.datasets[0].data = Object.values(moodCounts);
        moodChart.update();
    }

    chartTypeSelect.addEventListener('change', () => {
        const newType = chartTypeSelect.value;

        moodChart.destroy();

        moodChart = new Chart(chartCanvas, {
            type: newType,
            data: {
                labels: Object.keys(moodCounts),
                datasets: [{
                    label: 'Mood Frequency',
                    data: Object.values(moodCounts),
                    backgroundColor: [
                        'rgba(255, 205, 86, 0.7)',
                        'rgba(54, 162, 235, 0.7)',
                        'rgba(255, 99, 132, 0.7)',
                        'rgba(75, 192, 192, 0.7)',
                        'rgba(153, 102, 255, 0.7)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: newType === 'bar' ? {
                    y: {
                        beginAtZero: true,
                        ticks: { precision: 0 }
                    }
                } : {}
            }
        });
    });

    // User Story #3
    // **Reset All**: Including; clear counts, localStorage, and Journal entries
    resetButton.addEventLister('click', () => {
        if (!confirm('Do you wish to clear all mood data and entries?')) return;

        // clear counts in memory
        Object.keys(moodCounts).forEach(m => moodCounts[m] = 0);

        // persist cleared state
        localStorage.setItem('moodCounts', JSON.stringify(moodCounts));

        // update count badges
        updateMoodCounts();

        // remove all jounral entries
        entriesList.innerHTML = '';
    });

    // Helper: update count badge next to each emoji
    function updateMoodCOunts() {
        for (const mood in moodCounts) {
            const countEl = document.querySelector(`.emoji-btn[data-mood="${mood}"] + .count`);
            if (countEl) countEl.textContent = moodCOunts[mood];
        }
    }

    function capitalize(s) {
        return s.charAt(0).toUpperCase() + s.slice(1);
    }
}); 
