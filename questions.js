/**
 * ReactPrep - Banco de Preguntas
 * Opciones EXACTAS del examen físico (captura de pantalla).
 * La respuesta correcta es la factualmente correcta en React.
 */

const DEFAULT_QUESTIONS = [

    // ─────────────────────────────────────────────────────────────────────────
    // SECCIÓN A — Opción múltiple (opciones idénticas al examen)
    // ─────────────────────────────────────────────────────────────────────────
    {
        id: "sec_a_1",
        category: "Opción Múltiple",
        difficulty: "Intermedio",
        question: "¿Cuál es la principal función de un componente en React?",
        correct: "Crear partes reutilizables de la interfaz",
        distractors: [
            "Crear elementos más dinámicos que en html nativo",
            "Administrar Estados de React",
            "Ejecutar JavaScript en el lado del cliente"
        ],
        explanation: "La función principal de un componente es CREAR PARTES REUTILIZABLES de la interfaz. No administra solo estados ni ejecuta JS en el cliente. Cada componente encapsula una parte visual que puede usarse múltiples veces.",
        mnemonic: "Componente ≠ administrar estados. Componente = bloque reutilizable de UI"
    },
    {
        id: "sec_a_2",
        category: "Opción Múltiple",
        difficulty: "Difícil",
        question: "¿Cuál es la sintaxis de useState?",
        correct: "const [pokemon,SetPokemon] = useState()",
        distractors: [
            "Ninguna es correcta",
            "const [setPokemon,pokemon] = useState()",
            "const (setPokemon,pokemon) = useState(null)"
        ],
        explanation: "La opción correcta del examen es const [pokemon,SetPokemon] = useState(). Tiene el orden correcto: primero el estado (pokemon), luego el actualizador (SetPokemon). Las trampas: 'Ninguna es correcta' es falsa; setPokemon,pokemon tiene el orden INVERTIDO; los paréntesis () en vez de [] es sintaxis incorrecta.",
        mnemonic: "Orden: [ESTADO, setESTADO]. Primero el dato, luego quien lo cambia. Corchetes [], no paréntesis ()"
    },
    {
        id: "sec_a_3",
        category: "Opción Múltiple",
        difficulty: "Intermedio",
        question: "¿Qué son las props en React?",
        correct: "Datos que se envían de un componente a un sub componente del mismo.",
        distractors: [
            "Funciones para actualizar el DOM.",
            "Datos que se envían de un componente hijo a un componente padre.",
            "Estados compartidos."
        ],
        explanation: "Las props son datos que van de un componente (padre) hacia un sub-componente (hijo). La trampa es la opción C que invierte la dirección: de hijo a padre. Las props NUNCA van de hijo a padre; para eso se usan funciones enviadas como props.",
        mnemonic: "Props van hacia ABAJO: padre → hijo. Nunca al revés. La opción que invierte es la trampa"
    },
    {
        id: "sec_a_4",
        category: "Opción Múltiple",
        difficulty: "Difícil",
        question: "¿Cuál es el propósito principal de useEffect al usar el parámetro [estado]?",
        correct: "Ejecutar efectos secundarios después de la creación del estado.",
        distractors: [
            "Ejecutar efectos secundarios antes del renderizado.",
            "Ejecutar Efectos secundarios después del renderizado",
            "Modificar JSX."
        ],
        explanation: "Según el examen: useEffect con [estado] ejecuta los efectos secundarios después de la CREACIÓN/ACTUALIZACIÓN del estado. El efecto reacciona cuando ese estado cambia — no es simplemente después del render genérico sino vinculado al ciclo de vida del estado indicado.",
        mnemonic: "useEffect([estado]) = después de que ese ESTADO se crea o cambia → ejecuta el efecto"
    },
    {
        id: "sec_a_5",
        category: "Opción Múltiple",
        difficulty: "Intermedio",
        question: "¿Qué ocurre cuando la función del efecto de useEffect está vacía?",
        correct: "Se ejecuta pero no realiza nada.",
        distractors: [
            "Se ejecuta en cada renderizado.",
            "Nunca se ejecuta.",
            "Se ejecuta una sola vez al montar el componente."
        ],
        explanation: "Según el examen: si la FUNCIÓN del efecto está vacía (sin código dentro), useEffect se ejecuta pero no realiza ninguna acción. Ojo con la trampa 'Nunca se ejecuta' — sí se ejecuta, solo que no hace nada útil porque la función está vacía.",
        mnemonic: "Función vacía = se EJECUTA pero no HACE nada. Es diferente a no ejecutarse"
    },

    // ─────────────────────────────────────────────────────────────────────────
    // SECCIÓN B — Verdadero o Falso
    // ─────────────────────────────────────────────────────────────────────────
    {
        id: "sec_b_1",
        category: "Verdadero o Falso",
        difficulty: "Fácil",
        question: "Las props pueden modificarse directamente dentro del componente hijo.",
        correct: "Falso",
        distractors: ["Verdadero"],
        explanation: "FALSO. Las props son de solo lectura. El hijo nunca debe modificarlas directamente. Si el hijo necesita comunicar algo al padre, el padre le pasa una función como prop y el hijo la llama.",
        mnemonic: "Props = Solo lectura. Hijo LEE props, nunca las MODIFICA directamente"
    },
    {
        id: "sec_b_2",
        category: "Verdadero o Falso",
        difficulty: "Fácil",
        question: "useState permite almacenar información que cambia durante la ejecución.",
        correct: "Verdadero",
        distractors: ["Falso"],
        explanation: "VERDADERO. Esa es exactamente su función: guardar datos dinámicos que cambian durante la interacción del usuario. Si el dato es estático/fijo, no necesitas useState.",
        mnemonic: "useState = datos VIVOS. Si cambia → useState. Si es fijo → constante normal"
    },
    {
        id: "sec_b_3",
        category: "Verdadero o Falso",
        difficulty: "Fácil",
        question: "useContext ayuda a evitar el prop drilling.",
        correct: "Verdadero",
        distractors: ["Falso"],
        explanation: "VERDADERO. El prop drilling es pasar props por muchos niveles intermedios. useContext permite que cualquier componente descendiente acceda al dato directamente sin recibir props en cada nivel intermedio.",
        mnemonic: "Context = Teletransporte. A→B→C→D se vuelve A→D sin pasar por B y C"
    },
    {
        id: "sec_b_4",
        category: "Verdadero o Falso",
        difficulty: "Fácil",
        question: "JSX es obligatorio en React y no tiene alternativas.",
        correct: "Falso",
        distractors: ["Verdadero"],
        explanation: "FALSO. JSX es una extensión sintáctica conveniente, pero no obligatoria. Puedes usar React.createElement() para crear elementos sin JSX. JSX se compila a esas llamadas de todas formas.",
        mnemonic: "JSX = conveniente pero NO obligatorio. React.createElement() es la alternativa pura"
    },
    {
        id: "sec_b_5",
        category: "Verdadero o Falso",
        difficulty: "Fácil",
        question: "onChange es ampliamente utilizado en formularios.",
        correct: "Verdadero",
        distractors: ["Falso"],
        explanation: "VERDADERO. onChange es el evento estándar en React para detectar cambios en inputs, selects y textareas. Es la base de los formularios controlados donde el estado guarda el valor del campo.",
        mnemonic: "onChange = guardián del formulario. Detecta CADA cambio que el usuario hace"
    },

    // ─────────────────────────────────────────────────────────────────────────
    // SECCIÓN C — Relacionar columnas
    // Opciones = exactamente las definiciones de la Columna B del examen
    // ─────────────────────────────────────────────────────────────────────────
    {
        id: "sec_c_1",
        category: "Relacionar Columnas",
        difficulty: "Intermedio",
        question: "Relaciona — Component corresponde a:",
        correct: "Estructura reutilizable de interfaz",
        distractors: [
            "Permite compartir datos entre componentes sin prop drilling",
            "Ejecuta acciones después del renderizado",
            "Hook para manejar estado",
            "Datos enviados de padre a hijo",
            "Función que actualiza el estado",
            "Evento que detecta cambios en formularios",
            "Información que puede cambiar durante la ejecución",
            "Evento que responde a un clic",
            "Sintaxis similar a HTML utilizada en React"
        ],
        explanation: "Component → D: Estructura reutilizable de interfaz. Las trampas más comunes: confundirlo con 'Hook para manejar estado' (eso es useState) o con 'Datos enviados de padre a hijo' (eso son las Props).",
        mnemonic: "Component = Bloque reutilizable de UI. La respuesta tiene la palabra INTERFAZ"
    },
    {
        id: "sec_c_2",
        category: "Relacionar Columnas",
        difficulty: "Intermedio",
        question: "Relaciona — Props corresponde a:",
        correct: "Datos enviados de padre a hijo",
        distractors: [
            "Permite compartir datos entre componentes sin prop drilling",
            "Ejecuta acciones después del renderizado",
            "Estructura reutilizable de interfaz",
            "Hook para manejar estado",
            "Función que actualiza el estado",
            "Evento que detecta cambios en formularios",
            "Información que puede cambiar durante la ejecución",
            "Evento que responde a un clic",
            "Sintaxis similar a HTML utilizada en React"
        ],
        explanation: "Props → E: Datos enviados de padre a hijo. La trampa es confundirlos con useContext ('Permite compartir datos...') — Context evita pasar props, pero las Props en sí son datos padre→hijo.",
        mnemonic: "Props = PADRE → HIJO. La única que menciona 'padre a hijo' es la correcta"
    },
    {
        id: "sec_c_3",
        category: "Relacionar Columnas",
        difficulty: "Intermedio",
        question: "Relaciona — useContext corresponde a:",
        correct: "Permite compartir datos entre componentes sin prop drilling",
        distractors: [
            "Ejecuta acciones después del renderizado",
            "Estructura reutilizable de interfaz",
            "Datos enviados de padre a hijo",
            "Hook para manejar estado",
            "Función que actualiza el estado",
            "Evento que detecta cambios en formularios",
            "Información que puede cambiar durante la ejecución",
            "Evento que responde a un clic",
            "Sintaxis similar a HTML utilizada en React"
        ],
        explanation: "useContext → A: Permite compartir datos entre componentes sin prop drilling. La única opción que menciona 'prop drilling' es la de useContext.",
        mnemonic: "useContext = la que dice 'sin prop drilling'. Context resuelve el problema de prop drilling"
    },
    {
        id: "sec_c_4",
        category: "Relacionar Columnas",
        difficulty: "Intermedio",
        question: "Relaciona — useEffect corresponde a:",
        correct: "Ejecuta acciones después del renderizado",
        distractors: [
            "Permite compartir datos entre componentes sin prop drilling",
            "Estructura reutilizable de interfaz",
            "Datos enviados de padre a hijo",
            "Hook para manejar estado",
            "Función que actualiza el estado",
            "Evento que detecta cambios en formularios",
            "Información que puede cambiar durante la ejecución",
            "Evento que responde a un clic",
            "Sintaxis similar a HTML utilizada en React"
        ],
        explanation: "useEffect → C: Ejecuta acciones después del renderizado. La que menciona 'renderizado' es la de useEffect. No confundir con useState que 'maneja estado'.",
        mnemonic: "useEffect = la que dice 'después del renderizado'. Efecto = acción post-render"
    },
    {
        id: "sec_c_5",
        category: "Relacionar Columnas",
        difficulty: "Intermedio",
        question: "Relaciona — useState corresponde a:",
        correct: "Hook para manejar estado",
        distractors: [
            "Permite compartir datos entre componentes sin prop drilling",
            "Ejecuta acciones después del renderizado",
            "Estructura reutilizable de interfaz",
            "Datos enviados de padre a hijo",
            "Función que actualiza el estado",
            "Evento que detecta cambios en formularios",
            "Información que puede cambiar durante la ejecución",
            "Evento que responde a un clic",
            "Sintaxis similar a HTML utilizada en React"
        ],
        explanation: "useState → F: Hook para manejar estado. Cuidado con la trampa: 'Función que actualiza el estado' es setState/setPokemon (el segundo elemento del array), NO useState en sí. useState es el HOOK completo.",
        mnemonic: "useState = HOOK para manejar estado. setState = FUNCIÓN que actualiza. Son diferentes"
    },
    {
        id: "sec_c_6",
        category: "Relacionar Columnas",
        difficulty: "Intermedio",
        question: "Relaciona — setState / función de actualización corresponde a:",
        correct: "Función que actualiza el estado",
        distractors: [
            "Permite compartir datos entre componentes sin prop drilling",
            "Ejecuta acciones después del renderizado",
            "Estructura reutilizable de interfaz",
            "Datos enviados de padre a hijo",
            "Hook para manejar estado",
            "Evento que detecta cambios en formularios",
            "Información que puede cambiar durante la ejecución",
            "Evento que responde a un clic",
            "Sintaxis similar a HTML utilizada en React"
        ],
        explanation: "setState → G: Función que actualiza el estado. No confundir con useState ('Hook para manejar estado'). setState/setPokemon es la FUNCIÓN que viene dentro del array de useState y sirve para cambiar el valor.",
        mnemonic: "setState = la que dice 'ACTUALIZA el estado'. useState = Hook. setState = la función del Hook"
    },
    {
        id: "sec_c_7",
        category: "Relacionar Columnas",
        difficulty: "Intermedio",
        question: "Relaciona — onChange corresponde a:",
        correct: "Evento que detecta cambios en formularios",
        distractors: [
            "Permite compartir datos entre componentes sin prop drilling",
            "Ejecuta acciones después del renderizado",
            "Estructura reutilizable de interfaz",
            "Datos enviados de padre a hijo",
            "Hook para manejar estado",
            "Función que actualiza el estado",
            "Información que puede cambiar durante la ejecución",
            "Evento que responde a un clic",
            "Sintaxis similar a HTML utilizada en React"
        ],
        explanation: "onChange → B: Evento que detecta cambios en formularios. No confundir con onClick ('Evento que responde a un clic'). onChange = cambios en campos de texto/selects. onClick = clics en elementos.",
        mnemonic: "onChange = FORMULARIOS (escribir, seleccionar). onClick = CLIC (presionar)"
    },
    {
        id: "sec_c_8",
        category: "Relacionar Columnas",
        difficulty: "Intermedio",
        question: "Relaciona — Estado (State de useState) corresponde a:",
        correct: "Información que puede cambiar durante la ejecución",
        distractors: [
            "Permite compartir datos entre componentes sin prop drilling",
            "Ejecuta acciones después del renderizado",
            "Estructura reutilizable de interfaz",
            "Datos enviados de padre a hijo",
            "Hook para manejar estado",
            "Función que actualiza el estado",
            "Evento que detecta cambios en formularios",
            "Evento que responde a un clic",
            "Sintaxis similar a HTML utilizada en React"
        ],
        explanation: "Estado → H: Información que puede cambiar durante la ejecución. El estado representa datos dinámicos del componente. La clave es 'puede CAMBIAR durante la ejecución'.",
        mnemonic: "Estado = datos que CAMBIAN. La única con 'puede cambiar durante la ejecución'"
    },
    {
        id: "sec_c_9",
        category: "Relacionar Columnas",
        difficulty: "Intermedio",
        question: "Relaciona — onClick corresponde a:",
        correct: "Evento que responde a un clic",
        distractors: [
            "Permite compartir datos entre componentes sin prop drilling",
            "Ejecuta acciones después del renderizado",
            "Estructura reutilizable de interfaz",
            "Datos enviados de padre a hijo",
            "Hook para manejar estado",
            "Función que actualiza el estado",
            "Evento que detecta cambios en formularios",
            "Información que puede cambiar durante la ejecución",
            "Sintaxis similar a HTML utilizada en React"
        ],
        explanation: "onClick → I: Evento que responde a un clic. No confundir con onChange ('detecta cambios en formularios'). onClick reacciona cuando el usuario HACE CLIC; onChange cuando ESCRIBE o SELECCIONA.",
        mnemonic: "onClick = CLIC. onChange = CAMBIO en campo. Ambos son eventos pero distintos"
    },
    {
        id: "sec_c_10",
        category: "Relacionar Columnas",
        difficulty: "Intermedio",
        question: "Relaciona — JSX corresponde a:",
        correct: "Sintaxis similar a HTML utilizada en React",
        distractors: [
            "Permite compartir datos entre componentes sin prop drilling",
            "Ejecuta acciones después del renderizado",
            "Estructura reutilizable de interfaz",
            "Datos enviados de padre a hijo",
            "Hook para manejar estado",
            "Función que actualiza el estado",
            "Evento que detecta cambios en formularios",
            "Información que puede cambiar durante la ejecución",
            "Evento que responde a un clic"
        ],
        explanation: "JSX → J: Sintaxis similar a HTML utilizada en React. La palabra clave es 'SINTAXIS SIMILAR a HTML'. No es HTML puro (es similar), no es CSS, y es específicamente utilizada en React.",
        mnemonic: "JSX = la única que dice HTML. 'Sintaxis SIMILAR a HTML' — no igual, no idéntica"
    }
];
