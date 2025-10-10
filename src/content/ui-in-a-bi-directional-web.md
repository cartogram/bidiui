---
---

# UI in a Bidirectional Web

## Introduction

Hi there, my name is Matthew Seccafien. I'm a Canadian front-end developer and designer, living in Berlin. I've spent many years in this industry working on launching my own product Fondfolio with my partner Fiona, and I spent 6 years at Shopify, and over the last 2 of those years I've been working at DeepL on the Design System team.

For anyone who might not know of DeepL, it is a Language AI platform that cut its teeth as a best-in-class translation machine, known best for capturing nuance and human sounding translations, leading it to be the preferred choice over Google Translate across much of Europe.

And I have to say that DeepL was indispensable when Fiona and I moved to Germany as non-German speakers. It continues to be essential for our survival here, which is a big reason I wanted to work there.

One of my first projects at DeepL was transforming our UIs to support right-to-left layouts as we prepared to add Arabic to our platform of 30+ supported languages.

And that's what I'm here to talk about today. I'll take you through why this matters, our strategic approach, and the key learnings you can apply if you ever find yourself supporting right-to-left layouts in your own design or development practice.

You can find these slides and all the resources I mention at bidiui.com. I'm hoping this becomes an ongoing, open resource for UI on a bidirectional web to complement this talk.

So with that, let's get started!

## Why bidiui? The Opportunity, Importance and Scale

Let's start with the why. Why bother supporting RTL at all?

The numbers speak for themselves: 292 million people speak Arabic as their first language. Add 9 million Hebrew speakers and 110 million Persian speakers, and you're looking at over 400 million people who read and write from right to left every single day.

Yet despite this massive audience, RTL support is consistently broken on the web. If you know what to look for, you'll spot errors everywhere—even on sites run by Microsoft and Google. In this example, Google Translate gets the text right, but the logo and product name? They're not mirrored correctly.

Look, I get it—this work is genuinely hard. RTL has been treated as an afterthought since the dawn of the web. But that doesn't make it acceptable.

I highly recommend watching Rami Ismail's video on this topic. He articulates just how inexcusable these errors can feel to native speakers. He also highlights notarabic.com, which catalogs countless examples of botched Arabic script—in major motion pictures, on billboards, in video games, everywhere. It's a very funny and eye-opening talk.

These are exactly the kinds of problems we set out to avoid at DeepL. This project would open our platform to users in 22 new countries and serve markets that were largely underserved by quality translations—which is what DeepL is known for.

Arabic was one of the most requested languages on our platform, not just among RTL languages, but of all languages. Before starting, we did extensive research to understand the mental model of RTL interfaces.

## The Basics of Mirroring Layout

So let's get specific. What are we actually doing when we talk about RTL support?

You can basically think of it as mirroring the layout. Visually, imagine looking at your hands and flipping everything from your left hand to your right hand. Or think of it like holding a mirror up to the website.

This happens because the mental model granted by speaking Arabic is fundamentally different. Now, I don't speak Arabic—some days it feels like I barely speak English, and I'm still learning German—but even learning new German nouns, I notice they can shift how I interpret their meaning. I've heard similar things from friends learning Japanese.

What's interesting about Japanese is that it can be read both vertically and horizontally. The language isn't bound to one flow. Over time, horizontal text became dominant on the web, influenced by Western technology. While vertical text is still used for traditional or literary content, the language was flexible enough to adapt—unlike Arabic, which is structurally bound to right-to-left flow.


It is worth mentioning, however, that there is a movement in Japan to promote vertical text usage on the web, and CSS writing-mode is actively used for this purpose. With this property, we can change the block-flow of specific elements. Where before you'd need to transform-rotate the text, now it's a one-liner. This is a good example of technology adapting to the encoding of different languages.

## Understanding the Visual Qualities of Arabic Text

Now, before we dive deeper, I want to make an important distinction. Everything we've discussed so far with mirroring layouts applies to all RTL languages: Arabic, Hebrew, Persian, Urdu, and others. But what I'm about to cover next is specific to Arabic script, and these next points are about since that's what we were implementing at DeepL. We wouldn't implement these with the dir attribute, but the lang attribute since these are language specific considerations.

