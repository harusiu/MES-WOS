<template>
  <div class="animated fadeIn">
{{computedStatistics}}
    <b-row>
      <!--<b-col xs="12" lg="12">-->
      <b-col lg="12">
        <b-card>
          <b-tabs>
            <b-tab :title="'CA1 自動 (' + auto_items.length + ')'">
              <br>
              <table>
              <tr>
              <td>
              <b-btn @click="expandAll" variant="primary">⊞ 全開</b-btn>&nbsp;
              <b-btn @click="collapseAll" variant="primary">⊟ 全關</b-btn>&emsp;
              </td>
              <td>
              <b-form-radio-group id="basicRadios"
                :plain="true"
                :options="[
                  {text: '顯示 QR code',value: 'true'},
                  {text: '不顯示 QR code (展開速度較快)',value: 'false'},
                ]"
                checked="false"
                v-model="show_qrcode"
              >
              </b-form-radio-group>
              </td>
              </tr>
              </table>
              <br>
              <br>
              <b-row>
                <b-col class="col-6">
                  <b-col lg="12" v-for="(m_item, m_index) in auto_machines" v-if="(m_index%2)==0">
                    <table class="col-12">
                      <tr>
                        <td width="7%">
                          <b-form-checkbox v-model="show_detail[m_index]">
                          </b-form-checkbox>
                        </td>
                        <td>
                          <b v-if="m_item.machine!='-1'">{{m_item.machine}}</b><b v-if="m_item.machine=='-1'">因機台滿載無法排程工單</b>&emsp;
                          [時] {{total_time[m_index]}}&emsp;
                          [單] {{nof_jobs[m_index]}}&emsp;
                          [產] {{total_todo_qty[m_index]}}&emsp;
                          [換線/左/右] {{total_change_line[m_index]}}/{{total_change_left[m_index]}}/{{total_change_right[m_index]}} 次
                        </td>
                      </tr>
                      <tr>
                        <td>D+1</td>
                        <td>
                          <b-progress :show-value="true">
                            <b-progress-bar
                              :variant="loading[m_index]"
                              :value="total_time_day1[m_index]*100/470" :label="`${(total_time_day1[m_index]*100/470).toFixed(0)}%`"></b-progress-bar>
                          </b-progress>
                        </td>
                      </tr>
                      <tr>
                        <td>D+2</td>
                        <td>
                          <b-progress :show-value="true">
                            <b-progress-bar
                              :variant="loading[m_index]"
                              :value="total_time_day2[m_index]*100/470" :label="`${(total_time_day2[m_index]*100/470).toFixed(0)}%`"></b-progress-bar>
                          </b-progress>
                        </td>
                      </tr>
                    </table>
                    <br>
                    <div v-for="(j_item, j_index) in auto_items" v-if="j_item.machine==m_item.machine && show_detail[m_index]">
                      <div style="text-align: left; width:50%; display: inline-block;">製令: {{j_item.order_id}}</div>
                      <div style="text-align: right; width:50%;  display: inline-block;">
                      派工時間: {{new Date(j_item.start_time).getMonth()+1}}/{{new Date(j_item.start_time).getDate()}}
                                {{new Date(j_item.start_time).getHours()}}:{{new Date(j_item.start_time).getMinutes()}} ~
                                {{new Date(j_item.end_time).getHours()}}:{{new Date(j_item.end_time).getMinutes()}}&nbsp;({{j_item.exe_time}} min)<br>
                      </div>
                      <table class="col-12" border="1">
                        <tr>
                          <td colspan="3">
                            <!--<b-button :href="product_id_for_send +j_item.product_id"  target="_blank" variant="warning">-->
                            <b-button :variant="loading[m_index]">品號: {{j_item.product_id}}</b-button>
                            &emsp;工序: {{j_item.step}}&emsp;檢規: {{j_item.spec}}
                          </td>
                          <td>產量: {{j_item.acc_good}} / {{j_item.target_qty}}</td>
                          <td rowspan="5" align="center" width="20%">
                            <qr-code v-if="show_qrcode=='true'" size="100" :text="'JobID: '+j_item.order_id+'_'+j_item.product_id+'_'+j_item.step+'_'+j_item.spec">
                            </qr-code>
                          </td>
                        </tr>
                        <tr>
                          <td colspan="2">線材: {{j_item.wire_id}}</td>
                          <td>左端子: {{j_item.ft_left}}</td>
                          <td>右端子: {{j_item.ft_right}}</td>
                        </tr>
                        <tr>
                          <td>顏色</td>
                          <td>長度</td>
                          <td>剝皮</td>
                          <td>穿P</td>
                        </tr>
                        <tr>
                          <td width="20%">{{j_item.wire_color}}</td>
                          <td width="20%">{{j_item.wire_length}}</td>
                          <td width="20%">{{j_item.peel_left}} / {{j_item.peel_right}}</td>
                          <td width="20%">{{j_item.wearp_left}} / {{j_item.wearp_right}}</td>
                        </tr>
                      </table>
                      <!--<div style="text-align: left; width:50%; display: inline-block;">上一工序: {{j_item.prev_step}}</div>-->
                      <div style="text-align: right; width:100%; display: inline-block;">下一站: 工序 {{j_item.next_step}} @ 線別 {{j_item.next_line_id}}</div>
                      <br>
                      <br>
                    </div>
                  </b-col>
                </b-col>

                <b-col class="col-6">
                  <b-col lg="12" v-for="(m_item, m_index) in auto_machines" v-if="(m_index%2)==1">
                    <table class="col-12">
                      <tr>
                        <td width="7%">
                          <b-form-checkbox v-model="show_detail[m_index]">
                          </b-form-checkbox>
                        </td>
                        <td>
                          <b v-if="m_item.machine!='-1'">{{m_item.machine}}</b><b v-if="m_item.machine=='-1'">因機台滿載無法排程工單</b>&emsp;
                          [時] {{total_time[m_index]}}&emsp;
                          [單] {{nof_jobs[m_index]}}&emsp;
                          [產] {{total_todo_qty[m_index]}}&emsp;
                          [換線/左/右] {{total_change_line[m_index]}}/{{total_change_left[m_index]}}/{{total_change_right[m_index]}} 次
                        </td>
                      </tr>
                      <tr>
                        <td>D+1</td>
                        <td>
                          <b-progress :show-value="true">
                            <b-progress-bar
                              :variant="loading[m_index]"
                              :value="total_time_day1[m_index]*100/470" :label="`${(total_time_day1[m_index]*100/470).toFixed(0)}%`"></b-progress-bar>
                          </b-progress>
                        </td>
                      </tr>
                      <tr>
                        <td>D+2</td>
                        <td>
                          <b-progress :show-value="true">
                            <b-progress-bar
                              :variant="loading[m_index]"
                              :value="total_time_day2[m_index]*100/470" :label="`${(total_time_day2[m_index]*100/470).toFixed(0)}%`"></b-progress-bar>
                          </b-progress>
                        </td>
                      </tr>
                    </table>
                    <br>
                    <div v-for="(j_item, j_index) in auto_items" v-if="j_item.machine==m_item.machine && show_detail[m_index]">
                      <div style="text-align: left; width:50%; display: inline-block;">製令: {{j_item.order_id}}</div>
                      <div style="text-align: right; width:50%;  display: inline-block;">
                      派工時間: {{new Date(j_item.start_time).getMonth()+1}}/{{new Date(j_item.start_time).getDate()}}
                                {{new Date(j_item.start_time).getHours()}}:{{new Date(j_item.start_time).getMinutes()}} ~
                                {{new Date(j_item.end_time).getHours()}}:{{new Date(j_item.end_time).getMinutes()}}&nbsp;({{j_item.exe_time}} min)<br>
                      </div>
                      <table class="col-12" border="1">
                        <tr>
                          <td colspan="3">
                            <!--<b-button :href="product_id_for_send +j_item.product_id"  target="_blank" variant="warning">-->
                            <b-button :variant="loading[m_index]">品號: {{j_item.product_id}}</b-button>
                            &emsp;工序: {{j_item.step}}&emsp;檢規: {{j_item.spec}}
                          </td>
                          <td>產量: {{j_item.acc_good}} / {{j_item.target_qty}}</td>
                          <td rowspan="5" align="center" width="20%">
                            <qr-code v-if="show_qrcode=='true'" size="100" :text="'JobID: '+j_item.order_id+'_'+j_item.product_id+'_'+j_item.step+'_'+j_item.spec">
                            </qr-code>
                          </td>
                        </tr>
                        <tr>
                          <td colspan="2">線材: {{j_item.wire_id}}</td>
                          <td>左端子: {{j_item.ft_left}}</td>
                          <td>右端子: {{j_item.ft_right}}</td>
                        </tr>
                        <tr>
                          <td>顏色</td>
                          <td>長度</td>
                          <td>剝皮</td>
                          <td>穿P</td>
                        </tr>
                        <tr>
                          <td width="20%">{{j_item.wire_color}}</td>
                          <td width="20%">{{j_item.wire_length}}</td>
                          <td width="20%">{{j_item.peel_left}} / {{j_item.peel_right}}</td>
                          <td width="20%">{{j_item.wearp_left}} / {{j_item.wearp_right}}</td>
                        </tr>
                      </table>
                      <!--<div style="text-align: left; width:50%; display: inline-block;">上一工序: {{j_item.prev_step}}</div>-->
                      <div style="text-align: right; width:100%; display: inline-block;">下一站: 工序 {{j_item.next_step}} @ 線別 {{j_item.next_line_id}}</div>
                      <br>
                      <br>
                    </div>
                  </b-col>
                </b-col>
              </b-row>
            </b-tab>

            <b-tab :title="'CA1 自動 (' + auto_items.length + ')'">
              <b-form-input v-model="filter" placeholder="輸入關鍵字搜尋"></b-form-input>
              <br>
              <c-table :table-data="auto_items" :fields="auto_fields" :filter="filter"></c-table>
            </b-tab>

            <b-tab :title="'CA1 半自動 (' + semiauto_items.length + ')'">
              <b-form-input v-model="filter" placeholder="輸入關鍵字搜尋"></b-form-input>
              <br>
              <c-table :table-data="semiauto_items" :fields="semiauto_fields" :filter="filter"></c-table>
            </b-tab>

            <b-tab :title="'組立 (' + assembly_items.length + ')'">
              <b-form-input v-model="filter" placeholder="輸入關鍵字搜尋"></b-form-input>
              <br>
              <c-table :table-data="assembly_items" :fields="assembly_fields" :filter="filter"></c-table>
            </b-tab>

          </b-tabs>
        </b-card>
      </b-col>
    </b-row>
