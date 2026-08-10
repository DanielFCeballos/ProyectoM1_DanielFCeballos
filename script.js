// ========================================
// SELECCIONAR ELEMENTOS DEL HTML
// ========================================

const paletteSize = document.getElementById("paletteSize");

const generateBtn = document.getElementById("generateBtn");

const palette = document.getElementById("palette");


// ========================================
// GENERAR COLOR HSL ALEATORIO
// ========================================

function generateRandomHSL() {

    // Matiz: 0 - 360
    const hue = Math.floor(Math.random() * 361);

    // Saturación: 50% - 90%
    const saturation =
        Math.floor(Math.random() * 41) + 50;

    // Luminosidad: 40% - 70%
    const lightness =
        Math.floor(Math.random() * 31) + 40;

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}


// ========================================
// CONVERTIR HSL A HEX
// ========================================

function hslToHex(hsl) {

    // Extraemos los números del HSL
    const values = hsl.match(/\d+/g);

    const h = Number(values[0]);

    const s = Number(values[1]) / 100;

    const l = Number(values[2]) / 100;


    const c =
        (1 - Math.abs(2 * l - 1)) * s;

    const x =
        c * (1 - Math.abs((h / 60) % 2 - 1));

    const m =
        l - c / 2;


    let r = 0;
    let g = 0;
    let b = 0;


    if (h < 60) {

        r = c;
        g = x;

    } else if (h < 120) {

        r = x;
        g = c;

    } else if (h < 180) {

        g = c;
        b = x;

    } else if (h < 240) {

        g = x;
        b = c;

    } else if (h < 300) {

        r = x;
        b = c;

    } else {

        r = c;
        b = x;
    }


    r = Math.round((r + m) * 255);

    g = Math.round((g + m) * 255);

    b = Math.round((b + m) * 255);


    // Convertimos RGB a hexadecimal
    const hex = [r, g, b]
        .map(value =>
            value
                .toString(16)
                .padStart(2, "0")
        )
        .join("");


    return `#${hex.toUpperCase()}`;
}


// ========================================
// CREAR UN COLOR
// ========================================

function createColor() {

    const hsl = generateRandomHSL();

    const hex = hslToHex(hsl);

    return {
        hsl: hsl,
        hex: hex
    };
}


// ========================================
// GENERAR LA PALETA
// ========================================

function generatePalette() {

    // Obtenemos el tamaño seleccionado
    const amount = Number(paletteSize.value);


    // Limpiamos la paleta anterior
    palette.innerHTML = "";


    // Generamos la cantidad seleccionada
    for (let i = 0; i < amount; i++) {

        const color = createColor();

        renderColor(color);
    }


    // Mostramos feedback al usuario
    showToast("¡Paleta generada!");
}


// ========================================
// MOSTRAR UN COLOR EN EL DOM
// ========================================

function renderColor(color) {

    // Creamos la tarjeta
    const colorCard =
        document.createElement("article");


    // Agregamos la clase CSS
    colorCard.classList.add("color-card");


    // Utilizamos el HSL como fondo
    colorCard.style.backgroundColor =
        color.hsl;


    // Creamos el texto del código HEX
    const hexCode =
        document.createElement("span");


    hexCode.classList.add("hex-code");


    // Mostramos el HEX
    hexCode.textContent = color.hex;


    // Agregamos el HEX a la tarjeta
    colorCard.appendChild(hexCode);


    // Agregamos la tarjeta a la paleta
    palette.appendChild(colorCard);
}


// ========================================
// MICROFEEDBACK
// ========================================

function showToast(message) {

    // Buscamos si ya existe un toast
    let toast = document.getElementById("toast");


    // Si no existe, lo creamos
    if (!toast) {

        toast = document.createElement("div");

        toast.id = "toast";

        toast.classList.add("toast");

        toast.setAttribute("role", "status");

        toast.setAttribute(
            "aria-live",
            "polite"
        );

        document.body.appendChild(toast);
    }


    // Cambiamos el mensaje
    toast.textContent = message;


    // Mostramos el toast
    toast.classList.add("show");


    // Lo ocultamos después de 2 segundos
    setTimeout(() => {

        toast.classList.remove("show");

    }, 2000);
}


// ========================================
// EVENTO DEL BOTÓN
// ========================================

generateBtn.addEventListener(
    "click",
    generatePalette
);