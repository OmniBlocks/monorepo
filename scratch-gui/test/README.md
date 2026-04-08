# Testing Infrastructure

Comprehensive testing suite for OmniBlocks/scratch-gui including unit tests, integration tests, smoke tests, and end-to-end testing capabilities.

## 📁 Directory Structure

```
test/
├── README.md                    # This file
├── __mocks__/                   # Mock implementations
│   ├── audio-buffer-player.js  # Audio system mocks
│   ├── audio-effects.js        # Audio effects mocks
│   ├── editor-msgs-mock.js     # Editor message mocks
│   ├── fileMock.js             # File system mocks
│   └── styleMock.js            # CSS/Style mocks
├── fixtures/                    # Test data and assets
│   ├── *.sb3, *.sb2            # Scratch project files
│   ├── *.svg, *.png, *.gif     # Image test files
│   ├── *.wav                   # Audio test files
│   └── corrupt-*               # Corrupted files for error testing
├── helpers/                     # Test utilities and setup
│   ├── enzyme-setup.js         # React testing configuration
│   ├── intl-helpers.jsx        # Internationalization test helpers
│   └── selenium-helper.js      # Browser automation helpers
├── integration/                 # Integration tests
│   ├── backdrops.test.js       # Backdrop functionality tests
│   ├── backpack.test.js        # Backpack feature tests
│   ├── blocks.test.js          # Block system tests
│   ├── connection-modal.test.js # Connection dialog tests
│   ├── costumes.test.js        # Costume editor tests
│   ├── examples.test.js        # Example project tests
│   ├── how-tos.test.js         # Tutorial system tests
│   ├── localization.test.js    # Translation tests
│   ├── menu-bar.test.js        # Menu functionality tests
│   ├── project-loading.test.js # Project import/export tests
│   ├── project-state.test.js   # State management tests
│   ├── sb-file-uploader-hoc.test.js # File upload tests
│   ├── sounds.test.js          # Audio system tests
│   ├── sprites.test.js         # Sprite management tests
│   ├── stage-size.test.js      # Stage dimension tests
│   └── tutorials-shortcut.test.js # Tutorial navigation tests
├── smoke/                       # Smoke tests
│   └── browser.test.js         # Basic browser functionality
└── unit/                       # Unit tests
    ├── addons/                 # Addon system unit tests
    ├── components/             # React component unit tests
    ├── containers/             # Container component unit tests
    ├── reducers/               # Redux reducer unit tests
    └── util/                   # Utility function unit tests
```

## 🧪 Test Types and Strategy

### 1. Unit Tests (`unit/`)
Test individual components, functions, and modules in isolation.

**Coverage Areas:**
- **React Components** - Component rendering, props, state changes
- **Redux Reducers** - State management logic
- **Utility Functions** - Helper functions and algorithms
- **Addon System** - Individual addon functionality

**Example:**
```javascript
// Testing a React component
import { shallow } from 'enzyme';
import MyComponent from '../src/components/my-component.jsx';

describe('MyComponent', () => {
    test('renders correctly with props', () => {
        const wrapper = shallow(<MyComponent title="Test" />);
        expect(wrapper.find('.title').text()).toBe('Test');
    });
});
```

### 2. Integration Tests (`integration/`)
Test how different parts of the application work together.

**Coverage Areas:**
- **Feature Workflows** - Complete user interactions
- **Component Integration** - How components communicate
- **State Management** - Redux store interactions
- **File Operations** - Project loading, saving, importing

**Example:**
```javascript
// Testing project loading workflow
describe('Project Loading', () => {
    test('loads sb3 file correctly', async () => {
        const projectData = await loadProject('test/fixtures/project1.sb3');
        expect(projectData.targets).toBeDefined();
        expect(projectData.monitors).toBeDefined();
    });
});
```

### 3. Smoke Tests (`smoke/`)
Quick tests to verify basic functionality works.

**Purpose:**
- **Deployment Verification** - Ensure builds work in browsers
- **Critical Path Testing** - Core functionality is operational
- **Performance Baseline** - Basic performance metrics

**Example:**
```javascript
// Basic browser functionality test
describe('Browser Smoke Test', () => {
    test('application loads without errors', async () => {
        await page.goto('http://localhost:8601');
        const errors = await page.evaluate(() => window.errors || []);
        expect(errors).toHaveLength(0);
    });
});
```

## 🚀 Running Tests

### Quick Start

```bash
# Run all tests (lint, unit, build, integration)
npm test

# Run specific test types
npm run test:unit        # Unit tests only
npm run test:integration # Integration tests only
npm run test:smoke       # Smoke tests only
npm run test:lint        # Code linting only
```

