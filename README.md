# Codefocus Extension For Quarto

This extension is a (jankily made) implementation of [reveal-code-focus](https://github.com/bnjmnt4n/reveal-code-focus). I stripped somethings out of it, and then tried to make sure it would still work with the original line-highlight plugin. 

See [the demo](https://reuning.github.io/codefocus/example.html).

## Installing

```bash
quarto add reuning/codefocus
```

This will install the extension under the `_extensions` subdirectory.
If you're using version control, you will want to check in this directory. 

## Using

If you want to highlight and explain specific pieces of code as you go through it you'll include the explanations in `fragments` under the code. For example:


````
---
title: "Codefocus Example"
format:
  revealjs: default
revealjs-plugins:
  - codefocus
execute:
  echo: true
---

```{r}
vector <- c(1,2,3)
vector <- sample(vector)
sum(vector)
```

::: {.fragment .current-only data-code-focus="1"}
When this fragment is shown, the first line of code will have the `focus` class added to it and it gets highlighted.
:::
````

In addition, `.current-only` will make the fragment disappear when you move into other fragments. 

## Example

Here is the source code for a minimal example: [example.qmd](example.qmd) and the [Revealjs presentation](https://reuning.github.io/codefocus/example.html)

Thanks also to [shafayetShafee](https://github.com/shafayetShafee/codefocus).
