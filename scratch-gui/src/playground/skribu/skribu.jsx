import React from 'react'
import Box from '../../components/box/box.jsx';
import Button from '../../components/button/button.jsx';
import Blockly from 'scratch-blocks'

import styles from './skribu.css'

const STORAGE_KEY = 'omniblocks:skribu:workspace'

const toolbox = `
<xml>
    <category
        name="Skribu"
        colour="#59c0c0"
        secondaryColour="#3f9999"
    >
        <block type="skribu_print"></block>
    </category>
</xml>
`

const defineBlocks = () => {
  if (Blockly.Blocks.skribu_print) return

  Blockly.defineBlocksWithJsonArray([
    {
      type: 'skribu_print',
      message0: 'print %1',
      args0: [
        {
          type: 'field_input',
          name: 'TEXT',
          text: 'hello',
        },
      ],
      previousStatement: null,
      nextStatement: null,
      colour: '#59c0c0',
    },
  ])
}

const getProgram = (workspace) => {
  const lines = []
  const topBlocks = workspace.getTopBlocks(true)

  const emitStack = (block) => {
    for (let current = block; current; current = current.getNextBlock()) {
      if (current.type === 'skribu_print') {
        lines.push(`print(${JSON.stringify(current.getFieldValue('TEXT') || '')});`)
      } else {
        lines.push(`// Unsupported block: ${current.type}`)
      }
    }
  }

  topBlocks.forEach(emitStack)

  return lines.join('\n')
}

const runProgram = (workspace) => {
  const output = []

  const runStack = (block) => {
    for (let current = block; current; current = current.getNextBlock()) {
      if (current.type !== 'skribu_print') {
        output.push(`Unsupported block: ${current.type}`)
        continue
      }

      output.push(current.getFieldValue('TEXT') || '')
    }
  }

  workspace.getTopBlocks(true).forEach(runStack)
  return output.join('\n')
}

class Skribu extends React.Component {
  constructor(props) {
    super(props)

    this.workspaceElement = React.createRef()
    this.workspace = null
    this.handleWorkspaceChange = this.handleWorkspaceChange.bind(this)

    this.state = {
      code: '',
      output: '',
    }
  }

  componentDidMount() {
    defineBlocks()

    this.workspace = Blockly.inject(this.workspaceElement.current, {
      toolbox,
      media: `${process.env.ROOT}static/blocks-media/default/`,
      scrollbars: true,
      trashcan: true,
      sounds: false,
      grid: {
        spacing: 20,
        length: 3,
        colour: '#ddd',
        snap: true,
      },
      zoom: {
        controls: true,
        wheel: true,
        startScale: 0.9,
        maxScale: 2,
        minScale: 0.5,
        scaleSpeed: 1.1,
      },
    })

    this.loadWorkspace()
    this.workspace.addChangeListener(this.handleWorkspaceChange)
    this.updateProgram()
  }

  componentWillUnmount() {
    if (this.workspace) {
      this.workspace.removeChangeListener(this.handleWorkspaceChange)
      this.workspace.dispose()
      this.workspace = null
    }
  }

  loadWorkspace() {
    try {
      const savedWorkspace = localStorage.getItem(STORAGE_KEY)
      if (!savedWorkspace) return

      const xml = Blockly.Xml.textToDom(savedWorkspace)
      Blockly.Xml.domToWorkspace(xml, this.workspace)
    } catch (error) {
      console.warn('Unable to restore Skribu workspace:', error)
    }
  }

  saveWorkspace() {
    try {
      const xml = Blockly.Xml.workspaceToDom(this.workspace)
      localStorage.setItem(STORAGE_KEY, Blockly.Xml.domToText(xml))
    } catch (error) {
      console.warn('Unable to save Skribu workspace:', error)
    }
  }

  updateProgram() {
    this.setState({
      code: getProgram(this.workspace),
    })
  }

  handleWorkspaceChange(event) {
    if (event && event.type === Blockly.Events.UI) return

    this.saveWorkspace()
    this.updateProgram()
  }

  handleRun = () => {
    this.setState({
      output: runProgram(this.workspace),
    })
  }

    render () {
        const code = this.state.code || '// Add a block to begin.';
        const output = this.state.output || 'Program output appears here.';

        return (
            <Box
                className={styles.pageWrapper}
                dir="ltr"
            >
                <Box className={styles.menuBar}>
                    <Box className={styles.mainMenu}>
                        <a
                            className={styles.logo}
                            href={`${process.env.ROOT}editor.html`}
                        >
                            OmniBlocks
                        </a>

                        <Box className={styles.menuBarItem}>
                            Skribu
                        </Box>
                    </Box>

                    <Box className={styles.menuActions}>
                        <Button
                            className={styles.runButton}
                            onClick={this.handleRun}
                        >
                            Run
                        </Button>
                        <a
                            className={styles.editorLink}
                            href={`${process.env.ROOT}editor.html`}
                        >
                            Back to editor
                        </a>
                    </Box>
                </Box>

                <Box className={styles.bodyWrapper}>
                    <Box className={styles.editorWrapper}>
                        <Box className={styles.tabList}>
                            <div className={styles.tab}>
                                Code
                            </div>
                        </Box>

                        <Box className={styles.workspaceWrapper}>
                            <div
                                ref={this.workspaceElement}
                                className={styles.workspace}
                            />
                        </Box>
                    </Box>

                    <Box className={styles.runtimeWrapper}>
                        <Box className={styles.runtimeHeader}>
                            <span>Output</span>
                            <Button
                                className={styles.runtimeRunButton}
                                onClick={this.handleRun}
                            >
                                Run
                            </Button>
                        </Box>

                        <Box className={styles.consoleWrapper}>
                            <pre className={styles.output}>{output}</pre>
                        </Box>

                        <Box className={styles.generatedCodeHeader}>
                            Program
                        </Box>

                        <Box className={styles.generatedCodeWrapper}>
                            <pre className={styles.code}>{code}</pre>
                        </Box>
                    </Box>
                </Box>
            </Box>
        );
    }
}

export default Skribu
