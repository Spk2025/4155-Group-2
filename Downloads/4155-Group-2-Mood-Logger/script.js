document.addEventListener('DOMContentLoaded', () => {
    const moodButtons       = document.querySelectorAll('.emoji-btn');
    const journalText       = document.getElementById('journal-text');
    const saveButton        = document.getElementById('save-btn');
    const resetButton       = document.getElementById('reset-btn');
    const entriesList       = document.getElementById('entries-list');
    const chartTypeSelect   = document.getElementById('chart-type');
    const chartCanvas       = document.getElementById('moodChart').getContext('2d');
    const motivationWrapper = document.getElementById('motivation-container');
    const motivationText    = document.getElementById('motivation-message');


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

            const msg = motivationalCopy[selectedMood] || [];
            if (messages.length) {
                const randomIndex = Math.floor(Math.random() * messages.length);
                motivationalText.textContent = messages[randomIndex];
                motivationWrapper.classList.remove('hidden');
            } else {
                motivationWrapper.classList.add('hidden');
            }
        });
    });


    function updateMoodCounts() {
        console.log('updateMoodCounts called'); // Debug log
        for (const mood in moodCounts) {
            const countElement = document.querySelector(`.emoji-btn[data-mood="${mood}"] + .count`);
            if (countElement) {
                countElement.textContent = moodCounts[mood];
                console.log(`Set count for ${mood} to`, moodCounts[mood]); // Debug log
            } else {
                console.log(`Count element not found for mood: ${mood}`); // Debug log
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
            // Get current date formatted
            const now = new Date();
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            const formattedDate = now.toLocaleDateString(undefined, options);
            entry.innerHTML = `<strong>Feeling ${selectedMood.charAt(0).toUpperCase() + selectedMood.slice(1)} ${emoji}</strong><br>${text}<br><span class="entry-date">${formattedDate}</span>`;
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




    // User Story #4

    // total mood count display update function
    function updateTotalMoodCount() {
        const totalMoodCount = Object.values(moodCounts).reduce((sum, count) => sum + count, 0);
        const totalCountElement = document.getElementById('total-mood-count');
        if (totalCountElement) {
            totalCountElement.textContent = totalMoodCount;
        }
    }

    // call it on load and after updates
    updateTotalMoodCount();

    // call updateTotalMoodCount whenever updateMoodCounts is called to keep in sync
    const originalUpdateMoodCounts = updateMoodCounts;
    updateMoodCounts = function() {
        originalUpdateMoodCounts();
        updateTotalMoodCount();
    };




    function capitalize(s) {
        return s.charAt(0).toUpperCase() + s.slice(1);
    }

    // User Story #5
    // mood message mapping
    const motivationCopy = {
        
        happy:    [
            "Your happiness comes from within-no one can dim your light! 🌟", 
            "Spread and embrace this feeling as if it were a gift. 🎁", 
            "This joy of yours makes the world a better place. ☀️"
        ],
    
        sad:      [
            "This feeling is completely normal-you will come to pass but know you will be stronger. 💙", 
            "Keep your head up and give yourself time to heal. 🌱", 
            "Never think you are alone in this feeling-reach out to others for support. 🤝"
        ],
    
        angry:    [
            "You are valid in this feeling but do not let it consume you-take a deep breath and take back your control. 💪", 
            "Channel this feeling into something positive-not negative. 🔥", 
            "Take a moment to reflect and blow some steam-these are not feelings to act on. 🌬️"
        ],
            
        excited:  [
            "Your excitement is felt by those around you-you deserve to feel like and do not forget it! 🎉", 
            "Let this feeling carry you to take on the day. 🚀", 
            "This energy is magnetic-let this light guide you to your best self. ✨"
        ],
    
        calm:     [
            "The tranquility you feel is unmatched-nothing is comparable to your inner peace. 🧘", 
            "Serenity is a feeling like no other-nothing can ruin your peace. ☮️", 
            "Stay centered and allow your calm nature to anchor your decisions. ⚓️”
        ]
    };



    // User Story 
    // display the current date at the top

    function updateCurrentDate() {
        const dateElement = document.getElementById('current-date');
        if (!dateElement) return;
        const now = new Date();
        
        // format is weekday, month day, year (e.g., Monday, April 8, 2024)
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.textContent = now.toLocaleDateString(undefined, options);
    }
    updateCurrentDate();
    // will update at midnight
    setInterval(updateCurrentDate, 60 * 1000); // updating by the minute

}); 
