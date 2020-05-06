<template>
  <div class="animated fadeIn">
    <CTableWrapper :items="jobs" :fields="fields"></CTableWrapper>
  </div>
</template>

<script>
import CTableWrapper from './Table2.vue';
import * as moment from 'moment';

export default {
  name: 'SchProgress',
  components: { CTableWrapper },

  data () {
    return {
      timestamp: '',
      jobs: [],
      fields: [
        {key: 'job_id',             label: '工單',      sortable: true},
        {key: 'job_description',    label: '作業',      sortable: true},
        {key: 'machine_id',         label: '工位',      sortable: true},
        {key: 'target_qty',         label: '數量',      sortable: true},
        {key: 'progress',           label: '%',         sortable: true},
        {key: 'state',              label: '狀態',      sortable: true},
        {key: 'sch_time',           label: '計畫時間',  sortable: true},
        {key: 'act_time',           label: '實際時間',  sortable: true},
      ],
    }
  },

  //mounted
  created() {
    this.getStatus();
    setInterval(this.getStatus, 1000);
  },

  methods: {
    getStatus() {
      var sql = "SELECT MAX(timestamp) FROM mes.job_status";
      let param = {sql: sql};
      this.$http.post('generalQuery', {data: param}).then(res => {
        var newTimestamp = res.data[0]['MAX(timestamp)'];
        if(newTimestamp != this.timestamp){
          sql = "SELECT *, FLOOR(100*acc_good/target_qty) AS progress FROM mes.job_status "
                + "WHERE LENGTH(machine_id)>0 ORDER BY sch_start_time";
          param = {sql: sql};
          this.$http.post('generalQuery', {data: param}).then(res => {
            this.jobs = res.data;
            for(var i=0; i<this.jobs.length; i++){
              /*
              var test = JSON.parse(this.jobs[i]['test']);
              console.log(test[0].process_id);
              console.log(test[0].process_name);
              this.jobs[i]['job_description'] = test[0].process_name;
              */
              
              //計畫時間
              this.jobs[i]['sch_time'] = moment(this.jobs[i]['sch_start_time']).format('MM/DD HH:mm') + " - "
                                        + moment(this.jobs[i]['sch_end_time']).format('MM/DD HH:mm');
              //實際時間
              var act_start_time = '';  //'00/00 00:00';
              var act_end_time = '';    //'00/00 00:00';
              //if(this.jobs[i]['act_start_time'] != null && this.jobs[i]['act_start_time'].length > 0)
              if(this.jobs[i]['act_start_time'] != null)
                act_start_time = moment(this.jobs[i]['act_start_time']).format('MM/DD HH:mm');
              
              //if(this.jobs[i]['act_end_time'] != null && this.jobs[i]['act_end_time'].length > 0)
              if(this.jobs[i]['act_end_time'] != null)
                act_end_time = moment(this.jobs[i]['act_end_time']).format('MM/DD HH:mm');
              
              this.jobs[i]['act_time'] = act_start_time + " - " + act_end_time;
            }
            this.timestamp = newTimestamp;
          });
        }
      });
    },//end of getStatus()
  }
}
</script>
