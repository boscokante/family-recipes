//
//  RecipeUtils.swift
//  family-recipes
//
//  Created by Bosco "Bosko" Kante on 1/26/26.
//

import Foundation

struct RecipeUtils {
    static func scaleAmount(_ amount: String, by scale: Double) -> String {
        if scale == 1.0 { return amount }
        
        // Regex to find numbers (including fractions like 1/2 or decimals like 1.5)
        // This is a simplified version. For a production app, you'd want a more robust parser.
        let pattern = #"(\d+\s+\d+/\d+|\d+/\d+|\d+\.\d+|\d+)"#
        
        guard let regex = try? NSRegularExpression(pattern: pattern) else { return amount }
        
        let nsString = amount as NSString
        let matches = regex.matches(in: amount, range: NSRange(location: 0, length: nsString.length))
        
        var result = amount
        var offset = 0
        
        for match in matches {
            let range = match.range
            let matchString = nsString.substring(with: range)
            
            if let value = parseValue(matchString) {
                let scaledValue = value * scale
                let scaledString = formatValue(scaledValue)
                
                let start = result.index(result.startIndex, offsetBy: range.location + offset)
                let end = result.index(start, offsetBy: range.length)
                
                result.replaceSubrange(start..<end, with: scaledString)
                offset += (scaledString.count - range.length)
            }
        }
        
        return result
    }
    
    private static func parseValue(_ string: String) -> Double? {
        // Handle mixed numbers like "1 1/2"
        if string.contains(" ") && string.contains("/") {
            let parts = string.split(separator: " ")
            if parts.count == 2, let whole = Double(parts[0]), let fraction = parseFraction(String(parts[1])) {
                return whole + fraction
            }
        }
        
        // Handle fractions like "1/2"
        if string.contains("/") {
            return parseFraction(string)
        }
        
        // Handle decimals and integers
        return Double(string)
    }
    
    private static func parseFraction(_ string: String) -> Double? {
        let parts = string.split(separator: "/")
        if parts.count == 2, let numerator = Double(parts[0]), let denominator = Double(parts[1]) {
            return numerator / denominator
        }
        return nil
    }
    
    private static func formatValue(_ value: Double) -> String {
        // If it's a whole number, return as integer string
        if value.truncatingRemainder(dividingBy: 1) == 0 {
            return String(format: "%.0f", value)
        }
        
        // Try to convert back to common fractions for better UX
        let remainder = value.truncatingRemainder(dividingBy: 1)
        let whole = Int(value)
        
        let fraction: String?
        switch remainder {
        case 0.125: fraction = "1/8"
        case 0.25: fraction = "1/4"
        case 0.333...0.334: fraction = "1/3"
        case 0.375: fraction = "3/8"
        case 0.5: fraction = "1/2"
        case 0.625: fraction = "5/8"
        case 0.666...0.667: fraction = "2/3"
        case 0.75: fraction = "3/4"
        case 0.875: fraction = "7/8"
        default: fraction = nil
        }
        
        if let f = fraction {
            return whole == 0 ? f : "\(whole) \(f)"
        }
        
        // Fallback to decimal
        return String(format: "%.2f", value).replacingOccurrences(of: ".00", with: "")
    }
    
    // MARK: - Weight Conversion
    
    /// Converts volume measurements to weight in grams
    /// Returns nil if conversion isn't possible (e.g., "2 large eggs", "1 pinch")
    static func convertToWeight(amount: String, ingredientName: String) -> (value: Double, unit: String)? {
        // Parse the numeric value from the amount
        let pattern = #"(\d+\s+\d+/\d+|\d+/\d+|\d+\.\d+|\d+)"#
        guard let regex = try? NSRegularExpression(pattern: pattern) else { return nil }
        
        let nsString = amount as NSString
        let matches = regex.matches(in: amount, range: NSRange(location: 0, length: nsString.length))
        guard let firstMatch = matches.first else { return nil }
        
        let matchString = nsString.substring(with: firstMatch.range)
        guard let numericValue = parseValue(matchString) else { return nil }
        
        // Determine the unit from the amount string
        let amountLower = amount.lowercased()
        let ingredientLower = ingredientName.lowercased()
        
        // Extract unit
        let unit: String? = {
            if amountLower.contains("cup") { return "cup" }
            if amountLower.contains("tbsp") || amountLower.contains("tablespoon") { return "tbsp" }
            if amountLower.contains("tsp") || amountLower.contains("teaspoon") { return "tsp" }
            if amountLower.contains("oz") || amountLower.contains("ounce") { return nil } // Already weight
            if amountLower.contains("g") || amountLower.contains("gram") { return nil } // Already weight
            if amountLower.contains("lb") || amountLower.contains("pound") { return nil } // Already weight
            return nil
        }()
        
        guard let volumeUnit = unit else { return nil }
        
        // Get density factor based on ingredient name
        let density = densityForIngredient(ingredientLower)
        
        // Convert to grams
        let gramsPerUnit: Double = {
            switch volumeUnit {
            case "cup": return 240.0 * density
            case "tbsp": return 15.0 * density
            case "tsp": return 5.0 * density
            default: return 0
            }
        }()
        
        let weightInGrams = numericValue * gramsPerUnit
        return (weightInGrams, "g")
    }
    
    /// Returns density factor (relative to water = 1.0) for common ingredients
    private static func densityForIngredient(_ name: String) -> Double {
        // Flour and dry goods
        if name.contains("flour") {
            if name.contains("cornmeal") { return 0.62 }
            if name.contains("almond") { return 0.96 }
            if name.contains("coconut") { return 0.48 }
            return 0.53 // AP flour, gluten-free flour
        }
        if name.contains("cornmeal") || name.contains("corn meal") { return 0.62 }
        if name.contains("sugar") {
            if name.contains("brown") { return 0.93 }
            if name.contains("powdered") || name.contains("confectioner") { return 0.48 }
            return 0.85 // granulated
        }
        if name.contains("salt") { return 1.22 }
        if name.contains("baking powder") { return 0.9 }
        if name.contains("baking soda") { return 0.96 }
        if name.contains("cocoa") { return 0.52 }
        if name.contains("oats") || name.contains("oat") { return 0.34 }
        
        // Liquids and fats
        if name.contains("oil") { return 0.92 }
        if name.contains("butter") || name.contains("margarine") { return 0.96 }
        if name.contains("milk") { return 1.03 }
        if name.contains("water") { return 1.0 }
        if name.contains("yogurt") { return 1.03 }
        if name.contains("sour cream") { return 1.0 }
        if name.contains("mayonnaise") { return 0.98 }
        if name.contains("honey") { return 1.42 }
        if name.contains("syrup") { return 1.33 }
        if name.contains("molasses") { return 1.4 }
        
        // Nuts and seeds
        if name.contains("nut") {
            if name.contains("peanut") { return 0.53 }
            if name.contains("almond") { return 0.46 }
            return 0.5 // general nuts
        }
        
        // Grains and rice
        if name.contains("rice") {
            if name.contains("cooked") { return 0.74 }
            return 0.85 // uncooked
        }
        
        // Default to flour density for unknown dry ingredients
        return 0.6
    }
}
