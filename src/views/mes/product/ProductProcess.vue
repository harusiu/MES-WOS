<template>
  <div class="animated fadeIn">
    <CTableWrapper :items="processes" :fields="fields"></CTableWrapper>
  </div>
</template>

<script>
import CTableWrapper from './Table.vue'

export default {
  name: 'ProductProcess',
  components: { CTableWrapper },

  data () {
    return {
      processes: [],

      fields: [
        {key: 'product_id',         label: '品號',      sortable: true},
        {key: 'product_name',       label: '品名',      sortable: true},
        {key: 'step',               label: '工序',      sortable: true},
        {key: 'prev_step',          label: '前工序',    sortable: true},
        {key: 'next_step',          label: '後工序',    sortable: true},
        {key: 'job_description',    label: '工作描述',       sortable: true},
        {key: 'exe_time',           label: '標準工時 (秒)',  sortable: true},
        {key: 'constrain',          label: '限制條件',       sortable: true},
      ],
    }
  },

  //mounted() {
  created() {
    this.getProductProcess();
  },

  methods: {
    getProductProcess() {
      var sql = "SELECT * FROM mes.product_process ORDER BY product_id, step";
      let param = {sql: sql};
      this.$http.post('generalQuery', {data: param}).then(res => {
        this.processes = res.data;
      });
    },
  }
}
</script>
