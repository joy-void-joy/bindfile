import { Node } from '@tiptap/core'

export const Text = Node.create({
  name: 'text',
  group: 'inline',
  renderText(props) {
    return props.node.textContent
  },
})

export default Text
