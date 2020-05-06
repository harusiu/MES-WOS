<template>
  <div class="animated fadeIn">
    <b-row>
      <!--<b-col xs="12" lg="12">-->
      <b-col lg="12">
        <b-card>
          <b-tabs>

            <b-tab :title="'已逾期，尚未完工 (' + delay_orders.length + '筆)'">
              <b-form-input v-model="filter" placeholder="輸入關鍵字搜尋"></b-form-input>
              <br>
              <c-table :table-data="delay_orders" :fields="delay_fields" :filter="filter"></c-table>
            </b-tab>

            <b-tab :title="'今日到期，尚未完工 (' + due_today_orders.length + '筆)'">
              <b-form-input v-model="filter" placeholder="輸入關鍵字搜尋"></b-form-input>
              <br>
              <c-table :table-data="due_today_orders" :fields="due_today_fields" :filter="filter"></c-table>
            </b-tab>

            <b-tab :title="'明日到期，尚未完工 (' + due_tomorrow_orders.length + '筆)'">
              <b-form-input v-model="filter" placeholder="輸入關鍵字搜尋"></b-form-input>
              <br>
              <c-table :table-data="due_tomorrow_orders" :fields="due_tomorrow_fields" :filter="filter"></c-table>
            </b-tab>
            
            <b-tab :title="'製程資料錯誤 (' + pp_errors.length + '筆)'">
              <b-form-input v-model="filter" placeholder="輸入關鍵字搜尋"></b-form-input>
              <br>
              <c-table :table-data="pp_errors" :fields="pp_fields" :filter="filter"></c-table>
            </b-tab>

            <b-tab :title="'有產品製令歷史記錄，但無對應產品製程 (' + op_errors.length + '筆)'">
              <b-form-input v-model="filter" placeholder="輸入關鍵字搜尋"></b-form-input>
              <br>
              <c-table :table-data="op_errors" :fields="op_fields" :filter="filter"></c-table>
            </b-tab>

          </b-tabs>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>



<script>
import cTable from './Table.vue'

export default {
  name: 'SchErrorMsg',
  components: {cTable},
  data () {
    return {
      filter: null,

      delay_orders: [],
      due_today_orders: [],
      due_tomorrow_orders: [],
      pp_errors: [],
      op_errors: [],

      delay_fields: [
        {key: 'order_id',       label: '製令單別-單號',   sortable: true},
        {key: 'product_id',     label: '品號',            sortable: true},
        {key: 'target_qty',     label: '數量',            sortable: true},
        {key: 'open_date',      label: '開單日',          sortable: true},
        {key: 'due_date',       label: '交期',            sortable: true,
            formatter: value => {return flatpickr.formatDate(new Date(value), "Ymd")}},
        {key: 'customer_info',  label: '客戶',            sortable: true},
      ],
      due_today_fields: [
        {key: 'order_id',       label: '製令單別-單號',   sortable: true},
        {key: 'product_id',     label: '品號',            sortable: true},
        {key: 'target_qty',     label: '數量',            sortable: true},
        {key: 'open_date',      label: '開單日',          sortable: true},
        {key: 'due_date',       label: '交期',            sortable: true,
            formatter: value => {return flatpickr.formatDate(new Date(value), "Ymd")}},
        {key: 'customer_info',  label: '客戶',            sortable: true},
      ],
      due_tomorrow_fields: [
        {key: 'order_id',       label: '製令單別-單號',   sortable: true},
        {key: 'product_id',     label: '品號',            sortable: true},
        {key: 'target_qty',     label: '數量',            sortable: true},
        {key: 'open_date',      label: '開單日',          sortable: true},
        {key: 'due_date',       label: '交期',            sortable: true,
            formatter: value => {return flatpickr.formatDate(new Date(value), "Ymd")}},
        {key: 'customer_info',  label: '客戶',            sortable: true},
      ],
      pp_fields: [
        {key: 'product_id',     label: '品號',        sortable: true},
        {key: 'step',           label: '工序',        sortable: true},
        {key: 'spec',           label: '檢規',        sortable: true},
        {key: 'process_info',   label: '製程',        sortable: true},
        {key: 'line_id',        label: '線別ID',      sortable: true},
        {key: 'job_type',       label: '作業類別',    sortable: true},
        {key: 'error_msg',      label: '錯誤訊息',    sortable: true},
      ],
      op_fields: [
      //{key: 'order_id',       label: '製令單',      sortable: true},
        {key: 'product_id',     label: '品號',        sortable: true},
      //{key: 'open_date',      label: '開單日',      sortable: true},
      //{key: 'customer_info',  label: '客戶',        sortable: true},
      ],
    }
  },

  mounted() {
    this.getDelayOrders();
    this.getDueTodayOrders();
    this.getDueTomorrowOrders();
    this.getErrorMsg();
    this.getOrderNoPP();
  },

  methods: {
    getDelayOrders() {
      this.$http.get('/api/schedule/getDelayOrders').then(res => {
        this.delay_orders = res.data;
      });
    },
    
    getDueTodayOrders() {
      this.$http.get('/api/schedule/getDueTodayOrders').then(res => {
        this.due_today_orders = res.data;
      });
    },
    
    getDueTomorrowOrders() {
      this.$http.get('/api/schedule/getDueTomorrowOrders').then(res => {
        this.due_tomorrow_orders = res.data;
      });
    },
    
    getErrorMsg() {
      this.$http.get('/api/schedule/getErrorMsg').then(res => {
        this.pp_errors = res.data;
      });
    },
    
    getOrderNoPP() {
      this.$http.get('/api/schedule/getOrderNoPP').then(res => {
        this.op_errors = res.data;
      });
    },
  }
}
</script>
