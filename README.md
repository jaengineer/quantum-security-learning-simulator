# Quantum Security Learning Simulator

> Interactive MVP for visualizing basic quantum computing concepts applied to information security.

Interactive educational platform for visualizing quantum computing concepts
applied to information security using Qiskit, Next.js and FastAPI.

This repository contains the prototype of a web platform developed for a
Master's Thesis (TFM) in Quantum Computing. It now exposes a modular learning
platform: foundational labs for superposition and entanglement, routed
algorithm/protocol labs, transversal learning tools, and a FastAPI/Qiskit
backend for the original MVP simulations.

---

## MVP architecture (v2: Experiment Selector)

### Objective

To validate, end-to-end, the integration between a Next.js frontend, a
FastAPI backend and a Qiskit simulation engine through a *menu of
experiments*, each one configurable and didactically commented. The first
two experiments (Superposition and Entanglement) are fully functional; the
other two are advertised as the roadmap of the MVP.

### Application flow

```mermaid
flowchart LR
    Landing["1. Landing<br/>ExperimentSelector"] --> Config["2. ExperimentConfiguration"]
    Config --> Run["3. SimulationResults"]
    Run --> Interpret["4. QuantumStateEvolution +<br/>didactic interpretation"]
    Run -->|"Run again"| Config
    Config -->|"Back"| Landing
```

### Architecture diagram (text)

```
User Interface (Next.js)
        ↓ REST API
FastAPI Backend
        ↓
Qiskit Simulation Engine
        ↓
Simulation Results
```

### Architecture diagram (visual)

```mermaid
flowchart TD
    UI["Next.js UI (App Router)"]
    Selector["ExperimentSelector"]
    Workspace["SimulationWorkspace"]
    Service["quantumApi.ts"]
    API["FastAPI /simulate/* routers"]
    Hadamard["quantum/hadamard.py"]
    Bell["quantum/bell.py"]
    Sim["AerSimulator or BasicSimulator"]

    UI --> Selector --> Workspace
    Workspace -->|"runHadamardSimulation / runBellSimulation"| Service
    Service -->|"HTTP POST JSON"| API
    API --> Hadamard --> Sim
    API --> Bell --> Sim
    Sim --> API --> Service --> Workspace
```

### Available modules

| Module | Route | Qubits | Notes |
| --- | --- | ---: | --- |
| Superposition Lab | `/superposition` | 1 | Original MVP Hadamard experiment promoted to a routed Foundations lab; uses `POST /simulate/hadamard`. |
| Entanglement Lab | `/entanglement` | 2 | Original MVP Bell experiment promoted to a routed Foundations lab; supports `Φ⁺`, `Φ⁻`, `Ψ⁺`, `Ψ⁻` through `POST /simulate/bell-state`. |
| Quantum Teleportation Lab | `/teleportation` | 3 | Guided frontend lab for the teleportation protocol. |
| Grover Algorithm Lab | `/grover` | 2 | Guided frontend lab for 2-qubit Grover search. |
| Quantum Circuit Builder | `/builder` | 1-2 | Transversal circuit-building and local simulation tool. |
| Theory Lab | `/theory` | - | Curated EN/ES conceptual reference. |

### Screenshots

> Drop the corresponding PNGs in [docs/screenshots/](docs/screenshots/) to
> populate these placeholders. The filenames are referenced verbatim below.

- ![Landing / Experiment Selector](docs/screenshots/landing.png)
- ![Superposition result](docs/screenshots/superposition-result.png)
- ![Entanglement result](docs/screenshots/entanglement-result.png)

### Folder structure

