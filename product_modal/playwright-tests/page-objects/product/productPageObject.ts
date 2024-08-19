import { Locator, Page } from "@playwright/test"

export class ProductPageObject {
    readonly page: Page
    private color: string
    productImage!: Locator
    readonly productPageOverlay: Locator
    productPageOverlayImages!: Locator
    readonly productPageOverlayProductName: Locator
    readonly productPageOverlayProductColor!: Locator
    readonly productPageOverlayProductColors: Locator
    readonly productPageOverlayProductSizes: Locator
    readonly productPageOverlayProductPrice: Locator
    productPageOverlayTab!: Locator
    productPageOverlayProductInfoTabContent: Locator
    readonly productPageOverlayFooter: Locator
    readonly productPageOverlayFooterName: Locator
    readonly productPageOverlayFooterAddToCartButton: Locator

    constructor(page: Page, imgColor: string) {
        this.page = page
        this.color = imgColor
        this.productPageOverlay = this.page.locator('div.shared-modal')
        this.productPageOverlayProductName = this.productPageOverlay.locator('//div[@class="product-detail__name"]')
        this.productPageOverlayProductColors = this.productPageOverlay.locator('//div[contains(@class,"product-detail__color-options")]//input')
        this.productPageOverlayProductSizes = this.productPageOverlay.locator('//div[contains(@class,"product-detail__size-options")]//button')
        this.productPageOverlayProductPrice = this.productPageOverlay.locator('//div[@class="product-detail__price"]')
        this.productPageOverlayProductInfoTabContent = this.productPageOverlay.locator('//div[@class="product-info__tab-content"]')
        this.productPageOverlayFooter = this.productPageOverlay.locator('//footer[@class="product-sticky-footer"]')
        this.productPageOverlayFooterName = this.productPageOverlayFooter.locator('.product-sticky-footer__name')
        this.productPageOverlayFooterAddToCartButton = this.productPageOverlayFooter.locator('.product-sticky-footer__add-cart-button')

        this.updateLocators()
    }

    // Method to update locators based on the current color.
    private async updateLocators() {
        const imgColor = this.color.toUpperCase()
        this.productImage = this.page.locator(`//img[contains(@src, "${imgColor}")]`)
        this.productPageOverlayImages = this.productPageOverlay.locator(`//img[contains(@src, "${imgColor}")]`)
    }

    /**
     * Setter method to update the color and corresponding locators.
     * @param newColor
     */
    async setColor({ newColor }: { newColor: string }) {
        this.color = newColor
        this.updateLocators()  // Update locators based on new color
    }

    /**
     * This method will select a product color within the overlay, based on the input color.
     * @param imgColor 
     */
    async clickProductPageOverlayProductColor(imgColor: string) {
        const uppercaseValue = imgColor.toUpperCase()  // Convert value to uppercase
        const xpathExpression = `//div[contains(@class,"product-detail__color-options")]//input[contains(@alt,'.webp') and contains(@alt,'${uppercaseValue}')]`
        this.productPageOverlayTab = this.productPageOverlay.locator(xpathExpression)
        await this.productPageOverlayTab.click()
    }

    /**
     * This method would select a Tab within the Product Page Overlay, based on the input value.
     * @param value 
     */
    async clickProductPageOverlayTab(value: string) {
        const uppercaseValue = value.toUpperCase()  // Convert value to uppercase
        const xpathExpression = `//li[contains(@class, "product-info__tab-item") and contains(text(), "${uppercaseValue}")]`
        this.productPageOverlayTab = this.productPageOverlay.locator(xpathExpression)
        await this.productPageOverlayTab.click()
    }

    async clickProductImage() {
        await this.productImage.click()
    }

    /**
     * Method to get the count of images based on what is displayed
     * @returns count of images
     */
    async getImageCount(): Promise<number> {
        return await this.productPageOverlayImages.count()
    }

    /**
     * Method to get an image locator by index
     * @param index 
     * @returns Locator
     */
    async getImage(index: number): Promise<Locator> {
        return this.productPageOverlayImages.nth(index)
    }

    /**
     * Method to get the count of colors based on what is displayed
     * @returns count of colors
     */
    async getColorsCount(): Promise<number> {
        return await this.productPageOverlayProductColors.count()
    }

    /**
     * Method to get a color locator by index
     * @param index 
     * @returns Locator
     */
    async getColor(index: number): Promise<Locator> {
        return this.productPageOverlayProductColors.nth(index)
    }

    /**
     * Method to get the count of sizes based on the available buttons
     * @returns count of Sizes
     */
    async getSizesCount(): Promise<number> {
        return await this.productPageOverlayProductSizes.count()
    }

    /**
     * Method to get a size locator by index
     * @param index 
     * @returns Locator
     */
    async getSize(index: number): Promise<Locator> {
        return this.productPageOverlayProductSizes.nth(index)
    }
}