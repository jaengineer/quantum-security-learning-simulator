# Estado actual de la plataforma — Quantum Security Learning Simulator

> Documento técnico + funcional. Refleja el estado del repositorio a **29 de
> agosto de 2026**, tras la consolidación de los laboratorios dedicados de
> Circuit Builder, Theory Lab, Quantum Teleportation y Grover.

---

## 1. Visión general

El proyecto es una **plataforma educativa interactiva** para explicar
conceptos de computación cuántica aplicados a la seguridad de la información.
Combina simulaciones end-to-end contra backend Qiskit para el MVP original con
laboratorios frontend especializados que permiten explorar circuitos,
protocolos y algoritmos paso a paso.

La aplicación mantiene una separación clara entre:

- **Experimentos MVP** en la home: Superposición y Entrelazamiento Bell,
  ejecutados contra el backend FastAPI/Qiskit.
- **Herramientas transversales**: Quantum Circuit Builder y Theory Lab.
- **Laboratorios dedicados de aprendizaje**: Quantum Teleportation Lab y
  Grover Algorithm Lab, con rutas propias y narrativa guiada.

La frontera entre capas sigue siendo explícita: el frontend no acopla lógica
HTTP fuera de su capa de servicios, el motor cuántico backend no conoce React,
y los laboratorios puramente frontend aíslan su simulación matemática en
helpers TypeScript testeables.

### Estado funcional actual

| Bloque | Ruta | Estado |
|---|---:|---|
| Home / selector de experimentos | `/` | Implementado |
| Superposición Hadamard | `/` workspace MVP | Funcional |
| Entrelazamiento Bell `Φ⁺` | `/` workspace MVP | Funcional |
| Quantum Circuit Builder | `/builder` | Implementado |
| Theory Lab | `/theory`, `/theory/[conceptId]` | Implementado |
| Quantum Teleportation Lab | `/teleportation` | Implementado |
| Grover Algorithm Lab | `/grover` | Implementado |
| Ideal vs Noisy Simulation | `/` card coming-soon | Pendiente |
| Quantum Security Case | `/` card coming-soon | Pendiente |

---

## 2. Módulos de la plataforma

### 2.1 Home y estructura de navegación

La home (`frontend/app/page.tsx`) conserva el selector de experimentos del MVP
para Superposición y Bell, y añade accesos separados para herramientas y
laboratorios:

- **Build your own circuit** abre `/builder`.
- **Study the underlying theory** abre `/theory`.
- **Quantum Teleportation Lab** abre `/teleportation`.
- **Grover's Algorithm** abre `/grover`.

Esta separación evita mezclar casos de uso: el Builder es una herramienta
general de circuitos, Theory Lab es una referencia conceptual, y Teleportation
/ Grover son laboratorios guiados con pasos fijos.

### 2.2 Quantum Circuit Builder (`/builder`)

El Builder es una herramienta interactiva cliente-side para construir y
simular circuitos de 1 o 2 qubits sobre las líneas `q0` y `q1`.

Capacidades principales:

- Ruta dedicada `/builder` con carga dinámica SSR-safe, necesaria por el uso de
  `@dnd-kit` y sus ids de accesibilidad generados en cliente.
- Selector de qubits limitado intencionalmente a **1 | 2** en las fronteras de
  UI (`BuilderQubitCount`, `BuilderQubitIndex`).
- Núcleo de simulación preparado para **1 | 2 | 3** qubits cuando sea práctico
  (`SimulatorQubitCount`), sin exponer edición genérica de 3 qubits en el
  Builder.
- Drag-and-drop desde la paleta, reordenación de puertas en el canvas,
  eliminación de puertas y presets.
- Puertas de un qubit: `I`, `X`, `Y`, `Z`, `H`, `S`, `S†`, `T`, `T†`,
  `Rx(θ)`, `Ry(θ)`, `Rz(θ)`.
