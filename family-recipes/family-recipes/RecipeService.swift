//
//  RecipeService.swift
//  family-recipes
//
//  Created by Bosco "Bosko" Kante on 1/26/26.
//

import Foundation

@MainActor
class RecipeService: ObservableObject {
    static let shared = RecipeService()
    
    @Published var recipes: [Recipe] = []
    @Published var searchText: String = "" {
        didSet {
            filterRecipes()
        }
    }
    @Published var scale: Double = 1.0
    
    var filteredRecipes: [Recipe] = []
    
    private init() {
        // Load hardcoded recipes (MVP - no API needed)
        recipes = Self.makeHardcodedRecipes()
        filteredRecipes = recipes
    }
    
    func getAllRecipes() -> [Recipe] {
        return recipes
    }
    
    func filterRecipes() {
        if searchText.isEmpty {
            filteredRecipes = recipes
        } else {
            let searchLower = searchText.lowercased()
            filteredRecipes = recipes.filter { recipe in
                recipe.title.lowercased().contains(searchLower) ||
                (recipe.description?.lowercased().contains(searchLower) ?? false) ||
                (recipe.category?.lowercased().contains(searchLower) ?? false) ||
                (recipe.cuisine?.lowercased().contains(searchLower) ?? false) ||
                (recipe.contributedBy?.lowercased().contains(searchLower) ?? false) ||
                recipe.ingredients.contains { $0.name.lowercased().contains(searchLower) }
            }
        }
    }
    
    // Helper to convert empty string to nil
    private static func nilIfEmpty(_ str: String?) -> String? {
        guard let str = str, !str.isEmpty else { return nil }
        return str
    }
    
    // Helper to convert empty strdf  ing notes to nil
    private static func ingredient(_ amount: String, _ name: String, _ notes: String? = nil, weightValue: Double? = nil, weightUnit: String? = nil, isOriginal: Bool? = nil, originalName: String? = nil) -> Ingredient {
        Ingredient(amount: amount, name: name, weightValue: weightValue, weightUnit: nilIfEmpty(weightUnit), notes: nilIfEmpty(notes), isOriginal: isOriginal, originalName: nilIfEmpty(originalName))
    }
    
