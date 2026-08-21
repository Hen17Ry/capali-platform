import { config } from '@vue-email/compiler'

async function run() {
  const vueEmail = config({ dir: 'emails' })
  const result = await vueEmail.render('WelcomeEmail.vue', {
    props: { name: 'John Doe' }
  })
  console.log('HTML length:', result.html.length)
}
run().catch(console.error)
