# Educational Evaluation Methodology

## Objective

Evaluate whether Quantum Learning helps learners understand foundational quantum computing concepts through theory, interactive simulation and visualization.

The evaluation focuses on educational clarity, task completion and perceived usefulness. It does not require analytics, user accounts, tracking, databases or participant data storage inside the application.

## Participant Profile

Recommended participants:

- Undergraduate or Master's students with basic linear algebra knowledge.
- Software engineering students with limited previous exposure to quantum computing.
- Optional comparison group with prior quantum computing familiarity.

Suggested sample size for a TFM evaluation: 5 to 12 participants for qualitative usability evidence, or 15+ participants if quantitative pre/post comparisons are desired.

## Evaluation Scenarios

### Scenario A: Superposition

Goal: determine whether the learner can explain why applying H to `|0⟩` produces approximately 50/50 computational-basis measurement outcomes.

Tasks:

- Open the Superposition Lab.
- Run the default experiment.
- Identify the resulting state and measurement distribution.
- Explain the relationship between amplitude and probability.

Completion criteria:

- Runs the simulation successfully.
- Identifies both `|0⟩` and `|1⟩` as possible outcomes.
- Explains that equal amplitudes produce approximately equal probabilities.

### Scenario B: Entanglement

Goal: determine whether the learner can distinguish a Bell state from a separable two-qubit state and understand why computational-basis probabilities alone do not fully characterize the quantum state.

Tasks:

- Open the Entanglement Lab.
- Select at least two Bell states.
- Compare the Bell state panel with the separable comparison.
- Explain the role of concurrence.

Completion criteria:

- Runs a Bell-state simulation successfully.
- Identifies correlation or anti-correlation depending on the selected Bell state.
- Recognizes that phase and concurrence provide information beyond raw counts.

### Scenario C: Quantum Teleportation

Goal: determine whether the learner can identify the role of entanglement, Alice's measurement, classical communication and Bob's correction.

Tasks:

- Open the Teleportation Lab.
- Select an input state.
- Inspect the protocol circuit and one deterministic measurement branch.
- Explain why Bob applies `I`, `X`, `Z` or `XZ`.
- Verify that final fidelity is approximately 1.

Completion criteria:

- Correctly identifies Alice's and Bob's qubits.
- Explains that Alice sends classical bits, not the quantum state itself.
- Connects Bob's correction with the selected measurement branch.

### Scenario D: Grover Algorithm

Goal: determine whether the learner can explain the roles of the oracle and diffusion operator and why amplitude amplification increases the target probability.

Tasks:

- Open the Grover Lab.
- Choose a target state.
- Step through Initial, Superposition, Oracle, Diffusion and Measurement.
- Explain the negative marked amplitude after the oracle.
- Explain why measurement returns the target with high probability.

Completion criteria:

- Selects a target and navigates all stages.
- Identifies the oracle as a phase flip.
- Describes diffusion as inversion about the mean.
- Reports the correct target bitstring using the q0-as-MSB convention.

### Scenario E: Quantum Circuit Builder

Goal: determine whether the learner can construct and interpret a simple 1- or 2-qubit circuit.

Tasks:

- Open the Builder.
- Build a one-qubit Hadamard experiment.
- Build a two-qubit circuit with a controlled operation.
- Run the simulation and interpret the probabilities.

Completion criteria:

- Adds, orders and removes gates without assistance.
- Runs 1-qubit and 2-qubit simulations successfully.
- Explains the observed measurement probabilities.

## Pre-Test Questions

Use short questions before the session to establish baseline knowledge:

1. What is a qubit?
2. What does it mean for a qubit to be in superposition?
3. What information do measurement probabilities provide?
4. What is entanglement?
5. Have you previously used a quantum circuit simulator?

Answers can be scored qualitatively using a 0-2 rubric:

- 0: incorrect or no answer.
- 1: partially correct.
- 2: correct and clear.

## Post-Test Questions

Use similar questions after the session:

1. Why does a Hadamard gate applied to `|0⟩` produce two possible outcomes?
2. How is an entangled Bell state different from two independent qubits?
3. What role do Alice's measurement and Bob's correction play in teleportation?
4. In Grover's algorithm, what does the oracle do?
5. How did visualization help you interpret amplitudes and probabilities?

Compare pre/post responses for conceptual improvement.

## Likert-Scale Questions

Suggested 1-5 scale: 1 = strongly disagree, 5 = strongly agree.

1. The platform helped me understand quantum concepts more clearly.
2. The simulations were easy to run.
3. The visualizations helped me connect formulas with outcomes.
4. The learning path made the order of concepts understandable.
5. The explanations were clear in my selected language.
6. The interface was easy to navigate.
7. I would use this platform to review quantum computing concepts.

## Qualitative Observation Criteria

During the session, note:

- Where participants hesitate or ask for clarification.
- Whether they understand the difference between state, amplitude, probability and measurement.
- Whether navigation between modules is discoverable.
- Whether participants use Theory Lab or Builder as transversal tools.
- Whether language switching causes confusion.
- Whether mobile or keyboard interaction creates friction.

Avoid recording personal data unless explicitly approved by the evaluation protocol.

## Optional SUS Methodology

If a standardized usability measure is desired, include the System Usability Scale (SUS) after the task session.

Use SUS only as a usability indicator, not as proof of learning. Interpret it together with task-completion evidence and qualitative observations.

## Metrics to Report

Recommended metrics:

- Task completion rate per scenario.
- Average time per scenario, if measured manually.
- Pre/post conceptual score improvement.
- Likert-scale averages and distribution.
- Common usability issues observed.
- Representative anonymous qualitative comments.
- Number of participants who completed the recommended learning path without prompting.

## Proposed Results and Discussion Structure

Suggested TFM structure:

1. Evaluation design and participant profile.
2. Scenario-based task results.
3. Pre/post conceptual understanding comparison.
4. Usability and navigation findings.
5. Educational value of visualization.
6. Limitations of the evaluation.
7. Improvements identified for future work.

## Scope Boundaries

This methodology does not require changes to the application runtime. It deliberately avoids:

- Analytics scripts.
- Event tracking.
- Surveys embedded in the app.
- Backend data collection.
- Authentication.
- Participant databases.
