# padding-command

Adjusts the padding of the selected paragraphs by a given amount (delta). Limits the result to customizable maximum and minimum values.

## usage

```javascript
var PaddingCommand = require('padding-command');

new PaddingCommand({ delta: 50 })
new PaddingCommand({ delta: 50, min: 0, max: 500 }, root, document)
```