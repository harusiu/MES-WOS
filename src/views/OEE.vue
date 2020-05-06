<template>
  <div>
    <b-card >
      <div slot="header">
        <strong>{{id}}</strong>
      </div>
      <b-row>
        <b-col>
          <li>今日總工單數量: {{nof_jobs}}</li>
          <li>今日目標數量: {{target_qty}} pcs</li>
          <li>今日達成率: {{progress_overall.toFixed(2)}}%</li>
          <!--
          <li>效率: ---</li>
          <li>OEE: ---</li>
          -->
          <li>不良率: {{ng_ratio.toFixed(2)}}%</li>
        </b-col>
        <b-col align="center" :key="componentKey">
          今日工單百分比 {{progress_overall.toFixed(2)}}%
          <apexchart type=radialBar :options="chartOptions"
            :series="[this.progress_overall, this.progress_current_job]"/>
        </b-col>
      </b-row>
    </b-card>
  </div>
</template>

<script>
//npm install --save apexcharts
//npm install --save vue-apexcharts
import VueApexCharts from "vue-apexcharts";

export default {
  name: 'OEE',

  components: {apexchart: VueApexCharts},

  props: {
    job_type: {
      type: String,
      default: 'Unknown'
    },
    machine_id: {
      type: String,
      default: 'Unknown'
    },
    line_id: {
      type: String,
      default: 'Unknown'
    },
    simulation: {
      type: Number,
      default: 0
    }
  },

  data () {
    return {
      timestamp: '2000-01-01 00:00:00',
      componentKey: 0,

      id: '',
      job: [],
      nof_jobs: 0,
      target_qty: 0,
      nof_done: 0,

      acc_good: 0,
      acc_ng: 0,
      ng_ratio: 0,

      progress_overall: 0,
      progress_current_job: 0,

      chartOptions: {
        plotOptions: {
          radialBar: {
            dataLabels: {
              name: {
                //fontSize: '22px',
                //fontSize: '22px',
              },
              value: {
                //fontSize: '16px',
                //fontSize: '22px',
              },
              total: {
                show: true,
                label: '目前工單百分比',
                formatter: function (w) {
                  // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
                  //return series[0];
                  return w.globals.series[1].toFixed(2) + '%';
                }
              },
            }
          }
        },
        labels: ['今日工單百分比', '目前工單百分比'],
      },
    }
  },

  created() {
    //console.log(this.simulation);

    if (this.job_type == '自動' || this.job_type == '半自動')
      this.id = this.machine_id;
    else if (this.job_type == '半自動前加工' || this.job_type == '組立')
      this.id = this.line_id;

    this.getData();

    setInterval(this.getData, 3000);
  },

  methods: {
    getData()
    {
      //if (this.simulation || this.simulation=='true')
      if (this.simulation)
      {
        if (Math.random() > 0.3 && this.nof_jobs > 0)
          return;
        
        if (this.nof_jobs == null || this.nof_jobs == 0)
        {
          this.nof_jobs = Math.floor(100 * Math.random());
          if (this.nof_jobs == 0)
            this.nof_jobs = 10;
        }
        
        if (this.target_qty == 0)
          this.target_qty = Math.floor(this.nof_jobs * (100 * Math.random()));
          
        this.nof_done = Math.floor(this.nof_jobs * Math.random());
        this.progress_overall = 100 * this.nof_done / this.nof_jobs;
        
        this.ng_ratio = 10 * Math.random();
        this.progress_current_job = 100 * Math.random();
        
        this.componentKey = (this.componentKey + 1)%100;
      }
      else
      {
        //console.log(this.timestamp);
        var sql;
        if (this.job_type=='自動' || this.job_type=='半自動')
          sql = "SELECT * FROM fortop.job_status WHERE job_type='" + this.job_type
                    + "' AND machine='" + this.machine_id
                    + "' AND timestamp > '" + this.timestamp + "'";
        else if (this.job_type=='半自動前加工')
          sql = "SELECT * FROM fortop.job_status WHERE job_type='半自動前加工' AND worker='" + this.line_id
                    + "' AND timestamp > '" + this.timestamp + "'";
        else if (this.job_type=='組立')
          sql = "SELECT * FROM fortop.job_status WHERE job_type='組立' AND worker='" + this.line_id
                    + "' AND timestamp > '" + this.timestamp + "'";

        let param = {sql: sql};
        this.$http.get('/api/generalQuery', {params: param}).then(res => {
          if (res.data == null || res.data.length == 0)
          {
          }
          else if (this.job.length==0)
          {
            this.job = res.data;
          }
          else
          {
            var newRecord = [];
            newRecord = res.data;
            var i, j;
            for (i=0; i<newRecord.length; i++)
            {
              for (j=0; j<this.job.length; j++)
              {
                if (this.job_type != '組立' &&
                    newRecord[i]['order_id'] == this.job[j]['order_id'] &&
                    newRecord[i]['step'] == this.job[j]['step'] &&
                    newRecord[i]['spec'] == this.job[j]['spec'])
                {
                  this.job[j] = newRecord[i];
                  break;
                }

              }
              if (j == this.job.length)
                this.job.push(newRecord[i]);
              if (newRecord[i]['timestamp'] > this.timestamp)
                this.timestamp = newRecord[i]['timestamp'];
            }
          }

          this.nof_jobs = this.job.length;
          this.nof_done = 0;
          this.target_qty = 0;
          this.acc_good = 0;
          this.acc_ng = 0;
          this.progress_current_job = 0;
          this.progress_overall = 0;
          var i;
          for (i=0; i<this.nof_jobs; i++)
          {
            this.target_qty = this.target_qty + this.job[i]['target_qty'];
            this.acc_good = this.acc_good + this.job[i]['acc_good'];
            this.acc_ng = this.acc_ng + this.job[i]['acc_ng'];
            if (this.job[i]['state'] == '已出站')
              this.nof_done = this.nof_done + 1;

            if(this.job[i]['state'] == '生產中' || this.job[i]['state'] == '中斷')
              this.progress_current = 100 * this.job[i]['acc_good'] / this.job[i]['target_qty'];
          }

          if (this.nof_jobs > 0)
            this.progress_overall = 100 * this.nof_done / this.nof_jobs;

          if ((this.acc_good + this.acc_ng) > 0)
            this.ng_ratio = 100 * this.acc_ng / (this.acc_good + this.acc_ng);
        });
      }
    },
  }
}
</script>
