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
    
    // mood selection and message trigger
    moodButtons.forEach(button => {
        button.addEventListener('click', () => {
            selectedMood = button.dataset.mood;
            moodButtons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');

            // dispay motivational message
            const msg = motivationalCopy[selectedMood] || '';
            if (msg) {
                motivationText.textContent = msg;
                motivationWrapper.classList.remove('hidden');
            } else {
                motivationWrapper.classList.add('hidden');
            }
        });
    });

    function updateMoodCounts() {
        console.log('updateMoodCounts called'); // Debug log
        for (const mood in moodCounts) {
            const countElement = document.querySelector(.emoji-btn[data-mood="${mood}"] + .count);
            if (countElement) {
                countElement.textContent = moodCounts[mood];
                console.log(Set count for ${mood} to, moodCounts[mood]); // Debug log
            } else {
                console.log(Count element not found for mood: ${mood}); // Debug log
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
            const emoji = document.querySelector(.emoji-btn[data-mood="${selectedMood}"]).textContent;
            entry.innerHTML = <strong>Feeling ${selectedMood.charAt(0).toUpperCase() + selectedMood.slice(1)} ${emoji}</strong> ${text};
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
    // reset all including; clear counts, localStorage, and Journal entries
    resetButton.addEventListener('click', () => {
        console.log('Reset All button clicked'); // Debug log
        if (!confirm('Do you wish to clear all mood data and entries?')) return;

        // clear counts in memory
        Object.keys(moodCounts).forEach(m => moodCounts[m] = 0);
        console.log('Mood counts after reset:', moodCounts); // Debug log

        // remove moodCounts from localStorage
        localStorage.removeItem('moodCounts');

        // update count badges
        updateMoodCounts();
        console.log('Mood counts updated in UI'); // Debug log

        // remove all journal entries
        entriesList.innerHTML = '';

        // clear journal text input
        journalText.value = '';

        // deselect any selected mood button
        moodButtons.forEach(btn => btn.classList.remove('selected'));
        selectedMood = null;

        // update the chart to reflect cleared data
        updateMoodChart();
        console.log('Chart updated'); // Debug log
    });

    function capitalize(s) {
        return s.charAt(0).toUpperCase() + s.slice(1);
    }

    // User Story #5
    // motivational message mapping
    const motivationCopy = {
        happy:    "Your happiness comes from within, no one can dim your light! 🌟",
        sad:      "This feeling is completely normal, you will come to pass but know you will be stronger. 💙",
        angry:    "You are valid in this feeling but do not let it consume you, take a deep breath and take back your control. 💪",
        excited:  "Your excitement is felt by those around you, you deserve to feel like and don't forget it! 🎉",
        calm:     "The tranquility you feel is unmatched, nothing is comparable to your inner peace. 🧘"
    };
}); 


