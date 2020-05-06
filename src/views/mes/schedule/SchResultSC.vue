<template>
  <div class="animated fadeIn">
    <CTableWrapper :items="jobs" :fields="fields"></CTableWrapper>
  </div>
</template>

<script>
import CTableWrapper from './Table2.vue'

export default {
  name: 'SchResult',
  components: { CTableWrapper },

  data () {
    return {

      jobs: [],

      fields: [
        {key: 'job_id',             label: '工單',    sortable: true},
        {key: 'job_description',    label: '作業',    sortable: true},
        {key: 'target_qty',         label: '數量',    sortable: true},
        {key: 'machine_id',         label: '機台',    sortable: true},
        {key: 'sch_start_time',     label: '起始',    sortable: true},
        {key: 'sch_end_time',       label: '結束',    sortable: true},
        {key: 'state',              label: '狀態',    sortable: true},
      ],
    }
  },

  //mounted
  created() {
    this.getSchResult();
  },

  methods: {
    appendLeadingZeroes(n){
      if(n <= 9){
        return "0" + n;
      }
      return n
    },

    getSchResult() {
      var sql = "SELECT * FROM mes.job_status WHERE LENGTH(machine_id)>0 ORDER BY sch_start_time";
      let param = {sql: sql};
      this.$http.post('generalQuery', {data: param}).then(res => {
        this.jobs = res.data;
        for(var i=0; i<this.jobs.length; i++)
        {
          var current_datetime = new Date(this.jobs[i]['sch_start_time']);
          this.jobs[i]['sch_start_time'] = //current_datetime.getFullYear() + "-" +
              this.appendLeadingZeroes(current_datetime.getMonth() + 1) + "/" + 
              this.appendLeadingZeroes(current_datetime.getDate()) + " " + 
              this.appendLeadingZeroes(current_datetime.getHours()) + ":" + 
              this.appendLeadingZeroes(current_datetime.getMinutes()) + ":" + 
              this.appendLeadingZeroes(current_datetime.getSeconds());

          current_datetime = new Date(this.jobs[i]['sch_end_time']);
              this.jobs[i]['sch_end_time'] = //current_datetime.getFullYear() + "-" +
              this.appendLeadingZeroes(current_datetime.getMonth() + 1) + "/" + 
              this.appendLeadingZeroes(current_datetime.getDate()) + " " + 
              this.appendLeadingZeroes(current_datetime.getHours()) + ":" + 
              this.appendLeadingZeroes(current_datetime.getMinutes()) + ":" + 
              this.appendLeadingZeroes(current_datetime.getSeconds());
        }
      });
    },
  }
}
</script>