```
TFM-Platform/
├── README.md
├── .gitignore
├── docs/
│   └── screenshots/                # PNG placeholders for the TFM report
├── frontend/                       # Next.js 16 + TS strict + Tailwind v4
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                # state machine landing <-> workspace
│   │   └── globals.css
│   ├── components/ui/{Button,Card}.tsx
│   ├── features/quantum/
│   │   ├── data/experiments.ts     # static catalog (4 entries)
│   │   ├── services/quantumApi.ts  # runHadamard / runBell / generic runSimulation
│   │   ├── types.ts                # ExperimentType, QuantumExperiment, requests, result
│   │   └── components/
│   │       ├── ExperimentSelector.tsx
│   │       ├── ExperimentCard.tsx
│   │       ├── SimulationWorkspace.tsx
│   │       ├── ExperimentConfiguration.tsx
│   │       ├── QubitModeSelector.tsx
│   │       ├── SimulationForm.tsx
│   │       ├── BellSimulationForm.tsx
│   │       ├── SimulationResults.tsx
│   │       ├── ProbabilityBars.tsx
│   │       ├── CircuitDiagram.tsx
│   │       └── QuantumStateEvolution.tsx
│   └── lib/env.ts
└── backend/                        # FastAPI + Qiskit
    ├── app/
    │   ├── main.py                 # CORS + routers
    │   ├── api/{health,simulation}.py
    │   ├── schemas/simulation.py   # HadamardRequest, BellStateRequest, QuantumSimulationResult
    │   ├── services/simulation_service.py
    │   ├── quantum/{backend,hadamard,bell}.py
    │   └── core/{config,errors}.py
    ├── tests/{test_hadamard,test_bell}.py
    └── requirements.txt
```

### Implemented endpoints

| Method | Path                    | Purpose                                       |
| ------ | ----------------------- | --------------------------------------------- |
| GET    | `/health`               | Liveness probe.                               |
| POST   | `/simulate/hadamard`    | Single-qubit Hadamard experiment.             |
| POST   | `/simulate/bell-state`  | Two-qubit Bell states (`Φ⁺`, `Φ⁻`, `Ψ⁺`, `Ψ⁻`). |

#### `POST /simulate/hadamard`

Request:

```json
{ "initial_state": "0", "shots": 1024 }
```

Response (`QuantumSimulationResult`):

```json
{
  "circuit": "hadamard",
  "initial_state": "0",
  "qubits": 1,
  "shots": 1024,
  "counts": { "0": 512, "1": 512 },
  "probabilities": { "0": 0.5, "1": 0.5 },
  "simulator": "aer_simulator",
  "execution_time_ms": 4.123
}
```

#### `POST /simulate/bell-state`

Request:

```json
{ "bell_state": "phi_plus", "shots": 1024 }
```

Valid `bell_state` values:

```text
phi_plus
phi_minus
psi_plus
psi_minus
```

Response:

```json
{
  "circuit": "bell-state",
  "bell_state": "phi_plus",
  "qubits": 2,
  "shots": 1024,
  "counts": { "00": 512, "01": 0, "10": 0, "11": 512 },
  "probabilities": { "00": 0.5, "01": 0, "10": 0, "11": 0.5 },
  "simulator": "aer_simulator",
  "execution_time_ms": 5.842
}
```

### How to run

#### 1. Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

- API root: <http://localhost:8000>
- Swagger UI: <http://localhost:8000/docs>

Run the test suite:

```bash
python -m pytest tests/ -v
```

#### 2. Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

Open <http://localhost:3000>, pick an experiment, configure parameters and
click "Run simulation".

### Didactic background

- **Superposition.** A qubit can be in a linear combination of the
  computational basis states. The Hadamard gate is the canonical primitive
  to create an equal superposition from `|0⟩` or `|1⟩`. The MVP uses a
  single qubit because it isolates the concept in its minimal form.

- **Entanglement.** Two qubits become entangled when their joint state
  cannot be written as the product of individual qubit states. The
  Entanglement Lab supports the four canonical Bell states. `Φ⁺` and `Φ⁻`
  yield `|00⟩` or `|11⟩` in the computational basis, while `Ψ⁺` and `Ψ⁻`
  yield `|01⟩` or `|10⟩`. The `+` and `−` variants differ by relative phase,
  even when computational-basis measurement probabilities are identical.

- **Why 1 and 2 qubits?** They are the smallest configurations that capture
  the two fundamental quantum phenomena needed to build the rest of the
  roadmap (noise comparison, Grover, Shor and security scenarios).

### Current limitations

- Ideal simulation only; no noise model is plugged in.
- No persistence and no authentication.
- CORS is open only to `http://localhost:3000` by default.

### Next steps (roadmap)

