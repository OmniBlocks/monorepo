# Extension Examples

This directory contains example code and templates for creating custom extensions for OmniBlocks/scratch-gui.

## 📁 Directory Structure

```
src/examples/
├── README.md                    # This file
└── extensions/
    └── example-extension.js     # Comprehensive extension example
```

## 🚀 Quick Start

The `example-extension.js` file provides a complete, well-documented template for creating custom Scratch extensions. It demonstrates all the key concepts and APIs you'll need to build your own extensions.

### What's Included

The example extension demonstrates:

- **Block Types**: Command, Reporter, Boolean, Hat, and Conditional blocks
- **Arguments**: Number, String, and other input types
- **Menus**: Both static and dynamic menu creation
- **Internationalization**: Multi-language support with translation maps
- **Target Types**: Custom hardware or software integrations
- **Best Practices**: Proper naming, documentation, and structure

## 🛠️ Creating Your Own Extension

### 1. Basic Extension Structure

Every extension needs to implement the `getInfo()` method that returns metadata about your extension:

```javascript
var MyExtension = function () {};

MyExtension.prototype.getInfo = function () {
    return {
        id: 'myExtension',           // Unique identifier
        name: 'My Extension',        // Display name
        iconURI: 'data:image/...',   // Optional icon
        blocks: [                    // Array of blocks
            // Your blocks here
        ]
    };
};

// Register the extension
Scratch.extensions.register(new MyExtension());
```

### 2. Block Types

#### Command Blocks
```javascript
{
    opcode: 'myCommand',
    blockType: Scratch.BlockType.COMMAND,
    text: 'do something with [VALUE]',
    arguments: {
        VALUE: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: 'hello'
        }
    },
    func: 'myCommandFunction'
}
```

#### Reporter Blocks (Return Values)
```javascript
{
    opcode: 'myReporter',
    blockType: Scratch.BlockType.REPORTER,
    text: 'get value',
    func: 'getMyValue'
}
```

#### Boolean Blocks (True/False)
```javascript
{
    opcode: 'myBoolean',
    blockType: Scratch.BlockType.BOOLEAN,
    text: 'is condition true?',
    func: 'checkCondition'
}
```

### 3. Implementing Block Functions

```javascript
MyExtension.prototype.myCommandFunction = function (args) {
    console.log('Command executed with:', args.VALUE);
};

MyExtension.prototype.getMyValue = function () {
    return 'Hello from my extension!';
};

MyExtension.prototype.checkCondition = function () {
    return true; // or false
};
```

## 🔧 Development Workflow

### 1. Local Development

1. **Create your extension file** in this directory or elsewhere in your project
2. **Load it in scratch-vm** by modifying the extension registry
3. **Test in the GUI** using the development server (`npm start`)

### 2. Integration with scratch-vm

Extensions are actually loaded by scratch-vm, not scratch-gui. To add your extension:

1. Fork the [scratch-vm repository](https://github.com/OmniBlocks/scratch-vm)
2. Add your extension to `src/extensions/`
3. Register it in the extension manager
4. Link your forked scratch-vm to this project

### 3. Testing Your Extension

- Use the playground environment (`/src/playground/`) for testing
- Test all block types and argument combinations
- Verify internationalization if you support multiple languages
- Test with different target types (sprites, stage, custom hardware)

## 📚 Advanced Features

### Dynamic Menus

Create menus that update based on current state:

```javascript
menus: {
    dynamicMenu: 'getDynamicItems'
},

// Implementation
MyExtension.prototype.getDynamicItems = function () {
    return [
        { value: 'item1', text: 'Dynamic Item 1' },
        { value: 'item2', text: 'Dynamic Item 2' }
    ];
};
```

### Internationalization

Support multiple languages:

```javascript
translation_map: {
    'es': {
        'myExtension': 'Mi Extensión',
        'myCommand': 'hacer algo con [VALUE]'
    },
    'fr': {
        'myExtension': 'Mon Extension',
        'myCommand': 'faire quelque chose avec [VALUE]'
    }
}
```

### Custom Target Types

Create extensions for specific hardware or software:

```javascript
targetTypes: [
    'myHardware'  // becomes 'myExtension.myHardware'
],

// In blocks, filter by target type
filter: ['myExtension.myHardware', 'sprite']
```

## 🐛 Troubleshooting

### Common Issues

**Extension doesn't appear in the editor:**
- Check that `Scratch.extensions.register()` is called
- Verify the extension ID is unique
- Ensure there are no JavaScript errors in the console

**Blocks don't work:**
- Verify function names match the `func` property in block definitions
- Check that all required properties are present in block definitions
- Test argument types and default values

**Translation issues:**
- Ensure translation keys match exactly
- Check that the translation_map structure is correct
- Verify language codes are valid

### Debugging Tips

1. **Use browser developer tools** to check for JavaScript errors
2. **Add console.log statements** in your extension functions
3. **Test incrementally** - start with simple blocks and add complexity
4. **Check the scratch-vm console** for extension loading errors

## 🔗 Related Documentation

- [Main OmniBlocks README](../../../README.md) - Project overview and setup
- [Addons Documentation](../../addons/README.md) - Related addon system
- [TurboWarp Extension Documentation](https://docs.turbowarp.org/development/extensions) - Upstream docs
- [Scratch Extension Specification](https://github.com/LLK/scratch-vm/blob/develop/docs/extensions.md) - Official spec

## 🤝 Contributing

Found an issue with the example or want to add more examples?

1. Fork the repository
2. Create a feature branch
3. Add your improvements or new examples
4. Submit a pull request

We especially welcome:
- Additional example extensions for different use cases
- Better documentation and tutorials
- Examples for hardware integration
- Advanced extension patterns and best practices

---

**Need help?** Open an issue or start a discussion in the [OmniBlocks GitHub organization](https://github.com/orgs/OmniBlocks/discussions)!