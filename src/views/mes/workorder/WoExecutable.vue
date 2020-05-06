<template>
  <div class="animated fadeIn">
    <c-table :table-data="executableJobs" :fields="fields"></c-table>
  </div>
</template>

<script>
import cTable from './Table.vue'

export default {
  name: 'WoExecutable',
  components: {cTable},

  data () {
    return {
      executableJobs: [],

      fields: [
        {key: 'order_id',           label: '製令',      sortable: true},
        {key: 'product_id',         label: '品號',      sortable: true},
        {key: 'step',               label: '工序',      sortable: true},
        {key: 'job_description',    label: '工作描述',  sortable: true},
        {key: 'target_qty',         label: '數量',      sortable: true},
        {key: 'state',              label: '狀態',      sortable: true},
      //{key: 'due_date',           label: '交期',      sortable: true},
      ],
    }
  },

  //mounted() {
  created() {
    this.getExecutableJobs();
  },

  methods: {
    getExecutableJobs()
    {
      var sql = `(SELECT order_id, product_id, step, job_description, target_qty, state, due_date
                    FROM mes.job_status WHERE state!='已出站' AND step=1) UNION
                 (SELECT order_id, product_id, step, job_description, target_qty, state, due_date
                    FROM mes.job_status WHERE state!='已出站' AND (order_id, step) IN
                 (SELECT order_id, next_step FROM mes.job_status WHERE state='已出站'))
                    ORDER BY due_date, product_id, step`;

      let param = {sql: sql};
      this.$http.post('generalQuery', {data: param}).then(res => {
        this.executableJobs = res.data;

        /*for(var i=0; i<this.executableJobs.length; i++)
        {
          this.executableJobs[i]['due_date'] = flatpickr.formatDate(new Date(this.executableJobs[i]['due_date']), "Y-m-d");
        }*/
      });
    },
  }
}
</script>
