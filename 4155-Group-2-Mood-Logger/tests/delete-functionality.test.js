/**
 * Automated Unit Tests for Delete Functionality
 * User Story #45: As a user, I want to delete a mood entry, 
 * so that I can remove entries I don't want.
 */

describe('Delete Functionality Tests', () => {
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


    // loads the script
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

  describe('Task #49: Add delete button to each mood entry in the history UI', () => {


    test('should display delete button for each mood entry', () => {

      // set up test data
      const testEntries = [
        { mood: 'happy', text: 'Feeling great today!', emoji: '😊', date: 'April 8, 2024' },
        { mood: 'sad', text: 'Not feeling well', emoji: '😢', date: 'April 8, 2024' }
      ];
      localStorage.getItem.mockReturnValue(JSON.stringify(testEntries));

      // trigger DOMContentLoaded

      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);


      // check that delete buttons are present

      const deleteButtons = document.querySelectorAll('.delete-btn');
      expect(deleteButtons.length).toBe(2);
      
      deleteButtons.forEach((button, index) => {
        expect(button.textContent).toContain('🗑️ Delete');

        expect(button.dataset.index).toBe(index.toString());
      });
    });

    test('should have correct styling for delete buttons', () => {

      const testEntries = [{ mood: 'happy', text: 'Test entry', emoji: '😊', date: 'April 8, 2024' }];

      localStorage.getItem.mockReturnValue(JSON.stringify(testEntries));




      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);



      const deleteButton = document.querySelector('.delete-btn');
      expect(deleteButton).toHaveClass('delete-btn');

      expect(deleteButton.style.cursor).toBe('pointer');

    });

    test('should have proper button layout with edit and delete buttons', () => {



      const testEntries = [{ mood: 'happy', text: 'Test entry', emoji: '😊', date: 'April 8, 2024' }];


      localStorage.getItem.mockReturnValue(JSON.stringify(testEntries));


      const event = new Event('DOMContentLoaded');

      document.dispatchEvent(event);


      const entryItem = document.querySelector('.entry-item');


      const entryActions = document.querySelector('.entry-actions');

      const editButton = document.querySelector('.edit-btn');

      const deleteButton = document.querySelector('.delete-btn');


      expect(entryItem).toHaveClass('entry-item');
      expect(entryActions).toHaveClass('entry-actions');

      expect(editButton).toBeTruthy();
      expect(deleteButton).toBeTruthy();
    });
  });

  describe('Task #50: Implement deletion logic in data', () => {
    test('should remove entry from localStorage when delete is confirmed', () => {

      const testEntries = [
        { mood: 'happy', text: 'First entry', emoji: '😊', date: 'April 8, 2024' },


        { mood: 'sad', text: 'Second entry', emoji: '😢', date: 'April 8, 2024' }

      ];
      localStorage.getItem.mockReturnValue(JSON.stringify(testEntries));

      confirm.mockReturnValue(true); // user confirms deletion

      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);


      const deleteButton = document.querySelector('.delete-btn');
      deleteButton.click();


      expect(localStorage.setItem).toHaveBeenCalledWith(

        'moodEntries',
        JSON.stringify([{ mood: 'sad', text: 'Second entry', emoji: '😢', date: 'April 8, 2024' }])

      );
    });

    test('should not delete entry when user cancels confirmation', () => {

      const testEntries = [{ mood: 'happy', text: 'Test entry', emoji: '😊', date: 'April 8, 2024' }];

      localStorage.getItem.mockReturnValue(JSON.stringify(testEntries));

      

      confirm.mockReturnValue(false); // user cancels deletion

      const event = new Event('DOMContentLoaded');

      document.dispatchEvent(event);


      const deleteButton = document.querySelector('.delete-btn');
      deleteButton.click();


      expect(localStorage.setItem).not.toHaveBeenCalled();

      expect(confirm).toHaveBeenCalledWith('Are you sure you want to delete this entry?');
    });

    test('should handle deletion of last entry', () => {

      const testEntries = [{ mood: 'happy', text: 'Last entry', emoji: '😊', date: 'April 8, 2024' }];
      localStorage.getItem.mockReturnValue(JSON.stringify(testEntries));
      confirm.mockReturnValue(true);

      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);

      const deleteButton = document.querySelector('.delete-btn');
      deleteButton.click();

      expect(localStorage.setItem).toHaveBeenCalledWith('moodEntries', JSON.stringify([]));
    });

    test('should handle deletion of entry that does not exist', () => {

      const testEntries = [{ mood: 'happy', text: 'Test entry', emoji: '😊', date: 'April 8, 2024' }];

      localStorage.getItem.mockReturnValue(JSON.stringify(testEntries));

      confirm.mockReturnValue(true);

      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);

      // try to delete with invalid index

      const deleteButton = document.querySelector('.delete-btn');

      deleteButton.dataset.index = '999'; // ivalid index
      deleteButton.click();

      // shouldn't crash and should not modify localStorage
      expect(localStorage.setItem).not.toHaveBeenCalled();
    });
  });

  describe('Task #51: Update UI after deletion', () => {

    test('should remove entry from UI after successful deletion', () => {


      const testEntries = [
        { mood: 'happy', text: 'First entry', emoji: '😊', date: 'April 8, 2024' },

        { mood: 'sad', text: 'Second entry', emoji: '😢', date: 'April 8, 2024' }
      ];
      localStorage.getItem.mockReturnValue(JSON.stringify(testEntries));
      confirm.mockReturnValue(true);

      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);


      const deleteButtons = document.querySelectorAll('.delete-btn');

      deleteButtons[0].click(); // delete first entry


      const remainingEntries = document.querySelectorAll('.entry-item');
      expect(remainingEntries.length).toBe(1);
      
      const remainingText = document.querySelector('.entry-text');

      expect(remainingText.textContent).toBe('Second entry');
    });

    test('should update mood counts after deletion', () => {

      const testEntries = [{ mood: 'happy', text: 'Happy entry', emoji: '😊', date: 'April 8, 2024' }];
      localStorage.getItem.mockReturnValue(JSON.stringify(testEntries));
      
      // set up mood counts
      const moodCounts = { happy: 1, sad: 0, angry: 0, excited: 0, calm: 0 };
      localStorage.getItem.mockImplementation((key) => {
        if (key === 'moodEntries') return JSON.stringify(testEntries);
        if (key === 'moodCounts') return JSON.stringify(moodCounts);
        return null;
      });
      
      confirm.mockReturnValue(true);

      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);


      const deleteButton = document.querySelector('.delete-btn');
      deleteButton.click();


      expect(localStorage.setItem).toHaveBeenCalledWith('moodCounts', JSON.stringify({
        happy: 0, sad: 0, angry: 0, excited: 0, calm: 0
      }));
    });

    test('should not update mood counts when deletion is cancelled', () => {

      const testEntries = [{ mood: 'happy', text: 'Happy entry', emoji: '😊', date: 'April 8, 2024' }];

      localStorage.getItem.mockReturnValue(JSON.stringify(testEntries));
      confirm.mockReturnValue(false);

      const event = new Event('DOMContentLoaded');

      document.dispatchEvent(event);

      const deleteButton = document.querySelector('.delete-btn');
      deleteButton.click();


      expect(localStorage.setItem).not.toHaveBeenCalled();
    });

    test('should handle deletion of multiple entries correctly', () => {

      const testEntries = [
        { mood: 'happy', text: 'First entry', emoji: '😊', date: 'April 8, 2024' },

        { mood: 'sad', text: 'Second entry', emoji: '😢', date: 'April 8, 2024' },

        { mood: 'happy', text: 'Third entry', emoji: '😊', date: 'April 8, 2024' }
      ];
      localStorage.getItem.mockReturnValue(JSON.stringify(testEntries));
      confirm.mockReturnValue(true);

      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);

      // delete second entry
      const deleteButtons = document.querySelectorAll('.delete-btn');
      deleteButtons[1].click();

      const remainingEntries = document.querySelectorAll('.entry-item');
      expect(remainingEntries.length).toBe(2);
      
      const remainingTexts = document.querySelectorAll('.entry-text');
      expect(remainingTexts[0].textContent).toBe('First entry');
      expect(remainingTexts[1].textContent).toBe('Third entry');
    });
  });

  describe('Task #52: Test deletion and data update', () => {
    test('should show confirmation dialog before deletion', () => {

      const testEntries = [{ mood: 'happy', text: 'Test entry', emoji: '😊', date: 'April 8, 2024' }];
      localStorage.getItem.mockReturnValue(JSON.stringify(testEntries));
      confirm.mockReturnValue(true);

      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);


      const deleteButton = document.querySelector('.delete-btn');
      deleteButton.click();


      expect(confirm).toHaveBeenCalledWith('Are you sure you want to delete this entry?');
    });

    test('should handle edge case of deleting from empty list', () => {
 
      const testEntries = [];
      localStorage.getItem.mockReturnValue(JSON.stringify(testEntries));

      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);


      const deleteButtons = document.querySelectorAll('.delete-btn');
      

      expect(deleteButtons.length).toBe(0);
    });

    test('should maintain data integrity after multiple deletions', () => {

      const testEntries = [
        { mood: 'happy', text: 'Entry 1', emoji: '😊', date: 'April 8, 2024' },
        { mood: 'sad', text: 'Entry 2', emoji: '😢', date: 'April 8, 2024' },
        { mood: 'happy', text: 'Entry 3', emoji: '😊', date: 'April 8, 2024' }
      ];
      localStorage.getItem.mockReturnValue(JSON.stringify(testEntries));
      confirm.mockReturnValue(true);

      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);

      // delete entries in reverse order
      const deleteButtons = document.querySelectorAll('.delete-btn');
      deleteButtons[2].click(); // delete Entry 3
      deleteButtons[1].click(); // delete Entry 2

      const remainingEntries = document.querySelectorAll('.entry-item');
      expect(remainingEntries.length).toBe(1);
      
      const remainingText = document.querySelector('.entry-text');
      expect(remainingText.textContent).toBe('Entry 1');
    });

    test('should handle deletion with invalid mood count gracefully', () => {

      const testEntries = [{ mood: 'happy', text: 'Test entry', emoji: '😊', date: 'April 8, 2024' }];
      localStorage.getItem.mockReturnValue(JSON.stringify(testEntries));
      
      // set up mood counts with zero happy count
      const moodCounts = { happy: 0, sad: 0, angry: 0, excited: 0, calm: 0 };
      localStorage.getItem.mockImplementation((key) => {
        if (key === 'moodEntries') return JSON.stringify(testEntries);
        if (key === 'moodCounts') return JSON.stringify(moodCounts);
        return null;
      });
      
      confirm.mockReturnValue(true);

      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);

 
      const deleteButton = document.querySelector('.delete-btn');
      deleteButton.click();

      // should not crash and should not go below zero
      expect(localStorage.setItem).toHaveBeenCalledWith('moodCounts', JSON.stringify({
        happy: 0, sad: 0, angry: 0, excited: 0, calm: 0
      }));
    });
  });

  describe('Acceptance Criteria for User Story #45', () => {
    test('should allow user to delete any mood entry', () => {

      const testEntries = [
        { mood: 'happy', text: 'Happy entry', emoji: '😊', date: 'April 8, 2024' },
        { mood: 'sad', text: 'Sad entry', emoji: '😢', date: 'April 8, 2024' }
      ];
      localStorage.getItem.mockReturnValue(JSON.stringify(testEntries));
      confirm.mockReturnValue(true);

      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);

      // delete the sad entry
      const deleteButtons = document.querySelectorAll('.delete-btn');
      deleteButtons[1].click();


      expect(localStorage.setItem).toHaveBeenCalledWith(
        'moodEntries',
        JSON.stringify([{ mood: 'happy', text: 'Happy entry', emoji: '😊', date: 'April 8, 2024' }])
      );
    });

    test('should provide clear visual feedback for delete action', () => {

      const testEntries = [{ mood: 'happy', text: 'Test entry', emoji: '😊', date: 'April 8, 2024' }];
      localStorage.getItem.mockReturnValue(JSON.stringify(testEntries));

      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);

  
      const deleteButton = document.querySelector('.delete-btn');
      expect(deleteButton.textContent).toContain('🗑️ Delete');
      expect(deleteButton).toHaveClass('delete-btn');
    });

    test('should require user confirmation before deletion', () => {

      const testEntries = [{ mood: 'happy', text: 'Test entry', emoji: '😊', date: 'April 8, 2024' }];
      localStorage.getItem.mockReturnValue(JSON.stringify(testEntries));
      confirm.mockReturnValue(false); // User cancels

      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);


      const deleteButton = document.querySelector('.delete-btn');
      deleteButton.click();


      expect(confirm).toHaveBeenCalledWith('Are you sure you want to delete this entry?');
      expect(localStorage.setItem).not.toHaveBeenCalled();
    });

    test('should update mood statistics after deletion', () => {

      const testEntries = [{ mood: 'happy', text: 'Happy entry', emoji: '😊', date: 'April 8, 2024' }];
      localStorage.getItem.mockReturnValue(JSON.stringify(testEntries));
      
      const moodCounts = { happy: 1, sad: 0, angry: 0, excited: 0, calm: 0 };
      localStorage.getItem.mockImplementation((key) => {
        if (key === 'moodEntries') return JSON.stringify(testEntries);
        if (key === 'moodCounts') return JSON.stringify(moodCounts);
        return null;
      });
      
      confirm.mockReturnValue(true);

      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);


      const deleteButton = document.querySelector('.delete-btn');
      deleteButton.click();


      expect(localStorage.setItem).toHaveBeenCalledWith('moodCounts', JSON.stringify({
        happy: 0, sad: 0, angry: 0, excited: 0, calm: 0
      }));
    });
  });
}); 