import { visit } from 'unist-util-visit'
import type { Element, Root, Text } from 'hast'
import type { Plugin } from 'unified'

/**
 * Final Solution, based on user's discovery.
 *
 * This plugin inserts a Zero-Width Non-Joiner (ZWNJ) character (\u200C)
 * inside a <span> before any <strong> or <em> tag that is the first
 * significant child of a list item (<li>).
 *
 * The ZWNJ is a non-printing control character that is respected by the
 * WeChat editor's parser, unlike the Zero-Width Space. This prevents the parser
 * from incorrectly wrapping subsequent elements in a <section> tag.
 */
export function rehypeFixBrokenSection(): Plugin<[], Root> {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      // Target container elements where the bug occurs.
      if (node.tagName !== 'li' && node.tagName !== 'td' && node.tagName !== 'th') {
        return
      }

      if (!node.children || node.children.length === 0) {
        return
      }

      // Find the index of the first non-whitespace child node.
      const firstRealChildIndex = node.children.findIndex((child) => {
        if (child.type === 'element') return true
        if (child.type === 'text' && /\S/.test(child.value)) return true
        return false
      })

      // If no significant child is found, do nothing.
      if (firstRealChildIndex === -1) return

      const firstRealChild = node.children[firstRealChildIndex]

      // Check if this first significant child is a <strong> or <em> element.
      if (
        firstRealChild.type === 'element' &&
        (firstRealChild.tagName === 'strong' || firstRealChild.tagName === 'em')
      ) {
        // Insert a span with a Zero-Width Non-Joiner character before the element.
        const zwnjSpan: Element = {
          type: 'element',
          tagName: 'span',
          properties: {},
          children: [{ type: 'text', value: '\u200C' }], // ZERO WIDTH NON-JOINER
        }

        // Insert the new span right before the first significant child.
        node.children.splice(firstRealChildIndex, 0, zwnjSpan)
      }
    })
  }
}
