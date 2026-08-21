const { resolve } = require('path')
const { config } = require('@vue-email/compiler')

async function run() {
  const vueEmail = config(resolve(process.cwd(), 'emails'))
  try {
    const template = await vueEmail.render('NewEventAlert.vue', { props: { eventTitle: 'Test', link: 'http://test' } })
    console.log(template.html.substring(0, 100))
  } catch (err) {
    console.error(err)
  }
}
run()