1. Ideal vs Noisy comparison using `AerSimulator` noise models.
2. Pauli `X`/`Z` single-qubit baselines.
3. Simplified Shor (period-finding on a small modulus).
4. Dedicated security module: BB84 QKD and a discussion of post-quantum
   cryptography.

Extension guides:

- [backend/EXTENDING.md](backend/EXTENDING.md)
- [frontend/EXTENDING.md](frontend/EXTENDING.md)

---

## Deployment

The public TFM deployment uses a split architecture:

```mermaid
flowchart TD
    Browser["Browser"]
    Hosting["Firebase Hosting<br/>static Next.js export"]
    Backend["Cloud Run<br/>FastAPI + Qiskit"]
    Simulator["Qiskit AerSimulator<br/>BasicSimulator fallback"]

    Browser --> Hosting
    Browser -->|"HTTPS API calls for Hadamard / Bell"| Backend
    Backend --> Simulator
```

### Google Cloud / Firebase project

- Display name: `Quantum Learning Simulator`
- Project ID: `quantum-learning-simulator`
- Firebase Hosting domains:
  - `https://quantum-learning-simulator.web.app`
  - `https://quantum-learning-simulator.firebaseapp.com`
- Cloud Run backend:
  - `https://quantum-simulator-api-yw6cphsnrq-ew.a.run.app`

The original backend remains a separate FastAPI service because Firebase
Hosting cannot run Python/FastAPI directly.

### Account safety

Deployments must use the personal Google account:

```text
ja.appengineer@gmail.com
```

Before running any deploy command, verify:

```bash
firebase login:list
gcloud auth list --filter=status:ACTIVE --format='value(account)'
gcloud config get-value project
```

Expected values:

```text
Firebase account: ja.appengineer@gmail.com
gcloud account:   ja.appengineer@gmail.com
gcloud project:   quantum-learning-simulator
```

Do not deploy under any other account or project.

### Frontend deployment

The frontend is a Next.js App Router application that currently prerenders
all public routes as static/SSG output.

Firebase Hosting serves the static export generated in:

```text
frontend/out
```

Required public build-time variable:

```bash
NEXT_PUBLIC_QUANTUM_API_URL=https://<cloud-run-service-url>
```

Local development keeps using:

```bash
NEXT_PUBLIC_QUANTUM_API_URL=http://localhost:8000
```

Build and deploy:

```bash
cd frontend
NEXT_PUBLIC_QUANTUM_API_URL=https://<cloud-run-service-url> npm run build
cd ..
firebase deploy --only hosting --project quantum-learning-simulator
```

### Backend deployment

The backend is deployed to Cloud Run from `backend/Dockerfile`.

Cloud Run must provide the `PORT` environment variable. The container starts:

```bash
uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8080}
```

Required production CORS origins:

```bash
CORS_ORIGINS=http://localhost:3000,https://quantum-learning-simulator.web.app,https://quantum-learning-simulator.firebaseapp.com
```

Deploy:

```bash
gcloud run deploy quantum-simulator-api \
  --source backend \
  --region europe-west1 \
  --allow-unauthenticated \
  --set-env-vars CORS_ORIGINS=http://localhost:3000,https://quantum-learning-simulator.web.app,https://quantum-learning-simulator.firebaseapp.com,SERVICE_NAME=quantum-simulator-api
```

After deployment, verify the backend before building the production frontend:

```bash
curl https://<cloud-run-service-url>/health
```

### Validation commands

Frontend:

```bash
cd frontend
npm run lint
./node_modules/.bin/tsc --noEmit
NEXT_PUBLIC_QUANTUM_API_URL=http://localhost:8000 npm run build
npx --yes tsx --tsconfig tsconfig.json --test features/quantum/builder/math/quantum-simulator.test.ts
npx --yes tsx --tsconfig tsconfig.json --test features/quantum/teleportation/math/teleportation-protocol.test.ts
npx --yes tsx --tsconfig tsconfig.json --test features/quantum/grover/math/grover.test.ts
```

Backend:

```bash
cd backend
python -m pytest tests/ -v
```

Container smoke check:

```bash
docker build -t quantum-simulator-api ./backend
docker run --rm -p 8080:8080 -e PORT=8080 quantum-simulator-api
curl http://localhost:8080/health
```

