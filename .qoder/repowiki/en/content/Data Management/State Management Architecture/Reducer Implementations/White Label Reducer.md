# White Label Reducer

<cite>
**Referenced Files in This Document**
- [whiteLabelReducer.js](file://src/context/reducers/whiteLabelReducer.js)
- [Hcontext.js](file://src/context/Hcontext.js)
- [Header.js](file://src/components/common/Header.js)
- [Home.js](file://src/screens/Home/Home.js)
- [Setting.js](file://src/screens/Setting/Setting.js)
- [index.js](file://src/assets/constants/index.js)
- [colors.xml](file://android/app/src/main/res/values/colors.xml)
- [MainActivity.java](file://android/app/src/main/java/com/happimynd/MainActivity.java)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Core Components](#core-components)
4. [Architecture Overview](#architecture-overview)
5. [Detailed Component Analysis](#detailed-component-analysis)
6. [Dependency Analysis](#dependency-analysis)
7. [Performance Considerations](#performance-considerations)
8. [Troubleshooting Guide](#troubleshooting-guide)
9. [Conclusion](#conclusion)

## Introduction
This document explains the whiteLabelReducer that powers brand customization and theme state in HappiMynd. It covers the initial state structure for brand configurations, how actions apply white-label settings, and how the reducer integrates with the design system and UI components. It also outlines practical scenarios for brand switching, theme customization workflows, and white-label deployment patterns across client implementations.

## Project Structure
The white-label system is implemented as a Redux-style reducer within the global Hcontext provider. It is consumed by UI components such as the Header and Setting screens, and initialized during app startup via a white-label status API call.

```mermaid
graph TB
subgraph "Context Layer"
HC["Hcontext Provider<br/>initializes reducers"]
WL["whiteLabelReducer<br/>state: header, footer, logo"]
end
subgraph "UI Layer"
HD["Header Component<br/>renders logo"]
ST["Setting Screen<br/>footer branding"]
HM["Home Screen<br/>loads white-label on mount"]
end
subgraph "External APIs"
API["/api/v1/white-labelling-status<br/>getWhiteLabel()"]
end
HC --> WL
HC --> HD
HC --> ST
HC --> HM
HM --> API
API --> WL
WL --> HD
WL --> ST
```

**Diagram sources**
- [Hcontext.js:26-41](file://src/context/Hcontext.js#L26-L41)
- [whiteLabelReducer.js:1-21](file://src/context/reducers/whiteLabelReducer.js#L1-L21)
- [Header.js:17-81](file://src/components/common/Header.js#L17-L81)
- [Setting.js:218-229](file://src/screens/Setting/Setting.js#L218-L229)
- [Home.js:568-585](file://src/screens/Home/Home.js#L568-L585)

**Section sources**
- [Hcontext.js:26-41](file://src/context/Hcontext.js#L26-L41)
- [whiteLabelReducer.js:1-21](file://src/context/reducers/whiteLabelReducer.js#L1-L21)
- [Header.js:17-81](file://src/components/common/Header.js#L17-L81)
- [Setting.js:218-229](file://src/screens/Setting/Setting.js#L218-L229)
- [Home.js:568-585](file://src/screens/Home/Home.js#L568-L585)

## Core Components
- Initial state: The white-label state includes three fields:
  - header: integer flag controlling header branding behavior
  - footer: integer flag controlling footer branding behavior
  - logo: string URI or empty string for dynamic logo rendering
- Actions:
  - SET_WHITE_LABEL: Applies brand configuration payload to state
  - RESET_WHITE_LABEL: Placeholder action included for symmetry (current implementation returns state unchanged)

These components work together to enable per-client branding without hardcoding assets or colors in UI components.

**Section sources**
- [whiteLabelReducer.js:1-21](file://src/context/reducers/whiteLabelReducer.js#L1-L21)

## Architecture Overview
The white-label pipeline connects API-driven branding data to UI rendering through the Hcontext provider and whiteLabelReducer.

```mermaid
sequenceDiagram
participant App as "App Startup"
participant Home as "Home Screen"
participant Ctx as "Hcontext"
participant API as "getWhiteLabel()"
participant Reducer as "whiteLabelReducer"
App->>Home : "Render Home"
Home->>Ctx : "Invoke getWhiteLabel()"
Ctx->>API : "GET /api/v1/white-labelling-status"
API-->>Ctx : "Brand payload {header, footer, logo}"
Ctx->>Reducer : "dispatch({type : 'SET_WHITE_LABEL', payload})"
Reducer-->>Ctx : "Updated whiteLabelState"
Ctx-->>Home : "Provider supplies whiteLabelState"
Home->>Header : "Pass whiteLabelState to Header"
Header-->>Home : "Logo renders from state"
```

**Diagram sources**
- [Home.js:568-585](file://src/screens/Home/Home.js#L568-L585)
- [Hcontext.js:859-867](file://src/context/Hcontext.js#L859-L867)
- [whiteLabelReducer.js:7-21](file://src/context/reducers/whiteLabelReducer.js#L7-L21)
- [Header.js:49-58](file://src/components/common/Header.js#L49-L58)

## Detailed Component Analysis

### whiteLabelReducer
The reducer defines the brand state shape and updates it based on dispatched actions. It supports:
- Applying brand settings via SET_WHITE_LABEL
- A placeholder RESET_WHITE_LABEL action for future expansion

```mermaid
flowchart TD
Start(["Action Received"]) --> Type{"Action Type?"}
Type --> |SET_WHITE_LABEL| Apply["Merge payload into state<br/>header, footer, logo"]
Type --> |RESET_WHITE_LABEL| Noop["Return current state"]
Type --> |Other| Default["Return current state"]
Apply --> End(["New State"])
Noop --> End
Default --> End
```

**Diagram sources**
- [whiteLabelReducer.js:7-21](file://src/context/reducers/whiteLabelReducer.js#L7-L21)

**Section sources**
- [whiteLabelReducer.js:1-21](file://src/context/reducers/whiteLabelReducer.js#L1-L21)

### Hcontext Provider Integration
The Hcontext provider initializes the whiteLabelReducer and exposes both state and dispatch to consumers. It also provides the getWhiteLabel API wrapper used by screens to load branding.

```mermaid
classDiagram
class HcontextProvider {
+authState
+whiteLabelState
+happiSelfState
+snackState
+authDispatch()
+whiteLabelDispatch()
+happiSelfDispatch()
+snackDispatch()
+getWhiteLabel()
}
class whiteLabelReducer {
+initialState
+setState()
}
HcontextProvider --> whiteLabelReducer : "useReducer(...)"
```

**Diagram sources**
- [Hcontext.js:26-41](file://src/context/Hcontext.js#L26-L41)
- [Hcontext.js:859-867](file://src/context/Hcontext.js#L859-L867)
- [whiteLabelReducer.js:1-21](file://src/context/reducers/whiteLabelReducer.js#L1-L21)

**Section sources**
- [Hcontext.js:26-41](file://src/context/Hcontext.js#L26-L41)
- [Hcontext.js:859-867](file://src/context/Hcontext.js#L859-L867)

### Header Component Branding
The Header component reads whiteLabelState.logo and conditionally renders either a branded logo URI or the default asset. It also respects showLogo to hide the logo when needed.

```mermaid
sequenceDiagram
participant UI as "Header Component"
participant Ctx as "Hcontext"
participant State as "whiteLabelState"
UI->>Ctx : "useContext(Hcontext)"
Ctx-->>UI : "whiteLabelState"
UI->>State : "Read logo field"
alt "logo is a URI"
UI-->>UI : "Render branded logo"
else "logo is empty"
UI-->>UI : "Render default asset"
end
```

**Diagram sources**
- [Header.js:17-81](file://src/components/common/Header.js#L17-L81)
- [Header.js:49-58](file://src/components/common/Header.js#L49-L58)

**Section sources**
- [Header.js:17-81](file://src/components/common/Header.js#L17-L81)

### Footer Branding in Settings
The Setting screen conditionally renders a "Powered by" footer when whiteLabelState.footer indicates branding should be shown. It uses a fixed local asset for the logo in this case.

```mermaid
flowchart TD
Check["Check whiteLabelState.footer"] --> Show{"Footer enabled?"}
Show --> |Yes| Render["Render 'Powered by' with logo"]
Show --> |No| Skip["Do nothing"]
Render --> End(["Footer visible"])
Skip --> End
```

**Diagram sources**
- [Setting.js:218-229](file://src/screens/Setting/Setting.js#L218-L229)

**Section sources**
- [Setting.js:218-229](file://src/screens/Setting/Setting.js#L218-L229)

### Home Screen Brand Loading
On mount, the Home screen calls getWhiteLabel(), receives a payload, and dispatches SET_WHITE_LABEL to apply branding. This ensures the app loads client-specific branding at startup.

```mermaid
sequenceDiagram
participant HM as "Home Screen"
participant Ctx as "Hcontext"
participant API as "getWhiteLabel()"
participant WL as "whiteLabelReducer"
HM->>Ctx : "getWhiteLabel()"
Ctx->>API : "Fetch white-label status"
API-->>Ctx : "Payload {header, footer, logo}"
Ctx->>WL : "dispatch({type : 'SET_WHITE_LABEL', payload})"
WL-->>Ctx : "State updated"
Ctx-->>HM : "Provider passes updated state"
```

**Diagram sources**
- [Home.js:568-585](file://src/screens/Home/Home.js#L568-L585)
- [Hcontext.js:859-867](file://src/context/Hcontext.js#L859-L867)
- [whiteLabelReducer.js:7-21](file://src/context/reducers/whiteLabelReducer.js#L7-L21)

**Section sources**
- [Home.js:568-585](file://src/screens/Home/Home.js#L568-L585)
- [Hcontext.js:859-867](file://src/context/Hcontext.js#L859-L867)

### Theme Provider Integration
While the whiteLabelReducer itself is UI-state focused, the app’s theme system is configured at the native level and via shared constants:

- Android theme initialization sets the app theme early in the Activity lifecycle, ensuring consistent UI theming from launch.
- Shared color constants define the design tokens used across components.

```mermaid
graph TB
subgraph "Android"
MA["MainActivity.onCreate()<br/>setTheme(AppTheme)"]
end
subgraph "Shared Design"
AC["assets/constants/index.js<br/>colors palette"]
end
subgraph "UI Components"
HD["Header"]
ST["Setting"]
end
MA --> HD
MA --> ST
AC --> HD
AC --> ST
```

**Diagram sources**
- [MainActivity.java:12-18](file://android/app/src/main/java/com/happimynd/MainActivity.java#L12-L18)
- [index.js:1-14](file://src/assets/constants/index.js#L1-L14)

**Section sources**
- [MainActivity.java:12-18](file://android/app/src/main/java/com/happimynd/MainActivity.java#L12-L18)
- [index.js:1-14](file://src/assets/constants/index.js#L1-L14)

## Dependency Analysis
The white-label system has minimal coupling and clear boundaries:

- Hcontext orchestrates state and API access
- whiteLabelReducer encapsulates brand state transitions
- UI components depend only on context-provided state
- No circular dependencies were observed in the analyzed files

```mermaid
graph LR
API["getWhiteLabel()"] --> Ctx["Hcontext"]
Ctx --> Reducer["whiteLabelReducer"]
Reducer --> UI["Header / Setting"]
```

**Diagram sources**
- [Hcontext.js:859-867](file://src/context/Hcontext.js#L859-L867)
- [whiteLabelReducer.js:7-21](file://src/context/reducers/whiteLabelReducer.js#L7-L21)
- [Header.js:17-81](file://src/components/common/Header.js#L17-L81)
- [Setting.js:218-229](file://src/screens/Setting/Setting.js#L218-L229)

**Section sources**
- [Hcontext.js:859-867](file://src/context/Hcontext.js#L859-L867)
- [whiteLabelReducer.js:7-21](file://src/context/reducers/whiteLabelReducer.js#L7-L21)
- [Header.js:17-81](file://src/components/common/Header.js#L17-L81)
- [Setting.js:218-229](file://src/screens/Setting/Setting.js#L218-L229)

## Performance Considerations
- Keep brand payloads small: Only transmit necessary branding fields to avoid unnecessary re-renders.
- Memoize derived UI decisions: Components can compare previous state to logo and flags to minimize re-rendering.
- Network reliability: Cache last-known branding locally if desired, but rely on the API for real-time updates.

## Troubleshooting Guide
Common issues and resolutions:
- Logo not appearing:
  - Verify whiteLabelState.logo is a valid URI and not an empty string.
  - Confirm the Header component is receiving the latest state from Hcontext.
- Footer branding missing:
  - Ensure whiteLabelState.footer is enabled in the returned payload.
  - Check that the Setting screen conditionally renders the footer block.
- Brand not applied on startup:
  - Confirm getWhiteLabel() resolves successfully and dispatches SET_WHITE_LABEL.
  - Ensure the Home screen invokes the loading logic on mount.

**Section sources**
- [Header.js:49-58](file://src/components/common/Header.js#L49-L58)
- [Setting.js:218-229](file://src/screens/Setting/Setting.js#L218-L229)
- [Home.js:568-585](file://src/screens/Home/Home.js#L568-L585)
- [Hcontext.js:859-867](file://src/context/Hcontext.js#L859-L867)

## Conclusion
The whiteLabelReducer provides a lightweight, scalable mechanism for client-specific branding in HappiMynd. By centralizing brand state in Hcontext and exposing it to UI components, the system enables flexible white-label deployments without hardcoding assets or colors. Integrating with the design system and theme provider ensures consistent visuals across platforms.