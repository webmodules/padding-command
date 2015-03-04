import AbstractCommand from 'abstract-command';

class PaddingCommand extends AbstractCommand {
  constructor({ direction = 'auto', delta = 50, max = 200, min = 0 } = {}, root = document.documentElement, doc: Document = root.ownerDocument) {
    super(doc);
    this.direction = direction;
    this.delta = delta;
    this.max = max;
    this.min = min;
    this.root = root;
    this.document = doc;
  }

  _getProp(paragraph) {
    let direction = this.direction;

    // TODO: properly handle LTR here
    if (direction == 'auto') {
      direction = 'left';
    }

    return `padding-${direction}`;
  }

  _setPadding(paragraph, padding) {
    let value = `${padding}px`;
    let prop = this._getProp(paragraph);

    // attempt to clear padding in inline style and check if the computed
    // value matches the desired padding. If it does, keep it blank, since
    // the padding specified on the stylesheet is the correct one.
    paragraph.style[prop] = '';
    let style = window.getComputedStyle(paragraph);
    if (style[prop] == value) return;

    paragraph.style[prop] = value;
  }

  _getPadding(paragraph) {
    let prop = this._getProp(paragraph);
    let padding = paragraph.style[prop];
    if (padding && padding.match('[0-9\.]+px')) return parseInt(padding, 10);

    let style = window.getComputedStyle(paragraph);
    return parseInt(style[prop], 10) || 0;
  }

  _isParagraph(node) {
    return node.nodeName == 'P';
  }

  _findClosestOrTopmost(node) {
    while (node && node != this.root) {
      if (this._isParagraph(node)) return node;
      if (node.parentNode == this.root) return node;
      node = node.parentNode;
    }
    return null;
  }

  _findParagraphs(range) {
    let firstNode = this._findClosestOrTopmost(range.startContainer);
    let lastNode = this._findClosestOrTopmost(range.endContainer);
    if (firstNode.parentNode != lastNode.parentNode) {
      // we don't handle this case yet
      return [];
    }
    let result = [];
    for (let node = firstNode; node != lastNode; node = node.nextSibling) {
      if (this._isParagraph(node)) {
        result.push(node);
      }
    }
    if (this._isParagraph(lastNode)) {
      result.push(lastNode);
    }
    return result;
  }

  _execute(range) {
    if (!range) return;
    let paragraphs = this._findParagraphs(range);
    for (let paragraph of paragraphs) {
      let padding = this._getPadding(paragraph)
      this._setPadding(paragraph, Math.min(Math.max(padding + this.delta, this.min), this.max));
    }
  }

  _queryEnabled(range) {
    if (!range) return false;
    let paragraphs = this._findParagraphs(range);
    if (paragraphs.length == 0) return false;
    let values = paragraphs.map((paragraph) => this._getPadding(paragraph) + this.delta);
    return values.some((value) => value >= this.min && value <= this.max);
  }

  _queryState(range) {
    return false;
  }
}

export default PaddingCommand;