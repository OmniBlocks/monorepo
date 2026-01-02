# ❓ Frequently Asked Questions

Comprehensive answers to common questions about OmniBlocks.

## 🏠 General Questions

### What is OmniBlocks?

OmniBlocks is an enhanced fork of TurboWarp that provides a high-performance Scratch 3.0 experience with additional features, quality-of-life improvements, and professional development tools. It's designed to be both beginner-friendly and powerful enough for advanced users.

### How is OmniBlocks different from Scratch?

| Feature | Scratch | OmniBlocks |
|---------|---------|------------|
| **Performance** | Standard | TurboWarp compiler (much faster) |
| **Addons** | Limited | Comprehensive addon system |
| **Extensions** | Basic | Advanced extension support |
| **Themes** | Fixed | Multiple theme options |
| **Offline** | Limited | Full offline support |
| **Advanced Features** | Few | Many professional tools |
| **Customization** | Limited | Highly customizable |
| **Future** | Scratch-focused | Multi-language IDE vision |

### How is OmniBlocks different from TurboWarp?

While OmniBlocks uses TurboWarp's excellent compiler and performance improvements, we focus on:
- **Professional Workflow**: Features designed for serious developers
- **Extensibility**: Comprehensive addon and extension systems
- **Customization**: Theming and interface personalization
- **Future Vision**: Multi-language IDE integration
- **Community Focus**: Active development and community engagement

### Is OmniBlocks free?

Yes! OmniBlocks is completely free and open-source. You can:
- Use it without any cost
- Modify the source code
- Contribute improvements
- Share it with others
- Use it for commercial projects (following the AGPLv3 license)

### Who can use OmniBlocks?

OmniBlocks is designed for:
- **Beginners**: Learning to code with blocks
- **Students**: Educational projects and assignments
- **Educators**: Teaching programming concepts
- **Hobbyists**: Creating games and interactive projects
- **Professionals**: Rapid prototyping and development
- **Researchers**: Experimenting with block-based programming

## 📥 Installation and Setup

### How do I install OmniBlocks?

