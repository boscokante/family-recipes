import { db } from '../db'
import { recipes } from '../db/schema'
import { sql } from 'drizzle-orm'

// All extracted recipes from images
const allRecipes = [
  {
    title: "Fogo De Chao Copycat Brazilian Cheese Puff Bread Recipe (Cow Milk Free)",
    slug: "fogo-de-chao-copycat-brazilian-cheese-puff-bread-cow-milk-free",
    description: "A cow milk-free version of the famous Brazilian cheese puffs, using cashew milk and goat-based dairy.",
    story: "",
    servings: 24,
    prepTime: 10,
    cookTime: 15,
    ingredients: [
      { amount: "2 cups", name: "tapioca flour", notes: "" },
      { amount: "1/4 cup", name: "cashews", notes: "" },
      { amount: "3/4 cup", name: "water", notes: "" },
      { amount: "1/2 cup", name: "Meyenberg's goat butter", notes: "1 stick" },
      { amount: "1 teaspoon", name: "salt", notes: "" },
      { amount: "5 oz", name: "goat cheddar cheese", notes: "finely shredded" },
      { amount: "2", name: "eggs", notes: "at room temperature" },
      { amount: "2 teaspoons", name: "sugar", notes: "" },
      { amount: "1 tablespoon", name: "olive oil", notes: "" },
      { amount: "", name: "Cooking spray", notes: "" }
    ],
    instructions: [
      "Preheat Oven: Preheat your oven to 350°F (175°C). Grease the inside of a mini muffin tin with cooking spray.",
      "Prepare Cashew Milk: Blend the 1/4 cup cashews with 3/4 cup water in a high-speed blender until smooth. This will replace the oat milk.",
      "Melt Butter and Cheese: In a microwave-safe bowl, combine the goat butter and shredded goat cheddar cheese. Microwave in short intervals (15-20 seconds), stirring in between until the butter and cheese are melted but not overheated so as not to cook eggs!",
      "Blend All Ingredients: Add the melted butter and cheese mixture, cashew milk, salt, eggs, sugar, and olive oil to the blender. Blend until well combined.",
      "Mix Flour: Add the tapioca flour to the blender and blend until you achieve a thick milkshake/pancake batter consistency.",
      "Fill Muffin Tins: Spoon the dough into individual muffin tins, filling them about 1/2 full.",
      "Bake: Bake for 15 minutes. The puffs will start to rise out of the tin and will be golden brown on the tops.",
      "Serve: Serve while warm. Enjoy!"
    ],
    category: "appetizer",
    cuisine: "Brazilian",
    contributedBy: ""
  },
  {
    title: "Golden Milk",
    slug: "golden-milk",
    description: "A warm, spiced nut milk drink made with turmeric, ginger, and cinnamon.",
    story: "",
    servings: 1,
    prepTime: 5,
    cookTime: 0,
    ingredients: [
      { amount: "1/2 cup", name: "cashews", notes: "" },
      { amount: "1 teaspoon", name: "ground turmeric", notes: "" },
      { amount: "1/2 teaspoon", name: "ground cinnamon", notes: "" },
      { amount: "1/4 teaspoon", name: "ground ginger", notes: "or 1/2 teaspoon fresh grated ginger" },
      { amount: "1 pinch", name: "freshly ground black pepper", notes: "about 1/16 teaspoon" },
      { amount: "3 tablespoons", name: "maple syrup", notes: "" },
      { amount: "1/2 teaspoon", name: "vanilla extract", notes: "" },
      { amount: "2.5 cups", name: "filtered water", notes: "" }
    ],
    instructions: [
      "USE CHEFWAVE nut milk maker or blend with 2.5 cups filtered water."
    ],
    category: "drink",
    cuisine: "Indian-inspired",
    contributedBy: "ChefWave"
  },
  {
    title: "Brazilian Cheese Biscuit",
    slug: "brazilian-cheese-biscuit",
    description: "Traditional Brazilian cheese bread (Pão de Queijo) made with tapioca flour and parmesan or cotija cheese.",
    story: "",
    servings: 24,
    prepTime: 10,
    cookTime: 15,
    ingredients: [
      { amount: "2 cups", name: "tapioca flour", notes: "" },
      { amount: "1 cup", name: "whole milk", notes: "" },
      { amount: "1/2 cup", name: "unsalted butter", notes: "" },
      { amount: "1 teaspoon", name: "salt", notes: "" },
      { amount: "5 oz", name: "Parmesan or Cotija cheese", notes: "finely shredded" },
      { amount: "2", name: "eggs", notes: "at room temperature" },
      { amount: "2 teaspoons", name: "sugar", notes: "" },
      { amount: "1 tablespoon", name: "olive oil", notes: "" },
      { amount: "", name: "Cooking Spray", notes: "" }
    ],
    instructions: [
      "Preheat oven to 350 degrees. Grease the inside of a mini muffin tin."
    ],
    category: "appetizer",
    cuisine: "Brazilian",
    contributedBy: ""
  },
  {
    title: "Chipotle Aioli - Smoky & Spicy Homemade Chipotle Mayo",
    slug: "chipotle-aioli-smoky-spicy-homemade-chipotle-mayo",
    description: "A delicious spicy and smoky homemade chipotle mayo that puts prepackaged sauces to shame.",
    story: "",
    servings: 8,
    prepTime: 10,
    cookTime: 0,
    ingredients: [
      { amount: "1/2 cup", name: "light olive oil", notes: "or other neutral flavored oil" },
      { amount: "1", name: "egg yolk", notes: "or 1/4 cup / 2 egg yolks as per handwritten note" },
      { amount: "2", name: "chipotle peppers", notes: "in adobo sauce" },
      { amount: "1/3", name: "lemon", notes: "juice of" },
      { amount: "2 cloves", name: "roasted garlic", notes: "raw also works" },
      { amount: "1/8 teaspoon", name: "salt", notes: "" },
      { amount: "1/8 teaspoon", name: "black pepper", notes: "" },
      { amount: "1/8 teaspoon", name: "cumin", notes: "" },
      { amount: "1/8 teaspoon", name: "paprika", notes: "" }
    ],
    instructions: [
      "Juice the 1/3 of a lemon, remove the roasted garlic from it's skin, and add to a food processor.",
      "Add the chipotle peppers, roasted garlic, and all of the spices into a food processor.",
      "Give the mixture a quick 2-3 second blitz in the food processor just to break things down.",
      "Turn on the food processor and SLOWLY add in the oil. It is very important to add it slowly to prevent separating from the egg yolk.",
      "After you have added all of the oil, turn the food processor off and unplug.",
      "Plug the food processor back in and blitz again for about 20 seconds."
    ],
    category: "side",
    cuisine: "Mexican-inspired",
    contributedBy: "Simply Elegant Home Cooking"
  },
  {
    title: "Bosko's Gluten & Dairy Free Biscuits",
    slug: "boskos-gluten-and-dairy-free-biscuits",
    description: "Big fluffy gluten and dairy free biscuits that use refined coconut oil as a butter substitute.",
    story: null,
    servings: 6,
    prepTime: 25,
    cookTime: 15,
    ingredients: [
      { amount: "280 grams (2 cups)", name: "gluten-free girl all-purpose gluten-free flour blend", notes: "30% sweet rice, 30% potato starch, 40% Millet by weight" },
      { amount: "1 teaspoon", name: "Xanthan Gum", notes: "" },
      { amount: "1 Tablespoon", name: "baking powder", notes: "" },
      { amount: "1 1/2 teaspoons", name: "kosher salt", notes: "" },
      { amount: "115 grams (8 tablespoons)", name: "REFINED COCONUT OIL", notes: "cold" },
      { amount: "3/4 cup", name: "ALMOND MILK", notes: "" },
      { amount: "1/4 cup", name: "NON-DAIRY yogurt", notes: "" },
      { amount: "2 tablespoons", name: "REFINED COCONUT OIL", notes: "melted" }
    ],
    instructions: [
      "Combine the dry ingredients. Whisk together the flour, Xanthan Gum, baking powder, and salt in a large mixing bowl. Put the bowl in the freezer.",
      "Cut the Coconut Oil into 1/2-inch cubes with a knife. Put the Coconut Oil into the freezer too.",
      "Heat the oven to 425°. Grease a 9-inch cast-iron skillet with Coconut Oil.",
      "When the oven has been at heat for 10 minutes, take the mixing bowl and Coconut Oil out of the freezer. Dump the Coconut Oil cubes on top. Cut together with a hand pastry blender, quickly, until the Coconut Oil chunks are about the size of lima beans.",
      "Make a well in the center of the flour and Coconut Oil mixture. Mix together 1/3 cup of the Almond Milk and all of the yogurt, then pour them into the dry ingredients.",
      "Gently stir the liquids with a rubber spatula, in small circular motions, incorporating the flour in as you go. The final dough should just barely hold together, with all the ingredients moist (not wet!). If there is a bit of flour left on the sides of the bowl, add a dribble more of the Almond Milk.",
      "Sprinkle a little flour on a clean board. Turn out the dough and sprinkle with just a touch more flour. Fold the dough in half, bringing the back part toward you. Pat into an even round. Turn 90 degrees, fold and pat again. Repeat a third time to make dough fairly even. Pat to 1 inch thickness.",
      "Dip a 2 1/2-inch biscuit cutter into flour and push straight down into the dough. Do not twist the cutter."
    ],
    category: "side",
    cuisine: "American",
    contributedBy: "Bosko"
  },
  {
    title: "Bosko's Heckagood Gluten and Dairy Free Pancakes",
    slug: "boskos-heckagood-gluten-and-dairy-free-pancakes",
    description: "Thick and fluffy gluten-free pancakes that can also be adapted for waffles by doubling the fat.",
    story: null,
    servings: 16,
    prepTime: 10,
    cookTime: 15,
    ingredients: [
      { amount: "2 large", name: "eggs", notes: "" },
      { amount: "4 Tablespoons", name: "Goat Butter", notes: "double for waffles; can substitute Earth Balance or coconut oil" },
      { amount: "2 cups", name: "ALMOND/Oat/Cashew milk", notes: "Fresh Cashew or Chobani Oatmilk recommended" },
      { amount: "1 teaspoon", name: "gluten-free vanilla extract", notes: "" },
      { amount: "2 1/2 cups (300 grams)", name: "Bob's Red Mill Gluten Free All Purpose Flour", notes: "" },
      { amount: "2 Tablespoons", name: "granulated sugar", notes: "" },
      { amount: "1 1/2 teaspoons", name: "baking powder", notes: "" },
      { amount: "3/4 teaspoon", name: "salt", notes: "" },
      { amount: "3/8 teaspoon", name: "gluten free xanthan gum", notes: "double if using flour without xanthan gum" }
    ],
    instructions: [
      "Whisk together the eggs, melted butter or oil, milk, and vanilla.",
      "In a separate bowl, whisk together the dry ingredients. Stir in the egg mixture.",
      "Preheat the griddle to medium (350°F), greasing it lightly.",
      "Scoop the batter by 1/4-cupfuls onto the griddle. Note: The batter will be much thicker than wheat flour batter and will not spread; you may need to spread it out a little with a spoon.",
      "Cook for 1 to 2 minutes, until the tops lose their shine and bottoms are golden brown. Flip and cook for 1 to 2 minutes on the other side.",
      "To make waffles: Prepare the batter as directed but add extra fat to help make them crisp. Cook according to waffle iron directions."
    ],
    category: "main",
    cuisine: "American",
    contributedBy: "Bosko"
  },
  {
    title: "Beignets",
    slug: "beignets",
    description: "Classic French Quarter style beignets from Tyler Florence's Ultimate French Quarter episode.",
    story: null,
    servings: 12,
    prepTime: 29,
    cookTime: 15,
    ingredients: [
      { amount: "3/4 cups", name: "warm water", notes: "" },
      { amount: "1 packet", name: "active dry yeast", notes: "" },
      { amount: "1/4 cup plus a pinch", name: "granulated sugar", notes: "" },
      { amount: "Pinch", name: "kosher salt", notes: "" },
      { amount: "1 large", name: "egg", notes: "" },
      { amount: "1/2 cup", name: "evaporated milk", notes: "" },
      { amount: "4 cups", name: "all-purpose flour", notes: "plus more as needed" },
      { amount: "2 tablespoons", name: "vegetable shortening", notes: "" },
      { amount: "as needed", name: "Butter", notes: "" },
      { amount: "as needed", name: "Vegetable oil", notes: "for deep frying" },
      { amount: "1 cup", name: "powdered sugar", notes: "for dusting" }
    ],
    instructions: [
      "Begin by activating the yeast. In the bowl of a stand mixer, add warm water, yeast, and a pinch of sugar. Set aside until dissolved, about 10 minutes.",
      "Add 1/4 cup sugar, salt, egg, and evaporated milk to the bowl. With the mixer on low, add half the flour and mix until combined.",
      "Add shortening and gradually add remaining flour until dough forms a mass. Turn onto a floured surface and knead until you have an even, medium-textured dough.",
      "Place dough in a large buttered bowl, cover with plastic wrap, and let rest for at least 3 to 4 hours or overnight in the refrigerator.",
      "Gently turn rested dough onto a floured surface. Shape into a 1-inch thick rectangle and cut into squares using a sharp knife or pizza cutter.",
      "Preheat oven to 250°F to keep finished beignets warm.",
      "Heat 3 inches of oil in a heavy-based pot to 350°F. Fry beignets in batches for about 3 minutes, turning to brown evenly.",
      "Remove to a paper towel-lined sheet pan, then transfer to a serving platter and dust generously with powdered sugar."
    ],
    category: "dessert",
    cuisine: "French",
    contributedBy: "Tyler Florence"
  },
  {
    title: "Mochi Donuts",
    slug: "mochi-donuts",
    description: "Chewy, bouncy donuts made with sticky rice flour, including options for chocolate and matcha glazes.",
    story: null,
    servings: 12,
    prepTime: 30,
    cookTime: 10,
    ingredients: [
      { amount: "1/4 cup", name: "sticky rice flour", notes: "Erawan brand recommended (Starter Dough)" },
      { amount: "3 tbsp", name: "milk", notes: "(Starter Dough)" },
      { amount: "2 cups", name: "sticky rice flour", notes: "(Main Donut)" },
      { amount: "1 tsp", name: "baking powder", notes: "" },
      { amount: "1/2 cup", name: "milk", notes: "(Main Donut)" },
      { amount: "1/4 cup", name: "sugar", notes: "" },
      { amount: "1", name: "egg", notes: "" },
      { amount: "2 1/2 Tbsp", name: "Goat Milk butter", notes: "melted" },
      { amount: "1 1/2 tsp", name: "cocoa powder", notes: "optional" },
      { amount: "1/2 tsp", name: "matcha powder", notes: "optional" },
      { amount: "1 cup", name: "powdered sugar", notes: "for glaze" },
      { amount: "1/8 cup", name: "milk", notes: "for glaze" }
    ],
    instructions: [
      "Combine 1/4 cup sticky rice flour and 3 tbsp milk for the starter. Microwave for 15 seconds, stir, and repeat until it becomes a sticky blob.",
      "In a separate bowl, whisk the eggs with sugar and 1/2 cup milk.",
      "In another bowl, whisk 2 cups rice flour with baking powder. Add melted butter and the egg mixture.",
      "Add the starter dough to the main mixture. Use a stand mixer with a paddle attachment to mix until the dough is bouncy and pulls away from the wall.",
      "Shape and fry (or bake as per linked video instructions).",
      "For the glaze: Whisk 1 cup powdered sugar with 1/8 cup milk, a smidge of salt, and a drop of vanilla.",
      "For chocolate glaze: Mix 1/4 cup powdered sugar, 1 tbsp cocoa powder, and 1 tbsp milk.",
      "For matcha glaze: Mix 1/4 tsp matcha with 2 tbsp powdered sugar and 1 tbsp milk."
    ],
    category: "dessert",
    cuisine: "Japanese-American",
    contributedBy: "Modest Motley"
  },
  {
    title: "Chinese Sausage and Chicken Rice",
    slug: "chinese-sausage-and-chicken-rice",
    description: "A classic one-pot dish featuring savory Chinese sausage, dried shiitake mushrooms, and marinated chicken.",
    story: "",
    servings: null,
    prepTime: null,
    cookTime: null,
    ingredients: [
      { amount: "10 oz", name: "long grain rice", notes: "such as Thai jasmine, or preferred" },
      { amount: "2 links", name: "Chinese sausage", notes: "" },
      { amount: "1 oz", name: "dried shiitake mushroom", notes: "" },
      { amount: "1 piece", name: "chicken breast", notes: "" },
      { amount: "1 piece", name: "bone-in chicken thigh", notes: "" },
      { amount: "1", name: "shallot", notes: "" },
      { amount: "1 tbsp", name: "ginger", notes: "" },
      { amount: "2 stalks", name: "scallions", notes: "" },
      { amount: "1 tbsp", name: "Kikkoman® Soy Sauce", notes: "Chicken Marinade" },
      { amount: "2 tbsp", name: "Kikkoman® Oyster Sauce", notes: "Chicken Marinade" },
      { amount: "0.50 tsp", name: "salt", notes: "Chicken Marinade" },
      { amount: "1 tsp", name: "sugar", notes: "Chicken Marinade" },
      { amount: "1 tbsp", name: "cornstarch", notes: "Chicken Marinade" },
      { amount: "3 tbsp", name: "water", notes: "Chicken Marinade" },
      { amount: "1 tsp", name: "cooking wine", notes: "Chicken Marinade" },
      { amount: "0.25 tsp", name: "white pepper", notes: "Chicken Marinade" },
      { amount: "1 tbsp", name: "oil", notes: "Chicken Marinade" },
      { amount: "1 tbsp", name: "Kikkoman® Sesame Oil", notes: "Chicken Marinade" },
      { amount: "0.50 tbsp", name: "Kikkoman® Oyster Sauce", notes: "Shiitake Mushroom Marinade" },
      { amount: "1 tsp", name: "sugar", notes: "Shiitake Mushroom Marinade" },
      { amount: "0.50 tsp", name: "cornstarch", notes: "Shiitake Mushroom Marinade" },
      { amount: "1 tbsp", name: "Kikkoman® Oyster Sauce", notes: "Serving Sauce" },
      { amount: "1 tsp", name: "Kikkoman® Soy Sauce", notes: "Serving Sauce" },
      { amount: "1 tsp", name: "Kikkoman® Tamari Soy Sauce", notes: "Serving Sauce" },
      { amount: "1 tsp", name: "sugar", notes: "Serving Sauce" },
      { amount: "1 tsp", name: "oil", notes: "Cooking Ingredients" },
      { amount: "11 oz", name: "boiling water", notes: "Cooking Ingredients" },
      { amount: "2 tbsp", name: "oil", notes: "Cooking Ingredients" }
    ],
    instructions: [],
    category: "main",
    cuisine: "Chinese",
    contributedBy: ""
  },
  {
    title: "Summer Berry Crisp",
    slug: "summer-berry-crisp",
    description: "Juicy berries are marvelous nestled under a crispy top. This dessert is easy enough for a beginning baker to make and serve with pride.",
    story: "By Sheila Lukins, Parade July 2007.",
    servings: 6,
    prepTime: 15,
    cookTime: 60,
    ingredients: [
      { amount: "2 cups", name: "blueberries", notes: "" },
      { amount: "2 cups", name: "blackberries", notes: "" },
      { amount: "2 cups", name: "raspberries", notes: "" },
      { amount: "1/4 cup", name: "sugar", notes: "" },
      { amount: "1/4 cup", name: "all-purpose flour", notes: "" },
      { amount: "1/4 teaspoon", name: "cinnamon", notes: "" },
      { amount: "1 cup", name: "rolled oats", notes: "Crisp topping" },
      { amount: "1/2 cup", name: "all-purpose flour", notes: "Crisp topping" },
      { amount: "1/2 cup", name: "brown sugar", notes: "Crisp topping" },
      { amount: "1/2 cup", name: "sugar", notes: "Crisp topping" },
      { amount: "Pinch", name: "salt", notes: "Crisp topping" },
      { amount: "1/2 cup (1 stick)", name: "cold unsalted butter", notes: "cut into small pieces" },
      { amount: "optional", name: "Whipped cream or vanilla ice cream", notes: "for serving" }
    ],
    instructions: [
      "Preheat the oven to 350°F. Butter a 9-inch Pyrex pie plate.",
      "Gently combine the berries with the sugar, flour and cinnamon; place in the prepared pie plate.",
      "Prepare the topping: Combine the oats, flour, both sugars and salt in a bowl. Use a pastry blender or 2 knives to work in the butter until topping resembles coarse meal. Sprinkle evenly over the berries.",
      "Place the pie plate on a baking sheet. Bake in the center of the oven until the fruit is bubbling and the topping is golden brown, about 1 hour. Remove the crisp to a rack to cool slightly. Serve in dessert bowls with whipped cream or ice cream."
    ],
    category: "dessert",
    cuisine: "American",
    contributedBy: "Sheila Lukins"
  },
  {
    title: "Ghanaian Chicken and Peanut Stew (Groundnut Soup)",
    slug: "ghanaian-chicken-and-peanut-stew",
    description: "Peanut butter and tomatoes lend a rich and creamy backdrop to this simple, hearty Ghanaian chicken stew.",
    story: "Inspired by Sara'o Maozac's story 'East, West, Then Backward: Falling for Groundnut Soup in Ghana.'",
    servings: 6,
    prepTime: 15,
    cookTime: 45,
    ingredients: [
      { amount: "2 medium", name: "yellow onions", notes: "about 12 ounces; 340g, halved and ends trimmed, divided" },
      { amount: "2 cups (480ml)", name: "chicken broth", notes: "homemade or store-bought low-sodium, plus more as needed, divided" },
      { amount: "5 medium cloves", name: "garlic", notes: "divided" },
      { amount: "1 ounce (28g)", name: "fresh ginger", notes: "about 1-inch knob, divided" },
      { amount: "2 tablespoons", name: "tomato paste", notes: "" },
      { amount: "2 pounds (900g)", name: "skin-on chicken legs", notes: "halved into drumsticks and thighs" },
      { amount: "1", name: "hot pepper", notes: "such as bird's eye, habanero, or Scotch bonnet" },
      { amount: "2", name: "bay leaves", notes: "" },
      { amount: "1 cup (9 oz)", name: "creamy peanut butter", notes: "Natural, unsweetened preferred" },
      { amount: "1 (28-ounce) can", name: "plum tomatoes", notes: "with their juices" },
      { amount: "1 whole", name: "smoke-dried fish", notes: "Optional, such as tilapia or snapper" }
    ],
    instructions: [
      "In a blender, purée 2 onion halves, 1/2 cup (120ml) chicken stock, 3 garlic cloves, 1/2 ounce ginger, and tomato paste. In a Dutch oven, combine chicken legs with purée, remaining onion halves, remaining 1/2 ounce ginger, and remaining 2 cloves garlic, along with hot pepper and bay leaves. Toss to coat.",
      "Set Dutch oven over medium heat and bring to a simmer, then cover, reduce heat to low, and cook until halved onion is soft and translucent, about 20 minutes. Add an extra 1/2 cup (120ml) chicken stock if mixture begins to stick to the bottom of the pot.",
      "Transfer chunks of onion, ginger, garlic cloves, and hot pepper to blender. Add peanut butter, canned tomatoes and their juices, and remaining 1 1/2 cups (360ml) chicken stock and purée until smooth. Pass blended mix through a fine-mesh strainer into the Dutch oven, stirring to incorporate.",
      "Increase heat to medium and bring to a simmer, then lower heat to medium-low and cook, stirring occasionally, until chicken is tender, oils have surfaced, and mixture has thickened and reduced by about one-third, about 40 minutes. Add smoked fish, reduce heat to low, cover pot, and cook an additional 5 minutes (omit smoked fish for a 5-minute shorter cooking step). Remove and serve with rice or fufu."
    ],
    category: "main",
    cuisine: "Ghanaian",
    contributedBy: "Niki Achitoff-Gray"
  },
  {
    title: "Sweet Potato Pie",
    slug: "sweet-potato-pie",
    description: "A traditional Southern-style sweet potato pie with a creamy, spiced filling.",
    story: "",
    servings: 8,
    prepTime: null,
    cookTime: null,
    ingredients: [
      { amount: "1 (1 pound)", name: "sweet potato", notes: "" },
      { amount: "1/2 cup", name: "butter", notes: "softened" },
      { amount: "1 cup", name: "white sugar", notes: "" },
      { amount: "1/2 cup", name: "milk", notes: "" },
      { amount: "2", name: "eggs", notes: "" },
      { amount: "1/2 teaspoon", name: "ground nutmeg", notes: "" },
      { amount: "1/2 teaspoon", name: "ground cinnamon", notes: "" },
      { amount: "1 teaspoon", name: "vanilla extract", notes: "" },
      { amount: "1 (9 inch)", name: "unbaked pie crust", notes: "" }
    ],
    instructions: [],
    category: "dessert",
    cuisine: "American",
    contributedBy: ""
  },
  {
    title: "Custard Pie",
    slug: "custard-pie",
    description: "A classic egg custard pie with a smooth, velvety texture and a hint of nutmeg.",
    story: "",
    servings: 8,
    prepTime: null,
    cookTime: null,
    ingredients: [
      { amount: "1 (9 inch)", name: "unbaked pie crust", notes: "" },
      { amount: "4 large", name: "eggs", notes: "" },
      { amount: "3/4 cup", name: "sugar", notes: "" },
      { amount: "1/4 teaspoon", name: "salt", notes: "" },
      { amount: "1 teaspoon", name: "vanilla", notes: "" },
      { amount: "1 cup", name: "heavy cream", notes: "" },
      { amount: "1 1/2 cups", name: "milk", notes: "" },
      { amount: "1/4 teaspoon", name: "nutmeg", notes: "" }
    ],
    instructions: [],
    category: "dessert",
    cuisine: "American",
    contributedBy: ""
  },
  {
    title: "Bosko's Truffle Mac N Cheese 2021",
    slug: "boskos-truffle-mac-n-cheese-2021",
    description: "A rich and decadent truffle-infused macaroni and cheese featuring goat-based dairy products.",
    story: "Bosko's personal take on Tyler Florence's classic recipe, modified in 2021 to use goat butter and cheeses, with handwritten notes suggesting a possible cashew-based variation.",
    servings: 6,
    prepTime: 15,
    cookTime: 30,
    ingredients: [
      { amount: "4 cups (1 pound)", name: "elbow macaroni", notes: "" },
      { amount: "5 tablespoons", name: "Goat butter", notes: "" },
      { amount: "4 cups", name: "milk", notes: "" },
      { amount: "1/2", name: "medium onion", notes: "stuck with 1 clove" },
      { amount: "4 cloves", name: "garlic", notes: "Handwritten note suggests 25g" },
      { amount: "1", name: "bay leaf", notes: "" },
      { amount: "3 sprigs", name: "fresh thyme", notes: "" },
      { amount: "1 teaspoon", name: "dry mustard", notes: "" },
      { amount: "2 tablespoons", name: "all-purpose flour", notes: "" },
      { amount: "2 cups", name: "grated Goat Cheddar", notes: "plus 1 cup in big chunks; handwritten note suggests 8oz total" },
      { amount: "1 cup", name: "Truffle Goat Cheese", notes: "Handwritten note suggests 6oz" },
      { amount: "to taste", name: "Kosher salt and freshly ground black pepper", notes: "" },
      { amount: "1 cup", name: "cashews", notes: "Handwritten addition" },
      { amount: "3 cups", name: "water", notes: "Handwritten addition" }
    ],
    instructions: [
      "Instructions not explicitly provided in the image, but based on the reference: Cook pasta until al dente.",
      "Make a béchamel sauce by infusing milk with onion, clove, garlic, bay leaf, and thyme.",
      "Create a roux with goat butter and flour, then slowly whisk in the infused milk.",
      "Whisk in dry mustard and cheeses until melted.",
      "Combine sauce with pasta and bake if desired until bubbly."
    ],
    category: "main",
    cuisine: "American",
    contributedBy: "Bosko"
  },
  {
    title: "Jollof Rice",
    slug: "jollof-rice",
    description: "A flavorful, vegan-friendly Nigerian rice dish cooked in a tomato and pepper purée with a touch of heat.",
    story: "Adapted from chef Tunde Wey, who was born in Nigeria and is based in New Orleans. This version is vegan and laced with chile heat.",
    servings: 8,
    prepTime: 20,
    cookTime: 40,
    ingredients: [
      { amount: "2", name: "medium tomatoes", notes: "roughly chopped, about 5 ounces each" },
      { amount: "1/2", name: "medium Scotch bonnet pepper", notes: "or habanero, stem removed" },
      { amount: "1/2", name: "medium onion", notes: "roughly chopped" },
      { amount: "3", name: "small red bell peppers", notes: "roughly chopped, about 5 ounces each" },
      { amount: "1/2 cup", name: "vegetable oil", notes: "" },
      { amount: "1 1/2 teaspoons", name: "salt", notes: "" },
      { amount: "1 teaspoon", name: "curry powder", notes: "" },
      { amount: "1 1/2 teaspoons", name: "hot ground chile pepper", notes: "such as African dried chile or cayenne" },
      { amount: "1 1/2 teaspoons", name: "garlic powder", notes: "" },
      { amount: "1 tablespoon plus 1 heaping teaspoon", name: "onion powder", notes: "" },
      { amount: "2", name: "bay leaves", notes: "" },
      { amount: "1/2 teaspoon", name: "ground ginger", notes: "" },
      { amount: "1 tablespoon", name: "dried thyme", notes: "" },
      { amount: "2 1/2 cups", name: "medium-grain rice", notes: "" }
    ],
    instructions: [
      "In a blender, combine tomatoes, scotch bonnet pepper and onions; purée. Pour out half the purée into a bowl; set aside. Add the bell peppers to the purée remaining in the blender and pulse until smooth. Add to the mixture that was set aside and stir to combine.",
      "Heat vegetable oil in a large pot over medium heat. Add blended vegetables along with the salt, curry powder, ground chile pepper, garlic powder, onion powder, bay leaves, ginger and thyme. Bring mixture to a boil.",
      "Stir in the rice until well mixed, then reduce the heat to low.",
      "Cover pot and let cook until rice is al dente, about 45 minutes. Check after 30 minutes; if rice is sauce-logged, remove the lid to cook off the excess sauce. If rice seems dry, stir in 1 to 2 cups water. Allow the rice at the bottom of the pot to char a bit to infuse it with a smoky flavor."
    ],
    category: "main",
    cuisine: "Nigerian",
    contributedBy: "Tunde Wey"
  },
  {
    title: "Gluten-Free Chocolate Chip Cookies",
    slug: "gluten-free-chocolate-chip-cookies",
    description: "Thick and chewy gluten-free chocolate chip cookies with optional walnuts and flaky sea salt.",
    story: "",
    servings: 18,
    prepTime: 75,
    cookTime: 12,
    ingredients: [
      { amount: "420 grams (3 cups)", name: "gluten-free all-purpose flour", notes: "" },
      { amount: "1 teaspoon", name: "kosher salt", notes: "" },
      { amount: "1/2 teaspoon", name: "baking powder", notes: "" },
      { amount: "1/2 teaspoon", name: "baking soda", notes: "" },
      { amount: "230 grams (2 US sticks)", name: "unsalted butter", notes: "at room temperature" },
      { amount: "3/4 cup", name: "packed brown sugar", notes: "" },
      { amount: "3/4 cup", name: "organic cane sugar", notes: "" },
      { amount: "2", name: "large eggs", notes: "at room temperature" },
      { amount: "1 teaspoon", name: "vanilla extract", notes: "" },
      { amount: "335 grams (2 cups)", name: "bittersweet chocolate chips", notes: "" },
      { amount: "50 grams (1/2 cup)", name: "chopped walnuts", notes: "optional" },
      { amount: "to taste", name: "flaky sea salt", notes: "optional" }
    ],
    instructions: [
      "Combine the dry ingredients. Whisk together the flour, salt, baking powder, and soda in a large bowl. Set aside.",
      "Make the batter. Cream the butter and sugars in a large bowl. Add the eggs, one at a time. Add the vanilla. Stir in the dry ingredients, a bit at a time. Add the nuts (if using) and chocolate chips.",
      "Refrigerate the dough for at least one hour.",
      "Prepare to bake. Heat oven to 375°.",
      "Bake the cookies. Drop golf-ball-sized balls of dough onto a parchment-lined baking sheet, making 3 rows of 2 cookies on the sheet. Bake until the edges are crisp and the center still soft, 8 to 12 minutes. Pinch a bit of flaky sea salt over the top of each cookie, if you want. Cool for 10 minutes, then remove from the baking sheet to a cooling rack. Serve as soon as you can."
    ],
    category: "dessert",
    cuisine: "American",
    contributedBy: "Unknown"
  },
  {
    title: "Gluten-Free Tempura",
    slug: "gluten-free-tempura",
    description: "A light and crispy gluten-free tempura that works perfectly for vegetables or shrimp.",
    story: "Accompanied by an encouraging note for those afraid of frying or living without gluten, quoting Charles Duhigg: 'When something doesn't work, it's not a failure. It's an experiment that gave you some data.'",
    servings: 4,
    prepTime: 20,
    cookTime: 15,
    ingredients: [
      { amount: "2 quarts", name: "peanut or vegetable oil", notes: "for frying" },
      { amount: "140 grams (1 cup)", name: "gluten-free all-purpose flour", notes: "" },
      { amount: "1 teaspoon", name: "kosher salt", notes: "" },
      { amount: "1", name: "large egg", notes: "at room temperature" },
      { amount: "3/4 cup", name: "club soda", notes: "" },
      { amount: "4 cups", name: "sliced vegetables", notes: "think no more than 1/2-inch thick" },
      { amount: "1 pound", name: "shrimp", notes: "peeled and deveined (alternative to vegetables)" }
    ],
    instructions: [
      "Prepare to fry. Set a large pot over high heat. Pour in the oil. Add a thermometer to be able to read the heat. Line a cooling rack with 2 layers of paper towels.",
      "Make the batter. Whisk together the flour and salt in a large bowl. In a separate bowl, whisk together the egg and club soda until they are smooth. Pour in the egg and club soda. Hold the bowl of batter in one hand and a pair of chopsticks in the other. Shake the bowl and swirl the chopsticks around in the batter until it is barely combined. There might even be little clumps of flour still not mixed. That's okay.",
      "Batter the vegetables. Immediately, add 7 or 8 vegetable slices to the batter. Start with the thickest vegetables first. Toss them around to make sure they are coated. Using a Chinese spider or slotted spoon, add them to the hot oil, slipping them into the pot just above the surface of the oil.",
      "Fry the tempura. As soon as the battered vegetables are in the hot oil, turn up the heat to keep the temperature as close to 350° as possible. Using the chopsticks, move the vegetables around in the oil, separating them and flipping them to make sure they are fried evenly. Tempura vegetables that are done rise to the surface. Fry until the batter is crisp and blonde, 1 to 4 minutes, depending on the thickness of the vegetable.",
      "Move the tempura with a slotted spoon onto the paper towels and let them dry.",
      "Repeat with the remaining vegetables, battering them just before frying them."
    ],
    category: "main",
    cuisine: "Japanese",
    contributedBy: "Unknown"
  },
  {
    title: "Ayah's Ginger Black Eyed Peas",
    slug: "ayahs-ginger-black-eyed-peas",
    description: "A simple and savory dish of black-eyed peas simmered with ginger, tomatoes, and peanut butter.",
    story: "",
    servings: 4,
    prepTime: 10,
    cookTime: 15,
    ingredients: [
      { amount: "2 tablespoons", name: "oil", notes: "" },
      { amount: "1", name: "onion", notes: "minced" },
      { amount: "2 cups", name: "tomatoes", notes: "seeded and diced" },
      { amount: "2 cups", name: "black-eyed peas", notes: "cooked" },
      { amount: "1/4 cup", name: "natural peanut butter", notes: "" },
      { amount: "1.5 tablespoons", name: "ginger", notes: "diced" },
      { amount: "1/4 cup", name: "water", notes: "" },
      { amount: "to taste", name: "salt and pepper", notes: "" }
    ],
    instructions: [
      "Sauté onions in oil for about 4-5 minutes, add a pinch of salt.",
      "Add tomato and ginger and simmer for 5 minutes.",
      "Add remaining ingredients, bring to a boil, lower heat and taste.",
      "Add salt or anything else you need to taste. Done."
    ],
    category: "side",
    cuisine: "Unknown",
    contributedBy: "Ayah"
  },
  {
    title: "Tom Kha Gai (Chicken Coconut Soup)",
    slug: "tom-kha-gai-chicken-coconut-soup",
    description: "A classic Thai soup with a rich, creamy coconut milk base, flavored with lemongrass, ginger, and lime.",
    story: null,
    servings: 6,
    prepTime: 15,
    cookTime: 20,
    ingredients: [
      { amount: "1", name: "1\" piece ginger", notes: "peeled" },
      { amount: "10", name: "makrut (Thai) lime leaves", notes: "or 1 Tbsp. lime zest and 1/4 cup lime juice" },
      { amount: "6 cups", name: "low-sodium chicken broth", notes: "" },
      { amount: "1 1/2 lb.", name: "skinless, boneless chicken thighs", notes: "cut into 1\" pieces" },
      { amount: "8 oz.", name: "shiitake, oyster, or maitake mushrooms", notes: "stemmed, caps cut into bite-size pieces" },
      { amount: "1 13.5-oz. can", name: "coconut milk", notes: "" },
      { amount: "2 Tbsp.", name: "fish sauce", notes: "such as nam pla or nuoc nam" },
      { amount: "1 tsp.", name: "sugar", notes: "" },
      { amount: "2", name: "stalks fresh lemongrass", notes: "tough outer layers removed" },
      { amount: "to taste", name: "chili oil, cilantro leaves, lime wedges", notes: "for serving" }
    ],
    instructions: [
      "Prepare the lemongrass by removing tough outer layers and smashing slightly.",
      "In a large pot, combine chicken broth, lemongrass, ginger, and lime leaves. Bring to a simmer.",
      "Add chicken and mushrooms, and cook until chicken is cooked through.",
      "Stir in coconut milk, fish sauce, and sugar. Simmer for another 5-10 minutes.",
      "Remove lemongrass stalks and ginger pieces before serving.",
      "Serve with chili oil, cilantro, and lime wedges."
    ],
    category: "main",
    cuisine: "Thai",
    contributedBy: "August 11, 2013"
  },
  {
    title: "Chicken Noodle Soup",
    slug: "chicken-noodle-soup",
    description: "A hearty, comforting chicken noodle soup featuring handmade meatballs with chicken-apple sausage.",
    story: "Recipe courtesy of Tyler Florence.",
    servings: 7,
    prepTime: 30,
    cookTime: 60,
    ingredients: [
      { amount: "as needed", name: "extra-virgin olive oil", notes: "" },
      { amount: "3 cloves", name: "garlic", notes: "smashed" },
      { amount: "2 large", name: "carrots", notes: "chopped" },
      { amount: "1 medium", name: "onion", notes: "chopped" },
      { amount: "2 ribs", name: "celery", notes: "sliced" },
      { amount: "1", name: "bay leaf", notes: "" },
      { amount: "4", name: "fresh thyme sprigs", notes: "" },
      { amount: "3 quarts", name: "low-sodium chicken broth", notes: "" },
      { amount: "5", name: "parsley stems", notes: "plus 1/4 cup finely chopped flat-leaf parsley for garnish" },
      { amount: "4", name: "black peppercorns", notes: "" },
      { amount: "to taste", name: "kosher salt", notes: "" },
      { amount: "to taste", name: "grated Parmigiano-Reggiano", notes: "for garnish" },
      { amount: "1 medium", name: "onion", notes: "diced (for meatballs)" },
      { amount: "6 links", name: "organic chicken-apple sausage meat", notes: "casings removed" },
      { amount: "1", name: "egg", notes: "" },
      { amount: "1 tsp", name: "fresh thyme leaves", notes: "" }
    ],
    instructions: [
      "For the soup: In a large pot, heat olive oil over medium heat. Add garlic, carrots, onion, and celery. Cook until softened.",
      "Add bay leaf, thyme sprigs, peppercorns, and chicken broth. Bring to a boil, then reduce heat and simmer.",
      "For the meatballs: In a bowl, combine diced onion, sausage meat, egg, and thyme leaves. Form into small meatballs.",
      "Brown the meatballs in a separate skillet with a little olive oil, then add them to the simmering soup.",
      "Cook until meatballs are cooked through and flavors are melded.",
      "Stir in chopped parsley and season with salt. Serve with grated Parmigiano-Reggiano."
    ],
    category: "main",
    cuisine: "American",
    contributedBy: "Tyler Florence"
  },
  {
    title: "Dairy Free Creme Brulee",
    slug: "dairy-free-creme-brulee",
    description: "A rich and creamy dairy-free version of the classic French dessert using coconut cream.",
    story: null,
    servings: 4,
    prepTime: 20,
    cookTime: 45,
    ingredients: [
      { amount: "1 can", name: "full fat coconut cream", notes: "liquid removed" },
      { amount: "3 tsp", name: "vanilla extract", notes: "can also use 1 vanilla bean" },
      { amount: "2/3 cup", name: "sugar", notes: "can substitute with 1 cup coconut sugar" },
      { amount: "4", name: "egg yolks", notes: "" },
      { amount: "2 quarts", name: "hot water", notes: "for water bath" }
    ],
    instructions: [
      "Pre-heat oven to 325 degrees F.",
      "In a medium saucepan, combine the coconut cream (using only the thick cream, not the liquid).",
      "Stir in vanilla extract and heat over medium until it just starts to simmer. Remove from heat, cover, and let sit for 15 minutes.",
      "Cream together egg yolks and sugar with a mixer until light and fluffy.",
      "While whisking, slowly pour the warm coconut cream mixture into the egg mixture.",
      "Place ramekins in a high-sided baking tray lined with paper towels. Pour mixture into ramekins.",
      "Fill the tray with hot water until it reaches halfway up the sides of the ramekins.",
      "Bake for 45 minutes until set but slightly jiggly in the center.",
      "Chill for at least 4 hours. Before serving, sprinkle with sugar and torch until caramelized."
    ],
    category: "dessert",
    cuisine: "French",
    contributedBy: "B. Britnell"
  },
  {
    title: "Peach Cobbler",
    slug: "peach-cobbler",
    description: "A classic Southern-style peach cobbler with a bourbon-infused filling and buttery dumpling topping.",
    story: null,
    servings: 8,
    prepTime: 25,
    cookTime: 45,
    ingredients: [
      { amount: "8", name: "peaches", notes: "peeled and sliced, about 6 to 8 cups" },
      { amount: "1/4 cup", name: "bourbon", notes: "" },
      { amount: "3/4 cup", name: "sugar", notes: "plus more for dusting" },
      { amount: "2 Tbsp", name: "corn starch", notes: "" },
      { amount: "1 tsp", name: "ground cinnamon", notes: "" },
      { amount: "1 1/2 cups", name: "all-purpose flour", notes: "" },
      { amount: "2 tsp", name: "baking powder", notes: "" },
      { amount: "1/2 tsp", name: "kosher salt", notes: "" },
      { amount: "16 Tbsp", name: "cold unsalted butter", notes: "2 sticks" },
      { amount: "3/4 cup", name: "heavy cream", notes: "plus more for brushing" }
    ],
    instructions: [
      "Heat the oven to 375 degrees F.",
      "In a large bowl, mix peaches, bourbon, 1/4 cup sugar, cornstarch, and cinnamon. Set aside.",
      "In another bowl, sift flour, 1/2 cup sugar, baking powder, and salt. Cut in 12 tablespoons of cold butter until it looks like coarse crumbs.",
      "Stir in the heavy cream until just combined. Do not overwork.",
      "In a 10-inch cast iron skillet, melt the remaining 4 tablespoons of butter. Add the peach mixture and cook over medium-low for 5 minutes.",
      "Drop the dough by tablespoonfuls over the warm peaches.",
      "Brush the top with heavy cream and sprinkle with sugar.",
      "Bake for 40 to 45 minutes until the top is browned and the fruit is bubbling."
    ],
    category: "dessert",
    cuisine: "Southern",
    contributedBy: ""
  },
  {
    title: "Aunt Vivian's Sweet Potato Pie",
    slug: "aunt-vivians-sweet-potato-pie",
    description: "A traditional, velvety sweet potato pie passed down through the family, featuring hints of nutmeg and lemon.",
    story: "A beloved family recipe from Aunt Vivian.",
    servings: 8,
    prepTime: 30,
    cookTime: 60,
    ingredients: [
      { amount: "3 lb", name: "large sweet potato", notes: "about 4 potatoes" },
      { amount: "1 cup", name: "unsalted butter", notes: "2 sticks, melted" },
      { amount: "2 1/2 cups", name: "sugar", notes: "" },
      { amount: "1 tsp", name: "ground nutmeg", notes: "" },
      { amount: "1 tsp", name: "ground cinnamon", notes: "" },
      { amount: "1/2 tsp", name: "kosher salt", notes: "" },
      { amount: "4 large", name: "eggs", notes: "" },
      { amount: "1 Tbsp", name: "self-rising flour", notes: "" },
      { amount: "1/4 cup", name: "buttermilk", notes: "" },
      { amount: "1 tsp", name: "vanilla extract", notes: "" },
      { amount: "1 tsp", name: "lemon extract", notes: "" },
      { amount: "3", name: "frozen prepared pie crusts", notes: "unbaked" }
    ],
    instructions: [
      "Boil the sweet potatoes until tender, then peel and mash them until smooth.",
      "Preheat your oven (typically 350-375 degrees F for sweet potato pie).",
      "In a large bowl, combine mashed sweet potatoes with melted butter and sugar.",
      "Mix in nutmeg, cinnamon, and salt.",
      "Beat in the eggs one at a time, then stir in flour, buttermilk, vanilla, and lemon extract.",
      "Pour the mixture into the unbaked pie crusts.",
      "Bake until the center is set (usually 45-60 minutes).",
      "Allow to cool completely before serving."
    ],
    category: "dessert",
    cuisine: "Southern",
    contributedBy: "Aunt Vivian"
  },
  {
    title: "Better than Zachary's Gluten-Free Stuffed Deep Dish Pizza",
    slug: "better-than-zacharys-gf-deep-dish",
    description: "A phenomenal Chicago-style stuffed deep dish pizza that is entirely gluten-free. Using Caputo Fioreglut flour, this recipe achieves a buttery, crisp crust that rivals traditional wheat-based deep dish. It's layered with plenty of mozzarella, spinach, and mushrooms, then topped with a rich tomato sauce.",
    story: "Inspired by the legendary Zachary's Chicago Pizza in the Bay Area, this version was developed to provide a truly satisfying gluten-free alternative. By using professional-grade Italian gluten-free flour (Caputo Fioreglut) and the 'stuffed' technique from Lucia's, this pizza has become a family favorite that even non-GF eaters prefer.",
    servings: 4,
    prepTime: 120,
    cookTime: 45,
    ingredients: [
      { amount: "600g", name: "Caputo Fioreglut Gluten Free Flour", notes: "Specifically the 'Fioreglut' blend for best results" },
      { amount: "500g", name: "Water", notes: "Lukewarm (approx 105-110°F)" },
      { amount: "1.5g", name: "Active Dry Yeast", notes: "Approx 1/2 teaspoon" },
      { amount: "15g", name: "Salt", notes: "Fine sea salt" },
      { amount: "5g", name: "Olive Oil", notes: "Plus more for greasing the bowl" },
      { amount: "1 tbsp", name: "Sugar", notes: "To help with browning" },
      { amount: "50g", name: "Unsalted Butter", notes: "Softened, for greasing the deep dish pan" },
      { amount: "400g", name: "Mozzarella Cheese", notes: "Shredded or sliced" },
      { amount: "100g", name: "Fresh Spinach", notes: "Cooked down and squeezed dry" },
      { amount: "100g", name: "Mushrooms", notes: "Sliced and sautéed until moisture is released" },
      { amount: "800g", name: "Crushed Tomatoes", notes: "Preferably Bianco DiNapoli for the sauce" },
      { amount: "to taste", name: "Dried Oregano and Basil", notes: "For the sauce seasoning" }
    ],
    instructions: [
      "Prepare the dough by mixing the Caputo Fioreglut flour, water, yeast, salt, sugar, and olive oil. Knead until smooth and allow to rise in a warm place for about 90 minutes or until doubled in size.",
      "Generously grease a 12-inch deep-dish pizza pan or a large cast-iron skillet with softened butter. Do not use oil, as the butter helps the dough stick to the sides and creates a crisp, flavorful crust.",
      "Divide the dough: Use about 2/3 for the bottom crust and 1/3 for the top 'stuffed' layer.",
      "Press the larger portion of dough into the bottom and all the way up the sides of the prepared pan.",
      "Layer the mozzarella cheese evenly across the bottom of the dough.",
      "Spread the cooked spinach and sautéed mushrooms over the cheese layer.",
      "Roll out the remaining 1/3 of the dough into a very thin circle. Place it over the fillings.",
      "Pinch the edges of the top dough layer to the side crust to seal the pizza. Trim any excess dough.",
      "Use a knife or fork to poke several small vent holes in the top dough layer to allow steam to escape during baking.",
      "Spread the crushed tomato sauce (seasoned with herbs and garlic) evenly over the top dough layer.",
      "Bake at 450°F (230°C) for 35-45 minutes until the crust is golden brown and the sauce is bubbling.",
      "Let the pizza rest for 5-10 minutes before slicing to allow the cheese and sauce to set."
    ],
    category: "main",
    cuisine: "American",
    contributedBy: "Bosko"
  }
]

async function seed() {
  console.log('🌱 Starting recipe seed...')
  
  try {
    // Use ON CONFLICT to update if slug exists
    for (const recipe of allRecipes) {
      const [result] = await db
        .insert(recipes)
        .values({
          ...recipe,
          published: true, // Publish all seeded recipes
          tags: [],
        })
        .onConflictDoUpdate({
          target: recipes.slug,
          set: {
            title: sql`excluded.title`,
            description: sql`excluded.description`,
            story: sql`excluded.story`,
            servings: sql`excluded.servings`,
            prepTime: sql`excluded.prep_time`,
            cookTime: sql`excluded.cook_time`,
            ingredients: sql`excluded.ingredients`,
            instructions: sql`excluded.instructions`,
            category: sql`excluded.category`,
            cuisine: sql`excluded.cuisine`,
            contributedBy: sql`excluded.contributed_by`,
            published: sql`excluded.published`,
            updatedAt: sql`now()`,
          },
        })
        .returning()
      
      console.log(`✅ Seeded: ${recipe.title}`)
    }
    
    console.log(`\n🎉 Successfully seeded ${allRecipes.length} recipes!`)
    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding recipes:', error)
    process.exit(1)
  }
}

seed()