<!--{{computedStatistics}}-->
  </div>
</template>



<script>
import cTable from './Table.vue'
import Vue from 'vue'   //for QR code
import VueQRCodeComponent from 'vue-qrcode-component'   //for QR code
Vue.component('qr-code', VueQRCodeComponent)    //for QR code

export default {
  name: 'SchResult',
  components: {cTable},
  
  data () {
    return {
      filter: null,

      auto_machines: [],
      auto_items_stat: [],
      auto_items: [],
      show_detail: [],
      show_qrcode: false,

      total_time: [],           //時
      total_time_day1: [],
      total_time_day2: [],
      loading: [],
      nof_jobs: [],             //單
      total_todo_qty: [],       //產
      total_change_line: [],    //換線
      total_change_left: [],    //換左
      total_change_right: [],   //換右
      prev_jobIdx: [],

      presemi_items: [],
      semiauto_items: [],
      assembly_items: [],

      auto_fields: [
        {key: 'order_id',       label: '製令',          sortable: true},
        {key: 'product_id',     label: '品號',          sortable: true},
        {key: 'step_spec',      label: '工序, 檢規',    sortable: true},
        {key: 'process_name',   label: '作業名稱',      sortable: true},
      //{key: 'spec',           label: '檢規',          sortable: true},
      //{key: 'target_qty',     label: '目標產量',      sortable: true},
      //{key: 'acc_good',       label: '已生產',        sortable: true},
        {key: 'progress',       label: '已生產/目標',   sortable: true},
      //{key: 'worker',         label: '員工 (排)',     sortable: true, variant: 'info'},
        {key: 'machine',        label: '機台 (排)',     sortable: true, variant: 'info'},
        {key: 'start_time',     label: '起始 (排)',     sortable: true, variant: 'info',
            formatter: value => {return flatpickr.formatDate(new Date(value), "m/d H:i:S")}},
        {key: 'end_time',       label: '結束 (排)',     sortable: true, variant: 'info',
            formatter: value => {return flatpickr.formatDate(new Date(value), "m/d H:i:S")}},
      //{key: 'show_details',   label: ''},
      ],
      presemi_fields: [
        {key: 'order_id',       label: '製令',          sortable: true},
        {key: 'product_id',     label: '品號',          sortable: true},
        {key: 'step_spec',      label: '工序, 檢規',    sortable: true},
        {key: 'process_name',   label: '作業名稱',      sortable: true},
      //{key: 'spec',           label: '檢規',          sortable: true},
      //{key: 'target_qty',     label: '目標產量',      sortable: true},
      //{key: 'acc_good',       label: '已生產',        sortable: true},
        {key: 'progress',       label: '已生產/目標',   sortable: true},
        {key: 'worker',         label: '員工 (排)',     sortable: true, variant: 'info'},
      //{key: 'machine',        label: '機台 (排)',     sortable: true, variant: 'info'},
        {key: 'start_time',     label: '起始 (排)',     sortable: true, variant: 'info',
            formatter: value => {return flatpickr.formatDate(new Date(value), "m/d H:i:S")}},
        {key: 'end_time',       label: '結束 (排)',     sortable: true, variant: 'info',
            formatter: value => {return flatpickr.formatDate(new Date(value), "m/d H:i:S")}},
      //{key: 'show_details',   label: ''},
      ],
      semiauto_fields: [
        {key: 'order_id',       label: '製令',          sortable: true},
        {key: 'product_id',     label: '品號',          sortable: true},
        {key: 'step_spec',      label: '工序, 檢規',    sortable: true},
        {key: 'process_name',   label: '作業名稱',      sortable: true},
      //{key: 'spec',           label: '檢規',          sortable: true},
      //{key: 'target_qty',     label: '目標產量',      sortable: true},
      //{key: 'acc_good',       label: '已生產',        sortable: true},
        {key: 'progress',       label: '已生產/目標',   sortable: true},
        {key: 'worker',         label: '員工 (排)',     sortable: true, variant: 'info'},
        {key: 'machine',        label: '機台 (排)',     sortable: true, variant: 'info'},
        {key: 'start_time',     label: '起始 (排)',     sortable: true, variant: 'info',
            formatter: value => {return flatpickr.formatDate(new Date(value), "m/d H:i:S")}},
        {key: 'end_time',       label: '結束 (排)',     sortable: true, variant: 'info',
            formatter: value => {return flatpickr.formatDate(new Date(value), "m/d H:i:S")}},
      //{key: 'show_details',   label: ''},
      ],
      assembly_fields: [
        {key: 'order_id',       label: '製令',          sortable: true},
        {key: 'product_id',     label: '品號',          sortable: true},
        {key: 'step_spec',      label: '工序, 檢規',    sortable: true},
        {key: 'process_name',   label: '作業名稱',      sortable: true},
      //{key: 'spec',           label: '檢規',          sortable: true},
      //{key: 'target_qty',     label: '目標產量',      sortable: true},
      //{key: 'acc_good',       label: '已生產',        sortable: true},
        {key: 'progress',       label: '已生產/目標',   sortable: true},
        {key: 'worker',         label: '線別 (排)',     sortable: true, variant: 'info'},
        {key: 'start_time',     label: '起始 (排)',     sortable: true, variant: 'info',
            formatter: value => {return flatpickr.formatDate(new Date(value), "m/d H:i:S")}},
        {key: 'end_time',       label: '結束 (排)',     sortable: true, variant: 'info',
            formatter: value => {return flatpickr.formatDate(new Date(value), "m/d H:i:S")}},
      //{key: 'show_details',   label: ''},
      ],
    }
  },

  created() {

    this.getAutoMachines();
    this.getAmJobAssignments();
    this.getSchResult('自動');
    this.getSchResult('半自動前加工');
    this.getSchResult('半自動');
    this.getSchResult('組立');


	//setInterval(this.getSchResultAll, 2000);
    /*setTimeout(this.getSchResultAll, 2000);
	setTimeout(this.getSchResultAll, 4000);
	setTimeout(this.getSchResultAll, 6000);
	setTimeout(this.getSchResultAll, 8000);
	setTimeout(this.getSchResultAll, 10000);
	setTimeout(this.getSchResultAll, 15000);
	setTimeout(this.getSchResultAll, 20000);
	setTimeout(this.getSchResultAll, 30000);
    */
	//setInterval( function() { this.getSchResult("自動"); }, 2000 );
	//vm.$forceUpdate();
	//this.reload();
  },
  
  mounted() {
    //this.doStatistics();
  },

  computed: {
    computedStatistics () {
      var j, m;
      var byFoo = {};
      for(m=0; m<this.auto_machines.length; m++)
      {
        byFoo[this.auto_machines[m].machine] = m;
        
        this.total_time[m] = 0;
        this.nof_jobs[m] = 0;
        this.total_todo_qty[m] = 0;
        this.total_change_line[m] = 0;
        this.total_change_left[m] = 0;
        this.total_change_right[m] = 0;
        this.prev_jobIdx[m] = 0;
      }

      //console.log('nof_amJobs: ' + this.auto_items_stat.length);
      
      for(j=0; j<this.auto_items_stat.length; j++)
      {
        //console.log("job " + j + " machine " + this.auto_items_stat[j].machine);
        if (this.auto_items_stat[j].machine == '-1')
        {
          var m = this.auto_machines.length - 1;
          this.total_time[m] = this.total_time[m] + this.auto_items_stat[j].exe_time;
          this.nof_jobs[m] = this.nof_jobs[m] + 1;
          //this.total_todo_qty[m] = this.total_todo_qty[m] + this.auto_items_stat[j].target_qty - this.auto_items_stat[j].acc_good;
          this.total_todo_qty[m] = this.total_todo_qty[m] + this.auto_items_stat[j].todo_qty;
          continue;
        }
        //var m;
        /*for (m=0; m<this.auto_machines.length; m++)
          if (this.auto_items_stat[j].machine == this.auto_machines[m].machine)
            break;*/
        //var mm = this.auto_machines.findIndex(id => id.machine == this.auto_items_stat[j].machine);
        m = byFoo[this.auto_items_stat[j].machine];

        this.total_time[m] = this.total_time[m] + this.auto_items_stat[j].exe_time;
        this.nof_jobs[m] = this.nof_jobs[m] + 1;
        //this.total_todo_qty[m] = this.total_todo_qty[m] + this.auto_items_stat[j].target_qty - this.auto_items_stat[j].acc_good;
        this.total_todo_qty[m] = this.total_todo_qty[m] + this.auto_items_stat[j].todo_qty;
        
        if(this.prev_jobIdx[m] > 0)
        {
          if(this.auto_items_stat[j].wire_id != this.auto_items_stat[this.prev_jobIdx[m]].wire_id ||
             this.auto_items_stat[j].wire_color != this.auto_items_stat[this.prev_jobIdx[m]].wire_color)
            this.total_change_line[m] = this.total_change_line[m] + 1;

          if(this.auto_items_stat[j].ft_left != this.auto_items_stat[this.prev_jobIdx[m]].ft_left)
            this.total_change_left[m] = this.total_change_left[m] + 1;

          if(this.auto_items_stat[j].ft_right != this.auto_items_stat[this.prev_jobIdx[m]].ft_right)
            this.total_change_right[m] = this.total_change_right[m] + 1;
        }
        this.prev_jobIdx[m] = j;
      }

      for(m=0; m<this.auto_machines.length; m++)
      {
        if(this.total_time[m] > 2*470)
        {
          this.loading[m] = "danger";
          this.total_time_day1[m] = 470;
          this.total_time_day2[m] = this.total_time[m] - 470;
        }
        else if(this.total_time[m] > 470)
        {
          this.loading[m] = "warning";
          this.total_time_day1[m] = 470;
          this.total_time_day2[m] = this.total_time[m] - 470;
        }
        else
        {
          this.loading[m] = "success";
          this.total_time_day1[m] = this.total_time[m];
          this.total_time_day2[m] = 0;
        }
      }
      //console.log("End: " + new Date());
    },
  },

  methods: {
	sleep(milliseconds) {
	  const date = Date.now();
	  let currentDate = null;
	  do {
		currentDate = Date.now();
	  } while (currentDate - date < milliseconds);
	},

    arrSum (arr) {
      return arr.reduce(function(a,b){
      return a + b
      }, 0);
    },
    
    doStatistics () {
    },
    
    getSchResult(type) {
      console.log("getSchResult " + type);
      var sql = "SELECT *, CONCAT(step, ', ', spec) AS step_spec, \
                    CONCAT(acc_good, ' / ', target_qty, ' (', FLOOR(100 * acc_good / target_qty), '%)') AS progress \
                    FROM job_assignment \
                    WHERE job_type='" + type + "' ORDER BY start_time";
      //let param = {job_type: type};
      let param = {sql: sql};
      this.$http.get('/api/generalQuery', {params: param}).then(res => {
        if(type=='自動')
          this.auto_items = res.data;
        else if(type=='半自動前加工')
          this.presemi_items = res.data;
        else if(type=='半自動')
          this.semiauto_items = res.data;
        else if(type=='組立')
          this.assembly_items = res.data;
      });
    },

    getSchResultAll() {
      this.getSchResult('自動');
      this.getSchResult('半自動前加工');
      this.getSchResult('半自動');
      this.getSchResult('組立');
    },

    getAutoMachines() {
      var sql = "SELECT DISTINCT machine FROM job_assignment_stat WHERE machine != '-1' ORDER BY machine";
      let param = {sql: sql};
      //this.$http.get('/api/schedule/getAutoMachines').then(res => {
      this.$http.get('/api/generalQuery', {params: param}).then(res => {
        this.auto_machines = res.data;
        var obj = {machine: "-1"};
        this.auto_machines.push(obj);
      });
    },

    getAmJobAssignments() {
      var sql = "SELECT machine, todo_qty, start_time, end_time, exe_time, wire_id, wire_color, \
                    ft_left, ft_right FROM job_assignment_stat ORDER BY machine, start_time";
      let param = {sql: sql};
      //this.$http.get('/api/schedule/getAmJobAssignments').then(res => {
      this.$http.get('/api/generalQuery', {params: param}).then(res => {
        this.auto_items_stat = res.data;
      });
    },

    expandAll() {
      for(var i=0; i<this.auto_machines.length; i++) {
        this.$set(this.show_detail, i, true);
        //this.show_detail[i] = true;
      }
    },

    collapseAll() {
      for(var i=0; i<this.auto_machines.length; i++) {
        this.$set(this.show_detail, i, false);
        //this.show_detail[i] = false;
      }
    },
  }
}
</script>
