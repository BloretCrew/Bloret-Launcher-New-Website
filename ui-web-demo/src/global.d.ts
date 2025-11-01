// Allow usage of custom elements (web components) in JSX without TypeScript errors.
declare global {
  namespace JSX {
    interface IntrinsicElements {
      // Permit any custom element name with any props to avoid missing type declarations for fluent web components.
      // Also list common @fluentui/web-components tags explicitly to help some TypeScript checks.
      'fluent-button'?: any
      'fluent-card'?: any
      'fluent-avatar'?: any
      'fluent-progress'?: any
      'fluent-select'?: any
      'fluent-option'?: any
      'fluent-text-field'?: any
      'fluent-tabs'?: any
      'fluent-tab'?: any
      [elemName: string]: any
    }
  }
}

export {}
