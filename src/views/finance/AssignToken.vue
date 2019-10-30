<template>
  <div class="assign-token">
    <h1 class="title">Finance</h1>

    <el-card class="box-card full">
      <div slot="header" class="clearfix">
        <h3 class="title">Assign token - ABC</h3>
      </div>

      <el-form ref="form" :model="form" label-position="top">
        <el-form-item label="Recipient">
          <el-select v-model="form.recipient">
            <el-option label="Team member" value="1"></el-option>
            <el-option label="Not Team member" value="0"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="form.recipient === '1'" label="Choose member">
          <el-select class="select-user" v-model="form.member" placeholder="Please choose member">
            <el-option
              v-for="member in members"
              :key="member.id"
              :label="member.username"
              :value="member.id"
            >
              <avatar
                style="float: left; margin: 3px 6px 0 0;"
                :path="member.avatar"
                :username="member.username"
              />
              <span style="color: #45588C; font-size: 16px; font-weigh: bold;">{{ member.username }}</span>
              <tag v-for="(t,index) in member.tags" :text="t" :key="index" type="primary" />
              <span style="margin-left: 6px; float: right;">{{ member.eth_address }}</span>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="form.recipient === '0'" label="ETH Address">
          <el-input v-model="form.eth_address"></el-input>
        </el-form-item>

        <el-form-item label="Tags">
          <el-select
            v-model="form.tags"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="Please choose tags"
          >
            <el-option
              v-for="item in tags"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="Amount">
          <el-input v-model="form.amount"></el-input>
        </el-form-item>

        <el-form-item label="Remark">
          <el-input v-model="form.remark"></el-input>
        </el-form-item>

        <el-form-item>
          <cu-button type="primary" round text="Assign"></cu-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { Avatar, Tag, Button as CuButton } from '@/components/Common'
export default {
  components: {
    Avatar,
    Tag,
    CuButton
  },
  data() {
    return {
      form: {
        recipient: '1',
        member: '',
        eth_address: '',
        amount: '',
        remark: '',
        tags: []
      },

      // mock data
      tags: [
        {
          value: 'HTML',
          label: 'HTML'
        },
        {
          value: 'CSS',
          label: 'CSS'
        },
        {
          value: 'JavaScript',
          label: 'JavaScript'
        }
      ],
      members: [
        {
          id: '1',
          avatar: '',
          username: 'Robert Carroll',
          eth_address: '0x4258...47C0',
          tags: ['UI']
        },
        {
          id: '2',
          avatar: '',
          username: 'Robert Carroll 2',
          eth_address: '0x4258...47C0',
          tags: ['FE']
        }
      ]
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/variables.scss';
.assign-token {
  .title {
    color: $menuActiveText;
  }
}
</style>