const fs = require('fs');
const path = require('path');

try {
    const srcPath = '/home/aza/Documentos/examen-guia/temp_extracted/simulador_react_examen/app.js';
    const destPath = '/home/aza/Documentos/examen-guia/questions.js';

    console.log(`Leyendo banco de preguntas desde ${srcPath}...`);
    let content = fs.readFileSync(srcPath, 'utf8');

    // Ubicar el inicio del array de banco
    const startMatch = content.match(/const\s+banco\s*=\s*\[/);
    if (!startMatch) {
        throw new Error("No se encontró el inicio de 'const banco = ['");
    }
    const startIndex = startMatch.index + startMatch[0].length - 1; // posicion del '['

    // Encontrar el corchete de cierre del array banco
    let depth = 0;
    let endIndex = -1;
    for (let i = startIndex; i < content.length; i++) {
        if (content[i] === '[') depth++;
        if (content[i] === ']') {
            depth--;
            if (depth === 0) {
                endIndex = i + 1;
                break;
            }
        }
    }

    if (endIndex === -1) {
        throw new Error("No se encontró el corchete de cierre de banco");
    }

    // Extraer el texto del array
    const arrayStr = content.substring(startIndex, endIndex);

    // Evaluar de manera segura usando Function
    const rawBanco = new Function(`return ${arrayStr}`)();
    console.log(`Se cargaron exitosamente ${rawBanco.length} preguntas.`);

    // Normalizar las preguntas
    const normalizedQuestions = rawBanco.map((item, idx) => {
        const questionText = item.pregunta;
        const correctOption = item.opciones[item.correcta];
        const distractors = item.opciones.filter((_, oIdx) => oIdx !== item.correcta);

        // Categorizar automáticamente por palabras clave
        let category = "Conceptos de React";
        const textLower = (questionText + " " + (item.explicacion || "")).toLowerCase();
        
        if (textLower.includes("usestate") || textLower.includes("setstate") || textLower.includes("setpokemon")) {
            category = "useState & Estado";
        } else if (textLower.includes("useeffect")) {
            category = "useEffect & Efectos";
        } else if (textLower.includes("usecontext") || textLower.includes("context")) {
            category = "useContext & Context";
        } else if (textLower.includes("prop")) {
            category = "Props & Comunicación";
        } else if (textLower.includes("jsx")) {
            category = "JSX & Sintaxis";
        } else if (textLower.includes("onclick") || textLower.includes("onchange") || textLower.includes("evento")) {
            category = "Eventos & Formularios";
        } else if (textLower.includes("component")) {
            category = "Componentes";
        }

        // Determinar dificultad tentativa basada en la complejidad
        let difficulty = "Fácil";
        if (textLower.includes("limpieza") || textLower.includes("asíncrona") || textLower.includes("prev") || textLower.includes("infinitos") || textLower.includes("drilling") || textLower.includes("dependencias")) {
            difficulty = "Difícil";
        } else if (textLower.includes("props") || textLower.includes("useeffect") || textLower.includes("usecontext") || textLower.includes("lifting")) {
            difficulty = "Intermedio";
        }

        // Generar una mnemotecnia simplificada si es útil
        let mnemonic = null;
        if (category === "useState & Estado") {
            mnemonic = "useState = [cajaDeDatos, botonParaCambiarla]";
        } else if (category === "useEffect & Efectos") {
            mnemonic = "useEffect = reacciona a cambios en su lista de dependencias []";
        } else if (category === "useContext & Context") {
            mnemonic = "Context = Teletransporte de datos (evita el prop drilling)";
        } else if (category === "Props & Comunicación") {
            mnemonic = "Props = De padre a hijo, solo lectura (lectura obligatoria)";
        }

        return {
            id: `react_q${idx + 1}`,
            category,
            difficulty,
            question: questionText,
            correct: correctOption,
            distractors: distractors,
            explanation: item.explicacion || "Permite manejar la lógica interactiva en React de forma estructurada.",
            mnemonic: mnemonic
        };
    });

    // Escribir a questions.js
    const outputContent = `/**
 * MedPrep - Banco de Preguntas sobre React (Importado de simulador_react_examen)
 * Contiene ${normalizedQuestions.length} preguntas normalizadas.
 */

const DEFAULT_QUESTIONS = ${JSON.stringify(normalizedQuestions, null, 4)};
`;

    fs.writeFileSync(destPath, outputContent, 'utf8');
    console.log(`¡questions.js actualizado con éxito en ${destPath}!`);

} catch (err) {
    console.error("Error al procesar el archivo:", err);
    process.exit(1);
}
