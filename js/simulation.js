import {Character} from "./character.js"

export class Simulation {
    constructor() {
        this._section = document.getElementById("simulation")
        this._producer = new Character("producer", this._section, 1)
        this._consumer = new Character("consumer", this._section, 2)
        this._totalProducts = 0

        // Flags
        this._simulationActive = false
    }

    _reset() {
        this._totalProducts = 0
        this._producer.reset()
        this._consumer.reset()
    }

    start() {
        // Reset all the configurations
        this._reset()

        // Show the section of cells
        this._section.classList.remove("simulation--hidden")

        // Start the characters animations (eyes)
        this._producer.startAnimation()
        this._consumer.startAnimation()

        // Recursive function to make the simulation
        const simulate = () => {
            // If the simulation is not active, it will end
            if (!this._simulationActive) {
                return
            }

            // Randomly select 0 or 1
            const currentCharacter = Math.floor(Math.random() * 2);
            let response

            if (currentCharacter) {  // Producer
                response = this._producer.appendProduct(this._section, this._totalProducts)
                this._totalProducts += response.products
            } else {  // Consumer
                response = this._consumer.removeProduct(this._section, this._totalProducts)
                this._totalProducts -= response.products
            }

            setTimeout(() => {
                simulate()
            }, 2500 + response.delay)
        }

        // Start the first simulation after 0.75 seconds
        this._simulationActive = true
        setTimeout(() => {
            simulate()
        }, 750)
    }

    end() {
        // Stop the characters animations (eyes)
        this._producer.endAnimation()
        this._consumer.endAnimation()

        // Hide the simulation section
        this._section.classList.add("simulation--hidden")

        // Change the flag value
        this._simulationActive = false
    }

    manualStart() {
        // Reset all the configurations
        this._reset()

        // Show the section of cells
        this._section.classList.remove("simulation--hidden")

        this._producer.sleep()
        this._consumer.sleep()

        this._producer.showOptions(1)
        this._consumer.showOptions(1)
    }

    manualEnd() {
        // Wake up the characters
        this._producer.wakeUp()
        this._consumer.wakeUp()

        this._producer.hideManualConfigurations(this._section)
        this._consumer.hideManualConfigurations(this._section)

        this.end()
    }

    removeAllProducts() {
        const totalCells = this._section.children.length

        for (let i = 0; i < totalCells; i++) {
            this._section.children[i].innerHTML = ""
        }
    }
}