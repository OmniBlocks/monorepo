import paper from '@scratch/paper';
import {connect} from 'react-redux';
import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';

import FontDropdownComponent from '../components/font-dropdown/font-dropdown.jsx';
import Fonts from '../lib/fonts';
import {changeFont} from '../reducers/font';
import {getSelectedLeafItems} from '../helper/selection';
import confirmStyles from './confirmation.css';

class FontDropdown extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'getFontName',
            'handleHoverCustom',
            'handleManageFonts',
            'handleChangeFontSerif',
            'handleChangeFontSansSerif',
            'handleChangeFontHandwriting',
            'handleChangeFontMarker',
            'handleChangeFontCurly',
            'handleChangeFontPixel',
            'handleChangeFontPlayful',
            'handleChangeFontBubbly',
            'handleChangeFontTechnological',
            'handleChangeFontBitsAndBytes',
            'handleChangeFontArcade',
            'handleChangeFontScratch',
            'handleChangeFontArchivo',
            'handleChangeFontArchivoBlack',
            'handleChangeFontChinese',
            'handleChangeFontJapanese',
            'handleChangeFontKorean',
            'handleOpenDropdown',
            'handleClickOutsideDropdown',
            'setDropdown',
            'handleChoose',
            'handleChooseCustom',
            'handleChooseExisting'
        ]);
        this.customFonts = {};
        this.acceptedCustomFontAgreement = false;

        this.latestCustomFont = null;
    }
    getFontName (font) {
        const NATIVE_FONTS = Object.values(Fonts);
        if (NATIVE_FONTS.includes(font)) {
            switch (font) {
            case Fonts.CHINESE:
                return '中文';
            case Fonts.KOREAN:
                return '한국어';
            case Fonts.JAPANESE:
                return '日本語';
            case Fonts.SCRATCH:
                return 'Branches';
            default:
                return font;
            }
        }

        const customFont = this.props.customFonts.find(i => i.family === font);
        if (customFont) {
            return customFont.name;
        }
        return font;
    }
    handleHoverCustom (family) {
        if (this.dropDown.isOpen()) {
            this.props.changeFont(family);
        }
    }
    handleManageFonts () {
        this.cancelFontChange();
        this.props.onManageFonts();
    }

    displayConfirmMessage (titlehtml, html, acceptInstantlyIfTrue) {
        return new Promise((resolve, reject) => {
            if (acceptInstantlyIfTrue === true) {
                return resolve(true);
            }
            const div = document.createElement("div");
            document.body.append(div);
            div.classList.add(confirmStyles.base);
            const box = document.createElement("div");
            div.append(box);
            box.classList.add(confirmStyles.promptBox);
            const header = document.createElement("div");
            box.append(header);
            header.classList.add(confirmStyles.header);
            header.innerHTML = titlehtml;
            box.innerHTML += `<div>${html}</div>`;
            const buttonRow = document.createElement("div");
            box.append(buttonRow);
            buttonRow.classList.add(confirmStyles.buttonRow);
            const deny = document.createElement("button");
            buttonRow.append(deny);
            deny.classList.add(confirmStyles.promptButton);
            deny.classList.add(confirmStyles.deny);
            deny.innerHTML = "Deny";
            const accept = document.createElement("button");
            buttonRow.append(accept);
            accept.classList.add(confirmStyles.promptButton);
            accept.classList.add(confirmStyles.accept);
            accept.innerHTML = "Accept";
            accept.onclick = () => {
                div.remove();
                resolve(true);
            }
            deny.onclick = () => {
                div.remove();
                reject(false);
            }
        })
    }

    displayPopup(title, width, height, accepted, cancelled) {
        const div = document.createElement("div");
        document.body.append(div);
        div.classList.add(confirmStyles.base);
        const box = document.createElement("div");
        div.append(box);
        box.classList.add(confirmStyles.promptBox);
        box.style.width = `${width}px`;
        box.style.height = `${height}px`;
        const header = document.createElement("div");
        box.append(header);
        header.classList.add(confirmStyles.header);
        header.innerText = title;
        const textarea = document.createElement("div");
        box.append(textarea);
        const buttonRow = document.createElement("div");
        box.append(buttonRow);
        buttonRow.classList.add(confirmStyles.buttonRow);
        const deny = document.createElement("button");
        buttonRow.append(deny);
        deny.classList.add(confirmStyles.promptButton);
        deny.classList.add(confirmStyles.deny);
        deny.innerHTML = "Cancel";
        const accept = document.createElement("button");
        buttonRow.append(accept);
        accept.classList.add(confirmStyles.promptButton);
        accept.classList.add(confirmStyles.accept);
        accept.innerHTML = "OK";
        accept.onclick = () => {
            div.remove();
            if (accepted) accepted();
        }
        deny.onclick = () => {
            div.remove();
            if (cancelled) cancelled();
        }
        return {
            popup: div,
            container: box,
            header: header,
            buttonRow: buttonRow,
            textarea: textarea,
            cancel: deny,
            ok: accept
        }
    }

    loadAndUseFontBlob (blob) {
        const fileNameSplit = String(blob.name).split(".");
        if (!["ttf", "woff", "woff2", "otf"].includes(fileNameSplit.pop().toLowerCase())) {
            console.log(blob.name, "not usable");
            return alert("Only .ttf, .woff, .woff2 and .otf files can be used for custom fonts.");
        }
        const fr = new FileReader();
        fr.onload = (e) => {
            const uri = e.target.result;
            const fontName = `PENGUINMOD_CustomFontPicker_${uri.substring(100, 200)}_PM`.replace(/[^A-Za-z0-9_]+/gmi, "");
            this.customFonts[fontName] = `${fileNameSplit.join(".")}`;
            let style;
            if (document.getElementById("penguinmod-custom-fonts")) {
                style = document.getElementById("penguinmod-custom-fonts");
            } else {
                style = document.createElement("style");
                style.id = "penguinmod-custom-fonts";
                document.body.prepend(style);
            }
            style.innerHTML += `@font-face { font-family: "${fontName}"; src: url("${uri}"); }\n\n.${fontName} { font-family: "${fontName}"; }\n\n`;
            this.latestCustomFont = {
                name: this.customFonts[fontName],
                class: fontName
            }
            this.props.changeFont(fontName);
            this.props.onUpdateImage();
        }
        fr.readAsDataURL(blob);
    }

    handleChangeFontSansSerif () {
        if (this.dropDown.isOpen()) {
            this.props.changeFont(Fonts.SANS_SERIF);
        }
    }
    handleChangeFontSerif () {
        if (this.dropDown.isOpen()) {
            this.props.changeFont(Fonts.SERIF);
        }
    }
    handleChangeFontHandwriting () {
        if (this.dropDown.isOpen()) {
            this.props.changeFont(Fonts.HANDWRITING);
        }
    }
    handleChangeFontMarker () {
        if (this.dropDown.isOpen()) {
            this.props.changeFont(Fonts.MARKER);
        }
    }
    handleChangeFontCurly () {
        if (this.dropDown.isOpen()) {
            this.props.changeFont(Fonts.CURLY);
        }
    }
    handleChangeFontPixel () {
        if (this.dropDown.isOpen()) {
            this.props.changeFont(Fonts.PIXEL);
        }
    }
    handleChangeFontPlayful () {
        if (this.dropDown.isOpen()) {
            this.props.changeFont(Fonts.PLAYFUL);
        }
    }
    handleChangeFontBitsAndBytes() {
        if (this.dropDown.isOpen()) {
            this.props.changeFont(Fonts.BITSANDBYTES);
        }
    }
    handleChangeFontBubbly() {
        if (this.dropDown.isOpen()) {
            this.props.changeFont(Fonts.BUBBLY);
        }
    }
    handleChangeFontTechnological() {
        if (this.dropDown.isOpen()) {
            this.props.changeFont(Fonts.TECHNOLOGICAL);
        }
    }
    handleChangeFontArcade() {
        if (this.dropDown.isOpen()) {
            this.props.changeFont(Fonts.ARCADE);
        }
    }
    handleChangeFontArchivo() {
        if (this.dropDown.isOpen()) {
            this.props.changeFont(Fonts.ARCHIVO);
        }
    }
    handleChangeFontArchivoBlack() {
        if (this.dropDown.isOpen()) {
            this.props.changeFont(Fonts.ARCHIVOBLACK);
        }
    }
    handleChangeFontScratch() {
        if (this.dropDown.isOpen()) {
            this.props.changeFont(Fonts.SCRATCH);
        }
    }
    handleChangeFontChinese () {
        if (this.dropDown.isOpen()) {
            this.props.changeFont(Fonts.CHINESE);
        }
    }
    handleChangeFontJapanese () {
        if (this.dropDown.isOpen()) {
            this.props.changeFont(Fonts.JAPANESE);
        }
    }
    handleChangeFontKorean () {
        if (this.dropDown.isOpen()) {
            this.props.changeFont(Fonts.KOREAN);
        }
    }
    handleChoose () {
        if (this.dropDown.isOpen()) {
            this.dropDown.handleClosePopover();
            this.props.onUpdateImage();
        }
    }
    handleChooseExisting () {
        if (!this.latestCustomFont) return;
        if (this.dropDown.isOpen()) {
            this.props.changeFont(this.latestCustomFont.class);
            this.dropDown.handleClosePopover();
            this.props.onUpdateImage();
        }
    }
    handleChooseCustom () {
        if (this.dropDown.isOpen()) {
            this.dropDown.handleClosePopover();
            this.displayConfirmMessage(`<p>Read this before continuing!</p>`, `<div style="width:100%;height:100%;text-align:center;"><br><p>To use a custom font, you will need a .ttf, .woff, .woff2, or .otf file.<br><b>ONLY USE FONTS YOU HAVE THE LICENSE TO USE!</b><br>If you are downloading online fonts, you should use the ones that are either listed as 100% free, OFL / GPL, or Public Domain.<br>If you get in trouble for using a font that you weren't allowed to legally use, it's YOUR fault, not ours.</p><br><p><b>You are also only able to use custom fonts properly in Bitmap mode currently.</b> Using them in Vector mode will cause it to appear as a different font on the stage.</p></div>`, this.acceptedCustomFontAgreement)
                .then(() => {
                    this.acceptedCustomFontAgreement = true;

                    const filePicker = document.createElement("input");
                    const prompt = this.displayPopup("Import a Font", 460, 360, () => {
                        if (!filePicker.files[0]) return;
                        this.loadAndUseFontBlob(filePicker.files[0]);
                    });
                    prompt.textarea.style = `width: 100%;height: 75%;display: flex;justify-content: center;align-items: center;flex-direction: column;`;
                    prompt.textarea.append(filePicker);
                    filePicker.type = "file";
                    filePicker.accept = ".ttf,.otf,.woff,.woff2"
                    // dont make the file input hidden otherwise you cant press Tab to get to it
                    filePicker.style = "width:0px;height:0px;";
                    filePicker.id = "filePicker-penguinmod-paint-font-dropdown-903274031753195632894310537203491-32957197531-4815-3715489-abc"
                    const fakeFileButton = document.createElement("label");
                    fakeFileButton.setAttribute("for", filePicker.id);
                    fakeFileButton.classList.add(confirmStyles.filePicker);
                    fakeFileButton.innerHTML = "Choose a file";
                    prompt.textarea.append(fakeFileButton);
                    const fileNameLabel = document.createElement("p");
                    prompt.textarea.append(fileNameLabel);
                    fileNameLabel.innerHTML = "No font file selected";
                    prompt.textarea.append(document.createElement("br"));
                    const fileTypesLabel = document.createElement("p");
                    prompt.textarea.append(fileTypesLabel);
                    fileTypesLabel.innerHTML = "Select a file of .ttf, .otf, .woff, or .woff2 type";
                    filePicker.onchange = () => {
                        fileNameLabel.innerText = filePicker.files[0].name;
                    }
                })
            return;
        }
    }
    handleOpenDropdown () {
        this.savedFont = this.props.font;
        this.savedSelection = getSelectedLeafItems();
    }
    handleClickOutsideDropdown (e) {
        e.stopPropagation();
        this.cancelFontChange();
    }
    cancelFontChange () {
        this.dropDown.handleClosePopover();

        // Cancel font change
        for (const item of this.savedSelection) {
            if (item instanceof paper.PointText) {
                item.font = this.savedFont;
            }
        }

        this.props.changeFont(this.savedFont);
        this.savedFont = null;
        this.savedSelection = null;
    }
    setDropdown (element) {
        this.dropDown = element;
    }
    render () {
        return (
            <FontDropdownComponent
                componentRef={this.setDropdown}
                font={this.props.font}
                getFontName={this.getFontName}
                customFonts={this.props.customFonts}
                onHoverCustom={this.handleHoverCustom}
                onManageFonts={this.props.onManageFonts && this.handleManageFonts}
                onChoose={this.handleChoose}
                onChooseCustom={this.handleChooseCustom}
                onChooseExisting={this.handleChooseExisting}
                onClickOutsideDropdown={this.handleClickOutsideDropdown}
                onHoverChinese={this.handleChangeFontChinese}
                onHoverCurly={this.handleChangeFontCurly}
                onHoverHandwriting={this.handleChangeFontHandwriting}
                onHoverJapanese={this.handleChangeFontJapanese}
                onHoverKorean={this.handleChangeFontKorean}
                onHoverMarker={this.handleChangeFontMarker}
                onHoverPixel={this.handleChangeFontPixel}
                onHoverPlayful={this.handleChangeFontPlayful}
                onHoverBubbly={this.handleChangeFontBubbly}
                onHoverBitsAndBytes={this.handleChangeFontBitsAndBytes}
                onHoverTechnological={this.handleChangeFontTechnological}
                onHoverArcade={this.handleChangeFontArcade}
                onHoverArchivo={this.handleChangeFontArchivo}
                onHoverArchivoBlack={this.handleChangeFontArchivoBlack}
                onHoverScratch={this.handleChangeFontScratch}
                onHoverSansSerif={this.handleChangeFontSansSerif}
                onHoverSerif={this.handleChangeFontSerif}
                onOpenDropdown={this.handleOpenDropdown}
                customExists={this.latestCustomFont !== null}
                customClass={this.latestCustomFont ? this.latestCustomFont.class : null}
                customName={this.latestCustomFont ? this.latestCustomFont.name : null}
            />
        );
    }
}

FontDropdown.propTypes = {
    changeFont: PropTypes.func.isRequired,
    customFonts: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        family: PropTypes.string.isRequired
    })).isRequired,
    onManageFonts: PropTypes.func,
    font: PropTypes.string,
    onUpdateImage: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    font: state.scratchPaint.font,
    customFonts: state.scratchPaint.customFonts
});
const mapDispatchToProps = dispatch => ({
    changeFont: font => {
        dispatch(changeFont(font));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FontDropdown);
