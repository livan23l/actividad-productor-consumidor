export class Character {
    constructor(charId, section, variant) {
        // Logic elements
        this._MAXCELLS = 25
        this._currentCell = 0

        // Face elements
        this._person = document.getElementById(charId)
        this._leftEye = this._person.querySelector(".eyes__left")
        this._rightEye = this._person.querySelector(".eyes__right")
        this._mouth = this._person.querySelector(".mouth")
        this._comment = this._person.querySelector(".character__comment")

        // Flags
        this._overflow = false
        this._animated = false

        // Events
        const blinkClass = "eyes--blinking"
        const blink = () => {
            this._leftEye.classList.add(blinkClass)
            this._rightEye.classList.add(blinkClass)
        }

        // Event for when the blink animation ends
        this._rightEye.addEventListener("animationend", () => {
            this._leftEye.classList.remove(blinkClass)
            this._rightEye.classList.remove(blinkClass)

            // Seconds between 3 and 7 are randomly selected
            const seconds = Math.floor((Math.random() * 5) + 3) * 1000

            // After the randomly selected time, there will be a blink if it's
            // still animated
            if (this._animated) {
                setTimeout(blink, seconds)
            }
        })

        // Event for the manual simulation options
        const options1Query = '[data-action="character-options-1"]'
        const options2Query = '[data-action="character-options-2"]'
        const options1 = this._person.querySelector(options1Query).querySelector("button")
        const options2 = this._person.querySelector(options2Query).querySelectorAll("button")

        // Wake up button
        options1.addEventListener("click", () => {
            let opposite = variant == 1 ? 2 : 1
            if (section.classList.contains(`simulation--${opposite}`)) {
                this._showLock()
            } else {
                this._lockSection(section, variant)
            }
        })

        // Action button
        options2[0].addEventListener("click", () => {
            this._toggleActionMenu()
        })

        // Sleep button
        options2[1].addEventListener("click", () => {
            this._unlockSection(section, variant)
        })

        // Events for the action menu
        const actionMenuAttribute = '[data-action="action-menu"]'
        const actionMenu = this._person.querySelector(actionMenuAttribute)
        const actionAmountP = actionMenu.querySelector("p")
        const buttonMinus = actionMenu.querySelector(".action__minus")
        const buttonPlus = actionMenu.querySelector(".action__plus")
        const minValue = 2
        const maxValue = 5
        const buttonAction = actionMenu.querySelector(".action__button")

        // Minus button
        buttonMinus.addEventListener("click", () => {
            let actionAmount = Number(actionAmountP.innerText)
            if (actionAmount == minValue) return

            actionAmount--
            actionAmountP.innerText = actionAmount
        })

        // Plus button
        buttonPlus.addEventListener("click", () => {
            let actionAmount = Number(actionAmountP.innerText)
            if (actionAmount == maxValue) return

            actionAmount++
            actionAmountP.innerText = actionAmount
        })

        // Action Button
        buttonAction.addEventListener("click", () => {
            let actionAmount = Number(actionAmountP.innerText)
            let typeAction = buttonAction.innerText.toLowerCase()
            this._action(section, typeAction, actionAmount)
        })
    }

    _verifyCurrentCell() {
        this._currentCell = this._currentCell == this._MAXCELLS ? 0 : this._currentCell
    }

    _showComment(comment) {
        // Show the character comment
        this._comment.innerText = comment
        this._comment.classList.remove("character__comment--hidden")

        // Show the mouth animation
        this._mouth.classList.add("mouth--open")
    }

    _hideComment() {
        this._comment.classList.add("character__comment--hidden")
        this._mouth.classList.remove("mouth--open")
    }

    _privateAppendProduct(section, delay = 0) {
        // Get a copy of the product from the template
        const productTemplate = document.getElementById("template-product").content
        const product = productTemplate.cloneNode(true).querySelector(".product")

        // Set the animation and animation delay
        product.style.animationDelay = `${delay}ms`
        product.classList.add("product--show")

        // Append the product in the document
        section.children[this._currentCell++].appendChild(product)

        this._verifyCurrentCell()
    }

    _privateRemoveProduct(section, delay = 0) {
        // Get the cell from which the product will be removed
        const cell = section.children[this._currentCell++]
        const product = cell.firstElementChild

        // Remove the "show" animation and show the "hide" animation
        product.classList.remove("product--show")
        product.classList.add("product--hide")

        // Reconfigure the animation delay
        product.style.animationDelay = `${delay}ms`

        // When the animation ends, the product will be removed
        product.addEventListener("animationend", function() {
            cell.removeChild(product)
        })

        this._verifyCurrentCell()
    }

    startAnimation() {
        const blinkClass = "eyes--blinking"
        const lookClass = "eyes--looking"

        // Add the looking animation loop
        this._leftEye.classList.add(lookClass)
        this._rightEye.classList.add(lookClass)

        // First blink
        this._leftEye.classList.add(blinkClass)
        this._rightEye.classList.add(blinkClass)
        this._animated = true
    }

    endAnimation() {
        const lookClass = "eyes--looking"

        this._leftEye.classList.remove(lookClass)
        this._rightEye.classList.remove(lookClass)

        this._animated = false
    }

    reset() {
        this._currentCell = 0
    }

    _privateAppendOrRemove(section, currentProducts, type, number) {
        // Variable that saves if there is a delay (due to overflow)
        let delay = 0

        // The amount of products is randomly selected if it has not been not
        // previously defined
        let amount = number ?? Math.floor(Math.random() * 4 + 2)  // Between 2 and 5

        // Select the configurations according to the type
        let commentAction, privateMethod, verification, overflowAmount

        if (type == "append") {
            commentAction = "agregar"
            verification = currentProducts + amount > this._MAXCELLS
            overflowAmount = this._MAXCELLS - currentProducts
            privateMethod = this._privateAppendProduct.bind(this)
        } else if (type == "remove") {
            commentAction = "quitar"
            verification = currentProducts - amount < 0
            overflowAmount = currentProducts
            privateMethod = this._privateRemoveProduct.bind(this)
        }

        // Show the comment
        this._showComment(`Voy a ${commentAction} ${amount} productos`)

        // Verify if the selected amount is valid
        if (verification) {
            amount = overflowAmount
            this._overflow = true
        }

        // After 1.3 seconds, the products will be added
        setTimeout(() => {
            for (let i = 0; i < amount; i++) {
                privateMethod(section, 100 * i)
            }
        }, 1300)

        // After 2.05 seconds, the comment will desappear
        setTimeout(() => {
            this._hideComment()
        }, 2050)

        // If there is an overflow, another message will be displayed
        if (this._overflow) {
            this._overflow = false
            delay = 2150

            // Show the message after 2.5 seconds
            setTimeout(() => {
                if (amount > 1) {
                    this._showComment(`Solo pude ${commentAction} ${amount} productos`)
                } else if (amount == 1) {
                    this._showComment(`Solo pude ${commentAction} un producto`)
                } else {
                    this._showComment(`No pude ${commentAction} ningún producto`)
                }
            }, 2500)

            // Hide the message after 4 seconds
            setTimeout(() => {
                this._hideComment()
            }, 4200)
        }

        return {"products": amount, "delay": delay}
    }

    appendProduct(section, currentProducts, number = null) {
        return this._privateAppendOrRemove(section, currentProducts, "append", number)
    }

    removeProduct(section, currentProducts, number = null) {
        return this._privateAppendOrRemove(section, currentProducts, "remove", number)
    }

    /* Manual simulation methods */
    _lockSection(section, variant) {
        // Wake up the character
        this.wakeUp()

        // After 0.5 second, the eyes animation will start
        setTimeout(() => {
            this.startAnimation()
        }, 500)

        // Alternate the options
        this.hideOptions(1)
        this.showOptions(2)

        // Show the lock
        section.classList.add(`simulation--${variant}`)
    }

    _unlockSection(section, variant) {
        // Sleep the character
        this.endAnimation()
        this.sleep()

        // Alternate the options
        this.showOptions(1)
        this.hideOptions(2)

        // Hide the action menu
        const actionMenuAttribute = '[data-action="action-menu"]'
        const actionMenu = this._person.querySelector(actionMenuAttribute)
        actionMenu.classList.add("character__action--hidden")

        // Show the lock
        section.classList.remove(`simulation--${variant}`)
    }

    _showLock() {
        // Wake up the character
        this.wakeUp()

        // Hide the "wake up" option
        this.hideOptions(1)

        // After 0.5 second, the comment will be displayed and the eyes
        // animation will start
        setTimeout(() => {
            this._showComment("La sección de productos está bloqueada")
            this.startAnimation()
        }, 500)

        // After 2.8 second, the comment will desappear and the eyes animation
        // will end
        setTimeout(() => {
            this._hideComment()
            this.endAnimation()
            this.sleep()
            this.showOptions(1)
        }, 2800)
    }

    _toggleActionMenu() {
        const actionMenu = this._person.querySelector('[data-action="action-menu"]')
        actionMenu.classList.toggle("character__action--hidden")
    }

    _getCurrentProducts(section) {
        const cells = section.querySelectorAll(".simulation__cell")
        let currentProducts = 0

        for (let i = 0; i < cells.length; i++) {
            if (cells[i].querySelector(".product")) currentProducts++
        }

        return currentProducts
    }

    _action(section, type, amount) {
        // Hide the action menu
        this._toggleActionMenu()

        // Get the current products
        const currentProducts = this._getCurrentProducts(section)

        // Execute the according method
        if (type == "agregar") {
            this.appendProduct(section, currentProducts, amount)
        } else if (type == "quitar") {
            this.removeProduct(section, currentProducts, amount)
        }
    }

    sleep() {
        const closedClass = "eyes--closed"
        const sleepClass = "mouth--sleep"

        this._leftEye.classList.add(closedClass)
        this._rightEye.classList.add(closedClass)
        this._mouth.classList.add(sleepClass)
    }

    wakeUp() {
        const closedClass = "eyes--closed"
        const sleepClass = "mouth--sleep"

        this._leftEye.classList.remove(closedClass)
        this._rightEye.classList.remove(closedClass)

        this._mouth.classList.remove(sleepClass)
    }

    showOptions(option) {
        const attribute = `[data-action="character-options-${option}"]`
        const hiddenClass = "options--hidden"
        const options = this._person.querySelector(attribute)

        options.classList.remove(hiddenClass)
    }

    hideOptions(option) {
        const attribute = `[data-action="character-options-${option}"]`
        const hiddenClass = "options--hidden"
        const options = this._person.querySelector(attribute)

        options.classList.add(hiddenClass)
    }

    hideManualConfigurations(section) {
        // Hide all the options
        this.hideOptions(1)
        this.hideOptions(2)

        // Remove the lock classes
        section.classList.remove("simulation--1")
        section.classList.remove("simulation--2")

        // Hide the action menu
        const actionMenuAttribute = '[data-action="action-menu"]'
        const actionMenu = this._person.querySelector(actionMenuAttribute)
        actionMenu.classList.add("character__action--hidden")
    }
}