- Puertas de dos qubits: `CNOT`, `CZ`, `SWAP`.
- Simulación local en TypeScript con vector de estado, probabilidades,
  resumen en notación de Dirac, explicaciones paso a paso y panel de
  entrelazamiento/concurrencia para circuitos de 2 qubits.
- En modo de 1 qubit, visualización Bloch 3D con trayectoria del estado.

Mejoras visuales recientes:

- Los cables del circuito se dibujan por detrás de puertas y símbolos, evitando
  interferencias visuales sobre los bloques.
- El selector de qubits queda alineado con el botón **Run simulation** para
  mejorar la lectura horizontal de los controles.

### 2.3 Quantum Teleportation Lab (`/teleportation`)

El laboratorio de teleportación implementa una visualización de protocolo de
3 qubits sin ampliar el Builder genérico a 3 qubits.

Modelo didáctico:

- `q0`: entrada de Alice `|ψ⟩`.
- `q1`: mitad de Alice del par de Bell.
- `q2`: mitad de Bob, corregida al final.

Circuito visual:

- Preparación de `|ψ⟩` en `q0` y `|0⟩` en `q1`/`q2`.
- Creación del par de Bell con `H(q1)` y `CNOT(q1 → q2)`.
- Operaciones de Alice: `CNOT(q0 → q1)` y `H(q0)`.
- Medidas `M(q0)` y `M(q1)`.
- Flujo clásico de los bits `m0/m1` hacia Bob.
- Corrección en `q2` según la rama seleccionada.

La tabla de corrección se conserva explícitamente:

| Medida de Alice | Corrección de Bob |
|---|---|
| `00` | `I` |
| `01` | `X` |
| `10` | `Z` |
| `11` | `XZ` |

El usuario puede elegir manualmente cualquiera de las cuatro ramas `00`, `01`,
`10`, `11` o muestrear una rama. Cada rama tiene probabilidad `25%` en el
modelo ideal. Tras aplicar la corrección, la fidelidad `F = |⟨ψentrada|ψBob⟩|²`
es aproximadamente `1`, considerando equivalencia salvo fase global.

La UI compara el estado inicial de Alice y el estado recuperado por Bob con
tarjetas Bloch 3D, y el laboratorio tiene internacionalización completa en
inglés y español.

### 2.4 Grover Algorithm Lab (`/grover`)

El laboratorio de Grover implementa una búsqueda cuántica ideal sobre dos
qubits: `N = 4`, con objetivos seleccionables `|00⟩`, `|01⟩`, `|10⟩` y
`|11⟩`.

La función `runGrover(target)` es la fuente única de verdad para:

- El vector de estado de cada etapa.
- Las probabilidades de medida.
- La matriz de oráculo para el objetivo elegido.
- La media de amplitudes antes de la difusión.
- El resultado de medida y los bits clásicos `q0`/`q1`.

Etapas del laboratorio:

1. **Initial**: el registro parte de `|00⟩`.
2. **Superposition**: `H ⊗ H` crea amplitudes uniformes `+0.50`.
3. **Oracle**: el objetivo seleccionado cambia de signo; la amplitud marcada se
   ve negativa y las probabilidades permanecen en `25%`.
4. **Diffusion**: el operador `D = 2|s⟩⟨s| - I` invierte respecto a la media y
   concentra la amplitud en el objetivo.
5. **Measurement**: la medición devuelve el bitstring objetivo con probabilidad
   `100%` en este ejemplo ideal `N = 4`.

Visualizaciones:

- Barras de amplitud con signo real preservado; la etapa de oráculo hace
  visible la amplitud negativa del estado objetivo.
- Barras de probabilidad separadas de las amplitudes para evitar confundir
  fase con probabilidad observable.
- Circuito semántico de solo lectura con columnas Initial, `H`, Oracle,
  Diffusion y Measurement.
- Highlight de operaciones aplicadas, etapa actual y etapas futuras.
- `DiffusionInsightPanel` con amplitud media, estados antes/después de
  difusión y transición numérica del objetivo y de los demás estados.
