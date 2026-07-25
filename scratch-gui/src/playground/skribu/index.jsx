import React from 'react'

import render from '../app-target'
import {applyGuiColors} from '../../lib/themes/guiHelpers'
import { detectTheme} from '../../lib/themes/themePersistance'
import Skribu from './skribu.jsx'

applyGuiColors(detectTheme())
document.documentElement.lang = 'en'

render(<Skribu />)