Also keep in mind, again, this is coming from a non-speaker. I want to recommend again the Rami Ismail talk if you want to learn more about the basics.

First, Arabic is a cursive script. Letters connect to each other and have different forms depending on their position in a word. The writing system is rigid and structurally dependent on horizontal right-to-left flow.

This connectivity breaks if letter-spacing is anything other than zero. So step 1 is do not use letter-spacing—it makes text illegible.

We also need to treat Arabic words as unbreakable units. You can't break words with hyphens across multiple lines like you can in English. So step 2, don't override word-break or set it to auto-phrase, which provides additional improvements, especially for ​​Japanese.

Arabic text is generally more compact than English because connector words like "and" are often a single letter attached to the following word. Though the rigid structure doesn't always mean it takes less space overall.

Numbers, however, are always written left-to-right just as they appear in English. And while there are Hindi numerals, Arabic numerals are more widely used. So a phone number will appear the same in English.

When it comes to line height, you need to be careful. Decreasing line-height can cause diacritics and dots below characters to appear cut off or overlapping. In general, you'll need to increase line-height by 25% to give these adequate vertical space. It's a taller language.

There's a similar issue with text underlines. The underline can interrupt letterforms in ways that make them difficult to read. This happens in English too, but unlike English where we can still make out the word, in Arabic it can cover critical visual information.

The solution is simple: use `text-decoration-skip-ink: all`. Browsers are converging on this as the default.

A few character differences exist also in punctuation, which was a modern addition to Arabic, where commas point up instead of down, and question marks are flipped. We needed to accommodate the typographic characteristics of Arabic by choosing a different font. At DeepL, we use Noto, which is a common choice for Arabic text.

So that was the crash course of Arabic from a UI perspective and its help context as we get into the next sections to understand a little more of what it means to think in Arabic.

## Getting Directional

So the most important first thing is to set the `dir` and `lang` attribute on the HTML. The `dir` will inform the browser of the document flow. The default ltr, meaning left-to-right and we can set it to rtl or auto, which allows you to leave it up to the browser to parse the characters and use a best guess at the directionality. Generally this is not recommended.

You can see the browser does a lot of work for us! Text and elements rearrange themselves for the different directions.

- The default text alignment changed to right
- Native form elements such as Inputs and textareas as well as Checkboxes and Selectboxes
- Inline, flex and grid flows will flip according to the page direction

This is because when dir attribute was first incorporated into HTML 4.0 in the late 90s (back at a brief time where we had versions of HTML), it came with a design philosophy that the layout direction was considered a content property, not a presentation concern.

So while you can also achieve the same effects with the `direction` property in CSS, we never used this at DeepL because it is generally not recommended. The idea is that this information should remain in the markup, not the stylesheet.

This gets more complicated at DeepL because we deal with mixed content. A user might be using the application in one language while translating text into a language with the opposite direction.

There are at least four different states:
- UI in English, translating to Arabic
- UI in English, translating from Arabic
- UI in Arabic, translating to other languages
- UI in Arabic, translating from other languages

So we rely on the global direction attribute as much as possible. Since this attribute can be set on any subset of markup in the HTML document, we can override it in our interface to accommodate these different states.

> Text direction isn't a stylesheet preference. It's baked into the fundamental structure of writing systems.

This reinforces the idea that text direction isn't just a stylesheet preference. It's baked into the fundamental structure of writing systems. Our goal was to allow developers to write direction-agnostic code that automatically adapts based on HTML dir attributes.

## Styling with Logical CSS

So what doesn't flip automatically, and what do we do about it?

For starters, floats, absolute and fixed positions, margins, and padding all need to be written using direction-agnostic properties.

These properties were not originally designed with bi-directionality in mind and rely on physical (left, right, top, bottom) rather than logical properties (start, end, inline, block). If you've been writing CSS since the zen garden, it can take time to unwind and reprogram the muscle memory of writing "left" and "right" and instead writing "start" and "end".

Luckily the mapping from physical to logical is pretty straightforward. If we use text-align as an example, and want to change the alignment to the right, rather than using the physical property "right" we can use the direction agnostic property "end" instead. This will adapt to the direction of the layout.