- `MeasurementResultPanel` con flujo estado cuántico → medida → bits clásicos
  `q0`/`q1` → bitstring → objetivo encontrado.

El laboratorio también incluye internacionalización completa en inglés y
español, y tests matemáticos para todos los objetivos y etapas.

### 2.5 Theory Lab (`/theory`)

Theory Lab es el módulo de referencia conceptual. Proporciona catálogo,
búsqueda, filtros, detalle por concepto e internacionalización EN/ES.

Conceptos actuales relevantes:

- Producto interno.
- Notación de Dirac.
- Matrices unitarias y hermíticas.
- Matriz de densidad y matriz de densidad reducida.
- Entrelazamiento cuántico.
- Teleportación cuántica.
- Fidelidad.
- Algoritmo de Grover.
- Oráculo cuántico.
- Amplificación de amplitud.
- Operador de difusión.
- Gram-Schmidt, teorema espectral y raíces de la unidad.

Los nuevos conceptos de Grover integran la parte algorítmica con la teoría:
qué problema resuelve Grover, qué papel cumple el oráculo, por qué la marca de
fase no cambia probabilidades hasta la difusión, y cómo la amplificación de
amplitud convierte diferencias de signo en mayor probabilidad de medida.

Además, la plataforma mantiene overlays educativos:

- Tooltips aprendibles sobre puertas, kets, operadores y primitivas visuales.
- Glosario flotante (`GlossaryFab` + drawer) con búsqueda local.
- Enlaces desde el glosario hacia conceptos de Theory Lab mediante
  `theoryConceptId`, sin hardcodear rutas en componentes consumidores.

---

## 3. Arquitectura técnica

### 3.1 Backend (`backend/app/`)

El backend FastAPI conserva el alcance MVP:

- `GET /health`.
- `POST /simulate/hadamard`.
- `POST /simulate/bell-state`.
- Modelos Pydantic v2 con `extra="forbid"`.
- Motor Qiskit con `AerSimulator` por defecto y fallback a `BasicSimulator`.
- Normalización de `counts` y `probabilities` para que el frontend reciba
  claves estables.

Los laboratorios nuevos de Builder, Teleportation y Grover no amplían el
contrato backend en esta fase; su matemática vive en TypeScript puro dentro de
`frontend/features/quantum/**/math`.

### 3.2 Frontend (`frontend/`)

Estructura relevante actual:

```text
frontend/
├── app/
│   ├── page.tsx
│   ├── builder/page.tsx
│   ├── grover/page.tsx
│   ├── teleportation/page.tsx
│   └── theory/
│       ├── page.tsx
│       └── [conceptId]/page.tsx
├── components/quantum/
│   ├── bloch/
│   ├── charts/
│   └── circuit/
└── features/
    ├── overlays/
    │   ├── glossary/
    │   └── tooltip/
    ├── quantum/
    │   ├── builder/
    │   ├── grover/
    │   ├── teleportation/
    │   └── components/
    └── theory/
        ├── components/
        ├── content/
        └── i18n/
```

Reglas arquitectónicas relevantes:

1. La home mantiene el flujo MVP de selección de experimento y workspace.
2. Las rutas `/builder`, `/teleportation`, `/grover` y `/theory` son módulos
   dedicados, no variantes internas del workspace MVP.
3. Los módulos interactivos pesados usan fronteras cliente/dinámicas donde
   corresponde para evitar problemas SSR e hidratación.
4. La simulación matemática frontend se concentra en helpers puros y se cubre
   con tests unitarios.
5. El Builder no debe exponer `q2`: cualquier soporte interno de 3 qubits se
   mantiene fuera de sus tipos de frontera.

---

## 4. Validación

Comandos de validación relevantes para esta rama:

