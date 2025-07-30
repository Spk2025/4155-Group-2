/**
 * Automated Unit Tests for Edit Functionality
 * User Story #44: As a user, I want to edit a mood entry I made previously, 
 * so that I can correct any mistakes I made or even add more details.
 */

describe('Edit Functionality Tests', () => {
  let container;
  let script;

  beforeEach(() => {
    // setting up dom
    container = document.createElement('div');
    container.innerHTML = `
      <div id="current-date" class="date-display"></div>
      <div id="total-moods-section" class="total-moods">
        <h3>Total Moods Logged: <span id="total-mood-count">0</span></h3>
      </div>
      <div class="container">
        <div class="moods">
          <div class="mood">
            <button class="emoji-btn" data-mood="happy">😊</button>
            <p class="count">0</p>
          </div>
          <div class="mood">
            <button class="emoji-btn" data-mood="sad">😢</button>
            <p class="count">0</p>
          </div>
        </div>
        <div class="journal-entry">
          <textarea id="journal-text" placeholder="Describe your feeling..."></textarea>
          <div class="entry-buttons">
            <button id="save-btn">Log Entry</button>
            <button id="cancel-btn" class="secondary hidden">Cancel</button>
            <button id="reset-btn" class="secondary">Reset All</button>
          </div>
        </div>
        <div class="entries">
          <ul id="entries-list"></ul>
        </div>
        <div class="chart-section">
          <select id="chart-type">
            <option value="bar">Bar</option>
            <option value="pie">Pie</option>
          </select>
          <canvas id="moodChart" width="400" height="200"></canvas>
        </div>
      </div>
    `;
    document.body.appendChild(container);

    // Load script
    script = document.createElement('script');
    script.src = '../script.js';
    document.head.appendChild(script);

    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    document.body.removeChild(container);
    document.head.removeChild(script);
    jest.clearAllMocks();
  });

  describe('Task #46: Add edit button to each mood entry in the UI', () => {
    test('should display edit button for each mood entry', () => {
      // : Set up test data
      const testEntries = [
        { mood: 'happy', text: 'Feeling great today!', emoji: '😊', date: 'April 8, 2024' },
        { mood: 'sad', text: 'Not feeling well', emoji: '😢', date: 'April 8, 2024' }
      ];
      localStorage.getItem.mockReturnValue(JSON.stringify(testEntries));

      // trigger DOMContentLoaded
      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);

      // check that edit buttons are present
      const editButtons = document.querySelectorAll('.edit-btn');
      expect(editButtons.length).toBe(2);
      
      editButtons.forEach((button, index) => {
        expect(button.textContent).toContain('✏️ Edit');
        expect(button.dataset.index).toBe(index.toString());
      });
    });

    test('should have correct styling for edit buttons', () => {

      const testEntries = [{ mood: 'happy', text: 'Test entry', emoji: '😊', date: 'April 8, 2024' }];
      localStorage.getItem.mockReturnValue(JSON.stringify(testEntries));


      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);


      const editButton = document.querySelector('.edit-btn');
      expect(editButton).toHaveClass('edit-btn');
      expect(editButton.style.cursor).toBe('pointer');
    });
  });

  describe('Task #47: Implement edit form and update logic', () => {
    test('should populate form when edit button is clicked', () => {
      // 
      const testEntries = [{ mood: 'happy', text: 'Original text', emoji: '😊', date: 'April 8, 2024' }];
      localStorage.getItem.mockReturnValue(JSON.stringify(testEntries));
      
      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);

      const editButton = document.querySelector('.edit-btn');
      const journalText = document.getElementById('journal-text');
      const saveButton = document.getElementById('save-btn');


      editButton.click();


      expect(journalText.value).toBe('Original text');
      expect(saveButton.textContent).toBe('Update Entry');
      expect(saveButton).toHaveClass('editing');
    });

    test('should select correct mood when editing', () => {
      // 
      const testEntries = [{ mood: 'sad', text: 'Feeling sad', emoji: '😢', date: 'April 8, 2024' }];
      localStorage.getItem.mockReturnValue(JSON.stringify(testEntries));
      
      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);

      const editButton = document.querySelector('.edit-btn');
      const sadMoodButton = document.querySelector('.emoji-btn[data-mood="sad"]');

      editButton.click();

      expect(sadMoodButton).toHaveClass('selected');
    });

    test('should update entry when save button is clicked in edit mode', () => {
      // 
      const testEntries = [{ mood: 'happy', text: 'Original text', emoji: '😊', date: 'April 8, 2024' }];
      localStorage.getItem.mockReturnValue(JSON.stringify(testEntries));
      
      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);

      const editButton = document.querySelector('.edit-btn');
      const journalText = document.getElementById('journal-text');
      const saveButton = document.getElementById('save-btn');

      // enter edit mode
      editButton.click();
      
      // modify the text
      journalText.value = 'Updated text';
      
      // click save
      saveButton.click();

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'moodEntries',
        JSON.stringify([{ mood: 'happy', text: 'Updated text', emoji: '😊', date: 'April 8, 2024' }])
      );
    });

    test('should preserve original date when updating entry', () => {
      // 
      const originalDate = 'April 8, 2024';
      const testEntries = [{ mood: 'happy', text: 'Original text', emoji: '😊', date: originalDate }];
      localStorage.getItem.mockReturnValue(JSON.stringify(testEntries));
      
      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);

      const editButton = document.querySelector('.edit-btn');
      const journalText = document.getElementById('journal-text');
      const saveButton = document.getElementById('save-btn');


      editButton.click();
      journalText.value = 'Updated text';
      saveButton.click();

      const savedEntries = JSON.parse(localStorage.setItem.mock.calls[0][1]);
      expect(savedEntries[0].date).toBe(originalDate);
    });
  });

  describe('Task #48: Test editing functionality and have consistent results', () => {
    test('should show cancel button when in edit mode', () => {
      // 
      const testEntries = [{ mood: 'happy', text: 'Test entry', emoji: '😊', date: 'April 8, 2024' }];
      localStorage.getItem.mockReturnValue(JSON.stringify(testEntries));
      
      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);

      const editButton = document.querySelector('.edit-btn');
      const cancelButton = document.getElementById('cancel-btn');


      editButton.click();


      expect(cancelButton).not.toHaveClass('hidden');
    });

    test('should cancel edit mode when cancel button is clicked', () => {
      // 
      const testEntries = [{ mood: 'happy', text: 'Original text', emoji: '😊', date: 'April 8, 2024' }];
      localStorage.getItem.mockReturnValue(JSON.stringify(testEntries));
      
      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);

      const editButton = document.querySelector('.edit-btn');
      const cancelButton = document.getElementById('cancel-btn');
      const saveButton = document.getElementById('save-btn');
      const journalText = document.getElementById('journal-text');

      // enter edit mode then cancel
      editButton.click();
      cancelButton.click();


      expect(journalText.value).toBe('');
      expect(saveButton.textContent).toBe('Log Entry');
      expect(saveButton).not.toHaveClass('editing');
      expect(cancelButton).toHaveClass('hidden');
    });

    test('should validate required fields when updating', () => {
      // 
      const testEntries = [{ mood: 'happy', text: 'Original text', emoji: '😊', date: 'April 8, 2024' }];
      localStorage.getItem.mockReturnValue(JSON.stringify(testEntries));
      
      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);

      const editButton = document.querySelector('.edit-btn');
      const saveButton = document.getElementById('save-btn');

      // enter edit mode and try to save without text
      editButton.click();
      document.getElementById('journal-text').value = '';
      saveButton.click();


      expect(alert).toHaveBeenCalledWith('Please write something about your feeling.');
    });

    test('should validate mood selection when updating', () => {
      // 
      const testEntries = [{ mood: 'happy', text: 'Original text', emoji: '😊', date: 'April 8, 2024' }];
      localStorage.getItem.mockReturnValue(JSON.stringify(testEntries));
      
      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);

      const editButton = document.querySelector('.edit-btn');
      const saveButton = document.getElementById('save-btn');

      // enter edit mode, deselect mood, and try to save
      editButton.click();
      document.querySelector('.emoji-btn[data-mood="happy"]').classList.remove('selected');
      saveButton.click();


      expect(alert).toHaveBeenCalledWith('Please select your mood first!');
    });

    test('should handle multiple edit operations correctly', () => {

      const testEntries = [
        { mood: 'happy', text: 'First entry', emoji: '😊', date: 'April 8, 2024' },
        { mood: 'sad', text: 'Second entry', emoji: '😢', date: 'April 8, 2024' }
      ];
      localStorage.getItem.mockReturnValue(JSON.stringify(testEntries));
      
      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);

      const editButtons = document.querySelectorAll('.edit-btn');
      const saveButton = document.getElementById('save-btn');

      // edit first entry
      editButtons[0].click();
      document.getElementById('journal-text').value = 'Updated first entry';
      saveButton.click();

      // edit second entry
      editButtons[1].click();
      document.getElementById('journal-text').value = 'Updated second entry';
      saveButton.click();

      expect(localStorage.setItem).toHaveBeenCalledTimes(2);
      const lastCall = localStorage.setItem.mock.calls[1];
      const savedEntries = JSON.parse(lastCall[1]);
      expect(savedEntries[1].text).toBe('Updated second entry');
    });
  });

  describe('Acceptance Criteria for User Story #44', () => {
    test('should allow user to edit mood entry text', () => {

      const testEntries = [{ mood: 'happy', text: 'Original feeling', emoji: '😊', date: 'April 8, 2024' }];
      localStorage.getItem.mockReturnValue(JSON.stringify(testEntries));
      
      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);


      const editButton = document.querySelector('.edit-btn');
      editButton.click();
      
      document.getElementById('journal-text').value = 'Corrected feeling description';
      document.getElementById('save-btn').click();


      expect(localStorage.setItem).toHaveBeenCalledWith(
        'moodEntries',
        JSON.stringify([{ mood: 'happy', text: 'Corrected feeling description', emoji: '😊', date: 'April 8, 2024' }])
      );
    });

    test('should allow user to change mood when editing', () => {

      const testEntries = [{ mood: 'happy', text: 'Feeling happy', emoji: '😊', date: 'April 8, 2024' }];
      localStorage.getItem.mockReturnValue(JSON.stringify(testEntries));
      
      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);


      const editButton = document.querySelector('.edit-btn');
      editButton.click();
      
      // change mood to sad
      document.querySelector('.emoji-btn[data-mood="sad"]').click();

      document.getElementById('save-btn').click();



      const savedEntries = JSON.parse(localStorage.setItem.mock.calls[0][1]);

      expect(savedEntries[0].mood).toBe('sad');
      expect(savedEntries[0].emoji).toBe('😢');
    });

    test('should provide clear visual feedback during edit mode', () => {

      const testEntries = [{ mood: 'happy', text: 'Test entry', emoji: '😊', date: 'April 8, 2024' }];
      localStorage.getItem.mockReturnValue(JSON.stringify(testEntries));
      
      const event = new Event('DOMContentLoaded');

      document.dispatchEvent(event);

 
      const editButton = document.querySelector('.edit-btn');
      editButton.click();

      const saveButton = document.getElementById('save-btn');
      
      const cancelButton = document.getElementById('cancel-btn');
      
      expect(saveButton.textContent).toBe('Update Entry');
      expect(saveButton).toHaveClass('editing');
      expect(cancelButton).not.toHaveClass('hidden');
    });
  });
}); 