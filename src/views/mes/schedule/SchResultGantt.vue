<template>
  <div id="app">
    <GSTC :config="config" @state="onState" :key="myKey"/>
    <!--<GSTC :config="config" />-->
  </div>
</template>

<script>
import GSTC from "vue-gantt-schedule-timeline-calendar";
import * as moment from 'moment'; //Mingzoo 2020/3/31
let subs = [];

export default {
  name: "SchResultGantt",
  components: {
    GSTC
  },
  data() {
    return {
      config: {
        height: 1000,
        list: {
          rows: {
            /*
            "0": {
              id: "0",
              label: ""
            },
            "1": {
              id: "1",
              label: "機01"
            },
            "2": {
              id: "2",
              label: "機041(AK04)"
            },
            "3": {
              id: "3",
              label: "機126(AK02)"
            },
            "4": {
              id: "4",
              label: "機134(AK05)"
            }*/
          },
          columns: {
            data: {
              /*id: {
                id: "id",
                data: "id",
                width: 50,
                header: {
                  content: "ID"
                }
              },*/
              label: {
                id: "label",
                data: "label",
                width: 200,
                header: {
                  content: "機台"
                }
              }
            }
          }
        },
        chart: {
          items: {
            /*"0": {
              id: "0",
              rowId: "0",
              label: "",
              time: {
                start: new Date('2020-03-03 12:00:00').getTime(),
                end: new Date('2020-03-03 12:00:00').getTime()
              }
            },
            "1": {
              id: "1",
              rowId: "1",
              label: "",
              time: {
                start: new Date("2020-03-23 08:00:00").getTime(),
                end: new Date("2020-03-26 13:42:00").getTime()
              }
            },
            "2": {
              id: "2",
              rowId: "2",
              //label: "製令、品號、工序...",
              time: {
                start: new Date("2020-03-23 08:00:00").getTime(),
                end: new Date("2020-03-25 13:46:00").getTime()
              }
            },
            "3": {
              id: "3",
              rowId: "3",
              label: "",
              time: {
                start: new Date("2020-03-23 08:00:00").getTime(),
                end: new Date("2020-03-27 13:34:00").getTime()
              }
            },
            "4": {
              id: "4",
              rowId: "4",
              label: "",
              time: {
                start: new Date("2020-03-23 08:00:00").getTime(),
                end: new Date("2020-03-26 13:53:00").getTime()
              }
            },
            "5": {
              id: "5",
              rowId: "4",
              label: "Item 5",
              time: {
                start: new Date().getTime() + 12 * 24 * 60 * 60 * 1000,
                end: new Date().getTime() + 14 * 24 * 60 * 60 * 1000
              }
            }*/
          }
        }
      },

      myKey: 0,
      rowId: []
    };
  },

  //mounted() {
  created() {
    //this.config.chart.items["1"].label = 'tessfdsafsdt';
    //console.log(this.config.chart.items["1"].label);
    //console.log(this.config.chart.items["1"].time.start);
    //this.config.chart.items["1"].time.start = new Date("2020-04-06 15:32:00").getTime();
    //console.log(this.config.chart.items["1"].time.start);
    //this.config.chart.items["1"].time.end = new Date("2020-04-06 16:32:00").getTime();
    //this.config.list.rows[0] = {id: 0, label: "機00"};
    //this.config.list.rows[1] = {id: 1, label: "機001-20(AK18)"};
    /*setTimeout(() => {
      const item1 = this.config.chart.items["1"];
      item1.label = "label changed dynamically";
      item1.time.end = new Date("2020-04-06 16:32:00").getTime();//+= 2 * 24 * 60 * 60 * 1000;
    }, 2000);*/
    this.getMachines();
    this.getJobs();
  },
  
  beforeDestroy() {
    subs.forEach(unsub => unsub());
  },
  
  methods: {
    getMachines() {
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

    getJobs() {
      var sql = "SELECT * FROM fortop.job_assignment_new WHERE job_type='自動' AND exe_time>0 ORDER BY machine, start_time";
      let param = {sql: sql};
      this.$http.get('/api/generalQuery', {params: param}).then(res => {
        for(var i=0; i<res.data.length; i++)
        {
          var machine = res.data[i]['machine'];
          var _start = moment(res.data[i]['start_time']).format('YYYY-MM-DD HH:mm:ss');
          console.log(_start);
          var _end = moment(res.data[i]['end_time']).format('YYYY-MM-DD HH:mm:ss');
          console.log(_end);
          if(_start != _end)
          this.config.chart.items[i] = {id: i,
                                        rowId: this.rowId[machine],
                                        label: "",
                                        time: {
                                          start: new Date(_start).getTime(),
                                          end: new Date(_end).getTime()}};
        }
        this.myKey ++;
      });
    },

    onState(state) {
      this.state = state;
      subs.push(
        state.subscribe("config.chart.items.1", item => {
          console.log("item 1 changed", item);
        })
      );
      subs.push(
        state.subscribe("config.list.rows.1", row => {
          console.log("row 1 changed", row);
        })
      );
    }
  },
};
</script>
