<template>
  <div class="animated fadeIn">
    <b-row>
      <!--<b-col xs="12" lg="12">-->
      <b-col lg="12">
        <b-card>
          <b-tabs>
            <b-tab :title="'自動作業 (' + auto_items.length + ')'">
              <!--
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
                  {text: '顯示 QR code', value: 'true'},
                  {text: '不顯示 QR code (展開速度較快)', value: 'false'},
                ]"
                checked="false"
                v-model="show_qrcode"
              >
              </b-form-radio-group>
              </td>
              </tr>
              </table>
              -->
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
                          [時] {{(total_time[m_index]/60).toFixed(0)}}&emsp;
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
                              :value="total_time_day1[m_index]*100/(470*60)" :label="`${(total_time_day1[m_index]*100/(470*60)).toFixed(0)}%`"></b-progress-bar>
                          </b-progress>
                        </td>
                      </tr>
                      <tr>
                        <td>D+2</td>
                        <td>
                          <b-progress :show-value="true">
                            <b-progress-bar
                              :variant="loading[m_index]"
                              :value="total_time_day2[m_index]*100/(470*60)" :label="`${(total_time_day2[m_index]*100/(470*60)).toFixed(0)}%`"></b-progress-bar>
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
                                {{new Date(j_item.end_time).getHours()}}:{{new Date(j_item.end_time).getMinutes()}}&nbsp;({{(j_item.exe_time/60).toFixed(0)}} min)<br>
                      </div>
                      <table class="col-12" border="1">
                        <tr>
                          <td colspan="3">
                            <!--<b-button :href="product_id_for_send +j_item.product_id"  target="_blank" variant="warning">-->
                            <b-button :variant="loading[m_index]">品號: {{j_item.product_id}}</b-button>
                            &emsp;工序: {{j_item.step}}&emsp;檢規: {{j_item.spec}}
                          </td>
                          <td>數量: {{j_item.target_qty}}</td>
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
                          [時] {{(total_time[m_index]/60).toFixed(0)}}&emsp;
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
                              :value="total_time_day1[m_index]*100/(470*60)" :label="`${(total_time_day1[m_index]*100/(470*60)).toFixed(0)}%`"></b-progress-bar>
                          </b-progress>
                        </td>
                      </tr>
                      <tr>
                        <td>D+2</td>
                        <td>
                          <b-progress :show-value="true">
                            <b-progress-bar
                              :variant="loading[m_index]"
                              :value="total_time_day2[m_index]*100/(470*60)" :label="`${(total_time_day2[m_index]*100/(470*60)).toFixed(0)}%`"></b-progress-bar>
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
                                {{new Date(j_item.end_time).getHours()}}:{{new Date(j_item.end_time).getMinutes()}}&nbsp;({{(j_item.exe_time/60).toFixed(0)}} min)<br>
                      </div>
                      <table class="col-12" border="1">
                        <tr>
                          <td colspan="3">
                            <!--<b-button :href="product_id_for_send +j_item.product_id"  target="_blank" variant="warning">-->
                            <b-button :variant="loading[m_index]">品號: {{j_item.product_id}}</b-button>
                            &emsp;工序: {{j_item.step}}&emsp;檢規: {{j_item.spec}}
                          </td>
                          <td>數量: {{j_item.target_qty}}</td>
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

            <b-tab :title="'自動裁線作業 (' + auto_cut_jobs.length + ')'">
              <!--<b-form-input v-model="auto_cut_filter" placeholder="輸入關鍵字搜尋"></b-form-input>
              <br>-->
              <c-table :table-data="auto_cut_jobs" :fields="auto_cut_fields" :filter="auto_cut_filter"></c-table>
            </b-tab>

            <b-tab :title="'自動打端子作業 (' + auto_hit_jobs.length + ')'">
              <!--<b-form-input v-model="auto_hit_filter" placeholder="輸入關鍵字搜尋"></b-form-input>
              <br>-->
              <c-table :table-data="auto_hit_jobs" :fields="auto_hit_fields" :filter="auto_hit_filter"></c-table>
            </b-tab>

            <!--
            <b-tab :title="'CA1 自動穿P (' + auto_wear_jobs.length + ')'">
              <b-form-input v-model="auto_wear_filter" placeholder="輸入關鍵字搜尋"></b-form-input>
              <br>
              <c-table :table-data="auto_wear_jobs" :fields="auto_wear_fields" :filter="auto_wear_filter"></c-table>
            </b-tab>

            <b-tab :title="'CA1 半自動前加工 (' + presemi_jobs.length + ')'">
              <b-form-input v-model="presemi_filter" placeholder="輸入關鍵字搜尋"></b-form-input>
              <br>
              <c-table :table-data="presemi_jobs" :fields="presemi_fields" :filter="presemi_filter"></c-table>
            </b-tab>

            <b-tab :title="'CA1 半自動 (' + semiauto_jobs.length + ')'">
              <b-form-input v-model="semiauto_filter" placeholder="輸入關鍵字搜尋"></b-form-input>
              <br>
              <c-table :table-data="semiauto_jobs" :fields="semiauto_fields" :filter="semiauto_filter"></c-table>
            </b-tab>

            <b-tab :title="'廠內組立 (' + inFactory_asm_jobs.length + ')'">
              <b-form-input v-model="inFactory_asm_filter" placeholder="輸入關鍵字搜尋"></b-form-input>
              <br>
              <c-table :table-data="inFactory_asm_jobs" :fields="inFactory_asm_fields" :filter="inFactory_asm_filter"></c-table>
            </b-tab>

            <b-tab :title="'託外組立 (' + outFactory_asm_jobs.length + ')'">
              <b-form-input v-model="outFactory_asm_filter" placeholder="輸入關鍵字搜尋"></b-form-input>
              <br>
              <c-table :table-data="outFactory_asm_jobs" :fields="outFactory_asm_fields" :filter="outFactory_asm_filter"></c-table>
            </b-tab>

            <b-tab :title="'應排未排 CA1 工單 (' + not_sch_ca1_jobs.length + ')'">
              <b-form-input v-model="not_sch_ca1_jobs_filter" placeholder="輸入關鍵字搜尋"></b-form-input>
              <br>
              <c-table :table-data="not_sch_ca1_jobs" :fields="not_sch_ca1_jobs_fields" :filter="not_sch_ca1_jobs_filter"></c-table>
            </b-tab>

            <b-tab :title="'應排未排組立工單 (' + not_sch_asm_jobs.length + ')'">
              <b-form-input v-model="not_sch_asm_jobs_filter" placeholder="輸入關鍵字搜尋"></b-form-input>
              <br>
              <c-table :table-data="not_sch_asm_jobs" :fields="not_sch_asm_jobs_fields" :filter="not_sch_asm_jobs_filter"></c-table>
            </b-tab>
            -->

          </b-tabs>
        </b-card>
      </b-col>
    </b-row>
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
      filter: "",
      show_detail: [],
      show_qrcode: false,

      auto_machines: [],
      auto_items: [],

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



      auto_cut_filter: "",
      auto_cut_jobs: [],
      auto_cut_fields: [
        {key: 'order_id',       label: '製令',          sortable: true},
        {key: 'product_id',     label: '品號',          sortable: true},
        {key: 'step_spec',      label: '工序, 檢規',    sortable: true},
        {key: 'target_qty',     label: '數量',          sortable: true},
        {key: 'due_date',       label: '交期',          sortable: true,
            formatter: value => {return flatpickr.formatDate(new Date(value), "Y/m/d")}},
        {key: 'wire_id',        label: '線材',          sortable: true},
        {key: 'wire_color',     label: '線色',          sortable: true},
        {key: 'wire_length',    label: '線長',          sortable: true},
        {key: 'machine',        label: '機台',          sortable: true},
        {key: 'start_time',     label: '開始',          sortable: true,
            formatter: value => {return flatpickr.formatDate(new Date(value), "m/d H:i")}},
        {key: 'end_time',       label: '結束',          sortable: true,
            formatter: value => {return flatpickr.formatDate(new Date(value), "m/d H:i")}},
      ],

      auto_hit_filter: "",
      auto_hit_jobs: [],
      auto_hit_fields: [
        {key: 'order_id',       label: '製令',          sortable: true},
        {key: 'product_id',     label: '品號',          sortable: true},
        {key: 'step_spec',      label: '工序, 檢規',    sortable: true},
        {key: 'target_qty',     label: '數量',          sortable: true},
        {key: 'due_date',       label: '交期',          sortable: true,
            formatter: value => {return flatpickr.formatDate(new Date(value), "Y/m/d")}},
        {key: 'ft_left_mold_left',    label: '左端子 / 模具',   sortable: true},
        {key: 'ft_right_mold_right',  label: '右端子 / 模具',   sortable: true},
        {key: 'machine',        label: '機台',          sortable: true},
        {key: 'start_time',     label: '開始',          sortable: true,
            formatter: value => {return flatpickr.formatDate(new Date(value), "m/d H:i")}},
        {key: 'end_time',       label: '結束',          sortable: true,
            formatter: value => {return flatpickr.formatDate(new Date(value), "m/d H:i")}},
      ],

      auto_wear_filter: "",
      auto_wear_jobs: [],
      auto_wear_fields: [
        {key: 'order_id',       label: '製令',          sortable: true},
        {key: 'product_id',     label: '品號',          sortable: true},
        {key: 'step_spec',      label: '工序, 檢規',    sortable: true},
        {key: 'target_qty',     label: '數量',          sortable: true},
        {key: 'due_date',       label: '交期',          sortable: true,
            formatter: value => {return flatpickr.formatDate(new Date(value), "Y/m/d")}},
        {key: 'wearp_left',     label: '左P',           sortable: true},
        {key: 'wearp_right',    label: '右P',           sortable: true},
        {key: 'machine',        label: '機台',          sortable: true},
        {key: 'start_time',     label: '開始',          sortable: true,
            formatter: value => {return flatpickr.formatDate(new Date(value), "m/d H:i")}},
        {key: 'end_time',       label: '結束',          sortable: true,
            formatter: value => {return flatpickr.formatDate(new Date(value), "m/d H:i")}},
      ],

      presemi_filter: "",
      presemi_jobs: [],
      presemi_fields: [
        {key: 'order_id',       label: '製令',          sortable: true},
        {key: 'product_id',     label: '品號',          sortable: true},
        {key: 'step_spec',      label: '工序, 檢規',    sortable: true},
        {key: 'target_qty',     label: '數量',          sortable: true},
        {key: 'due_date',       label: '交期',          sortable: true,
            formatter: value => {return flatpickr.formatDate(new Date(value), "Y/m/d")}},
        {key: 'process_name',   label: '作業',          sortable: true},
        {key: 'worker',         label: '員工',          sortable: true},
        {key: 'start_time',     label: '開始',          sortable: true,
            formatter: value => {return flatpickr.formatDate(new Date(value), "m/d H:i")}},
        {key: 'end_time',       label: '結束',          sortable: true,
            formatter: value => {return flatpickr.formatDate(new Date(value), "m/d H:i")}},
      ],

      semiauto_filter: "",
      semiauto_jobs: [],
      semiauto_fields: [
        {key: 'order_id',       label: '製令',          sortable: true},
        {key: 'product_id',     label: '品號',          sortable: true},
        {key: 'step_spec',      label: '工序, 檢規',    sortable: true},
        {key: 'target_qty',     label: '數量',          sortable: true},
        {key: 'due_date',       label: '交期',          sortable: true,
            formatter: value => {return flatpickr.formatDate(new Date(value), "Y/m/d")}},
        {key: 'process_name',   label: '作業',          sortable: true},
        {key: 'ft_left_mold_left',   label: '端子 / 模具',      sortable: true},
        {key: 'worker',         label: '員工',          sortable: true},
        {key: 'machine',        label: '機台',          sortable: true},
        {key: 'start_time',     label: '開始',          sortable: true,
            formatter: value => {return flatpickr.formatDate(new Date(value), "m/d H:i")}},
        {key: 'end_time',       label: '結束',          sortable: true,
            formatter: value => {return flatpickr.formatDate(new Date(value), "m/d H:i")}},
      ],

      inFactory_sam_filter: "",
      inFactory_asm_jobs: [],
      inFactory_asm_fields: [
        {key: 'order_id',       label: '製令',          sortable: true},
        {key: 'product_id',     label: '品號',          sortable: true},
        {key: 'target_qty',     label: '數量',   sortable: true},
        {key: 'due_date',       label: '交期',   sortable: true,
            formatter: value => {return flatpickr.formatDate(new Date(value), "Y/m/d")}},
        {key: 'worker',         label: '線別',     sortable: true},
        {key: 'start_time',     label: '開始',     sortable: true,
            formatter: value => {return flatpickr.formatDate(new Date(value), "m/d H:i")}},
        {key: 'end_time',       label: '結束',     sortable: true,
            formatter: value => {return flatpickr.formatDate(new Date(value), "m/d H:i")}},
      ],

      outFactory_sam_filter: "",
      outFactory_asm_jobs: [],
      outFactory_asm_fields: [
        {key: 'order_id',       label: '製令',          sortable: true},
        {key: 'product_id',     label: '品號',          sortable: true},
        {key: 'target_qty',     label: '數量',   sortable: true},
        {key: 'due_date',       label: '交期',   sortable: true,
            formatter: value => {return flatpickr.formatDate(new Date(value), "Y/m/d")}},
        {key: 'worker',         label: '線別',     sortable: true},
        {key: 'start_time',     label: '開始',     sortable: true,
            formatter: value => {return flatpickr.formatDate(new Date(value), "m/d H:i")}},
        {key: 'end_time',       label: '結束',     sortable: true,
            formatter: value => {return flatpickr.formatDate(new Date(value), "m/d H:i")}},
      ],

      not_sch_ca1_jobs_filter: '',
      not_sch_ca1_jobs: [],
      not_sch_ca1_jobs_fields: [
        {key: 'order_id',       label: '製令',          sortable: true},
        {key: 'product_id',     label: '品號',          sortable: true},
        {key: 'step_spec',      label: '工序, 檢規',    sortable: true},
        {key: 'job_type',       label: '類別',          sortable: true},
        {key: 'process_name',   label: '作業',      sortable: true},
        {key: 'target_qty',     label: '數量',   sortable: true},
        {key: 'due_date',       label: '交期',   sortable: true,
            formatter: value => {return flatpickr.formatDate(new Date(value), "Y/m/d")}},
      ],

      not_sch_asm_jobs_filter: '',
      not_sch_asm_jobs: [],
      not_sch_asm_jobs_fields: [
        {key: 'order_id',       label: '製令',          sortable: true},
        {key: 'product_id',     label: '品號',          sortable: true},
        {key: 'line_id',      label: '線別',    sortable: true},
        {key: 'target_qty',     label: '數量',   sortable: true},
        {key: 'due_date',       label: '交期',   sortable: true,
            formatter: value => {return flatpickr.formatDate(new Date(value), "Y/m/d")}},
      ],
    }
  },

  //mounted() {
  created() {
    this.getAutoMachines();
    this.getAutoJobs();

    this.getAutoCutJobs();
    this.getAutoHitJobs();
    this.getAutoWearJobs();

    this.getPreSemiAutoJobs();
    
    this.getSemiAutoJobs();
    
    this.getInFactoryAssemblyJobs();
    this.getOutFactoryAssemblyJobs();

    //this.getNotScheduledCA1();
    //this.getNotScheduledAssembly();
  },

  methods: {
    doStatistics () {
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

      for(j=0; j<this.auto_items.length; j++)
      {
        /*if (this.auto_items[j].machine == '-1')
        {
          var m = this.auto_machines.length - 1;
          this.total_time[m] = this.total_time[m] + this.auto_items_stat[j].exe_time;
          this.nof_jobs[m] = this.nof_jobs[m] + 1;
          this.total_todo_qty[m] = this.total_todo_qty[m] + this.auto_items_stat[j].todo_qty;
          continue;
        }*/

        m = byFoo[this.auto_items[j].machine];

        this.total_time[m] = this.total_time[m] + this.auto_items[j].exe_time;
        this.nof_jobs[m] = this.nof_jobs[m] + 1;
        this.total_todo_qty[m] = this.total_todo_qty[m] + this.auto_items[j].target_qty - this.auto_items[j].acc_good;
        
        if(this.prev_jobIdx[m] > 0)
        {
          if(this.auto_items[j].wire_id != this.auto_items[this.prev_jobIdx[m]].wire_id ||
             this.auto_items[j].wire_color != this.auto_items[this.prev_jobIdx[m]].wire_color)
            this.total_change_line[m] = this.total_change_line[m] + 1;

          if(this.auto_items[j].ft_left != this.auto_items[this.prev_jobIdx[m]].ft_left)
            this.total_change_left[m] = this.total_change_left[m] + 1;

          if(this.auto_items[j].ft_right != this.auto_items[this.prev_jobIdx[m]].ft_right)
            this.total_change_right[m] = this.total_change_right[m] + 1;
        }
        this.prev_jobIdx[m] = j;
      }

      for(m=0; m<this.auto_machines.length; m++)
      {
        if(this.total_time[m] > 2*470*60)
        {
          this.loading[m] = "danger";
          this.total_time_day1[m] = 470*60;
          this.total_time_day2[m] = this.total_time[m] - 470*60;
        }
        else if(this.total_time[m] > 470*60)
        {
          this.loading[m] = "warning";
          this.total_time_day1[m] = 470*60;
          this.total_time_day2[m] = this.total_time[m] - 470*60;
        }
        else
        {
          this.loading[m] = "success";
          this.total_time_day1[m] = this.total_time[m];
          this.total_time_day2[m] = 0;
        }
      }
    },

    getAutoMachines() {
      //var sql = "SELECT DISTINCT machine FROM fortop.job_assignment_new WHERE job_type='自動' AND LENGTH(machine)>2 "
        //        + "ORDER BY machine";
      var sql = "SELECT equip_id AS machine FROM fortop.equip_list WHERE line_id='001' AND "
                + "(equip_class='裁線機' OR equip_class='自動裁線端子壓著機') "
                + "ORDER BY equip_id";
      let param = {sql: sql};
      this.$http.get('/api/generalQuery', {params: param}).then(res => {
        this.auto_machines = res.data;
      });
    },

    getAutoJobs() {
      /*var sql = "(SELECT * FROM fortop.job_status WHERE job_type='自動' AND LENGTH(machine)>2 "
                + "AND (state='生產中' OR state='中斷') ORDER BY machine, start_time) UNION "
                + "(SELECT * FROM fortop.job_assignment_new WHERE job_type='自動' AND LENGTH(machine)>2 "
                + "ORDER BY machine, start_time)";
      */
      var sql = "SELECT * FROM fortop.job_assignment_new WHERE job_type='自動' AND LENGTH(machine)>2 "
                + "ORDER BY machine, start_time";
      let param = {sql: sql};
      this.$http.get('/api/generalQuery', {params: param}).then(res => {
        this.auto_items = res.data;
        this.doStatistics();
      });
    },

    getAutoCutJobs() {
      var sql = "SELECT *, CONCAT(step, ', ', spec) AS step_spec "
                + "FROM fortop.job_assignment_new WHERE job_type='自動' AND process_id='0011' AND exe_time>0 AND LENGTH(machine)>2 "
                + "ORDER BY machine, start_time";
      let param = {sql: sql};
      this.$http.get('/api/generalQuery', {params: param}).then(res => {
        this.auto_cut_jobs = res.data;
      });
    },

    getAutoHitJobs() {
      var sql = "SELECT *, CONCAT(step, ', ', spec) AS step_spec, "
                + "CONCAT(ft_left, ' / ', wearp_left) AS ft_left_mold_left, "
                + "CONCAT(ft_right, ' / ', wearp_right) AS ft_right_mold_right "
                + "FROM fortop.job_assignment_new WHERE job_type='自動' AND process_id='001' AND exe_time>0 AND LENGTH(machine)>2 "
                + "ORDER BY machine, start_time";
      let param = {sql: sql};
      this.$http.get('/api/generalQuery', {params: param}).then(res => {
        this.auto_hit_jobs = res.data;
      });
    },

    getAutoWearJobs() { //穿P
      var sql = "SELECT *, CONCAT(step, ', ', spec) AS step_spec "
                + "FROM fortop.job_assignment_new WHERE job_type='自動' AND process_id!='001' AND process_id!='0011' AND exe_time>0 AND LENGTH(machine)>2 "
                + "ORDER BY machine, start_time";
      let param = {sql: sql};
      this.$http.get('/api/generalQuery', {params: param}).then(res => {
        this.auto_wear_jobs = res.data;
      });
    },

    getPreSemiAutoJobs() {
      var sql = "SELECT * FROM fortop.job_assignment_new WHERE job_type='半自動前加工' AND exe_time>0 "
                + "ORDER BY worker, start_time";
      let param = {sql: sql};
      this.$http.get('/api/generalQuery', {params: param}).then(res => {
        this.presemi_jobs = res.data;
      });
    },

    getSemiAutoJobs() {
      var sql = "SELECT *, CONCAT(step, ', ', spec) AS step_spec, CONCAT(ft_left, ' / ', wearp_left) AS ft_left_mold_left FROM fortop.job_assignment_new "
                + "WHERE job_type='半自動' AND exe_time>0 "
                + "ORDER BY worker, start_time";
      let param = {sql: sql};
      this.$http.get('/api/generalQuery', {params: param}).then(res => {
        this.semiauto_jobs = res.data;
      });
    },

    getInFactoryAssemblyJobs() {  //廠內組立
      var sql = "SELECT * FROM fortop.job_assignment_new WHERE job_type='組立' AND worker LIKE '0%' OR worker LIKE '1%' "
                + "ORDER BY worker, start_time";
      let param = {sql: sql};
      this.$http.get('/api/generalQuery', {params: param}).then(res => {
        this.inFactory_asm_jobs = res.data;
      });
    },

    getOutFactoryAssemblyJobs() {  //託外組立
      var sql = "SELECT * FROM fortop.job_assignment_new WHERE job_type='組立' AND worker LIKE '%F%' "
                + "ORDER BY worker, start_time";
      let param = {sql: sql};
      this.$http.get('/api/generalQuery', {params: param}).then(res => {
        this.outFactory_asm_jobs = res.data;
      });
    },

    getNotScheduledCA1() {
      var sql = "SELECT *, CONCAT(step, ', ', spec) AS step_spec FROM fortop.job_assignment_new "
                + "WHERE job_type!='組立' AND (exe_time IS NULL OR exe_time<=0) "
                + "ORDER BY due_date";
      let param = {sql: sql};
      this.$http.get('/api/generalQuery', {params: param}).then(res => {
        this.not_sch_ca1_jobs = res.data;
      });
    },

    getNotScheduledAssembly() {
      var sql = "SELECT * FROM fortop.job_assignment_new "
                + "WHERE job_type='組立' AND (exe_time IS NULL OR exe_time<=0) "
                + "ORDER BY due_date";
      let param = {sql: sql};
      this.$http.get('/api/generalQuery', {params: param}).then(res => {
        this.not_sch_asm_jobs = res.data;
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
