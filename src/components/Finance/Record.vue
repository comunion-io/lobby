<template>
  <div class="record">
    <el-card class="box-card full">
      <div slot="header" class="clearfix">
        <h3 class="title">Record</h3>
      </div>

      <div v-if="recordCount > 0" class="record-list-container">
        <ul class="record-list">
          <li v-for="record in records" :key="record.id">
            <div class="record-obj">
              <avatar :path="record.receiveUser.logo"/>
              <div class="record-user-info">
                <span class="record-name">
                  {{record.receiveUser.username}}
                  <i class='title' v-if="record.receiveUser.skills">UI</i>
                </span>

                <span
                  class="record-type"
                  >{{record.remark}}</span>
              </div>
            </div>
            <div class="record-from-to">
              <p>
                <span class='address_tip'>From</span> 
                <span class="address">{{ record.sender }}</span>
              </p>
              <p>
                <span class='address_tip'>To</span>  
                <span class="address">{{ record.receiver }}</span>
              </p>
            </div>

            <div class="record-value">
              <span class="value">+{{ record.value }} {{ record.token }}</span>

              <span class="datetime">31/12/2019</span>
            </div>
            
            <a class='knowMore' :href="`https://etherscan.io/tx/${record.txHash}`" target="__blank">
              <a
              class='more'
              >View Transaction</a>
              <i class="el-icon-more"></i>
            </a>
            </a>
            
          </li>
        </ul>

        <el-pagination
          class="cu-pagination"
          background
          layout="prev, pager, next"
          :total="recordCount"
        ></el-pagination>
      </div>

      <h4 v-else class="message">No Record</h4>
    </el-card>
  </div>
</template>

<script>
import { Avatar, Tag } from '@/components/Common'
import { getCurOrgId, setCurOrgId, getUserId } from '@/utils/auth'
import {getOrgRecords} from '@/api/organization'

export default {
  components: {
    Avatar,
    Tag
  },
  data() {
    return {
      records: [
        {
          user: {
            path: '',
            username: 'leec',
            tags: ['UI']
          },
          id: '1',
          tags: ['salary'],
          from: '0x123',
          to: '0x456',
          value: 100,
          symbol: 'ETH',
          datetime: '31/07/19',
          type: 'transfer',
          hash: '888'
        },
        {
          user: null,
          id: '2',
          tags: ['bounty'],
          from: '0x123456',
          to: '0x456789',
          value: 100,
          symbol: 'ETH',
          datetime: '31/07/19',
          type: 'transfer',
          hash: '888'
        }
      ]
    }
  },
  methods: {
    getRecords(orgId) {
      // var orgId = this.orgForm._id
      console.log(orgId)
      getOrgRecords(orgId).then(res => {
        if (!res.err) {
          // console.log('get success')
          // console.log(res)
          this.records=res.entities
          console.log(this.records)
        } else {
          alert(res.msg)
        }
      })
    }
  },
  computed: {
    recordCount() {
      return this.records.length
    }
  },
  created() {
    this.orgInfo = this.orgForm
    this.orgId = getCurOrgId()
    this.getRecords(this.orgId)
  }
}
</script>

<style lang="scss">
@import '@/styles/variables.scss';

.record {
  .record-list-container {
    overflow: auto;

              .useravatar{
            width: 28px;
            height: 28px;
            // border-radius: 100px;
            // vertical-align: middle;
          }

    .record-list {
      color: $titleColor;
      list-style-type: none;
      margin: 0;
      padding: 0;

      li {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        margin: 0;
        padding: 0 6px;

        &:not(:last-child) {
          margin-bottom: 24px;
        }

        .record-obj-hash {
          display: flex;
          flex-direction: column;
          margin: 0 auto 0 36px;

          .record-type {
            color: $secondaryColor;
          }
        }

        .record-obj {
          display: flex;
          align-items: center;
          margin-right: auto;

          .avatar {
            margin-right: 8px;
          }
          .record-user-info {
            display: flex;
            flex-direction: column;
          }

          .record-name {
            margin: 6px 0;
            .title{
              padding:0 10px;
              color: #7B88FF;
              background: #F2F3FF;
              border-radius: 100px;
              font-style: normal;
              font-size: 12px;
              display: inline-block;
              margin-left:10px;
              line-height:18px;
            }
          }
          .record-type {
            color: $secondaryColor;
          }
        }
        .knowMore{
          position: relative;
          padding-left:60px;
          a{
            position: absolute;
            background: #FFFFFF;
            opacity: 0.98;
            /* Dark-6 */
            border: 1px solid rgba(55, 64, 89, 0.05);
            box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.03);
            border-radius: 10px;
            color: rgba(55, 64, 89, 0.7);
            font-size: 14px;
            right: 0px;
            top: 30px;
            min-width: 200px;
            padding: 10px;
            display: none;
            
          }
        }
        .knowMore:hover{
          cursor: pointer;
          a{
            display:block;
          }
        }

        .record-from-to {
          display: flex;
          flex-direction: column;
          margin: 0 60px 0 0;
          flex:1;
          padding-left:60px;

          p {
            margin: 6px 0;
            font-size: 13px;
            line-height: 18px;
            font-weight: bold;
            .address_tip{
              display: inline-block;
              width:60px;
            }
            .address {
              margin-left: 16px;
              font-weight: normal;
            }
          }
        } // end: record-from-to

        .record-value {
          display: flex;
          flex-direction: column;
          .value {
            font-size: 13px;
            line-height: 18px;
            font-weight: bold;
            margin-bottom: 8px;
          }

          .datetime {
            font-size: 12px;
            line-height: 14px;
            color: $secondaryColor;
          }
        }
      }
    } // end: record-list

    .cu-pagination {
      float: right;
    }
  }

  .message {
    display: block;
    margin: 75px auto;
    text-align: center;
    font-size: 18px;
    line-height: 21px;
    font-weight: 400;
    color: $secondaryColor;
  }
}
</style>
