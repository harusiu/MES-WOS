<template>
  <div class="animated fadeIn">
    <c-table :table-data="jobs" :fields="fields"></c-table>
  </div>
</template>

<script>
import cTable from './Table.vue'

export default {
  name: 'WoAll',
  components: {cTable},

  data () {
    return {
      jobs: [],

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
    this.getJobs();
  },

  methods: {
    getJobs() {
      var sql = "SELECT * FROM mes.job_status ORDER BY due_date, product_id, step";
      let param = {sql: sql};
      this.$http.post('generalQuery', {data: param}).then(res => {
        this.jobs = res.data;
        
        /*for(var i=0; i<this.jobs.length; i++)
        {
          this.jobs[i]['due_date'] = flatpickr.formatDate(new Date(this.jobs[i]['due_date']), "Y-m-d");
        }*/
      });
    },
  }
}
</script>
