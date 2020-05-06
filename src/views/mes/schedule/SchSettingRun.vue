<template>
  <div class="animated fadeIn">
  <h5>
    <b-row>
      <b-col cols="12">
        <b-card>
          <b-form-group label="D+1" label-cols="1">
            <b-form-input type="date" v-model="day1"
                @change="getNofWorkers(team); getWorkhoursUnscheduled(team); getSupportingInfo(team); getNofWorkers2('CA1/穿P'); getNofWorkers2('CA1/焊煬'); getNofWorkers2('CA1/半自動');"></b-form-input>
          </b-form-group>

          <b-row>
            <b-col cols="6">
              <b-form-group label="製程作業" label-cols="2">
              <b-form-select
                :options="['CA1自動機台', 'CA1半自動前加工', 'CA1半自動', '組立']"
                v-model="job_type" @change="updateOpt()">
              </b-form-select>
              </b-form-group>
            </b-col>

            <b-col cols="6">
              <b-form-group label="組別" label-cols="2">
              <b-form-select
                :options="options"
                v-model="team" @change="getNofWorkers(team); getWorkhoursUnscheduled(team); getSupportingInfo(team);">
              </b-form-select>
              </b-form-group>
            </b-col>
          </b-row>



          <b-row>
            <b-col cols="4">
              D+1 預計出勤人數: {{nof_workers}}
            </b-col>
            <b-col cols="4">
              工時: {{work_hours.toFixed(2)}} - {{leave_hours.toFixed(2)}} (請假)
            </b-col>
            <b-col cols="4">
              加班時數: {{ot_hours.toFixed(2)}}
            </b-col>
          </b-row>
          <br>
          <b-row>
            <b-col cols="4">
              D+1 支援人數: {{nof_supporters}}
            </b-col>
            <b-col cols="4">
              工時: {{sup_work_hours.toFixed(2)}}
            </b-col>
            <b-col cols="4">
              加班時數: 0
            </b-col>
          </b-row>
          <br>
          <b-row>
            <b-col cols="4">
              D+1 預計出勤總工時: {{(work_hours-leave_hours+ot_hours+sup_work_hours).toFixed(2)}}
            </b-col>
          </b-row>
          <br>
          <b-row>
            <b-col cols="4">
              D+2 無法排程工單總時數: {{workhoursUscheduled.toFixed(2)}}
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>



    <b-row>
      <b-col md="12">
        <b-card>
          <!--<b-button type="submit" size="sm" variant="primary" @click="saveSchSetting">儲存設定</b-button>&nbsp;-->
          <b-button type="submit" variant="primary" @click="run">執行</b-button>
        </b-card>
      </b-col>
    </b-row>
  </h5>
  </div>
</template>



