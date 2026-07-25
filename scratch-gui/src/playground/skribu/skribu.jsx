import React from 'react'
import Blockly from 'scratch-blocks'

import styles from './skribu.css'

const STORAGE_KEY = 'omniblocks:skribu:workspace'

const toolbox = `
<xml>
    <category name="Skribu" colour="#59c0c0">
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

  render() {
    return (
      <main className={styles.page}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Skribu</h1>
            <p className={styles.subtitle}>Blocks → code → output</p>
          </div>
          <a className={styles.backLink} href={`${process.env.ROOT}editor.html`}>
            Back to editor
          </a>
        </header>

        <section className={styles.layout}>
          <div className={styles.workspacePanel}>
            <h2>Blocks</h2>
            <div ref={this.workspaceElement} className={styles.workspace} />
          </div>

          <div className={styles.sidePanel}>
            <section className={styles.pane}>
              <h2>Generated code</h2>
              <pre className={styles.code}>{this.state.code || '// Add a block to begin.'}</pre>
            </section>

            <section className={styles.pane}>
              <div className={styles.outputHeader}>
                <h2>Output</h2>
                <button className={styles.runButton} type="button" onClick={this.handleRun}>
                  Run
                </button>
              </div>
              <pre className={styles.output}>
                {this.state.output || 'Program output appears here.'}
              </pre>
            </section>
          </div>
        </section>
      </main>
    )
  }
}

export default Skribu
