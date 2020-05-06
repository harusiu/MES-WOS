<template>
  <div class="animated fadeIn">
    <div align="left">
      <b-dropdown size="sm">
        <b-dropdown-form>
          <b-form-group>
            <b-form-radio v-model="job_type" value="自動">CA1自動</b-form-radio>
            <b-form-radio v-model="job_type" value="半自動前加工">CA1半自動前加工</b-form-radio>
            <b-form-radio v-model="job_type" value="半自動">CA1半自動</b-form-radio>
            <!--<b-form-radio v-model="job_type" value="組立">組立</b-form-radio>-->
          </b-form-group>
          <b-dropdown-divider></b-dropdown-divider>
          <b-form-group label="欄數">
            <b-form-radio v-model="nof_columns" value=1>1</b-form-radio>
            <b-form-radio v-model="nof_columns" value=2>2</b-form-radio>
            <b-form-radio v-model="nof_columns" value=3>3</b-form-radio>
            <b-form-radio v-model="nof_columns" value=4>4</b-form-radio>
            <b-form-radio v-model="nof_columns" value=6>6</b-form-radio>
            <b-form-radio v-model="nof_columns" value=12>12</b-form-radio>
          </b-form-group>
          <b-dropdown-divider></b-dropdown-divider>
          <b-form-group label="資料來源">
            <b-form-radio v-model="simulation" value=0>報工</b-form-radio>
            <b-form-radio v-model="simulation" value=1>模擬</b-form-radio>
          </b-form-group>
        </b-dropdown-form>
      </b-dropdown>
    </div>

    <b-row>
      <b-col :class="'col-'+12/nof_columns" v-if="job_type=='自動' && simulation==1" v-for="(item, index) in auto_machines">
        <OEE job_type="自動" :machine_id="item.machine" :simulation=1></OEE>
      </b-col>
      <b-col :class="'col-'+12/nof_columns" v-if="job_type=='自動' && simulation==0" v-for="(item, index) in auto_machines">
        <OEE job_type="自動" :machine_id="item.machine" :simulation=0></OEE>
      </b-col>
      <b-col :class="'col-'+12/nof_columns" v-if="job_type=='半自動前加工' && simulation==1" v-for="(item, index) in presemi_workers">
        <OEE job_type="半自動前加工" :line_id="item.worker" :simulation=1></OEE>
      </b-col>
      <b-col :class="'col-'+12/nof_columns" v-if="job_type=='半自動前加工' && simulation==0" v-for="(item, index) in presemi_workers">
        <OEE job_type="半自動前加工" :line_id="item.worker" :simulation=0></OEE>
      </b-col>
      <b-col :class="'col-'+12/nof_columns" v-if="job_type=='半自動' && simulation==1" v-for="(item, index) in semiauto_machines">
        <OEE job_type="半自動" :machine_id="item.machine" :simulation=1></OEE>
      </b-col>
      <b-col :class="'col-'+12/nof_columns" v-if="job_type=='半自動' && simulation==0" v-for="(item, index) in semiauto_machines">
        <OEE job_type="半自動" :machine_id="item.machine" :simulation=0></OEE>
      </b-col>
      <!--<b-col :class="'col-'+12/nof_columns" v-if="job_type=='組立'" v-for="(item, index) in assembly_lines">
        <OEE job_type="組立" :line_id="item.worker" :simulation="simulation"></OEE>
      </b-col>-->
    </b-row>
  </div>
</template>

<script>
import OEE from './OEE.vue'

export default {
  name: 'Dashboard',

  components: { OEE },

  data () {
    return {
      job_type: '自動',
      nof_columns: 3,
      simulation: 1,

      auto_machines: [],
      presemi_workers: [],
      semiauto_machines: [],
      assembly_lines: [],
    }
  },

  created() {
    var sql = "SELECT DISTINCT machine FROM fortop.job_status WHERE job_type='自動' \
                AND machine!='' AND machine!='-1' AND machine IS NOT NULL \
                ORDER BY machine";
    let param = {sql: sql};
    this.$http.get('/api/generalQuery', {params: param}).then(res => {
      this.auto_machines = res.data;
    });

    sql = "SELECT DISTINCT worker FROM fortop.job_status WHERE job_type='半自動前加工' \
            AND worker!='' AND worker!='-1' AND worker IS NOT NULL \
            ORDER BY worker";
    param = {sql: sql};
    this.$http.get('/api/generalQuery', {params: param}).then(res => {
      this.presemi_workers = res.data;
    });

    sql = "SELECT DISTINCT machine FROM fortop.job_status WHERE job_type='半自動' \
            AND machine!='' AND machine!='-1' AND machine IS NOT NULL \
            ORDER BY machine";
    param = {sql: sql};
    this.$http.get('/api/generalQuery', {params: param}).then(res => {
      this.semiauto_machines = res.data;
    });

    sql = "SELECT DISTINCT worker FROM fortop.job_status WHERE job_type='組立' \
            AND worker!='' AND worker!='-1' AND worker IS NOT NULL \
            ORDER BY worker";
    param = {sql: sql};
    this.$http.get('/api/generalQuery', {params: param}).then(res => {
      this.assembly_lines = res.data;
    });
  },

  methods: {
  }
}
</script>
