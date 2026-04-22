import React from 'react';
import {FormattedMessage, injectIntl, intlShape, defineMessages} from 'react-intl';
import {connect} from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import bindAll from 'lodash.bindall';
import styles from './loader.css';
import {getIsLoadingWithId} from '../../reducers/project-state';
import topBlock from './top-block.svg';
import middleBlock from './middle-block.svg';
import bottomBlock from './bottom-block.svg';

const mainMessages = {
    'gui.loader.headline': (
        <FormattedMessage
            defaultMessage="Loading Project"
            description="Main loading message"
            id="gui.loader.headline"
        />
    ),
    'gui.loader.creating': (
        <FormattedMessage
            defaultMessage="Creating Project"
            description="Main creating message"
            id="gui.loader.creating"
        />
    )
};

const messages = defineMessages({
    projectData: {
        defaultMessage: 'Loading project …',
        description: 'Appears when loading project data, but not assets yet',
        id: 'tw.loader.projectData'
    },
    downloadingAssets: {
<<<<<<< HEAD
        defaultMessage: 'Downloading assets ({complete}/{total}) from remote source …',
=======
        defaultMessage: 'Downloading assets ({complete}/{total}) …',
>>>>>>> c455eacd8a66d4b9086f751ca07e203c7ed36571
        description: 'Appears when loading project assets from a project on a remote website',
        id: 'tw.loader.downloadingAssets'
    },
    loadingAssets: {
        defaultMessage: 'Loading assets ({complete}/{total}) …',
        description: 'Appears when loading project assets from a project file on the user\'s computer',
        id: 'tw.loader.loadingAssets'
    }
});

<<<<<<< HEAD
const funFacts = [
    'Fun fact: OmniBlocks is currently loading.',
    'Fun fact: OmniBlocks is very cool!',
    'Actual Fun fact: NPM stands for Node Package Manager. It is very painful to use.',
    'OmniBlocks is great, but Scratch was the foundation of it all. Please try it out!',
    'Fun fact: Funding for OmniBlocks is provided by Boxys like you! ',
    'Fun fa-Sadly, this fact was eaten by an evil kumquat.',
    'rt89qeywybprqwbyrpecrq;wr qwr;fq fwwf.wf.e3333332 sorry my cat ate my keyboard',
    "I'm sorry, Dave. I'm afraid I can't do that.",
    "TARS, what's your humor setting?",
    "Your cue light is broken.",
    "You're not a wizard, Harry.",
    'Fun fact: The person who typed this fact had too much caffeine!',
    'SIX SEEVEN',
    'Fun fact: six seven',
    'how to 101: todo',
    'I JUST ATE A HAM SANDWICH FOR BRUNDINNER',
    'Fun? fact: OmniBlocks is not loading. Oops :(',
    "Did you know? OmniBlocks isn't complete yet. Yup, we're still in alpha!",
    "Fun fact: I'm running out of fun facts.",
    "My jokes are funny, right?",
    "Fun fact: This isn't even my final form!",
    "Practice makes perfect. You should try practicing to code like... six or seven times a day, y'know?",
    "Why did the programmer quit his job? Because he didn't get arrays.",
    'Why do Java developers wear glasses? Because they don\'t see sharp.',
    'How many programmers does it take to change a light bulb? None, that\'s a hardware problem.',
    'Why do programmers prefer dark mode? Because light attracts bugs.',
    'What is a programmer\'s favorite hangout place? Foo Bar.',
    'Why do Python programmers have low self-esteem? Because they\'re constantly comparing their self to others.',
    'What do you call a group of 8 Hobbits? A Hobbyte.',
    'Why did the developer go broke? Because he used up all his cache.',
    "Fun fact:",
    "What did the fish say when it hit the wall? Dam.",
    "I'm reading a book about anti-gravity. It's impossible to put down!",
    "OmniBlocks is an alpha male sigma project.",
    "Are you liking the corny generic jokes yet?",
    "Did you know??? Boxy is a CLANKER.",
    'Preparing emojis...',
    'Herding cats...',
    'Growing apples...',
    'Removing dangos...',
    'Modifying features...',
    'Converting legacy lists...',
    'Reticulating splines...',
    'Constructing Boxys...',
    'Breathing air...',
    'Contemplating life choices...',
    'Contemplating caffeine intake...'
];
=======
// Because progress events are fired so often during the very performance-critical loading
// process and React updates are very slow, we bypass React for updating the progress bar.
>>>>>>> c455eacd8a66d4b9086f751ca07e203c7ed36571

class LoaderComponent extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleAssetProgress',
            'handleProjectLoaded',
            'barInnerRef',
<<<<<<< HEAD
            'messageRef',
            'funFactRef',
            'updateFunFact'
        ]);
        this.barInnerEl = null;
        this.messageEl = null;
        this.funFactEl = null;
        this.ignoreProgress = false;
        this.funFactInterval = null;
        this.lastFunFactIndex = -1;
=======
            'messageRef'
        ]);
        this.barInnerEl = null;
        this.messageEl = null;
        this.ignoreProgress = false;
