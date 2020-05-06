<template>
  <b-card>
    <!--<div slot="header" v-html="caption"></div>-->
    <b-table :dark="dark" :hover="hover" :striped="striped" :bordered="bordered" :small="small" :fixed="fixed" responsive="sm" :items="items" :fields="captions" :current-page="currentPage" :per-page="perPage"
      :filter="filter">
      <template slot="status" slot-scope="data">
        <b-badge :variant="getBadge(data.item.status)">{{data.item.status}}</b-badge>
      </template>
      
      <template slot="wrapup_state" slot-scope="data">
        <b-button :variant="data.item.state == '已出站' && data.item.wrapup_state == '未撿線' ? 'success' : 'secondary'"
          :disabled="data.item.state == '已出站' && data.item.wrapup_state == '未撿線' ? false : true"
          @click="updateWrapupState(data.item.order_id, data.item.product_id, data.item.step, data.item.spec, '已撿線');
			      data.item.wrapup_state='已撿線'"
          >{{data.item.wrapup_state}}</b-button>
      </template>

      <template slot="show_details" slot-scope="data">
        <b-button variant="primary" size="sm" @click="data.toggleDetails">
          {{ data.detailsShowing ? '-' : '+'}}
        </b-button>
      </template>

      <template slot="row-details" slot-scope="data">
        <table class="col-12" border="1">
          <!--
          <tr>
            <td colspan="3">
              <b-button variant="primary">品號: {{data.item.product_id}}</b-button>
              &emsp;工序: {{data.item.step}}&emsp;檢規: {{data.item.spec}}
            </td>
            <td>
              產量: {{data.item.acc_good}} / {{data.item.target_qty}}
            </td>
            <td rowspan="5" align="center" width="20%">
              <qr-code size="100" :text="'JobID: '+data.item.order_id+'_'+data.item.product_id+'_'+data.item.step+'_'+data.item.spec">
              </qr-code>
            </td>
          </tr>
          -->
          <tr>
            <td colspan="2">線材: {{data.item.wire_id}}</td>
            <td>左端子: {{data.item.ft_left}}</td>
            <td>右端子: {{data.item.ft_right}}</td>
            <td rowspan="5" align="center" width="20%">
              <!--
			  <qr-code size="100" :text="'JobID: '+data.item.order_id+'_'+data.item.product_id+'_'+data.item.step+'_'+data.item.spec">
              </qr-code>
			  -->
            </td>
          </tr>
          <tr>
            <td>顏色</td>
            <td>長度</td>
            <td>剝皮</td>
            <td>穿P</td>
          </tr>
          <tr>
            <td width="20%">{{data.item.wire_color}}</td>
            <td width="20%">{{data.item.wire_length}}</td>
            <td width="20%">{{data.item.peel_left}} / {{data.item.peel_right}}</td>
            <td width="20%">{{data.item.wearp_left}} / {{data.item.wearp_right}}</td>
          </tr>
        </table>
        <div style="text-align: right; width:100%; display: inline-block;">下一站: 工序 {{data.item.next_step}} @ 線別 {{data.item.next_line_id}}</div>
      </template>

    </b-table>
    <nav>
      <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" prev-text="Prev" next-text="Next" hide-goto-end-buttons/>
    </nav>
  </b-card>
</template>

<script>


export default {
  name: 'c-table',
  inheritAttrs: false,
  props: {
    caption: {
      type: String,
      default: 'Table'
    },
    hover: {
      type: Boolean,
      default: false
    },
    striped: {
      type: Boolean,
      default: false
    },
    bordered: {
      type: Boolean,
      default: false
    },
    small: {
      type: Boolean,
      default: false
    },
    fixed: {
      type: Boolean,
      default: false
    },
    tableData: {
      type: [Array, Function],
      default: () => []
    },
    fields: {
      type: [Array, Object],
      default: () => []
    },
    perPage: {
      type: Number,
      default: 20
    },
    dark: {
      type: Boolean,
      default: false
    },
    filter: {
      type: String,
      default: null
    },
  },
  data: () => {
    return {
      currentPage: 1,
    }
  },
  computed: {
    items: function() {
      const items =  this.tableData
      return Array.isArray(items) ? items : items()
    },
    totalRows: function () { return this.getRowCount() },
    captions: function() { return this.fields }
  },
  methods: {
    getBadge (status) {
      return status === 'Active' ? 'success'
        : status === 'Inactive' ? 'secondary'
          : status === 'Pending' ? 'warning'
            : status === 'Banned' ? 'danger' : 'primary'
    },
    
    getRowCount: function () {
      return this.items.length
    },
    
    updateWrapupState: function (order_id, product_id, step, spec, wrapup_state) {
	  console.log("updateWrapupState()"+order_id+product_id+step+spec+wrapup_state);
      let data = {order_id: order_id,
                  product_id: product_id,
                  step: step,
                  spec: spec,
                  wrapup_state: wrapup_state};
      this.$http.post('/api/schedule/updateWrapupState', {data: data});
      //location.reload();
    },
  }
}
</script>
