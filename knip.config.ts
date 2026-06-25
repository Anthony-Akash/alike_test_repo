export default {
  entry: ['app/app.vue', 'app/pages/**/*.vue', 'server/**/*.ts'],
  project: ['app/**/*.{ts,vue}', 'server/**/*.ts'],
  ignore: ['app/components/ui/**'],
  nuxt: true,
}
