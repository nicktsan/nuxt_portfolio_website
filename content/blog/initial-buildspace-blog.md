---
title: "Baking Up the Moxfield of Cookie Run: Braverse"
description: "My foray into building a deck building website"
date: 2024-07-02
cover: cookieruntcg.PNG
# tags:
#   - blog
---

Hi. I like trading card games. I also like building decks for trading card games. When I first heard of [Cookie Run: Braverse](https://cookie-run-braverse.fandom.com/wiki/Cookie_Run:_Braverse_Wiki), it was described to me as a game that was easy to pick up, but difficult to master, as there are a myriad of decisions players make at nearly every point in the game. My first game on [Tabletop Simulator](https://store.steampowered.com/app/286160/Tabletop_Simulator/) with the [Cookie Run: TCG](https://steamcommunity.com/sharedfiles/filedetails/?id=3167369640) mod hooked me in, and I've enjoyed playing ever since.

## Breaking the Mold: A Universal Deck Builder for Cookie Run Fans

The game lacks an official English release. This creates a significant barrier for Western players who rely on fan translations to navigate the game and build their decks. Moreover, there are no English deck-building websites (like [Moxfield](https://www.moxfield.com/) or [Archidekt](https://archidekt.com/)) for Cookie Run: Braverse, leaving players without convenient tools to share or copy deck lists. This is the problem I aim to solve with my project—a comprehensive deck-building website that supports both English and Korean, offering much-needed tools like card searching, deck exporting, and browsing other players' decks.

## The Current English Deck Building Experience

Let's take a look at what deck building is like for non-Korean speakers/readers.

### Building

Cookie Run: Braverse has no official English release. This means the western community must rely on fan translations in order to put together their decks. Currently, the fan translations are accessible via Google Spreadsheets [here](https://docs.google.com/spreadsheets/d/19qYFLkXiL6866nVtp1UQqJtooitc0sfbX14rZGdrwpE/edit?usp=sharing). Deck builders can create their own Google Spreadsheet and copy the cards they want, but this is cumbersome.

### Deck sharing/searching

There is no widely accepted place to share Cookie Run: Braverse decks. This means if you want to post your deck lists publicly, you would have to do so through social media, which will eventually become difficult to search for as new posts make it more obscure. As for those looking for decks to reference, the lack of a consolidated database means those searching for decks will most likely have to directly contact a deck builder and ask them to share their list. The delay between requesting a deck list and receiving it significantly slows down the entire process.

### Deck viewing

If the deck list is in English, there are no problems. However, what if you wanted to look at a Korean deck list?
![sample_deck_list](/images/blog/cookie_run_sample_red_deck.png)
As a non-Korean speaker, you would have to find the cards by their images. At the time of writing, the western community has 290 fan translated cards. The process of card searching through images will only get worse as new cards are translated.

Clearly, there are many hurdles non-Korean speaking/reading fans have to jump through just to build their own deck.
My website aims to address the aforementioned pain points by consolidating the tools deck builders use in order to
streamline the deck building experience, while providing support for both English and Korean.

### Building Bridges and Decks: The Buildspace Advantage

To bring this vision to life, I joined [Buildspace](https://buildspace.so/), a collaborative online platform that offers invaluable resources and support for aspiring developers. Here’s why Buildspace is the perfect environment for my project:

1. **Collaborative Community**: Buildspace allows anyone to pitch their project and receive feedback for free. This collaborative spirit can help me refine my ideas and ensure that my website meets the community's needs.
2. **Potential Collaborators**: The platform is a great place to find like-minded individuals who might want to join me in building this deck-building site. I am fully prepared to create the website by myself, but it doesn't hurt to recruit volunteers who can accelerate development and bring diverse perspectives to the project.
3. **Structured Guidance**: Buildspace offers weekly lectures and labs, providing soft guidance and structure. This can be crucial for maintaining self-discipline and motivation, especially when working on a project of this scale.

In case anyone is wondering, I am House Alterok.

### The Technology Stack

Building a robust and user-friendly deck-building website requires a solid technology stack. Here’s what I’m using:

1. [**Next.js**](https://nextjs.org/): As an open-source web development framework, Next.js is both flexible and easy to use. My previous experience with this framework makes it an ideal choice for the front-end development of the website, especially considering my relative inexperience in this area.
2. [**ExpressoTS**](https://expresso-ts.com/): This relatively new open-source Node.js framework is designed for creating highly maintainable server-side applications. ExpressoTS aims to streamline the developer experience while remaining flexible. It’s similar to Nest.js but allows for an un-opinionated folder structure, which I find beneficial for organizing my code.
3. [**Supabase**](https://supabase.com/): An open-source backend as a service, Supabase simplifies deployment and offers a managed Postgres database, authentication, and storage. The free tier of Supabase is perfect for my needs, given the small size of the Western Cookie Run: Braverse community. The 50,000 active monthly users limit should be more than sufficient.

By leveraging the resources and community at Buildspace and using a carefully chosen technology stack, I aim to build a deck-building website that will greatly benefit the Western Cookie Run: Braverse community. This project not only addresses a significant gap but also combines my love for the game with my passion for full stack development. I’m excited to see how this journey unfolds and to provide a valuable tool for fellow fans.

If you're interested in joining the Western Cookie Run: Braverse community on Discord, you can find it at https://discord.gg/GYp7BSMXts.
