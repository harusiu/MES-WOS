<template>
  <div class="animated fadeIn">
{{doFormat}}
    <b-row>
      <!--<b-col xs="12" lg="12">-->
      <b-col lg="12">
        <b-card>

          <b-tabs>
            <b-tab :title="'製令單資訊 (' + orders.length + ')'">
              <b-form-input v-model="filter" placeholder="輸入關鍵字搜尋"></b-form-input>
              <br>
              <c-table :table-data="orders" :fields="order_fields" :filter="filter"></c-table>
            </b-tab>

            <b-tab :title="'CA1 自動 生產進度看板 (' + auto_jobs.length + ')'">
              <b-form-input v-model="filter" placeholder="輸入關鍵字搜尋"></b-form-input>
              <br>
              <c-table :table-data="auto_jobs" :fields="auto_fields" :filter="filter"></c-table>
            </b-tab>

            <b-tab :title="'CA1 半自動前加工 生產進度看板 (' + presemi_jobs.length + ')'">
              <b-form-input v-model="filter" placeholder="輸入關鍵字搜尋"></b-form-input>
              <br>
              <c-table :table-data="presemi_jobs" :fields="presemi_fields" :filter="filter"></c-table>
            </b-tab>

            <b-tab :title="'CA1 半自動 生產進度看板 (' + semiauto_jobs.length + ')'">
              <b-form-input v-model="filter" placeholder="輸入關鍵字搜尋"></b-form-input>
              <br>
              <c-table :table-data="semiauto_jobs" :fields="semiauto_fields" :filter="filter"></c-table>
            </b-tab>
            
            <!--
            <b-tab :title="'組立生產進度看板 (' + assembly_jobs.length + ')'">
              <b-form-input v-model="filter" placeholder="輸入關鍵字搜尋"></b-form-input>
              <br>
              <c-table :table-data="assembly_jobs" :fields="assembly_fields" :filter="filter"></c-table>
            </b-tab>
            -->

            <b-tab :title="'新生成 CA1 工單 (' + new_jobs.length + ')'">
              <b-form-input v-model="filter" placeholder="輸入關鍵字搜尋"></b-form-input>
              <br>
              <c-table :table-data="new_jobs" :fields="new_fields" :filter="filter"></c-table>
            </b-tab>

            <b-tab :title="'新生成組立工單 (' + new_assembly_jobs.length + ')'">
              <b-form-input v-model="filter" placeholder="輸入關鍵字搜尋"></b-form-input>
              <br>
              <c-table :table-data="new_assembly_jobs" :fields="new_assembly_fields" :filter="filter"></c-table>
            </b-tab>
            
          </b-tabs>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>



<script>
import cTable from './Table.vue'
//import * as utils from '@/common/utils.js'
//import Vue from 'vue'

