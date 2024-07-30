---
title: 'Completing the "toy" version of CookieDeck'
description: "Explore the core features and get a sneak peek at what’s coming next!"
date: 2024-07-29
cover: cookiedeck_toy_version_cropped.png
# tags:
#   - blog
---

I'm thrilled to announce that I've completed the "toy" version of CookieDeck, a deck-building website for Cookie Run: Braverse enthusiasts! This initial version looks simple and bare bones, but it contains all the essential functionality required to create and edit deck lists. While there's still a lot of polishing and styling work to do, this milestone marks a significant step towards a fully functional and user-friendly platform. Let’s dive into what’s been built so far and what you can expect as we move forward!

Here is the landing page. It has a search bar that allows users to search for publicly visible decks.
![cookiedeck_landing_page](/images/blog/cookiedeck-toy-blog/landing_page.PNG)

To create a new deck, hover over "Create" in the header, then click "New Deck".
![cookiedeck_landing_page](/images/blog/cookiedeck-toy-blog/landing_page_create_deck.PNG)

This takes us to the deck creation page.
![cookiedeck_landing_page](/images/blog/cookiedeck-toy-blog/create_new_deck.PNG)

There are three settings for visibility: Public, Private, and Unlisted. Setting a deck's visibility to Public means anyone can search for and view the deck. Private decks can only be viewed by the creator of the deck. It will not appear in public deck searches. Finally, Unlisted decks will not appear in public deck searches, but are viewable by anyone. In other words, anyone with a link to an Unlisted deck will be able to view it.

![cookiedeck_landing_page](/images/blog/cookiedeck-toy-blog/visibility.png)

Once a deck has been created, its creator can make add and remove cards from it with the card search bar, as well as the +/- buttons next to each card.

![cookiedeck_landing_page](/images/blog/cookiedeck-toy-blog/deck_view.PNG)

The deck view page also has a switch for swapping between English and Korean card text.
![cookiedeck_landing_page](/images/blog/cookiedeck-toy-blog/deck_view_kr.PNG)

Users can also view their decks by hovering over "Your Stuff" in the header, then clicking "Your Decks".
![cookiedeck_landing_page](/images/blog/cookiedeck-toy-blog/landing_page_your_decks.png)

The "Your Decks" page displays all decks created by the currently logged in user.
![cookiedeck_landing_page](/images/blog/cookiedeck-toy-blog/your_decks.PNG)

To search for decks, users can either search for them from the landing page.
![cookiedeck_landing_page](/images/blog/cookiedeck-toy-blog/landing_page_deck_search.PNG)

Alternatively, they can search for decks in the "Deck Search" page.
![cookiedeck_landing_page](/images/blog/cookiedeck-toy-blog/header_explore_deck_search.png)

Either way, the user will be redirected to the deck search page, where the results of their search will be listed.
![cookiedeck_landing_page](/images/blog/cookiedeck-toy-blog/deck_search.PNG)

The deck search page only allows users to search by deck title for now, but I plan on implementing advanced search options, such as search by creator, search by card in deck, and various sorting options.

You may have noticed two features I did not cover: folders and bookmarks. In the future, I plan on implementing a deck folder feature so users have the option of organizing their decks into folders. As for bookmarks, I will allow users to "bookmark" any deck they are allowed to view for easier access so they don't have to manually search for and find the same deck repeatedly.

Now that the core functionality and logic of the website are in place, the final step before releasing the beta version for public testing is to tackle the styling and design. This is where the hard work of web development truly begins, transforming a functional site into an appealing and intuitive user experience. Stay tuned for more updates as I move closer to the beta launch. Until then, see you later!
