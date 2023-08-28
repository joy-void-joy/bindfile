import { Node } from '@tiptap/core'

export const Paragraph = Node.create({
  name: 'paragraph',
  priority: 1000,
  group: 'block',
  content: 'text*',

  parseHTML() {
    return []
  },
  renderHTML({ HTMLAttributes }) {
    return ['div', HTMLAttributes, 0]
  },
  renderText(props) {
    if (props.pos == 0) {
      return ''
    }

    return '\n'
  },
})

export default Paragraph
