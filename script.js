document.addEventListener('DOMContentLoaded', () => {
    const moodButtons = document.querySelectorAll('.emoji-btn');
    const journalText = document.getElementById('journal-text');
    const saveButton = document.getElementById('save-btn');
    const entriesList = document.getElementById('entries-list');

    let selectedMood = null;

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
}); 