    // Hardcoded recipe data - MVP approach (fully offline)
    private static func makeHardcodedRecipes() -> [Recipe] {
        return [
        Recipe(
            id: 1,
            slug: "fogo-de-chao-copycat-brazilian-cheese-puff-bread-cow-milk-free",
            title: "Fogo De Chao Copycat Brazilian Cheese Puff Bread Recipe (Cow Milk Free)",
            description: "A cow milk-free version of the famous Brazilian cheese puffs, using cashew milk and goat-based dairy.",
            story: nil,
            servings: 24,
            prepTime: 10,
            cookTime: 15,
            ingredients: [
                Self.ingredient("2 cups", "tapioca flour", "", weightValue: 240, weightUnit: "g"),
                Self.ingredient("1/4 cup", "cashews", "", weightValue: 35, weightUnit: "g"),
                Self.ingredient("3/4 cup", "water", "", weightValue: 180, weightUnit: "g"),
                Self.ingredient("1/2 cup", "Meyenberg's goat butter", "1 stick", weightValue: 113, weightUnit: "g"),
                Self.ingredient("1 teaspoon", "salt", "", weightValue: 6, weightUnit: "g"),
                Self.ingredient("5 oz", "goat cheddar cheese", "finely shredded", weightValue: 142, weightUnit: "g"),
                Self.ingredient("2", "eggs", "at room temperature"),
                Self.ingredient("2 teaspoons", "sugar", "", weightValue: 8, weightUnit: "g"),
                Self.ingredient("1 tablespoon", "olive oil", "", weightValue: 14, weightUnit: "g"),
                Self.ingredient("", "Cooking spray", "")
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
            tips: nil,
            coverImage: nil,
            category: "appetizer",
            cuisine: "Brazilian",
            tags: nil,
            contributedBy: nil,
            familyPhoto: nil
        ),
        Recipe(
            id: 2,
            slug: "golden-milk",
            title: "Golden Milk",
            description: "A warm, spiced nut milk drink made with turmeric, ginger, and cinnamon.",
            story: nil,
            servings: 1,
            prepTime: 5,
            cookTime: 0,
            ingredients: [
                Self.ingredient("1/2 cup", "cashews", "", weightValue: 70, weightUnit: "g"),
                Self.ingredient("1 teaspoon", "ground turmeric", "", weightValue: 3, weightUnit: "g"),
                Self.ingredient("1/2 teaspoon", "ground cinnamon", "", weightValue: 1, weightUnit: "g"),
                Self.ingredient("1/4 teaspoon", "ground ginger", "or 1/2 teaspoon fresh grated ginger", weightValue: 0.5, weightUnit: "g"),
                Self.ingredient("1 pinch", "freshly ground black pepper", "about 1/16 teaspoon"),
                Self.ingredient("3 tablespoons", "maple syrup", "", weightValue: 60, weightUnit: "g"),
                Self.ingredient("1/2 teaspoon", "vanilla extract", "", weightValue: 2, weightUnit: "g"),
                Self.ingredient("2.5 cups", "filtered water", "", weightValue: 600, weightUnit: "g")
            ],
            instructions: [
                "USE CHEFWAVE nut milk maker or blend with 2.5 cups filtered water."
            ],
            tips: nil,
            coverImage: nil,
            category: "drink",
            cuisine: "Indian-inspired",
            tags: nil,
            contributedBy: "ChefWave",
            familyPhoto: nil
        ),
        Recipe(
            id: 3,
            slug: "brazilian-cheese-biscuit",
            title: "Brazilian Cheese Biscuit",
            description: "Traditional Brazilian cheese bread (Pão de Queijo) made with tapioca flour and parmesan or cotija cheese.",
            story: nil,
            servings: 24,
            prepTime: 10,
            cookTime: 15,
            ingredients: [
                Self.ingredient("2 cups", "tapioca flour", "", weightValue: 240, weightUnit: "g"),
                Self.ingredient("1 cup", "whole milk", "", weightValue: 240, weightUnit: "g"),
                Self.ingredient("1/2 cup", "unsalted butter", "", weightValue: 113, weightUnit: "g"),
                Self.ingredient("1 teaspoon", "salt", "", weightValue: 6, weightUnit: "g"),
                Self.ingredient("5 oz", "Parmesan or Cotija cheese", "finely shredded", weightValue: 142, weightUnit: "g"),
                Self.ingredient("2", "eggs", "at room temperature"),
                Self.ingredient("2 teaspoons", "sugar", "", weightValue: 8, weightUnit: "g"),
                Self.ingredient("1 tablespoon", "olive oil", "", weightValue: 14, weightUnit: "g"),
                Self.ingredient("", "Cooking Spray", "")
            ],
            instructions: [
                "Preheat oven to 350 degrees. Grease the inside of a mini muffin tin."
            ],
            tips: nil,
            coverImage: nil,
            category: "appetizer",
            cuisine: "Brazilian",
            tags: nil,
            contributedBy: nil,
            familyPhoto: nil
        ),
        Recipe(
            id: 4,
            slug: "chipotle-aioli-smoky-spicy-homemade-chipotle-mayo",
            title: "Chipotle Aioli - Smoky & Spicy Homemade Chipotle Mayo",
            description: "A delicious spicy and smoky homemade chipotle mayo that puts prepackaged sauces to shame.",
            story: nil,
            servings: 8,
            prepTime: 10,
            cookTime: 0,
            ingredients: [
                Self.ingredient("1/2 cup", "light olive oil", "or other neutral flavored oil", weightValue: 110, weightUnit: "g"),
                Self.ingredient("1", "egg yolk", "or 1/4 cup / 2 egg yolks as per handwritten note", weightValue: 18, weightUnit: "g"),
                Self.ingredient("2", "chipotle peppers", "in adobo sauce", weightValue: 30, weightUnit: "g"),
                Self.ingredient("1/3", "lemon", "juice of", weightValue: 15, weightUnit: "g"),
                Self.ingredient("2 cloves", "roasted garlic", "raw also works", weightValue: 6, weightUnit: "g"),
                Self.ingredient("1/8 teaspoon", "salt", "", weightValue: 0.75, weightUnit: "g"),
                Self.ingredient("1/8 teaspoon", "black pepper", "", weightValue: 0.25, weightUnit: "g"),
                Self.ingredient("1/8 teaspoon", "cumin", "", weightValue: 0.25, weightUnit: "g"),
                Self.ingredient("1/8 teaspoon", "paprika", "", weightValue: 0.25, weightUnit: "g")
            ],
            instructions: [
                "Juice the 1/3 of a lemon, remove the roasted garlic from it's skin, and add to a food processor.",
                "Add the chipotle peppers, roasted garlic, and all of the spices into a food processor.",
                "Give the mixture a quick 2-3 second blitz in the food processor just to break things down.",
                "Turn on the food processor and SLOWLY add in the oil. It is very important to add it slowly to prevent separating from the egg yolk.",
                "After you have added all of the oil, turn the food processor off and unplug.",
                "Plug the food processor back in and blitz again for about 20 seconds."
            ],
            tips: nil,
            coverImage: nil,
            category: "side",
            cuisine: "Mexican-inspired",
            tags: nil,
            contributedBy: "Simply Elegant Home Cooking",
            familyPhoto: nil
        ),
        Recipe(
            id: 5,
            slug: "boskos-gluten-and-dairy-free-biscuits",
            title: "Bosko's Gluten & Dairy Free Biscuits",
            description: "Big fluffy gluten and dairy free biscuits that use refined coconut oil as a butter substitute.",
            story: nil,
            servings: 6,
            prepTime: 25,
            cookTime: 15,
            ingredients: [
                Self.ingredient("280 grams (2 cups)", "gluten-free girl all-purpose gluten-free flour blend", "30% sweet rice, 30% potato starch, 40% Millet by weight", weightValue: 280, weightUnit: "g"),
                Self.ingredient("1 teaspoon", "Xanthan Gum", ""),
                Self.ingredient("1 Tablespoon", "baking powder", ""),
                Self.ingredient("1 1/2 teaspoons", "kosher salt", ""),
                Self.ingredient("115 grams (8 tablespoons)", "REFINED COCONUT OIL", "cold", weightValue: 115, weightUnit: "g"),
                Self.ingredient("3/4 cup", "ALMOND MILK", ""),
                Self.ingredient("1/4 cup", "NON-DAIRY yogurt", ""),
                Self.ingredient("2 tablespoons", "REFINED COCONUT OIL", "melted")
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
            tips: nil,
            coverImage: nil,
            category: "side",
            cuisine: "American",
            tags: nil,
            contributedBy: "Bosko",
            familyPhoto: nil
        ),
        Recipe(
            id: 6,
            slug: "boskos-heckagood-gluten-and-dairy-free-pancakes",
            title: "Bosko's Heckagood Gluten and Dairy Free Pancakes",
            description: "Thick and fluffy gluten-free pancakes that can also be adapted for waffles by doubling the fat.",
            story: nil,
            servings: 16,
            prepTime: 10,
            cookTime: 15,
            ingredients: [
                Self.ingredient("2 large", "eggs", ""),
                Self.ingredient("4 Tablespoons", "Goat Butter", "double for waffles; can substitute Earth Balance or coconut oil"),
                Self.ingredient("2 cups", "ALMOND/Oat/Cashew milk", "Fresh Cashew or Chobani Oatmilk recommended"),
                Self.ingredient("1 teaspoon", "gluten-free vanilla extract", ""),
                Self.ingredient("2 1/2 cups (300 grams)", "Bob's Red Mill Gluten Free All Purpose Flour", "", weightValue: 300, weightUnit: "g"),
                Self.ingredient("2 Tablespoons", "granulated sugar", ""),
                Self.ingredient("1 1/2 teaspoons", "baking powder", ""),
                Self.ingredient("3/4 teaspoon", "salt", ""),
                Self.ingredient("3/8 teaspoon", "gluten free xanthan gum", "double if using flour without xanthan gum")
            ],
            instructions: [
                "Whisk together the eggs, melted butter or oil, milk, and vanilla.",
                "In a separate bowl, whisk together the dry ingredients. Stir in the egg mixture.",
                "Preheat the griddle to medium (350°F), greasing it lightly.",
                "Scoop the batter by 1/4-cupfuls onto the griddle. Note: The batter will be much thicker than wheat flour batter and will not spread; you may need to spread it out a little with a spoon.",
                "Cook for 1 to 2 minutes, until the tops lose their shine and bottoms are golden brown. Flip and cook for 1 to 2 minutes on the other side.",
                "To make waffles: Prepare the batter as directed but add extra fat to help make them crisp. Cook according to waffle iron directions."
            ],
            tips: nil,
            coverImage: nil,
            category: "main",
            cuisine: "American",
            tags: nil,
            contributedBy: "Bosko",
            familyPhoto: nil
        ),
        Recipe(
            id: 7,
            slug: "beignets",
            title: "Beignets",
            description: "Classic French Quarter style beignets from Tyler Florence's Ultimate French Quarter episode.",
            story: nil,
            servings: 12,
            prepTime: 29,
            cookTime: 15,
            ingredients: [
                Self.ingredient("3/4 cups", "warm water", "", weightValue: 180, weightUnit: "g"),
                Self.ingredient("1 packet", "active dry yeast", "", weightValue: 7, weightUnit: "g"),
                Self.ingredient("1/4 cup plus a pinch", "granulated sugar", "", weightValue: 55, weightUnit: "g"),
                Self.ingredient("Pinch", "kosher salt", "", weightValue: 1, weightUnit: "g"),
                Self.ingredient("1 large", "egg", "", weightValue: 50, weightUnit: "g"),
                Self.ingredient("1/2 cup", "evaporated milk", "", weightValue: 120, weightUnit: "g"),
                Self.ingredient("4 cups", "all-purpose flour", "plus more as needed", weightValue: 500, weightUnit: "g"),
                Self.ingredient("2 tablespoons", "vegetable shortening", "", weightValue: 25, weightUnit: "g"),
                Self.ingredient("as needed", "Butter", ""),
                Self.ingredient("as needed", "Vegetable oil", "for deep frying"),
                Self.ingredient("1 cup", "powdered sugar", "for dusting", weightValue: 120, weightUnit: "g")
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
            tips: nil,
            coverImage: nil,
            category: "dessert",
            cuisine: "French",
            tags: nil,
            contributedBy: "Tyler Florence",
            familyPhoto: nil
        ),
        Recipe(
            id: 8,
            slug: "mochi-donuts",
            title: "Mochi Donuts",
            description: "Chewy, bouncy donuts made with sticky rice flour, including options for chocolate and matcha glazes.",
            story: nil,
            servings: 12,
            prepTime: 30,
            cookTime: 10,
            ingredients: [
                Self.ingredient("1/4 cup", "sticky rice flour", "Erawan brand recommended (Starter Dough)", weightValue: 35, weightUnit: "g"),
                Self.ingredient("3 tbsp", "milk", "(Starter Dough)", weightValue: 45, weightUnit: "g"),
                Self.ingredient("2 cups", "sticky rice flour", "(Main Donut)", weightValue: 280, weightUnit: "g"),
                Self.ingredient("1 tsp", "baking powder", "", weightValue: 4, weightUnit: "g"),
                Self.ingredient("1/2 cup", "milk", "(Main Donut)", weightValue: 120, weightUnit: "g"),
                Self.ingredient("1/4 cup", "sugar", "", weightValue: 50, weightUnit: "g"),
                Self.ingredient("1", "egg", "", weightValue: 50, weightUnit: "g"),
                Self.ingredient("2 1/2 Tbsp", "Goat Milk butter", "melted", weightValue: 35, weightUnit: "g"),
                Self.ingredient("1 1/2 tsp", "cocoa powder", "optional", weightValue: 3, weightUnit: "g"),
                Self.ingredient("1/2 tsp", "matcha powder", "optional", weightValue: 1, weightUnit: "g"),
                Self.ingredient("1 cup", "powdered sugar", "for glaze", weightValue: 120, weightUnit: "g"),
                Self.ingredient("1/8 cup", "milk", "for glaze", weightValue: 30, weightUnit: "g")
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
            tips: nil,
            coverImage: nil,
            category: "dessert",
            cuisine: "Japanese-American",
            tags: nil,
            contributedBy: "Modest Motley",
            familyPhoto: nil
        ),
        Recipe(
            id: 9,
            slug: "chinese-sausage-and-chicken-rice",
            title: "Chinese Sausage and Chicken Rice",
            description: "A classic one-pot dish featuring savory Chinese sausage, dried shiitake mushrooms, and marinated chicken.",
            story: nil,
            servings: nil,
            prepTime: nil,
            cookTime: nil,
            ingredients: [
                Self.ingredient("10 oz", "long grain rice", "such as Thai jasmine, or preferred"),
                Self.ingredient("2 links", "Chinese sausage", ""),
                Self.ingredient("1 oz", "dried shiitake mushroom", ""),
                Self.ingredient("1 piece", "chicken breast", ""),
                Self.ingredient("1 piece", "bone-in chicken thigh", ""),
                Self.ingredient("1", "shallot", ""),
                Self.ingredient("1 tbsp", "ginger", ""),
                Self.ingredient("2 stalks", "scallions", ""),
                Self.ingredient("1 tbsp", "Kikkoman® Soy Sauce", "Chicken Marinade"),
                Self.ingredient("2 tbsp", "Kikkoman® Oyster Sauce", "Chicken Marinade"),
                Self.ingredient("0.50 tsp", "salt", "Chicken Marinade"),
                Self.ingredient("1 tsp", "sugar", "Chicken Marinade"),
                Self.ingredient("1 tbsp", "cornstarch", "Chicken Marinade"),
                Self.ingredient("3 tbsp", "water", "Chicken Marinade"),
                Self.ingredient("1 tsp", "cooking wine", "Chicken Marinade"),
                Self.ingredient("0.25 tsp", "white pepper", "Chicken Marinade"),
                Self.ingredient("1 tbsp", "oil", "Chicken Marinade"),
                Self.ingredient("1 tbsp", "Kikkoman® Sesame Oil", "Chicken Marinade"),
                Self.ingredient("0.50 tbsp", "Kikkoman® Oyster Sauce", "Shiitake Mushroom Marinade"),
                Self.ingredient("1 tsp", "sugar", "Shiitake Mushroom Marinade"),
                Self.ingredient("0.50 tsp", "cornstarch", "Shiitake Mushroom Marinade"),
                Self.ingredient("1 tbsp", "Kikkoman® Oyster Sauce", "Serving Sauce"),
                Self.ingredient("1 tsp", "Kikkoman® Soy Sauce", "Serving Sauce"),
                Self.ingredient("1 tsp", "Kikkoman® Tamari Soy Sauce", "Serving Sauce"),
                Self.ingredient("1 tsp", "sugar", "Serving Sauce"),
                Self.ingredient("1 tsp", "oil", "Cooking Ingredients"),
                Self.ingredient("11 oz", "boiling water", "Cooking Ingredients"),
                Self.ingredient("2 tbsp", "oil", "Cooking Ingredients")
            ],
            instructions: [],
            tips: nil,
            coverImage: nil,
            category: "main",
            cuisine: "Chinese",
            tags: nil,
            contributedBy: nil,
            familyPhoto: nil
        ),
        Recipe(
            id: 10,
            slug: "summer-berry-crisp",
            title: "Summer Berry Crisp",
            description: "Juicy berries are marvelous nestled under a crispy top. This dessert is easy enough for a beginning baker to make and serve with pride.",
            story: "By Sheila Lukins, Parade July 2007.",
            servings: 6,
            prepTime: 15,
            cookTime: 60,
            ingredients: [
                Self.ingredient("2 cups", "blueberries", "", weightValue: 300, weightUnit: "g"),
                Self.ingredient("2 cups", "blackberries", "", weightValue: 300, weightUnit: "g"),
                Self.ingredient("2 cups", "raspberries", "", weightValue: 250, weightUnit: "g"),
                Self.ingredient("1/4 cup", "sugar", "", weightValue: 50, weightUnit: "g"),
                Self.ingredient("1/4 cup", "all-purpose flour", "", weightValue: 30, weightUnit: "g"),
                Self.ingredient("1/4 teaspoon", "cinnamon", "", weightValue: 0.5, weightUnit: "g"),
                Self.ingredient("1 cup", "rolled oats", "Crisp topping", weightValue: 90, weightUnit: "g"),
                Self.ingredient("1/2 cup", "all-purpose flour", "Crisp topping", weightValue: 60, weightUnit: "g"),
                Self.ingredient("1/2 cup", "brown sugar", "Crisp topping", weightValue: 100, weightUnit: "g"),
                Self.ingredient("1/2 cup", "sugar", "Crisp topping", weightValue: 100, weightUnit: "g"),
                Self.ingredient("Pinch", "salt", "Crisp topping", weightValue: 1, weightUnit: "g"),
                Self.ingredient("1/2 cup (1 stick)", "cold unsalted butter", "cut into small pieces", weightValue: 113, weightUnit: "g"),
                Self.ingredient("optional", "Whipped cream or vanilla ice cream", "for serving")
            ],
            instructions: [
                "Preheat the oven to 350°F. Butter a 9-inch Pyrex pie plate.",
                "Gently combine the berries with the sugar, flour and cinnamon; place in the prepared pie plate.",
                "Prepare the topping: Combine the oats, flour, both sugars and salt in a bowl. Use a pastry blender or 2 knives to work in the butter until topping resembles coarse meal. Sprinkle evenly over the berries.",
                "Place the pie plate on a baking sheet. Bake in the center of the oven until the fruit is bubbling and the topping is golden brown, about 1 hour. Remove the crisp to a rack to cool slightly. Serve in dessert bowls with whipped cream or ice cream."
            ],
            tips: nil,
            coverImage: nil,
            category: "dessert",
            cuisine: "American",
            tags: nil,
            contributedBy: "Sheila Lukins",
            familyPhoto: nil
        ),
        Recipe(
            id: 11,
            slug: "ghanaian-chicken-and-peanut-stew",
            title: "Ghanaian Chicken and Peanut Stew (Groundnut Soup)",
            description: "Peanut butter and tomatoes lend a rich and creamy backdrop to this simple, hearty Ghanaian chicken stew.",
            story: "Inspired by Sara'o Maozac's story 'East, West, Then Backward: Falling for Groundnut Soup in Ghana.'",
            servings: 6,
            prepTime: 15,
            cookTime: 45,
            ingredients: [
                Self.ingredient("2 medium", "yellow onions", "about 12 ounces; 340g, halved and ends trimmed, divided"),
                Self.ingredient("2 cups (480ml)", "chicken broth", "homemade or store-bought low-sodium, plus more as needed, divided"),
                Self.ingredient("5 medium cloves", "garlic", "divided"),
                Self.ingredient("1 ounce (28g)", "fresh ginger", "about 1-inch knob, divided"),
                Self.ingredient("2 tablespoons", "tomato paste", ""),
                Self.ingredient("2 pounds (900g)", "skin-on chicken legs", "halved into drumsticks and thighs"),
                Self.ingredient("1", "hot pepper", "such as bird's eye, habanero, or Scotch bonnet"),
                Self.ingredient("2", "bay leaves", ""),
                Self.ingredient("1 cup (9 oz)", "creamy peanut butter", "Natural, unsweetened preferred"),
                Self.ingredient("1 (28-ounce) can", "plum tomatoes", "with their juices"),
                Self.ingredient("1 whole", "smoke-dried fish", "Optional, such as tilapia or snapper")
            ],
            instructions: [
                "In a blender, purée 2 onion halves, 1/2 cup (120ml) chicken stock, 3 garlic cloves, 1/2 ounce ginger, and tomato paste. In a Dutch oven, combine chicken legs with purée, remaining onion halves, remaining 1/2 ounce ginger, and remaining 2 cloves garlic, along with hot pepper and bay leaves. Toss to coat.",
                "Set Dutch oven over medium heat and bring to a simmer, then cover, reduce heat to low, and cook until halved onion is soft and translucent, about 20 minutes. Add an extra 1/2 cup (120ml) chicken stock if mixture begins to stick to the bottom of the pot.",
                "Transfer chunks of onion, ginger, garlic cloves, and hot pepper to blender. Add peanut butter, canned tomatoes and their juices, and remaining 1 1/2 cups (360ml) chicken stock and purée until smooth. Pass blended mix through a fine-mesh strainer into the Dutch oven, stirring to incorporate.",
                "Increase heat to medium and bring to a simmer, then lower heat to medium-low and cook, stirring occasionally, until chicken is tender, oils have surfaced, and mixture has thickened and reduced by about one-third, about 40 minutes. Add smoked fish, reduce heat to low, cover pot, and cook an additional 5 minutes (omit smoked fish for a 5-minute shorter cooking step). Remove and serve with rice or fufu."
            ],
            tips: nil,
            coverImage: nil,
            category: "main",
            cuisine: "Ghanaian",
            tags: nil,
            contributedBy: "Niki Achitoff-Gray",
            familyPhoto: nil
        ),
        Recipe(
            id: 12,
            slug: "sweet-potato-pie",
            title: "Sweet Potato Pie",
            description: "A traditional Southern-style sweet potato pie with a creamy, spiced filling.",
            story: nil,
            servings: 8,
            prepTime: nil,
            cookTime: nil,
            ingredients: [
                Self.ingredient("1 (1 pound)", "sweet potato", ""),
                Self.ingredient("1/2 cup", "butter", "softened"),
                Self.ingredient("1 cup", "white sugar", ""),
                Self.ingredient("1/2 cup", "milk", ""),
                Self.ingredient("2", "eggs", ""),
                Self.ingredient("1/2 teaspoon", "ground nutmeg", ""),
                Self.ingredient("1/2 teaspoon", "ground cinnamon", ""),
                Self.ingredient("1 teaspoon", "vanilla extract", ""),
                Self.ingredient("1 (9 inch)", "unbaked pie crust", "")
            ],
            instructions: [],
            tips: nil,
            coverImage: nil,
            category: "dessert",
            cuisine: "American",
            tags: nil,
            contributedBy: nil,
            familyPhoto: nil
        ),
        Recipe(
            id: 13,
            slug: "custard-pie",
            title: "Custard Pie",
            description: "A classic egg custard pie with a smooth, velvety texture and a hint of nutmeg.",
            story: nil,
            servings: 8,
            prepTime: nil,
            cookTime: nil,
            ingredients: [
                Self.ingredient("1 (9 inch)", "unbaked pie crust", ""),
                Self.ingredient("4 large", "eggs", ""),
                Self.ingredient("3/4 cup", "sugar", ""),
                Self.ingredient("1/4 teaspoon", "salt", ""),
                Self.ingredient("1 teaspoon", "vanilla", ""),
                Self.ingredient("1 cup", "heavy cream", ""),
                Self.ingredient("1 1/2 cups", "milk", ""),
                Self.ingredient("1/4 teaspoon", "nutmeg", "")
            ],
            instructions: [],
            tips: nil,
            coverImage: nil,
            category: "dessert",
            cuisine: "American",
            tags: nil,
            contributedBy: nil,
            familyPhoto: nil
        ),
        Recipe(
            id: 14,
            slug: "boskos-truffle-mac-n-cheese-2021",
            title: "Bosko's Truffle Mac N Cheese 2021",
            description: "A rich and decadent truffle-infused macaroni and cheese featuring goat-based dairy products.",
            story: "Bosko's personal take on Tyler Florence's classic recipe, modified in 2021 to use goat butter and cheeses, with handwritten notes suggesting a possible cashew-based variation.",
            servings: 6,
            prepTime: 15,
            cookTime: 30,
            ingredients: [
                Self.ingredient("4 cups (1 pound)", "elbow macaroni", "", weightValue: 450, weightUnit: "g"),
                Self.ingredient("5 tablespoons", "Goat butter", "", weightValue: 70, weightUnit: "g"),
                Self.ingredient("4 cups", "milk", "", weightValue: 960, weightUnit: "g"),
                Self.ingredient("1/2", "medium onion", "stuck with 1 clove", weightValue: 75, weightUnit: "g"),
                Self.ingredient("4 cloves", "garlic", "Handwritten note suggests 25g", weightValue: 25, weightUnit: "g"),
                Self.ingredient("1", "bay leaf", ""),
                Self.ingredient("3 sprigs", "fresh thyme", ""),
                Self.ingredient("1 teaspoon", "dry mustard", "", weightValue: 2, weightUnit: "g"),
                Self.ingredient("2 tablespoons", "all-purpose flour", "", weightValue: 15, weightUnit: "g"),
                Self.ingredient("2 cups", "grated Goat Cheddar", "plus 1 cup in big chunks; handwritten note suggests 8oz total", weightValue: 225, weightUnit: "g"),
                Self.ingredient("1 cup", "Truffle Goat Cheese", "Handwritten note suggests 6oz", weightValue: 170, weightUnit: "g"),
                Self.ingredient("to taste", "Kosher salt and freshly ground black pepper", ""),
                Self.ingredient("1 cup", "cashews", "Handwritten addition", weightValue: 140, weightUnit: "g"),
                Self.ingredient("3 cups", "water", "Handwritten addition", weightValue: 720, weightUnit: "g")
            ],
            instructions: [
                "Instructions not explicitly provided in the image, but based on the reference: Cook pasta until al dente.",
                "Make a béchamel sauce by infusing milk with onion, clove, garlic, bay leaf, and thyme.",
                "Create a roux with goat butter and flour, then slowly whisk in the infused milk.",
                "Whisk in dry mustard and cheeses until melted.",
                "Combine sauce with pasta and bake if desired until bubbly."
            ],
            tips: nil,
            coverImage: nil,
            category: "main",
            cuisine: "American",
            tags: nil,
            contributedBy: "Bosko",
            familyPhoto: nil
        ),
        Recipe(
            id: 15,
            slug: "jollof-rice",
            title: "Jollof Rice",
            description: "A flavorful, vegan-friendly Nigerian rice dish cooked in a tomato and pepper purée with a touch of heat.",
            story: "Adapted from chef Tunde Wey, who was born in Nigeria and is based in New Orleans. This version is vegan and laced with chile heat.",
            servings: 8,
            prepTime: 20,
            cookTime: 40,
            ingredients: [
                Self.ingredient("2", "medium tomatoes", "roughly chopped, about 5 ounces each"),
                Self.ingredient("1/2", "medium Scotch bonnet pepper", "or habanero, stem removed"),
                Self.ingredient("1/2", "medium onion", "roughly chopped"),
                Self.ingredient("3", "small red bell peppers", "roughly chopped, about 5 ounces each"),
                Self.ingredient("1/2 cup", "vegetable oil", ""),
                Self.ingredient("1 1/2 teaspoons", "salt", ""),
                Self.ingredient("1 teaspoon", "curry powder", ""),
                Self.ingredient("1 1/2 teaspoons", "hot ground chile pepper", "such as African dried chile or cayenne"),
                Self.ingredient("1 1/2 teaspoons", "garlic powder", ""),
                Self.ingredient("1 tablespoon plus 1 heaping teaspoon", "onion powder", ""),
                Self.ingredient("2", "bay leaves", ""),
                Self.ingredient("1/2 teaspoon", "ground ginger", ""),
                Self.ingredient("1 tablespoon", "dried thyme", ""),
                Self.ingredient("2 1/2 cups", "medium-grain rice", "")
            ],
            instructions: [
                "In a blender, combine tomatoes, scotch bonnet pepper and onions; purée. Pour out half the purée into a bowl; set aside. Add the bell peppers to the purée remaining in the blender and pulse until smooth. Add to the mixture that was set aside and stir to combine.",
                "Heat vegetable oil in a large pot over medium heat. Add blended vegetables along with the salt, curry powder, ground chile pepper, garlic powder, onion powder, bay leaves, ginger and thyme. Bring mixture to a boil.",
                "Stir in the rice until well mixed, then reduce the heat to low.",
                "Cover pot and let cook until rice is al dente, about 45 minutes. Check after 30 minutes; if rice is sauce-logged, remove the lid to cook off the excess sauce. If rice seems dry, stir in 1 to 2 cups water. Allow the rice at the bottom of the pot to char a bit to infuse it with a smoky flavor."
            ],
            tips: nil,
            coverImage: nil,
            category: "main",
            cuisine: "Nigerian",
            tags: nil,
            contributedBy: "Tunde Wey",
            familyPhoto: nil
        ),
        Recipe(
            id: 16,
            slug: "gluten-free-chocolate-chip-cookies",
            title: "Gluten-Free Chocolate Chip Cookies",
            description: "Thick and chewy gluten-free chocolate chip cookies with optional walnuts and flaky sea salt.",
            story: nil,
            servings: 18,
            prepTime: 75,
            cookTime: 12,
            ingredients: [
                Self.ingredient("420 grams (3 cups)", "gluten-free all-purpose flour", "", weightValue: 420, weightUnit: "g"),
                Self.ingredient("1 teaspoon", "kosher salt", "", weightValue: 6, weightUnit: "g"),
                Self.ingredient("1/2 teaspoon", "baking powder", "", weightValue: 2, weightUnit: "g"),
                Self.ingredient("1/2 teaspoon", "baking soda", "", weightValue: 2, weightUnit: "g"),
                Self.ingredient("230 grams (2 US sticks)", "unsalted butter", "at room temperature", weightValue: 230, weightUnit: "g"),
                Self.ingredient("3/4 cup", "packed brown sugar", "", weightValue: 150, weightUnit: "g"),
                Self.ingredient("3/4 cup", "organic cane sugar", "", weightValue: 150, weightUnit: "g"),
                Self.ingredient("2", "large eggs", "at room temperature", weightValue: 100, weightUnit: "g"),
                Self.ingredient("1 teaspoon", "vanilla extract", "", weightValue: 4, weightUnit: "g"),
                Self.ingredient("335 grams (2 cups)", "bittersweet chocolate chips", "", weightValue: 335, weightUnit: "g"),
                Self.ingredient("50 grams (1/2 cup)", "chopped walnuts", "optional", weightValue: 50, weightUnit: "g"),
                Self.ingredient("to taste", "flaky sea salt", "optional")
            ],
            instructions: [
                "Combine the dry ingredients. Whisk together the flour, salt, baking powder, and soda in a large bowl. Set aside.",
                "Make the batter. Cream the butter and sugars in a large bowl. Add the eggs, one at a time. Add the vanilla. Stir in the dry ingredients, a bit at a time. Add the nuts (if using) and chocolate chips.",
                "Refrigerate the dough for at least one hour.",
                "Prepare to bake. Heat oven to 375°.",
                "Bake the cookies. Drop golf-ball-sized balls of dough onto a parchment-lined baking sheet, making 3 rows of 2 cookies on the sheet. Bake until the edges are crisp and the center still soft, 8 to 12 minutes. Pinch a bit of flaky sea salt over the top of each cookie, if you want. Cool for 10 minutes, then remove from the baking sheet to a cooling rack. Serve as soon as you can."
            ],
            tips: nil,
            coverImage: nil,
            category: "dessert",
            cuisine: "American",
            tags: nil,
            contributedBy: nil,
            familyPhoto: nil
        ),
        Recipe(
            id: 17,
            slug: "gluten-free-tempura",
            title: "Gluten-Free Tempura",
            description: "A light and crispy gluten-free tempura that works perfectly for vegetables or shrimp.",
            story: "Accompanied by an encouraging note for those afraid of frying or living without gluten, quoting Charles Duhigg: 'When something doesn't work, it's not a failure. It's an experiment that gave you some data.'",
            servings: 4,
            prepTime: 20,
            cookTime: 15,
            ingredients: [
                Self.ingredient("2 quarts", "peanut or vegetable oil", "for frying", weightValue: 1800, weightUnit: "g"),
                Self.ingredient("140 grams (1 cup)", "gluten-free all-purpose flour", "", weightValue: 140, weightUnit: "g"),
                Self.ingredient("1 teaspoon", "kosher salt", "", weightValue: 6, weightUnit: "g"),
                Self.ingredient("1", "large egg", "at room temperature", weightValue: 50, weightUnit: "g"),
                Self.ingredient("3/4 cup", "club soda", "", weightValue: 180, weightUnit: "g"),
                Self.ingredient("4 cups", "sliced vegetables", "think no more than 1/2-inch thick", weightValue: 400, weightUnit: "g"),
                Self.ingredient("1 pound", "shrimp", "peeled and deveined (alternative to vegetables)", weightValue: 450, weightUnit: "g")
            ],
            instructions: [
                "Prepare to fry. Set a large pot over high heat. Pour in the oil. Add a thermometer to be able to read the heat. Line a cooling rack with 2 layers of paper towels.",
                "Make the batter. Whisk together the flour and salt in a large bowl. In a separate bowl, whisk together the egg and club soda until they are smooth. Pour in the egg and club soda. Hold the bowl of batter in one hand and a pair of chopsticks in the other. Shake the bowl and swirl the chopsticks around in the batter until it is barely combined. There might even be little clumps of flour still not mixed. That's okay.",
                "Batter the vegetables. Immediately, add 7 or 8 vegetable slices to the batter. Start with the thickest vegetables first. Toss them around to make sure they are coated. Using a Chinese spider or slotted spoon, add them to the hot oil, slipping them into the pot just above the surface of the oil.",
                "Fry the tempura. As soon as the battered vegetables are in the hot oil, turn up the heat to keep the temperature as close to 350° as possible. Using the chopsticks, move the vegetables around in the oil, separating them and flipping them to make sure they are fried evenly. Tempura vegetables that are done rise to the surface. Fry until the batter is crisp and blonde, 1 to 4 minutes, depending on the thickness of the vegetable.",
                "Move the tempura with a slotted spoon onto the paper towels and let them dry.",
                "Repeat with the remaining vegetables, battering them just before frying them."
            ],
            tips: nil,
            coverImage: nil,
            category: "main",
            cuisine: "Japanese",
            tags: nil,
            contributedBy: nil,
            familyPhoto: nil
        ),
        Recipe(
            id: 18,
            slug: "ayahs-ginger-black-eyed-peas",
            title: "Ayah's Ginger Black Eyed Peas",
            description: "A simple and savory dish of black-eyed peas simmered with ginger, tomatoes, and peanut butter.",
            story: nil,
            servings: 4,
            prepTime: 10,
            cookTime: 15,
            ingredients: [
                Self.ingredient("2 tablespoons", "oil", "", weightValue: 28, weightUnit: "g"),
                Self.ingredient("1", "onion", "minced", weightValue: 150, weightUnit: "g"),
                Self.ingredient("2 cups", "tomatoes", "seeded and diced", weightValue: 400, weightUnit: "g"),
                Self.ingredient("2 cups", "black-eyed peas", "cooked", weightValue: 340, weightUnit: "g"),
                Self.ingredient("1/4 cup", "natural peanut butter", "", weightValue: 64, weightUnit: "g"),
                Self.ingredient("1.5 tablespoons", "ginger", "diced", weightValue: 12, weightUnit: "g"),
                Self.ingredient("1/4 cup", "water", "", weightValue: 60, weightUnit: "g"),
                Self.ingredient("to taste", "salt and pepper", "")
            ],
            instructions: [
                "Sauté onions in oil for about 4-5 minutes, add a pinch of salt.",
                "Add tomato and ginger and simmer for 5 minutes.",
                "Add remaining ingredients, bring to a boil, lower heat and taste.",
                "Add salt or anything else you need to taste. Done."
            ],
            tips: nil,
            coverImage: nil,
            category: "side",
            cuisine: nil,
            tags: nil,
            contributedBy: "Ayah",
            familyPhoto: nil
        ),
        Recipe(
            id: 19,
            slug: "tom-kha-gai-chicken-coconut-soup",
            title: "Tom Kha Gai (Chicken Coconut Soup)",
            description: "A classic Thai soup with a rich, creamy coconut milk base, flavored with lemongrass, ginger, and lime.",
            story: nil,
            servings: 6,
            prepTime: 15,
            cookTime: 20,
            ingredients: [
                Self.ingredient("1", "1\" piece ginger", "peeled", weightValue: 10, weightUnit: "g"),
                Self.ingredient("10", "makrut (Thai) lime leaves", "or 1 Tbsp. lime zest and 1/4 cup lime juice", weightValue: 2, weightUnit: "g"),
                Self.ingredient("6 cups", "low-sodium chicken broth", "", weightValue: 1440, weightUnit: "g"),
                Self.ingredient("1 1/2 lb.", "skinless, boneless chicken thighs", "cut into 1\" pieces", weightValue: 680, weightUnit: "g"),
                Self.ingredient("8 oz.", "shiitake, oyster, or maitake mushrooms", "stemmed, caps cut into bite-size pieces", weightValue: 225, weightUnit: "g"),
                Self.ingredient("1 13.5-oz. can", "coconut milk", "", weightValue: 400, weightUnit: "g"),
                Self.ingredient("2 Tbsp.", "fish sauce", "such as nam pla or nuoc nam", weightValue: 30, weightUnit: "g"),
                Self.ingredient("1 tsp.", "sugar", "", weightValue: 4, weightUnit: "g"),
                Self.ingredient("2", "stalks fresh lemongrass", "tough outer layers removed", weightValue: 40, weightUnit: "g"),
                Self.ingredient("to taste", "chili oil, cilantro leaves, lime wedges", "for serving")
            ],
            instructions: [
                "Prepare the lemongrass by removing tough outer layers and smashing slightly.",
                "In a large pot, combine chicken broth, lemongrass, ginger, and lime leaves. Bring to a simmer.",
                "Add chicken and mushrooms, and cook until chicken is cooked through.",
                "Stir in coconut milk, fish sauce, and sugar. Simmer for another 5-10 minutes.",
                "Remove lemongrass stalks and ginger pieces before serving.",
                "Serve with chili oil, cilantro, and lime wedges."
            ],
            tips: nil,
            coverImage: nil,
            category: "main",
            cuisine: "Thai",
            tags: nil,
            contributedBy: "August 11, 2013",
            familyPhoto: nil
        ),
        Recipe(
            id: 20,
            slug: "chicken-noodle-soup",
            title: "Chicken Noodle Soup",
            description: "A hearty, comforting chicken noodle soup featuring handmade meatballs with chicken-apple sausage.",
            story: "Recipe courtesy of Tyler Florence.",
            servings: 7,
            prepTime: 30,
            cookTime: 60,
            ingredients: [
                Self.ingredient("as needed", "extra-virgin olive oil", ""),
                Self.ingredient("3 cloves", "garlic", "smashed"),
                Self.ingredient("2 large", "carrots", "chopped"),
                Self.ingredient("1 medium", "onion", "chopped"),
                Self.ingredient("2 ribs", "celery", "sliced"),
                Self.ingredient("1", "bay leaf", ""),
                Self.ingredient("4", "fresh thyme sprigs", ""),
                Self.ingredient("3 quarts", "low-sodium chicken broth", ""),
                Self.ingredient("5", "parsley stems", "plus 1/4 cup finely chopped flat-leaf parsley for garnish"),
                Self.ingredient("4", "black peppercorns", ""),
                Self.ingredient("to taste", "kosher salt", ""),
                Self.ingredient("to taste", "grated Parmigiano-Reggiano", "for garnish"),
                Self.ingredient("1 medium", "onion", "diced (for meatballs)"),
                Self.ingredient("6 links", "organic chicken-apple sausage meat", "casings removed"),
                Self.ingredient("1", "egg", ""),
                Self.ingredient("1 tsp", "fresh thyme leaves", "")
            ],
            instructions: [
                "For the soup: In a large pot, heat olive oil over medium heat. Add garlic, carrots, onion, and celery. Cook until softened.",
                "Add bay leaf, thyme sprigs, peppercorns, and chicken broth. Bring to a boil, then reduce heat and simmer.",
                "For the meatballs: In a bowl, combine diced onion, sausage meat, egg, and thyme leaves. Form into small meatballs.",
                "Brown the meatballs in a separate skillet with a little olive oil, then add them to the simmering soup.",
                "Cook until meatballs are cooked through and flavors are melded.",
                "Stir in chopped parsley and season with salt. Serve with grated Parmigiano-Reggiano."
            ],
            tips: nil,
            coverImage: nil,
            category: "main",
            cuisine: "American",
            tags: nil,
            contributedBy: "Tyler Florence",
            familyPhoto: nil
        ),
        Recipe(
            id: 21,
            slug: "dairy-free-creme-brulee",
            title: "Dairy Free Creme Brulee",
            description: "A rich and creamy dairy-free version of the classic French dessert using coconut cream.",
            story: nil,
            servings: 4,
            prepTime: 20,
            cookTime: 45,
            ingredients: [
                Self.ingredient("1 can", "full fat coconut cream", "liquid removed", weightValue: 400, weightUnit: "g"),
                Self.ingredient("3 tsp", "vanilla extract", "can also use 1 vanilla bean", weightValue: 12, weightUnit: "g"),
                Self.ingredient("2/3 cup", "sugar", "can substitute with 1 cup coconut sugar", weightValue: 135, weightUnit: "g"),
                Self.ingredient("4", "egg yolks", "", weightValue: 72, weightUnit: "g"),
                Self.ingredient("2 quarts", "hot water", "for water bath", weightValue: 1800, weightUnit: "g")
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
            tips: nil,
            coverImage: nil,
            category: "dessert",
            cuisine: "French",
            tags: nil,
            contributedBy: "B. Britnell",
            familyPhoto: nil
        ),
        Recipe(
            id: 22,
            slug: "peach-cobbler",
            title: "Peach Cobbler",
            description: "A classic Southern-style peach cobbler with a bourbon-infused filling and buttery dumpling topping.",
            story: nil,
            servings: 8,
            prepTime: 25,
            cookTime: 45,
            ingredients: [
                Self.ingredient("8", "peaches", "peeled and sliced, about 6 to 8 cups", weightValue: 1200, weightUnit: "g"),
                Self.ingredient("1/4 cup", "bourbon", "", weightValue: 60, weightUnit: "g"),
                Self.ingredient("3/4 cup", "sugar", "plus more for dusting", weightValue: 150, weightUnit: "g"),
                Self.ingredient("2 Tbsp", "corn starch", "", weightValue: 16, weightUnit: "g"),
                Self.ingredient("1 tsp", "ground cinnamon", "", weightValue: 2, weightUnit: "g"),
                Self.ingredient("1 1/2 cups", "all-purpose flour", "", weightValue: 185, weightUnit: "g"),
                Self.ingredient("2 tsp", "baking powder", "", weightValue: 8, weightUnit: "g"),
                Self.ingredient("1/2 tsp", "kosher salt", "", weightValue: 3, weightUnit: "g"),
                Self.ingredient("16 Tbsp", "cold unsalted butter", "2 sticks", weightValue: 226, weightUnit: "g"),
                Self.ingredient("3/4 cup", "heavy cream", "plus more for brushing", weightValue: 180, weightUnit: "g")
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
            tips: nil,
            coverImage: nil,
            category: "dessert",
            cuisine: "Southern",
            tags: nil,
            contributedBy: nil,
            familyPhoto: nil
        ),
        Recipe(
            id: 23,
            slug: "aunt-vivians-sweet-potato-pie",
            title: "Aunt Vivian's Sweet Potato Pie",
            description: "A traditional, velvety sweet potato pie passed down through the family, featuring hints of nutmeg and lemon.",
            story: "A beloved family recipe from Aunt Vivian.",
            servings: 8,
            prepTime: 30,
            cookTime: 60,
            ingredients: [
                Self.ingredient("3 lb", "large sweet potato", "about 4 potatoes", weightValue: 1360, weightUnit: "g"),
                Self.ingredient("1 cup", "unsalted butter", "2 sticks, melted", weightValue: 226, weightUnit: "g"),
                Self.ingredient("2 1/2 cups", "sugar", "", weightValue: 500, weightUnit: "g"),
                Self.ingredient("1 tsp", "ground nutmeg", "", weightValue: 2, weightUnit: "g"),
                Self.ingredient("1 tsp", "ground cinnamon", "", weightValue: 2, weightUnit: "g"),
                Self.ingredient("1/2 tsp", "kosher salt", "", weightValue: 3, weightUnit: "g"),
                Self.ingredient("4 large", "eggs", "", weightValue: 200, weightUnit: "g"),
                Self.ingredient("1 Tbsp", "self-rising flour", "", weightValue: 8, weightUnit: "g"),
                Self.ingredient("1/4 cup", "buttermilk", "", weightValue: 60, weightUnit: "g"),
                Self.ingredient("1 tsp", "vanilla extract", "", weightValue: 4, weightUnit: "g"),
                Self.ingredient("1 tsp", "lemon extract", "", weightValue: 4, weightUnit: "g"),
                Self.ingredient("3", "frozen prepared pie crusts", "unbaked")
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
            tips: nil,
            coverImage: nil,
            category: "dessert",
            cuisine: "Southern",
            tags: nil,
            contributedBy: "Aunt Vivian",
            familyPhoto: nil
        ),
        Recipe(
            id: 24,
            slug: "better-than-zacharys-gf-deep-dish",
            title: "Better than Zachary's Gluten-Free Stuffed Deep Dish Pizza",
            description: "A phenomenal Chicago-style stuffed deep dish pizza that is entirely gluten-free. Using Caputo Fioreglut flour, this recipe achieves a buttery, crisp crust that rivals traditional wheat-based deep dish. It's layered with plenty of mozzarella, spinach, and mushrooms, then topped with a rich tomato sauce.",
            story: "Inspired by the legendary Zachary's Chicago Pizza in the Bay Area, this version was developed to provide a truly satisfying gluten-free alternative. By using professional-grade Italian gluten-free flour (Caputo Fioreglut) and the 'stuffed' technique from Lucia's, this pizza has become a family favorite that even non-GF eaters prefer.",
            servings: 4,
            prepTime: 120,
            cookTime: 45,
            ingredients: [
                Self.ingredient("600g", "Caputo Fioreglut Gluten Free Flour", "Specifically the 'Fioreglut' blend for best results", weightValue: 600, weightUnit: "g"),
                Self.ingredient("500g", "Water", "Lukewarm (approx 105-110°F)", weightValue: 500, weightUnit: "g"),
                Self.ingredient("1.5g", "Active Dry Yeast", "Approx 1/2 teaspoon", weightValue: 1.5, weightUnit: "g"),
                Self.ingredient("15g", "Salt", "Fine sea salt", weightValue: 15, weightUnit: "g"),
                Self.ingredient("5g", "Olive Oil", "Plus more for greasing the bowl", weightValue: 5, weightUnit: "g"),
                Self.ingredient("1 tbsp", "Sugar", "To help with browning"),
                Self.ingredient("50g", "Unsalted Butter", "Softened, for greasing the deep dish pan", weightValue: 50, weightUnit: "g"),
                Self.ingredient("400g", "Mozzarella Cheese", "Shredded or sliced", weightValue: 400, weightUnit: "g"),
                Self.ingredient("100g", "Fresh Spinach", "Cooked down and squeezed dry", weightValue: 100, weightUnit: "g"),
                Self.ingredient("100g", "Mushrooms", "Sliced and sautéed until moisture is released", weightValue: 100, weightUnit: "g"),
                Self.ingredient("800g", "Crushed Tomatoes", "Preferably Bianco DiNapoli for the sauce", weightValue: 800, weightUnit: "g"),
                Self.ingredient("to taste", "Dried Oregano and Basil", "For the sauce seasoning")
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
            tips: nil,
            coverImage: nil,
            category: "main",
            cuisine: "American",
            tags: nil,
            contributedBy: "Bosko",
            familyPhoto: nil
        ),
        Recipe(
            id: 25,
            slug: "southern-buttermilk-cornbread",
            title: "Southern Buttermilk Cornbread with Honey Butter",
            description: "YouTube-imported and Kante-family-adapted cornbread. Gluten-free Bob's Red Mill flour/cornmeal, goat yogurt + oat milk for buttermilk, and goat butter.",
            story: "Adapted from ThatGirlCanCook!'s YouTube recipe: https://www.youtube.com/watch?v=S6MbbZm06ak",
            servings: 8,
            prepTime: 10,
            cookTime: 20,
            ingredients: [
                Self.ingredient("1.5 cups", "Bob's Red Mill gluten-free cornmeal"),
                Self.ingredient("1 cup", "Bob's Red Mill gluten-free 1-to-1 flour"),
                Self.ingredient("3.5 tsp", "baking powder"),
                Self.ingredient("1 pinch", "salt"),
                Self.ingredient("1/4 cup", "sugar", "optional"),
                Self.ingredient("2 large", "eggs"),
                Self.ingredient("2/3 cup", "goat yogurt thinned with oat milk", "sub for buttermilk"),
                Self.ingredient("2 tbsp", "vegetable oil"),
                Self.ingredient("2 tbsp", "goat butter"),
                Self.ingredient("1 tbsp", "Duke's mayonnaise", "secret moisture ingredient")
            ],
            instructions: [
                "Preheat oven to 350°F. Melt goat butter + oil in an 8-inch cast iron skillet in the oven (2-3 min).",
                "Whisk cornmeal, flour, baking powder, and salt in a bowl.",
                "Whisk in eggs and goat-yogurt/oat-milk mix until combined.",
                "Add melted butter/oil mix and mayonnaise, then stir just until smooth.",
                "Pour batter into hot skillet and bake 18-20 minutes.",
                "Optional: brush top with honey butter, broil 2-3 minutes for deeper color."
            ],
            tips: "Goat yogurt gives the buttermilk tang. Watch closely during broil so top doesn't burn.",
            coverImage: "https://img.youtube.com/vi/S6MbbZm06ak/maxresdefault.jpg",
            category: "side",
            cuisine: "Southern",
            tags: ["cornbread", "gluten-free", "youtube-import", "kante-family"],
            contributedBy: "ThatGirlCanCook! (Kante adaptation)",
            familyPhoto: nil,
            youtubeUrl: "https://www.youtube.com/watch?v=S6MbbZm06ak"
        )
        ]
    }
}
