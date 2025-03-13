// filepath: /workspaces/scratch-gui/src/containers/song-editor.jsx
import React from 'react';
import PropTypes from 'prop-types';

class SongEditor extends React.Component {
    componentDidMount() {
        // Initialize your vanilla JS editor here
        // For example, if your editor is initialized with a function called `initializeSongEditor`
        if (window.browserHasRequiredFeatures()) {
            const script = document.createElement("script");
            script.src = "beepbox_editor.min.js";
            script.async = true;
            document.body.appendChild(script);
        } else {
            document.getElementById("beepboxEditorContainer").innerHTML = "Sorry, UltraBox doesn't support your browser. Try a recent version of Chrome, Firefox, Edge, Safari, or Opera.";
        }
    }

    render() {
        return (
            <div>
                {/* Add your existing HTML for the song editor here */}
                <div id="beepboxEditorContainer">
                    <noscript>
                        Sorry, UltraBox requires a JavaScript-enabled browser.
                    </noscript>
                </div>
                <div id="text-content">
                    <section>
                        <h1>
                            <font>UltraBox</font>
                            <span id="goldboxPlant" style={{ display: 'inline', color: '#62a13b' }}></span>
                        </h1>
                        <p id="introduction">
                            UltraBox is a mod first envisioned by Neptendo, made possible by contributing community members (see <a href="./credits.html">credits</a>).<br />
                            It takes elements from most of the beepbox mods available and puts them in one convenient package.
                        </p>
                        <p>
                            If you have any questions, please visit the <a href="./faq.html">FAQ</a>. Visit the <a href="./patch_notes.html">patch notes</a> to see the latest changes made.
                            <img id="Hotdog" src="" width="500" height="333" onClick={changeHotdogSize} />
                        </p>
                    </section>
                    <div className="column-container">
                        <main className="instructions-column">
                            <section>
                                <h2>Instructions</h2>
                                <p>
                                    You can add or remove notes by clicking on the gray rows at the top.
                                    UltraBox automatically plays the notes out loud for you. Try it!
                                </p>
                                <p>
                                    Notes go into patterns, and you can edit one pattern at a time.
                                    Those numbered boxes at the bottom of the editor are the different patterns you can edit.
                                    <span id="bar-editing">
                                        Click the boxes to move to a different part of the song, or click the arrows on the currently selected box to swap which pattern is played during that part of the song.
                                    </span>
                                </p>
                                <p>
                                    UltraBox can play several rows of patterns simultaneously, and each row has its own set of patterns.
                                    Most rows can play melodies or harmonies, but the bottom row is for drums.
                                </p>
                                <p>
                                    All song data is contained in the URL at the top of your browser.
                                    When you make changes to the song, the URL is updated to reflect your changes.
                                    When you are satisfied with your song, just copy and paste the URL to save and share your song!
                                </p>
                                <div id="keyboard-instructions">
                                    <p>
                                        When UltraBox has focus (click on its interface above), you can use these keyboard shortcuts: <br />
                                    </p>
                                    <ul>
                                        <li><b>Spacebar</b>: play or pause the song</li>
                                        <li><b>Shift Spacebar</b>: play</li>
                                    </ul>
                                </div>
                            </section>
                        </main>
                    </div>
                </div>
            </div>
        );
    }
}

SongEditor.propTypes = {
    // Define your prop types here
};

export default SongEditor;