export default {
  name: 'SchProgress',
  components: {cTable},

  data () {
    return {
      filter: null,

      orders: [],
      auto_jobs: [],
      presemi_jobs: [],
      semiauto_jobs: [],
      assembly_jobs: [],
      new_jobs: [],
      new_assembly_jobs: [],

      order_fields: [
        {key: 'order_id',       label: '製令單別-單號',        sortable: true},
        {key: 'product_id',     label: '品號',                 sortable: true},
        {key: 'target_qty',     label: '數量',                 sortable: true},
        {key: 'open_date',      label: '開單日',               sortable: true},
        {key: 'due_date',       label: '交期',                 sortable: true,
            formatter: value => {return flatpickr.formatDate(new Date(value), "Ymd")}},
        {key: 'customer_info',  label: '客戶',                 sortable: true},
      ],
      auto_fields: [
        {key: 'order_id',       label: '製令單別-單號',        sortable: true},
        {key: 'product_id',     label: '品號',                 sortable: true},
        {key: 'step_spec',      label: '工序, 檢規',           sortable: true},
        {key: 'wire_info',      label: '線材, 線長, 線色',     sortable: true},
        {key: 'progress',       label: '已生產/目標',          sortable: true},
        {key: 'state',          label: '生產狀態',             sortable: true},
        {key: 'machine',        label: '機台',                 sortable: true},
        {key: 'end_time',       label: '預計完成時間',         sortable: true,
            formatter: value => {if(value!=null && value!='' && value!='X')return flatpickr.formatDate(new Date(value), "m/d H:i:S")}},
        {key: 'report_end_time',label: '實際完成時間',         sortable: true,
            formatter: value => {if(value!=null && value!='' && value!='X')return flatpickr.formatDate(new Date(value), "m/d H:i:S")}},
        {key: 'wrapup_state',   label: '撿線狀態',             sortable: true},
      ],
      presemi_fields: [
        {key: 'order_id',       label: '製令單別-單號',        sortable: true},
        {key: 'product_id',     label: '品號',                 sortable: true},
        {key: 'step_spec',      label: '工序, 檢規',           sortable: true},
        {key: 'wire_info',      label: '線材, 線長, 線色',     sortable: true},
        {key: 'progress',       label: '已生產/目標',          sortable: true},
        {key: 'state',          label: '生產狀態',             sortable: true},
        {key: 'worker',         label: '員工',                 sortable: true},
        {key: 'end_time',       label: '預計完成時間',         sortable: true,
            formatter: value => {if(value!=null && value!='' && value!='X')return flatpickr.formatDate(new Date(value), "m/d H:i:S")}},
        {key: 'report_end_time',label: '實際完成時間',         sortable: true,
            formatter: value => {if(value!=null && value!='' && value!='X')return flatpickr.formatDate(new Date(value), "m/d H:i:S")}},
        {key: 'wrapup_state',   label: '撿線狀態',             sortable: true},
      ],
      semiauto_fields: [
        {key: 'order_id',       label: '製令單別-單號',        sortable: true},
        {key: 'product_id',     label: '品號',                 sortable: true},
        {key: 'step_spec',      label: '工序, 檢規',           sortable: true},
        {key: 'wire_info',      label: '線材, 線長, 線色',     sortable: true},
        {key: 'progress',       label: '已生產/目標',          sortable: true},
        {key: 'state',          label: '生產狀態',             sortable: true},
        {key: 'worker',         label: '員工',                 sortable: true},
        {key: 'machine',        label: '機台',                 sortable: true},
        {key: 'end_time',       label: '預計完成時間',         sortable: true,
            formatter: value => {if(value!=null && value!='' && value!='X')return flatpickr.formatDate(new Date(value), "m/d H:i:S")}},
        {key: 'report_end_time',label: '實際完成時間',         sortable: true,
            formatter: value => {if(value!=null && value!='' && value!='X')return flatpickr.formatDate(new Date(value), "m/d H:i:S")}},
        {key: 'wrapup_state',   label: '撿線狀態',             sortable: true},
      ],
      assembly_fields: [
        {key: 'order_id',       label: '製令單別-單號',        sortable: true},
        {key: 'product_id',     label: '品號',                 sortable: true},
        //{key: 'target_qty',     label: '數量',               sortable: true},
        {key: 'progress',       label: '已生產/目標',          sortable: true},
        {key: 'line_id',        label: '線別',                 sortable: true},
        {key: 'end_time',       label: '預計完成時間',         sortable: true,
            formatter: value => {if(value!=null && value!='' && value!='X')return flatpickr.formatDate(new Date(value), "m/d H:i:S")}},
        {key: 'report_end_time',label: '實際完成時間',         sortable: true,
            formatter: value => {if(value!=null && value!='' && value!='X')return flatpickr.formatDate(new Date(value), "m/d H:i:S")}},
        {key: 'wrapup_state',   label: '撿線狀態',             sortable: true},
      ],
      new_fields: [
        {key: 'order_id',       label: '製令單別-單號',        sortable: true},
        {key: 'product_id',     label: '品號',                 sortable: true},
        {key: 'step_spec',      label: '工序, 檢規',           sortable: true},
        {key: 'job_type',       label: '類別',                 sortable: true},
        {key: 'process_name',   label: '製程',                 sortable: true},
        {key: 'wire_info',      label: '線材, 線長, 線色',     sortable: true},
        {key: 'target_qty',     label: '數量',                 sortable: true},
      ],
      new_assembly_fields: [
        {key: 'order_id',       label: '製令單別-單號',        sortable: true},
        {key: 'product_id',     label: '品號',                 sortable: true},
        {key: 'target_qty',     label: '數量',                 sortable: true},
        {key: 'line_id',        label: '線別',                 sortable: true},
      //{key: 'step',           label: '工序',                 sortable: true},
      //{key: 'process_name',   label: '製程',                 sortable: true},
      ],
    }
  },

  created() {
  //mounted() {

    this.getOrders();

    this.getSchProgress();
    this.getNewJobs();    
    this.getNewAssemblyJobs();

    setInterval(this.getSchProgress, 20000);
    setInterval(this.getNewJobs, 20000);
    setInterval(this.getNewAssemblyJobs, 30000);
  },

  computed: {
    doFormat: function () {
      for(var j=0; j<this.auto_jobs.length; j++)
      {
        if(this.auto_jobs[j].machine=='-1')
        {
          this.auto_jobs[j].machine = 'X';
          this.auto_jobs[j].end_time = 'X';
        }
      }
      for(var j=0; j<this.presemi_jobs.length; j++)
      {
        if(this.presemi_jobs[j].worker=='-1')
        {
          this.presemi_jobs[j].worker = 'X';
          this.presemi_jobs[j].end_time = 'X';
        }
      }
      for(var j=0; j<this.semiauto_jobs.length; j++)
      {
        if(this.semiauto_jobs[j].worker=='-1')
        {
          this.semiauto_jobs[j].worker = 'X';
          this.semiauto_jobs[j].machine = 'X';
          this.semiauto_jobs[j].end_time = 'X';
        }
      }
    },
  },

  methods: {
    getOrders() {
      var sql = "SELECT DISTINCT order_id, product_id, target_qty, open_date, due_date, \
                    CONCAT('(', customer_id, ') ', customer_name) AS customer_info \
                 FROM job_status \
                 WHERE due_date<=ADDDATE(CURRENT_DATE, INTERVAL 12 DAY) \
                    AND target_qty>0 AND (mocta_state!='y' OR mocta_state!='Y') \
                 ORDER BY due_date";
      let param = {sql: sql};
      this.$http.get('/api/statistic/generalQuery', {params: param}).then(res => {
        this.orders = res.data;});
    },



    getSchProgress() {
      /*var sql0 = "SELECT *, CONCAT(step, ', ', spec) AS step_spec, \
                    CONCAT(wire_id, ', ', wire_length, ', ', wire_color) AS wire_info, \
                    CONCAT(acc_good, ' / ', target_qty, ' (', FLOOR(100 * acc_good / target_qty), '%)') AS progress \
                  FROM job_status \
                  WHERE \
                    (SUBSTR(start_time, 1, 10)=CURRENT_DATE OR SUBSTR(end_time, 1, 10)=CURRENT_DATE OR \
                    log like CONCAT('%', replace(CURRENT_DATE, '-', '/'), '%')) AND \
                    job_type='";
      */
      var sql0 = "SELECT *, CONCAT(step, ', ', spec) AS step_spec, \
                    CONCAT(wire_id, ', ', wire_length, ', ', wire_color) AS wire_info, \
                    CONCAT(acc_good, ' / ', target_qty, ' (', FLOOR(100 * acc_good / target_qty), '%)') AS progress \
                  FROM job_status \
                  WHERE order_id IN \
                    (SELECT DISTINCT order_id WHERE due_date<=ADDDATE(CURRENT_DATE, INTERVAL 12 DAY) \
                    AND (mocta_state!='y' AND mocta_state!='Y')) \
                    AND job_type='";
      
      var sql = sql0 + '自動' + "' ORDER BY end_time;";
      let param = {sql: sql};
      this.$http.get('/api/statistic/generalQuery', {params: param}).then(res => {
          this.auto_jobs = res.data;});

      sql = sql0 + '半自動前加工' + "' ORDER BY end_time;";
      param = {sql: sql};
      this.$http.get('/api/statistic/generalQuery', {params: param}).then(res => {
          this.presemi_jobs = res.data;});

      sql = sql0 + '半自動' + "' ORDER BY end_time;";
      param = {sql: sql};
      this.$http.get('/api/statistic/generalQuery', {params: param}).then(res => {
          this.semiauto_jobs = res.data;});
    },



    getNewJobs() {
      var sql = "SELECT *, CONCAT(step, ', ', spec) AS step_spec, \
                    CONCAT(wire_id, ', ', wire_length, ', ', wire_color) AS wire_info \
                 FROM job_status WHERE \
                    state='未進站' AND prev_step_state='已出站' AND line_id LIKE '[\"001\"]' AND \
                    start_time IS NULL \
                 ORDER BY due_date";
      let param = {sql: sql};
      this.$http.get('/api/statistic/generalQuery', {params: param}).then(res => {
        this.new_jobs = res.data;});
    },



    getNewAssemblyJobs () {
	  var sql = "TRUNCATE TABLE job_status_temp; TRUNCATE TABLE job_status_temp2; \
	             TRUNCATE TABLE job_status_temp3; TRUNCATE TABLE job_status_temp4; TRUNCATE TABLE job_status_temp5;";


	  //Potential new assembly jobs
      sql = sql + "INSERT INTO job_status_temp (order_id, product_id, line_id, next_line_id) \
                    SELECT DISTINCT order_id, product_id, line_id, next_line_id FROM job_status \
                    WHERE (mocta_state!='y' AND mocta_state!='Y') \
					AND ((line_id LIKE '[\"001\"]' AND wrapup_state LIKE '已撿線%') \
					      OR (line_id NOT LIKE '[\"001\"]' AND state='已出站')) \
                    AND next_line_id!=line_id AND next_line_id NOT LIKE '[]' AND next_line_id NOT LIKE '[\"001\"]' \
                    AND next_line_id IS NOT NULL;";// AND order_id='A511-10811210035';";


	  //Not new assembly jobs
      sql = sql + "INSERT INTO job_status_temp2 (order_id, product_id, line_id, next_line_id) \
                    SELECT DISTINCT order_id, product_id, line_id, next_line_id FROM job_status \
                    WHERE (mocta_state!='y' AND mocta_state!='Y') \
					AND ((line_id LIKE '[\"001\"]' AND wrapup_state NOT LIKE '已撿線%') \
					      OR (line_id NOT LIKE '[\"001\"]' AND state!='已出站')) \
                    AND next_line_id!=line_id AND next_line_id NOT LIKE '[]' AND next_line_id NOT LIKE '[\"001\"]' \
                    AND next_line_id IS NOT NULL;";// AND order_id='A511-10811210035';";


      //remove not ready
	  sql = sql + "INSERT INTO job_status_temp3 SELECT * FROM job_status_temp WHERE (order_id, product_id, next_line_id) NOT IN \
                    (SELECT order_id, product_id, next_line_id FROM job_status_temp2);";


      //remove not new
	  sql = sql + "INSERT INTO job_status_temp4 SELECT * FROM job_status_temp3 WHERE (order_id, next_line_id) IN \
                    (SELECT DISTINCT order_id, line_id AS next_line_id FROM job_status WHERE job_type='組立' AND state='未進站');";


	  sql = sql + "INSERT INTO job_status_temp5 SELECT * FROM job_status_temp4 WHERE (order_id, product_id, next_line_id) NOT IN \
                    (SELECT DISTINCT order_id, product_id, line_id AS next_line_id FROM job_assignment);";
	  let param = {sql: sql};
      this.$http.get('/api/statistic/generalQuery', {params: param});



      sql = "SELECT DISTINCT order_id, product_id, target_qty, line_id FROM job_status WHERE (order_id, product_id, line_id) IN \
                    (SELECT order_id, product_id, next_line_id AS line_id FROM job_status_temp5)";
      param = {sql: sql};
      this.$http.get('/api/statistic/generalQuery', {params: param}).then(res => {
        this.new_assembly_jobs = res.data;
      });
    },
  }
}
</script>
