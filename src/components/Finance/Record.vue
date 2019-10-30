<template>
  <div class="record">
    <el-card class="box-card full">
      <div slot="header" class="clearfix">
        <h3 class="title">Record</h3>
      </div>

      <div v-if="recordCount > 0" class="record-list-container">
        <ul class="record-list">
          <li v-for="record in records" :key="record.id">
            <div v-if="record.user" class="record-obj">
              <avatar />
              <div class="record-user-info">
                <span class="record-name">
                  {{ record.user.username}}
                  <tag v-for="(tag, i) in record.user.tags" :key="i" :text="tag" type="primary" />
                </span>
                <span v-for="(tag, i) in record.tags" :key="i" class="record-type">{{tag}}</span>
              </div>
            </div>

            <div v-else class="record-obj-hash">
              <span class="record-hash">{{ record.to}}</span>
              <span v-for="(tag, i) in record.tags" :key="i" class="record-type">{{tag}}</span>
            </div>

            <div class="record-from-to">
              <p>
                From
                <span class="address">{{ record.from }}</span>
              </p>
              <p>
                To
                <span class="address">{{ record.to }}</span>
              </p>
            </div>

            <div class="record-value">
              <span class="value">+{{ record.value }} {{ record.symbol }}</span>

              <span class="datetime">{{ record.datetime }}</span>
            </div>

            <a :href="`https://etherscan.io/tx/${record.hash}`" target="__blank">
              <i class="el-icon-more"></i>
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
  computed: {
    recordCount() {
      return this.records.length
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/variables.scss';

.record {
  .record-list-container {
    overflow: auto;

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
          }
          .record-type {
            color: $secondaryColor;
          }
        }

        .record-from-to {
          display: flex;
          flex-direction: column;
          margin: 0 60px 0 0;

          p {
            margin: 6px 0;
            font-size: 13px;
            line-height: 18px;
            font-weight: bold;
            .address {
              margin-left: 16px;
              font-weight: normal;
              float: right;
            }
          }
        } // end: record-from-to

        .record-value {
          display: flex;
          flex-direction: column;
          margin: 0 60px 0 0;

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