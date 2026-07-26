import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Button from 'primevue/button'
import DatePicker from 'primevue/datepicker'
import Card from 'primevue/card'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Select from 'primevue/select'
import InputText from 'primevue/inputtext'
import Skeleton from 'primevue/skeleton'
import Tag from 'primevue/tag'
import ToastService from 'primevue/toastservice'
import { helioGridPreset } from './assets/theme/helioGridPreset'

import 'primeicons/primeicons.css'
import './assets/styles/theme.css'
import './assets/styles/base.css'

import App from './App.vue'
import { router } from './app/router'

const englishLocale = {
  firstDayOfWeek: 0,
  dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  dayNamesMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
  monthNames: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  today: 'Today',
  clear: 'Clear',
  chooseDate: 'Choose date',
  chooseMonth: 'Choose month',
  chooseYear: 'Choose year',
  prevMonth: 'Previous month',
  nextMonth: 'Next month',
  prevYear: 'Previous year',
  nextYear: 'Next year',
  prevDecade: 'Previous decade',
  nextDecade: 'Next decade',
  dateFormat: 'yy-mm-dd',
  weekHeader: 'Wk',
  fileSizeTypes: ['B', 'KB', 'MB', 'GB', 'TB'],
}

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: helioGridPreset,
    options: {
      darkModeSelector: false,
    },
  },
  locale: englishLocale,
  ripple: true,
})
app.use(ToastService)

app.component('Button', Button)
app.component('DatePicker', DatePicker)
app.component('Card', Card)
app.component('Column', Column)
app.component('DataTable', DataTable)
app.component('Select', Select)
app.component('InputText', InputText)
app.component('Skeleton', Skeleton)
app.component('Tag', Tag)

app.mount('#app')