### Development Workflow

```bash
# Watch mode for active development
npm run test:unit -- --watch

# Run tests for specific files
npm run test:unit -- --testPathPattern=components

# Run with coverage report
npm run test:unit -- --coverage

# Debug mode with verbose output
npm run test:unit -- --verbose
```

### Continuous Integration

The test suite is designed for CI/CD environments:

```bash
# CI-optimized test run
npm run test:integration -- --maxWorkers=4

# Smoke tests for deployment verification
npm run test:smoke -- --runInBand
```

## 🛠️ Test Configuration

### Jest Configuration

Tests use Jest as the primary test runner with custom configuration:

```javascript
// jest.config.js (implied configuration)
module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/test/helpers/enzyme-setup.js'],
    moduleNameMapping: {
        '\\.(css|less|scss)$': '<rootDir>/test/__mocks__/styleMock.js',
        '\\.(gif|ttf|eot|svg)$': '<rootDir>/test/__mocks__/fileMock.js'
    },
    collectCoverageFrom: [
        'src/**/*.{js,jsx}',
        '!src/**/*.test.{js,jsx}'
    ]
};
```

### Enzyme Setup

React component testing uses Enzyme:

```javascript
// test/helpers/enzyme-setup.js
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });
```

### Selenium Configuration

Browser automation tests use Selenium WebDriver:

```javascript
// test/helpers/selenium-helper.js
const { Builder, By, until } = require('selenium-webdriver');

class SeleniumHelper {
    constructor() {
        this.driver = new Builder()
            .forBrowser('chrome')
            .build();
    }
    
    async navigateToEditor() {
        await this.driver.get('http://localhost:8601');
        await this.driver.wait(until.elementLocated(By.className('gui_editor')));
    }
}
```

## 📊 Test Data and Fixtures

### Project Fixtures

The `fixtures/` directory contains various test projects:

**Valid Projects:**
- `project1.sb3` - Standard Scratch 3.0 project
- `monitor-variable.sb3` - Project with variable monitors

**Corrupted Projects (for error handling tests):**
- `corrupt-bmp.sb3` - Project with corrupted bitmap
- `corrupt-svg.sb3` - Project with corrupted SVG
- `missing-sprite-svg.sb3` - Project with missing sprite assets

**Media Assets:**
- `100-100.svg` - Test vector graphic
- `paddleball.gif` - Test animated image
- `sneaker.wav` - Test audio file
- `movie.wav` - Test audio file

### Using Fixtures in Tests

```javascript
import path from 'path';
import fs from 'fs';

describe('Project Loading', () => {
    test('handles corrupted projects gracefully', async () => {
        const corruptProject = path.join(__dirname, '../fixtures/corrupt-bmp.sb3');
        const projectData = fs.readFileSync(corruptProject);
        
        await expect(loadProject(projectData)).rejects.toThrow('Invalid project format');
    });
});
```

## 🎭 Mocking Strategy

### Audio System Mocks

```javascript
// test/__mocks__/audio-buffer-player.js
class MockAudioBufferPlayer {
    constructor() {
        this.isPlaying = false;
    }
    
    play() {
        this.isPlaying = true;
        return Promise.resolve();
    }
    
    stop() {
        this.isPlaying = false;
    }
}

module.exports = MockAudioBufferPlayer;
```

### File System Mocks

```javascript
// test/__mocks__/fileMock.js
module.exports = 'test-file-stub';
```

### Style Mocks

```javascript
// test/__mocks__/styleMock.js
module.exports = {};
```

## 🔍 Writing New Tests

### Unit Test Example

```javascript
// test/unit/components/sprite-selector.test.js
import React from 'react';
import { shallow } from 'enzyme';
import SpriteSelector from '../../../src/components/sprite-selector/sprite-selector.jsx';

describe('SpriteSelector', () => {
    let defaultProps;
    
    beforeEach(() => {
        defaultProps = {
            sprites: [
                { id: 'sprite1', name: 'Cat' },
                { id: 'sprite2', name: 'Dog' }
            ],
            selectedSpriteId: 'sprite1',
            onSelectSprite: jest.fn()
        };
    });
    
    test('renders all sprites', () => {
        const wrapper = shallow(<SpriteSelector {...defaultProps} />);
        expect(wrapper.find('.sprite-item')).toHaveLength(2);
    });
    
    test('calls onSelectSprite when sprite clicked', () => {
        const wrapper = shallow(<SpriteSelector {...defaultProps} />);
        wrapper.find('.sprite-item').at(1).simulate('click');
        expect(defaultProps.onSelectSprite).toHaveBeenCalledWith('sprite2');
    });
});
```