```bash
cd frontend
npm run lint
npx tsc --noEmit
npm test -- features/quantum/grover/math/grover.test.ts
npm test -- features/quantum/teleportation/math/teleportation-protocol.test.ts
npm test -- features/quantum/builder/math/quantum-simulator.test.ts
```

Áreas cubiertas por tests frontend:

- Matemática del simulador cuántico del Builder.
- Protocolo de teleportación, ramas de medida, correcciones y fidelidad.
- Algoritmo de Grover para todos los objetivos y etapas.

Este documento no afirma una ejecución nueva de esos comandos salvo que se
indique explícitamente en el resumen de la tarea. Para esta actualización se
han usado comprobaciones de lectura e inspección de la working copy.

---

## 5. Limitaciones actuales

- El backend sigue limitado al MVP Hadamard/Bell; Grover y Teleportation son
  laboratorios frontend ideales.
- El Builder genérico solo permite 1 o 2 qubits, por diseño. El soporte interno
  de 3 qubits existe para casos específicos, no como edición libre.
- El modelo de ruido todavía no está integrado en el contrato backend.
- No hay persistencia de circuitos, usuarios ni autenticación.
- Grover usa `N = 4` ideal y una iteración pedagógica; no representa una
  ventaja cuántica práctica.
- Teleportation no simula ruido, decoherencia ni canal clásico real; muestra el
  protocolo ideal.

---

## 6. Roadmap actualizado

Prioridades razonables después del estado actual:

1. Integrar comparación ideal vs ruidosa con `NoiseModel` y extensión explícita
   del contrato backend.
2. Añadir persistencia/exportación de circuitos del Builder si el TFM requiere
   guardar escenarios reproducibles.
3. Ampliar los laboratorios con capturas y narrativa final para la memoria.
4. Evaluar si nuevos algoritmos (por ejemplo Shor simplificado o BB84) aportan
   más valor que pulir los laboratorios existentes.
5. Mantener 3 qubits como capacidad controlada para protocolos concretos, no
   como opción genérica del Builder.

Grover ya no pertenece al roadmap futuro: está implementado como laboratorio
dedicado en `/grover`.

---

## 7. Capturas recomendadas para la memoria

La lista operativa de placeholders vive en
[`docs/screenshots/README.md`](screenshots/README.md). Las capturas mínimas
actuales deberían cubrir:

- Home con módulos principales y laboratorios dedicados.
- Builder en modo 1 qubit.
- Builder en modo 2 qubits con panel de entrelazamiento.
- Teleportation Lab con circuito, rama de medida y fidelidad.
- Grover Lab en etapas clave: Superposition, Oracle, Diffusion y Measurement.
- Theory Lab con conceptos de Grover, oráculo, amplificación o difusión.

---

## 8. Decisiones de diseño relevantes para la memoria del TFM

1. **Separación entre módulos guiados y herramientas transversales**. Builder y
   Theory son reutilizables; Teleportation y Grover son experiencias didácticas
   cerradas.
2. **Restricción explícita del Builder a 1 | 2 qubits**. Evita una UI genérica
   de 3 qubits que todavía no está diseñada, aunque el simulador pueda soportar
   casos de 3 qubits.
3. **Matemática pura y testeable en frontend**. Grover y Teleportation no
   dependen de efectos React para calcular estados, probabilidades o fidelidad.
4. **Amplitudes y probabilidades separadas en Grover**. La UI enseña que el
   oráculo modifica fase/signo antes de que la difusión cambie la distribución
   observable.
5. **Fidelidad como criterio de éxito en Teleportation**. El laboratorio no se
   limita a mostrar correcciones; verifica que Bob recupera el estado de Alice.
6. **Internacionalización EN/ES en laboratorios nuevos**. El contenido técnico
   de Teleportation, Grover y Theory Lab puede presentarse en ambos idiomas.
7. **Overlays conectados con Theory Lab**. El glosario y los tooltips enlazan
   práctica y teoría mediante identificadores de concepto, no rutas duplicadas.

---

_Última actualización: 29 de agosto de 2026._
