<template>
  <div class="animated fadeIn">
    <CTableWrapper :items="products" :fields="fields"></CTableWrapper>
  </div>
</template>

<script>
import CTableWrapper from './Table.vue'

export default {
  name: 'ProductSpec',
  components: { CTableWrapper },

  data () {
    return {
      products: [],

      fields: [
        {key: 'product_id',     label: '品號',            sortable: true},
        {key: 'product_name',   label: '品名',            sortable: true},
        {key: 'category_id',    label: '產品種類',        sortable: true},
        {key: 'category_name',  label: '產品種類名稱',    sortable: true},
        {key: 'spec',           label: '規格',            sortable: true},
        {key: 'material',       label: '材料',            sortable: true},
      ],
    }
  },

  //mounted() {
  created() {
    this.getProductSpec();
  },

  methods: {
    getProductSpec() {
      var sql = "SELECT * FROM mes.product_spec";
      let param = {sql: sql};
      this.$http.post('generalQuery', {data: param}).then(res => {
        this.products = res.data;
      });
    },
  }
}
</script>
