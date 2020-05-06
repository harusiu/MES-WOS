<template>
  <div class="animated fadeIn">
    <!--<b-form-input v-model="filter" placeholder="輸入關鍵字搜尋"></b-form-input>
    <br>-->
    <c-table :table-data="auto_jobs" :fields="auto_fields" :filter="filter"></c-table>
  </div>
</template>

<script>
import cTable from './Table.vue'

export default {
  name: 'JobProgress',
  components: {cTable},

  data () {
    return {
      filter: '',
      auto_jobs: [],
      auto_fields: [
        {key: 'order_id',           label: '製令',            sortable: true},
        {key: 'product_id',         label: '品號',            sortable: true},
        {key: 'step_spec',          label: '工序',            sortable: true},
        {key: 'progress',           label: '已生產/目標',     sortable: true},
        {key: 'state',              label: '狀態',            sortable: true},
        {key: 'machine',            label: '機台',            sortable: true},
        {key: 'end_time',           label: '預計完成時間',    sortable: true,
            formatter: value => {if(value!=null && value!='' && value!='X')return flatpickr.formatDate(new Date(value), "m/d H:i:S")}},
        {key: 'report_end_time',    label: '實際完成時間',    sortable: true,
            formatter: value => {if(value!=null && value!='' && value!='X')return flatpickr.formatDate(new Date(value), "m/d H:i:S")}},
      ],
    }
  },

  //mounted() {
  created() {
    this.getSchProgress();
  },

  methods: {
    getSchProgress() {
      var sql0 = "SELECT *, CONCAT(step, ', ', spec) AS step_spec, \
                    CONCAT(wire_id, ', ', wire_length, ', ', wire_color) AS wire_info, \
                    CONCAT(acc_good, ' / ', target_qty, ' (', FLOOR(100 * acc_good / target_qty), '%)') AS progress \
                    FROM fortop.job_status \
                    WHERE machine='機001-20(AK18)' AND job_type='";

      var sql = sql0 + '自動' + "' ORDER BY end_time;";

      let param = {sql: sql};
      this.$http.get('/api/generalQuery', {params: param}).then(res => {
        this.auto_jobs = res.data;
      });
    },
  }
}
</script>
