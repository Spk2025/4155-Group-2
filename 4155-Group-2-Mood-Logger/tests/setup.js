// test setup file for Jest
// mock localStorage with proper Jest mock functions
global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};


Object.keys(global.localStorage).forEach(key => {
  if (typeof global.localStorage[key] === 'function') {
    global.localStorage[key] = jest.fn();
  }
});


global.Chart = jest.fn().mockImplementation(() => ({
  destroy: jest.fn(),
  update: jest.fn(),
  data: {
    datasets: [{
      data: []
    }]
  }
}));


global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

global.confirm = jest.fn();
global.alert = jest.fn(); 