>>>>>>> c455eacd8a66d4b9086f751ca07e203c7ed36571
    }
    componentDidMount () {
        this.handleAssetProgress(
            this.props.vm.runtime.finishedAssetRequests,
            this.props.vm.runtime.totalAssetRequests
        );
        this.props.vm.on('ASSET_PROGRESS', this.handleAssetProgress);
        this.props.vm.runtime.on('PROJECT_LOADED', this.handleProjectLoaded);
<<<<<<< HEAD
        this.updateFunFact();
        this.funFactInterval = setInterval(this.updateFunFact, 3000);
=======
>>>>>>> c455eacd8a66d4b9086f751ca07e203c7ed36571
    }
    componentWillUnmount () {
        this.props.vm.off('ASSET_PROGRESS', this.handleAssetProgress);
        this.props.vm.runtime.off('PROJECT_LOADED', this.handleProjectLoaded);
<<<<<<< HEAD
        clearInterval(this.funFactInterval);
    }
    updateFunFact () {
        if (this.funFactEl) {
            this.funFactEl.classList.remove(styles.funFactSlideIn);
            void this.funFactEl.offsetWidth; // Trigger reflow
            let randomIndex;
            do {
                randomIndex = Math.floor(Math.random() * funFacts.length);
            } while (randomIndex === this.lastFunFactIndex);
            this.lastFunFactIndex = randomIndex;
            const randomFact = funFacts[randomIndex];
            this.funFactEl.textContent = randomFact;
            this.funFactEl.classList.add(styles.funFactSlideIn);
            this.funFactEl.classList.add(styles.funFactRoulette);
        }
=======
>>>>>>> c455eacd8a66d4b9086f751ca07e203c7ed36571
    }
    handleAssetProgress (finished, total) {
        if (this.ignoreProgress || !this.barInnerEl || !this.messageEl) {
            return;
        }

        if (total === 0) {
            // Started loading a new project.
            this.barInnerEl.style.width = '0';
            this.messageEl.textContent = this.props.intl.formatMessage(messages.projectData);
        } else {
            this.barInnerEl.style.width = `${finished / total * 100}%`;
            const message = this.props.isRemote ? messages.downloadingAssets : messages.loadingAssets;
            this.messageEl.textContent = this.props.intl.formatMessage(message, {
                complete: finished,
                total
            });
        }
    }
    handleProjectLoaded () {
        if (this.ignoreProgress || !this.barInnerEl || !this.messageEl) {
            return;
        }

        this.ignoreProgress = true;
        this.props.vm.runtime.resetProgress();
    }
    barInnerRef (barInner) {
        this.barInnerEl = barInner;
    }
    messageRef (message) {
        this.messageEl = message;
    }
<<<<<<< HEAD
    funFactRef (funFact) {
        this.funFactEl = funFact;
    }
    render () {
        return (
            <div
            className={classNames(styles.background, {
                [styles.fullscreen]: this.props.isFullScreen
            })}
            >
            
            <div className={styles.container}>
                <div className={styles.blockAnimation}>
                <img
                    className={styles.topBlock}
                    src={topBlock}
                    draggable={false}
                />
                <img
                    className={styles.middleBlock}
                    src={middleBlock}
                    draggable={false}
                />
                <img
                    className={styles.bottomBlock}
                    src={bottomBlock}
                    draggable={false}
                />
                </div>

                <div className={styles.title}>
                {mainMessages[this.props.messageId]}
                </div>

                <div
                className={styles.message}
                ref={this.messageRef}
                />

                <div className={styles.barOuter}>
                <div
                    className={styles.barInner}
                    ref={this.barInnerRef}
                />
                </div>

                <div
                className={styles.funFact}
                ref={this.funFactRef}
                />
            </div>
=======
    render () {
        return (
            <div
                className={classNames(styles.background, {
                    [styles.fullscreen]: this.props.isFullScreen
                })}
            >
                <div className={styles.container}>
                    <div className={styles.blockAnimation}>
                        <img
                            className={styles.topBlock}
                            src={topBlock}
                            draggable={false}
                        />
                        <img
                            className={styles.middleBlock}
                            src={middleBlock}
                            draggable={false}
                        />
                        <img
                            className={styles.bottomBlock}
                            src={bottomBlock}
                            draggable={false}
                        />
                    </div>

                    <div className={styles.title}>
                        {mainMessages[this.props.messageId]}
                    </div>

                    <div
                        className={styles.message}
                        ref={this.messageRef}
                    />

                    <div className={styles.barOuter}>
                        <div
                            className={styles.barInner}
                            ref={this.barInnerRef}
                        />
                    </div>
                </div>
>>>>>>> c455eacd8a66d4b9086f751ca07e203c7ed36571
            </div>
        );
    }
}

LoaderComponent.propTypes = {
    intl: intlShape,
    isFullScreen: PropTypes.bool,
    isRemote: PropTypes.bool,
    messageId: PropTypes.string,
    vm: PropTypes.shape({
        on: PropTypes.func,
        off: PropTypes.func,
        runtime: PropTypes.shape({
            totalAssetRequests: PropTypes.number,
            finishedAssetRequests: PropTypes.number,
            resetProgress: PropTypes.func,
            on: PropTypes.func,
            off: PropTypes.func
        })
    })
};
LoaderComponent.defaultProps = {
    isFullScreen: false,
    messageId: 'gui.loader.headline'
};

const mapStateToProps = state => ({
    isRemote: getIsLoadingWithId(state.scratchGui.projectState.loadingState),
    vm: state.scratchGui.vm
});

const mapDispatchToProps = () => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
<<<<<<< HEAD
)(injectIntl(LoaderComponent));
=======
)(injectIntl(LoaderComponent));
>>>>>>> c455eacd8a66d4b9086f751ca07e203c7ed36571
