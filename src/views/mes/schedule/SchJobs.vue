<template>
  <div class="animated fadeIn">
    <b-tabs>
      <b-tab :title="'所有工單 (' + jobs.length + ')'">
        <c-table :table-data="jobs" :fields="fields"></c-table>
      </b-tab>

      <b-tab :title="'可執行、待排程工單 (' + executableJobs.length + ')'">
        <c-table :table-data="executableJobs" :fields="fields"></c-table>
      </b-tab>
    </b-tabs>
  </div>
</template>



<script>
import cTable from './Table.vue'

export default {
  name: 'SchJobs',
  components: {cTable},

  data () {
    return {
      jobs: [],
      executableJobs: [],

      fields: [
        {key: 'order_id',           label: '製令單',    sortable: true},
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
    this.getExecutableJobs();
  },

  methods: {
    getJobs() {
      var sql = "SELECT * FROM SuperCheng.job_status ORDER BY due_date, product_id, step";
      let param = {sql: sql};
      this.$http.get('/api/generalQuery', {params: param}).then(res => {
        this.jobs = res.data;
        
        /*for(var i=0; i<this.jobs.length; i++)
        {
          this.jobs[i]['due_date'] = flatpickr.formatDate(new Date(this.jobs[i]['due_date']), "Y-m-d");
        }*/
      });
    },

    getExecutableJobs()
    {
      var sql = "(SELECT * FROM SuperCheng.job_status WHERE state!='已出站' AND step=1) UNION \
                 (SELECT * FROM SuperCheng.job_status WHERE state!='已出站' AND (order_id, step) IN \
                 (SELECT order_id, next_step FROM SuperCheng.job_status WHERE state='已出站')) \
                    ORDER BY due_date, product_id, step";

      let param = {sql: sql};
      this.$http.get('/api/generalQuery', {params: param}).then(res => {
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
