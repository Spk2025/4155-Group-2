document.addEventListener('DOMContentLoaded', () => {
    const moodButtons = document.querySelectorAll('.emoji-btn');
    const journalText = document.getElementById('journal-text');
    const saveButton = document.getElementById('save-btn');
    const entriesList = document.getElementById('entries-list');

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
