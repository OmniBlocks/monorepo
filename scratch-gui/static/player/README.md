# OmniBlocks Music Player

A standalone BeepBox-based music player component that provides chiptune music creation and playback capabilities. This is part of OmniBlocks' integrated music editor system.

## 📁 Directory Structure

```
static/player/
├── README.md                    # This file
├── 404.html                     # Error page for missing resources
├── beepbox_player.min.js        # Core BeepBox player engine
├── index.html                   # Main player interface
└── sample-libraries/            # Audio sample collections
    ├── drumsamples.js          # Drum kit samples
    ├── kirby_samples.js        # Kirby game-inspired samples
    ├── mario_paintbox_samples.js # Mario Paint-style samples
    ├── nintaribox_samples.js   # Nintendo-style chiptune samples
    ├── samples.js              # Basic sample library
    ├── samples2.js             # Extended sample library
    ├── samples3.js             # Additional sample library
    └── wario_samples.js        # Wario game-inspired samples
```

## 🎵 What is the Music Player?

The OmniBlocks Music Player is a web-based chiptune music creation tool based on BeepBox. It allows users to:

- **Create chiptune music** using various synthesized instruments
- **Use retro game samples** from classic Nintendo games and more
- **Export compositions** for use in OmniBlocks projects
- **Play back music** with high-quality audio synthesis

### Relationship to OmniBlocks

This player is part of OmniBlocks' broader vision to be a comprehensive creative IDE. While currently standalone, it's planned to integrate more deeply with the main block-based editor for:

- **Sound block integration** - Use custom music in Scratch projects
- **Interactive composition** - Create music that responds to project events
- **Educational tools** - Teach music theory alongside programming concepts

> **Note:** As mentioned in the main README, the music editor is currently "not fully integrated" - it works as a standalone tool but doesn't yet seamlessly integrate with the main OmniBlocks interface.

## 🚀 Using the Music Player

### Standalone Usage

1. **Direct Access:** Navigate to `/static/player/index.html` in your browser
2. **Development Server:** Access via `http://localhost:8601/player/` when running `npm start`
3. **Production:** Available at `https://omniblocks.github.io/player/`

### Browser Requirements

The music player requires modern browser features:
- **Web Audio API** support (Chrome, Firefox, Safari, Edge)
- **ES6 Classes** and arrow functions
- **Modern JavaScript** features

Unsupported browsers will show a compatibility message.

### Interface Overview

The player provides:
- **Pattern Editor** - Create musical patterns and sequences
- **Instrument Panel** - Select and configure synthesized instruments
- **Sample Browser** - Access retro game audio samples
- **Playback Controls** - Play, pause, loop, and export compositions
- **Effects Panel** - Add reverb, distortion, and other audio effects

## 🎮 Sample Libraries

The player includes several themed sample libraries inspired by classic video games:

### Core Libraries

#### `drumsamples.js`
Basic drum kit samples for rhythm sections:
- Kick drums, snares, hi-hats
- Electronic percussion sounds
- Suitable for most music styles

#### `samples.js`, `samples2.js`, `samples3.js`
Progressive sample collections with:
- Melodic instruments (leads, pads, arps)
- Bass sounds and sub-bass
- Atmospheric and texture sounds

### Game-Inspired Libraries

#### `kirby_samples.js`
Samples inspired by the Kirby game series:
- Cute, bouncy melodic sounds
- Whimsical percussion
- Dream-like atmospheric textures

#### `mario_paintbox_samples.js`
Mario Paint-style samples:
- Classic Nintendo sound palette
- Playful and colorful tones
- Nostalgic 16-bit character

#### `nintaribox_samples.js`
Nintendo/Atari-inspired chiptune samples:
- 8-bit square waves and pulse waves
- Classic arcade game sounds
- Retro console audio aesthetics

#### `wario_samples.js`
Wario game-inspired samples:
- Quirky and unconventional sounds
- Experimental timbres
- Unique character and personality

### Using Samples

Samples are automatically loaded when the player starts. To use them:

1. **Select an instrument track** in the pattern editor
2. **Choose "Sample" as the instrument type**
3. **Browse the sample library** using the dropdown menu
4. **Preview samples** by clicking on them
5. **Create patterns** using the selected samples

## 🛠️ Development and Customization

### Adding Custom Samples

To add your own sample library:

1. **Create a new JavaScript file** following the existing pattern:
```javascript
// my_custom_samples.js
window.SAMPLE_LIBRARY = window.SAMPLE_LIBRARY || {};
window.SAMPLE_LIBRARY.myCustomSamples = {
    name: "My Custom Samples",
    samples: [
        {
            name: "Custom Sound 1",
            url: "path/to/sound1.wav",
            category: "melodic"
        },
        // ... more samples
    ]
};
```

2. **Include the file** in `index.html`:
```html
<script src="my_custom_samples.js"></script>
```

3. **Ensure audio files** are accessible from the player directory

### Modifying the Interface

The player interface is controlled by `beepbox_player.min.js`. For significant modifications:

1. **Access the source** - The minified file is built from BeepBox source code
2. **Fork BeepBox** - Create your own fork of the BeepBox project
3. **Build custom version** - Compile your modifications
4. **Replace the minified file** - Update `beepbox_player.min.js`

### Integration Development

For deeper OmniBlocks integration:

1. **Message Passing** - Use `postMessage` API for communication with parent frames
2. **Export Functions** - Create functions to export compositions to OmniBlocks format
3. **Event Handling** - Listen for OmniBlocks events to trigger music changes
4. **State Synchronization** - Keep music state in sync with project state

## 🔧 Technical Details

### Audio Engine

The player uses the Web Audio API for:
- **Real-time synthesis** of chiptune instruments
- **Sample playback** with pitch shifting and effects
- **Audio routing** and mixing
- **Export functionality** to various audio formats

### Performance Considerations

- **Memory Usage** - Sample libraries are loaded into memory
- **CPU Usage** - Real-time audio synthesis can be CPU-intensive
- **Browser Limits** - Some browsers limit concurrent audio contexts
- **Mobile Performance** - May have reduced performance on mobile devices

### File Formats

**Supported Export Formats:**
- WAV (uncompressed audio)
- MP3 (compressed audio, browser-dependent)
- MIDI (musical data)
- JSON (BeepBox project format)

**Supported Import Formats:**
- BeepBox JSON projects
- MIDI files (limited support)
- Audio samples (WAV, MP3, OGG)

## 🐛 Troubleshooting

### Common Issues

**Player won't load:**
- Check browser console for JavaScript errors
- Verify Web Audio API support
- Ensure all sample files are accessible

**No sound output:**
- Check browser audio permissions
- Verify system audio settings
- Try refreshing the page to reset audio context

**Samples not loading:**
- Check network connectivity
- Verify sample file paths are correct
- Look for CORS issues in browser console

**Performance issues:**
- Reduce number of active tracks
- Lower audio quality settings
- Close other audio-intensive browser tabs

### Debug Mode

Enable debug logging by adding to the URL:
```
/player/index.html?debug=true
```

This provides:
- Detailed console logging
- Audio context information
- Sample loading status
- Performance metrics

## 🔗 Related Resources

### OmniBlocks Documentation
- [Main README](../../README.md) - Project overview and setup
- [Playground Documentation](../../src/playground/README.md) - Development environment

### BeepBox Resources
- [BeepBox Official Site](https://beepbox.co/) - Original BeepBox editor
- [BeepBox GitHub](https://github.com/johnnesky/beepbox) - Source code and documentation
- [BeepBox Community](https://discord.gg/beepbox) - Community and support

### Web Audio Resources
- [Web Audio API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [Audio Programming Tutorials](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Using_Web_Audio_API)

## 🎯 Future Plans

The music player is planned to evolve with:

### Short-term Goals
- **Better OmniBlocks integration** - Seamless workflow between music and blocks
- **Enhanced sample library** - More diverse and high-quality samples
- **Improved mobile support** - Better touch interface and performance
- **Export improvements** - More format options and better quality

### Long-term Vision
- **Collaborative editing** - Multiple users creating music together
- **AI assistance** - Smart composition suggestions and harmonization
- **Advanced synthesis** - More sophisticated audio synthesis options
- **Educational features** - Music theory integration and learning tools

## 🤝 Contributing

We welcome contributions to the music player:

### Areas for Contribution
- **Sample libraries** - Create themed sample collections
- **Interface improvements** - Better UX and accessibility
- **Performance optimization** - Reduce CPU and memory usage
- **Integration features** - Better OmniBlocks connectivity
- **Documentation** - Tutorials and user guides

### Contribution Process
1. Fork the repository
2. Create a feature branch
3. Test your changes thoroughly
4. Submit a pull request with detailed description

---

**Ready to make some music?** Try the player at [omniblocks.github.io/player/](https://omniblocks.github.io/player/) or start a discussion in the [OmniBlocks GitHub organization](https://github.com/orgs/OmniBlocks/discussions)!