// ========================================
// ELEMENTOS DEL DOM
// ========================================

const paletteSize = document.getElementById("paletteSize");
const colorFormat = document.getElementById("colorFormat");
const generateBtn = document.getElementById("generateBtn");
const saveBtn = document.getElementById("saveBtn");
const palette = document.getElementById("palette");
const savedPalette = document.getElementById("savedPalette");


// ========================================
// VARIABLES
// ========================================

// Aquí guardamos los colores actuales
let colors = [];

// Aquí guardamos cuáles colores están bloqueados
let lockedColors = [];


// ========================================
// GENERAR COLOR HSL ALEATORIO
// ========================================

function generateRandomHSL() {

    const hue = Math.floor(Math.random() * 361);

    const saturation =
        Math.floor(Math.random() * 41) + 50;

    const lightness =
        Math.floor(Math.random() * 31) + 40;

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}


// ========================================
// CONVERTIR HSL A HEX
// ========================================

function hslToHex(hsl) {

    const values = hsl.match(/\d+/g);

    const h = Number(values[0]);
    const s = Number(values[1]) / 100;
    const l = Number(values[2]) / 100;

    const c =
        (1 - Math.abs(2 * l - 1)) * s;

    const x =
        c *
        (1 - Math.abs((h / 60) % 2 - 1));

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
// GENERAR PALETA
// ========================================

function generatePalette() {

    const amount =
        Number(paletteSize.value);


    const newColors = [];


    for (let i = 0; i < amount; i++) {

        // Si el color está bloqueado,
        // mantenemos el color anterior.

        if (
            lockedColors[i] &&
            colors[i]
        ) {

            newColors.push(colors[i]);

        } else {

            newColors.push(createColor());

        }
    }


    colors = newColors;


    // Ajustamos la cantidad de bloqueos
    lockedColors.length = amount;

    for (let i = 0; i < amount; i++) {

        if (lockedColors[i] === undefined) {

            lockedColors[i] = false;
        }
    }


    renderPalette();

    showToast("¡Nueva paleta generada!");
}


// ========================================
// RENDERIZAR PALETA
// ========================================

function renderPalette() {

    palette.innerHTML = "";


    colors.forEach((color, index) => {

        // Creamos la tarjeta
        const colorCard =
            document.createElement("article");


        colorCard.classList.add(
            "color-card"
        );


        // Aplicamos el color
        colorCard.style.backgroundColor =
            color.hsl;


        // ========================================
        // INFORMACIÓN DEL COLOR
        // ========================================

        const colorInfo =
            document.createElement("div");


        colorInfo.classList.add(
            "color-info"
        );


        // Código HEX
        const hexCode =
    document.createElement("span");

hexCode.classList.add(
    "hex-code"
);

const displayedCode =
    colorFormat.value === "hsl"
        ? color.hsl
        : color.hex;

hexCode.textContent =
    displayedCode;


        // ========================================
        // BOTÓN DE BLOQUEO
        // ========================================

        const lockButton =
            document.createElement("button");


        lockButton.type = "button";

        lockButton.classList.add(
            "lock-btn"
        );


        lockButton.textContent =
            lockedColors[index]
                ? "🔒"
                : "🔓";


        lockButton.setAttribute(
            "aria-label",
            lockedColors[index]
                ? "Desbloquear color"
                : "Bloquear color"
        );


        // Evento del botón de bloqueo
        lockButton.addEventListener(
            "click",
            function(event) {

                // Evita que también se copie
                // el HEX al hacer clic
                event.stopPropagation();


                lockedColors[index] =
                    !lockedColors[index];


                renderPalette();


                showToast(
                    lockedColors[index]
                        ? "🔒 Color bloqueado"
                        : "🔓 Color desbloqueado"
                );
            }
        );


        // Agregamos elementos
        colorInfo.appendChild(hexCode);

        colorInfo.appendChild(lockButton);

        colorCard.appendChild(colorInfo);


        // ========================================
        // COPIAR HEX
        // ========================================

        colorCard.addEventListener(
            "click",
            function() {

                navigator.clipboard.writeText(
                    displayedCode
                );


                showToast(
                    `${displayedCode} copiado`
                );
            }
        );


        // ========================================
        // ANIMACIÓN
        // ========================================

        colorCard.classList.add(
            "new-color"
        );


        // Agregamos la tarjeta
        palette.appendChild(colorCard);

    });
}


// ========================================
// GUARDAR PALETA
// ========================================

function savePalette() {

    // Comprobamos que exista una paleta
    if (colors.length === 0) {

        showToast(
            "Genera una paleta primero"
        );

        return;
    }


    // Convertimos la paleta a texto
    const paletteToSave =
        JSON.stringify(colors);


    // Guardamos en localStorage
    localStorage.setItem(
        "savedPalette",
        paletteToSave
    );

    localStorage.setItem(
    "savedColorFormat",
    colorFormat.value
);

    renderSavedPalette();

    showToast(
        "💾 ¡Paleta guardada!"
    );
}


function renderSavedPalette() {

    savedPalette.innerHTML = "";

    const savedPaletteData =
        localStorage.getItem("savedPalette");

    if (!savedPaletteData) {
        return;
    }

    const savedColors =
        JSON.parse(savedPaletteData);


    savedColors.forEach((color) => {

        const colorCard =
            document.createElement("article");

        colorCard.classList.add("color-card");

        colorCard.style.backgroundColor =
            color.hsl;


        const hexCode =
            document.createElement("span");

        hexCode.classList.add("hex-code");

        const displayedCode =
    colorFormat.value === "hsl"
        ? color.hsl
        : color.hex;

hexCode.textContent =
    displayedCode;


        colorCard.appendChild(hexCode);

        savedPalette.appendChild(colorCard);

    });
}

// ========================================
// CARGAR PALETA GUARDADA
// ========================================

function loadSavedPalette() {

    const savedPalette =
        localStorage.getItem(
            "savedPalette"
        );


    // Si no existe una paleta guardada
    if (!savedPalette) {

        return;
    }


    // Convertimos el texto nuevamente
    // a un array de objetos
    colors =
        JSON.parse(savedPalette);

        const savedColorFormat =
    localStorage.getItem(
        "savedColorFormat"
    );

if (savedColorFormat) {

    colorFormat.value =
        savedColorFormat;
}


    // Creamos los bloqueos nuevamente
    lockedColors =
        new Array(colors.length).fill(false);


    renderSavedPalette();


    showToast(
        "💾 Paleta guardada cargada"
    );
}


// ========================================
// MICROFEEDBACK / TOAST
// ========================================

function showToast(message) {

    let toast =
        document.getElementById("toast");


    // Si no existe, lo creamos
    if (!toast) {

        toast =
            document.createElement("div");


        toast.id = "toast";


        toast.classList.add(
            "toast"
        );


        toast.setAttribute(
            "role",
            "status"
        );


        toast.setAttribute(
            "aria-live",
            "polite"
        );


        document.body.appendChild(toast);
    }


    toast.textContent = message;


    toast.classList.add(
        "show"
    );


    setTimeout(function() {

        toast.classList.remove(
            "show"
        );

    }, 2000);
}


// ========================================
// EVENTO: GENERAR PALETA
// ========================================

generateBtn.addEventListener(
    "click",
    generatePalette
);


// ========================================
// EVENTO: GUARDAR PALETA
// ========================================

saveBtn.addEventListener(
    "click",
    savePalette
);


// ========================================
// CARGAR PALETA AL INICIAR
// ========================================

loadSavedPalette();



