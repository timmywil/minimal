minimal.js
================

An experiment.

The #1 priority for minimal is ***FAST***.  #2 is ***small***.

With these priorities in mind, users should have at least an intermediate understanding of javascript.  minimal will not keep you safe, but it will keep you speedy.


## Selector

The minimal selector engine supports a limited set of selectors for the sake of performance. More advanced selectors will not be added unless the performance can be upheld. This is the fastest selector engine around, but it will not support css3 selectors (benchmarks available in the repo).

Supported selector types, in order of performance, include:

- ID
- tag
- class
- tag.class
- context (performance depends on scope and main selector type)
- multiple selectors separated by commas
- and that's it!

**Note**: descendants are not allowed, but passing a context can actually improve performance by limiting the scope of the selection.<br>
e.g. `$('div', '#parent')`

#####...more coming soon...