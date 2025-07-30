/**
 * Integration Tests for Edit and Delete Functionality
 * Tests the interaction between edit and delete features and overall data integrity
 */

describe('Integration Tests: Edit and Delete Functionality', () => {
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

    // load script
    script = document.createElement('script');
    script.src = '../script.js';
    document.head.appendChild(script);

    // clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    document.body.removeChild(container);
    document.head.removeChild(script);
    jest.clearAllMocks();
  });

  describe('Edit and Delete Workflow Tests', () => {
    test('should handle edit then delete workflow correctly', () => {
      // 
      const testEntries = [
        { mood: 'happy', text: 'Original entry', emoji: '😊', date: 'April 8, 2024' },
        { mood: 'sad', text: 'Second entry', emoji: '😢', date: 'April 8, 2024' }
      ];
      localStorage.getItem.mockReturnValue(JSON.stringify(testEntries));
      confirm.mockReturnValue(true);

      const event = new Event('DOMContentLoaded');

      document.dispatchEvent(event);

      // edit first entry
      const editButtons = document.querySelectorAll('.edit-btn');
      editButtons[0].click();
      document.getElementById('journal-text').value = 'Updated entry';

      document.getElementById('save-btn').click();

      // delete the edited entry
      const deleteButtons = document.querySelectorAll('.delete-btn');
      deleteButtons[0].click();

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'moodEntries',
        JSON.stringify([{ mood: 'sad', text: 'Second entry', emoji: '😢', date: 'April 8, 2024' }])

      );
    });

    test('should handle delete then edit workflow correctly', () => {

      const testEntries = [
        { mood: 'happy', text: 'First entry', emoji: '😊', date: 'April 8, 2024' },
        { mood: 'sad', text: 'Second entry', emoji: '😢', date: 'April 8, 2024' }
      ];
      localStorage.getItem.mockReturnValue(JSON.stringify(testEntries));
      confirm.mockReturnValue(true);

      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);

      // delete first entry
      const deleteButtons = document.querySelectorAll('.delete-btn');

      deleteButtons[0].click();

      // edit remaining entry
      const editButtons = document.querySelectorAll('.edit-btn');

      editButtons[0].click();
      document.getElementById('journal-text').value = 'Updated second entry';

      document.getElementById('save-btn').click();

  
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'moodEntries',
        JSON.stringify([{ mood: 'sad', text: 'Updated second entry', emoji: '😢', date: 'April 8, 2024' }])
      );
    });

    test('should handle cancel edit then delete workflow', () => {
      // 
      const testEntries = [
        { mood: 'happy', text: 'Original entry', emoji: '😊', date: 'April 8, 2024' }
      ];
      localStorage.getItem.mockReturnValue(JSON.stringify(testEntries));

      confirm.mockReturnValue(true);

      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);

      // start editing then cancel

      const editButton = document.querySelector('.edit-btn');
      editButton.click();
      document.getElementById('cancel-btn').click();

      // delete the entry
      const deleteButton = document.querySelector('.delete-btn');

      
      deleteButton.click();


      expect(localStorage.setItem).toHaveBeenCalledWith('moodEntries', JSON.stringify([]));
    });

    test('should maintain correct indices after edit and delete operations', () => {

      const testEntries = [
        { mood: 'happy', text: 'Entry 1', emoji: '😊', date: 'April 8, 2024' },
        { mood: 'sad', text: 'Entry 2', emoji: '😢', date: 'April 8, 2024' },
        { mood: 'happy', text: 'Entry 3', emoji: '😊', date: 'April 8, 2024' }
      ];
      localStorage.getItem.mockReturnValue(JSON.stringify(testEntries));
      confirm.mockReturnValue(true);

      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);

      // delete middle entry
      const deleteButtons = document.querySelectorAll('.delete-btn');
      deleteButtons[1].click();

      // edit remaining entries
      const editButtons = document.querySelectorAll('.edit-btn');
      editButtons[0].click();
      document.getElementById('journal-text').value = 'Updated Entry 1';
      document.getElementById('save-btn').click();

      editButtons[1].click();
      document.getElementById('journal-text').value = 'Updated Entry 3';
      document.getElementById('save-btn').click();

   
      const savedEntries = JSON.parse(localStorage.setItem.mock.calls[2][1]);
      expect(savedEntries[0].text).toBe('Updated Entry 1');
      expect(savedEntries[1].text).toBe('Updated Entry 3');
    });
  });

  describe('Data Integrity Tests', () => {
    test('should maintain data consistency across multiple operations', () => {

      const testEntries = [
        { mood: 'happy', text: 'Entry 1', emoji: '😊', date: 'April 8, 2024' },
        { mood: 'sad', text: 'Entry 2', emoji: '😢', date: 'April 8, 2024' }
      ];
      localStorage.getItem.mockReturnValue(JSON.stringify(testEntries));
      confirm.mockReturnValue(true);

      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);

      // edit first entry
      const editButtons = document.querySelectorAll('.edit-btn');
      editButtons[0].click();
      document.getElementById('journal-text').value = 'Updated Entry 1';
      document.getElementById('save-btn').click();

      // delete second entry
      const deleteButtons = document.querySelectorAll('.delete-btn');
      deleteButtons[1].click();

      // edit remaining entry
      editButtons[0].click();
      document.getElementById('journal-text').value = 'Final Entry 1';
      document.getElementById('save-btn').click();


      const finalCall = localStorage.setItem.mock.calls[2];
      const savedEntries = JSON.parse(finalCall[1]);
      expect(savedEntries.length).toBe(1);
      expect(savedEntries[0].text).toBe('Final Entry 1');
      expect(savedEntries[0].mood).toBe('happy');
    });

    test('should handle mood count updates correctly across operations', () => {

      const testEntries = [
        { mood: 'happy', text: 'Happy entry', emoji: '😊', date: 'April 8, 2024' },
        { mood: 'sad', text: 'Sad entry', emoji: '😢', date: 'April 8, 2024' }
      ];
      localStorage.getItem.mockReturnValue(JSON.stringify(testEntries));
      
      const moodCounts = { happy: 1, sad: 1, angry: 0, excited: 0, calm: 0 };
      localStorage.getItem.mockImplementation((key) => {
        if (key === 'moodEntries') return JSON.stringify(testEntries);
        if (key === 'moodCounts') return JSON.stringify(moodCounts);
        return null;
      });
      
      confirm.mockReturnValue(true);

      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);

      // edit happy entry to sad
      const editButtons = document.querySelectorAll('.edit-btn');
      editButtons[0].click();
      document.querySelector('.emoji-btn[data-mood="sad"]').click();
      document.getElementById('save-btn').click();

      // delete the sad entry
      const deleteButtons = document.querySelectorAll('.delete-btn');
      deleteButtons[1].click();

      // check mood count updates
      const moodCountCalls = localStorage.setItem.mock.calls.filter(call => call[0] === 'moodCounts');
      expect(moodCountCalls.length).toBeGreaterThan(0);
    });

    test('should preserve original dates during edit operations', () => {

      const originalDate = 'April 8, 2024';
      const testEntries = [
        { mood: 'happy', text: 'Entry 1', emoji: '😊', date: originalDate },
        { mood: 'sad', text: 'Entry 2', emoji: '😢', date: originalDate }
      ];
      localStorage.getItem.mockReturnValue(JSON.stringify(testEntries));

      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);

      // edit both entries
      const editButtons = document.querySelectorAll('.edit-btn');
      
      editButtons[0].click();
      document.getElementById('journal-text').value = 'Updated Entry 1';
      document.getElementById('save-btn').click();

      editButtons[1].click();
      document.getElementById('journal-text').value = 'Updated Entry 2';
      document.getElementById('save-btn').click();


      const savedEntries = JSON.parse(localStorage.setItem.mock.calls[1][1]);
      savedEntries.forEach(entry => {
        expect(entry.date).toBe(originalDate);
      });
    });
  });

  describe('User Experience Tests', () => {
    test('should provide consistent UI feedback during complex workflows', () => {

      const testEntries = [
        { mood: 'happy', text: 'Test entry', emoji: '😊', date: 'April 8, 2024' }
      ];
      localStorage.getItem.mockReturnValue(JSON.stringify(testEntries));

      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);

      // start editing
      const editButton = document.querySelector('.edit-btn');
      editButton.click();

      // check edit mode UI
      const saveButton = document.getElementById('save-btn');
      const cancelButton = document.getElementById('cancel-btn');
      expect(saveButton.textContent).toBe('Update Entry');
      expect(saveButton).toHaveClass('editing');
      expect(cancelButton).not.toHaveClass('hidden');

      // cancel editing
      cancelButton.click();

      // check normal mode UI
      expect(saveButton.textContent).toBe('Log Entry');
      expect(saveButton).not.toHaveClass('editing');
      expect(cancelButton).toHaveClass('hidden');
    });

    test('should handle rapid edit and delete operations gracefully', () => {
      // 
      const testEntries = [
        { mood: 'happy', text: 'Entry 1', emoji: '😊', date: 'April 8, 2024' },
        { mood: 'sad', text: 'Entry 2', emoji: '😢', date: 'April 8, 2024' }
      ];
      localStorage.getItem.mockReturnValue(JSON.stringify(testEntries));
      confirm.mockReturnValue(true);

      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);

      const editButtons = document.querySelectorAll('.edit-btn');
      const deleteButtons = document.querySelectorAll('.delete-btn');

      // edit first entry
      editButtons[0].click();
      document.getElementById('journal-text').value = 'Quick update';
      document.getElementById('save-btn').click();

      // delete second entry
      deleteButtons[1].click();

      // edit remaining entry
      editButtons[0].click();
      document.getElementById('journal-text').value = 'Final update';
      document.getElementById('save-btn').click();

      // should complete without errors
      expect(localStorage.setItem).toHaveBeenCalledTimes(3);
    });

    test('should maintain proper button states during operations', () => {

      const testEntries = [
        { mood: 'happy', text: 'Test entry', emoji: '😊', date: 'April 8, 2024' }
      ];
      localStorage.getItem.mockReturnValue(JSON.stringify(testEntries));

      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);

      // enter edit mode
      const editButton = document.querySelector('.edit-btn');
      editButton.click();

      // check button states in edit mode
      const saveButton = document.getElementById('save-btn');
      const cancelButton = document.getElementById('cancel-btn');
      const resetButton = document.getElementById('reset-btn');

      expect(saveButton.textContent).toBe('Update Entry');
      expect(cancelButton).not.toHaveClass('hidden');
      expect(resetButton).not.toHaveClass('hidden');

      // cancel edit mode
      cancelButton.click();

      // check button states in normal mode
      expect(saveButton.textContent).toBe('Log Entry');
      expect(cancelButton).toHaveClass('hidden');
      expect(resetButton).not.toHaveClass('hidden');
    });
  });
}); 