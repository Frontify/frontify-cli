---
"@frontify/app-bridge": patch
---

-   feat(useDocumentSection): Subscribe hook to emitter event listeners. A new emitter type, `AppBridge:GuidelineDocumentSection:Action` has been added. This emitter can be used to add and remove items from the sections saved in the hook state.

-   feat(useDocumentSection): `navigationItems` is now returned from this hook. This array filters out sections with an unreadable title and should be used to create section navigation links.