### Integration Test Example

```javascript
// test/integration/project-state.test.js
import { createStore } from 'redux';
import reducer from '../../src/reducers/project-state';
import { loadProject, saveProject } from '../../src/lib/project-loader';

describe('Project State Integration', () => {
    let store;
    
    beforeEach(() => {
        store = createStore(reducer);
    });
    
    test('project loading updates state correctly', async () => {
        const projectData = await loadProject('test/fixtures/project1.sb3');
        
        store.dispatch({
            type: 'SET_PROJECT_DATA',
            projectData
        });
        
        const state = store.getState();
        expect(state.targets).toBeDefined();
        expect(state.targets).toHaveLength(2); // Stage + 1 sprite
    });
});
```

### Smoke Test Example

```javascript
// test/smoke/addon-loading.test.js
describe('Addon Loading Smoke Test', () => {
    test('all enabled addons load without errors', async () => {
        const page = await browser.newPage();
        
        // Capture console errors
        const errors = [];
        page.on('console', msg => {
            if (msg.type() === 'error') {
                errors.push(msg.text());
            }
        });
        
        await page.goto('http://localhost:8601');
        await page.waitForSelector('.gui_editor');
        
        // Wait for addons to load
        await page.waitForTimeout(2000);
        
        expect(errors).toHaveLength(0);
    });
});
```

## 🐛 Debugging Tests

### Common Issues

**Tests failing in CI but passing locally:**
- Check for timing issues - add appropriate waits
- Verify environment variables and configuration
- Ensure test isolation - tests shouldn't depend on each other

**Mock-related issues:**
- Verify mock implementations match real API
- Check that mocks are properly reset between tests
- Ensure mocks are imported before the modules they mock

**Async test problems:**
- Use `async/await` or return promises properly
- Set appropriate timeouts for slow operations
- Handle promise rejections explicitly

### Debug Techniques

```javascript
// Add debug output
test('debug example', () => {
    const result = myFunction();
    console.log('Debug result:', result); // Will show in test output
    expect(result).toBe(expected);
});

// Use Jest's debug mode
npm run test:unit -- --verbose --no-cache

// Run single test file
npm run test:unit -- --testPathPattern=sprite-selector

// Run with debugger
node --inspect-brk node_modules/.bin/jest --runInBand
```

## 📈 Coverage and Quality

### Coverage Goals

- **Unit Tests:** >80% code coverage
- **Integration Tests:** Cover all major user workflows
- **Smoke Tests:** Cover critical application paths

### Quality Metrics

```bash
# Generate coverage report
npm run test:unit -- --coverage

# Coverage thresholds (in jest config)
coverageThreshold: {
    global: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80
    }
}
```

### Test Quality Guidelines

1. **Test Behavior, Not Implementation** - Focus on what the code does, not how
2. **Use Descriptive Test Names** - Make test purpose clear from the name
3. **Keep Tests Independent** - Each test should be able to run in isolation
4. **Mock External Dependencies** - Don't rely on external services in tests
5. **Test Edge Cases** - Include error conditions and boundary cases

## 🔗 Related Documentation

- [Main OmniBlocks README](../README.md) - Project overview and setup
- [Contributing Guidelines](../.github/CONTRIBUTING.md) - How to contribute
- [Playground Documentation](../src/playground/README.md) - Development environment
- [Examples Documentation](../src/examples/README.md) - Extension development

## 🤝 Contributing to Tests

### Areas Needing Test Coverage

- **Addon System** - More comprehensive addon testing
- **Performance Tests** - Automated performance regression testing
- **Accessibility Tests** - Screen reader and keyboard navigation testing
- **Mobile Testing** - Touch interface and responsive design testing

### Adding New Tests

1. **Identify the test type** - Unit, integration, or smoke test?
2. **Choose appropriate location** - Follow the directory structure
3. **Write descriptive tests** - Clear names and good assertions
4. **Add fixtures if needed** - Create test data in `fixtures/`
5. **Update documentation** - Document any new testing patterns

### Test Review Checklist

- [ ] Tests are independent and can run in any order
- [ ] Test names clearly describe what is being tested
- [ ] Edge cases and error conditions are covered
- [ ] Mocks are used appropriately for external dependencies
- [ ] Tests run quickly (unit tests < 1s, integration tests < 10s)
- [ ] Coverage is maintained or improved

---

**Questions about testing?** Open an issue or start a discussion in the [OmniBlocks GitHub organization](https://github.com/orgs/OmniBlocks/discussions)!