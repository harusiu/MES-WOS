<template>
  <div class="animated fadeIn">
    <b-form-input v-model="filter" placeholder="輸入關鍵字搜尋"></b-form-input>
      <br>
    <c-table :table-data="orders" :fields="order_fields" :filter="filter"></c-table>
  </div>
</template>



<script>
import cTable from './Table.vue'

export default {
  name: 'SchOrder',
  components: {cTable},

  data () {
    return {
      filter: null,
      orders: [],
      order_fields: [
        {key: 'order_id',       label: '製令單',               sortable: true},
        {key: 'product_id',     label: '品號',                 sortable: true},
        {key: 'target_qty',     label: '數量',                 sortable: true},
        {key: 'open_date',      label: '開單日',               sortable: true},
        {key: 'due_date',       label: '交期',                 sortable: true,
            formatter: value => {return flatpickr.formatDate(new Date(value), "Ymd")}},
        {key: 'customer_name',  label: '客戶',                 sortable: true},
      ],
    }
  },

  created() {
  //mounted() {

    this.getOrders();
  },

  methods: {
    getOrders() {
      var sql = "SELECT DISTINCT order_id, product_id, target_qty, open_date, due_date, \
                    customer_name \
                    FROM job_status \
                    WHERE due_date<=ADDDATE(CURRENT_DATE, INTERVAL 12 DAY) \
                    AND target_qty>0 AND (mocta_state!='y' OR mocta_state!='Y') \
                    ORDER BY due_date";
      let param = {sql: sql};
      this.$http.get('/api/generalQuery', {params: param}).then(res => {
        this.orders = res.data;
      });
    },
  }
}
</script>