### Production verification checklist

- Frontend URL loads.
- Direct refresh works for `/superposition`, `/entanglement`, `/builder`,
  `/theory`, `/theory/<conceptId>`, `/teleportation`, and `/grover`.
- Static assets, fonts, Tailwind styles, KaTeX, Plotly, Bloch Sphere 3D,
  drag/drop, glossary and tooltips work.
- Builder works in 1-qubit and 2-qubit modes.
- Teleportation Lab and Grover Lab work without backend calls.
- Hadamard and Bell experiments call Cloud Run, not localhost.
- Browser console has no CORS errors.
- `/health`, `/simulate/hadamard`, and `/simulate/bell-state` respond from
  Cloud Run.
- No credentials, service-account JSON files, private keys or `.env.local`
  files are committed.

---

## Descripción académica del prototipo inicial

Este prototipo constituye la primera versión funcional del simulador
didáctico/interfaz desarrollado en el marco del Trabajo Fin de Máster sobre
computación cuántica aplicada a la seguridad de la información. Su finalidad
no es proporcionar una plataforma de producción, sino validar la viabilidad
técnica de la arquitectura propuesta integrando, de extremo a extremo, una
interfaz web interactiva (Next.js con TypeScript y Tailwind CSS), una API
REST construida con FastAPI y un motor de simulación cuántica basado en
Qiskit. La frontera entre capas se mantiene explícita: la interfaz no conoce
el motor cuántico, el motor cuántico no conoce HTTP, y el contrato entre
ambos se expresa mediante modelos Pydantic en el backend y tipos TypeScript
en el frontend, lo que asegura una comunicación tipada y auditable.

Desde el punto de vista arquitectónico, el prototipo se ha diseñado para
crecer sin necesidad de refactorizaciones disruptivas. La capa de simulación
cuántica está aislada como un paquete Python independiente, sin dependencias
de FastAPI, lo que permite ejecutarla en notebooks, en pruebas unitarias o
en futuras integraciones por línea de comandos. El modelo de respuesta
`QuantumSimulationResult` es genérico, de modo que los próximos circuitos
podrán reutilizar el contrato existente. El selector de simulador implementa
un mecanismo de degradación elegante (`AerSimulator` con respaldo en
`BasicSimulator`) que garantiza la ejecución del MVP incluso en entornos
donde la rueda binaria de `qiskit-aer` no esté disponible.

## Evolución del MVP respecto a la propuesta inicial

La primera iteración del prototipo se limitaba a una única simulación de la
puerta Hadamard sobre un qubit y exponía una sola pantalla con el formulario
asociado. En esta segunda iteración el prototipo se ha transformado en una
**plataforma modular**: la pantalla inicial es un selector de experimentos
en el que el usuario elige el fenómeno cuántico que desea explorar
—superposición o entrelazamiento— y, una vez seleccionado, accede a un
*workspace* dedicado donde configura los parámetros (estado inicial o Bell
state, número de *shots*) y observa los resultados.

Además de añadir un segundo experimento real (estado de Bell `Φ⁺` con
`H` + `CX` y medida sobre dos qubits), el frontend incorpora ahora un
componente de evolución del estado cuántico (`QuantumStateEvolution`) que
muestra paso a paso la transformación que sufre el sistema, así como
indicadores explícitos de qubits y del backend de simulación utilizado. En
el backend se ha generalizado el contrato de respuesta para incluir
metadatos opcionales (`qubits`, `simulator`, `execution_time_ms`) y se ha
añadido un endpoint `POST /simulate/bell-state` siguiendo el mismo patrón
de servicio y motor que el caso Hadamard.

El catálogo de experimentos también incluye, deliberadamente visibles pero
deshabilitadas, las dos próximas iteraciones del MVP (Ideal vs Noisy
Simulation y Quantum Security Case). Esto cumple un doble objetivo
académico: por un lado, informa al evaluador del recorrido planificado del
proyecto; por otro, demuestra que la arquitectura está preparada para
incorporar nuevos módulos sin reformas significativas, ya que basta con
añadir un motor en `backend/app/quantum/`, un schema y un endpoint, y un
formulario específico en `frontend/features/quantum/components/`.

---

## License

Academic use only.
