// TODO: #40 Update Mood Logging Logic to Include Date
// TODO: #41 Modify the mood UI to display each logged mood with its corresponding date
// TODO: #43 Test mood date logging functionality
document.addEventListener('DOMContentLoaded', () => {
    const moodButtons       = document.querySelectorAll('.emoji-btn');
    const journalText       = document.getElementById('journal-text');
    const saveButton        = document.getElementById('save-btn');
    const cancelButton      = document.getElementById('cancel-btn');
    const resetButton       = document.getElementById('reset-btn');
    const entriesList       = document.getElementById('entries-list');
    const chartTypeSelect   = document.getElementById('chart-type');
    const chartCanvas       = document.getElementById('moodChart').getContext('2d');
    const motivationWrapper = document.getElementById('motivation-container');
    const motivationText    = document.getElementById('motivation-message');
    const intensitySlider   = document.getElementById('mood-intensity');
    const intensityValue   = document.getElementByID('intensity-value');

    intensitySlider.addEventListener('input', () => {
        intensityValue.textContent = intensitySlider.value;
    });


    let selectedMood = null;
    let editingEntryIndex = null;


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




    // --- Mood Log Persistence ---
    // Load entries from localStorage
    function loadMoodEntries() {
        const entries = JSON.parse(localStorage.getItem('moodEntries')) || [];
        entriesList.innerHTML = '';
        entries.forEach((entry, index) => {
            const li = document.createElement('li');
            li.className = 'entry-item';
            li.innerHTML = `
                <div class="entry-content">
                    <strong>Feeling ${entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1)} ${entry.emoji}</strong><br>
                    <span class="entry-text">${entry.text}</span><br>
                    <span class="entry-date">${entry.date}</span>
                </div>
                <div class="entry-actions">
                    <button class="edit-btn" data-index="${index}">✏️ Edit</button>
                    <button class="delete-btn" data-index="${index}">🗑️ Delete</button>
                </div>
            `;
            entriesList.appendChild(li);
        });
        addEntryActionListeners();
    }

    // Add event listeners to edit and delete buttons
    function addEntryActionListeners() {
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => editEntry(parseInt(btn.dataset.index)));
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => deleteEntry(parseInt(btn.dataset.index)));
        });
    }

    // edit entry function
    function editEntry(index) {
        const entries = JSON.parse(localStorage.getItem('moodEntries')) || [];
        if (index >= 0 && index < entries.length) {
            const entry = entries[index];
            editingEntryIndex = index;

            journalText.value = entry.text;
            
            // select the mood
            moodButtons.forEach(btn => btn.classList.remove('selected'));
            const moodButton = document.querySelector(`.emoji-btn[data-mood="${entry.mood}"]`);
            if (moodButton) {
                moodButton.classList.add('selected');
                selectedMood = entry.mood;
            }
            
            // update UI for edit mode
            saveButton.textContent = 'Update Entry';
            saveButton.classList.add('editing');
            cancelButton.classList.remove('hidden');
        }
    }

    // delete entry function
    function deleteEntry(index) {
        const entries = JSON.parse(localStorage.getItem('moodEntries')) || [];
        if (index >= 0 && index < entries.length) {
            if (confirm('Are you sure you want to delete this entry?')) {
                const deletedEntry = entries[index];
                
                // remove entry from array
                entries.splice(index, 1);
                localStorage.setItem('moodEntries', JSON.stringify(entries));
                
                // update mood counts
                if (moodCounts[deletedEntry.mood] > 0) {
                    moodCounts[deletedEntry.mood]--;
                    localStorage.setItem('moodCounts', JSON.stringify(moodCounts));
                    updateMoodCounts();
                    updateMoodChart();
                }
                
                // reload the entries to update UI
                loadMoodEntries();
            }
        }
    }


    function updateMoodEntry(index, mood, text, emoji, date) {
        const entries = JSON.parse(localStorage.getItem('moodEntries')) || [];
        if (index >= 0 && index < entries.length) {
            entries[index] = { mood, text, emoji, date };
            localStorage.setItem('moodEntries', JSON.stringify(entries));
        }
    }

    // save a new entry to localStorage
    function saveMoodEntry(mood, text, emoji, date, intensity) {
        const entries = JSON.parse(localStorage.getItem('moodEntries')) || [];
        entries.unshift({ mood, text, emoji, date, intensity });
        localStorage.setItem('moodEntries', JSON.stringify(entries));
    }

    // clear all entries from localStorage
    function clearMoodEntries() {
        localStorage.removeItem('moodEntries');
        entriesList.innerHTML = '';
    }

    loadMoodEntries();


    saveButton.addEventListener('click', () => {
        const text = journalText.value.trim();
        
        if (!selectedMood) {
            alert('Please select your mood first!');
            return;
        }
        
        if (!text) {
            alert('Please write something about your feeling.');
            return;
        }

        if (editingEntryIndex !== null) {
            // update existing entry
            const entries = JSON.parse(localStorage.getItem('moodEntries')) || [];
            const entry = entries[editingEntryIndex];
            const emoji = document.querySelector(`.emoji-btn[data-mood="${selectedMood}"]`).textContent;
            
            // update mood counts if mood changed
            if (entry.mood !== selectedMood) {

                moodCounts[entry.mood]--;

                moodCounts[selectedMood]++;

                localStorage.setItem('moodCounts', JSON.stringify(moodCounts));
                updateMoodCounts();
                updateMoodChart();
            }

            updateMoodEntry(editingEntryIndex, selectedMood, text, emoji, entry.date);
            
            // reset edit mode
            editingEntryIndex = null;
            saveButton.textContent = 'Log Entry';

            saveButton.classList.remove('editing');

            cancelButton.classList.add('hidden');
        } else {
            // create new entry
            moodCounts[selectedMood]++;
            localStorage.setItem('moodCounts', JSON.stringify(moodCounts));
            updateMoodCounts();

            const emoji = document.querySelector(`.emoji-btn[data-mood="${selectedMood}"]`).textContent;
            const now = new Date();
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            const formattedDate = now.toLocaleDateString(undefined, options);
            const intensity = parseInt(intensitySlider.value, 10);
            
            saveMoodEntry(selectedMood, text, emoji, formattedDate, intensity);
        }

        // clear form
        journalText.value = '';
        moodButtons.forEach(btn => btn.classList.remove('selected'));
        selectedMood = null;
        
        // reload entries to update UI
        loadMoodEntries();
    });

    // cancel button event listener
    cancelButton.addEventListener('click', () => {
        // cancel edit mode and clear form
        editingEntryIndex = null;
        journalText.value = '';

        moodButtons.forEach(btn => btn.classList.remove('selected'));

        selectedMood = null;
        saveButton.textContent = 'Log Entry';

        saveButton.classList.remove('editing');
        cancelButton.classList.add('hidden');
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
        clearMoodEntries();

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

    function computeIntensitySums() {
        const entries = JSON.parse(localStorage.getItem('moodEntries')) || [];
        const sums = { happy:0, sad:0, angry:0, excited:0, calm:0 };
        entries.forEach(e => {
            if (sums[e.mood] !== undefined) sums[e.mood] += e.intensity;
        });
        return Object.values(sums);
    }
    
    // call updateTotalMoodCount whenever updateMoodCounts is called to keep in sync
    const originalUpdateMoodCounts = updateMoodCounts;
    updateMoodCounts = function() {
        // replace dataset with intensity sums
        moodChart.data.datasets[0].data = computeIntensitySums();
        moodChart.update();
    };
    // reset the bar values on first load
    moodChart.data.datasets[0].data = computeIntensitySums();
    moodChart.update();



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
            "Stay centered and allow your calm nature to anchor your decisions. ⚓️"
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

    function updateTotals() {
        const entries = JSON.parse(localStorage.getItem('moodEntries')) || [];
        document.getElementById('total-mood-count').textContent = entries.length;
        const totalIntensity = entries.reduce((sum,e) => sum + e.intensity, 0);
        document.getElementById('total-intensity').textContent = totalIntensity;
  }

  // call after loadMoodEntries() and after every save/reset
  loadMoodEntries();
  updateTotals();
  saveButton.addEventListener('click', updateTotals);
  resetButton.addEventListener('click', updateTotals);

}); 
