---
title: "Baking Up the Moxfield of Cookie Run: Braverse"
description: "My foray into building a deck building website"
date: 2024-07-02
cover: cookieruntcg.PNG
# tags:
#   - blog
---

Hello, fellow gamers! As a passionate player and deck builder for trading card games, I've always loved the strategic depth and creativity they offer. When I discovered [Cookie Run: Braverse](https://cookie-run-braverse.fandom.com/wiki/Cookie_Run:_Braverse_Wiki), a game known for its easy to learn yet hard to master gameplay, I was hooked after my first match on [Tabletop Simulator](https://store.steampowered.com/app/286160/Tabletop_Simulator/) using the [Cookie Run: TCG](https://steamcommunity.com/sharedfiles/filedetails/?id=3167369640). However, I noticed a significant gap – there wasn't a deck-building site available for English-speaking users. To address this, I've decided to create a dedicated deck-building website for Cookie Run: Braverse, making it easier for the community to craft their decks and elevate their gameplay experience.

## Breaking the Mold: A Universal Deck Builder for Cookie Run Fans

Since the game has only been released in Korea, the absence of an official English version poses a significant barrier for Western players. They have to use fan translations to understand the game and build their decks, which makes it hard for them to fully enjoy the game. Additionally, the lack of English-language deck-building websites for Cookie Run: Braverse (similar to [Moxfield](https://www.moxfield.com/) or [Archidekt](https://archidekt.com/) for [Magic: the Gathering](https://magic.wizards.com/en)) means that players lack convenient tools to share or copy deck lists. This gap shows the Western community urgently needs a solution. My project aims to address this issue by creating a comprehensive deck-building website that supports both English and Korean, offering essential tools such as card searching, deck exporting, and browsing other players' decks.

## The Current English Deck Building Experience

Let's take a look at what deck building is like for non-Korean speakers/readers and how I aim to address these pain points with my website:

### Building

As mentioned earlier, Cookie Run: Braverse has no official English release. This means the western community must rely on fan translations in order to put together their decks. Currently, the fan translations are accessible via Google Spreadsheets [here](https://docs.google.com/spreadsheets/d/19qYFLkXiL6866nVtp1UQqJtooitc0sfbX14rZGdrwpE/edit?usp=sharing). Deck builders can create their own Google Spreadsheet and copy the cards they want, but this is tedious. My website aims to make card searching as easy as possible by providing its users the ability to search for and view cards in English, Korean, or both.

### Deck sharing/searching

There is currently no widely accepted platform for sharing Cookie Run: Braverse decks, creating a major inconvenience for anyeone searching for decks. Though it is possible to post them on social media, it is not a viable long-term solution, as new posts quickly bury older content, making it increasingly difficult to locate specific decks. This lack of a dedicated, searchable database forces those seeking deck references to directly contact deck builders, leading to time-consuming delays between requesting and receiving deck lists. This highlights the pressing need for a dedicated space where decks can be easily shared and accessed. By building a dedicated site for sharing deck lists, players can keep them easily accessible and searchable. I plan on implementing various search filters and sorting methods such as, but not limited to, searching by deck name, creator name, ordering results by creation date, etc.

### Deck viewing

If the deck list is in English, there are no problems. However, what if you wanted to look at a Korean deck list?
![sample_deck_list](/images/blog/cookie_run_sample_red_deck.png)
As a non-Korean speaker/reader, you would have to find the cards by their images, which would involve trudging through the spreadsheets and checking every single image link. At the time of writing, the western community has 290 fan translated cards. The process of card searching through images will only get worse as new cards are translated. As stated in the "Building" section, the site will give users the ability to view decks and cards in English, Korean, or both. This solution aims to solve language barriers that may deter potential non-Korean speaking players from trying out the game.

Clearly, there are many hurdles non-Korean speaking/reading fans have to jump through just to build their own deck.
My website aims to address the aforementioned pain points by consolidating the tools deck builders use in order to
streamline the deck building experience, while providing support for both English and Korean players.

### Building Bridges and Decks: The Buildspace Advantage

To bring this vision to life, I joined [Buildspace](https://buildspace.so/), a collaborative online platform that offers invaluable resources and support for aspiring developers. Here’s why Buildspace is the perfect environment for my project:

1. **Collaborative Community**: Buildspace allows anyone to pitch their project and receive feedback for free. This can help me refine my ideas and ensure that my website meets the community's needs.
2. **Potential Collaborators**: The platform is a great place to find like-minded individuals who might want to join me in building this deck-building site. I am fully prepared to create the website by myself, but it doesn't hurt to recruit volunteers who can bring different perspectives to the project.
3. **Structured Guidance**: Buildspace offers weekly lectures and labs, providing soft guidance and structure. This can be crucial for maintaining self-discipline and motivation, especially when working on a project of this scale.

In case anyone is wondering, I am House Alterok.

### The Technology Stack

Building a robust and user friendly deck building website requires a solid technology stack. Here’s what I’m using:

1. [**Next.js**](https://nextjs.org/): As an open-source web development framework, Next.js is both flexible and easy to use. My previous experience with this framework makes it an ideal choice for the front-end development of the website, especially considering my relative inexperience in this area.
2. [**ExpressoTS**](https://expresso-ts.com/): This relatively new open-source Node.js framework is designed for creating highly maintainable server-side applications. ExpressoTS aims to streamline the developer experience while remaining flexible. It’s similar to Nest.js but allows for an un-opinionated folder structure, which I find beneficial for organizing my code.
3. [**Supabase**](https://supabase.com/): An open-source backend as a service, Supabase simplifies deployment and offers a managed Postgres database, authentication, and storage. The free tier of Supabase is perfect for my needs, given the small size of the Western Cookie Run: Braverse community. The 50,000 active monthly users limit should be more than sufficient.

By leveraging the resources and community at Buildspace and using a carefully chosen technology stack, I aim to build a deck-building website that will greatly benefit the Western Cookie Run: Braverse community. This project not only addresses a significant gap but also combines my love for the game with my passion for full stack development. I’m excited to see how this journey unfolds and to provide a valuable tool for fellow fans.

If you're interested in joining the Western Cookie Run: Braverse community on Discord, you can find it at https://discord.gg/GYp7BSMXts.
