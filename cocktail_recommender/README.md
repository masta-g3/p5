## Cocktail

A study on cocktail similarity based on comments from Reddit's *'Not Cocktail of the Week'* threads. These often contain the drinks recipes, history, suggestions on when to enjoy them, and memories from the weekly contributor.

To analyze similarity, I build a word occurrence matrix with all the comments on each thread, and analyze the pairwise resemblance among them. For two cocktails, if their recipes are alike, they share some history, or people tend to talk the same topics when discussing them, then their vector representation will be similar.

Using a python library like TSNE we are able to visualize closeness. I additionally performed a kMeans clustering to find groups of similar cocktails, which are represented by colors. Size indicates the popularity of the drink.