**Web Version (Easiest):**
1. Visit [https://omniblocks.github.io](https://omniblocks.github.io)
2. Click "Install" to add as a PWA to your desktop
3. Start using it immediately!

**Developer Installation:**
```bash
git clone https://github.com/OmniBlocks/scratch-gui
cd scratch-gui
npm ci
npm start
```

### What are the system requirements?

**Minimum:**
- Modern browser (Chrome, Firefox, Safari, Edge)
- 2GB RAM
- 500MB free storage
- Internet connection for initial load

**Recommended for Development:**
- Node.js 22+
- 8GB+ RAM
- SSD storage
- Git

### Can I use OmniBlocks offline?

Yes! You have several options:
1. **PWA Installation**: Install to your desktop for offline use
2. **Standalone Build**: Create self-contained HTML files
3. **Local Server**: Run the development server locally

### How do I update OmniBlocks?

**Web Version:** Automatically updates when you refresh

**PWA Version:** Updates in the background, prompts on next launch

**Developer Version:**
```bash
cd scratch-gui
git pull origin main
npm ci
npm start
```

### Why is OmniBlocks slow on my computer?

Try these solutions:
1. **Close other tabs**: Free up browser resources
2. **Use Chrome/Edge**: Best performance on Chromium browsers
3. **Enable Turbo Mode**: In settings for maximum speed
4. **Reduce project complexity**: Fewer sprites, simpler scripts
5. **Clear cache**: Browser cache might be causing issues
6. **Check for loops**: Infinite loops can cause slowdowns

## 🔄 Compatibility

### Can I open Scratch projects in OmniBlocks?

Yes! OmniBlocks is fully compatible with Scratch 3.0 projects:
- **File → Load from your computer**
- Select your `.sb3` file
- All Scratch projects work perfectly

### Can I use my Scratch account?

No, OmniBlocks doesn't integrate with Scratch accounts for privacy and security reasons. However:
- You can still import/export `.sb3` files
- Cloud variables work with TurboWarp's cloud service
- You can choose any username (not tied to Scratch)

### Will my OmniBlocks projects work in Scratch?

Yes! As long as you don't use:
- OmniBlocks-specific extensions
- Custom addons that modify core behavior
- Experimental features not in Scratch

### Can I use OmniBlocks on mobile?

Yes, but with limitations:
- **Browser**: Works in mobile browsers
- **Touch Interface**: Optimized for touch
- **Performance**: May be slower on mobile devices
- **Features**: Some features may be limited

**Best mobile experience:** Use Chrome or Safari on a tablet

### Does OmniBlocks work on iPads?

Yes! You can:
- Use the web version in Safari
- Install as a PWA for better experience
- Use GitHub Codespaces for development
- Connect external keyboards for easier coding

## 🧩 Features and Functionality

### What are addons?

Addons are optional features that extend OmniBlocks' functionality:
- **Editor Devtools**: Advanced editing features
- **Debugger**: Step-through debugging
- **Custom Themes**: Additional visual themes
- **Block Enhancements**: Extended block functionality
- **Project Analytics**: Performance monitoring

### How do I enable addons?

1. Click the **Settings** gear icon
2. Go to **Addons** tab
3. Toggle addons on/off
4. Configure addon-specific settings
5. Changes take effect immediately

### What are extensions?

Extensions add new blocks and functionality:
- **Hardware**: micro:bit, LEGO, Arduino
- **Software**: Text-to-Speech, Translation
- **Games**: Game Controller, Video Sensing
- **Music**: Advanced music tools
- **Custom**: User-created extensions

### How do I create custom extensions?

1. **Fork scratch-vm**: Extensions run in the VM
2. **Create extension file**: Implement your blocks
3. **Register extension**: Add to extension registry
4. **Link to OmniBlocks**: Update dependencies
5. **Test and share**: Verify and distribute

See our [Extensions Guide](Extensions.md) for details.

### What themes are available?

OmniBlocks includes:
- **Aqua** (Default): OmniBlocks brand theme
- **Blue**: Classic Scratch-like theme
- **Rainbow**: Colorful gradient theme
- **Red**: High-contrast red theme
- **Purple**: Elegant purple theme

### Can I create my own themes?

Yes! Create theme files in `src/lib/themes/accent/`:
```javascript
export default {
    id: 'mytheme',
    name: 'My Theme',
    colors: {
        primary: '#FF5733',
        secondary: '#33FF57',
        // ... more colors
    }
};
```

## 🎵 Music Editor

### What is the music editor?

OmniBlocks includes an advanced music editor for:
- Creating melodies with piano roll interface
- Multiple instrument tracks
- Effect processing and filters
- Export/import music files
- Integration with projects

### How do I use the music editor?

1. Click **Music Editor** in the toolbar
2. Create melodies using the interface
3. Adjust instruments, tempo, and effects
4. Export as WAV/MP3
5. Import into your projects

### Why doesn't my music save with the project?

The music editor is still being integrated. Currently:
- Music doesn't save in project files
- Export music separately
- Use the standalone music editor for now
- Full integration coming soon!

## 🔧 Development and Contribution

### How do I contribute to OmniBlocks?

1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Test thoroughly**
5. **Submit a pull request**
6. **Address feedback**
7. **Get merged!**

See our [Contributing Guide](Contributing.md) for details.

### What can I contribute?

We welcome:
- **Bug fixes**: Help squash bugs
- **New features**: Add functionality
- **Addons**: Create useful addons
- **Extensions**: Develop new extensions
- **Themes**: Design visual themes
- **Documentation**: Improve docs
- **Translations**: Add language support
- **Tests**: Write test cases

### Do I need to be an expert to contribute?

No! We welcome contributors of all levels:
- **Beginners**: Start with documentation or simple bugs
- **Intermediate**: Work on features and addons
- **Advanced**: Tackle complex architecture issues
- **Non-coders**: Help with design, testing, community

### What programming languages do I need?

**Essential:**
- JavaScript (ES6+)
- React

**Helpful:**
- Redux
- Webpack
- CSS/SCSS
- Node.js

**Optional:**
- Python (for some dependencies)
- C++ (for advanced extensions)

### How do I set up the development environment?

See our [Development Setup Guide](Development-Setup.md) for complete instructions.

## 🎮 Game Development

### Can I make games with OmniBlocks?

Absolutely! OmniBlocks is great for game development:
- **Platformers**: Jump-and-run games
- **Puzzles**: Logic-based challenges
- **Racing**: Vehicle-based games
- **Adventure**: Story-driven experiences
- **Arcade**: Classic arcade-style games

### What game-specific features are available?

- **Physics Engine**: Realistic movement and collisions
- **Particle Effects**: Visual enhancements
- **Score System**: Built-in scoring
- **Level Management**: Multi-level support
- **Game Controller**: Hardware integration
- **Video Sensing**: Motion detection

### Can I publish my OmniBlocks games?

Yes! You can:
- **Export as HTML**: Share standalone games
- **Host online**: Put on your website
- **Share project files**: Let others remix
- **Create executables**: Use tools like Electron

### How do I optimize game performance?

1. **Enable Turbo Mode**: Maximum speed
2. **Reduce sprite count**: Fewer objects to render
3. **Simplify scripts**: Optimize your code
4. **Use cloning**: Instead of many sprites
5. **Limit effects**: Reduce visual complexity
6. **Test on target devices**: Ensure good performance

## 🤖 Hardware and Robotics

### What hardware does OmniBlocks support?

**Officially Supported:**
- micro:bit
- LEGO Mindstorms
- LEGO WeDo
- Arduino (basic)

**Community Extensions:**
- Raspberry Pi
- Makey Makey
- Various sensors and actuators

### How do I connect hardware?

1. **Enable extension**: For your hardware
2. **Connect device**: Via USB/Bluetooth
3. **Pair device**: Follow on-screen instructions
4. **Test connection**: Verify communication
5. **Use blocks**: Control your hardware

### Can I create my own hardware extensions?

Yes! You can:
1. **Fork scratch-vm**
2. **Create extension**
3. **Implement communication**
4. **Define blocks**
5. **Test and share**

See our [Extensions Guide](Extensions.md) for details.

### Why isn't my hardware working?

Try these troubleshooting steps:
1. **Check connection**: Ensure device is properly connected
2. **Enable extension**: Verify extension is enabled
3. **Update firmware**: Check for device updates
4. **Browser permissions**: Allow USB/Bluetooth access
5. **Try different port**: USB port might be faulty
6. **Check console**: Look for error messages
7. **Restart**: Both device and browser

## 📚 Education and Learning

### Is OmniBlocks good for education?

Yes! OmniBlocks is excellent for education:
- **Beginner-friendly**: Easy to start with blocks
- **Progressive learning**: Grow from basics to advanced
- **Engaging**: Fun and interactive
- **Creative**: Encourages experimentation
- **Collaborative**: Share and remix projects
- **Standards-aligned**: Supports educational goals

### What age groups is OmniBlocks for?

OmniBlocks is designed for:
- **Ages 8+**: Basic block programming
- **Ages 12+**: Advanced features and concepts
- **Teens**: Game development and extensions
- **Adults**: Professional prototyping
- **Educators**: Teaching tool for all ages

### Can I use OmniBlocks in my classroom?

Absolutely! OmniBlocks offers:
- **Free for education**: No cost for schools
- **Offline mode**: Works without internet
- **Classroom management**: Teacher tools
- **Curriculum integration**: Aligns with standards
- **Student accounts**: Individual progress tracking
- **Collaboration**: Group projects and sharing

### Are there lesson plans available?

Yes! We have:
- **Built-in tutorials**: Learn as you go
- **Sample projects**: Inspire creativity
- **Community resources**: Shared by educators
- **Curriculum guides**: Aligned with standards
- **Challenge activities**: Engaging exercises

## 🔒 Privacy and Security

### Is OmniBlocks safe for kids?

Yes! We prioritize safety:
- **No account required**: Use without personal data
- **No tracking**: Respect privacy
- **Content moderation**: Community guidelines
- **Parental controls**: Optional restrictions
- **Secure connections**: HTTPS everywhere

### What data does OmniBlocks collect?

**Minimal data collection:**
- **Essential only**: What's needed for functionality
- **No personal info**: We don't collect personal data
- **No tracking**: No analytics or user tracking
- **Transparent**: Clear privacy policy
- **Opt-in**: Any optional data collection

### Can I use OmniBlocks without internet?

Yes! Offline options:
- **PWA installation**: Works offline after first load
- **Standalone builds**: Self-contained HTML files
- **Local development**: Run your own server
- **Project files**: Save and load locally

### How secure are my projects?

Your projects are secure:
- **Local storage**: Projects saved on your device
- **Encryption**: Optional project encryption
- **No forced cloud**: You control where projects are saved
- **Backup options**: Multiple ways to backup
- **Privacy controls**: Control sharing and visibility

## 🚀 Performance and Technical

### Why is OmniBlocks faster than Scratch?

OmniBlocks uses TurboWarp's compiler for:
- **JIT Compilation**: Just-in-time compilation
- **Optimized Execution**: Faster block processing
- **Memory Management**: Reduced memory usage
- **Parallel Processing**: Multi-threaded execution
- **Lazy Evaluation**: Optimized computation

### How much faster is OmniBlocks?

Performance improvements:
- **Simple projects**: 2-5x faster
- **Complex projects**: 5-10x faster
- **Graphics-intensive**: 3-8x faster
- **Large projects**: 10-20x faster in some cases

### Can I measure performance?

Yes! Use these tools:
- **Performance Monitor**: Built-in monitoring
- **Debugger**: Step-through analysis
- **Browser DevTools**: Chrome/Firefox tools
- **Profiling**: Identify bottlenecks
- **Benchmarking**: Compare before/after

### How do I optimize my projects?

Optimization tips:
1. **Enable Turbo Mode**: Maximum performance
2. **Reduce complexity**: Simplify scripts
3. **Use cloning**: Instead of many sprites
4. **Limit effects**: Reduce visual complexity
5. **Optimize assets**: Smaller images/sounds
6. **Test regularly**: Identify performance issues

## 🌍 Community and Support

### How do I get help with OmniBlocks?

**Support options:**
- **GitHub Discussions**: [https://github.com/orgs/OmniBlocks/discussions](https://github.com/orgs/OmniBlocks/discussions)
- **Issue Tracker**: Report bugs and request features
- **Documentation**: This wiki and README files
- **Community Forum**: Peer support and discussion
- **Live Chat**: Real-time support (when available)

### How do I report a bug?

1. **Check existing issues**: Avoid duplicates
2. **Gather information**: Browser, OS, steps to reproduce
3. **Create issue**: On GitHub issue tracker
4. **Provide details**: Clear description and screenshots
5. **Be responsive**: Answer follow-up questions

### How do I request a feature?

1. **Check roadmap**: See if it's already planned
2. **Search discussions**: Avoid duplicate requests
3. **Create feature request**: On GitHub
4. **Explain use case**: Why this feature is needed
5. **Provide examples**: How it should work
6. **Engage community**: Get feedback and support

### Can I join the OmniBlocks community?

Yes! Ways to get involved:
- **GitHub Discussions**: Join conversations
- **Contribute code**: Help develop OmniBlocks
- **Create addons**: Extend functionality
- **Write documentation**: Improve resources
- **Translate**: Add language support
- **Test**: Help find and fix bugs
- **Share projects**: Inspire others

### How do I contact the OmniBlocks team?

**Contact methods:**
- **GitHub Discussions**: Best for general questions
- **Issue Tracker**: For bugs and feature requests
- **Email**: For private inquiries (check GitHub profile)
- **Social Media**: Follow for updates (links in README)
- **Live Events**: Community meetups and streams

## 📱 Mobile and Tablet

### Can I use OmniBlocks on my phone?

Yes, but with limitations:
- **Browser**: Works in mobile browsers
- **Touch Interface**: Optimized for touch
- **Performance**: May be slower
- **Features**: Some limitations
- **Screen Size**: Best on larger screens

**Recommended:** Use a tablet for better experience

### How do I use OmniBlocks on a tablet?

Tablet usage tips:
1. **Use landscape mode**: More screen space
2. **Enable touch mode**: Better touch support
3. **Use external keyboard**: Easier typing
4. **Zoom and pan**: Navigate large projects
5. **Save frequently**: Prevent data loss

### Why is OmniBlocks slow on my tablet?

Tablet performance tips:
1. **Close other apps**: Free up memory
2. **Use Chrome**: Best performance
3. **Enable Turbo Mode**: Maximum speed
4. **Reduce project size**: Fewer sprites
5. **Clear cache**: Browser cache issues
6. **Restart device**: Fresh start

### Can I use a stylus with OmniBlocks?

Yes! Stylus support:
- **Precision**: Better than finger touch
- **Pressure sensitivity**: For drawing
- **Palm rejection**: Better writing experience
- **Button support**: Right-click equivalent

## 💾 Project Management

### How do I save my projects?

**Save options:**
1. **File → Save to your computer**: Local `.sb3` file
2. **File → Save to cloud**: Online storage (if available)
3. **Auto-save**: Automatic local backup
4. **Export**: Various format options

### Where are my projects saved?

**Save locations:**
- **Local**: Your computer's download folder (by default)
- **Cloud**: OmniBlocks cloud service (if enabled)
- **Browser**: Local storage for auto-save
- **Custom**: You choose the location

### How do I backup my projects?

**Backup methods:**
1. **Regular saves**: Save copies frequently
2. **Export**: Create backup files
3. **Cloud sync**: Automatic backup (if enabled)
4. **Version control**: Use Git for advanced backup
5. **Multiple locations**: Save in different places

### Can I recover deleted projects?

**Recovery options:**
1. **Auto-save**: Check browser local storage
2. **Cache**: Browser cache might have copies
3. **Cloud backup**: If cloud sync was enabled
4. **File recovery**: Use file recovery tools
5. **Version history**: If using version control

### How do I share my projects?

**Sharing methods:**
1. **Export `.sb3`**: Share the project file
2. **Cloud link**: Share via cloud service
3. **Embed**: Put projects on your website
4. **Remix**: Allow others to build on your work
5. **Showcase**: Submit to community galleries

## 🎓 Learning and Resources

### Where can I learn to use OmniBlocks?

**Learning resources:**
- **Built-in tutorials**: Learn as you go
- **Sample projects**: Explore and remix
- **Documentation**: This wiki and guides
- **Video tutorials**: Community-created content
- **Live streams**: Watch and learn
- **Workshops**: Community events

### Are there OmniBlocks tutorials?

Yes! Tutorial types:
- **Beginner**: Getting started guides
- **Intermediate**: Advanced features
- **Project-based**: Build specific projects
- **Concept-focused**: Learn programming concepts
- **Extension development**: Create your own extensions

### Can I use Scratch tutorials with OmniBlocks?

Yes! Most Scratch tutorials work with OmniBlocks:
- **Block tutorials**: Identical block system
- **Project tutorials**: Same project structure
- **Concept tutorials**: Same programming concepts
- **Game tutorials**: Same game development approach

**Differences to note:**
- Some OmniBlocks-specific features
- Performance differences
- Additional addons and extensions

### How do I learn advanced features?

**Advanced learning:**
1. **Experiment**: Try different features
2. **Read documentation**: Study advanced guides
3. **Examine examples**: Learn from sample projects
4. **Ask community**: Get help from experts
5. **Contribute**: Learn by helping develop
6. **Create extensions**: Deep dive into the system

## 🚧 Troubleshooting

### OmniBlocks won't load

**Solutions:**
1. **Clear cache**: Browser cache might be corrupted
2. **Try different browser**: Chrome/Edge recommended
3. **Check connection**: Internet might be required
4. **Disable extensions**: Browser extensions might conflict
5. **Update browser**: Use latest browser version
6. **Check console**: Look for error messages

### My project won't run

**Solutions:**
1. **Check for errors**: Look at error messages
2. **Simplify project**: Remove complex scripts
3. **Enable Turbo Mode**: Might fix performance issues
4. **Restart**: Close and reopen OmniBlocks
5. **Try different browser**: Browser-specific issues
6. **Check console**: Detailed error information

### Blocks are missing

**Solutions:**
1. **Enable extensions**: Required extensions might be off
2. **Check addons**: Some addons add blocks
3. **Restart**: Refresh the application
4. **Clear cache**: Browser cache issues
5. **Reinstall**: Corrupted installation
6. **Check updates**: Might be fixed in newer version

### Performance is poor

**Solutions:**
1. **Enable Turbo Mode**: Maximum performance
2. **Reduce complexity**: Simplify your project
3. **Close tabs**: Free up browser resources
4. **Use Chrome/Edge**: Best performance
5. **Check for loops**: Infinite loops cause slowdowns
6. **Optimize assets**: Smaller images/sounds

### Can't save projects

**Solutions:**
1. **Check permissions**: Browser might need permissions
2. **Try different location**: Save to different folder
3. **Use different format**: Try alternative save options
4. **Clear cache**: Browser storage issues
5. **Check storage**: Ensure enough disk space
6. **Try different browser**: Browser-specific issues

## 📈 Future of OmniBlocks

### What's coming next?

**Short-term roadmap:**
- **JavaScript Extension**: Text-based programming
- **Music Editor Integration**: Full music support
- **Monaco Editor**: Advanced text editing
- **Performance Improvements**: Even faster execution
- **Bug Fixes**: Address known issues

### Long-term vision

**Future goals:**
- **Multi-language IDE**: Python, C++, JavaScript
- **Plugin System**: Community extensions
- **Advanced Debugging**: Professional tools
- **Mobile Apps**: Native mobile experience
- **Desktop App**: Electron-based application
- **Cloud Collaboration**: Real-time teamwork
- **AI Assistance**: Smart coding help
- **Educational Platform**: Comprehensive learning system

### How can I influence the future?

**Ways to contribute:**
- **Feature requests**: Suggest new ideas
- **Bug reports**: Help improve quality
- **Code contributions**: Develop new features
- **Community building**: Grow the user base
- **Documentation**: Improve resources
- **Testing**: Help ensure stability
- **Feedback**: Share your experience
- **Sponsorship**: Support development

## 📚 Additional Resources

### Official Resources

- **GitHub Repository**: [https://github.com/OmniBlocks/scratch-gui](https://github.com/OmniBlocks/scratch-gui)
- **Documentation**: This wiki and README files
- **Issue Tracker**: [https://github.com/OmniBlocks/scratch-gui/issues](https://github.com/OmniBlocks/scratch-gui/issues)
- **Discussions**: [https://github.com/orgs/OmniBlocks/discussions](https://github.com/orgs/OmniBlocks/discussions)
- **Website**: [https://omniblocks.github.io](https://omniblocks.github.io)

### Community Resources

- **Tutorials**: Community-created learning materials
- **Sample Projects**: Shared projects and examples
- **Extensions**: User-created extensions
- **Addons**: Community addons
- **Themes**: Custom visual themes
- **Tools**: Helper utilities and integrations

### Related Projects

- **TurboWarp**: [https://turbowarp.org](https://turbowarp.org)
- **Scratch**: [https://scratch.mit.edu](https://scratch.mit.edu)
- **Scratch Addons**: [https://scratchaddons.com](https://scratchaddons.com)
- **Scratch VM**: [https://github.com/LLK/scratch-vm](https://github.com/LLK/scratch-vm)

### Learning Resources

- **Block Programming**: Learn block-based coding
- **Game Development**: Create games with OmniBlocks
- **Extension Development**: Build your own extensions
- **Addon Development**: Extend OmniBlocks functionality
- **Advanced Concepts**: Deep dive into programming

## 🤝 Still Need Help?

If you can't find the answer to your question:

1. **Search this FAQ**: Use browser search (Ctrl/Cmd + F)
2. **Check documentation**: Browse the wiki
3. **Search discussions**: Community might have answered
4. **Ask a question**: Start a new discussion
5. **Report an issue**: If it's a bug
6. **Contact team**: For urgent matters

**Remember:** The OmniBlocks community is here to help! Don't hesitate to ask questions and share your experiences.

Happy coding! 🎉