<script>
export default {
  name: 'SchSettingRun',
  data () {
    return {
      day1: flatpickr.formatDate(new Date(), "Y-m-d"),

      job_type: 'CA1自動機台',
      team: 'CA1/自動',
      options: ['CA1/自動', 'CA1/裁線'],

      autoOptions:     ['CA1/自動', 'CA1/裁線'],
      preSemiOptions:  ['CA1/穿P', 'CA1/焊煬'],
      semiAutoOptions: ['CA1/半自動'],
      assemblyOptions: ['CA2', 'CA2-1', 'CA2-2', 'CA2-3', 'CA2-4',
                        'CA3', 'CA3-1', 'CA3-2', 'CA3-3', 'CA3-4', 'CA3-5', 'CA3-6', 'CA3-7', 'CA3-8', 'CA3-9', 'CA3-10',
                        'CA5',
                        'CA6', 'CA6-1', 'CA6-2', 'CA6-3',
                        'CA7', 'CA7-1', 'CA7-2', 'CA7-3', 'CA7-4',
                        'CA8', 'CA8-1', 'CA8-2',
                        'CA9',
                        'CA10', 'CA10-1', 'CA10-2', 'CA10-3',
                        'CA11', 'CA11-1', 'CA11-2'],

      nof_workers: 0,
      work_hours: 0,
      leave_hours: 0,   //請假
      ot_hours: 0,      //加班

      nof_supporters: 0,
      sup_work_hours: 0,
      sup_ot_hours: 0,

      nof_preSamWorkers1: 0,    //CA1/穿P
      nof_preSamWorkers2: 0,    //CA1/焊煬
      nof_samWorkers: 0,        //CA1/半自動
    
      workhoursUscheduled: 0,
    }
  },

  //mounted() {
  created() {
    //this.getSchSetting();

    //半自動前加工
    this.getNofWorkers2('CA1/穿P');
    this.getNofWorkers2('CA1/焊煬');
    //半自動
    this.getNofWorkers2('CA1/半自動');


    this.getNofWorkers(this.team);
    this.getWorkhoursUnscheduled(this.team);
    this.getSupportingInfo(this.team);
  },

  methods: {
    updateOpt() {
      if(this.job_type=='CA1自動機台')
      {
        this.options = this.autoOptions;
        this.team = 'CA1/自動';
      }
      else if(this.job_type=='CA1半自動前加工')
      {
        this.options = this.preSemiOptions;
        this.team = 'CA1/穿P';
      }
      else if(this.job_type=='CA1半自動')
      {
        this.options = this.semiAutoOptions;
        this.team = 'CA1/半自動';
      }
      else if(this.job_type=='組立')
      {
        this.options = this.assemblyOptions;
        this.team = 'CA2';
      }

      this.getNofWorkers(this.team);
      this.getWorkhoursUnscheduled(this.team);
    },



    getNofWorkers(team) {
      var sql = "SELECT COUNT(*) FROM human_resource.employees \
                    WHERE (last_day IS NULL OR last_day>=CURRENT_DATE) \
                    AND (titles_id=6 OR titles_id=12) AND factorys_id=1 \
                    AND groups_id IN (SELECT id FROM human_resource.ft_groups WHERE (sections_id=1 OR sections_id=2) AND name='" + team + "') \
                    AND id NOT IN (SELECT employees_id FROM human_resource.leaves WHERE start_datetime LIKE '" + this.day1 + "%' AND hours>=8);";

      sql = sql + "SELECT SUM(hours) FROM human_resource.leaves WHERE start_datetime LIKE '" + this.day1 + "%' AND hours<8 AND \
                    employees_id IN (SELECT id FROM human_resource.employees \
                    WHERE (last_day IS NULL OR last_day>=CURRENT_DATE) \
                    AND (titles_id=6 OR titles_id=12) AND factorys_id=1 \
                    AND groups_id IN (SELECT id FROM human_resource.ft_groups WHERE (sections_id=1 OR sections_id=2) AND  name='" + team + "'));";

      sql = sql + "SELECT SUM(hours) FROM human_resource.overtime WHERE start_datetime LIKE '" + this.day1 + "%' AND hours<8 AND \
                    employees_id IN (SELECT id FROM human_resource.employees \
                    WHERE (last_day IS NULL OR last_day>=CURRENT_DATE) \
                    AND (titles_id=6 OR titles_id=12) AND factorys_id=1 \
                    AND groups_id IN (SELECT id FROM human_resource.ft_groups WHERE (sections_id=1 OR sections_id=2) AND  name='" + team + "'));";

      let param = {sql: sql};
      this.$http.get('/api/generalQuery', {params: param}).then(res => {
        this.nof_workers = res.data[0][0]['COUNT(*)'];

        this.work_hours = (47/6)*res.data[0][0]['COUNT(*)'];
        
        if(res.data[1][0]['SUM(hours)']!=null)
          this.leave_hours = res.data[1][0]['SUM(hours)'];
        else
          this.leave_hours = 0;

        if(res.data[2][0]['SUM(hours)']!=null)
          this.ot_hours = res.data[2][0]['SUM(hours)'];
        else
          this.ot_hours = 0;

      });
    },



    //Only for   CA1/穿P    CA1/焊煬  CA1/半自動
    getNofWorkers2(team) {
      var sql = "SELECT COUNT(*) FROM human_resource.employees \
                    WHERE (last_day IS NULL OR last_day>=CURRENT_DATE) \
                    AND (titles_id=6 OR titles_id=12) AND factorys_id=1 \
                    AND groups_id IN (SELECT id FROM human_resource.ft_groups WHERE (sections_id=1 OR sections_id=2) AND name='" + team + "') \
                    AND id NOT IN (SELECT employees_id FROM human_resource.leaves WHERE start_datetime LIKE '" + this.day1 + "%' AND hours>=8);";

      let param = {sql: sql};
      
      this.$http.get('/api/generalQuery', {params: param}).then(res => {
        if(team=='CA1/穿P')
          this.nof_preSamWorkers1 = res.data[0]['COUNT(*)'];
        else if(team=='CA1/焊煬')
          this.nof_preSamWorkers2 = res.data[0]['COUNT(*)'];
        else if(team=='CA1/半自動')
          this.nof_samWorkers = res.data[0]['COUNT(*)'];
      });
    },



    getWorkhoursUnscheduled(team) {
      var sql;

      if (team=='CA1/自動') {
        sql = "SELECT SUM(exe_time)/60 AS result FROM job_assignment \
                WHERE job_type='自動' AND machine='-1' AND process_id!='0011'";
      }
      else if(team=='CA1/裁線') {
        sql = "SELECT SUM(exe_time)/60 AS result FROM job_assignment \
                WHERE job_type='自動' AND machine='-1' AND process_id='0011'";
      }
      else if(team=='CA1/穿P') {
        sql = "SELECT SUM(exe_time)/60 AS result FROM job_assignment \
                WHERE job_type='半自動前加工' AND worker='-1' AND process_name LIKE '%穿P%'";
      }
      else if (team=='CA1/焊煬') {
        sql = "SELECT SUM(exe_time)/60 AS result FROM job_assignment \
                WHERE job_type='半自動前加工' AND worker='-1' AND (process_name LIKE '%錫%' OR process_name LIKE '%煬%')";
      }
      else if (team=='CA1/半自動') {
        sql = "SELECT SUM(exe_time)/60 AS result FROM job_assignment \
                WHERE job_type='半自動' AND machine='-1'";
      }
      else
      {
        var line_id;
        if (team.substr(0, 4)=='CA10')
        {
          line_id = "100";
          if(team.length>4)
            line_id = line_id + team.substr(4, 2);
        }
        else if (team.substr(0, 4)=='CA11')
        {
          line_id = "111";
          if(team.length>4)
            line_id = line_id + team.substr(4, 2);
        }
        else
        {
          line_id = team.replace(/CA/g, "");
          line_id = line_id.replace(/-/g, "");
          if(line_id.length==1)
            line_id = "0" + line_id + "0";
          else
            line_id = "0" + line_id;
        }

        console.log(team + " " + line_id);
        sql = "SELECT SUM(exe_time)/60 AS result FROM job_assignment \
                WHERE job_type='組立' AND worker='-1' AND line_id LIKE '[\"" + line_id + "\"]'";
      }



      let param = {sql: sql};
      this.$http.get('/api/generalQuery', {params: param}).then(res => {
        if (res.data[0]['result']==null)
          this.workhoursUscheduled = 0;
        else
          this.workhoursUscheduled = res.data[0]['result'];
      });
    },



    getSupportingInfo(team) {
      var sql = "SELECT COUNT(*) AS result FROM human_resource.supports WHERE start_datetime LIKE '" + this.day1 + "%' AND \
                    deleted IS NULL AND groups_id IN (SELECT id FROM human_resource.ft_groups WHERE name='" + team + "')";
	  console.log(sql);
      let param = {sql: sql};
      this.$http.get('/api/statistic/generalQuery', {params: param}).then(res => {
        if (res.data[0]['result']==null)
          this.nof_supporters = 0;
        else
          this.nof_supporters = res.data[0]['result'];
      });

      sql = "SELECT SUM(hours) AS result FROM human_resource.supports WHERE start_datetime LIKE '" + this.day1 + "%' AND \
                    deleted IS NULL AND groups_id IN (SELECT id FROM human_resource.ft_groups WHERE name='" + team + "')";
      param = {sql: sql};
      this.$http.get('/api/generalQuery', {params: param}).then(res => {
        if (res.data[0]['result']==null)
          this.sup_work_hours = 0;
        else
          this.sup_work_hours = res.data[0]['result'];
      });
    },
    
    
    
    getSchSetting () {
      this.$http.get('/api/schedule/getSchSetting')
      .then(res => {
        //var newDate = new Date(res.data[0].day1);
        //this.day1 = flatpickr.formatDate(newDate, "Y-m-d");
        //this.nof_preSamWorkers = res.data[0].nof_preSamWorkers;
        //this.nof_samWorkers = res.data[0].nof_samWorkers;
      });
    },



    saveSchSetting () {
      /*console.log(this.day1);
      console.log(this.nof_preSamWorkers1);
      console.log(this.nof_preSamWorkers2);
      console.log(this.nof_samWorkers);
      */
      let data = {day1: this.day1,
                  nof_preSamWorkers: this.nof_preSamWorkers1 + this.nof_preSamWorkers2,
                  nof_samWorkers: this.nof_samWorkers};
      this.$http.post('/api/schedule/saveSchSetting', {data: data});
    },



    run () {
      this.saveSchSetting();
      //window.location.href = ('http://192.168.1.18:8080/web/datagen/ScheduleGen.php');
    }
  }
}
</script>
