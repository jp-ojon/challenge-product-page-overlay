import { Locator, Page } from '@playwright/test'

/**
 * This method verifies if an array of strings that contains the expected colors, can be found within src attribute values of each color input
 * @param expectedColors 
 * @param foundColors 
 * @returns true or false
 */
export async function ColorChecker(expectedColors: string[], foundColors: Map<string, string>): Promise<boolean> {
    // Check if all expected colors are found in the set of file paths within the src attribute
    const allColorsFound = expectedColors.every(color => {
        const found = Array.from(foundColors.keys()).some(path => {
            const pathIncludesColor = path.includes(color)
            console.log(`Checking if path "${path}" includes color "${color}": ${pathIncludesColor}`)
            return pathIncludesColor
        })
        console.log(`Color "${color}" found: ${found}`)
        return found
    })

    if (allColorsFound) {
        console.log('All expected colors are found in the foundSrcsColors.')
        return true
    } else {
        console.log('Some expected colors are missing in the foundSrcsColors.')
        return false
    }
}

/**
 * This method verifies if an array of strings that contains the expected sizes, can be found within text values of each Size with tag <Button>
 * @param sizeButtons 
 * @param expectedSizes 
 * @returns true or false
 */
export async function SizeChecker(sizeButtons: Locator, expectedSizes: string[]): Promise<boolean> {
    const foundSizes = new Set<string>()
    const unexpectedSizes = new Set<string>()
    let allExpectedSizesFound = true

    // Get the count of buttons
    const buttonCount = await sizeButtons.count()

    for (let i = 0; i < buttonCount; i++) {
        const button = sizeButtons.nth(i)
        const sizeContent = await button.textContent()
        const size = sizeContent ? sizeContent.trim() : ''

        if (expectedSizes.includes(size)) {
            foundSizes.add(size)
            console.log("Size Found: " + size)
        } else {
            // If any size not in expectedSizes is found
            unexpectedSizes.add(size)
            console.log("Size Not Found: " + size)
            allExpectedSizesFound = false
        }
    }

    // Log sizes for debugging
    console.log("foundSizes: " + Array.from(foundSizes))
    console.log("unexpectedSizes: " + Array.from(unexpectedSizes))

    // Check if all expected sizes are found and no unexpected sizes are present
    return allExpectedSizesFound && expectedSizes.length === foundSizes.size && unexpectedSizes.size === 0
}

/**
 * This method would counter check two maps if they are identical in terms of size, keys, and values.
 * @param map1 
 * @param map2 
 * @returns 
 */
export async function areMapsNotEqualChecker(map1: Map<string, string>, map2: Map<string, string>): Promise<boolean> {
    if (map1.size !== map2.size) {
        return true // Maps have different sizes
    }

    for (const [key, value] of map1) {
        if (!map2.has(key) || map2.get(key) !== value) {
            return true // Maps differ in key presence or value
        }
    }

    return false // Maps are identical
}

/**
 * This method would read thru all the Size buttons, and also extract the disabled attribute if it is present or not.
 * @param productPage 
 * @returns availableSizes
 */
export async function getAvailableSizes(productPage: any): Promise<Map<string, string>> {
    const availableSizes = new Map<string, string>()
    const count = await productPage.getSizesCount()
    // Iterate over each size input element and check its status
    for (let i = 0; i < count; i++) {
        const input = await productPage.getSize(i) // Retrieve the size input element
        const size = await input.textContent() // Get the size text
        const disabled = await input.getAttribute('disabled') // Check if the size is disabled

        let status = 'enabled' // Default to 'enabled'
        if (disabled !== null) {
            status = 'disabled' // Mark as disabled if the attribute exists
        }

        console.log(`Size: ${size}, Status: ${status}`)
        
        // If size exists, add to the Map
        if (size) {
            availableSizes.set(size.trim(), status) // Add size and its status to the map
        }
    }

    return availableSizes // Return the map with sizes and statuses
}