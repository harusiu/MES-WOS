<template>
  <div class="animated fadeIn">
    <CTableWrapper :items="orders" :fields="fields"></CTableWrapper>
  </div>
</template>

<script>
import CTableWrapper from './Table.vue'

export default {
  name: 'ManOrder',
  components: { CTableWrapper },

  data () {
    return {
      orders: [],

      fields: [
        {key: 'order_id',       label: '製令單',   sortable: true},
        {key: 'customer_info',  label: '客戶',     sortable: true},
        {key: 'product_info',   label: '產品',     sortable: true},
        {key: 'target_qty',     label: '數量',     sortable: true},
        {key: 'open_date',      label: '開單日',   sortable: true},
        {key: 'due_date',       label: '交期',     sortable: true},
      ],
    }
  },

  //mounted() {
  created() {
    this.getManOrder();
  },

  methods: {
    getManOrder() {
      var sql = "SELECT *, CONCAT(customer_name, ' (', customer_id, ')') AS customer_info, \
                    CONCAT(product_name, ' (', product_id, ')') AS product_info FROM mes.man_order \
                    ORDER BY due_date";
      let param = {sql: sql};
      this.$http.post('generalQuery', {data: param}).then(res => {
        this.orders = res.data;
        for (var i=0; i<this.orders.length; i++)
        {
          this.orders[i]['open_date'] = flatpickr.formatDate(new Date(this.orders[i]['open_date']), "Y-m-d");
          this.orders[i]['due_date'] = flatpickr.formatDate(new Date(this.orders[i]['due_date']), "Y-m-d");
        }
      });
    },
  }
}
</script>
