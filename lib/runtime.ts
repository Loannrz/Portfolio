/** Dev-only shortcuts — production stays full fidelity */
export const IS_DEV =
  typeof process !== 'undefined' && process.env.NODE_ENV === 'development'
