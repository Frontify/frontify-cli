---
"@frontify/platform-app": minor
"@frontify/frontify-cli": patch
---

**Manifest validation**
With the additional validation rules, we make sure that the automation surface definition adheres to the schema.

**Support for automation action settings**
The settings for automation actions can now be defined – in the exact same way as the default settings – via the `settings` property in the `defineApp` method.
This approach is very flexible, allowing to add further settings (e.g. for project, libraries or brand-level settings) easily without the need to adjust the bundler or add additional parameters to the `defineApp` method.
This makes it easier to evolve app settings in the future,

