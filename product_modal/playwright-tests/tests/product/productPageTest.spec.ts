import { test, expect, Locator } from '@playwright/test'
import { ProductPageObject } from '../../page-objects/product/productPageObject'
import { baseURL } from '../../playwright.config'
import { ColorChecker, SizeChecker, areMapsNotEqualChecker, getAvailableSizes } from '../../utilities/GeneralUtilities'
import { readJSONTestData } from '../../utilities/Reader'

test.describe('Product Page Tests', () => {

    let count: number //used in general to store count and be used for looping.
    let testData: any //for storing test data from json files.
    let testData2: any //for storing test data from json files.
    let locatorsList: Locator[] //for general storing of a list of locators, for later verification.

    test.beforeAll(async () => {
        //Read test data .json files to be used for later verification.
        testData = await readJSONTestData('whiteTshirtProductData.json')
        testData2 = await readJSONTestData('navyTshirtProductData.json')
    })

    test.beforeEach(async ({ page }) => {
        //Step 1: Navigate to the URL, depends on environment.
        //await page.goto('http://localhost:8080/')
        await page.goto(baseURL)
        await page.waitForLoadState('load')
    })

    test('Test Case 1: Product Page Overlay Options and Article Details', async ({ page }) => {
        const productPage = new ProductPageObject(page, testData.Color)

        //Step 2: Click on product image to open overlay, verify if Product Page Overlay is visible.
        await productPage.clickProductImage() //**Bug B-0001 still present**
        await expect(productPage.productPageOverlay, "Product Page Overlay is not visible").toBeVisible()

        /*
        Step 3: The page must contain at least the following information:
        Pictures of the article
        Name of the article
        Available colors of the article
        Available sizes of the article
        Retail prices of the article
        The footer in the overlay should be sticky
        */
        //Verify Pictures of the article. Images count should be as expected.
        await expect(productPage.productPageOverlayImages, "Number of available Pictures of the article on the Product Page Overlay should be as expected").toHaveCount(testData.NumberOfImages)

        // Array to hold the image locators, and then populate
        locatorsList = [] // empty list before usage
        count = await productPage.getImageCount()
        for (let i = 0; i < count; i++) {
            locatorsList.push(await productPage.getImage(i))
        }

        // Assert that each image has the correct color and style properties.
        for (const image of locatorsList) {
            const src = await image.getAttribute('src')
            expect(src).toContain(testData.Color)
            const style = await image.evaluate(element => element.style.cssText)
            expect(style).toContain('height: auto; width: 100vw; object-fit: contain')
        }
        
        //Verify Name of the article.
        await expect(productPage.productPageOverlayProductName).toContainText(testData.ProductName)
        //Verify Currency only.
        await expect(productPage.productPageOverlayProductPrice).toContainText(testData.Currency)
        //Verify Retail prices of the article. Amount and Currency together.
        const price = testData.Value + " " + testData.Currency
        await expect.soft(productPage.productPageOverlayProductPrice, "Price Value and Currency should be as expected").toContainText(price)

        //Get all available src Colors on the Product Page Overlay.
        const foundSrcsColors = new Map<string, string>() // Use a Set to store found srcs.
        count = await productPage.getColorsCount()
        // Iterate over each input element and check the src.
        for (let i = 0; i < count; i++) {
            const input = await productPage.getColor(i)
            const src = await (input).getAttribute('src')
            const className = await (input).getAttribute('class')
            if (src) {
                foundSrcsColors.set(src, className || '')
            }
        }

        //Veify Available colors of the article. Counter check expected SrcsColors against the foundSrcsColors.
        const colorChecker = await ColorChecker(testData.SrcsColors, foundSrcsColors)
        expect(colorChecker).toBeTruthy()

        //Verify the selected color contains the correct class value. "border-black" if selected, "border-border-secondary" if not selected.
        foundSrcsColors.forEach((classValue, src) => {
            if (src.includes(testData.Color)) {
                // Check if the class contains "border-black".
                console.log(`Checking src "${src}" for "${testData.Color}" and class for "border-black".`)
                expect(classValue, `The class for "${src}" should contain "border-black"`).toContain("border-black")
            } else {
                // Check if the class contains "border-border-secondary".
                console.log(`Checking src "${src}" does not contain "${testData.Color}" and class for "border-border-secondary".`)
                expect(classValue, `The class for "${src}" should contain "border-border-secondary"`).toContain("border-border-secondary")
            }
        })

        //Get all available Size Buttons on the Product Page Overlay.
        const availableSizes = productPage.productPageOverlayProductSizes
        //Verify available sizes of the article. Counter check expected Sizes against the availableSizes.
        const sizeChecker = await SizeChecker(availableSizes, testData.Sizes)
        expect(sizeChecker).toBe(true)

        //Verify if the footer in the overlay is sticky. Article name and call to action also displayed properly.
        //Check if the footer has a `position` of `sticky`. Should not be static, relative, absolute, fixed. And if element is within viewport without scrolling.
        const position = await productPage.productPageOverlayFooter.evaluate(el => getComputedStyle(el).position)
        expect.soft(position).toBe('sticky') //**Bug B-0002 still present**
        await expect.soft(productPage.productPageOverlayFooter).toBeInViewport() //**Bug B-0002 still present**

        //Verify if correct text is displayed on the footer.
        expect(await productPage.productPageOverlayFooterName.textContent()).toContain(testData.ProductName)
        expect(await productPage.productPageOverlayFooterAddToCartButton.textContent()).toContain("Add to Cart")
        await expect(productPage.productPageOverlayFooterAddToCartButton).toBeVisible()

        /*Step 4: Verify contents of each Tab.
        Additionally there should be a tab section with even more details about the article:
        Product details
        Product fit
        Material and care instructions
        Information on sustainability
        */
        await productPage.clickProductPageOverlayTab('Details')
        const allTextContentsDetails = await productPage.productPageOverlayProductInfoTabContent.allTextContents()
        console.log(allTextContentsDetails)
        testData.Details.forEach((expectedValue: any) => {
            const foundValue = allTextContentsDetails.some(text => text.includes(expectedValue))
            expect(foundValue).toBe(true)  // Assert that the expected value exists.
        })

        await productPage.clickProductPageOverlayTab('Fit')
        const allTextContentsFit = await productPage.productPageOverlayProductInfoTabContent.allTextContents()
        console.log(allTextContentsFit)
        testData.Fit.forEach((expectedValue: any) => {
            const foundValue = allTextContentsFit.some(text => text.includes(expectedValue))
            expect(foundValue).toBe(true)  // Assert that the expected value exists.
        })

        await productPage.clickProductPageOverlayTab('Material')
        const allTextContentsMaterial = await productPage.productPageOverlayProductInfoTabContent.allTextContents()
        console.log(allTextContentsMaterial)
        testData.Material.forEach((expectedValue: any) => {
            const foundValue = allTextContentsMaterial.some(text => text.includes(expectedValue))
            expect(foundValue).toBe(true)  // Assert that the expected value exists.
        })

        await productPage.clickProductPageOverlayTab('Sustainability')
        const allTextContentsSustainability = await productPage.productPageOverlayProductInfoTabContent.allTextContents()
        console.log(allTextContentsSustainability)
        testData.Sustainability.forEach((expectedValue: any) => {
            const foundValue = allTextContentsSustainability.some(text => text.includes(expectedValue))
            expect(foundValue).toBe(true)  // Assert that the expected value exists.
        })
    })

    test('Test Case 2: Click on a different color changes the slideshow images as well as the availabilities of the sizes', async ({ page }) => {   
        const productPage = new ProductPageObject(page, testData.Color)

        //Step 2: Click on product image to open overlay, verify if Product Page Overlay is visible.
        await productPage.clickProductImage() //**Bug B-0001 still present**
        await expect(productPage.productPageOverlay, "Product Page Overlay is not visible").toBeVisible()
    
        //Step 3: Verify Pictures of the article. Images count should be as expected.
        await expect(productPage.productPageOverlayImages, "Number of available Pictures of the article on the Product Page Overlay should be as expected").toHaveCount(testData.NumberOfImages)

        // Array to hold the image locators, and then populate.
        locatorsList = [] // empty list before usage
        count = await productPage.getImageCount()
        for (let i = 0; i < count; i++) {
            locatorsList.push(await productPage.getImage(i))
        }

        // Assert that each image has the correct color and style properties.
        for (const image of locatorsList) {
            const src = await image.getAttribute('src')
            console.log(src)
            expect(src).toContain(testData.Color)
            const style = await image.evaluate(element => element.style.cssText)
            expect(style).toContain('height: auto; width: 100vw; object-fit: contain')
        }

        let availableSizesFirst = new Map<string, string>()// Use a Set to store found Sizes.
        availableSizesFirst = await getAvailableSizes(productPage)

        //Step 4: Select a different color.
        await productPage.clickProductPageOverlayProductColor(testData2.Color)

        // Override the color with testData2.Color.
        await productPage.setColor({ newColor: testData2.Color })

        //Step 5: Verify Pictures of the article. Images count should be as expected.
        await expect(productPage.productPageOverlayImages, "Number of available Pictures of the article on the Product Page Overlay should be as expected").toHaveCount(testData2.NumberOfImages)

        // Array to hold the image locators, and then populate.
        locatorsList = [] // empty list before usage
        count = await productPage.getImageCount()
        for (let i = 0; i < count; i++) {
            locatorsList.push(await productPage.getImage(i))
        }

        // Assert that each image has the correct color and style properties.
        for (const image of locatorsList) {
            const src = await image.getAttribute('src')
            console.log(src)
            expect(src).toContain(testData2.Color)
            const style = await image.evaluate(element => element.style.cssText)
            expect(style).toContain('height: auto; width: 100vw; object-fit: contain')
        }

        let availableSizesSecond = new Map<string, string>()// Use a Set to store found Sizes.
        availableSizesSecond = await getAvailableSizes(productPage)

        //Step 6: Verify if the availabilities of the Sizes change between different colors.
        console.log(availableSizesFirst)
        console.log(availableSizesSecond)
        const mapsAreNotEqual = await areMapsNotEqualChecker(availableSizesFirst, availableSizesSecond)
        expect(mapsAreNotEqual).toBe(true)
    })
})