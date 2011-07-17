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
- multiple selectors separated by commas
- context (performance depends on scope and main selector type)
	+ Supported context types
		* Any selector type supported
		* An individual element
		* A minimal object
- and that's it!

###Notes

- Although descendants are not supported, passing a context can actually improve performance by limiting the scope of the selection.<br> e.g. `$('div', '#parent')`
- When passing a context, the main selector should not be an ID. e.g. `$('#child', '#parent')` as IDs should be unique. Minimal does not hide this error.

#####...more coming soon...