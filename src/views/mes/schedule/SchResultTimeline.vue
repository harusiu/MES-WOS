<template>
  <GChart
    :settings="{ packages: ['timeline'] }"
    type="Timeline"
    :data="dataTable"
    :options="chartOptions"
    style="height: 1000px;"
  />
</template>

<script>
import { GChart } from 'vue-google-charts'
import * as moment from 'moment'

export default {
  name: "SchResultTimeline",
  components: { GChart },

  data() {
    return {
      chartOptions: {
        chart: {
          title: "Job Assignment",
          subtitle: "Timeline Chart"
        }
      },

      dataTable: []
    };
  },

  //mounted() {
  created() {
    //this.getMachines();
    this.dataTable.push(['ID', 'Bar Label', new Date(), new Date()]);
    this.getJobs();
  },

  methods: {
    /*getMachines() {
      var sql = "SELECT DISTINCT machine FROM fortop.job_assignment_new WHERE job_type='自動' AND exe_time>0 ORDER BY machine";
      let param = {sql: sql};
      this.$http.get('/api/generalQuery', {params: param}).then(res => {
        for(var i=0; i<res.data.length; i++)
        {
          //console.log(res.data[i]['machine']);
          this.config.list.rows[i]= {id: i, label: res.data[i]['machine']}
          this.rowId[res.data[i]['machine']] = i;
        }
        //console.log(this.rowId['機454(AK19雙)']);
      });
    },
    */

    getJobs() {
      var sql = "SELECT * FROM fortop.job_assignment_new WHERE job_type='自動' "
                + "AND exe_time>0 AND (end_time LIKE '%2020-04-17%' OR end_time LIKE '%2020-04-17%') "
                //+ "AND exe_time>0 "
                + "ORDER BY machine, start_time";
      let param = {sql: sql};
      this.$http.get('/api/generalQuery', {params: param}).then(res => {
        for(var i=0; i<res.data.length; i++)
        {
          /*var machine = res.data[i]['machine'];
          var barLabel = res.data[i]['process_name'].trim();
          var tooltip = res.data[i]['order_id'];
          var startTime = res.data[i]['start_time'];
          var endTime = res.data[i]['end_time'];
          this.dataTable.push([machine, barLabel, new Date(startTime), new Date(endTime)]);
          */
          this.addRow(res.data[i]);
        }
        //this.dataTable.push(["機220(AK08)", "Off", new Date('2020-04-16 17:00:00'), new Date('2020-04-17 08:00:00')]);
      });
    },

    addRow(data) {
      var newData = data;
      var machine = data['machine'];
      var barLabel = data['process_name'].trim() + " " + data['target_qty'].toString() + " PCS";
      barLabel = data['process_name'].trim();
      //var barLabel = moment(data['start_time']).format('HH:mm')+"~"+moment(data['end_time']).format('HH:mm')+" ("+data['exe_time'].toString()+"s)";
      //var tooltip = data['order_id'];

      var start_time = data['start_time'];
      var t1 = moment(start_time);
      var duration = data['exe_time'];
      var t2 = moment(start_time).add(duration, 'seconds');
      var d1 = moment(start_time).format('YYYY-MM-DD');
      var d2 = moment(start_time).add(1, 'days').format('YYYY-MM-DD');
      //var t0800 = moment(d1 + " 08:00:00");
      var t1000 = moment(d1 + " 10:00:00");
      var t1200 = moment(d1 + " 12:00:00");
      var t1500 = moment(d1 + " 15:00:00");
      var t1700 = moment(d1 + " 17:00:00");
      //console.log("t1: " + t1.format('YYYY-MM-DD HH:mm:ss'));
      //console.log(duration);
      //console.log(t2.format('YYYY-MM-DD HH:mm:ss'));
      if(t1 < t1000)
      {
        if(t2 < t1000)
        {
          this.dataTable.push([machine, barLabel, new Date(t1.format('YYYY-MM-DD HH:mm:ss')), new Date(t2.format('YYYY-MM-DD HH:mm:ss'))]);
        }
        else
        {
          this.dataTable.push([machine, barLabel, new Date(t1.format('YYYY-MM-DD HH:mm:ss')), new Date(t1000.format('YYYY-MM-DD HH:mm:ss'))]);
          newData['start_time'] = d1 + ' 10:05:00';
          newData['exe_time'] = duration - (t1000 - t1)/1000;
          this.addRow(newData);
        }
      }
      else if(t1 < t1200)
      {
        if(t2 < t1200)
        {
          this.dataTable.push([machine, barLabel, new Date(t1.format('YYYY-MM-DD HH:mm:ss')), new Date(t2.format('YYYY-MM-DD HH:mm:ss'))]);
        }
        else
        {
          this.dataTable.push([machine, barLabel, new Date(t1.format('YYYY-MM-DD HH:mm:ss')), new Date(t1200.format('YYYY-MM-DD HH:mm:ss'))]);
          newData['start_time'] = d1 + ' 13:00:00';
          newData['exe_time'] = duration - (t1200 - t1)/1000;
          this.addRow(newData);
        }
      }
      else if(t1 < t1500)
      {
        if(t2 < t1500)
        {
          this.dataTable.push([machine, barLabel, new Date(t1.format('YYYY-MM-DD HH:mm:ss')), new Date(t2.format('YYYY-MM-DD HH:mm:ss'))]);
        }
        else
        {
          this.dataTable.push([machine, barLabel, new Date(t1.format('YYYY-MM-DD HH:mm:ss')), new Date(t1500.format('YYYY-MM-DD HH:mm:ss'))]);
          newData['start_time'] = d1 + ' 15:05:00';
          newData['exe_time'] = duration - (t1500 - t1)/1000;
          this.addRow(newData);
        }
      }
      else if(t1 < t1700)
      {
        if(t2 < t1700)
        {
          this.dataTable.push([machine, barLabel, new Date(t1.format('YYYY-MM-DD HH:mm:ss')), new Date(t2.format('YYYY-MM-DD HH:mm:ss'))]);
        }
        else
        {
          this.dataTable.push([machine, barLabel, new Date(t1.format('YYYY-MM-DD HH:mm:ss')), new Date(t1700.format('YYYY-MM-DD HH:mm:ss'))]);
          newData['start_time'] = d2 + ' 08:00:00';
          newData['exe_time'] = duration - (t1700 - t1)/1000;
          this.addRow(newData);
        }
      }
    },

  },
};
</script>
