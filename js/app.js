import {Simulation} from "./simulation.js"

function customPresenter(char, variant, position, name, actionTitle, actionButton) {
    const actionMenu = char.querySelector(".character__action")

    char.querySelector(".hair").classList.add(`hair--${variant}`)
    char.querySelector(".character__comment").classList.add(`character__comment--${position}`)
    char.querySelector(".character__name").innerText = name

    actionMenu.classList.add(`character__action--${position}`)
    actionMenu.querySelector(".action__title").innerText = actionTitle
    actionMenu.querySelector(".action__button").innerText = actionButton
}

function addPresenters() {
    const templateCharacter = document.getElementById("template-character").content
    const producer = document.getElementById("producer")
    const consumer = document.getElementById("consumer")
    let character

    // Producer
    character = templateCharacter.cloneNode(true)
    producer.appendChild(character)
    customPresenter(producer, 1, "left", "Productor", "Productos a agregar", "Agregar")


    // Consumer
    character = templateCharacter.cloneNode(true)
    consumer.appendChild(character)
    customPresenter(consumer, 2, "right", "Consumidor", "Productos a quitar", "Quitar")
}

document.addEventListener("DOMContentLoaded", function() {
    // Add presenters to the DOM
    addPresenters()

    // Class elements
    const simulation = new Simulation()

    // Document elements
    const automaticSimulationButton = document.getElementById("automatic-simulation-button")
    const manualSimulationButton = document.getElementById("manual-simulation-button")
    const options = document.getElementById("options")

    // Flags
    let simulationType = ""

    // Button events
    automaticSimulationButton.addEventListener("click", function() {
        options.style.display = "none"
        simulationType = "automatic"
        simulation.start()
    })

    manualSimulationButton.addEventListener("click", function() {
        options.style.display = "none"
        simulationType = "manual"
        simulation.manualStart()
    })

    // When the user press "Esc"
    document.addEventListener("keydown", function(event) {
        if (event.key === "Escape") {
            if (simulationType == "automatic") {
                simulation.end()
            } else if (simulationType == "manual") {
                simulation.manualEnd()
            }

            // After 2 seconds, the start button will appear and all the
            // products will desappear
            setTimeout(function() {
                simulation.removeAllProducts()
                options.style.display = "flex"
            }, 2000)
        }
    })
})