Technology Stack
Framework: Next.js 15 (assume App Router unless specified otherwise)
Language: TypeScript
UI Library: Shadcn UI (built on Tailwind CSS and Radix UI)
Styling: Tailwind CSS (primarily via Shadcn components)
State Management: Primarily React built-in hooks (useState, useReducer, useContext) for component-level or simple shared state. Avoid complex global state managers (like Redux, Zustand) unless complexity clearly demands it later.
3. Development Guidelines & Priorities
Component-Based: Build UI using reusable React components.
Shadcn UI First: Prioritize using components directly from Shadcn UI (@/components/ui) whenever applicable. Adapt them as needed. Generate components using the Shadcn CLI conventions.
TypeScript Everywhere: Use strong typing for props, state, and function signatures. Define interfaces and types clearly.
Functionality (Based on PRD v1.0):
Input: Handle name input via Textarea (comma or newline separated). Implement file upload (.txt, .csv).
Configuration: Input for number of winners (Input type number). Switch/Checkbox for "Não repetir nome" (Switch or Checkbox).
Action: Button (Button) to trigger the draw.
Output: Clear display of winner(s) (e.g., using Card, Alert, or custom layout).
Options: Consider "Limpar" button, potential title field, animation toggle (Switch, RadioGroup or Select for animation options).
UI/UX:
Clean & Modern: Follow Shadcn's aesthetic.
Responsive: Ensure usability across devices (mobile, tablet, desktop) using Tailwind's responsive utilities.
Intuitive: Keep the workflow simple and clear.
Language: All user-facing text MUST be in Portuguese (pt-BR). Variable names, function names, comments can be in English for broader understanding if preferred, but UI text is strictly pt-BR.
Code Clarity: Write readable code. Use meaningful variable/function names. Add comments for complex logic, but avoid over-commenting simple code.
Performance: Keep client-side JavaScript minimal. Leverage Next.js features (Server Components where possible, Client Components where interactivity is needed).
Accessibility (a11y): Use semantic HTML. Ensure components are keyboard navigable and screen-reader friendly (Shadcn helps here, but be mindful).
SEO: Use appropriate HTML tags (H1, H2, etc.). Ensure page structure is logical. Metadata (title, description) will be handled via Next.js metadata object.
4. Interaction Style
Be Specific: When I ask for a feature (e.g., "Create the name input component"), implement it using the specified stack (React, TypeScript, Shadcn).
Assume Context: Remember the overall project goal and technology stack.
Provide Explanations: Briefly explain complex logic or choices made, if necessary.
Generate Complete Snippets: Provide functional code snippets or component structures.
Focus on Frontend: Initially, focus on the user interface and client-side logic. Server-side logic (e.g., complex API routes) will be specified if needed.
Iterative Development: We will build the application piece by piece. Focus on the current task.
5. What to Avoid (Initially)