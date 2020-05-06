<template>
  <div class="animated fadeIn">
{{computedStatistics}}
    <b-form-input v-model="filter" placeholder="輸入關鍵字搜尋"></b-form-input>
    <!--<b-button type="submit" variant="primary" onclick="window.print()">列印</b-button>-->
    <b-tabs>

      <b-tab :title="'裁線機排程工單列印 (' + autoCutJobs.length + ')'">
        <b-row v-for="(machine, m) in autoCutMachines.filter(machine => machine.equip_id==filter || filter=='')" style="page-break-after: always">

          <b-col cols="12" v-for="(job_k, k) in autoCutJobs.slice(autoCut_startIdx[m], autoCut_startIdx[m] + autoCut_nof_jobs[m])"
                 v-if="k%10==0">

          <b-row>
            <b-col cols="8">
              {{machine.equip_id}}&emsp;
              [時] {{autoCut_exeTime[m]}} mins&emsp;
              [單] {{autoCut_nof_jobs[m]}}&emsp;
              [產] {{autoCut_nof_wires[m]}}&emsp;
              [換線/左/右] {{autoCut_nof_changes[m]}}/0/0 次
            </b-col>
            <b-col cols="4" align="right">
              列印日期: {{new Date().toJSON().slice(0,10).replace(/-/g,'/')}}&emsp;
              頁 {{(k/10)+1}}/{{Math.ceil(autoCut_nof_jobs[m]/10)}}
            </b-col>
          </b-row>
          
          <b-row>
            <b-col cols="6" v-for="(job_kk, kk) in autoCutJobs.slice(autoCut_startIdx[m], autoCut_startIdx[m] + autoCut_nof_jobs[m])"
                            v-if="kk==k || kk==k+5">

              <b-row v-for="(job, j) in autoCutJobs.slice(autoCut_startIdx[m], autoCut_startIdx[m] + autoCut_nof_jobs[m])"
                     v-if="j>=kk && j<kk+5">

                <table width="100%" style="border:2px solid">
                  <tr>
                    <td colspan="4">製令: {{job.order_id}}&emsp;工時: {{job.exe_time}} mins</td>
                    <td align="right">序號: {{j+1}}&emsp;</td>
                  </tr>
                  <tr>
                    <td colspan="5">下一站: 撿線 => 線別 {{job.next_line_id}}</td>
                  </tr>
                  <tr>
                    <td colspan="4">品號: {{job.product_id}}&emsp;產量: {{job.target_qty}}</td>
                    <td rowspan="5" align="center">
                      <qr-code :size=150 :text="'JobID: '+job.order_id+'_'+job.product_id+'_'+job.step+'_'+job.spec">
                      </qr-code>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="4">線材: {{job.wire_id}}</td>
                  </tr>
                  <tr>
                    <td colspan="4">左端子: X</td>
                  </tr>
                  <tr>
                    <td colspan="4">右端子: X</td>
                  </tr>
                  <tr>
                    <td>顏色</td>
                    <td>長度</td>
                    <td>剝皮</td>
                    <td>包P</td>
                  </tr>
                  <tr>
                    <td>{{job.wire_color}}</td>
                    <td>{{job.wire_length}}</td>
                    <td>{{job.peel_left}}/{{job.peel_right}}</td>
                    <td>/</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td colspan="5">穿P: X/X</td>
                  </tr>
                </table>
              </b-row>
              <div v-if="k%10==0" style="page-break-before: always"></div>
              </b-col>
            </b-row>

          
          </b-col>
        </b-row>
      </b-tab>



      <b-tab :title="'自動機台排程工單列印 (' + autoHitJobs.length + ')'">
        <b-row v-for="(machine, m) in autoHitMachines.filter(machine => machine.equip_id==filter || filter=='')" style="page-break-after: always">
          <b-col cols="12" v-for="(job_k, k) in autoHitJobs.slice(autoHit_startIdx[m], autoHit_startIdx[m] + autoHit_nof_jobs[m])"
                           v-if="k%10==0">
            <b-row>
              <b-col cols="8">
                {{machine.equip_id}}&emsp;
                [時] {{autoHit_exeTime[m]}} mins&emsp;
                [單] {{autoHit_nof_jobs[m]}}&emsp;
                [產] {{autoHit_nof_wires[m]}}&emsp;
                [換線/左/右] {{autoHit_nof_wireChanges[m]}}/{{autoHit_nof_leftChanges[m]}}/{{autoHit_nof_rightChanges[m]}} 次
              </b-col>
              <b-col cols="4" align="right">
                列印日期: {{new Date().toJSON().slice(0,10).replace(/-/g,'/')}}&emsp;
                頁 {{(k/10)+1}}/{{Math.ceil(autoHit_nof_jobs[m]/10)}}
              </b-col>
            </b-row>

            <b-row>
              <b-col cols="6" v-for="(job_kk, kk) in autoHitJobs.slice(autoHit_startIdx[m], autoHit_startIdx[m] + autoHit_nof_jobs[m])"
                              v-if="kk==k || kk==k+5">
              <b-row v-for="(job, j) in autoHitJobs.slice(autoHit_startIdx[m], autoHit_startIdx[m] + autoHit_nof_jobs[m])"
                     v-if="j>=kk && j<kk+5">

                <table width="100%" style="border:2px solid">
                  <tr>
                    <td colspan="4">製令: {{job.order_id}}&emsp;工時: {{job.exe_time}} mins</td>
                    <td align="right">序號: {{j+1}}&emsp;</td>
                  </tr>
                  <tr>
                    <td colspan="5">下一站: 撿線 => 線別 {{job.next_line_id}}</td>
                  </tr>
                  <tr>
                    <td colspan="4">品號: {{job.product_id}}&emsp;產量: {{job.target_qty}}</td>
                    <td rowspan="5" align="center">
                      <qr-code :size=150 :text="'JobID: '+job.order_id+'_'+job.product_id+'_'+job.step+'_'+job.spec">
                      </qr-code>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="4">線材: {{job.wire_id}}</td>
                  </tr>
                  <tr>
                    <td colspan="4">左端子: {{job.ft_left}}</td>
                  </tr>
                  <tr>
                    <td colspan="4">右端子: {{job.ft_right}}</td>
                  </tr>
                  <tr>
                    <td>顏色</td>
                    <td>長度</td>
                    <td>剝皮</td>
                    <td>包P</td>
                  </tr>
                  <tr>
                    <td>{{job.wire_color}}</td>
                    <td>{{job.wire_length}}</td>
                    <td>{{job.peel_left}}/{{job.peel_right}}</td>
                    <td>/</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td colspan="5">穿P: X/X</td>
                  </tr>
                </table>
              </b-row>
              <div v-if="k%10==0" style="page-break-before: always"></div>
              </b-col>
            </b-row>

          </b-col>
        </b-row>
      </b-tab>



      <b-tab :title="'半自動前加工排程工單列印 (' + preSemiJobs.length + ')'">
        <b-row>
          <b-col cols="12">
            線別: 001&emsp;
            [時] {{preSemi_exeTime}} mins&emsp;
            [單] {{preSemiJobs.length}}&emsp;
            [產] {{preSemi_nof_wires}}&emsp;
            [換線/左/右] 0/0/0 次&emsp;
            列印日期: {{new Date().toJSON().slice(0,10).replace(/-/g,'/')}}
          </b-col>

          <b-col cols="6" v-for="(job_k, k) in preSemiJobs" v-if="k%5==0">
            <div v-if="k%10==0">&nbsp;</div>
            <div v-if="k%10==5" align="right">頁 {{Math.round((k+1)/10)}}/{{Math.ceil(preSemiJobs.length/10)}}</div>
              <b-row v-for="(job, j) in preSemiJobs" v-if="j>=k && j<k+5">

                <table width="100%" style="border:2px solid">
                  <tr>
                    <td colspan="4">製令: {{job.order_id}}&emsp;工時: {{job.exe_time}} mins</td>
                    <td align="right">序號: {{j+1}}&emsp;</td>
                  </tr>
                  <tr>
                    <td colspan="5">下一站: 撿線 => 線別 {{job.next_line_id}}</td>
                  </tr>
                  <tr>
                    <td colspan="4">品號: {{job.product_id}}&emsp;產量: {{job.target_qty}}</td>
                    <td rowspan="5" align="center">
                      <qr-code :size=150 :text="'JobID: '+job.order_id+'_'+job.product_id+'_'+job.step+'_'+job.spec">
                      </qr-code>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="4">線材: {{job.wire_id}}</td>
                  </tr>
                  <tr>
                    <td colspan="4">左端子: X</td>
                  </tr>
                  <tr>
                    <td colspan="4">右端子: X</td>
                  </tr>
                  <tr>
                    <td>顏色</td>
                    <td>長度</td>
                    <td>剝皮</td>
                    <td>包P</td>
                  </tr>
                  <tr>
                    <td>X</td>
                    <td>X</td>
                    <td>X/X</td>
                    <td>/</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td colspan="5">穿P: {{job.wearp_left}}/{{job.wearp_right}}</td>
                  </tr>
                </table>
              </b-row>
            <div v-if="k%10==0" style="page-break-before: always"></div>
          </b-col>
          
          <b-col cols="6" v-if="(preSemiJobs.length-1)%10<5">
            <div align="right">頁 {{Math.ceil(preSemiJobs.length/10)}}/{{Math.ceil(preSemiJobs.length/10)}}</div>
          </b-col>

        </b-row>
      </b-tab>



      <b-tab :title="'半自動端子機台排程工單列印 (' + semiAutoJobs.length + ')'">
        <b-row v-for="(worker, w) in semiAutoWorkers.filter(worker => worker.worker==filter || filter=='')" style="page-break-after: always">
          <b-col cols="12" v-for="(job_k, k) in semiAutoJobs.slice(semiAuto_startIdx[w], semiAuto_startIdx[w] + semiAuto_nof_jobs[w])"
                           v-if="k%10==0">
            <b-row>
              <b-col cols="8">
                {{worker.worker}}&emsp;
                [時] {{semiAuto_exeTime[w]}} mins&emsp;
                [單] {{semiAuto_nof_jobs[w]}}&emsp;
                [產] {{semiAuto_nof_wires[w]}}&emsp;
                [換線/左/右] {{semiAuto_nof_wireChanges[w]}}/{{semiAuto_nof_leftChanges[w]}}/{{semiAuto_nof_rightChanges[w]}} 次
              </b-col>
              <b-col cols="4" align="right">
                列印日期: {{new Date().toJSON().slice(0,10).replace(/-/g,'/')}}&emsp;
                頁 {{(k/10)+1}}/{{Math.ceil(semiAuto_nof_jobs[w]/10)}}
              </b-col>
            </b-row>

            <b-row>
              <b-col cols="6" v-for="(job_kk, kk) in semiAutoJobs.slice(semiAuto_startIdx[w], semiAuto_startIdx[w] + semiAuto_nof_jobs[w])"
                              v-if="kk==k || kk==k+5">
              <b-row v-for="(job, j) in semiAutoJobs.slice(semiAuto_startIdx[w], semiAuto_startIdx[w] + semiAuto_nof_jobs[w])"
                     v-if="j>=kk && j<kk+5">

                <table width="100%" style="border:2px solid">
                  <tr>
                    <td colspan="4">製令: {{job.order_id}}&emsp;工時: {{job.exe_time}} mins</td>
                    <td align="right">序號: {{j+1}}&emsp;</td>
                  </tr>
                  <tr>
                    <td colspan="5">下一站: 撿線 => 線別 {{job.next_line_id}}</td>
                  </tr>
                  <tr>
                    <td colspan="4">品號: {{job.product_id}}&emsp;產量: {{job.target_qty}}</td>
                    <td rowspan="5" align="center">
                      <qr-code :size=150 :text="'JobID: '+job.order_id+'_'+job.product_id+'_'+job.step+'_'+job.spec">
                      </qr-code>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="4">線材: {{job.wire_id}}</td>
                  </tr>
                  <tr>
                    <td colspan="4">左端子: {{job.ft_left}}</td>
                  </tr>
                  <tr>
                    <td colspan="4">右端子: {{job.ft_right}}</td>
                  </tr>
                  <tr>
                    <td>顏色</td>
                    <td>長度</td>
                    <td>剝皮</td>
                    <td>包P</td>
                  </tr>
                  <tr>
                    <td>{{job.wire_color}}</td>
                    <td>{{job.wire_length}}</td>
                    <td>{{job.peel_left}}/{{job.peel_right}}</td>
                    <td>/</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td colspan="5">穿P: X/X</td>
                  </tr>
                </table>
              </b-row>
              <div v-if="k%10==0" style="page-break-before: always"></div>
              </b-col>
            </b-row>

          </b-col>
        </b-row>
      </b-tab>



      <b-tab :title="'組立排程工單列印 (' + assemblyJobs.length + ')'">
        <b-row v-for="(line, l) in assemblyLines.filter(line => line.worker==filter || filter=='')" style="page-break-after: always">
          <b-col cols="12" v-for="(job_k, k) in assemblyJobs.slice(assembly_startIdx[l], assembly_startIdx[l] + assembly_nof_jobs[l])"
                          v-if="k%10==0">
            <b-row>
              <b-col cols="8">
                線別: {{line.worker}}&emsp;
                [時] {{assembly_exeTime[l]}} mins&emsp;
                [單] {{assembly_nof_jobs[l]}}&emsp;
                [產] {{assembly_nof_wires[l]}}&emsp;
                [換線/左/右] 0/0/0 次&emsp;
              </b-col>
              <b-col cols="4" align="right">
                列印日期: {{new Date().toJSON().slice(0,10).replace(/-/g,'/')}}&emsp;
                頁 {{(k/10)+1}}/{{Math.ceil(assembly_nof_jobs[l]/10)}}
              </b-col>
            </b-row>

            <b-row>
              <b-col cols="6" v-for="(job_kk, kk) in assemblyJobs.slice(assembly_startIdx[l], assembly_startIdx[l] + assembly_nof_jobs[l])"
                              v-if="kk==k || kk==k+5">
              <b-row v-for="(job, j) in assemblyJobs.slice(assembly_startIdx[l], assembly_startIdx[l] + assembly_nof_jobs[l])"
                     v-if="j>=kk && j<kk+5">

                <table width="100%" style="border:2px solid">
                  <tr>
                    <td colspan="4">製令: {{job.order_id}}&emsp;工時: {{job.exe_time}} mins</td>
                    <td align="right">序號: {{j+1}}&emsp;</td>
                  </tr>
                  <tr>
                    <td colspan="5"></td>
                  </tr>
                  <tr>
                    <td colspan="4">品號: {{job.product_id}}&emsp;產量: {{job.target_qty}}</td>
                    <td rowspan="5" align="center">
                      <qr-code :size=150 :text="'JobID: '+job.order_id+'_'+job.product_id+'_'+job.worker+'_X'">
                      </qr-code>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="4">下一站:</td>
                  </tr>
                  <tr>
                    <td colspan="4"></td>
                  </tr>
                  <tr>
                    <td colspan="4"></td>
                  </tr>
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td colspan="5"></td>
                  </tr>
                </table>
              </b-row>
              <div v-if="k%10==0" style="page-break-before: always"></div>
            </b-col>
            </b-row>
          </b-col>
        </b-row>
      </b-tab>


    </b-tabs>
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
      filter: '',

      //裁線機
      autoCutMachines: [],
      autoCutJobs: [],
      autoCut_startIdx: [],
      autoCut_exeTime: [],
      autoCut_nof_jobs: [],
      autoCut_nof_wires: [],
      autoCut_nof_changes: [],

      //自動，非裁線機
      autoHitMachines: [],
      autoHitJobs: [],
      autoHit_startIdx: [],
      autoHit_exeTime: [],
      autoHit_nof_jobs: [],
      autoHit_nof_wires: [],
      autoHit_nof_wireChanges: [],
      autoHit_nof_leftChanges: [],
      autoHit_nof_rightChanges: [],

      //半自動前加工
      preSemiJobs: [],
      preSemi_exeTime: 0,
      //preSemi_nof_jobs: 0,
      preSemi_nof_wires: 0,

      //半自動
      semiAutoWorkers: [],
      semiAutoMachines: [],
      semiAutoJobs: [],
      semiAuto_startIdx: [],
      semiAuto_exeTime: [],
      semiAuto_nof_jobs: [],
      semiAuto_nof_wires: [],
      semiAuto_nof_wireChanges: [],
      semiAuto_nof_leftChanges: [],
      semiAuto_nof_rightChanges: [],

      //組立
      assemblyLines: [],
      assemblyJobs: [],
      assembly_startIdx: [],
      assembly_exeTime: [],
      assembly_nof_jobs: [],
      assembly_nof_wires: [],

    }
  },

  //mounted() {
  created() {
    this.getAutoCutMachines();
    this.getAutoHitMachines();
    this.getSemiAutoMachines();
    this.getSemiAutoWorkers();
    this.getAssemblyLines();

    this.getAutoCutJobs();
    this.getAutoHitJobs();
    this.getPreSemiJobs();
    this.getSemiAutoJobs();
    this.getAssemblyJobs();
  },
  
  computed: {
    computedStatistics () {
      //自動裁線
      var j, m, w;
      var byFoo = {};
      for(m=0; m<this.autoCutMachines.length; m++)
      {
        byFoo[this.autoCutMachines[m].equip_id] = m;
        //時 單 產 換
        this.autoCut_exeTime[m] = 0;
        this.autoCut_nof_jobs[m] = 0;
        this.autoCut_nof_wires[m] = 0;
        this.autoCut_nof_changes[m] = 0;
      }

      for(j=0; j<this.autoCutJobs.length; j++)
      {
        m = byFoo[this.autoCutJobs[j].machine];

        if(j==0 || this.autoCutJobs[j].machine != this.autoCutJobs[j-1].machine)
          this.autoCut_startIdx[m] = j;
          
        this.autoCut_exeTime[m] = this.autoCut_exeTime[m] + this.autoCutJobs[j].exe_time;
        this.autoCut_nof_jobs[m] = this.autoCut_nof_jobs[m] + 1;
        this.autoCut_nof_wires[m] = this.autoCut_nof_wires[m] + this.autoCutJobs[j].target_qty; //TODO...

        if(j>0 && this.autoCutJobs[j].machine == this.autoCutJobs[j-1].machine)
        {
          if(this.autoCutJobs[j].wire_id != this.autoCutJobs[j-1].wire_id ||
             this.autoCutJobs[j].wire_color != this.autoCutJobs[j-1].wire_color)
            this.autoCut_nof_changes[m] = this.autoCut_nof_changes[m] + 1;
        }
      }



      //自動，非裁線
      byFoo = {};
      for(m=0; m<this.autoHitMachines.length; m++)
      {
        byFoo[this.autoHitMachines[m].equip_id] = m;
        //時 單 產 換
        this.autoHit_exeTime[m] = 0;
        this.autoHit_nof_jobs[m] = 0;
        this.autoHit_nof_wires[m] = 0;
        this.autoHit_nof_wireChanges[m] = 0;
        this.autoHit_nof_leftChanges[m] = 0;
        this.autoHit_nof_rightChanges[m] = 0;
      }

      for(j=0; j<this.autoHitJobs.length; j++)
      {
        m = byFoo[this.autoHitJobs[j].machine];

        if(j==0 || this.autoHitJobs[j].machine != this.autoHitJobs[j-1].machine)
          this.autoHit_startIdx[m] = j;
          
        this.autoHit_exeTime[m] = this.autoHit_exeTime[m] + this.autoHitJobs[j].exe_time;
        this.autoHit_nof_jobs[m] = this.autoHit_nof_jobs[m] + 1;
        this.autoHit_nof_wires[m] = this.autoHit_nof_wires[m] + this.autoHitJobs[j].target_qty; //TODO...

        if(j>0 && this.autoHitJobs[j].machine == this.autoHitJobs[j-1].machine)
        {
          if(this.autoHitJobs[j].wire_id != this.autoHitJobs[j-1].wire_id ||
             this.autoHitJobs[j].wire_color != this.autoHitJobs[j-1].wire_color)
            this.autoHit_nof_wireChanges[m] = this.autoHit_nof_wireChanges[m] + 1;
        
          if(this.autoHitJobs[j].ft_left != this.autoHitJobs[j-1].ft_left)
            this.autoHit_nof_leftChanges[m] = this.autoHit_nof_leftChanges[m] + 1;
          
          if(this.autoHitJobs[j].ft_right != this.autoHitJobs[j-1].ft_right)
            this.autoHit_nof_rightChanges[m] = this.autoHit_nof_rightChanges[m] + 1;
        }
      }



      //半自動前加工
      this.preSemi_exeTime = 0;
      this.preSemi_nof_wires = 0;
      for(j=0; j<this.preSemiJobs.length; j++)
      {
        this.preSemi_exeTime = this.preSemi_exeTime + this.preSemiJobs[j].exe_time;
        this.preSemi_nof_wires = this.preSemi_nof_wires + this.preSemiJobs[j].target_qty;   //TODO...
      }



      //半自動
      byFoo = {};
      for(w=0; w<this.semiAutoWorkers.length; w++)
      {
        byFoo[this.semiAutoWorkers[w].worker] = w;
        //時 單 產 換
        this.semiAuto_exeTime[w] = 0;
        this.semiAuto_nof_jobs[w] = 0;
        this.semiAuto_nof_wires[w] = 0;
        this.semiAuto_nof_wireChanges[w] = 0;
        this.semiAuto_nof_leftChanges[w] = 0;
        this.semiAuto_nof_rightChanges[w] = 0;
      }

      for(j=0; j<this.semiAutoJobs.length; j++)
      {
        w = byFoo[this.semiAutoJobs[j].worker];

        if(j==0 || this.semiAutoJobs[j].worker != this.semiAutoJobs[j-1].worker)
          this.semiAuto_startIdx[w] = j;
          
        this.semiAuto_exeTime[w] = this.semiAuto_exeTime[w] + this.semiAutoJobs[j].exe_time;
        this.semiAuto_nof_jobs[w] = this.semiAuto_nof_jobs[w] + 1;
        this.semiAuto_nof_wires[w] = this.semiAuto_nof_wires[w] + this.semiAutoJobs[j].target_qty; //TODO...

        if(j>0 && this.semiAutoJobs[j].worker == this.semiAutoJobs[j-1].worker)
        {
          if(this.semiAutoJobs[j].wire_id != this.semiAutoJobs[j-1].wire_id ||
             this.semiAutoJobs[j].wire_color != this.semiAutoJobs[j-1].wire_color)
            this.semiAuto_nof_wireChanges[w] = this.semiAuto_nof_wireChanges[w] + 1;
        
          if(this.semiAutoJobs[j].ft_left != this.semiAutoJobs[j-1].ft_left)
            this.semiAuto_nof_leftChanges[w] = this.semiAuto_nof_leftChanges[w] + 1;
          
          if(this.semiAutoJobs[j].ft_right != this.semiAutoJobs[j-1].ft_right)
            this.semiAuto_nof_rightChanges[w] = this.semiAuto_nof_rightChanges[w] + 1;
        }
      }



      //組立
      var l;
      byFoo = {};
      for(l=0; l<this.assemblyLines.length; l++)
      {
        byFoo[this.assemblyLines[l].worker] = l;
        //時 單 產 換
        this.assembly_exeTime[l] = 0;
        this.assembly_nof_jobs[l] = 0;
        this.assembly_nof_wires[l] = 0;
      }

      for(j=0; j<this.assemblyJobs.length; j++)
      {
        l = byFoo[this.assemblyJobs[j].worker];

        if(j==0 || this.assemblyJobs[j].worker != this.assemblyJobs[j-1].worker)
          this.assembly_startIdx[l] = j;

        this.assembly_exeTime[l] = this.assembly_exeTime[l] + this.assemblyJobs[j].exe_time;
        this.assembly_nof_jobs[l] = this.assembly_nof_jobs[l] + 1;
        this.assembly_nof_wires[l] = this.assembly_nof_wires[l] + this.assemblyJobs[j].target_qty; //TODO...
      }
      
    },
  },

  methods: {

    getAutoCutMachines() {  //裁線機 (6): AK04...7, AK18, 機318
      var sql = "SELECT * FROM equip_list WHERE line_id='001' AND equip_class LIKE '%裁線機%' \
                 AND equip_id IN (SELECT DISTINCT machine FROM job_assignment) ORDER BY equip_id";
      let param = {sql: sql};
      this.$http.get('/api/statistic/generalQuery', {params: param}).then(res => {
        this.autoCutMachines = res.data;
      });
    },

    getAutoHitMachines() {  //自動裁線端子壓著機 (14)
      var sql = "SELECT * FROM equip_list WHERE line_id='001' AND equip_class LIKE '自動%' ORDER BY equip_id";
      let param = {sql: sql};
      this.$http.get('/api/statistic/generalQuery', {params: param}).then(res => {
        this.autoHitMachines = res.data;
      });
    },

    getSemiAutoMachines() { //半自動機台 (45)
      var sql = "SELECT * FROM equip_list WHERE line_id='001' AND equip_class LIKE '半自動%' ORDER BY equip_id";
      let param = {sql: sql};
      this.$http.get('/api/statistic/generalQuery', {params: param}).then(res => {
        this.semiAutoMachines = res.data;
      });
    },

    getSemiAutoWorkers() {
      var sql = "SELECT DISTINCT worker FROM job_assignment WHERE job_type='半自動' AND worker!='' AND worker!='-1' AND worker IS NOT NULL ORDER BY worker";
      let param = {sql: sql};
      this.$http.get('/api/statistic/generalQuery', {params: param}).then(res => {
        this.semiAutoWorkers = res.data;
      });
    },

    getAssemblyLines() { //組立線別
      var sql = "SELECT DISTINCT worker FROM job_assignment WHERE job_type='組立' AND worker!=-1 AND worker!='' AND worker IS NOT NULL \
                 ORDER BY worker";
      let param = {sql: sql};
      this.$http.get('/api/statistic/generalQuery', {params: param}).then(res => {
        this.assemblyLines = res.data;
      });
    },

    getAutoCutJobs() {
      var sql = "SELECT * FROM job_assignment WHERE job_type='自動' AND machine IN \
                 (SELECT equip_id FROM equip_list WHERE line_id='001' AND equip_class LIKE '%裁線機%') \
                 ORDER BY machine, start_time";
      let param = {sql: sql};
      this.$http.get('/api/statistic/generalQuery', {params: param}).then(res => {
        this.autoCutJobs = res.data;
      });
    },
    
    getAutoHitJobs() {
      var sql = "SELECT * FROM job_assignment WHERE job_type='自動' AND machine IN \
                 (SELECT equip_id FROM equip_list WHERE line_id='001' AND equip_class LIKE '自動%') \
                 ORDER BY machine, start_time";
      let param = {sql: sql};
      this.$http.get('/api/statistic/generalQuery', {params: param}).then(res => {
        this.autoHitJobs = res.data;
      });
    },

    getPreSemiJobs() {
      var sql = "SELECT * FROM job_assignment WHERE job_type='半自動前加工' AND worker!=-1 AND worker!='' AND worker IS NOT NULL \
                 ORDER BY worker, start_time";
      let param = {sql: sql};
      this.$http.get('/api/statistic/generalQuery', {params: param}).then(res => {
        this.preSemiJobs = res.data;
      });
    },
    
    getSemiAutoJobs() {
      var sql = "SELECT * FROM job_assignment WHERE job_type='半自動' AND machine IN \
                 (SELECT equip_id FROM equip_list WHERE line_id='001' AND equip_class LIKE '半自動%') \
                 ORDER BY worker, start_time";
      let param = {sql: sql};
      this.$http.get('/api/statistic/generalQuery', {params: param}).then(res => {
        this.semiAutoJobs = res.data;
      });
    },
    
    getAssemblyJobs() {
      var sql = "SELECT * FROM job_assignment WHERE job_type='組立' AND worker!=-1 AND worker!='' AND worker IS NOT NULL \
                 ORDER BY worker, start_time";
      let param = {sql: sql};
      this.$http.get('/api/statistic/generalQuery', {params: param}).then(res => {
        this.assemblyJobs = res.data;
      });
    },

  }
}
</script>
