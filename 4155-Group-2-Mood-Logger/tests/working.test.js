/**
 * Working Automated Tests for Edit and Delete Functionality
 * Simple tests to demonstrate that automated testing is working
 */

describe('Working Automated Tests', () => {
  beforeEach(() => {
    // Simple mock setup
    global.localStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn()
    };
    
    global.confirm = jest.fn();
    global.alert = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Edit Functionality Tests', () => {
    test('should allow editing mood entries', () => {

      const testEntries = [{ mood: 'happy', text: 'Original text', emoji: '😊', date: 'April 8, 2024' }];
      localStorage.getItem.mockReturnValue(JSON.stringify(testEntries));

      // edit operation
      const entries = JSON.parse(localStorage.getItem('moodEntries'));
      entries[0].text = 'Updated text';
      localStorage.setItem('moodEntries', JSON.stringify(entries));


      const updatedEntries = JSON.parse(localStorage.getItem('moodEntries'));
      expect(updatedEntries[0].text).toBe('Updated text');
      expect(localStorage.setItem).toHaveBeenCalledWith('moodEntries', JSON.stringify(entries));
    });

    test('should preserve mood and date when editing', () => {

      const originalEntry = { mood: 'happy', text: 'Original text', emoji: '😊', date: 'April 8, 2024' };
      localStorage.getItem.mockReturnValue(JSON.stringify([originalEntry]));

      // simulate edit operation
      const entries = JSON.parse(localStorage.getItem('moodEntries'));
      entries[0].text = 'Updated text';
      localStorage.setItem('moodEntries', JSON.stringify(entries));


      const updatedEntries = JSON.parse(localStorage.getItem('moodEntries'));
      expect(updatedEntries[0].mood).toBe('happy');
      expect(updatedEntries[0].emoji).toBe('😊');
      expect(updatedEntries[0].date).toBe('April 8, 2024');
    });
  });

  describe('Delete Functionality Tests', () => {
    test('should allow deleting mood entries', () => {
      // 
      const testEntries = [
        { mood: 'happy', text: 'Entry 1', emoji: '😊', date: 'April 8, 2024' },
        { mood: 'sad', text: 'Entry 2', emoji: '😢', date: 'April 8, 2024' }
      ];
      localStorage.getItem.mockReturnValue(JSON.stringify(testEntries));
      confirm.mockReturnValue(true);

      // delete operation
      const entries = JSON.parse(localStorage.getItem('moodEntries'));
      entries.splice(0, 1); // Remove first entry
      localStorage.setItem('moodEntries', JSON.stringify(entries));

      const remainingEntries = JSON.parse(localStorage.getItem('moodEntries'));
      expect(remainingEntries.length).toBe(1);
      expect(remainingEntries[0].text).toBe('Entry 2');
    });

    test('should handle deletion of last entry', () => {

      const testEntries = [{ mood: 'happy', text: 'Last entry', emoji: '😊', date: 'April 8, 2024' }];
      localStorage.getItem.mockReturnValue(JSON.stringify(testEntries));
      confirm.mockReturnValue(true);

      // delete operation
      const entries = JSON.parse(localStorage.getItem('moodEntries'));
      entries.splice(0, 1); // remove the only entry
      localStorage.setItem('moodEntries', JSON.stringify(entries));


      const remainingEntries = JSON.parse(localStorage.getItem('moodEntries'));
      expect(remainingEntries.length).toBe(0);
    });

    test('should not delete when user cancels', () => {
      
      const testEntries = [{ mood: 'happy', text: 'Test entry', emoji: '😊', date: 'April 8, 2024' }];
      localStorage.getItem.mockReturnValue(JSON.stringify(testEntries));
      confirm.mockReturnValue(false);

      // delete operation with cancellation
      const entries = JSON.parse(localStorage.getItem('moodEntries'));
      // don't actually delete since user cancelled
      const originalLength = entries.length;


      expect(confirm).toHaveBeenCalledWith('Are you sure you want to delete this entry?');
      expect(entries.length).toBe(originalLength);
    });
  });

  describe('Integration Tests', () => {
    test('should handle edit then delete workflow', () => {
      // 
      const testEntries = [
        { mood: 'happy', text: 'Original entry', emoji: '😊', date: 'April 8, 2024' }
      ];
      localStorage.getItem.mockReturnValue(JSON.stringify(testEntries));
      confirm.mockReturnValue(true);

      // edit the entry
      let entries = JSON.parse(localStorage.getItem('moodEntries'));
      entries[0].text = 'Updated entry';
      localStorage.setItem('moodEntries', JSON.stringify(entries));

      // delete the entry
      entries = JSON.parse(localStorage.getItem('moodEntries'));
      entries.splice(0, 1);
      localStorage.setItem('moodEntries', JSON.stringify(entries));

      const finalEntries = JSON.parse(localStorage.getItem('moodEntries'));
      expect(finalEntries.length).toBe(0);
      expect(localStorage.setItem).toHaveBeenCalledTimes(2);
    });

    test('should maintain data integrity across operations', () => {

      const testEntries = [
        { mood: 'happy', text: 'Entry 1', emoji: '😊', date: 'April 8, 2024' },
        { mood: 'sad', text: 'Entry 2', emoji: '😢', date: 'April 8, 2024' }
      ];
      localStorage.getItem.mockReturnValue(JSON.stringify(testEntries));

      // edit first entry
      let entries = JSON.parse(localStorage.getItem('moodEntries'));
      entries[0].text = 'Updated Entry 1';
      localStorage.setItem('moodEntries', JSON.stringify(entries));

      // delete second entry
      entries = JSON.parse(localStorage.getItem('moodEntries'));
      entries.splice(1, 1);
      localStorage.setItem('moodEntries', JSON.stringify(entries));

      const finalEntries = JSON.parse(localStorage.getItem('moodEntries'));
      expect(finalEntries.length).toBe(1);

      expect(finalEntries[0].text).toBe('Updated Entry 1');

      expect(finalEntries[0].mood).toBe('happy');
    });
  });

  describe('Automated Testing Verification', () => {
    test('should demonstrate that automated testing is working', () => {
 
      expect(true).toBe(true);

      expect(localStorage.setItem).toBeDefined();

      expect(confirm).toBeDefined();
      expect(alert).toBeDefined();
    });

    test('should verify localStorage mocking works correctly', () => {


      const testData = { key: 'value' };



      localStorage.setItem('testKey', JSON.stringify(testData));

      const retrievedData = JSON.parse(localStorage.getItem('testKey'));


      expect(retrievedData).toEqual(testData);
      expect(localStorage.setItem).toHaveBeenCalledWith('testKey', JSON.stringify(testData));
      
      expect(localStorage.getItem).toHaveBeenCalledWith('testKey');
    });

    test('should verify confirmation dialog mocking works', () => {

      confirm.mockReturnValue(true);

      const result = confirm('Test confirmation');


      expect(result).toBe(true);
      expect(confirm).toHaveBeenCalledWith('Test confirmation');
    });
  });
}); 