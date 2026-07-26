<script setup lang="ts">
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  DoughnutController,
  ArcElement,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js'
import { Bar, Doughnut, Line } from 'vue-chartjs'
import type { ChartData, ChartOptions } from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  DoughnutController,
  Title,
  Tooltip,
  Legend,
)

const props = defineProps<{
  type: 'bar' | 'line' | 'doughnut'
  data: ChartData<'bar' | 'line' | 'doughnut'>
  options?: ChartOptions<'bar' | 'line' | 'doughnut'>
}>()

const defaultOptions: ChartOptions<'bar' | 'line' | 'doughnut'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom' },
  },
}
</script>

<template>
  <Bar
    v-if="props.type === 'bar'"
    :data="props.data as ChartData<'bar'>"
    :options="(props.options ?? defaultOptions) as ChartOptions<'bar'>"
  />
  <Line
    v-else-if="props.type === 'line'"
    :data="props.data as ChartData<'line'>"
    :options="(props.options ?? defaultOptions) as ChartOptions<'line'>"
  />
  <Doughnut
    v-else
    :data="props.data as ChartData<'doughnut'>"
    :options="(props.options ?? defaultOptions) as ChartOptions<'doughnut'>"
  />
</template>
